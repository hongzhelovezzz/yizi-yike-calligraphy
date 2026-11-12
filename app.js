const ACCESS_HASH='1e7da6746f9ed55f22ccb7e56a7cfbba9a0f4095d3fabb85a827a7f69539a06c';
const gate=document.querySelector('#gate-form'),codeInput=document.querySelector('#access-code'),gateError=document.querySelector('#gate-error');
async function hashCode(value){const bytes=new TextEncoder().encode(value);const hash=await crypto.subtle.digest('SHA-256',bytes);return [...new Uint8Array(hash)].map(x=>x.toString(16).padStart(2,'0')).join('')}
function unlock(){document.body.classList.remove('locked');sessionStorage.setItem('calligraphy-access','ok')}
if(sessionStorage.getItem('calligraphy-access')==='ok')unlock();else setTimeout(()=>codeInput.focus(),100);
gate.addEventListener('submit',async e=>{e.preventDefault();gateError.textContent='正在验证…';if(await hashCode(codeInput.value.trim())===ACCESS_HASH){gateError.textContent='';unlock()}else{gateError.textContent='访问码不正确，请重新输入。';codeInput.select()}});

const fallbackCourses = [
  {id:'xia',title:'下',type:'character',video:'videos/xia.mp4',tips:['横画舒展，托住上面。','竖从横画中间起笔。','最后一点由轻到重。'],rhyme:'长横托稳，竖正点沉。'},
  {id:'dou',title:'斗',type:'character',video:'videos/dou.mp4',tips:['两点一高一低，不要排齐。','横画稍向右上倾。','中竖写直，稳住重心。'],rhyme:'两点错落，横斜竖直。'},
  {id:'xiao',title:'小',type:'character',video:'videos/xiao.mp4',tips:['竖钩写在正中间。','左点稍低，右点稍高。','左右两点彼此呼应。'],rhyme:'竖钩居中，两点呼应。'},
  {id:'feng',title:'丰',type:'character',video:'videos/feng.mp4',tips:['三横保持间距均匀。','横画长短要有变化。','竖画穿过中心，写得挺直。'],rhyme:'三横匀称，一竖当中。'},
  {id:'chuan',title:'川',type:'character',video:'videos/chuan.mp4',tips:['三竖之间留白均匀。','中间一竖稍短。','右竖舒展，整体站稳。'],rhyme:'三竖分开，中短右长。'},
  {id:'er',title:'耳',type:'character',video:'videos/er.mp4',tips:['横画大致平行，间距均匀。','里面两横短，接左不接右。','末横略有舒展。'],rhyme:'横画排匀，右竖挺拔。'},
  {id:'shi',title:'十',type:'character',video:'videos/shi.mp4',tips:['横画平稳，略有提势。','竖画穿过横画正中。','交点附近最稳重。'],rhyme:'横平竖直，交在正中。'},
  {id:'gan',title:'干',type:'character',video:'videos/gan.mp4',tips:['上横短，下横长。','两横平行，间距适中。','竖画居中，垂直有力。'],rhyme:'上短下长，一竖居中。'},
  {id:'qian',title:'千',type:'character',video:'videos/qian.mp4',tips:['短撇写得轻巧平稳。','中横舒展，稍有提势。','竖画居中，向下写直。'],rhyme:'撇轻横展，竖画居中。'},
  {id:'li',title:'立',type:'character',video:'videos/li.mp4',tips:['首点对准中心。','中间撇点左右呼应。','底横写长，托住全字。'],rhyme:'点正腰稳，长横托底。'},
  {id:'ban',title:'半',type:'character',video:'videos/ban.mp4',tips:['上面两点左右呼应。','两横上短下长。','竖画穿中，收笔有力。'],rhyme:'两点相望，横展竖正。'},
  {id:'tu',title:'土',type:'character',video:'videos/tu.mp4',tips:['上横短，下横长。','竖画对准两横中间。','底横稳稳托住全字。'],rhyme:'上短下长，一竖正中。'},
  {id:'zheng',title:'正',type:'character',video:'videos/zheng.mp4',tips:['横画之间留白均匀。','中竖写直，不偏不斜。','底横舒展，整体方正。'],rhyme:'横画排匀，竖正底稳。'},
  {id:'tou',title:'头',type:'character',video:'videos/tou.mp4',tips:['上面两点有高低变化。','横画舒展，略向右上。','撇捺打开，稳住重心。'],rhyme:'两点错落，撇捺舒展。'},
  {id:'bu',title:'不',type:'character',video:'videos/bu.mp4',tips:['首横平稳舒展。','撇从横画中部起笔。','中竖写正，右点呼应。'],rhyme:'横稳撇轻，竖正点应。'},
  {id:'gong',title:'工',type:'character',video:'videos/gong.mp4',tips:['上横短，下横长。','两横大致平行。','竖画短而居中。'],rhyme:'上横短，下横长，竖在中央。'},
  {id:'wang',title:'王',type:'character',video:'videos/wang.mp4',tips:['三横间距要均匀。','三横长短有变化。','竖画穿过中心。'],rhyme:'三横排匀，一竖穿中。'},
  {id:'shang',title:'上',type:'character',video:'videos/shang.mp4',tips:['竖画端正有力。','短横靠上，不宜太长。','底横舒展，托稳全字。'],rhyme:'竖正横短，长横托底。'},
  {id:'na',title:'捺',type:'stroke',video:'videos/na.mp4',tips:['起笔轻，向右下行笔。','行笔渐按，笔画逐渐变粗。','捺脚铺开后平稳出锋。'],rhyme:'轻落渐按，铺开出锋。'},
  {id:'ren',title:'人',type:'character',video:'videos/ren.mp4',tips:['撇画先写，轻快向左下。','捺画渐按，写出捺脚。','撇捺打开，重心站稳。'],rhyme:'撇轻捺重，两脚站稳。'},
  {id:'da',title:'大',type:'character',video:'videos/da.mp4',tips:['横画不宜过长。','撇从横中穿过，向左舒展。','捺画打开，与撇保持平衡。'],rhyme:'横在上方，撇捺开张。'},
  {id:'tian',title:'天',type:'character',video:'videos/tian.mp4',tips:['上横短，下横长。','撇从下横中部穿出。','捺画舒展，保持左右平衡。'],rhyme:'两横有别，撇捺舒展。'},
  {id:'huo',title:'火',type:'character',video:'videos/huo.mp4',tips:['左点与右短撇相互呼应。','主撇舒展，由重到轻。','捺画渐按，写出捺脚。'],rhyme:'点撇呼应，撇捺开张。'},
  {id:'quan',title:'全',type:'character',video:'videos/quan.mp4',tips:['人字头撇捺舒展，盖住下部。','下部三横间距均匀。','中竖对正上方中心。'],rhyme:'人头盖稳，王字居中。'},
  {id:'cong',title:'从',type:'character',video:'videos/cong.mp4',tips:['左边的人写小一些。','右边的人写大、写舒展。','两部分互相避让，不拥挤。'],rhyme:'左小右大，两人相让。'},
  {id:'sheng',title:'生',type:'character',video:'videos/sheng.mp4',tips:['起笔短撇轻巧。','三横间距匀，长短有变化。','竖画居中穿过横画。'],rhyme:'撇短横匀，一竖穿中。'},
  {id:'niu',title:'牛',type:'character',video:'videos/niu.mp4',tips:['短撇轻巧，不宜过长。','上横短，下横舒展。','最后一竖居中写直。'],rhyme:'撇短横展，竖直居中。'},
  {id:'guang',title:'广',type:'character',video:'videos/guang.mp4',tips:['首点对准中心。','横画略向右上，写得舒展。','长撇由重到轻，内部留白。'],rhyme:'点正横展，长撇舒展。'},
  {id:'yang',title:'羊',type:'character',video:'videos/yang.mp4',tips:['点和撇左右呼应。','三横间距均匀，长短有别。','竖画穿中，写得挺直。'],rhyme:'点撇相望，三横一竖。'},
  {id:'liu',title:'六',type:'character',video:'videos/liu.mp4',tips:['首点对准横画中心。','横画舒展，略有提势。','撇与点左右分开，稳住下部。'],rhyme:'点正横展，撇点分开。'},
  {id:'xi',title:'夕',type:'character',video:'videos/xi.mp4',tips:['起笔短撇轻巧有力。','横撇的转折处稍顿。','末点写在字形里面，位置适中。'],rhyme:'短撇先行，横撇舒展，点在里边。'},
  {id:'duo',title:'多',type:'character',video:'videos/duo.mp4',tips:['上下两个“夕”对正中心。','上部稍小，下部稍大。','几个撇画方向一致，间距均匀。'],rhyme:'上小下大，撇画相随。'},
  {id:'kai',title:'开',type:'character',video:'videos/kai.mp4',tips:['两横上短下长，保持平行。','左边竖撇先直后撇。','右竖挺直，两边距离适中。'],rhyme:'上短下长，左撇右竖。'},
  {id:'jin',title:'斤',type:'character',video:'videos/jin.mp4',tips:['平撇短而轻，落笔稳。','竖撇先直后撇，弧度自然。','横画舒展，末竖挺直。'],rhyme:'两撇有别，横展竖直。'},
  {id:'shupie',title:'竖撇',type:'stroke',video:'videos/shupie.mp4',tips:['起笔稍顿，先向下写直。','行至中下部再慢慢向左弯。','由重到轻，末端自然出锋。'],rhyme:'先竖后撇，慢弯轻出。'},
  {id:'hengpie',title:'横撇',type:'stroke',video:'videos/hengpie.mp4',tips:['横画短而有提势。','转折处稍顿，不要画圆。','撇画向左下，由重到轻。'],rhyme:'短横稍顿，转身撇出。'},
  {id:'shao',title:'少',type:'character',video:'videos/shao.mp4',tips:['中竖居中，写得挺直。','左右两点一低一高，彼此呼应。','长撇舒展，托住字形。'],rhyme:'中竖站正，两点相望，长撇舒展。'},
  {id:'zuo',title:'左',type:'character',video:'videos/zuo.mp4',tips:['首横不宜过长，稍有提势。','长撇舒展，给下部留空间。','“工”部写稳，底横托住全字。'],rhyme:'横短撇长，工字写稳。'},
  {id:'zai',title:'在',type:'character',video:'videos/zai.mp4',tips:['横与撇舒展，覆盖下部。','中竖写直，对准重心。','“土”部上短下长，底横平稳。'],rhyme:'横撇盖住，竖正土稳。'},
  {id:'chuilushu',title:'垂露竖',type:'stroke',video:'videos/chuilushu.mp4',tips:['逆锋或顿笔起笔。','中段垂直向下，速度均匀。','收笔稍顿，末端圆润如露珠。'],rhyme:'起笔顿，行笔直，收笔圆。'},
  {id:'xuanzhenshu',title:'悬针竖',type:'stroke',video:'videos/xuanzhenshu.mp4',tips:['起笔稍顿，稳住笔锋。','中段保持垂直。','末端慢慢提笔，收成针尖。'],rhyme:'顿笔直下，渐提成针。'},
  {id:'zuoyoudian',title:'左右点',type:'stroke',video:'videos/zuoyoudian.mp4',tips:['左点向左下，落笔轻巧。','右点向右下，由轻到重。','两点一轻一重，彼此顾盼。'],rhyme:'左点轻，右点重，两点会照应。'},
  {id:'xiepie',title:'斜撇',type:'stroke',video:'videos/xiepie.mp4',tips:['起笔稍顿，先稳住笔锋。','向左下行笔，弧度自然。','由重到轻，末端出锋。'],rhyme:'起笔稳，向左行，渐轻出锋。'}
];

