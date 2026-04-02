import { useState, useEffect } from 'react';
import { SettingsProvider, useSettings } from './SettingsContext.jsx';
import ParallaxBg from './components/ParallaxBg.jsx';
import MainMenu from './components/MainMenu.jsx';
import CategorySelect from './components/CategorySelect.jsx';
import LevelSelect from './components/LevelSelect.jsx';
import SettingsScreen from './components/SettingsScreen.jsx';
import Leaderboard, { saveScore } from './components/Leaderboard.jsx';
import GameBoard from './components/GameBoard.jsx';
import { levels, categories, getLevelsByCategory } from './data/levels.js';
import { startMusic, stopMusic } from './sounds.js';

const STORAGE_KEY = 'mathladder_completed';

function loadCompleted() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function AppInner() {
  const { settings } = useSettings();
  // screens: 'menu' | 'categories' | 'levels' | 'settings' | 'leaderboard' | 'game'
  const [screen, setScreen] = useState('menu');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [completedLevels, setCompletedLevels] = useState(loadCompleted);
  const [gameStartTime, setGameStartTime] = useState(null);

  // Music control
  useEffect(() => {
    if (settings.music) {
      startMusic();
    } else {
      stopMusic();
    }
    return () => stopMusic();
  }, [settings.music]);

  function handleSelectCategory(catId) {
    setSelectedCategory(categories.find((c) => c.id === catId));
    setScreen('levels');
  }

  function handleSelectLevel(level) {
    setSelectedLevel(level);
    setGameStartTime(Date.now());
    setScreen('game');
  }

  function handleLevelComplete() {
    if (gameStartTime && selectedLevel) {
      const elapsed = Math.round((Date.now() - gameStartTime) / 1000);
      // Find global index for backward compat with leaderboard
      const globalIdx = levels.findIndex((l) => l.id === selectedLevel.id);
      saveScore(globalIdx, elapsed);
    }
    setCompletedLevels((prev) => {
      if (!selectedLevel) return prev;
      const next = prev.includes(selectedLevel.id) ? prev : [...prev, selectedLevel.id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    setScreen('levels');
  }

  function handleBack() {
    if (screen === 'game') setScreen('levels');
    else if (screen === 'levels') setScreen('categories');
    else setScreen('menu');
  }

  function handleNavigate(target) {
    if (target === 'levels') {
      setScreen('categories');
    } else {
      setScreen(target);
    }
  }

  return (
    <>
      <ParallaxBg />
      {screen === 'game' && selectedLevel ? (
        <GameBoard
          level={selectedLevel}
          onComplete={handleLevelComplete}
          onBack={handleBack}
        />
      ) : screen === 'levels' && selectedCategory ? (
        <LevelSelect
          levels={getLevelsByCategory(selectedCategory.id)}
          category={selectedCategory}
          completedLevels={completedLevels}
          onSelect={handleSelectLevel}
          onBack={handleBack}
        />
      ) : screen === 'categories' ? (
        <CategorySelect
          onSelect={handleSelectCategory}
          onBack={handleBack}
        />
      ) : screen === 'settings' ? (
        <SettingsScreen onBack={handleBack} />
      ) : screen === 'leaderboard' ? (
        <Leaderboard onBack={handleBack} />
      ) : (
        <MainMenu onNavigate={handleNavigate} />
      )}
    </>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <AppInner />
    </SettingsProvider>
  );
}
