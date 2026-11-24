/* Cyber Defender Arcade */
// [question, correct, wrong, wrong, wrong, why]
const BANK={
 junior:[
  ["What makes a strong password?","A long mix of letters, numbers and symbols","Your pet’s name","123456","Your birthday","Long and random is hard to guess. Pet names and birthdays are easy for others to find."],
  ["Who can you share your password with?","Only a trusted adult like a parent","Your best friend","Anyone who asks nicely","Everyone in your class","Even friends can fall out or slip up. Keep passwords secret."],
  ["A stranger online asks where you live. What do you do?","Don’t answer and tell a trusted adult","Tell them your street","Send a photo of your house","Give them a fake name, then your address","Never share where you live with people you only know online."],
  ["What is a computer virus?","A harmful program that can damage files","A bug living in the keyboard","A type of game","A fast internet connection","Viruses are software that spread and cause harm."],
  ["A pop-up says “You won a free phone! Click here!” What now?","Close it and don’t click","Click it fast","Type in your details","Share it with friends","“Free prize” pop-ups are tricks to steal info or install bad software."],
  ["What does the padlock in the browser bar mean?","The connection is encrypted","The site is 100% safe","The site is only for kids","The site is free","The padlock hides your data on the way, but bad sites can have one too."],
  ["Which is OK to share online?","Your favourite colour","Your home address","Your phone number","Your password","Harmless hobbies are fine. Keep personal details private."],
  ["Why should you update your apps and devices?","To fix security holes","To make them slower","To delete your photos","You never need to","Updates patch weaknesses that attackers use."],
  ["Someone sends you a mean message. Best action?","Don’t reply, save it and tell a trusted adult","Reply with something meaner","Secretly delete your account","Forward it to everyone","Saving the message gives an adult proof to help you."],
  ["What is a username for?","Naming your account without showing your real name","Keeping your password","Hiding viruses","Paying for games","A made-up username protects your real identity."],
  ["You get a friend request from someone you don’t know. What now?","Ignore it or ask a trusted adult","Accept it, more friends is better","Send them your photo","Tell them your school","People online aren’t always who they say they are."],
  ["Why lock your screen when you walk away?","So others can’t use your accounts","To save battery only","To clean it","It makes the Wi-Fi faster","An unlocked device lets anyone read or post as you."]],
 mid:[
  ["What is phishing?","Tricking you into giving away personal info","Catching fish online","A type of firewall","Speeding up Wi-Fi","Phishing messages pretend to be someone you trust."],
  ["What is two-factor authentication (2FA)?","A second proof of identity when you log in","Two identical passwords","Logging in twice","Using two devices at once","Even if a password leaks, the attacker still needs the second factor."],
  ["You are on café public Wi-Fi. Safest choice?","Avoid logging into important accounts","Do your online banking","Share files with strangers","Turn off your antivirus","Public Wi-Fi can be watched by others on it."],
  ["What does a firewall do?","Filters network traffic to block threats","Cools your computer","Deletes old files","Boosts game speed","It acts like a gatekeeper for network connections."],
  ["Best way to keep lots of passwords safe?","A password manager","A sticky note on the monitor","One password everywhere","A file called passwords.txt","Managers create and store unique passwords securely."],
  ["What is malware?","Software designed to cause harm","A broken keyboard","A free antivirus","A backup tool","Malware covers viruses, spyware, ransomware and more."],
  ["Which is a common sign of a phishing email?","Urgent threats and a suspicious sender address","Your name spelt correctly","A message from a friend you know","A plain text email","Scammers rush you so you don’t think."],
  ["Why is reusing one password dangerous?","One leak exposes all your accounts","It uses more memory","It is illegal","It slows websites down","Attackers try leaked passwords on other sites (credential stuffing)."],
  ["What is a digital footprint?","The trail of data you leave online","Footprints on a keyboard","The size of a device","A backup drive","Posts, searches and photos can stay online for years."],
  ["Why back up your files?","To recover them after loss or ransomware","To make your PC faster","To hide them","To use less storage","A separate backup means you needn’t pay a ransom."],
  ["A game offers free coins if you enter your login on another site. What is it?","A credential-stealing scam","A fair promotion","A security update","A two-factor check","Real games never ask for your password elsewhere."],
  ["Before downloading an app, what should you check?","The official store, reviews and permissions","Only the icon","How many ads it shows","Nothing, apps are always safe","Fake apps often ask for far more access than they need."]],
 senior:[
  ["What does ransomware do?","Encrypts files and demands payment","Speeds up your PC","Blocks adverts","Backs up your data","Offline backups are the best defence."],
  ["What is social engineering?","Manipulating people into revealing secrets","Building social networks","Coding a social app","Designing a firewall","It attacks human trust, not technology."],
  ["What does HTTPS add to HTTP?","Encryption of data in transit","Faster downloads","Free hosting","Anonymous browsing","TLS stops eavesdroppers reading traffic."],
  ["What is a DDoS attack?","Flooding a service with traffic to knock it offline","Stealing a password","Guessing a PIN","Cloning a SIM card","Many machines overwhelm one target."],
  ["What is a zero-day vulnerability?","A flaw unknown to the vendor with no patch yet","A bug fixed in zero days","A virus that lasts one day","A test with zero users","Defenders have had “zero days” to fix it."],
  ["What does a VPN mainly do?","Encrypts your traffic through a secure tunnel","Makes you immune to malware","Doubles your speed","Removes all tracking","It protects the route, not your device or accounts."],
  ["Why are passwords salted before hashing?","So identical passwords get different hashes","To make them shorter","To let admins read them","To speed up login","Salts defeat precomputed rainbow tables."],
  ["What is a man-in-the-middle attack?","Secretly intercepting communication between two parties","A hacker in the same room","Hacking a manager’s PC","A faulty router","Encryption and certificate checks help prevent it."],
  ["What is the principle of least privilege?","Users get only the access they need","Everyone gets admin rights","Remove all passwords","Allow guests everywhere","Less access means less damage if an account is hijacked."],
  ["Why are smart (IoT) devices often targeted?","Weak default passwords and rare updates","They have large screens","They are always offline","They cannot use Wi-Fi","Change default logins and update firmware."],
  ["What is SQL injection?","Inserting malicious database commands via input","Speeding up a database","Encrypting a table","Backing up SQL","Fix it with parameterised queries and input validation."],
  ["Which 2FA method is generally strongest?","A hardware security key","SMS code","Security questions","Email link only","Keys resist phishing and SIM-swapping."]]
};
const LEVELS={junior:"AGES 8-11",mid:"AGES 12-14",senior:"AGES 15-18"};
const MODES={classic:["🎯","CLASSIC","10 QUESTIONS"],survival:["❤️","SURVIVAL","3 LIVES, GO FOR A RECORD"],time:["⚡","TIME ATTACK","60s CLOCK · WRONG -5s · STREAK OF 5 +3s"],practice:["📘","PRACTICE","NO TIMER, NO SCORE"]};
const AVATARS=["🦊","🐼","🤖","🦄","🐲","👾"];
const BADGES={first:["🎮","FIRST GAME"],perfect:["💯","PERFECT ROUND"],s5:["🔥","5 IN A ROW"],s10:["🚀","10 IN A ROW"],surv:["❤️","SURVIVOR: 12 RIGHT"],speed:["⚡","SPEED DEMON: 8 IN 60s"],all:["🌟","TRIED EVERY MODE"],pb:["📈","PERSONAL BEST"]};
const BLOCK=["FUCK","SHIT","CUNT","BITCH","NAZI","PORN","TWAT","SLUT","WANK"];
const ROUND=10;
const PAD={a:0,b:1,x:2,y:3,lb:4,rb:5,select:8,start:9,up:12,down:13,left:14,right:15};

