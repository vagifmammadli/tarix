import '@fontsource/cormorant-garamond/latin-ext-500.css';
import '@fontsource/cormorant-garamond/latin-500.css';
import '@fontsource/cormorant-garamond/latin-ext-600.css';
import '@fontsource/cormorant-garamond/latin-600.css';
import '@fontsource/manrope/latin-ext-400.css';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-ext-600.css';
import '@fontsource/manrope/latin-600.css';
import './style.css';
import { createIcons, ArrowRight, ArrowLeft, X, Map, BookOpen, Maximize, Minimize, Settings2, Share2, Move, MousePointer2, RotateCcw, Footprints, Layers, ChevronRight, ChevronLeft, ExternalLink, Plus, Minus, Compass, Check, Info, Presentation, Volume2, VolumeX } from 'lucide';
import { exhibits as azExhibits, sources as azSources, environments as azEnvironments, creditFor } from './data/exhibits.js';
import { englishExhibits, englishSources, englishEnvironments } from './data/english.js';
import { translateDom } from './data/ui-en.js';
const language = localStorage.getItem('tarix-language') === 'az' ? 'az' : 'en';
const exhibits = language === 'en' ? azExhibits.map((item,i)=>({...item,...englishExhibits[i]})) : azExhibits;
const sources = language === 'en' ? Object.fromEntries(Object.entries(azSources).map(([id,item])=>[id,{...item,...englishSources[id]}])) : azSources;
const environments = language === 'en' ? azEnvironments.map((item,i)=>({...item,...englishEnvironments[i]})) : azEnvironments;
const assetUrl = path => `${import.meta.env.BASE_URL}${path}`;
const translate = root => { if (language === 'en') translateDom(root); };

const iconSet = { ArrowRight, ArrowLeft, X, Map, BookOpen, Maximize, Minimize, Settings2, Share2, Move, MousePointer2, RotateCcw, Footprints, Layers, ChevronRight, ChevronLeft, ExternalLink, Plus, Minus, Compass, Check, Info, Presentation, Volume2, VolumeX };
const icon = name => `<i data-lucide="${name}" aria-hidden="true"></i>`;
const icons = () => createIcons({ icons: iconSet, attrs: { 'stroke-width': 1.6 } });
const $ = selector => document.querySelector(selector);
const safe = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let stored = {};
try { stored = JSON.parse(localStorage.getItem('tarix-settings') || '{}'); } catch {}
const settings = { quality: stored.quality || (innerWidth < 760 ? 'low' : 'high'), reducedMotion: stored.reducedMotion ?? matchMedia('(prefers-reduced-motion: reduce)').matches };
let museum, selected = null, started = false, presentation = false, currentEnvironment = 'gallery', visited = new Set(), returnFocus = null, sceneRequest = 0;
let soundContext, soundGain, soundEnabled = false, toastTimer;

