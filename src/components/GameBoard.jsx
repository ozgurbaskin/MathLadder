import { useState, useEffect, useMemo, useRef } from 'react';
import { useSettings } from '../SettingsContext.jsx';
import { t } from '../i18n.js';
import { playTap, playCorrect, playWrong, playWin, playDrag, playUnlock } from '../sounds.js';
import './GameBoard.css';

/*
  NEW GAME FLOW:
  - 7 rungs on the ladder displayed vertically
  - Rungs 1–5 = main questions (user clicks any to select & answer)
  - Rung 0 = bonus top, Rung 6 = bonus bottom (locked until main 5 solved + ordered)
  - User types answer via numpad; no submit button — auto-checks when all digits filled
  - Selected digit position is highlighted (no blinking cursor)
  - Rungs 1–5 can be drag-reordered via the "=" handles on the left
  - Validation: consecutive answered rungs must differ by exactly 1 digit, all 7 unique
  - Once main 5 are correct + form valid chain → bonus rungs unlock
  - Bonus placement: bonusTop goes to rung 0 (above first), bonusBottom goes to rung 6 (below last)
*/

/** Count how many digit positions differ between two numbers */
function countDiffDigits(a, b, digits) {
  const sa = String(a).padStart(digits, '0');
  const sb = String(b).padStart(digits, '0');
  let count = 0;
  for (let i = 0; i < digits; i++) {
    if (sa[i] !== sb[i]) count++;
  }
  return count;
}

/** Check if the answered rungs form a valid chain (each consecutive pair differs by exactly 1 digit) */
function isValidChain(answers, digits) {
  const filled = answers.filter((a) => a !== null);
  if (filled.length < 2) return true;
  for (let i = 0; i < filled.length - 1; i++) {
    if (countDiffDigits(filled[i], filled[i + 1], digits) !== 1) return false;
  }
  return true;
}

/** Check all values are unique */
function allUnique(answers) {
  const filled = answers.filter((a) => a !== null);
  return new Set(filled).size === filled.length;
}

