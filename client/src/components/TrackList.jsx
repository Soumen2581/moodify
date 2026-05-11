import TrackRow from './TrackRow.jsx';

export default function TrackList({ results }) {
  if (results.status === 'loading') {
    return <p className="pulse err">Loading “{results.mood}”…</p>;
  }
  if (results.status === 'error') {
    return <p className="err">{results.error}</p>;
  }
  const { tracks, searchUsed } = results;
  if (!tracks.length) {
    return <p className="err">No videos.</p>;
  }
  return (
    <>
      {searchUsed && <p className="hint">Query: {searchUsed}</p>}
      <div>
        {tracks.map((t, i) => (
          <TrackRow key={t.spotifyId || t.listenUrl || i} track={t} />
        ))}
      </div>
    </>
  );
}
