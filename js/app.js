/* App shell: sidebar + topbar + routing */
const MODS=[['dash','Overview',Dash,'📊','Live snapshot of the whole hospital'],['queue','Appointments',Queue,'🗓️','Issue tokens and run the live doctor queue'],['beds','Rooms & Beds',Beds,'🛏️','Admit and discharge patients'],['pharm','Pharmacy',Pharm,'💊','Dispense medicines and manage stock'],['lab','Laboratory',Lab,'🧪','Order tests and report results'],['blood','Blood Bank',Blood,'🩸','Donations, stock and requests'],['amb','Ambulance',Amb,'🚑','Fleet and emergency dispatch'],['fb','Feedback',FB,'⭐','Patient ratings and comments']];
const GROUPS=[['Main',['dash']],['Patient care',['queue','beds']],['Services',['pharm','lab','blood']],['Emergency & quality',['amb','fb']]];
function App(){
 const [db,setDb]=useState(load),[tab,setTab]=useState(()=>{const k=location.hash.slice(1);return MODS.some(m=>m[0]===k)?k:'dash'}),[msg,setMsg]=useState(''),[open,setOpen]=useState(false);
 const set=(k,f)=>setDb(d=>{const n={...d,[k]:f(d[k])};try{localStorage.setItem(K,JSON.stringify(n))}catch(e){}return n});
 useEffect(()=>{const f=e=>{if(e.key===K)setDb(load())};addEventListener('storage',f);return()=>removeEventListener('storage',f)},[]);
 const toast=m=>{setMsg(m);setTimeout(()=>setMsg(''),2500);if(!/^(Enter|Invalid|Only|No |Allow|Insufficient|Name|Caller|Medicine is)/.test(m))set('log',a=>[{t:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}),m},...(a||[])].slice(0,8))};
 const [th,setTh]=useState(()=>{let v=null;try{v=localStorage.getItem('sc_theme')}catch(e){}return v||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')});
 useEffect(()=>{document.documentElement.dataset.theme=th;try{localStorage.setItem('sc_theme',th)}catch(e){}},[th]);
 const t=td(),B={queue:db.queue.filter(x=>x.date===t&&x.status==='waiting').length,pharm:db.meds.filter(m=>m.stock<20||m.exp<t).length,lab:db.labs.filter(x=>x.status!=='reported').length,blood:db.breq.filter(r=>r.status==='pending').length,amb:db.calls.filter(c=>c.st==='waiting').length};
 const nav=k=>{setTab(k);history.replaceState(null,'','#'+k);setOpen(false);scrollTo(0,0)},M=MODS.find(m=>m[0]===tab)||MODS[0];
 return h('div',{className:'app'+(open?' open':'')},
  h('aside',{className:'side'},h('div',{className:'logo'},h('i',null,'+'),h('div',null,h('b',null,'SmartCare'),h('span',null,'Hospital Suite'))),
   GROUPS.map(g=>h('div',{key:g[0]},h('div',{className:'grp'},g[0]),g[1].map(k=>{const m=MODS.find(x=>x[0]===k);return h('a',{key:k,className:tab===k?'on':'',onClick:()=>nav(k)},h('span',null,m[3]),h('em',null,m[1]),B[k]>0&&h('u',null,B[k]))}))),
   h('div',{className:'sfoot'},h('a',{href:'index.html',style:{padding:0,color:'#7dd3c8'}},'← Back to website'),h('div',null,'Demo data · saved in your browser'))),
  h('div',{className:'scrim',onClick:()=>setOpen(false)}),
  h('div',{className:'content'},
   h('header',null,h('button',{className:'burger',onClick:()=>setOpen(true)},'☰'),h('div',{className:'ttl'},h('h1',null,M[1]),h('span',{className:'mu'},M[4])),h('span',{className:'mu date'},new Date().toLocaleDateString([],{weekday:'long',day:'numeric',month:'short',year:'numeric'})),
    h('span',{className:'user'},h('i',{className:'av'},'A'),h('b',null,'Admin')),Btn(th==='dark'?'☀️':'🌙',()=>setTh(th==='dark'?'light':'dark'),'ico'),Btn('Reset demo',()=>{if(confirm('Reset all modules to demo data?')){const s=seed();setDb(s);try{localStorage.setItem(K,JSON.stringify(s))}catch(e){}toast('Demo data restored')}},'dng')),
   h('main',null,h(Hero,{k:tab,name:M[1]}),h(M[2],{db,set,toast,go:nav}))),
  msg&&h('div',{className:'toast'},msg));
}
ReactDOM.createRoot(document.getElementById('root')).render(h(App));