const $=id=>document.getElementById(id);
const el=(t,txt,cls)=>{const e=document.createElement(t);if(txt!=null)e.textContent=txt;if(cls)e.className=cls;return e};
const store=(k,v)=>{try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}};
const jget=(k,d)=>{try{const v=JSON.parse(store(k)||"");return v==null?d:v}catch(e){return d}};
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const show=id=>["start","game","end"].forEach(s=>$(s).classList.toggle("hide",s!==id));

// ---- ALL state is declared here, before anything runs ----
const S={missed:[],level:"junior",mode:"classic",avatar:AVATARS[0],name:"",cur:null,queue:[],idx:0,score:0,streak:0,best:0,right:0,lives:3,left:15,clock:60,fifty:0,locked:false,on:false,over:false,sure:0};
let timer=null,adv=null,db=null,unsub=null,myLast=null,cache=[],note="LOADING...",tabL="junior",tabM="classic";
let sound=store("cq-sound")!=="0",ac=null,shareText="",prev={},rumble=null;
const TIME=()=>S.level==="junior"?20:15;

// ---- sound ----
function beep(f,d=.12,at=0){if(!sound)return;try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();if(ac.state==="suspended")ac.resume();
 const o=ac.createOscillator(),g=ac.createGain(),t=ac.currentTime+at;o.type="square";o.frequency.value=f;
 g.gain.setValueAtTime(.05,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(ac.destination);o.start(t);o.stop(t+d)}catch(e){}}
