// ... your BANK stays here, above this line ...
const LEVELS={junior:"AGES 8-11",mid:"AGES 12-14",senior:"AGES 15-18"};
const SHORT={junior:"8-11",mid:"12-14",senior:"15-18"};
let ROUND=10,TIME=15;   // set from Settings when a game starts
const $=id=>document.getElementById(id);
let level="junior",name="",qs=[],idx=0,score=0,streak=0,left=TIME,timer=null,locked=false,db=null,myLast=null,paused=false;

function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function show(id){["start","game","end"].forEach(s=>$(s).classList.toggle("hide",s!==id));if(id==="start")setScene("home")}

// ================= SETTINGS DATA =================
const SKEY="cyberquiz-settings";
const DEF={music:true,musicVol:.5,continuous:true,qVol:.8,gameMusic:true,follow:true,builtin:true,speedup:true,shuffle:false,
 sfx:true,sfxVol:.7,theme:"neon",big:false,kbd:true,pad:true,rumble:true,time:15,round:10,delay:1700};
let cfg=Object.assign({},DEF);
try{
 const o=JSON.parse(localStorage.getItem(SKEY)||"null");
 if(o)Object.assign(cfg,o);
 else if(localStorage.getItem("cyberquiz-music")==="0")cfg.music=false;
}catch(e){}
let saveT=null;   // settings are saved 300ms after the last change, so dragging a slider doesn't hammer storage
function writeCfg(){clearTimeout(saveT);saveT=null;try{localStorage.setItem(SKEY,JSON.stringify(cfg))}catch(e){}}
function saveCfg(){clearTimeout(saveT);saveT=setTimeout(writeCfg,300)}
addEventListener("pagehide",()=>{if(saveT)writeCfg()});
const THEMES=[["neon","Neon Arcade"],["sunset","Sunset"],["ocean","Ocean"],["forest","Forest"],["candy","Candy"],["retro","Retro Green"],["light","Light"],["contrast","High Contrast"]];

// ================= AUDIO ENGINE =================
let ac=null,mg=null;
function ctx(){if(!ac){ac=new(window.AudioContext||window.webkitAudioContext)();ac.onstatechange=settle}if(ac.state==="suspended")ac.resume();return ac}
function beep(f,d=.12,at=0){
 if(!cfg.sfx||cfg.sfxVol<=0)return;
 try{ctx();const o=ac.createOscillator(),g=ac.createGain(),t=ac.currentTime+at;o.type="square";o.frequency.value=f;
  g.gain.setValueAtTime(Math.max(.0002,.12*cfg.sfxVol),t);g.gain.exponentialRampToValueAtTime(.0001,t+d);
  o.connect(g);g.connect(ac.destination);o.start(t);o.stop(t+d)}catch(e){}
}
const jingle=a=>a.forEach((f,i)=>beep(f,.14,i*.13));
function buzz(){try{if(cfg.rumble&&cfg.pad&&padRef&&padRef.vibrationActuator)padRef.vibrationActuator.playEffect("dual-rumble",{duration:200,strongMagnitude:.7,weakMagnitude:.3}).catch(()=>{})}catch(e){}}

// ================= SOUNDTRACK =================
// Scenes: home, q1 (first third of the quiz), q2 (middle), q3 (final stretch), win, lose.
// Put your songs in "all" for one continuous playlist, or in the other scenes for music that changes by stage.
// Add your own files per scene: ["Title","Soundtrack/file.mp3"]  (or just "Soundtrack/file.mp3").
// Built-in original chiptune tunes are used too, unless you turn them off in Settings.
const TRACKS={
 all:[["Soviet Connection","Soundtrack/Soviet%20Connection.mp3"],["Welcome to Los Santos","Soundtrack/Welcome-to-Los-Santos.mp3"]],   // plays all the way through (title screen, questions, results)
 home:[],
 q1:[],
 q2:[],
 q3:[],
 win:[],
 lose:[]
};
const LAB={all:"",home:"HOME",q1:"QUIZ 1",q2:"QUIZ 2",q3:"FINAL",win:"WIN",lose:"TRY AGAIN"};
const SCENE_VOL={home:1,q1:.55,q2:.55,q3:.65,win:.9,lose:.8};
// built-in tunes: bpm, wave, chord progression [midi root, type] per bar, arpeggio pattern, drums on/off
const CH={m:[0,3,7],M:[0,4,7],s:[0,5,7]};
const SYN={
 home:[
  {t:"Neon Boot-Up",bpm:112,w:"square",prog:[[57,"m"],[57,"m"],[60,"M"],[55,"M"]],arp:[0,1,2,1,0,1,2,3],drum:1},
  {t:"Pixel Parade",bpm:124,w:"square",prog:[[60,"M"],[65,"M"],[67,"M"],[57,"m"]],arp:[0,2,1,2,0,2,3,2],drum:1},
  {t:"Cyber Sunrise",bpm:96,w:"triangle",prog:[[53,"M"],[55,"M"],[57,"m"],[55,"M"]],arp:[0,1,2,3,2,1,2,1],drum:0}],
 q1:[
  {t:"Warm-Up",bpm:100,w:"triangle",prog:[[55,"M"],[52,"m"],[57,"m"],[50,"M"]],arp:[0,1,2,1,0,1,2,1],drum:0},
  {t:"Easy Does It",bpm:104,w:"triangle",prog:[[60,"M"],[57,"m"],[53,"M"],[55,"M"]],arp:[0,2,1,2,0,2,1,2],drum:0}],
 q2:[
  {t:"Focus Mode",bpm:116,w:"square",prog:[[57,"m"],[53,"M"],[60,"M"],[55,"M"]],arp:[0,2,1,3,0,2,1,3],drum:1},
  {t:"In The Zone",bpm:120,w:"square",prog:[[52,"m"],[48,"M"],[55,"M"],[50,"M"]],arp:[0,1,3,1,0,2,3,2],drum:1}],
 q3:[
  {t:"Final Stretch",bpm:138,w:"sawtooth",prog:[[57,"m"],[53,"M"],[55,"M"],[52,"m"]],arp:[0,1,2,3,2,1,2,3],drum:1},
  {t:"Last Lap",bpm:146,w:"sawtooth",prog:[[50,"m"],[46,"M"],[53,"M"],[48,"M"]],arp:[0,2,3,2,0,1,3,1],drum:1}],
 win:[
  {t:"Victory Lap",bpm:132,w:"square",prog:[[60,"M"],[65,"M"],[67,"M"],[60,"M"]],arp:[0,1,2,3,2,3,2,1],drum:1}],
 lose:[
  {t:"Try Again",bpm:78,w:"triangle",prog:[[57,"m"],[53,"M"],[50,"m"],[52,"m"]],arp:[0,1,2,1,0,1,2,1],drum:0}]
};
SYN.all=[].concat(SYN.home,SYN.q1,SYN.q2,SYN.q3,SYN.win);
const bgm=new Audio();bgm.preload="auto";
let scn="home",curKey="home",playing=null,userPaused=false,fade=null,curVol=0,sRate=1;
let sTimer=null,sTrack=null,sStep=0,sNext=0;
const tIdx={all:0,home:0,q1:0,q2:0,q3:0,win:0,lose:0};

