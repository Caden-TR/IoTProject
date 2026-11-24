// [question, correct answer, wrong, wrong, wrong]
const BANK={
 junior:[
  ["What makes a strong password?","A long mix of letters, numbers and symbols","Your pet’s name","123456","Your birthday"],
  ["Who can you share your password with?","Only a trusted adult like a parent","Your best friend","Anyone who asks nicely","Everyone in your class"],
  ["A stranger online asks where you live. What do you do?","Don’t answer and tell a trusted adult","Tell them your street","Send a photo of your house","Give them a fake name, then your address"],
  ["What is a computer virus?","A harmful program that can damage files","A bug living in the keyboard","A type of game","A fast internet connection"],
  ["A pop-up says “You won a free phone! Click here!” What now?","Close it and don’t click","Click it fast","Type in your details","Share it with friends"],
  ["What does the padlock in the browser bar mean?","The connection is encrypted","The site is 100% safe","The site is only for kids","The site is free"],
  ["Which is OK to share online?","Your favourite colour","Your home address","Your phone number","Your password"],
  ["Why should you update your apps and devices?","To fix security holes","To make them slower","To delete your photos","You never need to"],
  ["Someone sends you a mean message. Best action?","Don’t reply, save it and tell a trusted adult","Reply with something meaner","Secretly delete your account","Forward it to everyone"],
  ["What is a username for?","Naming your account without showing your real name","Keeping your password","Hiding viruses","Paying for games"]],
 mid:[
  ["What is phishing?","Tricking you into giving away personal info","Catching fish online","A type of firewall","Speeding up Wi-Fi"],
  ["What is two-factor authentication (2FA)?","A second proof of identity when you log in","Two identical passwords","Logging in twice","Using two devices at once"],
  ["You are on café public Wi-Fi. Safest choice?","Avoid logging into important accounts","Do your online banking","Share files with strangers","Turn off your antivirus"],
  ["What does a firewall do?","Filters network traffic to block threats","Cools your computer","Deletes old files","Boosts game speed"],
  ["Best way to keep lots of passwords safe?","A password manager","A sticky note on the monitor","One password everywhere","A file called passwords.txt"],
  ["What is malware?","Software designed to cause harm","A broken keyboard","A free antivirus","A backup tool"],
  ["Which is a common sign of a phishing email?","Urgent threats and a suspicious sender address","Your name spelt correctly","A message from a friend you know","A plain text email"],
  ["Why is reusing one password dangerous?","One leak exposes all your accounts","It uses more memory","It is illegal","It slows websites down"],
  ["What is a digital footprint?","The trail of data you leave online","Footprints on a keyboard","The size of a device","A backup drive"],
  ["Why back up your files?","To recover them after loss or ransomware","To make your PC faster","To hide them","To use less storage"]],
 senior:[
  ["What does ransomware do?","Encrypts files and demands payment","Speeds up your PC","Blocks adverts","Backs up your data"],
  ["What is social engineering?","Manipulating people into revealing secrets","Building social networks","Coding a social app","Designing a firewall"],
  ["What does HTTPS add to HTTP?","Encryption of data in transit","Faster downloads","Free hosting","Anonymous browsing"],
  ["What is a DDoS attack?","Flooding a service with traffic to knock it offline","Stealing a password","Guessing a PIN","Cloning a SIM card"],
  ["What is a zero-day vulnerability?","A flaw unknown to the vendor with no patch yet","A bug fixed in zero days","A virus that lasts one day","A test with zero users"],
  ["What does a VPN mainly do?","Encrypts your traffic through a secure tunnel","Makes you immune to malware","Doubles your speed","Removes all tracking"],
  ["Why are passwords salted before hashing?","So identical passwords get different hashes","To make them shorter","To let admins read them","To speed up login"],
  ["What is a man-in-the-middle attack?","Secretly intercepting communication between two parties","A hacker in the same room","Hacking a manager’s PC","A faulty router"],
  ["What is the principle of least privilege?","Users get only the access they need","Everyone gets admin rights","Remove all passwords","Allow guests everywhere"],
  ["Why are smart (IoT) devices often targeted?","Weak default passwords and rare updates","They have large screens","They are always offline","They cannot use Wi-Fi"]]
};
const LEVELS={junior:"AGES 8-11",mid:"AGES 12-14",senior:"AGES 15-18"};
const SHORT={junior:"8-11",mid:"12-14",senior:"15-18"};
const ROUND=10,TIME=15;
const $=id=>document.getElementById(id);
let level="junior",name="",qs=[],idx=0,score=0,streak=0,left=TIME,timer=null,locked=false,db=null,myLast=null;

function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function show(id){["start","game","end"].forEach(s=>$(s).classList.toggle("hide",s!==id))}

// level buttons
Object.keys(LEVELS).forEach(k=>{const b=document.createElement("button");b.textContent=LEVELS[k];b.dataset.k=k;
 b.onclick=()=>{level=k;[...$("ages").children].forEach(c=>c.classList.toggle("on",c===b))};
 if(k===level)b.classList.add("on");$("ages").appendChild(b)});

$("play").onclick=()=>{
 name=$("nm").value.trim().toUpperCase();
 if(!name){$("smsg").textContent="TYPE YOUR NAME FIRST!";$("nm").focus();return}
 $("smsg").textContent="";start();
};
$("again").onclick=()=>{show("start")};

function start(){
 qs=shuffle(BANK[level]).slice(0,ROUND).map(r=>({q:r[0],c:r[1],opts:shuffle(r.slice(1))}));
 idx=0;score=0;streak=0;myLast=null;show("game");next();
}
function next(){
 if(idx>=qs.length)return finish();
 const x=qs[idx];locked=false;left=TIME;
 $("qn").textContent="Q "+(idx+1)+"/"+qs.length;$("sc").textContent="SCORE "+score;
 $("q").textContent=x.q;$("gmsg").textContent="";$("ans").replaceChildren();
 x.opts.forEach(o=>{const b=document.createElement("button");b.textContent=o;b.onclick=()=>answer(b,o);$("ans").appendChild(b)});
 tick();clearInterval(timer);timer=setInterval(()=>{left-=0.25;tick();if(left<=0)answer(null,null)},250);
}
function tick(){$("tm").textContent="TIME "+Math.max(0,Math.ceil(left));$("fill").style.width=Math.max(0,left/TIME*100)+"%"}
function answer(btn,val){
 if(locked)return;locked=true;clearInterval(timer);
 const x=qs[idx],ok=val===x.c;
 [...$("ans").children].forEach(b=>{b.disabled=true;if(b.textContent===x.c)b.classList.add("right")});
 if(btn&&!ok)btn.classList.add("wrong");
 if(ok){streak++;const pts=100+Math.round(Math.max(0,left)/TIME*50)+(streak-1)*10;score+=pts;
  $("gmsg").textContent="CORRECT! +"+pts+(streak>1?"  ("+streak+" IN A ROW!)":"")}
 else{streak=0;$("gmsg").textContent=val===null?"TIME UP!":"WRONG! THE ANSWER IS GREEN."}
 $("sc").textContent="SCORE "+score;
 idx++;setTimeout(next,1700);
}
async function finish(){
 show("end");$("final").textContent=score;
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
render(localScores(),"LOADING...");
(async()=>{try{db=await claude.use("db")}catch(e){db=null}loadBoard()})();
