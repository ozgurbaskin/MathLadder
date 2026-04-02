import { useSettings } from '../SettingsContext.jsx';
import { t } from '../i18n.js';
import { categories } from '../data/levels.js';
import './CategorySelect.css';

export default function CategorySelect({ onSelect, onBack }) {
  const { settings } = useSettings();
  const lang = settings.language;

  return (
    <div className="category-select">
      <header className="cs-header">
        <button className="cs-back" onClick={onBack}>←</button>
        <div className="cs-header__hero">
          <span className="cs-logo-icon">🪜</span>
          <h1>MathLadder</h1>
        </div>
      </header>

      <h2 className="cs-subtitle">{t(lang, 'selectCategory')}</h2>

      <section className="cs-grid">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className="cs-card"
            style={{ '--accent': cat.color }}
            onClick={() => onSelect(cat.id)}
          >
            <div className="cs-card__glow" />
            <div className="cs-card__icon">{cat.icon}</div>
            <div className="cs-card__title">{cat.title[lang] || cat.title.en}</div>
          </button>
        ))}
      </section>
    </div>
  );
}
