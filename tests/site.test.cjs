// 真实浏览器回归测试。服务器使用随机空闲端口，无需先手动启动网站。
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('playwright');
const { default: AxeBuilder } = require('@axe-core/playwright');

const root = path.resolve(__dirname, '..');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml' };
let server, browser, baseURL;

before(async () => {
  server = http.createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      const filename = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
      if (!filename.startsWith(root + path.sep)) {
        response.writeHead(403).end();
        return;
      }
      const body = await fs.readFile(filename);
      response.writeHead(200, { 'Content-Type': types[path.extname(filename)] || 'application/octet-stream' });
      response.end(body);
    } catch {
      response.writeHead(404).end();
    }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  baseURL = `http://127.0.0.1:${server.address().port}`;
  // CI 使用 Playwright 自带 Chromium；本地可选用已安装的兼容浏览器。
  browser = await chromium.launch({ headless: true, channel: process.env.TEST_BROWSER_CHANNEL || undefined });
});

after(async () => {
  if (browser) await browser.close();
  if (server) await new Promise(resolve => server.close(resolve));
});

test('页面和资源加载成功，手机与电脑没有横向溢出', async () => {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => {
    if (response.url().startsWith(baseURL) && response.status() >= 400) errors.push(response.url());
  });
  try {
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('h1').evaluate(element => getComputedStyle(element).animationName), 'none');
    assert.equal(await page.locator('.reveal-pending').count(), 0);
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 844 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `横向溢出：${width}px`);
    }
    assert.deepEqual(errors, []);
  } finally { await page.close(); }
});

test('触控菜单可开关，跳转后标题不被导航遮挡', async () => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' });
  const page = await context.newPage();
  try {
    await page.goto(baseURL);
    const menu = page.locator('.menu-toggle');
    const top = await page.locator('.hero').evaluate(element => element.getBoundingClientRect().top);
    await menu.tap();
    assert.equal(await menu.getAttribute('aria-expanded'), 'true');
    assert.equal(await page.locator('.hero').evaluate(element => element.getBoundingClientRect().top), top);
    await page.keyboard.press('Escape');
    assert.equal(await menu.getAttribute('aria-expanded'), 'false');
    await menu.tap();
    await page.locator('nav a[href="#projects"]').tap();
    assert.equal(await menu.getAttribute('aria-expanded'), 'false');
    const sectionTop = await page.locator('#projects').evaluate(element => element.getBoundingClientRect().top);
    const headerBottom = await page.locator('.header').evaluate(element => element.getBoundingClientRect().bottom);
    assert.ok(sectionTop >= headerBottom, '项目标题被固定导航遮挡');
  } finally { await context.close(); }
});

test('每个项目筛选项与详情展开均可用', async () => {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  try {
    await page.goto(baseURL);
    for (const button of await page.locator('[data-filter]').all()) {
      const category = await button.getAttribute('data-filter');
      const cards = page.locator('.project-card');
      const expected = category === 'all' ? await cards.count() : await page.locator(`.project-card[data-category="${category}"]`).count();
      assert.ok(expected > 0, `空分类：${category}`);
      await button.click();
      assert.equal(await page.locator('.project-card:visible').count(), expected);
      assert.equal(await page.locator('[data-filter][aria-pressed="true"]').count(), 1);
      assert.equal(await button.getAttribute('aria-pressed'), 'true');
    }
    await page.locator('[data-filter="all"]').click();
    for (const detail of await page.locator('.project-card details').all()) {
      await detail.locator('summary').click();
      assert.equal(await detail.evaluate(element => element.open), true);
    }
  } finally { await page.close(); }
});

test('邮箱复制成功与权限被拒绝时都有反馈', async () => {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  try {
    // 模拟浏览器接口，避免依赖操作系统的剪贴板权限。
    await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: async value => { window.copiedEmail = value; } }, configurable: true
    }));
    await page.goto(baseURL);
    await page.locator('#copy-email').click();
    assert.equal(await page.evaluate(() => window.copiedEmail), await page.locator('#copy-email').getAttribute('data-email'));
    await page.getByRole('status').filter({ hasText: '邮箱已复制' }).waitFor();
    await page.evaluate(() => { navigator.clipboard.writeText = async () => { throw new Error('denied'); }; });
    await page.locator('#copy-email').click();
    await page.getByRole('status').filter({ hasText: '请手动复制' }).waitFor();
  } finally { await page.close(); }
});

test('禁用 JavaScript 后仍能阅读项目、使用导航和展开详情', async () => {
  const page = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 320, height: 844 } });
  try {
    await page.goto(baseURL);
    assert.equal(await page.locator('nav').isVisible(), true);
    assert.equal(await page.locator('.project-card:visible').count(), await page.locator('.project-card').count());
    await page.locator('.project-card summary').first().click();
    assert.equal(await page.locator('.project-card details').first().getAttribute('open'), '');
  } finally { await page.close(); }
});

test('三个页面的无障碍扫描、资源预算和详情导航', async () => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  try {
    for (const route of ['/', '/portfolio.html', '/organizer.html']) {
      await page.goto(baseURL + route, { waitUntil: 'networkidle' });
      assert.equal(await page.locator('h1').count(), 1);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      assert.deepEqual(results.violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => node.target) })), [], route);
      const budget = await page.evaluate(() => {
        const resources = performance.getEntriesByType('resource');
        const navigation = performance.getEntriesByType('navigation')[0];
        return { bytes: navigation.decodedBodySize + resources.reduce((sum, item) => sum + item.decodedBodySize, 0),
          external: resources.filter(item => new URL(item.name).origin !== location.origin).map(item => item.name) };
      });
      assert.ok(budget.bytes < 150 * 1024, `${route}: 资源体积 ${budget.bytes} 超过 150 KiB`);
      assert.deepEqual(budget.external, [], '页面不应依赖外部资源');
      console.log(`${route}: ${budget.bytes} bytes, axe violations: 0`);
      for (const width of [320, 390, 1440]) {
        await page.setViewportSize({ width, height: 844 });
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, route);
      }
      // Tab 后第一项应是跳转到正文的链接。
      await page.goto(baseURL + route);
      await page.keyboard.press('Tab');
      assert.equal(await page.locator('.skip-link').evaluate(element => element === document.activeElement), true);
      await page.keyboard.press('Enter');
      assert.equal(new URL(page.url()).hash, '#main');
    }
    await page.goto(baseURL);
    await page.locator('a[href="./portfolio.html"]').click();
    assert.equal(new URL(page.url()).pathname, '/portfolio.html');
    await page.getByRole('link', { name: '返回项目列表', exact: false }).first().click();
    assert.equal(new URL(page.url()).hash, '#projects');
  } finally { await context.close(); }
});
