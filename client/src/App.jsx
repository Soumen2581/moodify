import { useEffect, useState } from 'react';
import ApiBanner from './components/ApiBanner.jsx';
import MoodGrid from './components/MoodGrid.jsx';
import TrackList from './components/TrackList.jsx';
import { fetchBootstrap, fetchRecommendations } from './api.js';

export default function App() {
  const [bootstrap, setBootstrap] = useState({ status: 'loading' });
  const [results, setResults] = useState(null);
  const [activeMood, setActiveMood] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchBootstrap()
      .then((data) => {
        if (!cancelled) setBootstrap({ status: 'ok', data });
      })
      .catch(() => {
        if (!cancelled) setBootstrap({ status: 'error' });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function selectMood(mood) {
    setActiveMood(mood);
    setResults({ status: 'loading', mood });
    const { ok, body } = await fetchRecommendations(mood);
    if (!ok) {
      setResults({ status: 'error', error: body.error || 'Request failed' });
      return;
    }
    setResults({
      status: 'ok',
      tracks: body.tracks || [],
      searchUsed: body.searchUsed,
    });
  }

  const moods = bootstrap.status === 'ok' ? bootstrap.data.moods || [] : [];
  const youtubeConfigured =
    bootstrap.status === 'ok' && Boolean(bootstrap.data.youtubeConfigured);

  return (
    <div className="wrap">
      <header>
        <h1>
          Mood<span className="accent">ify</span>
        </h1>
        <p className="tagline">YouTube picks by mood</p>
      </header>

      <ApiBanner
        status={bootstrap.status}
        youtubeConfigured={youtubeConfigured}
      />

      <section>
        <h2>Mood</h2>
        <MoodGrid
          moods={moods}
          loading={bootstrap.status === 'loading'}
          activeMood={activeMood}
          onSelect={selectMood}
        />
      </section>

      {results && (
        <section className="results">
          <h2>Suggestions</h2>
          <TrackList results={results} />
        </section>
      )}
    </div>
  );
}
