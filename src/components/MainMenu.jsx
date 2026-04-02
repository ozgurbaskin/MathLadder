import { useSettings } from '../SettingsContext.jsx';
import { t } from '../i18n.js';
import './MainMenu.css';

export default function MainMenu({ onNavigate }) {
  const { settings } = useSettings();
  const lang = settings.language;

  return (
    <div className="main-menu">
      <div className="mm-hero">
        <span className="mm-icon">🪜</span>
        <h1 className="mm-title">MathLadder</h1>
      </div>

      <nav className="mm-nav">
        <button className="mm-btn mm-btn--play" onClick={() => onNavigate('levels')}>
          <span className="mm-btn__icon">▶</span>
          <span className="mm-btn__label">{t(lang, 'play')}</span>
        </button>
        <button className="mm-btn mm-btn--settings" onClick={() => onNavigate('settings')}>
          <span className="mm-btn__icon">⚙</span>
          <span className="mm-btn__label">{t(lang, 'settings')}</span>
        </button>
        <button className="mm-btn mm-btn--leaderboard" onClick={() => onNavigate('leaderboard')}>
          <span className="mm-btn__icon">🏆</span>
          <span className="mm-btn__label">{t(lang, 'leaderboard')}</span>
        </button>
      </nav>
    </div>
  );
}
