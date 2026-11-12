const config=window.CALLIGRAPHY_CONFIG||{};
const configured=Boolean(config.supabaseUrl&&config.supabaseAnonKey&&window.supabase);
const client=configured?window.supabase.createClient(config.supabaseUrl,config.supabaseAnonKey):null;
const setupPanel=document.querySelector('#setup-panel');
const loginPanel=document.querySelector('#login-panel');
const dashboard=document.querySelector('#dashboard');
const list=document.querySelector('#admin-list');
const empty=document.querySelector('#admin-empty');
const editor=document.querySelector('#editor');
const form=document.querySelector('#course-form');
let courseCache=[];

function escapeHtml(value=''){return String(value).replace(/[&<>'"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]))}
function showOnly(panel){setupPanel.hidden=panel!==setupPanel;loginPanel.hidden=panel!==loginPanel;dashboard.hidden=panel!==dashboard}
function setMessage(id,text,ok=false){const el=document.querySelector(id);el.textContent=text;el.style.color=ok?'#3f5a4c':''}

async function init(){
  if(!configured){showOnly(setupPanel);return}
  const {data}=await client.auth.getSession();
  if(data.session){showOnly(dashboard);await loadCourses()}else showOnly(loginPanel)
}

document.querySelector('#login-form').addEventListener('submit',async event=>{
  event.preventDefault();
  const button=event.submitter;button.disabled=true;setMessage('#login-message','正在登录……');
  const email=document.querySelector('#login-email').value.trim();
  const password=document.querySelector('#login-password').value;
  const {error}=await client.auth.signInWithPassword({email,password});
  button.disabled=false;
  if(error){setMessage('#login-message','登录失败，请检查邮箱和密码。');return}
  setMessage('#login-message','');showOnly(dashboard);await loadCourses();
});

document.querySelector('#logout').addEventListener('click',async()=>{await client.auth.signOut();showOnly(loginPanel)});

async function loadCourses(){
  list.innerHTML='<p>正在读取课程……</p>';
  const {data,error}=await client.from('courses').select('*').order('sort_order',{ascending:true});
  if(error){list.innerHTML='';empty.hidden=false;empty.textContent='课程读取失败，请稍后重试。';return}
  courseCache=data||[];renderCourses();
}

function renderCourses(){
  document.querySelector('#admin-count').textContent=`${courseCache.length} 节`;
  empty.hidden=courseCache.length>0;
  empty.textContent='还没有课程，点击“添加课程”开始。';
  list.innerHTML=courseCache.map(course=>`<article class="admin-item">
    <div class="admin-character ${course.type==='stroke'?'stroke':''}">${escapeHtml(course.title)}</div>
    <div class="admin-info"><h3>${course.type==='stroke'?'基础笔画':'汉字'} · ${escapeHtml(course.title)}</h3><p>${escapeHtml(course.rhyme||'')}</p></div>
    <div class="item-actions"><button class="quiet" data-edit="${escapeHtml(course.id)}">修改 / 换视频</button><button class="danger" data-delete="${escapeHtml(course.id)}">删除</button></div>
  </article>`).join('');
}

function openEditor(course=null){
  form.reset();setMessage('#editor-message','');
  const nextOrder=courseCache.length?Math.max(...courseCache.map(x=>Number(x.sort_order)||0))+1:1;
  document.querySelector('#editor-title').textContent=course?'修改课程':'添加课程';
  document.querySelector('#course-id').value=course?.id||'';
  document.querySelector('#old-video-path').value=course?.video_path||'';
  document.querySelector('#course-name').value=course?.title||'';
  document.querySelector('#course-type').value=course?.type||'character';
  document.querySelector('#course-rhyme').value=course?.rhyme||'';
  document.querySelector('#course-tips').value=(course?.tips||[]).join('\n');
  document.querySelector('#course-order').value=course?.sort_order||nextOrder;
  document.querySelector('#video-help').textContent=course?'不选择新视频会保留原视频；选择后将替换旧视频。':'新增课程必须选择视频。';
  editor.classList.add('open');editor.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';
}
function closeEditor(){editor.classList.remove('open');editor.setAttribute('aria-hidden','true');document.body.style.overflow=''}

document.querySelector('#add-course').addEventListener('click',()=>openEditor());
document.querySelectorAll('[data-editor-close]').forEach(el=>el.addEventListener('click',closeEditor));
list.addEventListener('click',async event=>{
  const edit=event.target.closest('[data-edit]');
  if(edit){openEditor(courseCache.find(x=>x.id===edit.dataset.edit));return}
  const remove=event.target.closest('[data-delete]');
  if(!remove)return;
  const course=courseCache.find(x=>x.id===remove.dataset.delete);
  if(!course||!confirm(`确定删除“${course.title}”吗？删除后孩子将看不到这节课。`))return;
  remove.disabled=true;
  const {error}=await client.from('courses').delete().eq('id',course.id);
  if(error){alert('删除失败，请稍后重试。');remove.disabled=false;return}
  if(course.video_path)await client.storage.from('course-videos').remove([course.video_path]);
  await loadCourses();
});

form.addEventListener('submit',async event=>{
  event.preventDefault();
  const save=document.querySelector('#save-course');
  const progress=document.querySelector('#upload-progress');
  const existingId=document.querySelector('#course-id').value;
  const existing=courseCache.find(x=>x.id===existingId);
  const file=document.querySelector('#course-video').files[0];
  if(!existing&&!file){setMessage('#editor-message','请选择讲解视频。');return}
  if(file&&file.size>50*1024*1024){setMessage('#editor-message','视频超过 50MB，请先压缩后再上传。');return}
  const tips=document.querySelector('#course-tips').value.split(/\n+/).map(x=>x.trim()).filter(Boolean);
  if(!tips.length){setMessage('#editor-message','请至少填写一条书写重点。');return}
  save.disabled=true;progress.hidden=!file;setMessage('#editor-message',file?'正在上传并保存……':'正在保存……');
  const id=existing?.id||`lesson-${Date.now()}`;
  let videoUrl=existing?.video_url||'';
  let videoPath=existing?.video_path||null;
  let uploadedPath=null;
  if(file){
    const extension=(file.name.split('.').pop()||'mp4').toLowerCase().replace(/[^a-z0-9]/g,'')||'mp4';
    uploadedPath=`${id}/${Date.now()}.${extension}`;
    const upload=await client.storage.from('course-videos').upload(uploadedPath,file,{contentType:file.type||'video/mp4',cacheControl:'3600'});
    if(upload.error){save.disabled=false;progress.hidden=true;setMessage('#editor-message','视频上传失败，请检查网络后重试。');return}
    videoPath=uploadedPath;
    videoUrl=client.storage.from('course-videos').getPublicUrl(uploadedPath).data.publicUrl;
  }
  const row={id,title:document.querySelector('#course-name').value.trim(),type:document.querySelector('#course-type').value,rhyme:document.querySelector('#course-rhyme').value.trim(),tips,video_url:videoUrl,video_path:videoPath,sort_order:Number(document.querySelector('#course-order').value)};
  const result=existing?await client.from('courses').update(row).eq('id',id):await client.from('courses').insert(row);
  if(result.error){
    if(uploadedPath)await client.storage.from('course-videos').remove([uploadedPath]);
    save.disabled=false;progress.hidden=true;setMessage('#editor-message','保存失败，请稍后重试。');return
  }
  if(uploadedPath&&existing?.video_path&&existing.video_path!==uploadedPath)await client.storage.from('course-videos').remove([existing.video_path]);
  save.disabled=false;progress.hidden=true;setMessage('#editor-message','保存成功。',true);
  await loadCourses();setTimeout(closeEditor,450);
});

document.addEventListener('keydown',event=>{if(event.key==='Escape'&&editor.classList.contains('open'))closeEditor()});
init();
