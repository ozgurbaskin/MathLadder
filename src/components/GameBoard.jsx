import { useState, useEffect, useRef } from 'react';
import './GameBoard.css';

/** Returns the index of the single differing digit, or -1 if not exactly one differs */
function diffDigitIndex(a, b, digits) {
  const sa = String(a).padStart(digits, '0');
  const sb = String(b).padStart(digits, '0');
  let diffIdx = -1;
  let count = 0;
  for (let i = 0; i < digits; i++) {
    if (sa[i] !== sb[i]) { count++; diffIdx = i; }
  }
  return count === 1 ? diffIdx : -1;
}

export default function GameBoard({ level, onComplete, onBack }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [answers, setAnswers] = useState([]);
  const [status, setStatus] = useState('idle'); // 'idle' | 'correct' | 'wrong'
  const [showHint, setShowHint] = useState(false);
  const [finished, setFinished] = useState(false);
  const inputRef = useRef(null);

  const currentStep = level.steps[stepIndex];
  const totalSteps = level.steps.length;
  const { digits } = level;

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [stepIndex]);

  useEffect(() => {
    if (status !== 'idle') {
      const t = setTimeout(() => setStatus('idle'), status === 'correct' ? 600 : 1100);
      return () => clearTimeout(t);
    }
  }, [status]);

  function handleSubmit(e) {
    e.preventDefault();
    const parsed = parseInt(inputValue, 10);

    if (isNaN(parsed)) {
      setStatus('wrong');
      return;
    }

    if (parsed !== currentStep.answer) {
      setStatus('wrong');
      return;
    }

    const newAnswers = [...answers, currentStep.answer];
    setAnswers(newAnswers);
    setStatus('correct');
    setShowHint(false);
    setInputValue('');

    if (stepIndex + 1 >= totalSteps) {
      setTimeout(() => setFinished(true), 600);
    } else {
      setTimeout(() => setStepIndex((i) => i + 1), 600);
    }
  }

  function handleInput(e) {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length <= digits) setInputValue(val);
  }

  function handleReset() {
    setStepIndex(0);
    setInputValue('');
    setAnswers([]);
    setStatus('idle');
    setShowHint(false);
    setFinished(false);
  }

  // Win screen
  if (finished) {
    return (
      <div className="gb-container">
        <div className="gb-win">
          <div className="gb-win__fireworks">🏆</div>
          <h2>Tebrikler!</h2>
          <p>
            <strong>{level.title}</strong> bölümünü başarıyla tamamladın!
          </p>
          <div className="gb-win__ladder">
            <div className="gb-win__ladder-label">Sayı Merdivenin</div>
            {answers.map((ans, i) => (
              <div key={i} className="gb-win__rung">
                <DigitDisplay
                  value={ans}
                  digits={digits}
                  changedIdx={i > 0 ? diffDigitIndex(answers[i - 1], ans, digits) : null}
                  accent={level.color}
                />
              </div>
            ))}
          </div>
          <div className="gb-win__actions">
            <button className="btn btn--primary" onClick={onComplete}>
              🏠 Ana Menü
            </button>
            <button className="btn btn--ghost" onClick={handleReset}>
              🔄 Tekrar Oyna
            </button>
          </div>
        </div>
      </div>
    );
  }

  const prevAnswer = answers.length > 0 ? answers[answers.length - 1] : null;

  return (
    <div className="gb-container">
      {/* Header */}
      <header className="gb-header">
        <div className="gb-header__top">
          <button className="btn btn--ghost gb-back" onClick={onBack}>
            ← Geri
          </button>
          <div className="gb-header__title">
            <span className="gb-header__level">{level.title}</span>
          </div>
          <button className="btn btn--ghost gb-reset" onClick={handleReset} title="Yeniden başla">
            ↺
          </button>
        </div>
        <div className="gb-header__steps">
          {level.steps.map((_, i) => (
            <span
              key={i}
              className={`gb-dot ${
                i < stepIndex ? 'gb-dot--done' : i === stepIndex ? 'gb-dot--active' : ''
              }`}
            />
          ))}
          <span className="gb-progress-text">
            {stepIndex + 1}/{totalSteps}
          </span>
        </div>
      </header>

      {/* Completed ladder rungs */}
      {answers.length > 0 && (
        <div className="gb-ladder">
          <div className="gb-ladder__rail" />
          {answers.map((ans, i) => (
            <div key={i} className="gb-ladder__rung">
              <span className="gb-ladder__step">{i + 1}</span>
              <DigitDisplay
                value={ans}
                digits={digits}
                changedIdx={i > 0 ? diffDigitIndex(answers[i - 1], ans, digits) : null}
                accent={level.color}
                dim
              />
            </div>
          ))}
        </div>
      )}

      {/* Question card */}
      <div
        className={`gb-card ${
          status === 'correct'
            ? 'gb-card--correct'
            : status === 'wrong'
            ? 'gb-card--wrong'
            : ''
        }`}
      >
        <div className="gb-card__step">Soru {stepIndex + 1}</div>
        <p className="gb-card__question">{currentStep.question}</p>

        {showHint && (
          <div className="gb-card__hint">💡 {currentStep.hint}</div>
        )}

        <form className="gb-card__form" onSubmit={handleSubmit}>
          {/* Digit preview boxes */}
          <DigitInput
            value={inputValue}
            digits={digits}
            prevAnswer={prevAnswer}
            accent={level.color}
            inputRef={inputRef}
            onInput={handleInput}
          />

          <div className="gb-card__actions">
            <button type="submit" className="btn btn--primary">
              Onayla ↵
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => setShowHint((v) => !v)}
            >
              {showHint ? 'İpucunu Gizle' : '💡 İpucu'}
            </button>
          </div>
        </form>

        {status === 'wrong' && (
          <div className="gb-card__error">❌ Yanlış cevap, tekrar dene!</div>
        )}
      </div>

      {/* Rule reminder */}
      {prevAnswer !== null && (
        <p className="gb-rule">
          ↑ Önceki yanıttan yalnızca <strong>1 rakam</strong> farklı olmalı
        </p>
      )}
    </div>
  );
}

