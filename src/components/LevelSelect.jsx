import { useSettings } from '../SettingsContext.jsx';
import { t } from '../i18n.js';
import './LevelSelect.css';

export default function LevelSelect({ levels, category, completedLevels, onSelect, onBack }) {
  const { settings } = useSettings();
  const lang = settings.language;

  return (
    <div className="level-select">
      <header className="ls-header">
        <button className="ls-back" onClick={onBack}>←</button>
        <div className="ls-header__hero">
          <span className="ls-logo-icon">{category.icon}</span>
          <h1 className="ls-header__cat-title">{category.title[lang] || category.title.en}</h1>
        </div>
      </header>

      <section className="ls-grid">
        {levels.map((level, index) => {
          const done = completedLevels.includes(level.id);
          return (
            <button
              key={level.id}
              className={`ls-cell ${done ? 'ls-cell--done' : ''}`}
              style={{ '--accent': level.color }}
              onClick={() => onSelect(level)}
            >
              <div className="ls-cell__glow" />
              <span className="ls-cell__number">{index + 1}</span>
              <span className="ls-cell__title">{level.title[lang] || level.title.en}</span>
              <div className="ls-cell__stars">
                {Array.from({ length: 3 }, (_, i) => (
                  <span key={i} className={i < level.difficulty ? 'star--filled' : 'star--empty'}>★</span>
                ))}
              </div>
              {done && <span className="ls-cell__badge">🏆</span>}
            </button>
          );
        })}
      </section>
    </div>
  );
}
