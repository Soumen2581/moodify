export async function fetchBootstrap() {
  const res = await fetch('/api/bootstrap');
  if (!res.ok) throw new Error(String(res.status));
  return res.json();
}

export async function fetchRecommendations(mood) {
  const res = await fetch(
    `/api/moods/recommend?mood=${encodeURIComponent(mood)}`,
  );
  const body = await res.json().catch(() => ({}));
  return { ok: res.ok, body };
}