const jingle=a=>a.forEach((f,i)=>beep(f,.14,i*.13));
function drawSound(){$("snd").textContent=sound?"🔊 SOUND ON":"🔇 SOUND OFF";$("snd").setAttribute("aria-pressed",sound)}
$("snd").onclick=()=>{sound=!sound;store("cq-sound",sound?"1":"0");drawSound();beep(660,.1)};
$("big").onclick=()=>{const b=document.documentElement.classList.toggle("big");store("cq-big",b?"1":"0");$("big").setAttribute("aria-pressed",b)};
function buzz(){try{rumble&&rumble.vibrationActuator&&rumble.vibrationActuator.playEffect("dual-rumble",{duration:200,strongMagnitude:.7,weakMagnitude:.3}).catch(()=>{})}catch(e){}}

// ---- menu ----
function row(box,keys,cur,fn,fill){box.replaceChildren();
 keys.forEach(k=>{const b=el("button");fill(b,k);b.classList.toggle("on",k===cur);b.setAttribute("aria-pressed",k===cur);
  b.onclick=()=>{fn(k);[...box.children].forEach((c,i)=>{c.classList.toggle("on",keys[i]===k);c.setAttribute("aria-pressed",keys[i]===k)})};box.appendChild(b)})}
const txt=f=>(b,k)=>{b.textContent=f(k)};
function drawStart(){
 row($("avs"),AVATARS,S.avatar,k=>{S.avatar=k;store("cq-avatar",k);beep(520,.06)},txt(k=>k));
 row($("ages"),Object.keys(LEVELS),S.level,k=>{S.level=k;store("cq-level",k)},txt(k=>LEVELS[k]));
 row($("modes"),Object.keys(MODES),S.mode,k=>{S.mode=k;store("cq-mode",k)},(b,k)=>b.append(el("span",MODES[k][0]+" "+MODES[k][1]),el("small",MODES[k][2])));
}
function drawTabs(){
 row($("tabs"),Object.keys(LEVELS),tabL,k=>{tabL=k;renderBoard()},txt(k=>LEVELS[k]));
 row($("mtabs"),["classic","survival","time"],tabM,k=>{tabM=k;renderBoard()},txt(k=>MODES[k][0]+" "+MODES[k][1]));
}
function renderBadges(){const have=jget("cq-badges",[]);$("badges").replaceChildren();
 Object.keys(BADGES).forEach(k=>{const d=el("div",BADGES[k][0],"bd"+(have.includes(k)?" got":""));d.appendChild(el("small",BADGES[k][1]));$("badges").appendChild(d)})}

