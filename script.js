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

function seenGet(){try{return JSON.parse(localStorage.getItem("cyberquiz-seen-"+level)||"[]")}catch(e){return[]}}
function seenSet(v){try{localStorage.setItem("cyberquiz-seen-"+level,JSON.stringify(v))}catch(e){}}
function start(){
 // random draw from the whole pool, skipping questions already used recently so rounds don't repeat
 const pool=BANK[level];let seen=seenGet();
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
