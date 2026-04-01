import { useState } from 'react';
import LevelSelect from './components/LevelSelect.jsx';
import GameBoard from './components/GameBoard.jsx';
import { levels } from './data/levels.js';

const STORAGE_KEY = 'mathladder_completed';

function loadCompleted() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export default function App() {
  const [screen, setScreen] = useState('menu'); // 'menu' | 'game'
  const [selectedLevelIndex, setSelectedLevelIndex] = useState(0);
  const [completedLevels, setCompletedLevels] = useState(loadCompleted);

  function handleSelectLevel(index) {
    setSelectedLevelIndex(index);
    setScreen('game');
  }

  function handleLevelComplete() {
    setCompletedLevels((prev) => {
      const next = prev.includes(selectedLevelIndex) ? prev : [...prev, selectedLevelIndex];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    setScreen('menu');
  }

  function handleBack() {
    setScreen('menu');
  }

  if (screen === 'game') {
    return (
      <GameBoard
        level={levels[selectedLevelIndex]}
        onComplete={handleLevelComplete}
        onBack={handleBack}
      />
    );
  }

  return (
    <LevelSelect
      levels={levels}
      completedLevels={completedLevels}
      onSelect={handleSelectLevel}
    />
  );
}
