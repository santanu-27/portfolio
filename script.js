const CATS={video:"Video editing",photo:"Photo editing",design:"Graphic design",cine:"Cinematography"};
const W=[
 {c:"video",t:"Slow Tide",d:"A four-minute travel film cut to ambient sound, with soft transitions and a muted grade.",m:"Premiere Pro, DaVinci Resolve",g:["#9fb2bd","#e3d3c3"]},
 {c:"photo",t:"Morning Portraits",d:"A portrait series retouched to keep skin natural and tones airy.",m:"Lightroom, Photoshop",g:["#d8c6c9","#b5a6ae"]},
 {c:"design",t:"Alder Studio",d:"Brand identity for a small ceramics studio: logo, palette and packaging.",m:"Illustrator, Figma",g:["#c9bfae","#8fa194"]},
 {c:"cine",t:"Quiet Hours",d:"A short film shot on location in natural light, in 2.39:1.",m:"Sony FX3, Resolve",g:["#4d5f66","#c7a58d"]},
 {c:"video",t:"Brand Reel 2026",d:"A 60-second motion and edit reel for a lifestyle label.",m:"After Effects, Premiere Pro",g:["#8fa194","#dfe3dd"]},
 {c:"photo",t:"Dusk Streets",d:"Street photography with a restrained, cool-to-warm color story.",m:"Lightroom",g:["#6f8794","#e1b9a0"]},
 {c:"design",t:"Fold Magazine",d:"Editorial layout and typography for an independent culture zine.",m:"InDesign, Illustrator",g:["#b5a6ae","#ece6e0"]},
 {c:"cine",t:"Salt & Light",d:"Coastal documentary footage, gimbal and slider work, graded for gentle contrast.",m:"Blackmagic, Resolve",g:["#9fb2bd","#5d7480"]}
];
const $=s=>document.querySelector(s);
const grid=$("#grid"),lb=$("#lb");
const art=g=>`background:linear-gradient(135deg,${g[0]},${g[1]})`;
grid.innerHTML=W.map((w,i)=>`<button class="card" data-c="${w.c}" data-i="${i}" aria-label="Open ${w.t}"><div class="art" style="${art(w.g)}"></div>${w.c==="video"||w.c==="cine"?'<span class="play">▶</span>':''}<div class="meta"><h3>${w.t}</h3><small>${CATS[w.c]}</small></div></button>`).join("");
// filters
const F=[["all","All"],...Object.entries(CATS)];
$("#filters").innerHTML=F.map(([k,v],i)=>`<button class="chip${i?'':' on'}" data-f="${k}">${v}</button>`).join("");
function filter(k){
 document.querySelectorAll("#filters .chip").forEach(b=>b.classList.toggle("on",b.dataset.f===k));
 grid.querySelectorAll(".card").forEach(c=>c.classList.toggle("hide",k!=="all"&&c.dataset.c!==k));
}
$("#filters").onclick=e=>{const b=e.target.closest("[data-f]");if(b)filter(b.dataset.f)};
$("#roles").onclick=e=>{const b=e.target.closest("[data-go]");if(!b)return;filter(b.dataset.go);goTo("#work")};
// lightbox
grid.onclick=e=>{const c=e.target.closest(".card");if(!c)return;const w=W[c.dataset.i];
 $("#lbArt").style.cssText=art(w.g);$("#lbCat").textContent=CATS[w.c];$("#lbTitle").textContent=w.t;$("#lbDesc").textContent=w.d;$("#lbMeta").textContent="Made with "+w.m;lb.showModal()};