/** Shuffle an array (Fisher-Yates) */
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function GameBoard({ level, onComplete, onBack }) {
  const { settings } = useSettings();
  const lang = settings.language;
  const sfx = settings.sound;
  const { digits } = level;

  // rungOrder: indices into level.steps for rungs 1–5 (shuffled, reorderable)
  const [rungOrder, setRungOrder] = useState(() => shuffleArray([0, 1, 2, 3, 4]));
  // answers[0..4] for the 5 main rungs (in display order), null if not answered
  const [mainAnswers, setMainAnswers] = useState(Array(5).fill(null));
  // bonus answers: [0] = rung 0 (top), [1] = rung 6 (bottom)
  const [bonusTopAnswer, setBonusTopAnswer] = useState(null);
  const [bonusBottomAnswer, setBonusBottomAnswer] = useState(null);

  // Dynamic bonus assignment: which level bonus goes where
  // Test which pairing actually chains (1-digit diff) with the endpoints
  const bonusAssignment = useMemo(() => {
    if (!mainAnswers.every((a) => a !== null)) return { top: level.bonusTop, bottom: level.bonusBottom };
    const first = mainAnswers[0];
    const last = mainAnswers[4];
    const bT = level.bonusTop;
    const bB = level.bonusBottom;
    // Try default: bonusTop→first, bonusBottom→last
    if (countDiffDigits(bT.answer, first, digits) === 1 && countDiffDigits(bB.answer, last, digits) === 1) {
      return { top: bT, bottom: bB };
    }
    // Try swapped: bonusBottom→first, bonusTop→last
    if (countDiffDigits(bB.answer, first, digits) === 1 && countDiffDigits(bT.answer, last, digits) === 1) {
      return { top: bB, bottom: bT };
    }
    // Fallback
    return { top: bT, bottom: bB };
  }, [mainAnswers, level.bonusTop, level.bonusBottom, digits]);

  // Which rung is selected: -1 = none, 0–4 = main, 5 = bonusTop, 6 = bonusBottom
  // Auto-select first empty main rung on init
  const [selectedRung, setSelectedRung] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'correct' | 'wrong'
  const [timer, setTimer] = useState(0);
  const [finished, setFinished] = useState(false);

  // Hint & Reveal toggles per rung
  const [showHint, setShowHint] = useState(false);
  const [revealedRungs, setRevealedRungs] = useState(new Set()); // rung keys that have been revealed
  const [revealCooldown, setRevealCooldown] = useState(0); // seconds remaining

  // Cooldown timer
  useEffect(() => {
    if (revealCooldown <= 0) return;
    const id = setInterval(() => setRevealCooldown((v) => Math.max(0, v - 1)), 1000);
    return () => clearInterval(id);
  }, [revealCooldown > 0]);

  // Drag state
  const [dragIdx, setDragIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);

  // phase: 'main' | 'bonus' | 'finished'
  const mainAllFilled = mainAnswers.every((a) => a !== null);

  // Build the full 7-answer array for chain validation
  const fullAnswers = useMemo(() => {
    return [bonusTopAnswer, ...mainAnswers, bonusBottomAnswer];
  }, [bonusTopAnswer, mainAnswers, bonusBottomAnswer]);

  // Check if main 5 form a valid chain among themselves
  const mainChainValid = useMemo(() => {
    if (!mainAllFilled) return false;
    for (let i = 0; i < mainAnswers.length - 1; i++) {
      if (countDiffDigits(mainAnswers[i], mainAnswers[i + 1], digits) !== 1) return false;
    }
    return true;
  }, [mainAnswers, mainAllFilled, digits]);

  const mainAllUnique = useMemo(() => allUnique(mainAnswers), [mainAnswers]);

  const bonusUnlocked = mainAllFilled && mainChainValid && mainAllUnique;

  // Play unlock sound when bonus first unlocks
  const prevBonusUnlocked = useRef(false);
  useEffect(() => {
    if (bonusUnlocked && !prevBonusUnlocked.current && sfx) playUnlock();
    prevBonusUnlocked.current = bonusUnlocked;
  }, [bonusUnlocked, sfx]);

  const allDone = bonusUnlocked && bonusTopAnswer !== null && bonusBottomAnswer !== null;

  // Check full chain for completion
  const fullChainValid = useMemo(() => {
    if (!allDone) return false;
    return isValidChain(fullAnswers, digits) && allUnique(fullAnswers);
  }, [allDone, fullAnswers, digits]);

  // Timer
  useEffect(() => {
    if (finished) return;
    const id = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [finished]);

  const timerStr = useMemo(() => {
    const m = Math.floor(timer / 60);
    const s = timer % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }, [timer]);

  // Clear status after delay
  useEffect(() => {
    if (status !== 'idle') {
      const t = setTimeout(() => setStatus('idle'), status === 'correct' ? 500 : 900);
      return () => clearTimeout(t);
    }
  }, [status]);

  // Check for game completion
  useEffect(() => {
    if (fullChainValid && !finished) {
      if (sfx) playWin();
      setFinished(true);
      setSelectedRung(-1);
    }
  }, [fullChainValid, finished, sfx]);

  // Get the question for the selected rung
  function getSelectedQuestion() {
    if (selectedRung >= 0 && selectedRung <= 4) {
      return level.steps[rungOrder[selectedRung]];
    }
    if (selectedRung === 5) return bonusAssignment.top;
    if (selectedRung === 6) return bonusAssignment.bottom;
    return null;
  }

  const currentQuestion = getSelectedQuestion();

  // Handle rung click
  function handleRungClick(rungDisplayIndex) {
    // rungDisplayIndex: 0 = bonusTop, 1–5 = main (0-based: subtract 1), 6 = bonusBottom
    if (finished) return;

    if (rungDisplayIndex === 0) {
      // bonus top
      if (!bonusUnlocked) return;
      if (bonusTopAnswer !== null) return; // already answered
      setSelectedRung(5);
      setInputValue('');
      setShowHint(false);
    } else if (rungDisplayIndex === 6) {
      // bonus bottom
      if (!bonusUnlocked) return;
      if (bonusBottomAnswer !== null) return;
      setSelectedRung(6);
      setInputValue('');
      setShowHint(false);
    } else {
      const mainIdx = rungDisplayIndex - 1; // 0–4
      if (mainAnswers[mainIdx] !== null) return; // already answered
      setSelectedRung(mainIdx);
      setInputValue('');
      setShowHint(false);
    }
  }

  // Numpad press
  function handleNumpadPress(digit) {
    if (finished || selectedRung === -1 || !currentQuestion) return;
    if (inputValue.length >= digits) return;
    if (sfx) playTap();

    const newValue = inputValue + digit;
    setInputValue(newValue);

    // Auto-check when all digits filled
    if (newValue.length === digits) {
      const parsed = parseInt(newValue, 10);
      if (parsed === currentQuestion.answer) {
        // Correct!
        if (sfx) playCorrect();
        setStatus('correct');

        if (selectedRung >= 0 && selectedRung <= 4) {
          const newAnswers = [...mainAnswers];
          newAnswers[selectedRung] = parsed;
          setMainAnswers(newAnswers);
        } else if (selectedRung === 5) {
          setBonusTopAnswer(parsed);
        } else if (selectedRung === 6) {
          setBonusBottomAnswer(parsed);
        }

        // Auto-advance to next unanswered rung
        setTimeout(() => {
          if (selectedRung >= 0 && selectedRung <= 4) {
            const newAnswers = [...mainAnswers];
            newAnswers[selectedRung] = parsed;
            // Find next unanswered main rung
            const nextMain = newAnswers.findIndex((a) => a === null);
            if (nextMain !== -1) {
              setSelectedRung(nextMain);
              setInputValue('');
            } else {
              setSelectedRung(-1);
              setInputValue('');
            }
          } else {
            // Bonus answered, check if other bonus needs answering
            if (selectedRung === 5 && bonusBottomAnswer === null) {
              setSelectedRung(6);
              setInputValue('');
            } else if (selectedRung === 6 && bonusTopAnswer === null) {
              setSelectedRung(5);
              setInputValue('');
            } else {
              setSelectedRung(-1);
              setInputValue('');
            }
          }
        }, 500);
      } else {
        // Wrong
        if (sfx) playWrong();
        setStatus('wrong');
        setTimeout(() => {
          setInputValue('');
        }, 600);
      }
    }
  }

  function handleBackspace() {
    setInputValue((v) => v.slice(0, -1));
  }

  // Drag-reorder handlers for main rungs
  function handleDragStart(mainIdx) {
    setDragIdx(mainIdx);
  }

  function handleDragOver(e, mainIdx) {
    e.preventDefault();
    if (dragIdx !== null && dragIdx !== mainIdx) {
      setDragOverIdx(mainIdx);
    }
  }

  function handleDrop(mainIdx) {
    if (dragIdx === null || dragIdx === mainIdx) {
      setDragIdx(null);
      setDragOverIdx(null);
      return;
    }
    // Swap
    const newOrder = [...rungOrder];
    const newAnswers = [...mainAnswers];
    const tmpO = newOrder[dragIdx];
    newOrder[dragIdx] = newOrder[mainIdx];
    newOrder[mainIdx] = tmpO;
    const tmpA = newAnswers[dragIdx];
    newAnswers[dragIdx] = newAnswers[mainIdx];
    newAnswers[mainIdx] = tmpA;
    setRungOrder(newOrder);
    setMainAnswers(newAnswers);
    if (sfx) playDrag();
    // Adjust selectedRung if needed
    if (selectedRung === dragIdx) setSelectedRung(mainIdx);
    else if (selectedRung === mainIdx) setSelectedRung(dragIdx);
    setDragIdx(null);
    setDragOverIdx(null);
  }

  function handleDragEnd() {
    setDragIdx(null);
    setDragOverIdx(null);
  }

  // Touch-based reorder
  const touchStartRef = useRef(null);
  const touchRungRef = useRef(null);

  function handleTouchStart(e, mainIdx) {
    touchStartRef.current = e.touches[0].clientY;
    touchRungRef.current = mainIdx;
  }

  function handleTouchEnd(e, mainIdx) {
    if (touchStartRef.current === null || touchRungRef.current === null) return;
    const deltaY = e.changedTouches[0].clientY - touchStartRef.current;
    const threshold = 30;
    const fromIdx = touchRungRef.current;

    if (Math.abs(deltaY) > threshold) {
      const direction = deltaY > 0 ? 1 : -1;
      const toIdx = fromIdx + direction;
      if (toIdx >= 0 && toIdx < 5 && fromIdx !== toIdx) {
        const newOrder = [...rungOrder];
        const newAnswers = [...mainAnswers];
        const tmpO = newOrder[fromIdx];
        newOrder[fromIdx] = newOrder[toIdx];
        newOrder[toIdx] = tmpO;
        const tmpA = newAnswers[fromIdx];
        newAnswers[fromIdx] = newAnswers[toIdx];
        newAnswers[toIdx] = tmpA;
        setRungOrder(newOrder);
        setMainAnswers(newAnswers);
        if (selectedRung === fromIdx) setSelectedRung(toIdx);
        else if (selectedRung === toIdx) setSelectedRung(fromIdx);
      }
    }
    touchStartRef.current = null;
    touchRungRef.current = null;
  }

  function handleReset() {
    setRungOrder(shuffleArray([0, 1, 2, 3, 4]));
    setMainAnswers(Array(5).fill(null));
    setBonusTopAnswer(null);
    setBonusBottomAnswer(null);
    setSelectedRung(-1);
    setInputValue('');
    setStatus('idle');
    setTimer(0);
    setFinished(false);
    setShowHint(false);
    setRevealedRungs(new Set());
    setRevealCooldown(0);
  }

  // Reveal ALL digits of the current answer (15s cooldown)
  function handleRevealDigit() {
    if (!currentQuestion || revealCooldown > 0 || finished) return;
    const rungKey = String(selectedRung);
    setRevealedRungs((prev) => new Set(prev).add(rungKey));
    setRevealCooldown(15);
  }

  // Error indicators for chain validation
  const chainErrors = useMemo(() => {
    const errors = Array(5).fill(false);
    for (let i = 0; i < 4; i++) {
      if (mainAnswers[i] !== null && mainAnswers[i + 1] !== null) {
        if (countDiffDigits(mainAnswers[i], mainAnswers[i + 1], digits) !== 1) {
          errors[i] = true;
          errors[i + 1] = true;
        }
      }
    }
    return errors;
  }, [mainAnswers, digits]);

  // Win screen
  if (finished) {
    return (
      <div className="gb-container">
        <div className="gb-win">
          <div className="gb-win__fireworks">🏆</div>
          <h2>{t(lang, 'congrats')}</h2>
          <p>
            {t(lang, 'completedIn', level.title[lang] || level.title.en, timerStr)}
          </p>
          <div className="gb-win__ladder-final">
            {fullAnswers.map((ans, i) => (
              <div key={i} className="gb-win__rung-row">
                <DigitDisplay value={ans} digits={digits} accent={level.color} />
              </div>
            ))}
          </div>
          <div className="gb-win__actions">
            <button className="btn btn--primary" onClick={onComplete}>
              🏠 {t(lang, 'mainMenu')}
            </button>
            <button className="btn btn--ghost" onClick={handleReset}>
              🔄 {t(lang, 'playAgain')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Build display rungs: [bonusTop, main0, main1, main2, main3, main4, bonusBottom]
  const displayRungs = [];

  // Rung 0: bonus top
  displayRungs.push({
    type: 'bonus',
    answer: bonusTopAnswer,
    locked: !bonusUnlocked,
    isSelected: selectedRung === 5,
    displayIdx: 0,
  });

  // Rungs 1–5: main
  for (let i = 0; i < 5; i++) {
    displayRungs.push({
      type: 'main',
      mainIdx: i,
      stepIdx: rungOrder[i],
      answer: mainAnswers[i],
      isSelected: selectedRung === i,
      chainError: chainErrors[i],
      displayIdx: i + 1,
    });
  }

  // Rung 6: bonus bottom
  displayRungs.push({
    type: 'bonus',
    answer: bonusBottomAnswer,
    locked: !bonusUnlocked,
    isSelected: selectedRung === 6,
    displayIdx: 6,
  });

  return (
    <div className="gb-container">
      {/* Header */}
      <header className="gb-header">
        <div className="gb-header__top">
          <button className="gb-header-btn" onClick={onBack}>←</button>
          <div className="gb-header__center">
            <span className="gb-timer">⏱ {timerStr}</span>
          </div>
          <div className="gb-header__right">
            <button className="gb-header-btn gb-header-btn--icon" onClick={handleReset} title={t(lang, 'reset')}>
              ⟳
            </button>
          </div>
        </div>
      </header>

      {/* Ladder Section */}
      <div className="gb-ladder">
        {displayRungs.map((rung, i) => {
          const isBonus = rung.type === 'bonus';
          const isSolved = rung.answer !== null;
          const isSelected = rung.isSelected;
          const isLocked = isBonus && rung.locked;
          const hasChainError = !isBonus && rung.chainError && isSolved;

          // Is this the active input rung?
          const isInputActive = isSelected && !isSolved;

          return (
            <div
              key={i}
              className={`gb-rung ${isSelected ? 'gb-rung--selected' : ''} ${
                isSolved ? 'gb-rung--solved' : ''
              } ${isLocked ? 'gb-rung--locked' : ''} ${
                hasChainError ? 'gb-rung--chain-error' : ''
              } ${dragOverIdx !== null && !isBonus && rung.mainIdx === dragOverIdx ? 'gb-rung--drag-over' : ''}`}
              onClick={() => handleRungClick(rung.displayIdx)}
            >
              {/* Connector */}
              {i > 0 && <div className="gb-rung__connector" />}

              <div className="gb-rung__row">
                {/* Drag handle (= sign) for main rungs */}
                {!isBonus ? (
                  <div
                    className="gb-rung__handle"
                    draggable
                    onDragStart={() => handleDragStart(rung.mainIdx)}
                    onDragOver={(e) => handleDragOver(e, rung.mainIdx)}
                    onDrop={() => handleDrop(rung.mainIdx)}
                    onDragEnd={handleDragEnd}
                    onTouchStart={(e) => handleTouchStart(e, rung.mainIdx)}
                    onTouchEnd={(e) => handleTouchEnd(e, rung.mainIdx)}
                    onClick={(e) => e.stopPropagation()}
                  >
                    ☰
                  </div>
                ) : (
                  <div className="gb-rung__handle-spacer" />
                )}

                {/* Rung content */}
                <div className="gb-rung__content">
                  {isLocked ? (
                    <div className="gb-rung__locked-box">
                      <span className="gb-rung__lock-icon">🔒</span>
                    </div>
                  ) : isInputActive ? (
                    <DigitBoxesInput
                      value={inputValue}
                      digits={digits}
                      accent={level.color}
                      status={status}
                    />
                  ) : isSolved ? (
                    <DigitDisplay value={rung.answer} digits={digits} accent={level.color} />
                  ) : (
                    <DigitBoxesEmpty digits={digits} />
                  )}
                </div>

                {/* Right side drag handle for main rungs */}
                {!isBonus ? (
                  <div
                    className="gb-rung__handle"
                    draggable
                    onDragStart={() => handleDragStart(rung.mainIdx)}
                    onDragOver={(e) => handleDragOver(e, rung.mainIdx)}
                    onDrop={() => handleDrop(rung.mainIdx)}
                    onDragEnd={handleDragEnd}
                    onTouchStart={(e) => handleTouchStart(e, rung.mainIdx)}
                    onTouchEnd={(e) => handleTouchEnd(e, rung.mainIdx)}
                    onClick={(e) => e.stopPropagation()}
                  >
                    ☰
                  </div>
                ) : (
                  <div className="gb-rung__handle-spacer" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Question Area */}
      {currentQuestion && selectedRung !== -1 && (
        <div className={`gb-question ${status === 'wrong' ? 'gb-question--wrong' : ''}`}>
          <p className="gb-question__text">{currentQuestion.question[lang] || currentQuestion.question.en}</p>
          {/* Hint & Reveal buttons side-by-side */}
          <div className="gb-question__actions">
            <button
              className={`gb-action-btn ${showHint ? 'gb-action-btn--active' : ''}`}
              onClick={() => setShowHint((v) => !v)}
            >
              💡 {t(lang, 'hint')}
            </button>
            <button
              className={`gb-action-btn gb-action-btn--reveal ${revealCooldown > 0 ? 'gb-action-btn--cooldown' : ''} ${revealedRungs.has(String(selectedRung)) ? 'gb-action-btn--active' : ''}`}
              onClick={handleRevealDigit}
              disabled={revealCooldown > 0 && !revealedRungs.has(String(selectedRung))}
            >
              {revealCooldown > 0 && !revealedRungs.has(String(selectedRung))
                ? `🔒 ${revealCooldown}s`
                : `🔎 ${t(lang, 'revealDigit')}`}
            </button>
          </div>
          {/* Conditional hint text */}
          {showHint && currentQuestion.hint && (
            <div className="gb-question__hint">{currentQuestion.hint[lang] || currentQuestion.hint.en}</div>
          )}
          {/* Revealed answer display */}
          {revealedRungs.has(String(selectedRung)) && (
            <div className="gb-question__revealed">
              {String(currentQuestion.answer).padStart(digits, '0').split('').join(' ')}
            </div>
          )}
          {status === 'wrong' && (
            <div className="gb-question__error">{t(lang, 'wrongAnswer')}</div>
          )}
        </div>
      )}

      {/* Status message when main phase done but chain invalid */}
      {mainAllFilled && !mainChainValid && selectedRung === -1 && (
        <div className="gb-status-msg gb-status-msg--warn">
          ⚠ {t(lang, 'chainWarning')}
        </div>
      )}

      {/* Status message when bonus unlocked */}
      {bonusUnlocked && (bonusTopAnswer === null || bonusBottomAnswer === null) && selectedRung === -1 && (
        <div className="gb-status-msg gb-status-msg--info">
          🔓 {t(lang, 'bonusUnlocked')}
        </div>
      )}

      {/* Numpad */}
      <div className="gb-numpad">
        <div className="gb-numpad__row">
          {[1, 2, 3].map((n) => (
            <button key={n} className="gb-numpad__key" onClick={() => handleNumpadPress(String(n))}>
              {n}
            </button>
          ))}
        </div>
        <div className="gb-numpad__row">
          {[4, 5, 6].map((n) => (
            <button key={n} className="gb-numpad__key" onClick={() => handleNumpadPress(String(n))}>
              {n}
            </button>
          ))}
        </div>
        <div className="gb-numpad__row">
          {[7, 8, 9].map((n) => (
            <button key={n} className="gb-numpad__key" onClick={() => handleNumpadPress(String(n))}>
              {n}
            </button>
          ))}
        </div>
        <div className="gb-numpad__row">
          <button className="gb-numpad__key gb-numpad__key--zero" onClick={() => handleNumpadPress('0')}>
            0
          </button>
          <button className="gb-numpad__key gb-numpad__key--backspace" onClick={handleBackspace}>
            ⌫
          </button>
        </div>
      </div>
    </div>
  );
}

/** Empty digit placeholder boxes */
function DigitBoxesEmpty({ digits }) {
  return (
    <div className="digit-boxes">
      {Array.from({ length: digits }, (_, i) => (
        <span key={i} className="digit-box digit-box--empty" />
      ))}
    </div>
  );
}

/** Digit boxes for active input — highlights current position instead of blinking cursor */
function DigitBoxesInput({ value, digits, accent, status }) {
  const cells = Array.from({ length: digits }, (_, i) =>
    i < value.length ? value[i] : null
  );
  const nextIdx = value.length < digits ? value.length : -1;

  return (
    <div className={`digit-boxes ${status === 'correct' ? 'digit-boxes--correct' : ''} ${status === 'wrong' ? 'digit-boxes--wrong' : ''}`}>
      {cells.map((d, i) => {
        const filled = d !== null;
        const isNext = i === nextIdx;
        return (
          <span
            key={i}
            className={`digit-box ${filled ? 'digit-box--filled' : ''} ${isNext ? 'digit-box--highlight' : ''}`}
            style={filled ? { '--cell-accent': accent } : isNext ? { '--cell-accent': accent } : {}}
          >
            {filled ? d : ''}
          </span>
        );
      })}
    </div>
  );
}

/** Displays a solved number with each digit in a box */
function DigitDisplay({ value, digits, accent }) {
  const str = String(value).padStart(digits, '0');
  return (
    <div className="digit-display">
      {str.split('').map((d, i) => (
        <span
          key={i}
          className="digit-display__cell"
          style={{ '--cell-accent': accent }}
        >
          {d}
        </span>
      ))}
    </div>
  );
}