const sceneKey=sc=>cfg.continuous?"all":(cfg.follow?sc:"home");
const LC={};   // track lists are built once, not on every call
function list(key){
 const ck=key+(cfg.builtin?"1":"0");
 if(LC[ck])return LC[ck];
 const f=(TRACKS[key]||[]).map(t=>typeof t==="string"?{t:t.split("/").pop().replace(/\.[^.]+$/,""),f:t}:{t:t[0],f:t[1]});
 return LC[ck]=(cfg.builtin||!f.length)?f.concat(SYN[key]||[]):f;
}
const pre=new Audio();pre.preload="auto";   // quietly downloads the next song so skipping is instant
function prefetch(key){const l=list(key),n=l[(tIdx[key]+1)%l.length];if(l.length>1&&n&&n.f&&pre._u!==n.f){pre._u=n.f;pre.src=n.f}}
const targetVol=()=>Math.min(1,cfg.musicVol*(curKey==="all"?(scn.charAt(0)==="q"?cfg.qVol:1):(SCENE_VOL[curKey]||1)));
function setVol(v){curVol=Math.max(0,Math.min(1,v));bgm.volume=curVol;if(mg)mg.gain.value=curVol}
function fadeTo(v,ms,done){
 clearInterval(fade);const s=curVol,steps=Math.max(1,Math.round(ms/50));let n=0;
 fade=setInterval(()=>{n++;setVol(s+(v-s)*n/steps);if(n>=steps){clearInterval(fade);fade=null;done&&done()}},50);
}
const isPlaying=()=>!!playing&&(playing.f?!bgm.paused:!!sTimer);
const mtof=m=>440*Math.pow(2,(m-69)/12);
function voice(f,t,d,type,v){const o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.value=f;
 g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(mg);o.start(t);o.stop(t+d+.02)}
function kick(t){const o=ac.createOscillator(),g=ac.createGain();o.type="sine";o.frequency.setValueAtTime(150,t);
 o.frequency.exponentialRampToValueAtTime(45,t+.12);g.gain.setValueAtTime(.35,t);g.gain.exponentialRampToValueAtTime(.001,t+.16);
 o.connect(g);g.connect(mg);o.start(t);o.stop(t+.18)}