$('#app').innerHTML = `
  <a class="skip-link" href="#timeline">Dövrlərə keç</a>
  <main id="experience">
    <div id="world"></div>
    <div id="fallback" hidden><h2>Muzey mətnlə də açıqdır.</h2><p id="fallback-message"></p><button class="primary" data-action="collection">Kolleksiyanı aç ${icon('arrow-right')}</button></div>
    <header class="topbar">
      <button class="brand" data-action="home" aria-label="TARİX — girişə qayıt">TARİX<span>İnteraktiv muzey</span></button>
      <nav class="main-nav" aria-label="Əsas naviqasiya"><button data-action="gallery" class="nav-active">Sərgi</button><button data-action="collection">Kolleksiya</button><button data-action="map">Xəritə</button></nav>
      <div class="header-tools"><button class="language" data-action="language" aria-label="${language === 'en' ? 'Switch to Azerbaijani' : 'İngilis dilinə keç'}" title="${language === 'en' ? 'Switch to Azerbaijani' : 'İngilis dilinə keç'}">${language === 'en' ? 'AZ' : 'EN'}</button><button data-action="sources" class="text-button sources-button">Mənbələr ${icon('external-link')}</button><button class="icon-button" data-action="settings" aria-label="Parametrlər">${icon('settings-2')}</button></div>
    </header>
    <section class="welcome" id="welcome" aria-labelledby="welcome-title">
      <div class="welcome-body"><h1 id="welcome-title">Şərabın<br><em>izi ilə.</em></h1><p class="welcome-description">Bir qabdan başlayan,<br>minillikləri aşan hekayə.</p><p class="welcome-detail">Cənubi Qafqazdan Azərbaycana — əşyaların, məkanların və dəlillərin arasında gəzin.</p>
      <button class="primary enter-button" data-action="enter">Muzeyə daxil ol ${icon('arrow-right')}</button>
      <button class="presentation-link" data-action="present">${icon('presentation')} Təqdimatı başlat <span>15 dəq.</span></button>
      <div class="welcome-meta"><span>10 dayanacaq</span><span>Sərbəst kəşf</span></div></div>
      <div class="welcome-foot">Tarixə baxmayın. İçində gəzin.</div>
    </section>
    <div class="scene-info" id="scene-info" hidden><span id="scene-name">Muzey qalereyası</span><span id="scene-caption">Şərabın izi ilə · daimi sərgi</span></div>
    <div class="scene-tools" id="scene-tools"><button class="tool-button" data-action="scenes" aria-label="Mühitlər">${icon('layers')} <span>Mühitlər</span></button><button class="icon-button" data-action="fullscreen" aria-label="Tam ekran">${icon('maximize')}</button><button class="icon-button" data-action="sound" aria-label="Səsi aç" aria-pressed="false">${icon('volume-x')}</button></div>
    <div class="load-status" role="status" id="load-status">Qalereya hazırlanır…</div>
    <div class="transition-status" id="transition" hidden role="status"><span>Mühit yüklənir…</span><button data-action="cancel-scene">Qalereyaya qayıt</button></div>
    <div id="crosshair" hidden aria-hidden="true"></div>
    <button class="object-hint" id="object-hint" hidden><span class="key">E</span><span id="hint-title"></span>${icon('arrow-right')}</button>
    <div class="walk-guide" id="walk-guide" hidden><span class="desktop-guide"><span class="key">W A S D</span> Yerimək <span class="guide-divider"></span>${icon('mouse-pointer-2')} Sürüşdürüb baxmaq</span><span class="touch-guide">Sol idarə ilə yeriyin · ekranı sürüşdürüb baxın</span><button data-action="lock" class="icon-button" aria-label="Sərbəst siçan baxışını aktiv et">${icon('footprints')}</button><button data-action="help" class="icon-button" aria-label="İdarəetmə qaydaları">${icon('info')}</button></div>
    <div class="mini-map" id="mini-map" hidden><button data-action="floorplan" aria-label="Muzey planını aç"><svg viewBox="0 0 90 140" aria-hidden="true"><rect x="9" y="8" width="72" height="124" rx="2" fill="none" stroke="currentColor" stroke-width="1.3"/>${exhibits.map((e,i) => `<rect x="${e.position[0] < 0 ? 20 : 58}" y="${25 + Math.floor(i/2)*20}" width="12" height="8" fill="currentColor" opacity=".35"/>`).join('')}<path id="map-avatar" d="M0,-5 L3.5,4 0,2 -3.5,4Z" fill="#a36543" transform="translate(45 119)"/></svg><span>Muzey planı ${icon('plus')}</span></button></div>
    <div class="touch-controls" id="touch-controls" hidden><div id="joystick" role="group" aria-label="Yerimə idarəsi"><span id="joystick-knob">${icon('move')}</span></div><div class="turn-controls"><button data-turn="0.22" aria-label="Sola bax">${icon('chevron-left')}</button><button data-turn="-0.22" aria-label="Sağa bax">${icon('chevron-right')}</button></div></div>
    <aside class="exhibit-panel" id="exhibit-panel" hidden aria-labelledby="exhibit-title"></aside>
    <div class="inspect-controls" id="inspect-controls" hidden><span>Obyekti sürüşdürüb fırladın</span><button data-turn="0.35" class="icon-button" aria-label="Obyekti sola fırlat">${icon('chevron-left')}</button><button data-turn="-0.35" class="icon-button" aria-label="Obyekti sağa fırlat">${icon('chevron-right')}</button><button data-zoom="-1" class="icon-button" aria-label="Yaxınlaşdır">${icon('plus')}</button><button data-zoom="1" class="icon-button" aria-label="Uzaqlaşdır">${icon('minus')}</button><button data-action="reset" class="icon-button" aria-label="Baxışı sıfırla">${icon('rotate-ccw')}</button></div>
    <footer class="timeline-shell"><div class="timeline-heading"><span>Zaman boyunca</span><span id="visit-progress">0 / 10 kəşf edildi</span><button class="text-button" data-action="present">${icon('presentation')} <span>Təqdimat</span></button></div><nav id="timeline" aria-label="Sərginin zaman xətti">${exhibits.map((e,i) => `<button class="timeline-stop" data-exhibit="${i}"><span class="timeline-dot"></span><span class="timeline-date">${safe(e.date)}</span><span class="timeline-name">${safe(e.short)}</span></button>`).join('')}</nav></footer>
    <div id="toast" role="status" hidden></div>
    <dialog id="dialog" aria-labelledby="dialog-title"><button class="dialog-close icon-button" data-action="close-dialog" aria-label="Pəncərəni bağla">${icon('x')}</button><div id="dialog-content"></div></dialog>
  </main>`;
