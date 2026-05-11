function cap(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

export default function MoodGrid({ moods, loading, activeMood, onSelect }) {
  if (loading) {
    return (
      <div className="grid">
        <p className="err full">Loading…</p>
      </div>
    );
  }
  if (!moods.length) {
    return (
      <div className="grid">
        <p className="err full">No moods.</p>
      </div>
    );
  }
  return (
    <div className="grid">
      {moods.map((id) => (
        <button
          key={id}
          type="button"
          className={
            'btn-mood' + (activeMood === id ? ' is-active' : '')
          }
          onClick={() => onSelect(id)}
        >
          {cap(id)}
        </button>
      ))}
    </div>
  );
}