function schedSynth(){
 if(!sTrack||!ac)return;
 const T=sTrack,sd=30/(T.bpm*sRate),total=T.prog.length*8*4;
 while(sNext<ac.currentTime+.3){
  const bar=Math.floor(sStep/8),s=sStep%8,p=T.prog[bar%T.prog.length],ch=CH[p[1]],ai=T.arp[s%T.arp.length];
  voice(mtof(p[0]+12+ch[ai%3]+(ai>2?12:0)),sNext,sd*.9,T.w,.05);
  if(s%2===0)voice(mtof(p[0]-12),sNext,sd*1.8,"triangle",.14);
  if(T.drum){if(s%4===0)kick(sNext);if(s%4===2)voice(5000,sNext,.04,"square",.02)}
  sStep++;sNext+=sd;
  if(sStep>=total){if(list(curKey).length>1){playIdx(curKey,nextIdx(curKey,1));return}sStep=0}
 }
}
function stopSynth(){clearInterval(sTimer);sTimer=null;sTrack=null}
function stopCur(){bgm.pause();stopSynth()}
function pauseMusic(){if(playing&&playing.f)bgm.pause();else{clearInterval(sTimer);sTimer=null}}
function resumeMusic(){
 if(playing&&playing.f)bgm.play().catch(()=>{});
 else if(sTrack){try{ctx();sNext=ac.currentTime+.05;sTimer=setInterval(schedSynth,100)}catch(e){}}
}
function playIdx(key,i){
 if(eggAudio)return;   // a secret track is playing
 const l=list(key);
 if(!l.length){stopCur();playing=null;drawNow();return}
 clearInterval(fade);fade=null;stopCur();
 curKey=key;tIdx[key]=((i%l.length)+l.length)%l.length;
 const t=l[tIdx[key]];playing=t;sRate=1;setVol(0);bgm.playbackRate=1;
 if(t.f){
  bgm.loop=l.length===1;bgm.src=t.f;
  bgm.play().then(()=>fadeTo(targetVol(),500)).catch(()=>{playing=null;drawNow()});
  prefetch(key);
 }else{
  try{ctx();if(!mg){mg=ac.createGain();mg.connect(ac.destination)}mg.gain.value=0;
   sTrack=t;sStep=0;sNext=ac.currentTime+.05;sTimer=setInterval(schedSynth,100);fadeTo(targetVol(),500)}
  catch(e){playing=null}
 }
 drawNow();
}
function nextIdx(key,d){const n=list(key).length;if(cfg.shuffle&&n>1){let r;do{r=Math.floor(Math.random()*n)}while(r===tIdx[key]);return r}return tIdx[key]+d}
bgm.onplay=bgm.onpause=()=>drawNow();
bgm.onerror=()=>{playing=null;drawNow()};
bgm.onended=()=>{if(!userPaused&&cfg.music)playIdx(curKey,nextIdx(curKey,1))};
const wantMusic=sc=>!!(!eggAudio&&cfg.music&&(sc==="home"||sc==="win"||sc==="lose"||cfg.gameMusic)&&list(sceneKey(sc)).length);
function applyScene(){
 const key=sceneKey(scn),changed=key!==curKey;
 if(!wantMusic(scn)){
  curKey=key;
  if(playing)fadeTo(0,400,()=>{stopCur();playing=null;drawNow()});else drawNow();
  return;
 }
 if(userPaused){curKey=key;drawNow();return}
 if(!changed&&isPlaying()){if(!fade&&Math.abs(curVol-targetVol())>.01)fadeTo(targetVol(),400);return}
 const go=()=>playIdx(sceneKey(scn),cfg.shuffle?nextIdx(sceneKey(scn),0):tIdx[sceneKey(scn)]);
 if(isPlaying())fadeTo(0,450,go);else go();
}
function setScene(sc){scn=sc;applyScene()}
function enableMusic(){if(!cfg.music){cfg.music=true;saveCfg();drawMusic();rowsRefresh.forEach(f=>f())}}
function skip(d){
 enableMusic();userPaused=false;
 const key=sceneKey(scn);
 if(!list(key).length)return;
 playIdx(key,nextIdx(key,d));
}
function togglePlay(){
 if(isPlaying()){userPaused=true;pauseMusic();drawNow();return}
 userPaused=false;enableMusic();
 if(playing&&(playing.f?!!bgm.src:!!sTrack)){setVol(targetVol());resumeMusic();drawNow()}else applyScene();
}
function nudgeVol(d){cfg.musicVol=Math.max(0,Math.min(1,+(cfg.musicVol+d).toFixed(2)));commit()}
// ---- autoplay: music starts as soon as the page loads. Browsers may block that until the first
// click, tap or key press, so we also retry on every interaction and show a hint until sound is really playing.
const UEV=["pointerdown","keydown","touchstart","click"];
function audible(){
 if(eggAudio)return !eggAudio.paused;
 if(!playing)return !wantMusic(scn);
 return playing.f?!bgm.paused:(!!ac&&ac.state==="running");
}
function settle(){
 const ok=!cfg.music||userPaused||audible();
 if(hint)hint.hidden=ok;
 if(ok&&cfg.music&&!userPaused&&!unlocked){unlocked=true;UEV.forEach(ev=>removeEventListener(ev,unlock,true))}
}
function unlock(){
 if(unlocked)return;
 try{ctx()}catch(e){}
 if(eggAudio)eggAudio.play().catch(()=>{});
 else if(cfg.music&&!userPaused){
  if(playing&&playing.f&&bgm.paused)bgm.play().catch(()=>{});
  else if(!playing)applyScene();
 }
 setTimeout(settle,300);
}
UEV.forEach(ev=>addEventListener(ev,unlock,true));
// pause everything when the tab is hidden, resume when it comes back
let wasMusic=false,wasEgg=false;
document.addEventListener("visibilitychange",()=>{
 if(document.hidden){
  wasMusic=!!playing&&isPlaying()&&!userPaused;wasEgg=!!eggAudio&&!eggAudio.paused;
  if(wasMusic)pauseMusic();if(wasEgg)eggAudio.pause();
 }else{
  if(wasMusic&&cfg.music)resumeMusic();if(wasEgg&&cfg.music&&eggAudio)eggAudio.play().catch(()=>{});
  wasMusic=wasEgg=false;
 }
});

