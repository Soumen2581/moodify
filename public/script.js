document.addEventListener('DOMContentLoaded', () => {
  loadApp();
});

async function loadApp() {
  const banner = document.getElementById('api-banner');
  const grid = document.getElementById('mood-grid');
  if (!banner || !grid) return;

  grid.innerHTML = '<p class="err" style="grid-column:1/-1;text-align:center">Loading…</p>';

  try {
    const res = await fetch('/api/bootstrap');
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();

    if (data.youtubeConfigured) {
      banner.textContent = '';
      banner.className = 'banner';
      banner.hidden = true;
    } else {
      banner.hidden = false;
      banner.className = 'banner warn';
      banner.innerHTML =
        'Add <code>YOUTUBE_API_KEY</code> to <code>.env</code> at the project root, then restart.';
    }

    const moods = data.moods || [];
    const frag = document.createDocumentFragment();
    for (const id of moods) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-mood';
      btn.dataset.mood = id;
      btn.textContent = id.charAt(0).toUpperCase() + id.slice(1);
      btn.addEventListener('click', () => fetchTracks(id));
      frag.appendChild(btn);
    }
    grid.replaceChildren(frag);
  } catch {
    banner.hidden = false;
    banner.className = 'banner';
    banner.textContent = 'Cannot reach API. Is the server running?';
    grid.innerHTML = '<p class="err" style="grid-column:1/-1;text-align:center">Failed to load.</p>';
  }
}

function esc(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

function ytUrl(u) {
  return typeof u === 'string' && /^https:\/\/(www\.)?youtube\.com\//.test(u) ? u : '#';
}

async function fetchTracks(mood) {
  const results = document.getElementById('results-section');
  const list = document.getElementById('track-list');
  const hint = document.getElementById('search-hint');

  results.classList.remove('hidden');
  if (hint) {
    hint.classList.add('hidden');
    hint.textContent = '';
  }
  list.innerHTML = `<p class="pulse err">Loading “${esc(mood)}”…</p>`;

  try {
    const res = await fetch(`/api/moods/recommend?mood=${encodeURIComponent(mood)}`);
    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      list.innerHTML = `<p class="err">${esc(body.error || 'Request failed')}</p>`;
      return;
    }

    const tracks = body.tracks || [];
    if (!tracks.length) {
      list.innerHTML = '<p class="err">No videos.</p>';
      return;
    }

    if (hint && body.searchUsed) {
      hint.textContent = `Query: ${body.searchUsed}`;
      hint.classList.remove('hidden');
    }

    const frag = document.createDocumentFragment();
    for (const t of tracks) {
      frag.appendChild(row(t));
    }
    list.replaceChildren(frag);
  } catch {
    list.innerHTML = '<p class="err">Network error.</p>';
  }
}

function row(t) {
  const el = document.createElement('div');
  el.className = 'row';

  const img = document.createElement('img');
  img.src = t.imageUrl || 'https://via.placeholder.com/48';
  img.alt = '';
  img.width = 48;
  img.height = 48;
  img.loading = 'lazy';

  const meta = document.createElement('div');
  meta.className = 'meta';
  meta.innerHTML = `<p class="title">${esc(t.name)}</p><p class="sub">${esc(t.artist)}</p>`;

  const a = document.createElement('a');
  a.className = 'watch';
  a.textContent = 'Watch';
  a.href = ytUrl(t.listenUrl);
  a.target = '_blank';
  a.rel = 'noopener noreferrer';

  el.append(img, meta, a);
  return el;
}