icons();
translate($('#app'));
document.documentElement.lang = language;
document.title = language === 'en' ? 'TARİX — Following the Wine Trail' : 'TARİX — Şərabın izi ilə';

function toast(message) { $('#toast').textContent = message; translate($('#toast')); $('#toast').hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => $('#toast').hidden = true, 4200); }
function persistSettings() { try { localStorage.setItem('tarix-settings', JSON.stringify(settings)); } catch {} }
function enter() {
  started = true; $('#welcome').hidden = true; $('#scene-info').hidden = false; $('#walk-guide').hidden = false;
  $('#mini-map').hidden = false; $('#touch-controls').hidden = false; document.body.classList.add('started');
  if (museum && !museum.exploring) museum.start();
  museum?.renderer.domElement.focus({ preventScroll: true });
}
function updateSceneLabel(id) {
  const environment = environments.find(item => item.id === id) || environments[0];
  $('#scene-name').textContent = environment.title;
  $('#scene-caption').textContent = id === 'gallery' ? 'Şərabın izi ilə · daimi sərgi' : environment.caption;
  translate($('#scene-info'));
}
function updateRoute() {
  document.querySelectorAll('[data-exhibit]').forEach(button => {
    const index = Number(button.dataset.exhibit);
    button.classList.toggle('active', index === selected); button.classList.toggle('visited', visited.has(index));
    if (index === selected) button.setAttribute('aria-current', 'step'); else button.removeAttribute('aria-current');
  });
  $('#visit-progress').textContent = `${visited.size} / 10 kəşf edildi`;
  translate($('#visit-progress'));
}
function setUrl() {
  const query = new URLSearchParams();
  if (selected !== null) query.set('exhibit', exhibits[selected].id);
  if (currentEnvironment !== 'gallery') query.set('scene', currentEnvironment);
  if (presentation) query.set('mode', 'presentation');
  const hash = query.size ? '#' + query.toString() : location.pathname;
  history.pushState(null, '', hash);
}
function sourceMarkup(ids) {
  return ids.map(id => { const s = sources[id]; return `<a class="source-row" href="${s.url}" target="_blank" rel="noopener noreferrer"><span><strong>${safe(s.title)}</strong><small>${safe(s.author)} · ${safe(s.year)}</small><small>${safe(s.detail)}</small></span>${icon('external-link')}</a>`; }).join('');
}
async function selectExhibit(index, push = true) {
  if (!exhibits[index]) return;
  closeDialog(); enter(); selected = index; visited.add(index);
  currentEnvironment = 'gallery'; sceneRequest++;
  updateSceneLabel('gallery');
  museum?.focus(index); museum?.block(false);
  const e = exhibits[index], credit = creditFor(e);
  $('#exhibit-panel').innerHTML = `
    <div class="panel-top"><span>${String(index + 1).padStart(2,'0')} / 10 · ${safe(e.date)}</span><button class="icon-button" data-action="close-exhibit" aria-label="Eksponatı bağla">${icon('x')}</button></div>
    <div class="panel-scroll"><h2 id="exhibit-title" tabindex="-1">${safe(e.title)}</h2><p class="exhibit-place">${safe(e.place)}</p><p class="exhibit-summary">${safe(e.summary)}</p><p class="exhibit-body">${safe(e.body)}</p>
    <div class="evidence-heading"><span class="evidence-dot ${e.level}"></span>${safe(e.evidence)}</div>
    <details open><summary>Dəlil nə deyir?</summary><p>${safe(e.finding)}</p><p class="limitation"><strong>Nəyi sübut etmir?</strong> ${safe(e.limitation)}</p></details>
    <details><summary>Mənbələr ${icon('external-link')}</summary>${e.sources.length ? sourceMarkup(e.sources) : '<p>Bu bölmə mənbə tənqidi məşqidir. Konkret yerə aid tarixi iddia irəli sürülmür.</p>'}</details>
    <details><summary>3D model haqqında</summary><p>${safe(e.credit || (language === 'en' ? '3D Assets · CC0 1.0. AI-generated illustrative model, not an authentic find or historical reconstruction. Scale and placement adjusted for this scene.' : credit.text))}</p><div class="credit-links"><a href="${credit.url}" target="_blank" rel="noopener noreferrer">Modelin mənbəyi ${icon('external-link')}</a><a href="${credit.license}" target="_blank" rel="noopener noreferrer">Lisenziya ${icon('external-link')}</a></div></details>
    ${e.environment ? `<button class="environment-link" data-environment="${e.environment}">${icon('compass')} Təmsili mühitə keç ${icon('arrow-right')}</button>` : ''}
    <div class="discussion"><h3>Birlikdə düşünək</h3><p>${safe(e.question)}</p></div>
    ${index === 9 ? `<fieldset class="reflection"><legend>Hansı nəticə dəlilə uyğundur?</legend><button data-reflection="origin">Bütün şərab bir yerdə yaranıb.</button><button data-reflection="evidence">Bu regionda mühüm erkən dəlillər var.</button><p id="reflection-result" aria-live="polite"></p></fieldset>` : ''}
    ${presentation ? `<div class="presenter-note"><h3>Təqdimatçı üçün</h3><p>${safe(e.note)}</p></div>` : ''}
    </div><div class="panel-footer"><button class="icon-button" data-action="previous" aria-label="Əvvəlki eksponat" ${index === 0 ? 'disabled' : ''}>${icon('arrow-left')}</button><button class="text-button" data-action="share">${icon('share-2')} Paylaş</button><button class="next-button" data-action="next">${index === 9 ? 'Ziyarəti bitir' : 'Növbəti'} ${icon('arrow-right')}</button></div>`;
  $('#exhibit-panel').hidden = false; $('#inspect-controls').hidden = false;
  $('#walk-guide').hidden = true; $('#touch-controls').hidden = true; $('#object-hint').hidden = true; $('#mini-map').hidden = true;
  document.body.classList.add('inspecting'); document.body.classList.toggle('presenting', presentation);
  updateRoute(); icons(); translate($('#exhibit-panel')); $('#exhibit-title').focus({ preventScroll: true });
  $('#timeline .active')?.scrollIntoView({ behavior: settings.reducedMotion ? 'instant' : 'smooth', block: 'nearest', inline: 'center' });
  if (push) setUrl();
}
function closeExhibit(push = true) {
  selected = null; $('#exhibit-panel').hidden = true; $('#inspect-controls').hidden = true;
  $('#walk-guide').hidden = !started; $('#touch-controls').hidden = !started; $('#mini-map').hidden = !started || currentEnvironment !== 'gallery';
  document.body.classList.remove('inspecting'); museum?.leaveExhibit(); updateRoute(); if (push) setUrl();
}
function openDialog(title, html, className = '') {
  museum?.block(true); returnFocus = document.activeElement;
  $('#dialog').className = className; $('#dialog-content').innerHTML = `<h2 id="dialog-title">${title}</h2>${html}`;
  if (!$('#dialog').open) $('#dialog').showModal(); icons();
  translate($('#dialog'));
}
function closeDialog() { if ($('#dialog').open) $('#dialog').close(); }
$('#dialog').addEventListener('close', () => { museum?.block(false); if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true }); });
$('#dialog').addEventListener('click', e => { if (e.target === $('#dialog')) { const r = e.target.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeDialog(); } });

