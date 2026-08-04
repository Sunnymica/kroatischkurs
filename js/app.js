(() => {
  'use strict';

  const KEY = 'kroatischkurs-v0.3';
  const defaults = {
    profile:{name:'Regina',dailyGoal:20},current:{lesson:'lekcija-1',step:'susret-dialog'},
    completed:{},spoken:{},mission:{},favorites:{},difficult:{},attempts:{},notes:[],activity:{},focus:false
  };
  let state = load();
  let reviewItems=[];
  let reviewIndex=0;

  document.addEventListener('DOMContentLoaded', () => {
    markActivity(1);
    bindCommon();
    document.body.dataset.page === 'lesson' ? initLesson() : initHome();
  });

  function load(){
    try{return merge(defaults,JSON.parse(localStorage.getItem(KEY)||'{}'));}
    catch(e){return structuredClone(defaults);}
  }
  function merge(base,saved){
    const out=structuredClone(base);
    for(const k of Object.keys(out)){
      if(saved[k]&&typeof saved[k]==='object'&&!Array.isArray(saved[k])) out[k]={...out[k],...saved[k]};
      else if(saved[k]!==undefined) out[k]=saved[k];
    }
    return out;
  }
  function save(){localStorage.setItem(KEY,JSON.stringify(state));}
  function lesson(id='lekcija-1'){return (window.KROATISCH_LESSONS||[]).find(x=>x.id===id);}
  function steps(l){return l.phases.flatMap(p=>p.steps.map(s=>({...s,phase:p.id,phaseLabel:p.label})));}
  function key(l,s){return `${l}:${s}`;}
  function done(l,s){return !!state.completed[key(l,s)];}
  function complete(l,s){if(!done(l,s)){state.completed[key(l,s)]=new Date().toISOString();markActivity(3);save();}}
  function progress(l){const all=steps(l);return Math.round(all.filter(s=>done(l.id,s.id)).length/all.length*100)||0;}
  function esc(s=''){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
  function id(prefix='id'){return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;}
  function dateKey(d=new Date()){return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');}
  function markActivity(min=0){const k=dateKey();state.activity[k] ||= {minutes:0,visits:0};state.activity[k].minutes+=min;state.activity[k].visits++;save();}
  function toast(text){const t=document.querySelector('#toast');if(!t)return;t.textContent=text;t.classList.add('show');clearTimeout(t._timer);t._timer=setTimeout(()=>t.classList.remove('show'),2400);}
  function openDialog(el){if(el&&!el.open)el.showModal();}
  function closeDialog(el){if(el?.open)el.close();}
  function bindCommon(){
    document.addEventListener('click',e=>{
      const speak=e.target.closest('[data-speak]');if(speak){e.preventDefault();say(speak.dataset.speak);}
      if(e.target.closest('[data-close-dialog]')) closeDialog(e.target.closest('dialog'));
      const fav=e.target.closest('[data-favorite]');if(fav){e.preventDefault();toggleFavorite(fav.dataset.favorite,fav.dataset.text);}
    });
  }
  function say(text){
    if(!('speechSynthesis'in window)){toast('Dieser Browser unterstützt keine Sprachausgabe.');return;}
    speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='hr-HR';u.rate=.84;
    const v=speechSynthesis.getVoices().find(v=>v.lang.toLowerCase().startsWith('hr'));if(v)u.voice=v;speechSynthesis.speak(u);
  }
  function toggleFavorite(fid,text){
    if(state.favorites[fid]){delete state.favorites[fid];toast('Aus dem Lernmemory entfernt.');}
    else{state.favorites[fid]={id:fid,text,created:new Date().toISOString()};toast('Im Lernmemory gespeichert.');}
    save();refreshFavorites();if(document.body.dataset.page==='home')renderReview();
  }
  function refreshFavorites(){document.querySelectorAll('[data-favorite]').forEach(b=>b.classList.toggle('active',!!state.favorites[b.dataset.favorite]));}

  /* HOME */
  function initHome(){
    setDate();renderHome();bindHome();
    document.querySelectorAll('.nav-link').forEach(a=>a.addEventListener('click',()=>{document.querySelectorAll('.nav-link').forEach(x=>x.classList.remove('active'));a.classList.add('active');closeMenu();}));
  }
  function setDate(){const e=document.querySelector('#date-label');if(e)e.textContent=new Intl.DateTimeFormat('de-DE',{weekday:'long',day:'numeric',month:'long'}).format(new Date());}
  function renderHome(){
    const l=lesson(),p=progress(l),name=state.profile.name||'Regina';
    document.querySelector('#welcome').textContent=`Dobro došla, ${name}.`;document.querySelector('.avatar').textContent=name[0].toUpperCase();
    document.querySelector('#progress-number').textContent=`${p}%`;document.querySelector('#progress-ring').style.setProperty('--p',p);
    document.querySelector('#continue-button').textContent=p===0?'Lektion beginnen':p===100?'Erneut üben':'Weiterlernen';
    document.querySelector('#streak').textContent=`${streak()} ${streak()===1?'Tag':'Tage'}`;
    renderLessons();renderReview();renderNotes();renderSkills();renderActivity();renderPhaseList();
  }
  function bindHome(){
    const sidebar=document.querySelector('#sidebar'),backdrop=document.querySelector('#backdrop');
    document.querySelector('#menu-button').onclick=()=>{sidebar.classList.add('open');backdrop.classList.add('show');};backdrop.onclick=closeMenu;
    document.querySelector('#new-note').onclick=()=>openNote();
    document.querySelector('#profile-button').onclick=()=>{document.querySelector('#profile-name').value=state.profile.name;document.querySelector('#profile-goal').value=state.profile.dailyGoal;openDialog(document.querySelector('#profile-dialog'));};
    document.querySelector('#overview-button').onclick=()=>openDialog(document.querySelector('#overview-dialog'));
    document.querySelector('#notes-search').oninput=renderNotes;document.querySelector('#notes-filter').onchange=renderNotes;
    document.querySelector('#note-form').onsubmit=e=>{e.preventDefault();saveNote();};
    document.querySelector('#profile-form').onsubmit=e=>{e.preventDefault();state.profile={name:document.querySelector('#profile-name').value.trim()||'Regina',dailyGoal:+document.querySelector('#profile-goal').value};save();closeDialog(document.querySelector('#profile-dialog'));renderHome();toast('Lernprofil gespeichert.');};
    document.querySelectorAll('[data-action="review"]').forEach(b=>b.onclick=startReview);
    document.querySelector('#reset-button').onclick=()=>{if(confirm('Alle lokalen Lernstände und Notizen löschen?')){localStorage.removeItem(KEY);state=structuredClone(defaults);save();renderHome();toast('Lerndaten zurückgesetzt.');}};
  }
  function closeMenu(){document.querySelector('#sidebar')?.classList.remove('open');document.querySelector('#backdrop')?.classList.remove('show');}
  function renderLessons(){
    document.querySelector('#lesson-grid').innerHTML=window.KROATISCH_LESSONS.map(l=>{
      const available=l.status==='available',p=available?progress(l):0;
      return `<article class="lesson-card ${l.color} ${available?'':'locked'}"><div class="lesson-card-top"><span class="lesson-number">Lektion ${l.number}</span><span class="pill">${available?p+'%':'In Vorbereitung'}</span></div><h3>${esc(l.title)}</h3><p><strong>${esc(l.subtitle)}</strong></p><p>${esc(l.description)}</p><div class="tags">${l.focus.map(x=>`<span>${esc(x)}</span>`).join('')}</div><div class="lesson-card-foot"><span>${esc(l.duration)}</span>${available?`<a class="circle-link" href="lesson.html?id=${l.id}">→</a>`:'<span>🔒</span>'}</div></article>`;
    }).join('');
  }
  function reviewData(){
    return [...Object.values(state.favorites).map(x=>({id:x.id,type:'Lieblingssatz',front:x.text,back:x.text})),...Object.values(state.difficult).map(x=>({id:x.id,type:'Noch schwierig',front:x.title,back:x.answer}))];
  }
  function renderReview(){
    const items=reviewData(),area=document.querySelector('#review-area');document.querySelector('#review-badge').textContent=items.length;document.querySelector('#review-quick').textContent=items.length;
    if(!items.length){area.innerHTML='<div class="review-empty"><strong>Noch nichts fällig</strong><p>Markiere Sätze mit dem Stern. Wiederholte Fehler werden automatisch aufgenommen.</p></div>';return;}
    area.innerHTML=`<div class="review-list">${items.slice(0,3).map(x=>`<div class="review-mini"><small>${esc(x.type)}</small><strong>${esc(x.front)}</strong><button class="text-button" data-speak="${esc(x.back)}">Anhören</button></div>`).join('')}</div>`;
  }
  function openNote(n=null){
    document.querySelector('#note-heading').textContent=n?'Notiz bearbeiten':'Neue Notiz';document.querySelector('#note-id').value=n?.id||'';document.querySelector('#note-title').value=n?.title||'';document.querySelector('#note-text').value=n?.text||'';document.querySelector('#note-pinned').checked=!!n?.pinned;openDialog(document.querySelector('#note-dialog'));
  }
  function saveNote(){
    const nid=document.querySelector('#note-id').value,title=document.querySelector('#note-title').value.trim()||'Ohne Titel',text=document.querySelector('#note-text').value.trim(),pinned=document.querySelector('#note-pinned').checked;if(!text)return;
    const existing=state.notes.find(n=>n.id===nid);if(existing)Object.assign(existing,{title,text,pinned,updated:new Date().toISOString()});else state.notes.unshift({id:id('note'),title,text,pinned,lessonId:null,stepId:null,updated:new Date().toISOString()});save();closeDialog(document.querySelector('#note-dialog'));renderNotes();toast('Notiz gespeichert.');
  }
  function renderNotes(){
    const q=(document.querySelector('#notes-search')?.value||'').toLowerCase(),filter=document.querySelector('#notes-filter')?.value||'all';let notes=[...state.notes].sort((a,b)=>+b.pinned-+a.pinned||new Date(b.updated)-new Date(a.updated));
    notes=notes.filter(n=>(!q||(n.title+' '+n.text).toLowerCase().includes(q))&&(filter==='all'||filter==='pinned'&&n.pinned||filter==='lesson'&&n.lessonId));const grid=document.querySelector('#notes-grid');
    if(!notes.length){grid.innerHTML='<div class="empty">Dein Notizbuch ist noch leer. Speichere eigene Sätze oder Beobachtungen aus der Lektion.</div>';return;}
    grid.innerHTML=notes.map(n=>`<article class="note-card ${n.pinned?'pinned':''}"><small>${n.lessonId?'Aus einer Lektion':'Eigene Notiz'}</small><h3>${esc(n.title)}</h3><p>${esc(n.text)}</p><div class="note-card-foot"><small>${new Date(n.updated).toLocaleDateString('de-DE')}</small><div class="note-actions"><button class="text-button" data-edit-note="${n.id}">Bearbeiten</button><button class="text-button" data-pin-note="${n.id}">${n.pinned?'Lösen':'Anheften'}</button><button class="text-button" data-delete-note="${n.id}">Löschen</button></div></div></article>`).join('');
    grid.querySelectorAll('[data-edit-note]').forEach(b=>b.onclick=()=>openNote(state.notes.find(n=>n.id===b.dataset.editNote)));
    grid.querySelectorAll('[data-pin-note]').forEach(b=>b.onclick=()=>{const n=state.notes.find(n=>n.id===b.dataset.pinNote);n.pinned=!n.pinned;n.updated=new Date().toISOString();save();renderNotes();});
    grid.querySelectorAll('[data-delete-note]').forEach(b=>b.onclick=()=>{const n=state.notes.find(n=>n.id===b.dataset.deleteNote);if(confirm(`Notiz „${n.title}“ löschen?`)){state.notes=state.notes.filter(x=>x.id!==n.id);save();renderNotes();}});
  }
  function renderSkills(){
    const l=lesson(),all=steps(l),groups=[['Verstehen',['susret','razumjeti']],['Satzmuster',['muster']],['Aktiver Abruf',['einschleifen']],['Freies Sprechen',['varirati','transfer']]];
    document.querySelector('#skills').innerHTML=groups.map(([name,phases])=>{const rel=all.filter(s=>phases.includes(s.phase)),v=Math.round(rel.filter(s=>done(l.id,s.id)).length/rel.length*100)||0;return `<div class="skill"><strong>${name}</strong><div class="skill-bar"><span style="width:${v}%"></span></div><span>${v}%</span></div>`;}).join('');
  }
  function renderActivity(){
    const days=[];for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);const a=state.activity[dateKey(d)]||{minutes:0};days.push({label:new Intl.DateTimeFormat('de-DE',{weekday:'short'}).format(d).replace('.',''),minutes:a.minutes});}
    const max=Math.max(10,...days.map(x=>x.minutes));document.querySelector('#activity-chart').innerHTML=days.map(x=>`<div class="activity-day"><div class="activity-stick"><span style="height:${Math.max(4,x.minutes/max*100)}%"></span></div><span>${x.label}</span></div>`).join('');const total=days.reduce((s,x)=>s+x.minutes,0);document.querySelector('#activity-note').textContent=total<=1?'Dein erster Lerntag beginnt heute.':`${total} geschätzte Lernminuten in sieben Tagen.`;
  }
  function streak(){let n=0,d=new Date();for(let i=0;i<365;i++){if(state.activity[dateKey(d)])n++;else if(i>0)break;d.setDate(d.getDate()-1);}return n;}
  function renderPhaseList(){document.querySelector('#phase-list').innerHTML=lesson().phases.map((p,i)=>`<li><strong>${i+1}. ${esc(p.label)}</strong> – ${esc(p.short)}</li>`).join('');}
  function startReview(){
    reviewItems=reviewData().sort(()=>Math.random()-.5);reviewIndex=0;if(!reviewItems.length){toast('Noch keine Karten für die Wiederholung.');return;}openDialog(document.querySelector('#review-dialog'));renderReviewCard();
  }
  function renderReviewCard(){
    const box=document.querySelector('#review-session');if(reviewIndex>=reviewItems.length){document.querySelector('#review-title').textContent='Runde abgeschlossen';box.innerHTML='<div class="review-empty"><div class="completion-mark">✓</div><h3>Gut reaktiviert.</h3><button class="button primary" data-close-dialog>Schließen</button></div>';return;}
    const x=reviewItems[reviewIndex];document.querySelector('#review-title').textContent=`Karte ${reviewIndex+1} von ${reviewItems.length}`;box.innerHTML=`<div class="review-empty"><small>${esc(x.type)}</small><h3>${esc(x.front)}</h3><p>Sprich zuerst laut. Zeige die Antwort erst danach.</p><button class="button secondary" id="reveal">Antwort zeigen</button><div id="answer" hidden><h3>${esc(x.back)}</h3><button class="button secondary small" data-speak="${esc(x.back)}">Anhören</button><div class="button-row center" style="margin-top:20px"><button class="button secondary small" data-rate="again">Noch einmal</button><button class="button secondary small" data-rate="hard">Mit Mühe</button><button class="button primary small" data-rate="good">Gut</button></div></div></div>`;
    box.querySelector('#reveal').onclick=()=>{box.querySelector('#reveal').hidden=true;box.querySelector('#answer').hidden=false;};box.querySelectorAll('[data-rate]').forEach(b=>b.onclick=()=>{if(b.dataset.rate==='again')reviewItems.push(x);if(b.dataset.rate==='good'&&state.difficult[x.id])delete state.difficult[x.id];save();reviewIndex++;renderReviewCard();});
  }

  /* LESSON */
  function initLesson(){
    const lid=new URLSearchParams(location.search).get('id')||'lekcija-1',l=lesson(lid);if(!l||l.status!=='available'){document.querySelector('#lesson-stage').innerHTML='<div class="content-card"><h1>Noch nicht verfügbar</h1><a class="button primary" href="index.html">Zurück</a></div>';return;}
    const all=steps(l);let index=Math.max(0,all.findIndex(s=>s.id===state.current.step));if(location.hash){const h=location.hash.slice(1),i=all.findIndex(s=>s.id===h||s.phase===h);if(i>=0)index=i;}
    state.current={lesson:l.id,step:all[index].id};save();
    document.querySelector('#lesson-number').textContent=l.number;document.querySelector('#lesson-title').textContent=l.title;document.querySelector('#lesson-subtitle').textContent=l.subtitle;document.querySelector('#lesson-label').textContent=`Lektion ${l.number} · ${l.title}`;
    document.querySelector('#lesson-note-button').onclick=()=>openLessonNote(l,all[index]);document.querySelector('#vocabulary-button').onclick=()=>openVocabulary(l);document.querySelector('#focus-button').onclick=toggleFocus;document.body.classList.toggle('focus-mode',state.focus);
    document.querySelector('#lesson-note-form').onsubmit=e=>{e.preventDefault();state.notes.unshift({id:id('note'),title:document.querySelector('#lesson-note-title').value.trim()||`Notiz zu ${l.title}`,text:document.querySelector('#lesson-note-text').value.trim(),pinned:document.querySelector('#lesson-note-pinned').checked,lessonId:l.id,stepId:state.current.step,updated:new Date().toISOString()});save();closeDialog(document.querySelector('#lesson-note-dialog'));toast('Im Notizbuch gespeichert.');};
    document.querySelector('#prev-step').onclick=()=>{if(index>0){index--;go();}};
    document.querySelector('#next-step').onclick=()=>{const s=all[index];if(!done(l.id,s.id)){if(['dialogue','pattern','summary'].includes(s.type))complete(l.id,s.id);else{toast('Schließe zuerst diese Aufgabe ab.');document.querySelector('.exercise-card,.content-card,.mission-card')?.classList.add('attention');setTimeout(()=>document.querySelector('.attention')?.classList.remove('attention'),500);return;}}if(index===all.length-1){finish(l,all);return;}index++;go();};
    document.querySelector('#lesson-steps').onclick=e=>{const b=e.target.closest('[data-step]');if(b){index=+b.dataset.step;go();}};
    document.querySelector('#repeat-lesson').onclick=()=>{all.forEach(s=>delete state.completed[key(l.id,s.id)]);state.current.step=all[0].id;save();closeDialog(document.querySelector('#finish-dialog'));index=0;go();};
    function go(){state.current.step=all[index].id;save();renderMap(l,all,index);renderStep(l,all[index],index,all);updateNav(l,all,index);history.replaceState(null,'',`lesson.html?id=${l.id}#${all[index].id}`);document.querySelector('#lesson-main').scrollTop=0;}
    go();
  }
  function renderMap(l,all,index){
    let n=0;document.querySelector('#lesson-steps').innerHTML=l.phases.map(p=>`<li class="map-phase"><strong>${esc(p.label)}</strong>${p.steps.map(s=>{const i=n++;return `<button class="map-step ${i===index?'current':''} ${done(l.id,s.id)?'done':''}" data-step="${i}">${esc(s.title)}</button>`;}).join('')}</li>`).join('');
  }
  function updateNav(l,all,index){const p=progress(l);document.querySelector('#lesson-percent').textContent=p+'%';document.querySelector('#lesson-bar').style.width=p+'%';document.querySelector('#step-count').textContent=`${index+1} von ${all.length}`;document.querySelector('#prev-step').disabled=index===0;document.querySelector('#next-step').textContent=index===all.length-1?'Lektion abschließen ✓':'Weiter →';}
  function head(s){return `<header class="step-head"><span class="kicker">${esc(s.eyebrow)}</span><h2>${esc(s.title)}</h2><p>${esc(s.intro)}</p></header>`;}
  function favoriteButton(fid,text){return `<button class="favorite ${state.favorites[fid]?'active':''}" data-favorite="${esc(fid)}" data-text="${esc(text)}" aria-label="Satz merken">★</button>`;}
  function renderStep(l,s,index,all){
    const stage=document.querySelector('#lesson-stage'),renderers={dialogue:dialogue,echo,choice,matching,pattern,builder,cloze,generator,free,mission,summary};stage.innerHTML=(renderers[s.type]||(()=>head(s)+'<div class="content-card">Übung</div>'))(l,s);bindStep(l,s,index,all);refreshFavorites();
  }
  function passive(l,s,label='Erledigt'){return `<div class="passive-finish"><button class="button ${done(l.id,s.id)?'success':'secondary'}" data-complete>${done(l.id,s.id)?'✓ Erledigt':label}</button>${done(l.id,s.id)?'<button class="text-button" data-redo>Erneut üben</button>':''}</div>`;}
  function dialogue(l,s){return head(s)+`<article class="content-card"><div class="dialogue-toolbar"><strong>Dialog</strong><button class="button secondary small" id="play-dialog">Ganz anhören</button></div><div class="dialogue">${s.dialogue.map((x,i)=>`<div class="dialogue-line ${x.side==='right'?'right':''}"><div class="bubble"><div class="speaker">${esc(x.speaker)}</div><strong lang="hr">${esc(x.hr)}</strong><span>${esc(x.de)}</span><div class="bubble-actions"><button class="icon-btn" data-speak="${esc(x.hr)}">▶</button>${favoriteButton(key(l.id,s.id)+':'+i,x.hr)}</div></div></div>`).join('')}</div></article>`+passive(l,s,'Dialog verstanden');}
  function echo(l,s){const spoken=state.spoken[key(l.id,s.id)]||{};return head(s)+`<div class="echo-list">${s.prompts.map((x,i)=>`<article class="echo-card ${spoken[x.id]?'done':''}"><span class="echo-number">${i+1}</span><div class="echo-text"><strong>${esc(x.hr)}</strong><span>${esc(x.de)}</span></div><button class="icon-btn" data-speak="${esc(x.hr)}">▶</button><button class="speak-check" data-spoken="${x.id}">${spoken[x.id]?'✓ Gesprochen':'Laut gesprochen'}</button></article>`).join('')}</div><div class="feedback" id="feedback"></div>`;}
  function choice(l,s){return head(s)+`<article class="exercise-card"><div class="exercise-prompt"><small>Aufgabe</small><strong>${esc(s.question)}</strong></div><div class="choice-list">${s.options.map((x,i)=>`<button class="choice" data-choice="${i}">${esc(x.text)}</button>`).join('')}</div><div class="feedback" id="feedback"></div></article>`;}
  function matching(l,s){const rights=s.pairs.map((p,i)=>({text:p[1],i})).sort(()=>Math.random()-.5);return head(s)+`<article class="exercise-card"><div class="matching"><div class="match-column">${s.pairs.map((p,i)=>`<button class="match-item" data-side="left" data-pair="${i}">${esc(p[0])}</button>`).join('')}</div><div class="match-column">${rights.map(p=>`<button class="match-item" data-side="right" data-pair="${p.i}">${esc(p.text)}</button>`).join('')}</div></div><div class="feedback" id="feedback"></div></article>`;}
  function pattern(l,s){return head(s)+`<article class="content-card"><div class="pattern-sentence">${s.pattern.map(x=>`<span>${esc(x)}</span>`).join('')}<button class="icon-btn" data-speak="${esc(s.pattern.join(' '))}">▶</button></div><div class="examples">${s.examples.map((x,i)=>`<div class="example"><div><strong>${esc(x[0])}</strong><span>${esc(x[1])}</span></div><div><button class="icon-btn" data-speak="${esc(x[0])}">▶</button>${favoriteButton(key(l.id,s.id)+':ex'+i,x[0])}</div></div>`).join('')}</div><aside class="grammar-note"><strong>Merke</strong><p>${esc(s.note)}</p></aside></article>`+passive(l,s,'Muster verstanden');}
  function builder(l,s){return head(s)+`<article class="exercise-card"><div class="exercise-prompt"><small>Bedeutung</small><strong>${esc(s.prompt)}</strong></div><div class="built-sentence" id="built"><span class="muted">Tippe auf den ersten Baustein.</span></div><div class="token-bank">${s.tokens.map((x,i)=>`<button class="token" data-token="${i}">${esc(x)}</button>`).join('')}</div><div class="button-row" style="margin-top:18px"><button class="button secondary small" id="builder-reset">Zurücksetzen</button><button class="button primary small" id="builder-check">Prüfen</button></div><div class="feedback" id="feedback"></div></article>`;}
  function cloze(l,s){return head(s)+`<article class="exercise-card"><div class="cloze-line"><span>${esc(s.before)}</span><input id="cloze-input" autocomplete="off"><span>${esc(s.after)}</span><button class="icon-btn" data-speak="${esc(s.before+' '+s.answer+' '+s.after)}">▶</button></div><p><button class="text-button" id="hint">Hinweis</button> <span id="hint-text" hidden>${esc(s.hint)}</span></p><button class="button primary small" id="cloze-check">Prüfen</button><div class="feedback" id="feedback"></div></article>`;}
  function generator(l,s){return head(s)+`<article class="exercise-card"><div class="generator-slots">${s.slots.map((slot,i)=>`<label>${esc(slot.label)}<select data-slot="${i}">${slot.options.map(x=>`<option>${esc(x)}</option>`).join('')}</select></label>`).join('')}</div><div class="generated"><strong id="generated"></strong><div><button class="icon-btn" id="generated-speak">▶</button><button class="favorite" id="generated-favorite">★</button></div></div><button class="speak-check" id="generator-done">Ich habe den Satz laut gesprochen</button><div class="feedback" id="feedback"></div></article>`;}
  function free(l,s){const note=state.notes.find(n=>n.lessonId===l.id&&n.stepId===s.id);return head(s)+`<article class="exercise-card free-box"><div class="exercise-prompt"><strong>${esc(s.intro)}</strong><p>${esc(s.prompt)}</p></div><textarea id="free-text" rows="5" placeholder="${esc(s.placeholder)}">${esc(note?.text||'')}</textarea><div style="margin-top:14px"><button class="button primary" id="free-save">Satz speichern</button></div><div class="feedback" id="feedback"></div></article>`;}
  function mission(l,s){const checks=state.mission[key(l.id,s.id)]||{};return head(s)+`<article class="mission-card"><div class="mission-main"><strong>${esc(s.sentence)}</strong><div><button class="icon-btn" data-speak="${esc(s.sentence)}">▶</button>${favoriteButton(key(l.id,s.id)+':main',s.sentence)}</div></div><details><summary>Andere passende Sätze</summary>${s.alternatives.map((x,i)=>`<p>${esc(x)} <button class="text-button" data-speak="${esc(x)}">Anhören</button> ${favoriteButton(key(l.id,s.id)+':a'+i,x)}</p>`).join('')}</details><div class="mission-checks">${s.checks.map((x,i)=>`<label><input type="checkbox" data-mission="${i}" ${checks[i]?'checked':''}> ${esc(x)}</label>`).join('')}</div><div class="feedback" id="feedback"></div></article>`;}
  function summary(l,s){return head(s)+`<article class="content-card"><ul class="achievement-list">${s.achievements.map(x=>`<li>✓ ${esc(x)}</li>`).join('')}</ul><div class="suggestions"><strong>Welcher Satz soll ins Lernmemory?</strong>${s.suggestions.map((x,i)=>`<div class="suggestion"><span>${esc(x)}</span><div><button class="icon-btn" data-speak="${esc(x)}">▶</button>${favoriteButton(key(l.id,s.id)+':s'+i,x)}</div></div>`).join('')}</div></article>`+passive(l,s,'Abschluss ansehen');}
  function feedback(ok,text){const f=document.querySelector('#feedback');if(!f)return;f.className=`feedback show ${ok?'good':'bad'}`;f.textContent=text;}
  function wrong(l,s,title,answer){const k=key(l.id,s.id);state.attempts[k]=(state.attempts[k]||0)+1;if(state.attempts[k]>=2)state.difficult[k]={id:k,title,answer};save();}
  function bindStep(l,s,index,all){
    document.querySelector('[data-complete]')?.addEventListener('click',()=>{complete(l.id,s.id);renderStep(l,s,index,all);updateNav(l,all,index);renderMap(l,all,index);toast('Schritt gespeichert.');});
    document.querySelector('[data-redo]')?.addEventListener('click',()=>{delete state.completed[key(l.id,s.id)];save();renderStep(l,s,index,all);updateNav(l,all,index);renderMap(l,all,index);});
    if(s.type==='dialogue')document.querySelector('#play-dialog').onclick=async()=>{for(const x of s.dialogue){say(x.hr);await new Promise(r=>setTimeout(r,2500));}};
    if(s.type==='echo'){document.querySelectorAll('[data-spoken]').forEach(b=>b.onclick=()=>{const k=key(l.id,s.id);state.spoken[k] ||= {};state.spoken[k][b.dataset.spoken]=true;if(Object.keys(state.spoken[k]).length===s.prompts.length)complete(l.id,s.id);save();renderStep(l,s,index,all);updateNav(l,all,index);renderMap(l,all,index);});}
    if(s.type==='choice')document.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>{if(done(l.id,s.id))return;const o=s.options[+b.dataset.choice];document.querySelectorAll('[data-choice]').forEach(x=>x.disabled=true);b.classList.add(o.correct?'correct':'wrong');if(o.correct){complete(l.id,s.id);feedback(true,'Richtig. '+s.explanation);}else{wrong(l,s,s.title,s.question);feedback(false,'Noch nicht. '+s.explanation);}updateNav(l,all,index);renderMap(l,all,index);});
    if(s.type==='matching'){let selected=null,hits=0;document.querySelectorAll('.match-item').forEach(b=>b.onclick=()=>{if(b.classList.contains('done'))return;if(!selected){selected=b;b.classList.add('selected');return;}if(selected.dataset.side===b.dataset.side){selected.classList.remove('selected');selected=b;b.classList.add('selected');return;}if(selected.dataset.pair===b.dataset.pair){selected.classList.add('done');b.classList.add('done');hits++;selected=null;if(hits===s.pairs.length){complete(l.id,s.id);feedback(true,'Alles richtig zugeordnet.');updateNav(l,all,index);renderMap(l,all,index);}}else{wrong(l,s,s.title,'Bausteine erneut zuordnen');feedback(false,'Diese beiden gehören nicht zusammen.');selected.classList.remove('selected');selected=null;}});}
    if(s.type==='builder'){let built=[];const draw=()=>{document.querySelector('#built').innerHTML=built.length?built.map((i,n)=>`<button class="token" data-built="${n}">${esc(s.tokens[i])}</button>`).join(''):'<span class="muted">Tippe auf den ersten Baustein.</span>';document.querySelectorAll('[data-token]').forEach(b=>b.disabled=built.includes(+b.dataset.token));document.querySelectorAll('[data-built]').forEach(b=>b.onclick=()=>{built.splice(+b.dataset.built,1);draw();});};document.querySelectorAll('[data-token]').forEach(b=>b.onclick=()=>{built.push(+b.dataset.token);draw();});document.querySelector('#builder-reset').onclick=()=>{built=[];draw();};document.querySelector('#builder-check').onclick=()=>{const result=built.map(i=>s.tokens[i]),ok=JSON.stringify(result)===JSON.stringify(s.answer);if(ok){complete(l.id,s.id);feedback(true,'Richtig gebaut: '+s.answer.join(' '));}else{wrong(l,s,s.title,s.answer.join(' '));feedback(false,'Die Reihenfolge stimmt noch nicht.');}updateNav(l,all,index);renderMap(l,all,index);};}
    if(s.type==='cloze'){document.querySelector('#hint').onclick=()=>document.querySelector('#hint-text').hidden=false;document.querySelector('#cloze-check').onclick=()=>{const ok=document.querySelector('#cloze-input').value.trim().toLowerCase()===s.answer.toLowerCase();if(ok){complete(l.id,s.id);feedback(true,'Richtig: '+s.before+' '+s.answer+' '+s.after);}else{wrong(l,s,s.title,s.answer);feedback(false,'Noch nicht. '+s.hint);}updateNav(l,all,index);renderMap(l,all,index);};}
    if(s.type==='generator'){const selects=[...document.querySelectorAll('[data-slot]')],out=document.querySelector('#generated');const update=()=>out.textContent=selects.map(x=>x.value).join(' ');selects.forEach(x=>x.onchange=update);update();document.querySelector('#generated-speak').onclick=()=>say(out.textContent);document.querySelector('#generated-favorite').onclick=()=>toggleFavorite(key(l.id,s.id)+':generated:'+out.textContent,out.textContent);document.querySelector('#generator-done').onclick=()=>{complete(l.id,s.id);feedback(true,'Gesprochen und gespeichert.');updateNav(l,all,index);renderMap(l,all,index);};}
    if(s.type==='free')document.querySelector('#free-save').onclick=()=>{const text=document.querySelector('#free-text').value.trim();if(text.length<8){feedback(false,'Schreibe einen vollständigen kurzen Satz.');return;}let n=state.notes.find(n=>n.lessonId===l.id&&n.stepId===s.id);if(n)Object.assign(n,{text,updated:new Date().toISOString()});else state.notes.unshift({id:id('note'),title:'Mein Satz: '+s.title,text,pinned:true,lessonId:l.id,stepId:s.id,updated:new Date().toISOString()});complete(l.id,s.id);save();feedback(true,'Der Satz liegt jetzt in deinem Notizbuch.');updateNav(l,all,index);renderMap(l,all,index);};
    if(s.type==='mission')document.querySelectorAll('[data-mission]').forEach(b=>b.onchange=()=>{const k=key(l.id,s.id);state.mission[k] ||= {};state.mission[k][b.dataset.mission]=b.checked;const count=Object.values(state.mission[k]).filter(Boolean).length;if(count===s.checks.length){complete(l.id,s.id);feedback(true,'Mission vorbereitet. Der echte Satz darf klein sein.');}save();updateNav(l,all,index);renderMap(l,all,index);});
  }
  function openLessonNote(l,s){document.querySelector('#lesson-note-title').value=`Notiz zu: ${s.title}`;document.querySelector('#lesson-note-text').value='';document.querySelector('#lesson-note-pinned').checked=false;openDialog(document.querySelector('#lesson-note-dialog'));}
  function openVocabulary(l){document.querySelector('#vocabulary-grid').innerHTML=l.vocabulary.map(v=>`<article class="vocab-card"><strong>${esc(v.hr)}</strong><span>${esc(v.de)}</span><small>${esc(v.note)}</small><button class="text-button" data-speak="${esc(v.hr.split('/')[0])}">Anhören</button></article>`).join('');openDialog(document.querySelector('#vocabulary-dialog'));}
  function toggleFocus(){state.focus=!state.focus;save();document.body.classList.toggle('focus-mode',state.focus);toast(state.focus?'Fokusmodus an.':'Fokusmodus aus.');}
  function finish(l,all){all.forEach(s=>complete(l.id,s.id));updateNav(l,all,all.length-1);document.querySelector('#finish-dialog h2').textContent=`Bravo, ${state.profile.name||'Regina'}.`;document.querySelector('#finish-stats').innerHTML=`<div><strong>${all.length}</strong><span>Schritte</span></div><div><strong>${Object.keys(state.favorites).length}</strong><span>Merksätze</span></div><div><strong>${state.notes.filter(n=>n.lessonId===l.id).length}</strong><span>Notizen</span></div>`;openDialog(document.querySelector('#finish-dialog'));}
})();
