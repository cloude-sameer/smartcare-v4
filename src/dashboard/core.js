/* ============================================================
   DATA
   ============================================================ */
const h=React.createElement,{useState,useEffect}=React,K='smartcare_suite_v1',id=()=>Math.random().toString(36).slice(2,8);
const ad=n=>{const d=new Date(Date.now()+n*864e5);return new Date(d-d.getTimezoneOffset()*6e4).toISOString().slice(0,10)},td=()=>ad(0);
const BG=['A+','A-','B+','B-','AB+','AB-','O+','O-'];
const CAN={'A+':['A+','A-','O+','O-'],'A-':['A-','O-'],'B+':['B+','B-','O+','O-'],'B-':['B-','O-'],'AB+':BG,'AB-':['AB-','A-','B-','O-'],'O+':['O+','O-'],'O-':['O-']};
const DOC=['Dr. Sharma (Cardiology)','Dr. Mehta (General)','Dr. Singh (Pediatrics)','Dr. Rao (Orthopedics)'];
const TESTS={'CBC':300,'Blood Sugar':120,'Lipid Profile':600,'Thyroid (TSH)':450,'X-Ray':500,'Urine Routine':150};
const PR={Critical:0,High:1,Normal:2},DEPTS=[...DOC,'Pharmacy','Laboratory','Ambulance','Ward / Rooms'];
const seed=()=>{const t=td(),bd=[];[['General','G',6],['ICU','I',3],['Private','P',3]].forEach(w=>{for(let i=1;i<=w[2];i++)bd.push({id:w[1]+i,w:w[0],p:''})});bd[0].p='Ramesh Kumar';bd[6].p='Sunita Devi';
return{queue:[['Aarav Jain',1,1,'serving'],['Meera Kapoor',1,2,'waiting'],['Karan Verma',1,3,'waiting']].map(x=>({id:id(),patient:x[0],doc:DOC[x[1]],date:t,token:x[2],status:x[3]})),
meds:[['Paracetamol 500mg',120,2,ad(400)],['Amoxicillin 250mg',12,8,ad(200)],['Cetirizine 10mg',60,3,ad(300)],['Insulin Vial',15,350,ad(-5)]].map(x=>({id:id(),name:x[0],stock:x[1],price:x[2],exp:x[3]})),sales:[],
blood:{'A+':8,'A-':2,'B+':10,'B-':1,'AB+':3,'AB-':0,'O+':12,'O-':4},breq:[{id:id(),patient:'Mohan Lal',g:'B-',u:2,status:'pending'}],donors:[],
labs:[{id:id(),patient:'Aarav Jain',test:'CBC',price:300,status:'ordered',res:''}],
amb:['AMB-01','AMB-02','AMB-03','AMB-04'].map((x,i)=>({id:x,st:i===3?'maintenance':'available'})),calls:[],beds:bd,fb:[{id:id(),patient:'Sita',dept:DOC[1],r:5,c:'Very quick service!'}]}};
const load=()=>{try{const v=JSON.parse(localStorage.getItem(K));if(v&&v.queue&&v.beds)return v}catch(e){}return seed()};

/* ============================================================
   COMPONENTS
   ============================================================ */
const card=(t,...c)=>h('div',{className:'card'},h('h2',null,t),...c);
const Bd=({c,children})=>h('span',{className:'b '+(c||'')},children);
function Tbl({cols,rows}){const [q,setQ]=useState(''),f=q.trim().toLowerCase(),R=f?rows.filter(r=>JSON.stringify(r).toLowerCase().includes(f)):rows;
return h('div',{className:'tw'},rows.length>4&&h('input',{className:'sr',placeholder:'🔍 Search…',value:q,onChange:e=>setQ(e.target.value),style:{marginBottom:8}}),h('table',null,h('thead',null,h('tr',null,cols.map(c=>h('th',{key:c[0]},c[0])))),h('tbody',null,R.length?R.map(r=>h('tr',{key:r.id},cols.map(c=>h('td',{key:c[0]},c[1](r))))):h('tr',null,h('td',{colSpan:cols.length,className:'mu'},f?'No matches.':'Nothing here yet.')))))}
function Form({f,go,btn}){
 const init=()=>Object.fromEntries(f.map(x=>[x.k,x.v!==undefined?x.v:x.o?x.o[0]:'']));
 const [v,setV]=useState(init),s=(k,e)=>setV({...v,[k]:e.target.value});
 return h('div',{className:'row'},f.map(x=>h('div',{key:x.k},h('label',null,x.l),x.o?h('select',{value:v[x.k],onChange:e=>s(x.k,e)},x.o.map(o=>h('option',{key:o},o))):h('input',{type:x.t||'text',min:x.t==='number'?1:undefined,value:v[x.k],onChange:e=>s(x.k,e)}))),h('div',{style:{alignSelf:'end'}},h('button',{className:'pri',onClick:()=>go(v)&&setV(init())},btn)));
}
const Btn=(l,fn,c,d)=>h('button',{key:l,className:c||'',disabled:d,onClick:fn},l);

