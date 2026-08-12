(function(){
  const ROOT = document.getElementById('writing-root');
  const STORIES_URL = 'stories.json';

  function parseDate(s){
    const [y,m,d] = (s||'').split('-').map(Number);
    return new Date(y||0, (m||1)-1, d||1);
  }
  function fmtDate(d){
    try { return d.toLocaleDateString(undefined, { year:'numeric', month:'long', day:'numeric' }); }
    catch(e){ return ''; }
  }

  function escapeHtml(s){
    return String(s||'').replace(/[&<>"']/g, c=>({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'
    })[c]);
  }

  function renderStoryCard(s){
    const d = parseDate(s.date);
    const dateStr = isFinite(d) ? fmtDate(d) : '';
    const tags = Array.isArray(s.tags) ? s.tags : [];
    const tagHtml = tags.length ? `<div class="tags">${tags.map(t=>`<code>${escapeHtml(t)}</code>`).join(' ')}</div>` : '';
    const desc = s.excerpt || s.description || s.text || '';
    return `
      <div class="story">
        <h4><a href="${escapeHtml(s.href||'#')}">${escapeHtml(s.title||'Untitled')}</a></h4>
        ${dateStr ? `<div class="story-date">${dateStr}</div>`:''}
        ${desc ? `<p>${desc}</p>`:''}
        ${tagHtml}
      </div>
    `;
  }

  function renderList(items){
    if(!ROOT) return;
    if(!items || !items.length){
      ROOT.innerHTML = '<p>No stories yet.</p>';
      return;
    }
    // sort by date desc when available, else by title
    const sorted = [...items].sort((a,b)=>{
      const da = parseDate(a.date).getTime()||0;
      const db = parseDate(b.date).getTime()||0;
      if(db!==da) return db-da;
      return String(a.title||'').localeCompare(String(b.title||''));
    });
    ROOT.innerHTML = sorted.map(renderStoryCard).join('\n');
  }

  async function load(){
    try {
      const res = await fetch(STORIES_URL, { cache:'no-cache' });
      if(!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data = await res.json();
      if(!Array.isArray(data)) throw new Error('stories.json must be an array');
      renderList(data);
    } catch(err){
      if(ROOT){
        ROOT.innerHTML = `<div class="story"><p>Failed to load stories: ${escapeHtml(err.message||String(err))}</p></div>`;
      }
      console.error(err);
    }
  }

  load();
})();
