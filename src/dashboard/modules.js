/* ============================================================
   MODULE: QUEUE
   ============================================================ */
import { h, id, td, DOC, TESTS, PR, DEPTS, CAN, BG, card, Bd, Tbl, Form, Btn } from './core.js';
import { BloodHelp } from './art.js';

function Queue({db,set,toast}){
 const t=td(),q=db.queue.filter(x=>x.date===t).sort((a,b)=>a.doc.localeCompare(b.doc)||a.token-b.token);
 const add=v=>{if(v.p.trim().length<2)return toast('Enter patient name'),0;set('queue',a=>[...a,{id:id(),patient:v.p.trim(),doc:v.d,date:t,token:a.filter(x=>x.doc===v.d&&x.date===t).length+1,status:'waiting'}]);toast('Token issued');return 1};
 const st=(x,s)=>set('queue',a=>a.map(y=>y.id===x.id?{...y,status:s}:y));
 const call=x=>set('queue',a=>a.map(y=>y.id===x.id?{...y,status:'serving'}:y.doc===x.doc&&y.date===t&&y.status==='serving'?{...y,status:'done'}:y));
 const C={waiting:'y',serving:'g',done:'',cancelled:'r'};
 return h('div',null,card('Issue appointment token',h(Form,{f:[{k:'p',l:'Patient name'},{k:'d',l:'Doctor',o:DOC}],btn:'Get token',go:add})),
  card('Today\'s live queue',h('div',{className:'grid'},DOC.map(d=>{const s=q.find(x=>x.doc===d&&x.status==='serving');return h('div',{className:'stat',key:d,style:{cursor:'default'}},h('b',null,s?'#'+s.token:'—'),h('span',{className:'mu'},d))})),
  h(Tbl,{cols:[['Token',r=>'#'+r.token],['Patient',r=>r.patient],['Doctor',r=>r.doc],['Est. wait',r=>r.status==='waiting'?'~'+(q.filter(x=>x.doc===r.doc&&x.token<r.token&&['waiting','serving'].includes(x.status)).length*10)+' min':'–'],['Status',r=>h(Bd,{c:C[r.status]},r.status)],['',r=>h('div',{className:'x'},r.status==='waiting'&&Btn('Call',()=>call(r),'pri'),r.status==='serving'&&Btn('Done',()=>st(r,'done'),'pri'),r.status==='waiting'&&Btn('Cancel',()=>st(r,'cancelled'),'dng'))]],rows:q})));
}

/* ============================================================
   MODULE: PHARMACY
   ============================================================ */
function Pharm({db,set,toast}){
 const M=db.meds,ex=m=>m.exp<td();
 const disp=v=>{const m=M.find(x=>x.name===v.m),q=+v.q;if(!v.p.trim())return toast('Enter patient name'),0;if(!(q>0))return toast('Invalid quantity'),0;if(ex(m))return toast('Medicine is expired'),0;if(m.stock<q)return toast('Only '+m.stock+' in stock'),0;set('meds',a=>a.map(x=>x.id===m.id?{...x,stock:x.stock-q}:x));set('sales',a=>[...a,{id:id(),amt:q*m.price}]);toast('Dispensed. Bill ₹'+q*m.price);return 1};
 const add=v=>{if(v.n.trim().length<2||!v.e)return toast('Name and expiry required'),0;set('meds',a=>[...a,{id:id(),name:v.n.trim(),stock:+v.s||0,price:+v.p||0,exp:v.e}]);toast('Medicine added');return 1};
 return h('div',null,card('Dispense medicine',h(Form,{f:[{k:'m',l:'Medicine',o:M.map(m=>m.name)},{k:'q',l:'Quantity',t:'number',v:1},{k:'p',l:'Patient'}],btn:'Dispense',go:disp})),
  card('Add medicine',h(Form,{f:[{k:'n',l:'Name'},{k:'s',l:'Stock',t:'number',v:50},{k:'p',l:'Price ₹',t:'number',v:5},{k:'e',l:'Expiry',t:'date'}],btn:'Add',go:add})),
  card('Inventory',h(Tbl,{cols:[['Medicine',r=>r.name],['Stock',r=>h(Bd,{c:r.stock<20?'r':'g'},r.stock+(r.stock<20?' · low':''))],['Price',r=>'₹'+r.price],['Expiry',r=>h(Bd,{c:ex(r)?'r':''},r.exp+(ex(r)?' · expired':''))],['',r=>h('div',{className:'x'},Btn('+50 stock',()=>set('meds',a=>a.map(x=>x.id===r.id?{...x,stock:x.stock+50}:x))),Btn('Remove',()=>confirm('Remove '+r.name+'?')&&set('meds',a=>a.filter(x=>x.id!==r.id)),'dng'))]],rows:M})));
}

/* ============================================================
   MODULE: BLOODBANK
   ============================================================ */