function collection() {
  openDialog('Əşyaların danışdığı tarix', `<p class="dialog-intro">Bir eksponat seçin. Bütün məlumatlar 3D görüntü olmadan da oxuna bilər.</p><div class="collection-list">${exhibits.map((e,i) => `<button data-exhibit="${i}"><span class="list-number">${String(i+1).padStart(2,'0')}</span><span><strong>${safe(e.title)}</strong><small>${safe(e.place)}</small></span><span class="list-date">${safe(e.date)}</span>${icon('arrow-right')}</button>`).join('')}</div>`, 'wide-dialog');
}
function showMap() {
  const points = [{index:1,label:'Şulaveri / Qadaçrili',lon:44.83,lat:41.37},{index:2,label:'Hajji Firuz',lon:45.4,lat:36.25},{index:3,label:'Areni-1',lon:45.2,lat:39.73},{index:6,label:'Göygöl',lon:46.32,lat:40.59}];
  openDialog('Dəlillərin coğrafiyası', `<p class="dialog-intro">Cənubi Qafqaz və Zaqros boyunca dörd dayanacaq. Nöqtəyə toxunaraq həmin hekayəyə keçin.</p><div class="evidence-map"><div class="map-north">ŞİMAL ↑</div>${[36,38,40,42].map(lat => `<div class="latitude" style="bottom:${(lat-35)/8*100}%"><span>${lat}° N</span></div>`).join('')}${points.map(p=>`<button class="geo-point" style="left:${(p.lon-42)/9*100}%;bottom:${(p.lat-35)/8*100}%" data-exhibit="${p.index}"><span></span>${safe(p.label)}</button>`).join('')}<span class="map-region">CƏNUBİ QAFQAZ<br>VƏ ZAQROS</span></div><p class="map-note">Koordinatlı sxem · yerlər təxminidir. Müasir sərhədləri və ya qədim ticarət marşrutlarını göstərmir.</p><button class="line-link" data-exhibit="4">Aralıq dənizi hekayəsi: Baetulo ${icon('arrow-right')}</button><details class="research-note"><summary>Azərbaycanın qədim dövrü barədə nə bilirik?</summary><p>Naxçıvan, Kültəpə və digər məkanlara aid şərabçılıq iddiaları üçün ilkin qazıntı hesabatları ayrıca yoxlanmalıdır. “6000 illik şərab istehsalı” burada təsdiqlənmiş fakt kimi göstərilmir. Göygöl nöqtəsi XIX əsr sənaye irsinə aiddir.</p></details>`, 'map-dialog');
}
function floorplan() {
  openDialog('Muzey planı', `<p class="dialog-intro">İstədiyiniz dayanacağı seçin və birbaşa eksponata keçin.</p><div class="floorplan">${exhibits.map((e,i) => `<button data-exhibit="${i}" class="${visited.has(i)?'visited':''}"><span>${String(i+1).padStart(2,'0')}</span>${safe(e.short)}${visited.has(i)?icon('check'):icon('arrow-right')}</button>`).join('')}</div><div class="plan-entry">Giriş · ziyarət aşağıdakı zaman xətti ilə də davam edir</div>`);
}
function showScenes() {
  openDialog('Tarixin içində bir məkan', `<p class="dialog-intro">Qalereyadan çıxıb üç müxtəlif təmsili mühiti gəzin. Bu səhnələr real tarixi yerlərin rekonstruksiyası deyil.</p><div class="scene-list">${environments.map((e,i) => `<button data-environment="${e.id}"><span class="scene-index">${String(i+1).padStart(2,'0')}</span><span><strong>${safe(e.title)}</strong><small>${safe(e.caption)}</small></span>${icon(e.id===currentEnvironment?'check':'arrow-right')}</button>`).join('')}</div>`);
}
async function changeEnvironment(id, push = true) {
  closeDialog(); enter(); closeExhibit(false); const request = ++sceneRequest;
  if (!museum) { toast(language === 'en' ? '3D is unavailable on this device. Use the Collection to read the exhibits.' : '3D bu cihazda açılmayıb. Kolleksiya məlumatlarından istifadə edin.'); return; }
  const success = await museum.changeEnvironment(id);
  if (!success || request !== sceneRequest) return;
  currentEnvironment = museum.currentEnvironment;
  updateSceneLabel(currentEnvironment);
  $('#mini-map').hidden = id !== 'gallery'; if (push) setUrl();
}
function showSettings() {
  openDialog('Ziyarəti özünüzə uyğunlaşdırın', `<div class="setting-row"><span><strong>Qrafika keyfiyyəti</strong><small>Zəif cihazlarda sadə rejimi seçin.</small></span><select id="quality" aria-label="Qrafika keyfiyyəti"><option value="high" ${settings.quality==='high'?'selected':''}>Yüksək</option><option value="low" ${settings.quality==='low'?'selected':''}>Sadə</option></select></div><label class="setting-row"><span><strong>Hərəkəti azalt</strong><small>Kamera keçidləri dərhal tamamlanır.</small></span><input id="reduced-motion" type="checkbox" ${settings.reducedMotion?'checked':''}></label><button class="line-link" data-action="collection">3D olmadan kolleksiyanı oxu ${icon('book-open')}</button><button class="line-link" data-action="help">İdarəetmə qaydaları ${icon('info')}</button><p class="map-note">Seçimlər yalnız bu brauzerdə saxlanılır.</p>`);
  $('#quality').addEventListener('change', e => { settings.quality = e.target.value; museum?.setQuality(settings.quality); persistSettings(); });
  $('#reduced-motion').addEventListener('change', e => { settings.reducedMotion = e.target.checked; document.body.classList.toggle('reduce-motion', settings.reducedMotion); museum?.finishTransition(); persistSettings(); });
}
function help() {
  openDialog('Muzeydə necə gəzməli?', `<dl class="help-list"><div><dt>W A S D / ox düymələri</dt><dd>İrəli, geri və yanlara yeriyin. Sürət üçün Shift.</dd></div><div><dt>Siçanı basıb sürüşdürün</dt><dd>Ətrafa baxın. Ayaq izi düyməsi sərbəst siçan baxışını aktiv edir.</dd></div><div><dt>Obyektə toxunun / E</dt><dd>Eksponat haqqında məlumatı açın.</dd></div><div><dt>Telefon və planşet</dt><dd>Sol alt idarə ilə yeriyin, ekranı sürüşdürüb baxın. Məlumatı açmaq üçün obyektə toxunun.</dd></div><div><dt>Esc</dt><dd>Pəncərəni və ya eksponatı bağlayın; siçanı azad edin.</dd></div><div><dt>Təqdimat rejimi</dt><dd>Sol və sağ oxlarla hekayəni davam etdirin. Mətn panelində təqdimatçı qeydləri görünür.</dd></div></dl><button class="primary" data-action="close-dialog">Aydındır ${icon('check')}</button>`);
}
async function share() {
  const url = location.href;
  openDialog('Bu hekayəni paylaşın', `<p class="dialog-intro">${selected !== null ? safe(exhibits[selected].title) : 'Şərabın izi ilə — interaktiv muzey'}</p><div class="qr-area"><canvas id="qr" aria-label="Bölmənin QR kodu"></canvas></div><label class="share-label" for="share-url">Bölmənin bağlantısı</label><input id="share-url" class="share-input" type="url" value="${safe(url)}"><button class="primary" data-action="copy">${icon('share-2')} Bağlantını kopyala</button><p class="map-note" id="share-note">${/localhost|127\.0\.0\.1/.test(location.hostname) ? 'Bu ünvan yalnız bu kompüterdə açılır. Sinifdə eyni Wi-Fi şəbəkəsində kompüterin şəbəkə IP ünvanını və portunu istifadə edin; QR üçün yuxarıdakı ünvanı dəyişin. Telefon və kompüter eyni şəbəkədə olmalıdır.' : 'QR kod bu bölməni açır. Təqdimat cihazlar arasında avtomatik sinxronlaşmır.'}</p>`);
  const { default: QRCode } = await import('qrcode');
  const render = async () => { if (!$('#qr')) return; try { const u = new URL($('#share-url').value); if (!['http:','https:'].includes(u.protocol)) throw new Error(); await QRCode.toCanvas($('#qr'), u.href, { width: 200, margin: 2, color: { dark: '#29483b', light: '#f8f5ed' } }); } catch { toast(language === 'en' ? 'Enter a complete http or https URL.' : 'Tam http və ya https ünvanı daxil edin.'); } };
  await render(); $('#share-url')?.addEventListener('change', render);
}
async function copy() {
  const field = $('#share-url');
  try { await navigator.clipboard.writeText(field.value); toast(language === 'en' ? 'Link copied.' : 'Bağlantı kopyalandı.'); } catch { field.select(); toast(language === 'en' ? 'Link selected. Press Ctrl+C to copy.' : 'Bağlantı seçildi. Ctrl+C ilə kopyalayın.'); }
}
function toggleSound() {
  if (!soundContext) {
    soundContext = new (window.AudioContext || window.webkitAudioContext)(); soundGain = soundContext.createGain(); soundGain.gain.value = 0; soundGain.connect(soundContext.destination);
    for (const hz of [130.81,196,261.63]) { const oscillator = soundContext.createOscillator(); oscillator.type = 'sine'; oscillator.frequency.value = hz; const gain = soundContext.createGain(); gain.gain.value = .08; oscillator.connect(gain); gain.connect(soundGain); oscillator.start(); }
  }
  soundEnabled = !soundEnabled; soundContext.resume(); soundGain.gain.setTargetAtTime(soundEnabled ? .16 : 0, soundContext.currentTime, .5);
  const button = $('[data-action="sound"]'); button.innerHTML = icon(soundEnabled?'volume-2':'volume-x'); button.setAttribute('aria-pressed',String(soundEnabled)); button.setAttribute('aria-label',language==='en'?(soundEnabled?'Turn sound off':'Turn sound on'):(soundEnabled?'Səsi bağla':'Səsi aç')); icons();
}
async function fullscreen() { try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); } catch { toast(language === 'en' ? 'Fullscreen is unavailable here. Try your browser’s fullscreen option.' : 'Bu brauzerdə tam ekran əlçatan deyil. Brauzerin tam ekran seçimini istifadə edin.'); } }
document.addEventListener('fullscreenchange', () => { const b = $('[data-action="fullscreen"]'); b.innerHTML = icon(document.fullscreenElement?'minimize':'maximize'); b.setAttribute('aria-label',language==='en'?(document.fullscreenElement?'Exit fullscreen':'Fullscreen'):(document.fullscreenElement?'Tam ekrandan çıx':'Tam ekran')); icons(); });