// ================= SETTINGS PANEL (built by script) =================
const rowsRefresh=[];
let gear=null,ov=null,bar=null,padTag=null,jumpSel=null,hint=null,unlocked=false,npEls=[],ppEls=[];
function h(t,p,...k){
 const e=document.createElement(t);
 if(p)Object.keys(p).forEach(n=>{if(n==="role"||n.indexOf("aria-")===0)e.setAttribute(n,p[n]);else e[n]=p[n]});
 k.flat().forEach(c=>e.append(c));return e;
}
function commit(){saveCfg();apply()}
function apply(){
 document.documentElement.dataset.theme=eggTheme||cfg.theme;
 if(eggAudio){eggAudio.volume=eggVol();cfg.music?eggAudio.play().catch(()=>{}):eggAudio.pause()}
 document.documentElement.style.setProperty("--fs",cfg.big?"15px":"");
 if(isPlaying()&&!fade)setVol(targetVol());
 startPoll();applyScene();drawMusic();rowsRefresh.forEach(f=>f());
}
function drawMusic(){const b=$("mus");if(!b)return;b.textContent=cfg.music?"🎵 MUSIC ON":"🎵 MUSIC OFF";b.setAttribute("aria-pressed",cfg.music)}
function drawNow(){
 const key=curKey||sceneKey(scn),l=list(key),t=isPlaying()?playing:l[tIdx[key]];
 npEls.forEach(e=>{e.textContent="♪ "+(cfg.follow&&key!=="all"?LAB[key]+": ":"")+(t?t.t:"NO TRACKS")+(userPaused?" (PAUSED)":"")});
 ppEls.forEach(b=>{b.textContent=isPlaying()?"⏸":"▶"});
 if(jumpSel){
  const sig=key+"|"+l.map(x=>x.t).join("|");
  if(jumpSel.dataset.sig!==sig){jumpSel.dataset.sig=sig;jumpSel.replaceChildren();
   if(!l.length)jumpSel.append(h("option",{textContent:"(no tracks)"}));
   l.forEach((x,i)=>jumpSel.append(h("option",{value:i,textContent:x.t})))}
  jumpSel.value=tIdx[key];
 }
 settle();
}
if($("mus"))$("mus").onclick=()=>{cfg.music=!cfg.music;if(cfg.music)userPaused=false;commit()};

