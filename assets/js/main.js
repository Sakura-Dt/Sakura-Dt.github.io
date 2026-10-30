/* Scroll choreography with a short settling response. No wheel interception or animation library.
   Layout reads are cached on resize/filter; frames update visual properties only. */
(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  document.documentElement.classList.add('js');
  const menu = $('.menu-toggle'), nav = $('#navigation');
  function closeMenu() { menu?.setAttribute('aria-expanded', 'false'); nav?.classList.remove('is-open'); }
  menu?.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('is-open', open); });
  $$('a', nav).forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); } });
  document.addEventListener('click', e => { if (!e.target.closest('.header')) closeMenu(); });
  document.addEventListener('focusin', e => { if (!e.target.closest('.header')) closeMenu(); });
  matchMedia('(min-width:761px)').addEventListener('change', closeMenu);
  $('#copy-email')?.addEventListener('click', async () => {
    const button = $('#copy-email'), status = $('#copy-status');
    try { await navigator.clipboard.writeText(button.dataset.email); status.textContent = '邮箱已复制。可以粘贴到邮件应用中。'; }
    catch { status.textContent = `请手动复制：${button.dataset.email}`; }
  });
  if ($('#year')) $('#year').textContent = new Date().getFullYear();
  if (!$('[data-scene]')) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width:1000px) and (min-height:720px)');
  const phone = matchMedia('(max-width:760px)');
  const motionButton = $('.motion-toggle');
  let manualReduce = false, queued = false, scenes = [], pageTravel = 1, headerHeight = 78, flowOverride = null, overrideScroll = 0;
  const lowPower = navigator.connection?.saveData || navigator.hardwareConcurrency <= 2;
  const clamp = (n, a = 0, b = 1) => Math.min(b, Math.max(a, n));
  const range = (p, a, b) => clamp((p - a) / (b - a));
  const lerp = (a, b, t) => a + (b - a) * t;
  const transform = (el, value) => { if (el) el.style.transform = value; };
  const opening = $('#top'), about = $('#about'), web = $('#web'), python = $('#python');
  const art = $('.opening-art'), form = $('.type-form'), middle = $('.type-middle'), making = $('.type-making');
  const crease = $('.crease-sheet'), creaseInner = $('.crease-inner'), creaseHighlight = $('.crease-highlight'), material = $('.material-word');
  const model = $('.browser-model'), modelLabel = $('.model-label'), cover = $('.cover-word');
  const sheets = $$('.file-sheet'), path = $('.flow-path'), confirmation = $('.confirmation'), targets = $$('.file-target div>span'), steps = $$('[data-step]');
  let moves = [], lastFrame = 0, snapNextFrame = true;
  const orbit = $('.fold-orbit'), seams = $('.fold-seams'), core = $('.fold-core');
  const bladePaths = $$('.blade');
  const transition = $('.fold-transition');
  const modelNav = $('.model-nav b'), viewportLabel = $('.viewport-label');
  const flowState = $('.flow-state'), materialCaption = $('.material-caption');
  const sourceLabels = sheets.map(el => $('small', el));
  // Zero velocity AND acceleration at both ends, with overlapping local phases.
  const ease = t => { t=clamp(t); return t*t*t*(t*(t*6-15)+10); };
  const phase = (p,a,b) => ease(range(p,a,b));

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
    motionButton.textContent = reduced.matches ? '系统已减少动效' : manualReduce ? '恢复动效' : '减少动效';
    $$('[style]', $('main')).forEach(el => el.removeAttribute('style'));
    flowOverride = null;
    snapNextFrame = true;
    // A system-level reduction cannot be overridden by the site switch.
    motionButton.disabled = reduced.matches;
    measure();
    // Preserve an explicit navigation landing if the responsive pin layout changes.
    if (anchorWasAligned && wasPinned !== document.body.classList.contains('motion-full')) {
      hashTarget.scrollIntoView({behavior:'instant'});
    }
  }
  function measure() {
    headerHeight = $('.header').offsetHeight;
    pageTravel = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const full = document.body.classList.contains('motion-full');
    const previousScenes = new Map(scenes.map(s => [s.name,s.rendered]));
    scenes = $$('[data-scene]').filter(el => !el.hidden).map(el => {
      const top = el.getBoundingClientRect().top + scrollY;
      return { el, name: el.dataset.scene, rendered: previousScenes.get(el.dataset.scene), start: full ? top - headerHeight : top - innerHeight * .62,
        travel: full ? el.offsetHeight - $('.stage', el).offsetHeight : Math.max(350, el.offsetHeight - innerHeight * .15) };
    });
    // Destination coordinates are measured without animated transforms.
    const previous = sheets.map(el => el.style.transform);
    sheets.forEach(el => el.style.transform = 'none');
    const dest = $$('.file-target>div');
    moves = sheets.map((el, i) => {
      const a = el.getBoundingClientRect(), b = dest[i].getBoundingClientRect();
      return { x: b.left - a.left - a.width * .15, y: b.top - a.top - a.height * .15 };
    });
    sheets.forEach((el, i) => el.style.transform = previous[i]);
    requestFrame();
  }
  function paintOpening(p) {
    const mobile = phone.matches;
    const open = phase(p,.05,.86), drift = phase(p,.18,1);
    transform(art, `translate3d(${drift*(mobile?4:9)}%,${-drift*4}%,0) rotate(${open*9}deg) scale(${1+open*.055})`);
    // Adjacent faces share vertices: the fold opens instead of spinning as a wheel.
    const initial=[[80,170],[624,70],[714,235],[750,560],[448,740],[160,662]];
    const unfolded=[[90,105],[650,105],[720,310],[710,650],[230,690],[90,460]];
    const vertices=initial.map((v,i)=>v.map((n,j)=>lerp(n,unfolded[i][j],phase(p,.06+i*.025,.7+i*.04))));
    const center=[lerp(400,420,open),lerp(402,380,open)];
    const pt=v=>v.map(n=>n.toFixed(3)).join(' ');
    bladePaths.forEach((el,i)=>el.setAttribute('d',`M${pt(center)} ${pt(vertices[i])} ${pt(vertices[(i+1)%6])}Z`));
    seams.setAttribute('d',vertices.map(v=>`M${pt(center)} ${pt(v)}`).join(''));
    core.setAttribute('cx',center[0]);core.setAttribute('cy',center[1]);
    transform(orbit,`rotate(${-drift*7}deg)`);
    transform(form,`translate3d(${-phase(p,.08,.7)*(mobile?3:6)}%,0,0)`);
    transform(middle,`translate3d(${phase(p,.18,.86)*9}%,0,0)`);
    transform(making,`translate3d(${phase(p,.3,1)*(mobile?2:4)}%,0,0)`);
    transform(transition,`scaleY(${phase(p,.68,1)*12})`);
  }
  function paintAbout(p) {
    const a=[[50,125],[420,35],[555,465],[175,565]], b=[[65,85],[535,85],[535,515],[65,515]];
    const c=a.map((v,i)=>v.map((n,j)=>lerp(n,b[i][j],phase(p,.04+i*.04,.68+i*.08)).toFixed(3)));
    const centerPhase=phase(p,.15,.87);
    const center=[lerp(375,300,centerPhase).toFixed(3),lerp(285,300,centerPhase).toFixed(3)];
    crease.setAttribute('d',`M${c[0]} ${c[1]} ${c[2]} ${c[3]}Z`);
    creaseInner.setAttribute('d',`M${c[0]} ${center} ${c[1]}M${center} ${c[2]}M${center} ${c[3]}`);
    creaseHighlight.setAttribute('d',`M${c[0]} ${center} ${c[3]}Z`);
    const type=phase(p,.12,.8);
    transform(material,`translate3d(${(1-type)*-11}px,${(1-type)*8}px,0) rotate(${(1-type)*-2.5}deg)`);
    transform(materialCaption,`translate3d(0,${(1-phase(p,.3,.94))*-12}px,0)`);
  }
  function paintWeb(p) {
    const reflow=phase(p,.18,.9), level=phase(p,.04,.65);
    const min=phone.matches?60:44;
    model.style.width=`${lerp(82,min,reflow).toFixed(4)}%`;
    transform(model,`rotateY(${lerp(-8,0,level)}deg) rotateZ(${lerp(-2.5,0,level)}deg) translate3d(0,${-Math.sin(reflow*Math.PI)*7}px,0)`);
    transform(cover,`translate3d(${-phase(p,.08,.95)*14}%,0,0)`);
    modelLabel.style.opacity=(1-phase(p,.26,.54)).toFixed(4);
    modelNav.style.opacity=(1-phase(p,.35,.67)).toFixed(4);
    viewportLabel.textContent=p<.38?'DESKTOP / 展开':p<.76?'REFLOW / 重排':'MOBILE / 收拢';
  }
  function paintPython(p) {
    const align=phase(p,.02,.37);
    sheets.forEach((el,i)=>{
      const send=phase(p,.56+i*.045,.88+i*.045), move=moves[i]||{x:0,y:0};
      // Each sheet follows an arc and arrives before the next sheet settles.
      const arc=Math.sin(send*Math.PI)*(phone.matches?-24:-36-i*8);
      const angle=[-18,10,25][i]*(1-align)-Math.sin(send*Math.PI)*(5+i*2);
      transform(el,`translate3d(${(move.x*send).toFixed(3)}px,${(move.y*send+arc).toFixed(3)}px,0) rotate(${angle.toFixed(3)}deg) scale(${lerp(1,.29,send).toFixed(5)})`);
      el.style.opacity=(1-phase(send,.85,1)).toFixed(4);
      sourceLabels[i].style.opacity=align.toFixed(4);
      targets[i].style.opacity=phase(send,.74,1).toFixed(4);
    });
    path.style.strokeDashoffset=String(1200*(1-phase(p,.11,.7)));
    const arrive=phase(p,.32,.49), leave=phase(p,.56,.72);
    confirmation.style.opacity=(arrive*(1-leave)).toFixed(4);
    transform(confirmation,`translate3d(0,${lerp(9,0,arrive)-leave*7}px,0) rotate(${lerp(-7,-2,arrive)}deg) scale(${lerp(.92,1,arrive)})`);
    const step=p<.4?0:p<.65?1:2;
    steps.forEach((el,i)=>el.setAttribute('aria-pressed',String(i===step)));
    flowState.textContent=['01 / PREVIEW','02 / CONFIRM','03 / MOVE & LOG'][step];
  }
  function paint(time) {
    queued=false;
    const enabled=motionAllowed();
    const dt=lastFrame?Math.min(50,time-lastFrame):16.7;
    lastFrame=time;
    // ~75ms response absorbs wheel steps without changing native scrolling.
    const follow=1-Math.exp(-dt/(phone.matches?58:75));
    let moving=false;
    for(const scene of scenes){
      const target=enabled?clamp((scrollY-scene.start)/scene.travel):1;
      let current=scene.rendered;
      if(snapNextFrame||current===undefined||!enabled)current=target;
      else current=lerp(current,target,follow);
      const settled=Math.abs(current-target)<.00012;
      if(settled)current=target;else moving=true;
      scene.rendered=current;
      if(scene.name==='opening')paintOpening(enabled?current:0);
      if(scene.name==='about')paintAbout(current);
      if(scene.name==='web')paintWeb(enabled?current:0);
      if(scene.name==='python'){
        // Step selections share the follow controller, never jump the file artwork.
        const wanted=flowOverride??target;
        if(flowOverride!==null){
          current=(snapNextFrame||!enabled)?wanted:lerp(scene.flowRendered??scene.rendered,wanted,follow);
          const flowSettled=Math.abs(current-wanted)<.00012;
          if(flowSettled)current=wanted;else moving=true;
          scene.flowRendered=current;
          scene.el.dataset.settled=String(flowSettled);
        }else{scene.flowRendered=current;scene.el.dataset.settled=String(settled);}
        paintPython(current);
      }else scene.el.dataset.settled=String(settled);
      scene.el.dataset.progress=target.toFixed(4);
      scene.el.dataset.renderProgress=current.toFixed(6);
    }
    snapNextFrame=false;
    transform($('.reading-progress>span'),`scaleX(${clamp(scrollY/pageTravel)})`);
    if(moving)requestFrame();else lastFrame=0;
  }
  function requestFrame(){if(!queued){queued=true;requestAnimationFrame(paint);}}
  addEventListener('scroll',()=>{
    if(flowOverride!==null&&Math.abs(scrollY-overrideScroll)>2)flowOverride=null;
    requestFrame();
  },{passive:true});
  let resizeTimer;
  addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(configure,120);});
  reduced.addEventListener('change',configure);
  motionButton.addEventListener('click',()=>{manualReduce=!manualReduce;configure();});
  steps.forEach((button,i)=>button.addEventListener('click',()=>{
    const p=[.08,.53,1][i], scene=scenes.find(s=>s.name==='python');
    if(document.body.classList.contains('motion-full') && motionAllowed() && scene) {
      scrollTo({top:scene.start+scene.travel*p,behavior:'smooth'});
      flowOverride=null;requestFrame();return;
    }
    flowOverride=p;overrideScroll=scrollY;requestFrame();
  }));
  $$('[data-filter]').forEach(button => button.addEventListener('click',()=>{
    const category=button.dataset.filter;
    $$('[data-filter]').forEach(el=>el.setAttribute('aria-pressed',String(el===button)));
    let count=0;
    $$('[data-category]').forEach(el=>{el.hidden=category!=='all'&&category!==el.dataset.category;if(!el.hidden)count++;});
    $('#filter-status').textContent=`已显示 ${count} 个项目`;
    measure();
  }));
  $$('.learning-record').forEach(el=>el.addEventListener('toggle',measure));
  configure();
  document.fonts?.ready.then(measure);
  addEventListener('load',()=>{
    measure();
    if (location.hash) { const target=document.getElementById(decodeURIComponent(location.hash.slice(1))); target?.scrollIntoView(); }
  });
})();
