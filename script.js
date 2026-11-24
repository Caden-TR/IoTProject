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
const SHORT={junior:"8-11",mid:"12-14",senior:"15-18"};
const ROUND=10,TIME=15;
const BLOCK=["FUCK","SHIT","CUNT","BITCH","DICK","SEX","NAZI","RAPE","PORN","ASS"];
const $=id=>document.getElementById(id);
let level="junior",tab="junior",name="",qs=[],idx=0,score=0,streak=0,best=0,left=TIME,timer=null,locked=false,db=null,myLast=null,sound=true,ac=null,cache=[];

function store(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function show(id){["start","game","end"].forEach(s=>$(s).classList.toggle("hide",s!==id))}
function beep(f,d){if(!sound)return;try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();const o=ac.createOscillator(),g=ac.createGain();o.type="square";o.frequency.value=f;g.gain.value=.05;o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+d)}catch(e){}}

function pills(box,cur,fn){box.replaceChildren();Object.keys(LEVELS).forEach(k=>{const b=document.createElement("button");b.textContent=LEVELS[k];b.setAttribute("aria-pressed",k===cur);if(k===cur)b.classList.add("on");b.onclick=()=>fn(k);box.appendChild(b)})}
function pickLevel(k){level=k;pills($("ages"),level,pickLevel)}
function pickTab(k){tab=k;pills($("tabs"),tab,pickTab);renderBoard()}
pickLevel("junior");pickTab("junior");
$("nm").value=(store("cyberquiz-name")||"").slice(0,10);
$("snd").onclick=()=>{sound=!sound;$("snd").textContent="SOUND: "+(sound?"ON":"OFF");$("snd").setAttribute("aria-pressed",sound)};

$("play").onclick=()=>{
 name=$("nm").value.trim().toUpperCase().replace(/[^A-Z0-9 _-]/g,"");
 if(!name){$("smsg").textContent="TYPE YOUR NAME FIRST!";$("nm").focus();return}
 if(BLOCK.some(w=>name.replace(/[^A-Z]/g,"").includes(w))){$("smsg").textContent="PICK A FRIENDLIER NAME!";$("nm").focus();return}
 store("cyberquiz-name",name);$("smsg").textContent="";start();
};
$("nm").addEventListener("keydown",e=>{if(e.key==="Enter")$("play").click()});
$("again").onclick=()=>show("start");
$("share").onclick=async()=>{try{if(navigator.share)await navigator.share({text:shareText,url:location.href});else{await navigator.clipboard.writeText(shareText+" "+location.href);$("emsg").textContent="COPIED TO CLIPBOARD!"}}catch(e){}};
$("nxt").onclick=()=>{clearTimeout(adv);next()};
document.addEventListener("keydown",e=>{
 if($("game").classList.contains("hide"))return;
 if(locked&&(e.key==="Enter"||e.key===" ")&&document.activeElement.tagName!=="BUTTON"){e.preventDefault();$("nxt").click();return}
 const n=parseInt(e.key,10),b=$("ans").children[n-1];if(!locked&&b)b.click()});