$("play").onclick=()=>{
 let n=$("nm").value.trim().toUpperCase().replace(/[^A-Z0-9 _-]/g,"");
 if(!n&&document.body.classList.contains("padmode"))n="PLAYER";
 if(!n){$("smsg").textContent="TYPE YOUR NAME FIRST!";$("nm").focus();return}
 if(BLOCK.some(w=>n.replace(/[^A-Z]/g,"").includes(w))){$("smsg").textContent="PICK A FRIENDLIER NAME!";$("nm").focus();return}
 S.name=n;store("cq-name",n);$("smsg").textContent="";beep(523,.1);start();
};
$("nm").addEventListener("keydown",e=>{if(e.key==="Enter")$("play").click()});
$("again").onclick=()=>{show("start")};

// ---- game ----
function start(){
 clearTimeout(adv);clearInterval(timer);
 Object.assign(S,{missed:[],queue:[],idx:0,score:0,streak:0,best:0,right:0,lives:3,clock:60,fifty:S.level==="junior"?2:1,locked:false,on:true,over:false,sure:0});
 myLast=null;$("quit").textContent="✖ QUIT";show("game");next();
 timer=setInterval(loop,250);
}
function pull(){if(!S.queue.length)S.queue=shuffle(BANK[S.level]);const r=S.queue.pop();return{q:r[0],c:r[1],opts:shuffle(r.slice(1,5)),why:r[5]}}
function next(){
 const x=S.cur=pull();S.locked=false;S.left=TIME();
 $("nxt").classList.add("hide");$("why").textContent="";$("gmsg").textContent="";
 $("q").textContent=x.q;$("ans").replaceChildren();
 x.opts.forEach((o,i)=>{const b=el("button",(i+1)+". "+o);b.dataset.v=o;b.onclick=()=>answer(b,o);$("ans").appendChild(b)});
 $("fifty").disabled=!S.fifty;$("fifty").textContent="50:50 ("+S.fifty+")";
 $("say").classList.toggle("hide",!window.speechSynthesis);
 hud();paint();
}
function hud(){
 const m=S.mode;
 $("qn").textContent=(m==="classic"||m==="practice")?"Q "+Math.min(S.idx+1,ROUND)+"/"+ROUND:"Q "+(S.idx+1);
 $("lv").textContent=m==="survival"?"❤️".repeat(Math.max(0,S.lives))+"🖤".repeat(3-Math.max(0,S.lives)):MODES[m][0]+" "+MODES[m][1];
 $("sc").textContent=m==="practice"?"RIGHT "+S.right:"SCORE "+S.score;
}
function paint(){
 const m=S.mode,f=$("fill");let v=100,t="NO TIMER";
 if(m==="time"){v=S.clock/60*100;t="TIME "+Math.ceil(S.clock)}
 else if(m!=="practice"){v=S.left/TIME()*100;t="TIME "+Math.max(0,Math.ceil(S.left))}
 $("tm").textContent=t;f.style.width=Math.max(0,v)+"%";f.classList.toggle("low",m!=="practice"&&v<=30);
}
function loop(){
 if(!S.on||S.locked||document.hidden)return;
 if(S.mode==="time"){S.clock-=.25;paint();if(S.clock<=0){finish()}}
 else if(S.mode!=="practice"){S.left-=.25;paint();if(S.left<=0)answer(null,null)}
}
function answer(btn,val){
 if(S.locked||!S.on)return;S.locked=true;clearTimeout(adv);
 if(window.speechSynthesis)speechSynthesis.cancel();
 const x=S.cur,ok=val===x.c,m=S.mode,t=m==="time";
 [...$("ans").children].forEach(b=>{b.disabled=true;if(b.dataset.v===x.c)b.classList.add("right")});
 if(btn&&!ok)btn.classList.add("wrong");
 S.idx++;
 if(ok){S.streak++;S.right++;S.best=Math.max(S.best,S.streak);
  const pts=m==="practice"?0:100+(t?0:Math.round(Math.max(0,S.left)/TIME()*50))+(S.streak-1)*10;S.score+=pts;
  $("gmsg").textContent="CORRECT!"+(pts?" +"+pts:"")+(S.streak>1?"  🔥 "+S.streak+" IN A ROW!":"");beep(660,.1);beep(880,.14,.1);
  if(t&&S.streak%5===0){S.clock=Math.min(60,S.clock+3);$("gmsg").textContent+=" +3 SECONDS"}}
 else{S.streak=0;S.missed.push({q:x.q,c:x.c});if(m==="survival")S.lives--;if(t)S.clock=Math.max(0,S.clock-5);buzz();beep(160,.3);
  $("gmsg").textContent=(val===null?"TIME UP!":"OOPS!")+" THE ANSWER IS GREEN."+(t?" -5 SECONDS":"")}
 S.over=(m==="survival"&&S.lives<=0)||(t&&S.clock<=0)||((m==="classic"||m==="practice")&&S.idx>=ROUND);
 hud();paint();
 if(!t){$("why").textContent="💡 "+x.why;const nb=$("nxt");nb.textContent=S.over?"FINISH ▶":"NEXT ▶";nb.classList.remove("hide");nb.focus({preventScroll:true})}
 if(m!=="practice")adv=setTimeout(go,t?900:6000);
}
function go(){if(!S.locked||!S.on)return;clearTimeout(adv);S.over?finish():next()}
$("nxt").onclick=go;
$("fifty").onclick=()=>{if(S.locked||!S.fifty)return;S.fifty--;let n=0;
 shuffle([...$("ans").children]).forEach(b=>{if(n<2&&b.dataset.v!==S.cur.c&&!b.disabled){b.disabled=true;b.classList.add("gone");n++}});
 $("fifty").textContent="50:50 ("+S.fifty+")";$("fifty").disabled=!S.fifty;beep(440,.1)};