const actions = {
  enter, collection, map: showMap, sources: () => openDialog('Hekayənin arxasındakı mənbələr', `<p class="dialog-intro">Elmi nəşrlər, muzey qeydləri və rəsmi sənədlər. Hər eksponat öz dəlilini və məhdudiyyətini ayrıca göstərir.</p>${sourceMarkup(Object.keys(sources))}<details><summary>Modellər və istifadə hüquqları</summary><p>Sənədləşdirilmiş amfora: Yiting Tan / Museu de Badalona, CC BY 4.0. Təmsili amfora: Noedlh, CC BY-SA 4.0. Digər obyektlər və mühitlər: 3D Assets, CC0 1.0. Modellər hər eksponatın panelində ayrıca qeyd olunur.</p><a href="${assetUrl('models/ATTRIBUTION.md')}" target="_blank" rel="noopener">Tam model reyestri ${icon('external-link')}</a></details>`),
  language: () => { localStorage.setItem('tarix-language', language === 'en' ? 'az' : 'en'); location.reload(); },
  settings: showSettings, help, scenes: showScenes, floorplan, share, copy, fullscreen, sound: toggleSound,
  'close-dialog': closeDialog, 'close-exhibit': () => { closeExhibit(); $('#timeline button').focus(); },
  'cancel-scene': () => changeEnvironment('gallery'), reset: () => museum?.reset(), lock: () => { enter(); museum?.lock(); },
  gallery: () => { enter(); changeEnvironment('gallery'); },
  present: () => { presentation = !presentation; toast(language === 'en' ? (presentation ? 'Presentation mode is on. Use the arrows to continue.' : 'Free exploration mode.') : (presentation?'Təqdimat rejimi açıldı. Oxlarla davam edin.':'Sərbəst ziyarət rejimi.')); selectExhibit(selected ?? 0); },
  previous: () => { if (selected > 0) selectExhibit(selected - 1); },
  next: () => { if (selected < 9) selectExhibit((selected ?? -1)+1); else { closeExhibit(false); presentation = false; setUrl(); openDialog('Tarix sualla davam edir.', '<p class="closing-message">Bir əşya. Bir mənbə. Yeni bir sual.</p><p class="dialog-intro">Sərgini tamamladınız. İndi bir tarixi iddia seçin, onu dəstəkləyən mənbəni göstərin və həmin mənbənin nəyi sübut etmədiyini izah edin.</p><button class="primary" data-action="collection">Kolleksiyaya qayıt</button>'); } },
  home: () => { closeDialog(); closeExhibit(false); started = false; presentation = false; $('#welcome').hidden = false; $('#scene-info').hidden = true; $('#walk-guide').hidden = true; $('#touch-controls').hidden = true; $('#mini-map').hidden = true; document.body.classList.remove('started','presenting'); museum?.changeEnvironment('gallery').then(()=>{ museum.exploring=false; museum.flyTo(new (museum.camera.position.constructor)(1.7,3.2,15),new (museum.camera.position.constructor)(-2,1.5,-7)); }); currentEnvironment = 'gallery'; updateSceneLabel('gallery'); setUrl(); },
};
document.addEventListener('click', event => {
  const target = event.target.closest('button'); if (!target || target.disabled) return;
  if (target.dataset.exhibit !== undefined) selectExhibit(Number(target.dataset.exhibit));
  else if (target.dataset.environment) changeEnvironment(target.dataset.environment);
  else if (target.dataset.turn) museum?.turn(Number(target.dataset.turn));
  else if (target.dataset.zoom) museum?.zoom(Number(target.dataset.zoom));
  else if (target.dataset.reflection) { $('#reflection-result').textContent = language === 'en' ? (target.dataset.reflection==='evidence' ? 'Yes. The evidence shows the region’s importance; it does not identify a single point of invention.' : 'That conclusion goes beyond the evidence. The earliest known find does not prove all wine began in one place.') : (target.dataset.reflection==='evidence' ? 'Bəli. Dəlillər regionun əhəmiyyətini göstərir; tək ixtira nöqtəsini müəyyən etmir.' : 'Bu nəticə dəlilin imkanını aşır. Ən erkən məlum tapıntı bütün şərabın bir yerdə yarandığını sübut etmir.'); }
  else if (target.dataset.action) { const result = actions[target.dataset.action]?.(); if (result?.catch) result.catch(error => { console.error(error); toast(language === 'en' ? 'That action could not finish. Please try again.' : 'Əməliyyat tamamlanmadı. Yenidən cəhd edin.'); }); }
});
document.addEventListener('keydown', e => {
  if (e.target.closest('input,select,textarea') || $('#dialog').open) return;
  if (e.key === 'Escape' && selected !== null) { closeExhibit(); $('#timeline button').focus(); }
  if (presentation && selected !== null && !e.target.closest('button,a,summary') && ['ArrowLeft','ArrowRight'].includes(e.key)) { e.preventDefault(); e.key==='ArrowRight' ? actions.next() : actions.previous(); }
});
let joyPointer = null;
const joy = $('#joystick');
function moveJoystick(e) {
  if (!museum || joyPointer !== e.pointerId) return;
  const rect = joy.getBoundingClientRect(), dx = e.clientX - rect.left - rect.width/2, dy = e.clientY-rect.top-rect.height/2;
  const length = Math.hypot(dx,dy), factor = length > 32 ? 32/length : 1;
  museum.motion = null; museum.joystick.x = dx*factor/32; museum.joystick.y = dy*factor/32;
  $('#joystick-knob').style.transform = `translate(${dx*factor}px,${dy*factor}px)`;
}
joy.addEventListener('pointerdown', e => { joyPointer = e.pointerId; joy.setPointerCapture(e.pointerId); moveJoystick(e); });
joy.addEventListener('pointermove', moveJoystick);
const releaseJoy = () => { joyPointer=null; if(museum) museum.joystick.x=museum.joystick.y=0; $('#joystick-knob').style.transform=''; };
joy.addEventListener('pointerup',releaseJoy); joy.addEventListener('pointercancel',releaseJoy); window.addEventListener('blur',releaseJoy);

