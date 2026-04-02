import { useSettings } from '../SettingsContext.jsx';
import { t, LANGUAGES } from '../i18n.js';
import './SettingsScreen.css';

export default function SettingsScreen({ onBack }) {
  const { settings, update } = useSettings();
  const lang = settings.language;

  return (
    <div className="settings-screen">
      <header className="ss-header">
        <button className="ss-back" onClick={onBack}>←</button>
        <h2>⚙ {t(lang, 'settings')}</h2>
      </header>

      <div className="ss-group">
        <div className="ss-row">
          <span className="ss-row__label">🔊 {t(lang, 'sound')}</span>
          <button
            className={`ss-toggle ${settings.sound ? 'ss-toggle--on' : ''}`}
            onClick={() => update('sound', !settings.sound)}
          >
            <span className="ss-toggle__knob" />
            <span className="ss-toggle__text">{t(lang, settings.sound ? 'on' : 'off')}</span>
          </button>
        </div>

        <div className="ss-row">
          <span className="ss-row__label">🎵 {t(lang, 'music')}</span>
          <button
            className={`ss-toggle ${settings.music ? 'ss-toggle--on' : ''}`}
            onClick={() => update('music', !settings.music)}
          >
            <span className="ss-toggle__knob" />
            <span className="ss-toggle__text">{t(lang, settings.music ? 'on' : 'off')}</span>
          </button>
        </div>
      </div>

      <div className="ss-group">
        <h3 className="ss-group__title">🌐 {t(lang, 'language')}</h3>
        <div className="ss-langs">
          {LANGUAGES.map((code) => (
            <button
              key={code}
              className={`ss-lang ${code === lang ? 'ss-lang--active' : ''}`}
              onClick={() => update('language', code)}
            >
              <span className="ss-lang__flag">{t(code, 'flag')}</span>
              <span className="ss-lang__name">{t(code, 'lang')}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
