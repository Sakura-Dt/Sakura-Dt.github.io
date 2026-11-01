/* Scroll choreography with a short settling response. No wheel interception or animation library.
   Layout reads are cached on resize/filter; frames update visual properties only. */
(() => {
  'use strict';
const copy=window.SAKURA_COPY,M=window.SAKURA_MOTION;
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  document.documentElement.classList.add('js');
  const menu = $('.menu-toggle'), nav = $('#navigation');
  function closeMenu() { menu?.setAttribute('aria-expanded', 'false'); nav?.classList.remove('is-open'); }
  M.on(menu,'click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('is-open', open); });
  $$('a', nav).forEach(a => M.on(a,'click', closeMenu));
  M.on(document,'keydown', e => { if (e.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); } });
  M.on(document,'click', e => { if (!e.target.closest('.header')) closeMenu(); });
  M.on(document,'focusin', e => { if (!e.target.closest('.header')) closeMenu(); });
  M.on(matchMedia('(min-width:761px)'),'change', closeMenu);
  if($('#copy-email'))M.on($('#copy-email'),'click', async () => {
    const button = $('#copy-email'), status = $('#copy-status');
    try { await navigator.clipboard.writeText(button.dataset.email); status.textContent = copy.copy_success; }
    catch { status.textContent = copy.copy_denied.replace('{email}',button.dataset.email); }
  });
  if ($('#year')) $('#year').textContent = new Date().getFullYear();
  if (!$('.intro')) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width:1000px) and (min-height:720px)');
  const motionButton = $('.motion-toggle');
  let manualReduce = false, queued = false, pageTravel = 1;
  const lowPower = navigator.connection?.saveData || navigator.hardwareConcurrency <= 2;
  const clamp = (n, a = 0, b = 1) => Math.min(b, Math.max(a, n));
  const transform = (el,value) => {if(el)el.style.transform=value;};
  function motionAllowed() { return !reduced.matches && !manualReduce; }
  function configure() {
    const wasPinned = document.body.classList.contains('motion-full');
    const hashTarget = location.hash ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
    const anchorTop = hashTarget?.getBoundingClientRect().top;
    const anchorWasAligned = hashTarget && Math.abs(anchorTop - $('.header').offsetHeight) < 30;
    const enabled = motionAllowed();
    document.body.classList.toggle('motion-full', enabled && desktop.matches && !lowPower);
    document.body.classList.toggle('motion-mobile', enabled && (!desktop.matches || lowPower));
    document.body.classList.toggle('motion-reduced', !enabled);
    motionButton.setAttribute('aria-pressed', String(manualReduce || reduced.matches));
    motionButton.textContent = reduced.matches ? copy.motion_system : manualReduce ? copy.motion_resume : copy.motion_reduce;
    // A system-level reduction cannot be overridden by the site switch.
    motionButton.disabled = reduced.matches;
    M.invalidate();
    measure();
    // Preserve an explicit navigation landing if the responsive pin layout changes.
    if (anchorWasAligned && wasPinned !== document.body.classList.contains('motion-full')) {
      hashTarget.scrollIntoView({behavior:'instant'});
    }
  }
  function measure() {
    pageTravel = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    requestFrame();
  }
  function paint() {
    queued=false;
    transform($('.reading-progress>span'),`scaleX(${clamp(scrollY/pageTravel)})`);
  }
  function requestFrame(){if(!queued){queued=true;M.frame('reading-progress',paint);}}
  M.watchScroll(requestFrame);
  M.onLayout(measure);
  M.onResize(configure);
  M.on(reduced,'change',configure);
  M.on(motionButton,'click',()=>{manualReduce=!manualReduce;configure();});
  $$('[data-filter]').forEach(button => M.on(button,'click',()=>{
    const category=button.dataset.filter;
    $$('[data-filter]').forEach(el=>el.setAttribute('aria-pressed',String(el===button)));
    let count=0;
    $$('[data-category]').forEach(el=>{el.hidden=category!=='all'&&category!==el.dataset.category;if(!el.hidden)count++;});
    $('#filter-status').textContent=copy.filter_status.replace('{count}',count);
    $('.seam-projects')?.toggleAttribute('hidden',category!=='all');
    M.invalidate();
  }));
  $$('.learning-record').forEach(el=>M.on(el,'toggle',M.invalidate));
  configure();

  M.on(window,'load',()=>{
    measure();
    if (location.hash) { const target=document.getElementById(decodeURIComponent(location.hash.slice(1))); target?.scrollIntoView(); }
  });
})();