$("say").onclick=()=>{if(!window.speechSynthesis||!S.cur)return;speechSynthesis.cancel();
 speechSynthesis.speak(new SpeechSynthesisUtterance(S.cur.q+". "+S.cur.opts.map((o,i)=>"Option "+(i+1)+". "+o).join(". ")))};
$("quit").onclick=()=>{
 if(S.sure){S.sure=0;S.on=false;clearInterval(timer);clearTimeout(adv);if(window.speechSynthesis)speechSynthesis.cancel();show("start");return}
 S.sure=1;$("quit").textContent="SURE? ✖";setTimeout(()=>{S.sure=0;$("quit").textContent="✖ QUIT"},3000)};

async function finish(){
 if(!S.on)return;S.on=false;clearInterval(timer);clearTimeout(adv);if(window.speechSynthesis)speechSynthesis.cancel();
 show("end");
 const m=S.mode,pr=m==="practice",ratio=S.right/Math.max(1,S.idx);
 $("final").textContent=pr?S.right+" / "+S.idx:S.score;
 const g=ratio>=.9?"CYBER CHAMPION 🏆":ratio>=.7?"SECURITY PRO 🛡️":ratio>=.4?"RISING DEFENDER ⭐":"KEEP TRAINING 💪";
 $("rank").textContent=g+" · "+S.right+" RIGHT · BEST STREAK "+S.best;
 const pk="cq-best-"+S.level+"-"+m,pb=+store(pk)||0,isPB=!pr&&S.score>pb;if(isPB)store(pk,String(S.score));
 $("pbline").textContent=pr?"":isPB?(pb?"NEW PERSONAL BEST!":"FIRST SCORE SET!"):"YOUR BEST: "+pb;
 const have=jget("cq-badges",[]),got=[],aw=id=>{if(!have.includes(id)){have.push(id);got.push(id)}};
 aw("first");if(m==="classic"&&S.right===ROUND)aw("perfect");if(S.best>=5)aw("s5");if(S.best>=10)aw("s10");
 if(m==="survival"&&S.right>=12)aw("surv");if(m==="time"&&S.right>=8)aw("speed");if(isPB&&pb)aw("pb");
 const tried=jget("cq-modes",[]);if(!tried.includes(m)){tried.push(m);store("cq-modes",JSON.stringify(tried))}
 if(Object.keys(MODES).every(k=>tried.includes(k)))aw("all");
 store("cq-badges",JSON.stringify(have));renderBadges();
 $("newb").textContent=got.length?"NEW BADGE: "+got.map(k=>BADGES[k][0]+" "+BADGES[k][1]).join(", "):"";
 const mi=$("missed");mi.replaceChildren();
 if(S.missed.length){mi.appendChild(el("b","REVIEW THESE:"));S.missed.slice(0,5).forEach(r=>{const p=el("p",r.q+" → ");p.appendChild(el("span",r.c));mi.appendChild(p)})}
 shareText="I scored "+S.score+" in "+MODES[m][1]+" ("+LEVELS[S.level]+") on Cyber Defender - "+g.replace(/\s\S+$/,"")+"! Can you beat me?";
 $("share").classList.toggle("hide",pr);
 jingle(ratio>=.7?[523,659,784,1047]:[392,330,262]);
 if(pr||!S.idx){$("emsg").textContent=pr?"PRACTICE SCORES AREN’T SAVED":"";return}
 $("emsg").textContent="SAVING SCORE...";
 const ok=await saveScore();
 $("emsg").textContent=ok==="db"?"SCORE SAVED TO LEADERBOARD!":ok==="local"?"SAVED ON THIS DEVICE ONLY":"COULD NOT SAVE SCORE";
 tabL=S.level;tabM=m;drawTabs();loadBoard();
}
$("share").onclick=async()=>{const t=shareText+(location.protocol.indexOf("http")===0?" "+location.href:"");
 try{if(navigator.share)await navigator.share({text:t});else{await navigator.clipboard.writeText(t);$("emsg").textContent="COPIED TO CLIPBOARD!"}}catch(e){}};

