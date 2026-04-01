import './LevelSelect.css';

export default function LevelSelect({ levels, completedLevels, onSelect }) {
  return (
    <div className="level-select">
      <header className="ls-header">
        <div className="ls-logo">
          <span className="ls-logo-icon">🪜</span>
          <h1>MathLadder</h1>
        </div>
        <p className="ls-tagline">
          Her adımda sadece <strong>bir rakam</strong> değişiyor.
          <br />Merdiveni tırmanabilir misin?
        </p>
      </header>

      <section className="ls-levels">
        {levels.map((level, index) => {
          const done = completedLevels.includes(index);
          return (
            <button
              key={level.id}
              className={`level-card ${done ? 'level-card--done' : ''}`}
              style={{ '--accent': level.color }}
              onClick={() => onSelect(index)}
            >
              <div className="level-card__badge">
                {done ? '✓' : index + 1}
              </div>
              <div className="level-card__body">
                <h2 className="level-card__title">{level.title}</h2>
                <p className="level-card__subtitle">{level.subtitle}</p>
                <p className="level-card__desc">{level.description}</p>
              </div>
              <div className="level-card__arrow">›</div>
            </button>
          );
        })}
      </section>

      <footer className="ls-footer">
        <p>💡 Her bölümde sorulara doğru cevap ver — ardışık cevaplar yalnızca 1 rakam farkına sahip olmalı!</p>
      </footer>
    </div>
  );
}