/** Digit input with visual boxes showing each digit as it's typed */
function DigitInput({ value, digits, prevAnswer, accent, inputRef, onInput }) {
  const prevStr = prevAnswer !== null ? String(prevAnswer).padStart(digits, '0') : null;
  // Build an array of length `digits` — filled with typed chars or null
  const cells = Array.from({ length: digits }, (_, i) =>
    i < value.length ? value[i] : null
  );

  return (
    <div className="digit-input-wrapper">
      <div className="digit-input-boxes" onClick={() => inputRef.current?.focus()}>
        {cells.map((d, i) => {
          const filled = d !== null;
          const changed = prevStr && filled && prevStr[i] !== d;
          const same = prevStr && filled && prevStr[i] === d;
          return (
            <span
              key={i}
              className={`digit-input-box ${filled ? 'digit-input-box--filled' : ''} ${
                changed ? 'digit-input-box--changed' : ''
              } ${same ? 'digit-input-box--same' : ''}`}
              style={changed ? { '--cell-accent': accent } : {}}
            >
              {filled ? d : <span className="digit-input-box__cursor" />}
            </span>
          );
        })}
      </div>
      <input
        ref={inputRef}
        className="gb-input-hidden"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={digits}
        value={value}
        onChange={onInput}
        autoComplete="off"
        aria-label="Cevabı girin"
      />
    </div>
  );
}

/** Displays a number with each digit in a box; highlights changedIdx */
function DigitDisplay({ value, digits, changedIdx, accent, dim }) {
  const str = String(value).padStart(digits, '0');
  return (
    <div className={`digit-display ${dim ? 'digit-display--dim' : ''}`}>
      {str.split('').map((d, i) => (
        <span
          key={i}
          className="digit-display__cell"
          style={i === changedIdx ? { '--cell-accent': accent } : {}}
          data-highlight={i === changedIdx}
        >
          {d}
        </span>
      ))}
    </div>
  );
}
