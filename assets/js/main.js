// defer 让脚本在 HTML 解析后执行，不需要等待所有资源加载。
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
}

// 只有脚本可用时才折叠菜单，保证无 JavaScript 时导航仍可访问。
document.documentElement.classList.add('js');
menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  navigation.classList.toggle('is-open', !isOpen);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.header')) closeMenu();
});
// Tab 离开导航后关闭浮层，避免菜单遮挡已获得焦点的正文。
document.addEventListener('focusin', event => {
  if (!event.target.closest('.header')) closeMenu();
});
window.matchMedia('(min-width: 761px)').addEventListener('change', closeMenu);

// data-* 保存分类；hidden 使隐藏项目也退出键盘和屏幕阅读器的浏览顺序。
const filterButtons = document.querySelectorAll('[data-filter]');
const projectCards = document.querySelectorAll('[data-category]');
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const category = button.dataset.filter;
    filterButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    let visibleCount = 0;
    projectCards.forEach(card => {
      card.hidden = category !== 'all' && card.dataset.category !== category;
      if (!card.hidden) visibleCount += 1;
    });
    document.querySelector('#filter-status').textContent = `已显示 ${visibleCount} 个项目`;
  });
});

const copyButton = document.querySelector('#copy-email');
copyButton.addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  try {
    await navigator.clipboard.writeText(copyButton.dataset.email);
    status.textContent = '邮箱已复制，可以粘贴到邮件应用中。';
  } catch {
    // HTTP 或浏览器权限可能限制复制，失败时提供手动复制提示。
    status.textContent = `暂时无法自动复制，请手动复制：${copyButton.dataset.email}`;
  }
});

document.querySelector('#year').textContent = new Date().getFullYear();

// 内容默认可见。支持观察器且允许动画时，才增强尚未进入视口的内容。
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !reduceMotion.matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('reveal-pending');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });
  // 键盘直接进入尚未淡入的卡片时，立即让焦点及内容可见。
  document.addEventListener('focusin', event => {
    const element = event.target.closest('.reveal-pending');
    if (element) {
      element.classList.remove('reveal-pending');
      observer.unobserve(element);
    }
  });
  document.querySelectorAll('.reveal').forEach(element => {
    if (element.getBoundingClientRect().top > window.innerHeight) {
      element.classList.add('reveal-pending');
      observer.observe(element);
    }
  });
  reduceMotion.addEventListener('change', event => {
    if (event.matches) {
      observer.disconnect();
      document.querySelectorAll('.reveal-pending').forEach(element => element.classList.remove('reveal-pending'));
    }
  });
}
