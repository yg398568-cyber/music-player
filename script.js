const a=new Audio(),$=id=>document.getElementById(id);
let q=[],i=-1,shuf=false,rep=false;
const fmt=s=>isFinite(s)?Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0'):'0:00';
function render(){
  const l=$('list');
  if(!q.length){l.innerHTML='<li class="empty">القايمة فاضية</li>';return}
  l.innerHTML='';
  q.forEach((t,n)=>{const li=document.createElement('li');if(n===i)li.className='cur';
    li.innerHTML='<small>'+(n+1)+'</small><span></span>';li.querySelector('span').textContent=t.name;
    li.onclick=()=>load(n,true);l.appendChild(li)});
}
function load(n,go){
  if(n<0||n>=q.length)return;i=n;a.src=q[n].url;
  $('title').textContent=q[n].name;$('sub').textContent='أغنية '+(n+1)+' من '+q.length;
  render();if(go)a.play().catch(()=>{});
  if('mediaSession' in navigator)navigator.mediaSession.metadata=new MediaMetadata({title:q[n].name});
}
function nxt(){if(!q.length)return;load(shuf?Math.floor(Math.random()*q.length):(i+1)%q.length,true)}
function prv(){if(!q.length)return;if(a.currentTime>3){a.currentTime=0;return}load((i-1+q.length)%q.length,true)}
$('files').onchange=e=>{
  const was=q.length;
  [...e.target.files].forEach(f=>q.push({name:f.name.replace(/\.[^.]+$/,''),url:URL.createObjectURL(f)}));
  if(q.length&&i<0)load(0,true);else render();
  e.target.value='';
};
$('play').onclick=()=>{if(i<0)return;a.paused?a.play():a.pause()};
$('next').onclick=prv;$('prev').onclick=nxt;
$('shuf').onclick=e=>{shuf=!shuf;e.currentTarget.classList.toggle('act',shuf)};
$('rep').onclick=e=>{rep=!rep;e.currentTarget.classList.toggle('act',rep)};
a.onplay=()=>{$('play').textContent='❚❚';$('disc').classList.add('on')};
a.onpause=()=>{$('play').textContent='▶';$('disc').classList.remove('on')};
a.onloadedmetadata=()=>$('dur').textContent=fmt(a.duration);
a.ontimeupdate=()=>{$('cur').textContent=fmt(a.currentTime);if(a.duration)$('seek').value=a.currentTime/a.duration*100};
$('seek').oninput=e=>{if(a.duration)a.currentTime=e.target.value/100*a.duration};
a.onended=()=>{if(rep){a.currentTime=0;a.play()}else nxt()};
if('mediaSession' in navigator){
  navigator.mediaSession.setActionHandler('nexttrack',nxt);
  navigator.mediaSession.setActionHandler('previoustrack',prv);
}
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