// ---- leaderboard ----
async function saveScore(){
 const rec={name:S.name,avatar:S.avatar,score:S.score,level:S.level,mode:S.mode,at:Date.now()};myLast=rec;
 if(db){try{await db.collection("scores").add(rec);return"db"}catch(e){}}
 const l=jget("cq-scores",[]);l.push(rec);l.sort((a,b)=>b.score-a.score);
 return store("cq-scores",JSON.stringify(l.slice(0,100)))===null?null:"local";
}
function renderBoard(){
 const tb=$("lb");tb.replaceChildren();
 const l=cache.filter(s=>s&&s.level===tabL&&(s.mode||"classic")===tabM).sort((a,b)=>b.score-a.score).slice(0,10);
 if(!l.length){const c=tb.insertRow().insertCell();c.colSpan=3;c.textContent="NO SCORES YET - BE THE FIRST!"}
 l.forEach((s,i)=>{const r=tb.insertRow();
  if(myLast&&s.at===myLast.at&&s.name===myLast.name&&s.score===myLast.score)r.className="me";
  [["🥇","🥈","🥉"][i]||i+1,(s.avatar||"👾")+" "+s.name,s.score].forEach(v=>{r.insertCell().textContent=v})});
 $("lbnote").textContent=note;
}
function setBoard(list,n){cache=list;note=n;renderBoard()}
function loadBoard(){
 if(db){
  if(unsub)return;
  const t=setTimeout(()=>setBoard(jget("cq-scores",[]),"SHOWING THIS DEVICE ONLY"),10000);
  unsub=db.collection("scores").orderBy("score","desc").limit(100).onSnapshot(
   s=>{clearTimeout(t);setBoard(s.docs.map(d=>d.data()),"SHARED ONLINE LEADERBOARD")},
   ()=>{clearTimeout(t);unsub=null;setBoard(jget("cq-scores",[]),"SHOWING THIS DEVICE ONLY")});
 }else setBoard(jget("cq-scores",[]),"SCORES SAVED ON THIS DEVICE");
}