let adv=null,shareText="";
function start(){
 qs=shuffle(BANK[level]).slice(0,ROUND).map(r=>({q:r[0],c:r[1],opts:shuffle(r.slice(1,5)),why:r[5]}));
 clearTimeout(adv);idx=0;score=0;streak=0;best=0;myLast=null;show("game");next();
}
function next(){
 if(idx>=qs.length)return finish();
 const x=qs[idx];locked=false;left=TIME;
 $("nxt").style.display="none";$("why").textContent="";$("gmsg").textContent="";
 $("qn").textContent="Q "+(idx+1)+"/"+qs.length;$("sc").textContent="SCORE "+score;
 $("q").textContent=x.q;$("ans").replaceChildren();
 x.opts.forEach((o,i)=>{const b=document.createElement("button");b.textContent=(i+1)+". "+o;b.onclick=()=>answer(b,o);$("ans").appendChild(b)});
 clearInterval(timer);tick();timer=setInterval(()=>{left-=0.25;tick();if(left<=0)answer(null,null)},250);
}
function tick(){$("tm").textContent="TIME "+Math.max(0,Math.ceil(left));const f=$("fill");f.style.width=Math.max(0,left/TIME*100)+"%";f.classList.toggle("low",left<=5)}
function answer(btn,val){
 if(locked)return;locked=true;clearInterval(timer);
 const x=qs[idx],ok=val===x.c;
 [...$("ans").children].forEach(b=>{b.disabled=true;if(b.textContent.slice(3)===x.c)b.classList.add("right")});
 if(btn&&!ok)btn.classList.add("wrong");
 if(ok){streak++;best=Math.max(best,streak);const pts=100+Math.round(Math.max(0,left)/TIME*50)+(streak-1)*10;score+=pts;beep(660,.12);setTimeout(()=>beep(880,.15),120);
  $("gmsg").textContent="CORRECT! +"+pts+(streak>1?"  ("+streak+" IN A ROW!)":"")}
 else{streak=0;beep(160,.3);$("gmsg").textContent=val===null?"TIME UP! THE ANSWER IS GREEN.":"WRONG! THE ANSWER IS GREEN."}
 $("why").textContent="💡 "+x.why;$("sc").textContent="SCORE "+score;
 idx++;$("nxt").style.display="block";$("nxt").textContent=idx>=qs.length?"FINISH ▶":"NEXT ▶";$("nxt").focus({preventScroll:true});
 adv=setTimeout(next,6000);
}
async function finish(){
 show("end");$("final").textContent=score;
 const max=qs.length*160;
 const g=score>=max*.7?"CYBER CHAMPION 🏆":score>=max*.45?"SECURITY PRO 🛡️":score>=max*.2?"RISING DEFENDER ⭐":"KEEP TRAINING 💪";
 const pk="cyberquiz-best-"+level,pb=+store(pk)||0,isPB=score>pb;if(isPB)store(pk,String(score));
 $("rank").textContent=g+" · BEST STREAK "+best+(isPB?" · NEW PERSONAL BEST!":" · YOUR BEST "+pb);
 shareText="I scored "+score+" on Cyber Defender ("+LEVELS[level]+") - "+g.replace(/\s?\S+$/,"")+"! Can you beat me?";
 $("emsg").textContent="SAVING SCORE...";
 const ok=await saveScore();
 $("emsg").textContent=ok==="db"?"SCORE SAVED TO LEADERBOARD!":ok==="local"?"SAVED ON THIS DEVICE ONLY":"COULD NOT SAVE SCORE";
 pickTab(level);loadBoard();
}

// ---------- leaderboard ----------
const LKEY="cyberquiz-scores";
function localScores(){try{return JSON.parse(store(LKEY)||"[]")}catch(e){return[]}}
async function saveScore(){
 const rec={name,score,level,at:Date.now()};myLast=rec;
 if(db){try{await db.collection("scores").add(rec);return"db"}catch(e){}}
 try{const l=localScores();l.push(rec);l.sort((a,b)=>b.score-a.score);store(LKEY,JSON.stringify(l.slice(0,60)));return"local"}catch(e){return null}
}
let note="LOADING...";
function renderBoard(){
 const tb=$("lb");tb.replaceChildren();
 const list=cache.filter(s=>s&&s.level===tab).sort((a,b)=>b.score-a.score).slice(0,10);
 if(!list.length){const c=tb.insertRow().insertCell();c.colSpan=4;c.textContent="NO SCORES YET - BE THE FIRST!"}
 list.forEach((s,i)=>{const r=tb.insertRow();
  if(myLast&&s.name===myLast.name&&s.score===myLast.score&&s.at===myLast.at)r.className="me";
  [i+1,s.name,SHORT[s.level]||"",s.score].forEach(v=>{r.insertCell().textContent=v})});
 $("lbnote").textContent=note;
}
function setBoard(list,n){cache=list;note=n;renderBoard()}
let unsub=null;
function loadBoard(){
 if(db){
  if(unsub)return;
  const t=setTimeout(()=>setBoard(localScores(),"SHOWING THIS DEVICE ONLY"),10000);
  unsub=db.collection("scores").orderBy("score","desc").limit(60).onSnapshot(
   s=>{clearTimeout(t);setBoard(s.docs.map(d=>d.data()),"SHARED ONLINE LEADERBOARD")},
   ()=>{clearTimeout(t);unsub=null;setBoard(localScores(),"SHOWING THIS DEVICE ONLY")});
 }else setBoard(localScores(),"SCORES SAVED ON THIS DEVICE");
}
setBoard(localScores(),"LOADING...");
(async()=>{try{db=window.claude?await claude.use("db"):null}catch(e){db=null}loadBoard()})();
