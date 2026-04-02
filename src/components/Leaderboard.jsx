import { useState, useEffect } from 'react';
import { useSettings } from '../SettingsContext.jsx';
import { t } from '../i18n.js';
import { levels } from '../data/levels.js';
import './Leaderboard.css';

const LB_KEY = 'mathladder_leaderboard';

export function saveScore(levelIndex, timeSeconds) {
  try {
    const data = JSON.parse(localStorage.getItem(LB_KEY) || '{}');
    const key = String(levelIndex);
    if (!data[key] || timeSeconds < data[key]) {
      data[key] = timeSeconds;
      localStorage.setItem(LB_KEY, JSON.stringify(data));
    }
  } catch {
    // Ignore
  }
}

export default function Leaderboard({ onBack }) {
  const { settings } = useSettings();
  const lang = settings.language;
  const [scores, setScores] = useState({});

  useEffect(() => {
    try {
      setScores(JSON.parse(localStorage.getItem(LB_KEY) || '{}'));
    } catch {
      // Ignore
    }
  }, []);

  function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, '0')}`;
  }

  const hasAny = Object.keys(scores).length > 0;

  return (
    <div className="leaderboard">
      <header className="lb-header">
        <button className="lb-back" onClick={onBack}>←</button>
        <h2>🏆 {t(lang, 'leaderboard')}</h2>
      </header>

      {!hasAny && (
        <div className="lb-empty">{t(lang, 'noScores')}</div>
      )}

      <div className="lb-list">
        {levels.map((level, idx) => {
          const best = scores[String(idx)];
          return (
            <div
              key={level.id}
              className={`lb-card ${best != null ? 'lb-card--has-score' : ''}`}
              style={{ '--accent': level.color }}
            >
              <div className="lb-card__icon">{level.icon}</div>
              <div className="lb-card__info">
                <span className="lb-card__title">{level.title[lang] || level.title.en}</span>
                <div className="lb-card__stars">
                  {Array.from({ length: 3 }, (_, i) => (
                    <span key={i} className={i < level.difficulty ? 'star--filled' : 'star--empty'}>★</span>
                  ))}
                </div>
              </div>
              <div className="lb-card__score">
                {best != null ? (
                  <>
                    <span className="lb-card__time">{formatTime(best)}</span>
                    <span className="lb-card__label">{t(lang, 'best')}</span>
                  </>
                ) : (
                  <span className="lb-card__dash">—</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