function tog(label,key){
 const b=h("button",{className:"cs-btn",onclick:()=>{cfg[key]=!cfg[key];if(key==="music"&&cfg[key])userPaused=false;commit()}});
 rowsRefresh.push(()=>{b.textContent=cfg[key]?"ON":"OFF";b.classList.toggle("on",!!cfg[key]);b.setAttribute("aria-pressed",!!cfg[key])});
 return h("div",{className:"cs-r"},h("span",{textContent:label}),b);
}
function sld(label,key,test){
 const i=h("input",{type:"range",min:0,max:1,step:.05,value:cfg[key],oninput:()=>{cfg[key]=+i.value;commit()},onchange:()=>test&&test()});
 i.setAttribute("aria-label",label);rowsRefresh.push(()=>{i.value=cfg[key]});
 return h("div",{className:"cs-r"},h("span",{textContent:label}),i);
}
function sel(label,key,opts){
 const s=h("select",{onchange:()=>{cfg[key]=typeof DEF[key]==="number"?+s.value:s.value;commit()}});
 opts.forEach(o=>s.append(h("option",{value:o[0],textContent:o[1]})));
 s.setAttribute("aria-label",label);rowsRefresh.push(()=>{s.value=cfg[key]});
 return h("div",{className:"cs-r"},h("span",{textContent:label}),s);
}
const sec=t=>h("h3",{textContent:t});
function confirmBtn(label,action){
 const b=h("button",{className:"cs-btn",textContent:label});let sure=false,tm=null;
 b.onclick=()=>{
  if(sure){clearTimeout(tm);sure=false;b.textContent=label;action();return}
  sure=true;b.textContent="SURE? PRESS AGAIN";tm=setTimeout(()=>{sure=false;b.textContent=label},3000);
 };
 return h("div",{className:"cs-r"},b);
}
function playerRow(){
 return h("div",{className:"cs-r cs-pl"},
  h("button",{className:"cs-btn",textContent:"⏮",title:"Previous track","aria-label":"Previous track",onclick:()=>skip(-1)}),
  h("button",{className:"cs-btn cs-pp",textContent:"▶",title:"Play or pause","aria-label":"Play or pause",onclick:togglePlay}),
  h("button",{className:"cs-btn",textContent:"⏭",title:"Next track","aria-label":"Next track",onclick:()=>skip(1)}),
  h("span",{className:"cs-np"}));
}
const STYLE=`
#cs-gear{position:fixed;top:10px;right:10px;z-index:50;font-size:1.3em;padding:8px 12px;text-align:center}
#cs-pad{position:fixed;top:12px;left:10px;z-index:50;font-size:.9em;color:var(--good,#39ff88)}
#cs-bar{position:fixed;left:0;right:0;bottom:0;z-index:40;display:flex;align-items:center;gap:6px;padding:6px 10px;background:var(--bg,#0b0221);border-top:3px solid var(--a,#22f0ff);font-size:.8em;color:var(--ink,#f4f0ff)}
#cs-bar .cs-np{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#cs-bar input[type=range]{width:80px;accent-color:var(--b,#ff2ec4)}
#cs-hint{position:fixed;left:50%;bottom:76px;transform:translateX(-50%);z-index:60;max-width:92vw;background:var(--c,#ffe600);color:var(--onc,#000);border-color:var(--c,#ffe600)}
#cs-hint[hidden]{display:none}
body{padding-bottom:64px}
#cs-ov{position:fixed;inset:0;z-index:100;background:rgba(0,0,0,.85);overflow:auto;padding:14px}
#cs-ov[hidden]{display:none}
#cs-pn{max-width:540px;margin:0 auto;background:var(--panel,#170a3d);border:var(--bw,4px) solid var(--a,#22f0ff);border-radius:var(--r,0);padding:16px;color:var(--ink,#f4f0ff);line-height:1.7}
#cs-pn h2{font-size:1.3em;color:var(--c,#ffe600);margin:0 0 8px}
#cs-pn h3{font-size:1em;color:var(--b,#ff2ec4);margin:18px 0 6px;border-bottom:2px dashed var(--b,#ff2ec4);padding-bottom:4px}
#cs-pn p{font-size:.85em;margin:6px 0;opacity:.85}
.cs-r{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:8px 0;flex-wrap:wrap;font-size:.9em}
.cs-r select,.cs-r input[type=range]{font:inherit;font-size:.9em;max-width:55%;min-width:130px;background:var(--input,#000);color:var(--good,#39ff88);border:3px solid var(--b,#ff2ec4);border-radius:var(--r,0);padding:6px}
.cs-r input[type=range]{padding:0;accent-color:var(--b,#ff2ec4)}
.cs-pl .cs-np{flex:1;min-width:100px}
.cs-btn{font:inherit;font-size:.9em;color:var(--ink,#f4f0ff);background:var(--btn,#2b1270);border:3px solid var(--a,#22f0ff);border-radius:var(--r,0);padding:8px 12px;min-height:40px;cursor:pointer;text-align:center}
.cs-btn:hover{background:var(--b,#ff2ec4);color:var(--onb,#fff)}
.cs-btn.on{background:var(--c,#ffe600);color:var(--onc,#000);border-color:var(--c,#ffe600)}
.cs-close{display:block;width:100%;margin-top:16px;background:var(--good,#39ff88);color:var(--ong,#000);border-color:var(--good,#39ff88);font-size:1.1em}
.cs-btn:focus-visible,#cs-pn select:focus-visible,#cs-pn input:focus-visible,body.cs-padmode button:focus,body.cs-padmode select:focus,body.cs-padmode input:focus{outline:4px solid var(--c,#ffe600);outline-offset:3px}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
`;
function openSettings(){
 paused=!$("game").classList.contains("hide");
 ov.hidden=false;drawNow();apply();ov.querySelector(".cs-close").focus();
}
function closeSettings(){ov.hidden=true;paused=false;gear.focus()}
function buildSettings(){
 document.head.append(h("style",{textContent:STYLE}));
 gear=h("button",{id:"cs-gear",className:"cs-btn",textContent:"⚙",title:"Settings (Esc)","aria-label":"Settings",onclick:openSettings});
 padTag=h("span",{id:"cs-pad",textContent:"🎮 CONTROLLER",hidden:true});
 hint=h("button",{id:"cs-hint",className:"cs-btn",textContent:"🎵 TAP ANYWHERE TO START MUSIC",hidden:true,onclick:unlock});
 const mini=h("input",{type:"range",min:0,max:1,step:.05,value:cfg.musicVol,title:"Music volume",oninput:()=>{cfg.musicVol=+mini.value;commit()}});
 mini.setAttribute("aria-label","Music volume");rowsRefresh.push(()=>{mini.value=cfg.musicVol});
 bar=h("div",{id:"cs-bar",onwheel:e=>{e.preventDefault();nudgeVol(e.deltaY<0?.05:-.05)}},
  h("button",{className:"cs-btn",textContent:"⏮","aria-label":"Previous track",onclick:()=>skip(-1)}),
  h("button",{className:"cs-btn cs-pp",textContent:"▶","aria-label":"Play or pause",onclick:togglePlay}),
  h("button",{className:"cs-btn",textContent:"⏭","aria-label":"Next track",onclick:()=>skip(1)}),
  h("span",{className:"cs-np"}),mini);
 jumpSel=h("select",{onchange:()=>{userPaused=false;enableMusic();playIdx(curKey||sceneKey(scn),+jumpSel.value)}});
 jumpSel.setAttribute("aria-label","Pick a track");
 const pn=h("div",{id:"cs-pn",role:"dialog","aria-modal":"true","aria-label":"Settings"},
  h("h2",{textContent:"⚙ SETTINGS"}),
  sec("♪ MUSIC"),
  tog("Music","music"),
  sld("Music volume","musicVol"),
  tog("Continuous playlist (same songs all the way through)","continuous"),
  sld("Volume during questions","qVol"),
  tog("Music changes through the quiz","follow"),
  tog("Music during questions","gameMusic"),
  tog("Built-in tunes","builtin"),
  tog("Speed up when time is low","speedup"),
  tog("Shuffle tracks","shuffle"),
  playerRow(),
  h("div",{className:"cs-r"},h("span",{textContent:"Pick a track"}),jumpSel),
  sec("🔊 SOUND EFFECTS"),
  tog("Sound effects","sfx"),
  sld("Effects volume","sfxVol",()=>jingle([660,880])),
  h("div",{className:"cs-r"},h("button",{className:"cs-btn",textContent:"TEST SOUND",onclick:()=>jingle([523,659,784])})),
  sec("🎨 LOOK"),
  sel("Colour theme","theme",THEMES),
  tog("Big text","big"),
  sec("🎮 CONTROLS"),
  tog("Keyboard controls","kbd"),
  tog("Controller controls","pad"),
  tog("Controller vibration","rumble"),
  h("p",{textContent:"KEYBOARD: 1-4 answer · arrows move · Enter select · Esc or S settings · M music · N next · P previous · + / - volume"}),
  h("p",{textContent:"CONTROLLER: D-pad or stick move · A select · A/B/X/Y answer · Start play · Select settings · LB / RB previous / next track"}),
  h("p",{textContent:"MOUSE: click anything · scroll over the music bar to change volume"}),
  sec("🕹 GAMEPLAY (next game)"),
  sel("Seconds per question","time",[[10,"10"],[15,"15"],[20,"20"],[30,"30"]]),
  sel("Questions per round","round",[[5,"5"],[8,"8"],[10,"10"],[12,"12"]]),
  sel("Pause between questions","delay",[[1200,"SHORT"],[1700,"NORMAL"],[3000,"LONG"]]),
  sec("🗑 DATA"),
  confirmBtn("RESET MY SCORES",()=>{
   try{Object.keys(localStorage).forEach(k=>{if(k===LKEY||k.indexOf("cyberquiz-seen-")===0)localStorage.removeItem(k)})}catch(e){}
   render(localScores(),"SCORES SAVED ON THIS DEVICE")}),
  confirmBtn("RESET SETTINGS",()=>{cfg=Object.assign({},DEF);commit()}),
  h("button",{className:"cs-btn cs-close",textContent:"✔ CLOSE",onclick:closeSettings}));
 ov=h("div",{id:"cs-ov",hidden:true,onclick:e=>{if(e.target===ov)closeSettings()}},pn);
 document.body.append(gear,padTag,hint,bar,ov);
 npEls=[...document.querySelectorAll(".cs-np")];ppEls=[...document.querySelectorAll(".cs-pp")];
 apply();drawNow();
}

