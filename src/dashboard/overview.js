/* Overview dashboard */
import { h, td, BG, DOC, card, Bd } from './core.js';

function Dash({db,go}){
 const t=td(),n=db.fb.length,av=n?(db.fb.reduce((a,x)=>a+x.r,0)/n).toFixed(1):'–';
 const lowM=db.meds.filter(m=>m.stock<20||m.exp<t),lowB=BG.filter(g=>db.blood[g]<3),pend=db.breq.filter(r=>r.status==='pending'),sos=db.calls.filter(c=>c.st==='waiting'),labs=db.labs.filter(x=>x.status!=='reported');
 const K=[['🧑‍⚕️','Patients waiting',db.queue.filter(x=>x.date===t&&x.status==='waiting').length,'queue','bl'],['💊','Low / expired meds',lowM.length,'pharm','y'],['🩸','Blood units',Object.values(db.blood).reduce((a,b)=>a+b,0),'blood','r'],['🧪','Pending lab tests',labs.length,'lab','bl'],['🚑','Ambulances free',db.amb.filter(a=>a.st==='available').length,'amb','g'],['🛏️','Free beds',db.beds.filter(b=>!b.p).length,'beds','g'],['⭐','Avg. rating',av,'fb','y'],['₹','Pharmacy sales',db.sales.reduce((a,x)=>a+x.amt,0),'pharm','g']];
 const A=[...sos.map(c=>['🚨 '+c.pr+' call from '+c.c+' awaiting dispatch','amb','r']),...lowM.map(m=>['💊 '+m.name+(m.exp<t?' expired':' low ('+m.stock+')'),'pharm','y']),...lowB.map(g=>['🩸 '+g+' blood critically low ('+db.blood[g]+')','blood','r']),...pend.map(r=>['🩸 '+r.u+' unit(s) '+r.g+' requested for '+r.patient,'blood','y'])];
 const mx=Math.max(1,...BG.map(g=>db.blood[g])),LG=db.log||[];
 return h('div',null,
  h('div',{className:'kpis'},K.map(x=>h('div',{className:'kpi',key:x[1],onClick:()=>go(x[3])},h('i',{className:'ic '+x[4]},x[0]),h('div',null,h('span',{className:'mu'},x[1]),h('b',null,x[1]==='Pharmacy sales'?'₹'+x[2]:x[2]))))),
  h('div',{className:'cols'},
   card('Needs attention',A.length?A.map((a,i)=>h('div',{key:i,className:'alert '+a[2],onClick:()=>go(a[1])},a[0])):h('div',{className:'mu'},'✅ All clear — nothing needs attention.')),
   card('Doctors · now serving',DOC.map(d=>{const q=db.queue.filter(x=>x.doc===d&&x.date===t),s=q.find(x=>x.status==='serving');return h('div',{className:'li',key:d},h('span',{className:'dr'},h('i',{className:'av'},d.split(' ')[1][0]),d),h('span',null,h(Bd,{c:s?'g':''},s?'#'+s.token:'idle'),' ',h('span',{className:'mu'},q.filter(x=>x.status==='waiting').length+' waiting')))}))),
  h('div',{className:'cols'},
   card('Blood stock by group',h('div',{className:'chart'},BG.map(g=>h('div',{key:g},h('em',null,db.blood[g]),h('i',{style:{height:db.blood[g]/mx*80+'px',background:db.blood[g]<3?'var(--er)':'var(--pr)'}}),g)))),
   card('Bed occupancy',['General','ICU','Private'].map(w=>{const l=db.beds.filter(b=>b.w===w),o=l.filter(b=>b.p).length;return h('div',{key:w,style:{marginBottom:12}},h('div',{className:'li'},h('span',null,w),h('span',{className:'mu'},o+'/'+l.length)),h('div',{className:'bar'},h('i',{style:{width:(l.length?o/l.length*100:0)+'%',background:o===l.length?'var(--er)':'var(--ok)'}})))}))),
  card('Recent activity',LG.length?LG.map((x,i)=>h('div',{key:i,className:'li'},h('span',null,x.m),h('span',{className:'mu'},x.t))):h('div',{className:'mu'},'Actions you take will appear here.')));
}

export { Dash };