// ---- keyboard + controller ----
function move(dir){
 const list=[...document.querySelectorAll("button,input")].filter(e=>!e.disabled&&e.offsetParent!==null);
 const cur=document.activeElement;
 if(!list.includes(cur)){const f=list.find(e=>e.tagName==="BUTTON")||list[0];if(f)f.focus();return}
 const c=e=>{const r=e.getBoundingClientRect();return[r.left+r.width/2,r.top+r.height/2]},[cx,cy]=c(cur);
 const vert=dir==="up"||dir==="down";let best=null,bs=1e9;
 list.forEach(e=>{if(e===cur)return;const[x,y]=c(e),dx=x-cx,dy=y-cy;
  const f=dir==="down"?dy:dir==="up"?-dy:dir==="right"?dx:-dx,o=vert?Math.abs(dx):Math.abs(dy);
  if(f>4&&f+o*2<bs){bs=f+o*2;best=e}});
 if(best){best.focus();best.scrollIntoView({block:"nearest"});beep(300,.04)}
}
function press(k){
 const inGame=!$("game").classList.contains("hide"),inEnd=!$("end").classList.contains("hide");
 if(inGame){
  if(k==="select")return $("quit").click();
  if(S.locked){if(["a","b","x","y","start"].includes(k))go();return}
  const i={a:0,b:1,x:2,y:3}[k];
  if(i!==undefined&&$("ans").children[i])return $("ans").children[i].click();
  if(k==="lb")$("fifty").click();if(k==="rb")$("say").click();return;
 }
 if(k==="start")return(inEnd?$("again"):$("play")).click();
 if(k==="b"&&inEnd)return $("again").click();
 if(k==="a"){const a=document.activeElement;if(a&&a.tagName==="BUTTON")a.click();return}
 if(["up","down","left","right"].includes(k))move(k);
}
document.addEventListener("keydown",e=>{
 const inGame=!$("game").classList.contains("hide");
 if(inGame){
  if(e.key==="Escape")return $("quit").click();
  const n=+e.key;if(n>=1&&n<=4&&!S.locked&&$("ans").children[n-1]){$("ans").children[n-1].click();return}
  if(S.locked&&(e.key==="Enter"||e.key===" ")&&document.activeElement.id!=="nxt"){e.preventDefault();go()}
  return;
 }
 const d={ArrowUp:"up",ArrowDown:"down",ArrowLeft:"left",ArrowRight:"right"}[e.key];
 if(d&&e.target.tagName!=="INPUT"){e.preventDefault();move(d)}
});
function poll(){
 const gp=[...(navigator.getGamepads?navigator.getGamepads():[])].find(g=>g&&g.connected);
 if(gp){rumble=gp;$("pad").classList.remove("hide");document.body.classList.add("padmode");
  const ax=gp.axes||[],cur={};
  for(const k in PAD)cur[k]=!!(gp.buttons[PAD[k]]&&gp.buttons[PAD[k]].pressed);
  cur.left=cur.left||ax[0]<-.6;cur.right=cur.right||ax[0]>.6;cur.up=cur.up||ax[1]<-.6;cur.down=cur.down||ax[1]>.6;
  for(const k in cur)if(cur[k]&&!prev[k])press(k);
  prev=cur;
 }else if(rumble){rumble=null;$("pad").classList.add("hide");document.body.classList.remove("padmode")}
 requestAnimationFrame(poll);
}

// ---- boot (runs last, after everything above exists) ----
(function init(){
 const nm=store("cq-name");if(nm)$("nm").value=nm.slice(0,10);
 const lv=store("cq-level"),md=store("cq-mode");if(LEVELS[lv])S.level=lv;if(MODES[md])S.mode=md;
 const av=store("cq-avatar");if(AVATARS.includes(av))S.avatar=av;
 if(store("cq-big")==="1"){document.documentElement.classList.add("big");$("big").setAttribute("aria-pressed","true")}
 drawSound();drawStart();drawTabs();renderBadges();
 setBoard(jget("cq-scores",[]),"LOADING...");
 requestAnimationFrame(poll);
 (async()=>{try{db=window.claude?await claude.use("db"):null}catch(e){db=null}loadBoard()})();
})();