function Blood({db,set,toast}){
 const don=v=>{if(v.n.trim().length<2)return toast('Enter donor name'),0;set('blood',b=>({...b,[v.g]:b[v.g]+(+v.u||1)}));set('donors',a=>[...a,{id:id(),n:v.n.trim(),g:v.g,u:+v.u||1,d:td()}]);toast('Donation recorded');return 1};
 const req=v=>{if(v.p.trim().length<2)return toast('Enter patient name'),0;set('breq',a=>[...a,{id:id(),patient:v.p.trim(),g:v.g,u:+v.u||1,status:'pending'}]);toast('Request logged');return 1};
 const issue=r=>{const o=[r.g,...CAN[r.g].filter(x=>x!==r.g)],s={...db.blood};let n=r.u;for(const g of o){const k=Math.min(s[g],n);s[g]-=k;n-=k;if(!n)break}if(n)return toast('Insufficient compatible stock');set('blood',()=>s);set('breq',a=>a.map(x=>x.id===r.id?{...x,status:'issued'}:x));toast('Blood issued')};
 return h('div',null,card('Blood stock (units)',h('div',{className:'grid'},BG.map(g=>h('div',{className:'stat',key:g,style:{cursor:'default'}},h('b',{style:{color:db.blood[g]<3?'var(--er)':'inherit'}},db.blood[g]),h('span',{className:'mu'},g+(db.blood[g]<3?' · low':'')))))),
  card('Record donation',h(Form,{f:[{k:'n',l:'Donor name'},{k:'g',l:'Group',o:BG},{k:'u',l:'Units',t:'number',v:1}],btn:'Add donation',go:don})),
  card('Request blood',h(Form,{f:[{k:'p',l:'Patient'},{k:'g',l:'Group needed',o:BG},{k:'u',l:'Units',t:'number',v:1}],btn:'Log request',go:req}),h('div',{className:'mu',style:{marginTop:8}},'Issuing uses the exact group first, then compatible groups.'),
  h(Tbl,{cols:[['Patient',r=>r.patient],['Group',r=>r.g],['Units',r=>r.u],['Status',r=>h(Bd,{c:r.status==='issued'?'g':'y'},r.status)],['',r=>r.status==='pending'&&Btn('Issue',()=>issue(r),'pri')]],rows:db.breq})),
  h(BloodHelp),card('Donor log ('+db.donors.length+')',h(Tbl,{cols:[['Donor',r=>r.n],['Group',r=>r.g],['Units',r=>r.u],['Date',r=>r.d]],rows:db.donors})));
}

/* ============================================================
   MODULE: LABORATORY
   ============================================================ */
function Lab({db,set,toast}){
 const add=v=>{if(v.p.trim().length<2)return toast('Enter patient name'),0;set('labs',a=>[...a,{id:id(),patient:v.p.trim(),test:v.t,price:TESTS[v.t],status:'ordered',res:''}]);toast('Test ordered');return 1};
 const upd=(r,o)=>set('labs',a=>a.map(x=>x.id===r.id?{...x,...o}:x));
 const rep=r=>{const v=prompt('Enter result for '+r.test+' ('+r.patient+'):');if(v&&v.trim())upd(r,{res:v.trim(),status:'reported'})};
 const C={ordered:'y',sampled:'bl',reported:'g'};
 return h('div',null,card('Order a lab test',h(Form,{f:[{k:'p',l:'Patient'},{k:'t',l:'Test',o:Object.keys(TESTS)}],btn:'Order',go:add}),h('div',{className:'mu',style:{marginTop:8}},'Revenue so far: ₹'+db.labs.reduce((a,x)=>a+x.price,0))),
  card('Lab orders',h(Tbl,{cols:[['Patient',r=>r.patient],['Test',r=>r.test],['Price',r=>'₹'+r.price],['Status',r=>h(Bd,{c:C[r.status]},r.status)],['Result',r=>r.res||'–'],['',r=>h('div',{className:'x'},r.status==='ordered'&&Btn('Collect sample',()=>upd(r,{status:'sampled'})),r.status==='sampled'&&Btn('Enter result',()=>rep(r),'pri'),r.status==='reported'&&Btn('Print',()=>{const w=window.open('','_blank');w?(w.document.write('<h2>SmartCare Lab Report</h2><p>Patient: '+r.patient.replace(/</g,'&lt;')+'</p><p>Test: '+r.test+'</p><p>Result: '+r.res.replace(/</g,'&lt;')+'</p>'),w.print()):toast('Allow pop-ups to print')}))]],rows:db.labs})));
}

/* ============================================================
   MODULE: AMBULANCE
   ============================================================ */