async function readUrl() {
  const query = new URLSearchParams(location.hash.slice(1));
  presentation = query.get('mode') === 'presentation';
  const index = exhibits.findIndex(e => e.id === query.get('exhibit'));
  if (index >= 0) await selectExhibit(index, false);
  else if (environments.some(e => e.id === query.get('scene'))) await changeEnvironment(query.get('scene'), false);
  else if (selected !== null) closeExhibit(false);
}
window.addEventListener('popstate', readUrl);
document.body.classList.toggle('reduce-motion', settings.reducedMotion);

async function boot() {
  try {
    await document.fonts.ready;
    const { Museum } = await import('./museum.js');
    museum = new Museum($('#world'), {
      select: index => selectExhibit(index), toast,
      progress: (loaded,total) => { $('#load-status').textContent= language === 'en' ? (loaded===total ? 'Gallery ready' : `Loading exhibits · ${loaded}/${total}`) : (loaded===total ? 'Qalereya hazırdır' : `Eksponatlar yüklənir · ${loaded}/${total}`); if(loaded===total) setTimeout(()=>$('#load-status').hidden=true,1800); },
      modelError: index => toast(language === 'en' ? `${exhibits[index].short}: the model could not load. An illustrative vessel is shown; information remains available.` : `${exhibits[index].short}: model açılmadı, təmsili qab göstərilir. Məlumat əlçatandır.`),
      sceneLoading: loading => { $('#transition').hidden=!loading; },
      hover: index => { $('#object-hint').hidden=index<0 || selected!==null || !started; if(index>=0) { $('#hint-title').textContent=exhibits[index].short; $('#object-hint').onclick=()=>selectExhibit(index); } },
      lock: locked => { $('#crosshair').hidden=!locked; if(locked) toast(language === 'en' ? 'Esc — release mouse · E — open exhibit' : 'Esc — siçanı azad et · E — eksponatı aç'); },
      position: (x,z,yaw) => { $('#map-avatar').setAttribute('transform',`translate(${45+x*2.6} ${25+(7-z)*2.5}) rotate(${-yaw*180/Math.PI})`); },
      error: message => { $('#fallback').hidden=false; $('#fallback-message').textContent=message; },
    }, settings);
    if (started) museum.start(); await readUrl();
  } catch(error) {
    console.error('Museum initialization:',error);
    $('#load-status').hidden=true; $('#fallback').hidden=false;
    $('#fallback-message').textContent= language === 'en' ? 'The 3D view could not open in this browser. You can read all exhibits, sources and the presentation route through the Collection menu.' : 'Bu brauzerdə 3D görüntü açıla bilmədi. Bütün eksponatları, mənbələri və təqdimat marşrutunu Kolleksiya menyusundan oxuya bilərsiniz.';
    await readUrl();
  }
}
boot();
