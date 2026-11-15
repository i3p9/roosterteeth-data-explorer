const { chromium } = require('/tmp/rt-browser-audit/node_modules/playwright');
const fs = require('node:fs');
const path = require('node:path');
const out = '/Users/fahim/playground/browse-rt/browser-audit';
fs.mkdirSync(out, { recursive: true });
const profiles = [
  { name: 'desktop', viewport: { width: 1440, height: 900 }, mobile: false },
  { name: 'mobile', viewport: { width: 390, height: 844 }, mobile: true },
];
const routes = [
  { name: 'home', url: 'https://rtarchive.xyz/' },
  { name: 'show', url: 'https://rtarchive.xyz/show/rt-podcast' },
  { name: 'watch', url: 'https://rtarchive.xyz/watch/bens-april-fools-hard-news' },
];
function instrumentation() {
  window.audit = { lcp: [], shifts: [], tasks: [], events: [], milestones: {}, media: [] };
  const observe = (type, fn) => { try { new PerformanceObserver(l => l.getEntries().forEach(fn)).observe({type, buffered: true}); } catch {} };
  observe('largest-contentful-paint', e => window.audit.lcp.push({time:e.startTime,size:e.size,tag:e.element?.tagName,url:e.url,text:e.element?.textContent?.slice(0,100)}));
  observe('layout-shift', e => {if(!e.hadRecentInput) window.audit.shifts.push({time:e.startTime,value:e.value});});
  observe('longtask', e => window.audit.tasks.push({time:e.startTime,duration:e.duration}));
  observe('event', e => window.audit.events.push({name:e.name,time:e.startTime,duration:e.duration}));
  const visible = el => {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0 || r.bottom <= 0 || r.top >= innerHeight) return false;
    for(let x=el;x;x=x.parentElement){const s=getComputedStyle(x);if(s.display==='none'||s.visibility==='hidden'||Number(s.opacity)<0.95)return false;}
    return true;
  };
  const interval = setInterval(() => {
    const mark = (name, condition) => {if(condition && window.audit.milestones[name]===undefined)window.audit.milestones[name]=performance.now();};
    mark('filterVisible', visible(document.querySelector('#search-bar')));
    mark('showCardVisible', [...document.querySelectorAll('a[href^="/show/"]')].some(visible));
    mark('episodeCardVisible', [...document.querySelectorAll('a[href^="/watch/"] h1')].some(visible));
    mark('catalogImageVisible', [...document.images].some(i=>/cdn\.rtarchive\.xyz/.test(i.currentSrc)&&i.complete&&i.naturalWidth>0&&visible(i)));
    mark('videoElementVisible',visible(document.querySelector('video')));
    for(const v of document.querySelectorAll('video'))if(!v.dataset.auditAttached){v.dataset.auditAttached='1';for(const event of ['loadedmetadata','loadeddata','canplay','playing','waiting','error'])v.addEventListener(event,()=>{window.audit.media.push({event,time:performance.now(),readyState:v.readyState,error:v.error?.code});if(event==='playing')v.pause();});}
    if(performance.now()>30000)clearInterval(interval);
  }, 50);
}
async function capture(browser, profile, route) {
  const context = await browser.newContext({viewport:profile.viewport,isMobile:profile.mobile,deviceScaleFactor:profile.mobile?2:1,hasTouch:profile.mobile,serviceWorkers:'block'});
  await context.addInitScript(instrumentation);
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.enable');
  if(profile.mobile){
    await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:93750});
    await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
  }
  for(const visit of ['cold','warm']){
    const name = `${profile.name}-${route.name}-${visit}`;
    const requests = new Map(), responses = [], failures = [], errors = [];
    const onRequest = r => requests.set(r,{url:r.url(),type:r.resourceType(),method:r.method(),began:Date.now()});
    const onResponse = async r => {const req=r.request();responses.push({url:r.url(),status:r.status(),type:req.resourceType(),timing:req.timing(),headers:r.headers()});};
    const onFinished = async r => {const d=requests.get(r);if(d){d.finished=Date.now();d.timing=r.timing();try{d.sizes=await r.sizes();}catch{}}};
    const onFailure = r => failures.push({url:r.url(),type:r.resourceType(),error:r.failure()});
    const onError = e => errors.push(e.message);
    page.on('request',onRequest);page.on('response',onResponse);page.on('requestfinished',onFinished);page.on('requestfailed',onFailure);page.on('pageerror',onError);
    await context.tracing.start({screenshots:true,snapshots:true,sources:false});
    await cdp.send('Tracing.start',{categories:'devtools.timeline,blink.user_timing,loading,disabled-by-default-devtools.timeline',transferMode:'ReturnAsStream'});
    const start=Date.now();
    let navigationError;
    try{await page.goto(route.url,{waitUntil:'domcontentloaded',timeout:45000});}catch(e){navigationError=e.message;}
    await page.waitForTimeout(profile.mobile?18000:10000);
    const data=await page.evaluate(()=>({url:location.href,title:document.title,metrics:window.audit,navigation:performance.getEntriesByType('navigation').map(x=>x.toJSON()),paint:performance.getEntriesByType('paint').map(x=>x.toJSON()),resources:performance.getEntriesByType('resource').map(x=>x.toJSON()),dom:{elements:document.querySelectorAll('*').length,images:document.images.length,loadedImages:[...document.images].filter(x=>x.complete&&x.naturalWidth>0).length,showLinks:document.querySelectorAll('a[href^="/show/"]').length,watchLinks:document.querySelectorAll('a[href^="/watch/"]').length,video:document.querySelector('video')?{src:document.querySelector('video').currentSrc,readyState:document.querySelector('video').readyState,paused:document.querySelector('video').paused}:null},text:document.body.innerText.slice(0,1200)}));
    await page.screenshot({path:path.join(out,`${name}.png`)});
    const complete=new Promise(resolve=>cdp.once('Tracing.tracingComplete',resolve));
    await cdp.send('Tracing.end');const {stream}=await complete;let trace='';for(;;){const chunk=await cdp.send('IO.read',{handle:stream});trace+=chunk.base64Encoded?Buffer.from(chunk.data,'base64').toString():chunk.data;if(chunk.eof)break;}await cdp.send('IO.close',{handle:stream});fs.writeFileSync(path.join(out,`${name}.chrome-trace.json`),trace);
    await context.tracing.stop({path:path.join(out,`${name}.playwright.zip`)});
    const all={name,profile,route,observationMs:Date.now()-start,navigationError,...data,requests:[...requests.values()],responses,failures,errors};
    fs.writeFileSync(path.join(out,`${name}.json`),JSON.stringify(all,null,2));
    const traceEvents=JSON.parse(trace).traceEvents;
    const completedEncodedBytes=traceEvents.filter(e=>e.name==='ResourceFinish').reduce((sum,e)=>sum+Math.max(0,e.args.data.encodedDataLength||0),0);
    const nav=data.navigation[0]||{};const reqs=all.requests;const summary={name,ttfb:Math.round(nav.responseStart),fcp:Math.round(data.paint.find(x=>x.name==='first-contentful-paint')?.startTime||0),lcp:Math.round(data.metrics.lcp.at(-1)?.time||0),milestones:Object.fromEntries(Object.entries(data.metrics.milestones).map(([k,v])=>[k,Math.round(v)])),observedLongTasks:data.metrics.tasks.length,observedLongTaskMs:Math.round(data.metrics.tasks.reduce((s,x)=>s+x.duration,0)),requests:reqs.length,completedEncodedBytes,dom:data.dom,errors:errors.slice(0,3),failures:failures.length,apis:reqs.filter(x=>x.url.includes('/api/')).map(x=>({url:x.url,start:Math.round(x.timing?.startTime-start),end:Math.round((x.timing?.startTime-start)+(x.timing?.responseEnd||0))})),media:data.metrics.media};
    console.log(JSON.stringify(summary));
    page.off('request',onRequest);page.off('response',onResponse);page.off('requestfinished',onFinished);page.off('requestfailed',onFailure);page.off('pageerror',onError);
    await page.goto('about:blank');
  }
  await context.close();
}
(async()=>{
  if (process.argv.includes('--verify-navigation')) {
    await require('./browser-audit/verify-navigation.cjs')();
    return;
  }
  if (process.argv.includes('--verify-player-size')) {
    await require('./browser-audit/verify-player-size.cjs')();
    return;
  }
  if (process.argv.includes('--verify-sidebar')) {
    await require('./browser-audit/verify-sidebar.cjs')();
    return;
  }
  const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--autoplay-policy=user-gesture-required']});
  try{for(const profile of profiles)for(const route of routes)await capture(browser,profile,route);}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
