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
const DEF={music:true,musicVol:.5,gameMusic:true,follow:true,builtin:true,speedup:true,shuffle:false,
 sfx:true,sfxVol:.7,theme:"neon",big:false,kbd:true,pad:true,rumble:true,time:15,round:10,delay:1700};
let cfg=Object.assign({},DEF);
try{
 const o=JSON.parse(localStorage.getItem(SKEY)||"null");
 if(o)Object.assign(cfg,o);
 else if(localStorage.getItem("cyberquiz-music")==="0")cfg.music=false;
}catch(e){}
function saveCfg(){try{localStorage.setItem(SKEY,JSON.stringify(cfg))}catch(e){}}
const THEMES=[["neon","Neon Arcade"],["sunset","Sunset"],["ocean","Ocean"],["forest","Forest"],["candy","Candy"],["retro","Retro Green"],["light","Light"],["contrast","High Contrast"]];

// ================= AUDIO ENGINE =================
let ac=null,mg=null;
function ctx(){ac=ac||new(window.AudioContext||window.webkitAudioContext)();if(ac.state==="suspended")ac.resume();return ac}
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
// Add your own files per scene: ["Title","music/file.mp3"]  (or just "music/file.mp3").
// Built-in original chiptune tunes are used too, unless you turn them off in Settings.
const TRACKS={
 all:[["Song One","Soviet Connection.mp3"],["Song Two","Welcome-to-Los-Santos.mp3"]
 home:[],
 q1:[],
 q2:[],
 q3:[],
 win:[],
 lose:[]
};
const LAB={home:"HOME",q1:"QUIZ 1",q2:"QUIZ 2",q3:"FINAL",win:"WIN",lose:"TRY AGAIN"};
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
const bgm=new Audio();bgm.preload="auto";
let scn="home",curKey="home",playing=null,userPaused=false,fade=null,curVol=0,sRate=1;
let sTimer=null,sTrack=null,sStep=0,sNext=0;
const tIdx={home:0,q1:0,q2:0,q3:0,win:0,lose:0};

const sceneKey=sc=>cfg.follow?sc:"home";
function list(key){
 const f=(TRACKS[key]||[]).map(t=>typeof t==="string"?{t:t.split("/").pop().replace(/\.[^.]+$/,""),f:t}:{t:t[0],f:t[1]});
 return (cfg.builtin||!f.length)?f.concat(SYN[key]||[]):f;
}
const targetVol=()=>Math.min(1,cfg.musicVol*(SCENE_VOL[curKey]||1));
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
 const l=list(key);
 if(!l.length){stopCur();playing=null;drawNow();return}
 clearInterval(fade);fade=null;stopCur();
 curKey=key;tIdx[key]=((i%l.length)+l.length)%l.length;
 const t=l[tIdx[key]];playing=t;sRate=1;setVol(0);bgm.playbackRate=1;
 if(t.f){
  bgm.loop=l.length===1;bgm.src=t.f;
  bgm.play().then(()=>fadeTo(target