let courses=[...fallbackCourses];
const backendConfig=window.CALLIGRAPHY_CONFIG||{};
const backendReady=Boolean(backendConfig.supabaseUrl&&backendConfig.supabaseAnonKey&&window.supabase);
const backend=backendReady?window.supabase.createClient(backendConfig.supabaseUrl,backendConfig.supabaseAnonKey):null;

const grid=document.querySelector('#course-grid'),search=document.querySelector('#search'),count=document.querySelector('#course-count'),empty=document.querySelector('#empty'),modal=document.querySelector('#lesson-modal'),video=document.querySelector('#lesson-video');
let activeFilter='all';
function render(){const q=search.value.trim();const list=courses.filter(c=>(activeFilter==='all'||c.type===activeFilter)&&(!q||c.title.includes(q)||c.tips.join('').includes(q)));grid.innerHTML=list.map(c=>`<button class="card ${c.type==='stroke'?'stroke-card':''}" data-id="${c.id}"><div class="card-head"><span class="character">${c.title}</span><span class="play" aria-hidden="true">▶</span></div><h3>${c.type==='stroke'?'基础笔画':'单字课'} · ${c.title}</h3><p>${c.rhyme}</p></button>`).join('');count.textContent=`${list.length} 节`;empty.hidden=list.length>0;}
function openLesson(id){const c=courses.find(x=>x.id===id),index=courses.indexOf(c)+1;document.querySelector('#lesson-type').textContent=c.type==='stroke'?'基础笔画课':'单字讲解';document.querySelector('#lesson-number').textContent=`第 ${index} 课`;document.querySelector('#big-character').textContent=c.title;document.querySelector('#lesson-title').textContent=`${c.title} · 书写讲解`;document.querySelector('#lesson-tips').innerHTML=c.tips.map(t=>`<li>${t}</li>`).join('');document.querySelector('#lesson-rhyme').textContent=`口诀：${c.rhyme}`;video.src=c.video;modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';setTimeout(()=>video.play().catch(()=>{}),150);}
function closeLesson(){video.pause();video.removeAttribute('src');video.load();modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow='';}
grid.addEventListener('click',e=>{const card=e.target.closest('[data-id]');if(card)openLesson(card.dataset.id)});document.querySelectorAll('[data-close]').forEach(x=>x.addEventListener('click',closeLesson));document.querySelectorAll('.filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelector('.filter.active').classList.remove('active');btn.classList.add('active');activeFilter=btn.dataset.filter;document.querySelector('#course-title').textContent=activeFilter==='all'?'全部课程':activeFilter==='character'?'汉字课程':'基础笔画';render()}));search.addEventListener('input',render);document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('open'))closeLesson()});
async function loadCourses(){
  if(!backendReady){render();return}
  const {data,error}=await backend.from('courses').select('id,title,type,video_url,tips,rhyme,sort_order').order('sort_order',{ascending:true});
  if(error||!data?.length){render();return}
  courses=data.map(c=>({id:c.id,title:c.title,type:c.type,video:c.video_url,tips:c.tips||[],rhyme:c.rhyme||''}));
  render();
}
loadCourses();