$("#close").onclick=()=>lb.close();
lb.onclick=e=>{if(e.target===lb)lb.close()};
// grade slider
const gr=$("#grade");gr.querySelector("input").oninput=e=>gr.style.setProperty("--p",e.target.value+"%");
// marquee
const T="Premiere Pro  ✦  DaVinci Resolve  ✦  After Effects  ✦  Photoshop  ✦  Lightroom  ✦  Illustrator  ✦  Figma  ✦  ";
$("#tools").textContent=T.repeat(4);
// theme
const root=document.documentElement;
$("#theme").onclick=()=>{root.dataset.theme=root.dataset.theme==="light"?"dark":"light"};
// mobile menu
const links=$("#links"),bg=$("#burger");
bg.onclick=()=>{const o=links.classList.toggle("open");bg.setAttribute("aria-expanded",o)};
links.onclick=e=>{if(e.target.tagName==="A"){links.classList.remove("open");bg.setAttribute("aria-expanded",false)}};
// glow follows pointer (fine pointers only)
const glow=$("#glow");
if(matchMedia("(pointer:fine)").matches){addEventListener("pointermove",e=>{glow.style.opacity=1;glow.style.left=e.clientX+"px";glow.style.top=e.clientY+"px"})}
// reveal
const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add("in");io.unobserve(x.target)}}),{threshold:.15});
document.querySelectorAll(".reveal").forEach(el=>io.observe(el));
// intro + progress
const intro=$("#intro"),cn=$("#cnt");
(function c(t0){(function s(t){const k=Math.min(1,(t-t0)/1500);cn.textContent=Math.round(k*100);if(k<1)requestAnimationFrame(s)})(t0)})(performance.now());
setTimeout(()=>intro.classList.add("go"),1750);setTimeout(()=>intro.remove(),3000);
// hero slider sweeps in, then rests at centre
let touched=false;gr.style.setProperty("--p","100%");gr.addEventListener("pointerdown",()=>touched=true);
setTimeout(()=>{const t0=performance.now();(function s(t){if(touched)return;const k=Math.min(1,(t-t0)/1700),v=100-50*(1-Math.pow(1-k,3));gr.style.setProperty("--p",v+"%");gr.querySelector("input").value=v;if(k<1)requestAnimationFrame(s)})(t0)},3300);
// project cards rise in one by one
const cio=new IntersectionObserver(es=>es.forEach(x=>{if(!x.isIntersecting)return;const c=x.target;cio.unobserve(c);setTimeout(()=>c.classList.remove("pre"),(+c.dataset.i%4)*120)}),{threshold:.1});
grid.querySelectorAll(".card").forEach(c=>{c.classList.add("pre");cio.observe(c)});
// work section: re-animate cards on filter, spotlight follows pointer
const popIn=()=>grid.querySelectorAll(".card:not(.hide)").forEach((c,i)=>{c.classList.remove("pre","pop");void c.offsetWidth;c.style.animationDelay=i*70+"ms";c.classList.add("pop")});
$("#filters").addEventListener("click",e=>{if(e.target.closest("[data-f]"))popIn()});
$("#roles").addEventListener("click",e=>{if(e.target.closest("[data-go]"))popIn()});
grid.addEventListener("pointermove",e=>{const c=e.target.closest(".card");if(!c)return;const r=c.getBoundingClientRect();c.style.setProperty("--mx",e.clientX-r.left+"px");c.style.setProperty("--my",e.clientY-r.top+"px")});
addEventListener("scroll",()=>{$("#prog").style.transform=`scaleX(${scrollY/(document.documentElement.scrollHeight-innerHeight||1)})`},{passive:true});
// grade presets
const P={Soft:"none",Warm:"sepia(.35) saturate(1.2)",Cool:"hue-rotate(-25deg) saturate(.9)",Faded:"contrast(.85) saturate(.6) brightness(1.08)",Noir:"grayscale(1) contrast(1.25)"};
gr.insertAdjacentHTML("afterend",`<div class="roles" id="presets"><span style="font-size:.85rem;color:var(--mute);align-self:center">Try a grade</span>`+Object.keys(P).map((k,i)=>`<button class="chip${i?'':' on'}" data-p="${k}">${k}</button>`).join("")+`</div>`);
$("#presets").onclick=e=>{const b=e.target.closest("[data-p]");if(!b)return;document.querySelectorAll("#presets .chip").forEach(x=>x.classList.toggle("on",x===b));gr.querySelector(".after").style.filter=P[b.dataset.p]};
// lightbox with prev/next
let li=0;function openW(i){li=(i+W.length)%W.length;const w=W[li];$("#lbArt").style.cssText=art(w.g);$("#lbCat").textContent=CATS[w.c];$("#lbTitle").textContent=w.t;$("#lbDesc").textContent=w.d;$("#lbMeta").textContent="Made with "+w.m;if(!lb.open)lb.showModal()}
grid.onclick=e=>{const c=e.target.closest(".card");if(c)openW(+c.dataset.i)};
$("#prev").onclick=()=>openW(li-1);$("#next").onclick=()=>openW(li+1);
lb.addEventListener("keydown",e=>{if(e.key==="ArrowRight")openW(li+1);if(e.key==="ArrowLeft")openW(li-1)});
// 3D tilt on cards
grid.addEventListener("pointermove",e=>{const c=e.target.closest(".card");if(!c||e.pointerType==="touch")return;const r=c.getBoundingClientRect();c.style.setProperty("--ry",((e.clientX-r.left)/r.width-.5)*10+"deg");c.style.setProperty("--rx",-((e.clientY-r.top)/r.height-.5)*10+"deg")});
grid.addEventListener("pointerout",e=>{const c=e.target.closest(".card");if(c){c.style.setProperty("--rx","0deg");c.style.setProperty("--ry","0deg")}});
// nav motion: hide on scroll down, scroll-spy, burger and theme icons
const hd=$("header");let ly=scrollY;
addEventListener("scroll",()=>{const y=scrollY;hd.classList.toggle("sc",y>30);hd.classList.toggle("hide",y>ly+4&&y>320&&!links.classList.contains("open"));if(Math.abs(y-ly)>4)ly=y},{passive:true});
const spy=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting)document.querySelectorAll(".links a").forEach(a=>a.classList.toggle("on",a.getAttribute("href")==="#"+x.target.id))}),{rootMargin:"-45% 0px -50% 0px"});
["lookbook","work","about","contact"].forEach(id=>spy.observe($("#"+id)));
bg.addEventListener("click",()=>bg.textContent=links.classList.contains("open")?"✕":"≡");
links.addEventListener("click",()=>bg.textContent="≡");
let th=0;$("#theme").addEventListener("click",e=>{th+=180;e.currentTarget.style.rotate=th+"deg"});
// work: image parallax while scrolling
const cards=[...grid.querySelectorAll(".card")];
// editing-suite background: scrubbing timeline, floating edit glyphs
(()=>{const cv=$("#tl"),g=cv.getContext("2d"),tc=$("#tc"),rm=matchMedia("(prefers-reduced-motion:reduce)").matches;
let W,H,dp=1,off=0,spd=40,t=0,lastY=scrollY,last=performance.now(),col="235,233,228",f=0;
const pal=["159,178,189","181,166,174","169,184,172","201,191,174"],pad=n=>String(n).padStart(2,"0");
let s=7;const rnd=()=>(s=s*16807%2147483647)/2147483647;
const mk=(min,max)=>{let x=0;const a=[];for(let i=0;i<30;i++){const gp=rnd()*50+10,w=rnd()*(max-min)+min;a.push({x:x+gp,w,c:pal[Math.floor(rnd()*4)]});x+=gp+w}return{a,T:x}};
const T1=mk(80,260),T2=mk(60,220);
const size=()=>{dp=Math.min(devicePixelRatio||1,2);W=innerWidth;H=cv.getBoundingClientRect().height||210;cv.width=W*dp;cv.height=H*dp;g.setTransform(dp,0,0,dp,0,0)};
size();addEventListener("resize",size);
const rr=(x,y,w,h)=>{g.beginPath();g.roundRect?g.roundRect(x,y,w,h,4):g.rect(x,y,w,h)};
const lane=(tk,y,h,k)=>{for(const c of tk.a){const x0=((c.x-off*k)%tk.T+tk.T)%tk.T;for(const x of[x0,x0-tk.T]){if(x>W||x+c.w<0)continue;g.fillStyle=`rgba(${c.c},.16)`;g.strokeStyle=`rgba(${c.c},.5)`;rr(x,y,c.w,h);g.fill();g.stroke()}}};
function draw(now){const dt=Math.min(.05,(now-last)/1000||0);last=now;if(f++%120===0){const m=getComputedStyle(document.body).color.match(/\d+/g);if(m)col=m.slice(0,3).join(",")}
const dy=scrollY-lastY;lastY=scrollY;spd+=(Math.max(-1400,Math.min(1400,40+dy*45))-spd)*.12;if(rm)spd=0;
off+=spd*dt;t=Math.max(0,t+spd*dt/100);
g.clearRect(0,0,W,H);g.lineWidth=1;g.font="300 10px Manrope,sans-serif";const px=W*.35;
for(let i=Math.floor(off/20);i<=Math.floor(off/20)+W/20+1;i++){const x=i*20-off,big=i%5===0;g.fillStyle=`rgba(${col},${big?.5:.22})`;g.fillRect(x,big?18:24,1,big?12:6);if(i%10===0){const sec=i/5;g.fillText(`${pad(Math.floor(((sec%3600)+3600)%3600/60))}:${pad(((sec%60)+60)%60)}`,x+4,14)}}
lane(T1,44,38,.8);lane(T2,90,38,1);
for(let x=0;x<W;x+=4){const n=Math.floor((x+off)/4),a=(Math.abs(Math.sin(n*.37)*Math.sin(n*.11+1.3))*.7+Math.abs(Math.sin(n*1.7))*.3)*22+2;g.fillStyle=x<px?"rgba(169,184,172,.55)":`rgba(${col},.22)`;g.fillRect(x,170-a,2,a*2)}
g.fillStyle=`rgba(${col},.45)`;g.fillText("V2",10,66);g.fillText("V1",10,112);g.fillText("A1",10,174);
g.fillStyle="rgba(169,184,172,.9)";g.fillRect(px,10,1,H);g.beginPath();g.moveTo(px-6,10);g.lineTo(px+7,10);g.lineTo(px+.5,20);g.fill();
const fr=Math.floor(t*24);tc.textContent=`${pad(Math.floor(fr/86400))}:${pad(Math.floor(fr/1440)%60)}:${pad(Math.floor(fr/24)%60)}:${pad(fr%24)}`;
if(!rm)requestAnimationFrame(draw)}
requestAnimationFrame(draw);
const bits=$(".bits"),ch=["◇","✂","▷","+","◐","◈"];
for(let i=0;i<12;i++){const e=document.createElement("span");e.textContent=ch[i%ch.length];e.style.cssText=`left:${Math.random()*100}%;animation-duration:${16+Math.random()*18}s;animation-delay:-${Math.random()*30}s;font-size:${11+Math.random()*10}px`;bits.append(e)}})();
// living background: drifting constellation that reacts to the pointer, plus scroll parallax
(()=>{const cv=$("#bgc"),g=cv.getContext("2d"),rm=matchMedia("(prefers-reduced-motion:reduce)").matches;let w,h,d1=1,ps=[],mx=-9999,my=-9999,col="235,233,228",f=0;
const size=()=>{d1=Math.min(devicePixelRatio||1,2);w=cv.width=innerWidth*d1;h=cv.height=innerHeight*d1;cv.style.width=innerWidth+"px";cv.style.height=innerHeight+"px";ps=Array.from({length:Math.round(Math.min(34,innerWidth*innerHeight/40000))},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.28*d1,vy:(Math.random()-.5)*.28*d1,r:(Math.random()*1.2+.5)*d1,t:Math.random()*6.28}))};
size();addEventListener("resize",size);addEventListener("pointermove",e=>{mx=e.clientX*d1;my=e.clientY*d1});
const line=(a,b,o)=>{g.strokeStyle=`rgba(${col},${o})`;g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.stroke()};
function draw(){if(f++%90===0){const m=getComputedStyle(document.body).color.match(/\d+/g);if(m)col=m.slice(0,3).join(",")}
g.clearRect(0,0,w,h);g.lineWidth=.7*d1;const L=130*d1,M=190*d1;
for(const p of ps){if(!rm){p.x+=p.vx;p.y+=p.vy;p.t+=.02}if(p.x<0)p.x=w;if(p.x>w)p.x=0;if(p.y<0)p.y=h;if(p.y>h)p.y=0;
const dx=p.x-mx,dy=p.y-my,d=Math.hypot(dx,dy);if(d>0&&d<150*d1&&!rm){p.x+=dx/d*.7*d1;p.y+=dy/d*.7*d1}
g.fillStyle=`rgba(${col},${.2+.12*Math.sin(p.t)})`;g.beginPath();g.arc(p.x,p.y,p.r,0,6.283);g.fill();
if(d<M)line(p,{x:mx,y:my},(1-d/M)*.14)}
for(let i=0;i<ps.length;i++)for(let j=i+1;j<ps.length;j++){const a=ps[i],b=ps[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<L)line(a,b,(1-d/L)*.08)}
if(!rm)requestAnimationFrame(draw)}
draw();
let ticking=false;addEventListener("scroll",()=>{if(ticking)return;ticking=true;requestAnimationFrame(()=>{root.style.setProperty("--sy",scrollY);ticking=false})},{passive:true})})();
addEventListener("scroll",()=>cards.forEach(c=>{const r=c.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;c.style.setProperty("--py",((r.top+r.height/2)/innerHeight-.5)*-30+"px")}),{passive:true});
// background: scroll-driven aurora, cursor grid, particle network
addEventListener("scroll",()=>root.style.setProperty("--sp",scrollY/(document.documentElement.scrollHeight-innerHeight||1)),{passive:true});
const gb=$("#gbg"),cv=$("#fx"),cx=cv.getContext("2d"),still=matchMedia("(prefers-reduced-motion:reduce)").matches;
let w,h,pts=[],mx=-999,my=-999;
function size(){const d=Math.min(devicePixelRatio||1,2);w=innerWidth;h=innerHeight;cv.width=w*d;cv.height=h*d;cx.setTransform(d,0,0,d,0,0);pts=Array.from({length:Math.round(Math.min(70,w*h/18000))},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,r:Math.random()*1.4+.4}))}
size();addEventListener("resize",size);
addEventListener("pointermove",e=>{mx=e.clientX;my=e.clientY;gb.style.setProperty("--gx",mx+"px");gb.style.setProperty("--gy",my+"px")});
function frame(){cx.clearRect(0,0,w,h);const c=root.dataset.theme==="light"?"30,34,36":"200,215,205";
 for(const p of pts){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>h)p.vy*=-1;const dx=p.x-mx,dy=p.y-my,d=Math.hypot(dx,dy);if(d<140&&d>0){p.x+=dx/d*.8;p.y+=dy/d*.8}cx.fillStyle=`rgba(${c},.55)`;cx.beginPath();cx.arc(p.x,p.y,p.r,0,6.283);cx.fill()}
 for(let i=0;i<pts.length;i++){const a=pts[i];for(let j=i+1;j<pts.length;j++){const b=pts[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<120){cx.strokeStyle=`rgba(${c},${.14*(1-d/120)})`;cx.beginPath();cx.moveTo(a.x,a.y);cx.lineTo(b.x,b.y);cx.stroke()}}
  const m=Math.hypot(a.x-mx,a.y-my);if(m<170){cx.strokeStyle=`rgba(${c},${.3*(1-m/170)})`;cx.beginPath();cx.moveTo(a.x,a.y);cx.lineTo(mx,my);cx.stroke()}}
 if(!still)requestAnimationFrame(frame)}
