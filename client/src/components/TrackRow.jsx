function ytUrl(u) {
  return typeof u === 'string' && /^https:\/\/(www\.)?youtube\.com\//.test(u)
    ? u
    : '#';
}

export default function TrackRow({ track }) {
  return (
    <div className="row">
      <img
        src={track.imageUrl || 'https://via.placeholder.com/48'}
        alt=""
        width={48}
        height={48}
        loading="lazy"
      />
      <div className="meta">
        <p className="title">{track.name}</p>
        <p className="sub">{track.artist}</p>
      </div>
      <a
        className="watch"
        href={ytUrl(track.listenUrl)}
        target="_blank"
        rel="noopener noreferrer"
      >
        Watch
      </a>
    </div>
  );
}
