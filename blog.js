(function(){
  const ROOT = document.getElementById('blog-root') || document.getElementById('archive-root');
  const PAGE = (document.body.getAttribute('data-page')||'').toLowerCase();
  const NAV = document.getElementById('archive-nav');
  const POSTS_URL = 'posts.json';

  function parseDate(s){
    // expect YYYY-MM-DD
    const [y,m,d] = s.split('-').map(Number);
    return new Date(y, (m-1), d);
  }

  function fmtDate(d){
    return d.toLocaleDateString(undefined, { year:'numeric', month:'long', day:'numeric' });
  }

  function monthKey(d){
    const y = d.getFullYear();
    const m = String(d.getMonth()+1).padStart(2,'0');
    return `${y}-${m}`;
  }

  function monthLabel(key){
    const [y,m] = key.split('-').map(Number);
    const d = new Date(y,m-1,1);
    return d.toLocaleDateString(undefined, { year:'numeric', month:'long' });
  }

  function youtubeId(url){
    if(!url) return null;
    try {
      const u = new URL(url);
      if(u.hostname.includes('youtu.be')){
        return u.pathname.slice(1);
      }
      if(u.hostname.includes('youtube.com')){
        if(u.searchParams.get('v')) return u.searchParams.get('v');
        // /embed/ID
        const parts = u.pathname.split('/').filter(Boolean);
        const idx = parts.indexOf('embed');
        if(idx>=0 && parts[idx+1]) return parts[idx+1];
      }
    } catch(e) {}
    return null;
  }

  function groupByDate(posts){
    const map = new Map();
    for(const p of posts){
      const key = p.date; // already YYYY-MM-DD
      if(!map.has(key)) map.set(key, []);
      map.get(key).push(p);
    }
    // sort dates desc
    const keys = Array.from(map.keys()).sort((a,b)=> b.localeCompare(a));
    return keys.map(k=>({ dateStr:k, date:parseDate(k), items: map.get(k) }));
  }

  function renderPost(p){
    const d = parseDate(p.date);
    const wrap = document.createElement('div');
    wrap.className = 'post';

    const h = document.createElement('h4');
    h.className = 'post-date';
    h.textContent = fmtDate(d);
    wrap.appendChild(h);

    const textP = document.createElement('p');
    textP.textContent = p.text || '';
    wrap.appendChild(textP);

    const media = document.createElement('div');
    media.className = 'media';

    if(p.youtube){
      const id = youtubeId(p.youtube);
      if(id){
        const iframe = document.createElement('iframe');
        iframe.setAttribute('src', `https://www.youtube.com/embed/${id}`);
        iframe.setAttribute('title', 'YouTube video player');
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
        iframe.setAttribute('allowfullscreen', 'true');
        media.appendChild(iframe);
      }
    }

    if(Array.isArray(p.images)){
      for(const img of p.images){
        const el = document.createElement('img');
        el.src = img.src;
        el.alt = img.alt || 'Blog image';
        el.loading = 'lazy';
        media.appendChild(el);
      }
    }

    if(media.children.length){
      wrap.appendChild(media);
    }

    return wrap;
  }

  function daysBetween(a,b){
    const MS = 24*60*60*1000;
    const at = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const bt = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.floor((bt - at)/MS);
  }

  async function load(){
    try{
      const res = await fetch(POSTS_URL, { cache: 'no-store' });
      if(!res.ok) throw new Error('Failed to load posts.json');
      const all = await res.json();
      // normalize, ensure date format
      const posts = all
        .filter(p=>p && p.date)
        .map(p=>({ ...p, date: String(p.date).slice(0,10) }));

      const today = new Date();
      const grouped = groupByDate(posts);

      if(PAGE === 'blog'){
        // Keep up to 7 most recent date groups
        const latestGroups = grouped.slice(0, 7);
        if(latestGroups.length === 0){
          const empty = document.createElement('p');
          empty.textContent = 'No posts yet.';
          ROOT.appendChild(empty);
          return;
        }
        for(const g of latestGroups){
          // If multiple posts in a day, render sequentially but with a single date heading for first
          // We will render each post, but only put date on the first
          let first = true;
          for(const post of g.items){
            const elem = renderPost({ ...post, date: g.dateStr });
            if(!first){
              // remove duplicate date heading for subsequent posts in same day
              const firstChild = elem.querySelector('.post-date');
              if(firstChild) firstChild.remove();
            }
            ROOT.appendChild(elem);
            first = false;
          }
        }
      } else if(PAGE === 'archives'){
        // Only posts older than ~1 month (30 days)
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 30);
        const archived = posts.filter(p => daysBetween(parseDate(p.date), cutoff) >= 0);
        // group by month
        const byMonth = new Map();
        for(const p of archived){
          const d = parseDate(p.date);
          const key = monthKey(d);
          if(!byMonth.has(key)) byMonth.set(key, []);
          byMonth.get(key).push(p);
        }
        // sort months desc
        const months = Array.from(byMonth.keys()).sort((a,b)=> b.localeCompare(a));
        if(months.length === 0){
          const empty = document.createElement('p');
          empty.textContent = 'No archived posts yet.';
          ROOT.appendChild(empty);
          return;
        }
        // nav
        if(NAV){
          months.forEach(key=>{
            const a = document.createElement('a');
            a.href = `#m-${key}`;
            a.textContent = monthLabel(key);
            NAV.appendChild(a);
          });
        }
        // render months
        for(const key of months){
          const sec = document.createElement('section');
          sec.className = 'month';
          sec.id = `m-${key}`;
          const h = document.createElement('h3');
          h.textContent = monthLabel(key);
          sec.appendChild(h);
          // sort posts for month desc by date
          const arr = byMonth.get(key).sort((a,b)=> b.date.localeCompare(a.date));
          // group by day within month to display dates nicely
          const perDay = groupByDate(arr);
          for(const g of perDay){
            let first = true;
            for(const post of g.items){
              const elem = renderPost({ ...post, date: g.dateStr });
              if(!first){
                const firstChild = elem.querySelector('.post-date');
                if(firstChild) firstChild.remove();
              }
              sec.appendChild(elem);
              first = false;
            }
          }
          ROOT.appendChild(sec);
        }
      }
    }catch(err){
      const p = document.createElement('p');
      p.textContent = 'Error loading blog: ' + err.message;
      if(ROOT) ROOT.appendChild(p);
    }
  }

  if(ROOT){ load(); }
})();
