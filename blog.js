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

  // Very small sanitizer to allow only a subset of inline tags and safe attributes
  function sanitizeHtml(input){
    // Create a sandbox document fragment
    const template = document.createElement('template');
    template.innerHTML = String(input);
    const allowedTags = new Set(['A','EM','STRONG','B','I','U','S','CODE','KBD','MARK','SMALL','SUB','SUP','SPAN','BR']);
    const allowedAttrs = {
      'A': new Set(['href','title','target','rel']),
      'SPAN': new Set(['class'])
    };
    const showElements = (typeof NodeFilter !== 'undefined' && NodeFilter.SHOW_ELEMENT) ? NodeFilter.SHOW_ELEMENT : 1;
    const walker = document.createTreeWalker(template.content, showElements, null);
    let node = walker.currentNode;
    while(node){
      const el = node;
      if(!allowedTags.has(el.tagName)){
        // Replace disallowed element with its textContent
        const text = document.createTextNode(el.textContent);
        // Use replaceWith when available; otherwise, fall back for older browsers
        if (typeof el.replaceWith === 'function') {
          el.replaceWith(text);
        } else if (el.parentNode) {
          el.parentNode.insertBefore(text, el);
          el.parentNode.removeChild(el);
        }
      } else {
        // Clean attributes
        [...el.attributes].forEach(attr=>{
          const tagAllow = allowedAttrs[el.tagName];
          if(!tagAllow || !tagAllow.has(attr.name)){
            el.removeAttribute(attr.name);
          }
        });
        // Extra safety for links
        if(el.tagName === 'A'){
          const href = el.getAttribute('href') || '';
          // Disallow javascript: and data: (except data:image maybe, but not needed here)
          const lower = href.trim().toLowerCase();
          if(lower.startsWith('javascript:') || lower.startsWith('data:')){
            el.removeAttribute('href');
          } else {
            // Ensure links open in new tab safely
            el.setAttribute('target','_blank');
            el.setAttribute('rel','noopener noreferrer');
          }
        }
      }
      node = walker.nextNode();
    }
    return template.innerHTML;
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

    // tags
    if (Array.isArray(p.tags) && p.tags.length) {
      const tagsBar = document.createElement('div');
      tagsBar.className = 'tags';
      p.tags.forEach(t => {
        const a = document.createElement('a');
        a.href = `#tag=${encodeURIComponent(String(t))}`;
        a.className = 'tag';
        a.textContent = String(t);
        tagsBar.appendChild(a);
      });
      wrap.appendChild(tagsBar);
    }

    function addParagraph(text){
      const textP = document.createElement('p');
      let raw = String(text || '');
      // Linkify http(s) and site/relative file paths under /files or files
      const urlRegex = /(https?:\/\/[^\s)]+)(?![^<]*>|[^&]*;)/g;
      const filePathRegex = /(?:\b|\()((?:\/files|files)\/[\w\-\.\/%#?=&]+)/gi;
      raw = raw.replace(urlRegex, (m)=>`<a href="${m}">${m}</a>`)
               .replace(filePathRegex, (m, p1)=>{
                 // Ensure site-root path
                 const href = p1.startsWith('/') ? p1 : ('/' + p1);
                 return `<a href="${href}" target="_blank" rel="noopener noreferrer">${p1}</a>`;
               })
               .replace(/file:\/\//gi, ''); // strip file:// if pasted
      textP.innerHTML = sanitizeHtml(raw);
      wrap.appendChild(textP);
    }

    if (Array.isArray(p.paragraphs) && p.paragraphs.length) {
      p.paragraphs.forEach(addParagraph);
    } else {
      // Fallback to single text field for backward compatibility
      addParagraph(p.text || '');
    }

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

  function getActiveTag(){
    const h = window.location.hash || '';
    const m = h.match(/#tag=([^&]+)/);
    return m ? decodeURIComponent(m[1]) : null;
  }

  function renderTagFilter(allPosts){
    // Aggregate unique tags
    const tagCounts = new Map();
    for(const p of allPosts){
      if(Array.isArray(p.tags)){
        for(const t of p.tags){
          const key = String(t);
          tagCounts.set(key, (tagCounts.get(key)||0)+1);
        }
      }
    }
    if(tagCounts.size === 0) return null;

    const container = document.createElement('div');
    container.className = 'tag-filter';

    const title = document.createElement('h4');
    title.textContent = 'Tags';
    container.appendChild(title);

    const list = document.createElement('div');
    list.className = 'tag-list';

    // 'All' option
    const allLink = document.createElement('a');
    allLink.href = '#';
    allLink.className = 'tag all';
    allLink.textContent = `All (${allPosts.length})`;
    list.appendChild(allLink);

    const tags = Array.from(tagCounts.keys()).sort((a,b)=> a.localeCompare(b));
    for(const t of tags){
      const a = document.createElement('a');
      a.href = `#tag=${encodeURIComponent(t)}`;
      a.className = 'tag';
      a.textContent = `${t} (${tagCounts.get(t)})`;
      list.appendChild(a);
    }

    container.appendChild(list);

    const active = document.createElement('p');
    active.className = 'active-tag';
    const activeTag = getActiveTag();
    active.textContent = activeTag ? `Filtering by tag: ${activeTag}` : 'Showing all posts';
    container.appendChild(active);

    return container;
  }

  function filterPostsByTag(posts, tag){
    if(!tag) return posts;
    return posts.filter(p => Array.isArray(p.tags) && p.tags.map(String).includes(String(tag)));
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

      const rerender = ()=>{
        const activeTag = getActiveTag();
        ROOT.innerHTML = '';
        // Tag filter UI at top
        const filterEl = renderTagFilter(posts);
        if(filterEl) ROOT.appendChild(filterEl);

        const filtered = filterPostsByTag(posts, activeTag);
        const grouped = groupByDate(filtered);

        if(PAGE === 'blog'){
          // Keep up to 7 most recent date groups (after filtering)
          const latestGroups = grouped.slice(0, 7);
          if(latestGroups.length === 0){
            const empty = document.createElement('p');
            empty.textContent = activeTag ? `No posts found for tag "${activeTag}".` : 'No posts yet.';
            ROOT.appendChild(empty);
            return;
          }
          for(const g of latestGroups){
            // If multiple posts in a day, render sequentially but with a single date heading for first
            let first = true;
            for(const post of g.items){
              const elem = renderPost({ ...post, date: g.dateStr });
              if(!first){
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
        const archived = filtered.filter(p => daysBetween(parseDate(p.date), cutoff) >= 0);
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
      };

      // Initial render and listeners
      rerender();
      window.addEventListener('hashchange', rerender);
    }catch(err){
      const p = document.createElement('p');
      p.textContent = 'Error loading blog: ' + err.message;
      if(ROOT) ROOT.appendChild(p);
    }
  }

  if(ROOT){ load(); }
})();