// ================= KEYBOARD =================
const DIRS=["up","down","left","right"];
function visible(e){return !e.disabled&&!!(e.offsetWidth||e.offsetHeight||e.getClientRects().length)}
function move(dir){
 const scope=ov&&!ov.hidden?ov:document;
 const items=[...scope.querySelectorAll("button,input,select")].filter(visible);
 const cur=document.activeElement;
 if(!items.includes(cur)){const f=items.find(e=>e.tagName==="BUTTON")||items[0];if(f)f.focus();return}
 const c=e=>{const r=e.getBoundingClientRect();return[r.left+r.width/2,r.top+r.height/2]},[cx,cy]=c(cur);
 const vert=dir==="up"||dir==="down";let best=null,bs=1e9;
 items.forEach(e=>{if(e===cur)return;const[x,y]=c(e),dx=x-cx,dy=y-cy;
  const f=dir==="down"?dy:dir==="up"?-dy:dir==="right"?dx:-dx,o=vert?Math.abs(dx):Math.abs(dy);
  if(f>4&&f+o*2<bs){bs=f+o*2;best=e}});
 if(best){best.focus();best.scrollIntoView({block:"nearest"});beep(300,.04)}
}
addEventListener("keydown",e=>{
 if(e.ctrlKey||e.metaKey||e.altKey)return;
 const open=!!ov&&!ov.hidden;
 if(e.key==="Escape"){e.preventDefault();open?closeSettings():openSettings();return}
 if(!cfg.kbd)return;
 const t=e.target,tag=t.tagName,typing=(tag==="INPUT"&&t.type!=="range")||tag==="TEXTAREA";
 if(typing||tag==="SELECT")return;
 const k=e.key.toLowerCase();
 if(k==="m"){cfg.music=!cfg.music;if(cfg.music)userPaused=false;commit();return}
 if(k==="n"){skip(1);return}
 if(k==="p"){skip(-1);return}
 if(k==="s"&&!open){openSettings();return}
 if(k==="+"||k==="="){nudgeVol(.05);return}
 if(k==="-"||k==="_"){nudgeVol(-.05);return}
 const d={arrowup:"up",arrowdown:"down",arrowleft:"left",arrowright:"right"}[k];
 if(d&&(tag==="BUTTON"||tag==="BODY")){e.preventDefault();move(d);return}
 if(open)return;
 if(!$("game").classList.contains("hide")){
  const n=+e.key;
  if(n>=1&&n<=4&&!locked&&$("ans").children[n-1])$("ans").children[n-1].click();
 }
});

