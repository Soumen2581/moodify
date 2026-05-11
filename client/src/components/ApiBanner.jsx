export default function ApiBanner({ status, youtubeConfigured }) {
  if (status === 'loading') {
    return <p className="banner">Loading…</p>;
  }
  if (status === 'error') {
    return (
      <p className="banner">Cannot reach API. Is the server running?</p>
    );
  }
  if (!youtubeConfigured) {
    return (
      <p className="banner warn">
        Add <code>YOUTUBE_API_KEY</code> to <code>.env</code> at the project
        root, then restart.
      </p>
    );
  }
  return null;
}