frame();
// magnetic buttons
document.querySelectorAll(".btn,.icon-btn").forEach(b=>{b.addEventListener("pointermove",e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.25}px,${(e.clientY-r.top-r.height/2)*.25}px)`});b.addEventListener("pointerleave",()=>b.style.transform="")});
// count-up stats
const co=new IntersectionObserver(es=>es.forEach(x=>{if(!x.isIntersecting)return;co.unobserve(x.target);const el=x.target,n=+el.dataset.n,t0=performance.now();(function f(t){const k=Math.min(1,(t-t0)/1400);el.textContent=Math.round(n*(1-Math.pow(1-k,3)))+el.dataset.s;if(k<1)requestAnimationFrame(f)})(t0)}));
document.querySelectorAll("[data-n]").forEach(el=>co.observe(el));
// booklet
const sh=[...document.querySelectorAll(".sheet")],book=$("#book");let cur=0;
function setBook(n){cur=Math.max(0,Math.min(sh.length,n));sh.forEach((s,i)=>{const f=i<cur;s.classList.toggle("flip",f);setTimeout(()=>s.style.zIndex=f?i+1:sh.length-i,450)});book.style.transform=cur===0?"translateX(-25%)":cur===sh.length?"translateX(25%)":"none";$("#bc").textContent=cur===0?"Closed":cur===sh.length?"The end":"Spread "+cur+" of "+(sh.length-1)}
sh.forEach((s,i)=>{s.style.zIndex=sh.length-i;s.onclick=()=>setBook(s.classList.contains("flip")?i:i+1)});
$("#bn").onclick=()=>setBook(cur+1);$("#bp").onclick=()=>setBook(cur-1);
book.onkeydown=e=>{if(e.key==="ArrowRight")setBook(cur+1);if(e.key==="ArrowLeft")setBook(cur-1)};
setBook(0);
const bo=new IntersectionObserver(es=>{if(es[0].isIntersecting){bo.disconnect();setTimeout(()=>setBook(1),900)}},{threshold:.6});bo.observe(book);
// smooth scroll (Locomotive) + ScrollTrigger
let loco=null;
function goTo(t){const el=typeof t==="string"?$(t):t;if(!el)return;loco?loco.scrollTo(el,{offset:-70,duration:1.1}):el.scrollIntoView({behavior:"smooth"})}
(()=>{if(!window.LocomotiveScroll||!window.gsap||!window.ScrollTrigger)return;
gsap.registerPlugin(ScrollTrigger);const sc=$("#sc");
loco=new LocomotiveScroll({el:sc,smooth:true,lerp:.085,smartphone:{smooth:false},tablet:{smooth:false}});
if(document.documentElement.classList.contains("has-scroll-smooth")){
ScrollTrigger.scrollerProxy(sc,{scrollTop(v){return arguments.length?loco.scrollTo(v,{duration:0,disableLerp:true}):loco.scroll.instance.scroll.y},getBoundingClientRect(){return{top:0,left:0,width:innerWidth,height:innerHeight}},pinType:sc.style.transform?"transform":"fixed"});
ScrollTrigger.defaults({scroller:sc});
let Y=0;try{Object.defineProperty(window,"scrollY",{get:()=>Y,configurable:true})}catch(e){}
loco.on("scroll",a=>{Y=a.scroll.y;ScrollTrigger.update();dispatchEvent(new Event("scroll"))})}
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener("click",e=>{const h=a.getAttribute("href");if(h.length>1&&$(h)){e.preventDefault();goTo(h)}}));
const sm=lb.showModal.bind(lb);lb.showModal=()=>{loco.stop();sm()};lb.addEventListener("close",()=>loco.start());
const st=(trigger,start,end)=>({trigger,start,end,scrub:true});
gsap.to(".hero h1",{yPercent:-22,opacity:.15,ease:"none",scrollTrigger:st(".hero","top top","bottom top")});
gsap.fromTo(".grade",{scale:1},{scale:.9,ease:"none",scrollTrigger:st(".grade","top 30%","bottom top")});
gsap.fromTo(".stage",{yPercent:8},{yPercent:-8,ease:"none",scrollTrigger:st("#lookbook","top bottom","bottom top")});
gsap.from("#work .filters",{x:60,opacity:0,scrollTrigger:{trigger:"#work",start:"top 75%",toggleActions:"play none none reverse"}});
gsap.from(".about h2",{y:70,opacity:0,ease:"none",scrollTrigger:st(".about","top 85%","top 45%")});
gsap.from(".stats > div",{y:40,opacity:0,stagger:.15,scrollTrigger:{trigger:".stats",start:"top 90%",toggleActions:"play none none reverse"}});
gsap.from(".contact h2",{scale:.8,opacity:0,ease:"none",scrollTrigger:st(".contact","top 90%","top 50%")});
const mq=$(".marquee"),sk=gsap.quickTo(mq,"skewX",{duration:.4,ease:"power3"});let tm;
ScrollTrigger.create({start:0,end:"max",onUpdate:s=>{sk(gsap.utils.clamp(-6,6,s.getVelocity()/-350));clearTimeout(tm);tm=setTimeout(()=>sk(0),100)}});
let rq;new ResizeObserver(()=>{cancelAnimationFrame(rq);rq=requestAnimationFrame(()=>{loco.update();ScrollTrigger.refresh()})}).observe(sc);
addEventListener("load",()=>setTimeout(()=>{loco.update();ScrollTrigger.refresh()},400))})();
// cursor ring with labels
if(matchMedia("(pointer:fine)").matches){const ring=document.createElement("div");ring.id="ring";document.body.append(ring);let x=0,y=0,tx=0,ty=0;addEventListener("pointermove",e=>{tx=e.clientX;ty=e.clientY;const t=e.target,l=t.closest(".card")?"View":t.closest(".sheet")?"Flip":t.closest(".grade")?"Drag":"";ring.classList.toggle("big",!!l);ring.textContent=l});(function loop(){x+=(tx-x)*.18;y+=(ty-y)*.18;ring.style.transform=`translate(${x-ring.offsetWidth/2}px,${y-ring.offsetHeight/2}px)`;requestAnimationFrame(loop)})()}