// ================= CONTROLLER =================
const PADMAP={a:0,b:1,x:2,y:3,lb:4,rb:5,select:8,start:9,up:12,down:13,left:14,right:15};
let prevPad={},holdPad={},padRef=null,polling=false;
function press(k){
 if(!cfg.pad)return;
 const open=!!ov&&!ov.hidden;
 if(k==="lb")return skip(-1);
 if(k==="rb")return skip(1);
 if(k==="select")return open?closeSettings():openSettings();
 const a=document.activeElement;
 if(open){
  if(k==="b")return closeSettings();
  if(k==="left"||k==="right"){
   const d=k==="left"?-1:1;
   if(a&&a.type==="range"){a.value=(+a.value+d*(+a.step||1)).toFixed(2);a.dispatchEvent(new Event("input",{bubbles:true}));a.dispatchEvent(new Event("change",{bubbles:true}));return}
   if(a&&a.tagName==="SELECT"){const n=a.selectedIndex+d;if(n>=0&&n<a.options.length){a.selectedIndex=n;a.dispatchEvent(new Event("change",{bubbles:true}))}return}
  }
  if(k==="a"){if(a&&a.tagName==="BUTTON")a.click();else move("down");return}
  if(DIRS.includes(k))move(k);
  return;
 }
 const inGame=!$("game").classList.contains("hide"),inEnd=!$("end").classList.contains("hide");
 if(inGame){
  const i={a:0,b:1,x:2,y:3}[k],b=i!==undefined?$("ans").children[i]:null;
  if(b&&!locked)b.click();
  return;
 }
 if(k==="start")return(inEnd?$("again"):$("play")).click();
 if(k==="b"&&inEnd)return $("again").click();
 if(k==="a"){if(a&&a.tagName==="BUTTON")a.click();else move("down");return}
 if(DIRS.includes(k))move(k);
}
function startPoll(){if(polling||!cfg.pad)return;polling=true;requestAnimationFrame(poll)}
function poll(){   // only runs while a controller is connected
 const gp=navigator.getGamepads?[...navigator.getGamepads()].find(g=>g&&g.connected):null;
 if(!gp||!cfg.pad){padRef=null;prevPad={};if(padTag)padTag.hidden=true;document.body.classList.remove("cs-padmode");polling=false;return}
 padRef=gp;if(padTag)padTag.hidden=false;document.body.classList.add("cs-padmode");
 const ax=gp.axes||[],cur={},now=performance.now();
 for(const k in PADMAP)cur[k]=!!(gp.buttons[PADMAP[k]]&&gp.buttons[PADMAP[k]].pressed);
 cur.left=cur.left||ax[0]<-.6;cur.right=cur.right||ax[0]>.6;cur.up=cur.up||ax[1]<-.6;cur.down=cur.down||ax[1]>.6;
 for(const k in cur){
  if(!cur[k])continue;
  if(!prevPad[k]){unlock();press(k);holdPad[k]=now+350}
  else if(DIRS.includes(k)&&now>=holdPad[k]){press(k);holdPad[k]=now+140}
 }
 prevPad=cur;
 requestAnimationFrame(poll);
}

// ================= SECRET NAMES (easter eggs) =================
// Type the code as the player name, then press PLAY. Add more codes here.
const EGGS={
 "2077":{file:"Soundtrack/2077.mp3",theme:"sunset",alias:"V"}   // alias = name saved on the leaderboard (optional)
};
let eggAudio=null,eggTheme=null;
const eggVol=()=>Math.min(1,cfg.musicVol*.9);
function eggStart(code){
 const e=EGGS[code];if(!e)return;
 eggStop(true);
 eggAudio=new Audio(e.file);eggAudio.loop=true;eggAudio.volume=eggVol();
 eggTheme=e.theme||null;
 apply();
}
function eggStop(quiet){
 if(eggAudio){eggAudio.pause();eggAudio=null}
 eggTheme=null;
 if(!quiet)apply();
}

// ================= LEVEL BUTTONS =================
Object.keys(LEVELS).forEach(k=>{const b=document.createElement("button");b.textContent=LEVELS[k];b.dataset.k=k;
 b.onclick=()=>{level=k;[...$("ages").children].forEach(c=>c.classList.toggle("on",c===b))};
 if(k===level)b.classList.add("on");$("ages").appendChild(b)});

$("play").onclick=()=>{
 name=$("nm").value.trim().toUpperCase();
 if(!name&&document.body.classList.contains("cs-padmode"))name="PLAYER";
 if(!name){$("smsg").textContent="TYPE YOUR NAME FIRST!";$("nm").focus();return}
 eggStart(name);if(EGGS[name]&&EGGS[name].alias)name=EGGS[name].alias;
 $("smsg").textContent="";beep(523,.1);start();
};
$("again").onclick=()=>{eggStop();show("start")};