function Amb({db,set,toast}){
 const add=v=>{if(v.c.trim().length<2||v.l.trim().length<2)return toast('Caller and location required'),0;set('calls',a=>[...a,{id:id(),c:v.c.trim(),l:v.l.trim(),pr:v.p,st:'waiting',amb:''}]);toast('Emergency logged');return 1};
 const disp=r=>{const a=db.amb.find(x=>x.st==='available');if(!a)return toast('No ambulance available');set('amb',l=>l.map(x=>x.id===a.id?{...x,st:'busy'}:x));set('calls',l=>l.map(x=>x.id===r.id?{...x,st:'dispatched',amb:a.id}:x));toast(a.id+' dispatched')};
 const fin=r=>{set('amb',l=>l.map(x=>x.id===r.amb?{...x,st:'available'}:x));set('calls',l=>l.map(x=>x.id===r.id?{...x,st:'completed'}:x))};
 const tg=a=>a.st!=='busy'&&set('amb',l=>l.map(x=>x.id===a.id?{...x,st:x.st==='available'?'maintenance':'available'}:x));
 const rows=[...db.calls].sort((a,b)=>(a.st==='completed')-(b.st==='completed')||PR[a.pr]-PR[b.pr]);
 return h('div',null,card('Fleet (click a free vehicle to toggle maintenance)',h('div',{className:'grid'},db.amb.map(a=>h('div',{className:'stat',key:a.id,onClick:()=>tg(a)},h('b',{style:{fontSize:18}},a.id),h(Bd,{c:a.st==='available'?'g':a.st==='busy'?'r':'y'},a.st))))),
  card('Log emergency call',h(Form,{f:[{k:'c',l:'Caller / patient'},{k:'l',l:'Location'},{k:'p',l:'Priority',o:['Critical','High','Normal']}],btn:'Log call',go:add})),
  card('Emergency requests (priority order)',h(Tbl,{cols:[['Caller',r=>r.c],['Location',r=>r.l],['Priority',r=>h(Bd,{c:r.pr==='Critical'?'r':r.pr==='High'?'y':''},r.pr)],['Status',r=>r.st+(r.amb?' · '+r.amb:'')],['',r=>h('div',{className:'x'},r.st==='waiting'&&Btn('Dispatch',()=>disp(r),'pri'),r.st==='dispatched'&&Btn('Complete',()=>fin(r),'pri'))]],rows})));
}

/* ============================================================
   MODULE: BEDS
   ============================================================ */
function Beds({db,set,toast}){
 const click=b=>{if(b.p){if(confirm('Discharge '+b.p+' from '+b.id+'?')){set('beds',a=>a.map(x=>x.id===b.id?{...x,p:''}:x));toast('Patient discharged')}}else{const n=prompt('Admit patient to '+b.id+' – name:');if(n&&n.trim().length>1){set('beds',a=>a.map(x=>x.id===b.id?{...x,p:n.trim()}:x));toast('Admitted to '+b.id)}}};
 return card('Rooms & beds (green = free, red = occupied; click to admit / discharge)',['General','ICU','Private'].map(w=>{const l=db.beds.filter(b=>b.w===w),o=l.filter(b=>b.p).length;return h('div',{key:w,style:{marginBottom:14}},h('b',null,w+' ward '),h(Bd,{c:o===l.length?'r':'g'},o+'/'+l.length+' occupied'),h('div',{className:'beds'},l.map(b=>h('button',{key:b.id,className:'bed '+(b.p?'o':'f'),onClick:()=>click(b)},b.id,h('br'),b.p?b.p.split(' ')[0]:'Free'))))}));
}

/* ============================================================
   MODULE: FEEDBACK
   ============================================================ */
function FB({db,set,toast}){
 const add=v=>{if(v.p.trim().length<2)return toast('Enter your name'),0;set('fb',a=>[{id:id(),patient:v.p.trim(),dept:v.d,r:+v.r,c:v.c.trim()},...a]);toast('Thank you for your feedback!');return 1};
 const n=db.fb.length,av=n?(db.fb.reduce((a,x)=>a+x.r,0)/n).toFixed(1):'–';
 return h('div',null,card('Share your feedback',h(Form,{f:[{k:'p',l:'Name'},{k:'d',l:'Department / service',o:DEPTS},{k:'r',l:'Rating (5 = best)',o:['5','4','3','2','1']},{k:'c',l:'Comment'}],btn:'Submit',go:add})),
  card('Service quality: '+av+' ★ from '+n+' reviews',[5,4,3,2,1].map(s=>{const k=db.fb.filter(x=>x.r===s).length;return h('div',{key:s,style:{display:'flex',gap:8,alignItems:'center',marginBottom:6}},h('span',{style:{width:30}},s+'★'),h('div',{className:'bar',style:{flex:1}},h('i',{style:{width:(n?k/n*100:0)+'%'}})),h('span',{className:'mu',style:{width:24}},k))}),
  h(Tbl,{cols:[['Patient',r=>r.patient],['Service',r=>r.dept],['Rating',r=>'★'.repeat(r.r)],['Comment',r=>r.c||'–']],rows:db.fb})));
}

export { Queue, Pharm, Blood, Lab, Amb, Beds, FB };