// ================= GAME =================
function seenGet(){try{return JSON.parse(localStorage.getItem("cyberquiz-seen-"+level)||"[]")}catch(e){return[]}}
function seenSet(v){try{localStorage.setItem("cyberquiz-seen-"+level,JSON.stringify(v))}catch(e){}}
const stage=()=>{const r=idx/Math.max(1,qs.length);return r<.34?"q1":r<.67?"q2":"q3"};
function start(){
 clearInterval(timer);
 const pool=BANK[level];
 TIME=cfg.time;ROUND=Math.min(cfg.round,pool.length);paused=false;
 let seen=seenGet();
 let order=shuffle(pool.map((_,i)=>i));
 let fresh=order.filter(i=>!seen.includes(i));
 if(fresh.length<ROUND){seen=[];fresh=order}
 const pick=fresh.slice(0,ROUND);seenSet(seen.concat(pick));
 qs=pick.map(i=>{const r=pool[i];return{q:r[0],c:r[1],opts:shuffle(r.slice(1))}});
 idx=0;score=0;streak=0;myLast=null;show("game");next();
}
function next(){
 if(idx>=qs.length)return finish();
 const x=qs[idx];locked=false;left=TIME;
 setScene(stage());
 $("qn").textContent="Q "+(idx+1)+"/"+qs.length;$("sc").textContent="SCORE "+score;
 $("q").textContent=x.q;$("gmsg").textContent="";$("ans").replaceChildren();
 x.opts.forEach(o=>{const b=document.createElement("button");b.textContent=o;b.onclick=()=>answer(b,o);$("ans").appendChild(b)});
 tick();clearInterval(timer);
 timer=setInterval(()=>{if(paused||document.hidden)return;left-=0.25;tick();if(left<=0)answer(null,null)},250);
}
function tick(){
 $("tm").textContent="TIME "+Math.max(0,Math.ceil(left));$("fill").style.width=Math.max(0,left/TIME*100)+"%";
 if(cfg.speedup&&!locked){
  sRate=(scn.charAt(0)==="q"&&left<=5)?1.15:1;
  if(playing&&playing.f)bgm.playbackRate=sRate;
 }
}
function answer(btn,val){
 if(locked)return;locked=true;clearInterval(timer);
 const x=qs[idx],ok=val===x.c;
 sRate=1;bgm.playbackRate=1;
 [...$("ans").children].forEach(b=>{b.disabled=true;if(b.textContent===x.c)b.classList.add("right")});
 if(btn&&!ok)btn.classList.add("wrong");
 if(ok){streak++;const pts=100+Math.round(Math.max(0,left)/TIME*50)+(streak-1)*10;score+=pts;
  $("gmsg").textContent="CORRECT! +"+pts+(streak>1?"  ("+streak+" IN A ROW!)":"");beep(660,.1);beep(880,.14,.1)}
 else{streak=0;$("gmsg").textContent=val===null?"TIME UP!":"WRONG! THE ANSWER IS GREEN.";buzz();beep(160,.3)}
 $("sc").textContent="SCORE "+score;
 idx++;setTimeout(next,cfg.delay);
}
async function finish(){
 show("end");$("final").textContent=score;
 setScene(score>=ROUND*100*.7?"win":"lose");
 $("emsg").textContent="SAVING SCORE...";
 const ok=await saveScore();
 $("emsg").textContent=ok==="db"?"SCORE SAVED TO LEADERBOARD!":ok==="local"?"SAVED ON THIS DEVICE ONLY":"COULD NOT SAVE SCORE";
 loadBoard();
}

// ---------- leaderboard ----------
const LKEY="cyberquiz-scores";
function localScores(){try{return JSON.parse(localStorage.getItem(LKEY)||"[]")}catch(e){return[]}}
async function saveScore(){
 const rec={name,score,level,at:Date.now()};myLast=rec;
 if(db){try{await db.collection("scores").add(rec);return"db"}catch(e){}}
 try{const l=localScores();l.push(rec);l.sort((a,b)=>b.score-a.score);localStorage.setItem(LKEY,JSON.stringify(l.slice(0,20)));return"local"}catch(e){return null}
}
function render(list,note){
 const tb=$("lb");tb.replaceChildren();
 if(!list.length){const r=tb.insertRow(),c=r.insertCell();c.colSpan=4;c.textContent="NO SCORES YET - BE THE FIRST!";}
 list.slice(0,10).forEach((s,i)=>{const r=tb.insertRow();
  if(myLast&&s.name===myLast.name&&s.score===myLast.score&&s.at===myLast.at)r.className="me";
  [i+1,s.name,SHORT[s.level]||"",s.score].forEach(v=>{r.insertCell().textContent=v})});
 $("lbnote").textContent=note;
}
let unsub=null;
function loadBoard(){
 if(db){
  if(unsub)return;
  const t=setTimeout(()=>render(localScores(),"SHOWING THIS DEVICE ONLY"),10000);
  unsub=db.collection("scores").orderBy("score","desc").limit(10).onSnapshot(
   s=>{clearTimeout(t);render(s.docs.map(d=>d.data()),"SHARED ONLINE LEADERBOARD")},
   ()=>{clearTimeout(t);unsub=null;render(localScores(),"SHOWING THIS DEVICE ONLY")});
 }else render(localScores(),"SCORES SAVED ON THIS DEVICE");
}

// ---------- start-up (keep at the very bottom) ----------
buildSettings();
startPoll();addEventListener("gamepadconnected",startPoll);
render(localScores(),"LOADING...");
(async()=>{try{db=await claude.use("db")}catch(e){db=null}loadBoard()})();
