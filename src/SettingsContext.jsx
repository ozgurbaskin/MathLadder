import { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'mathladder_settings';

const defaults = {
  language: 'tr',
  sound: true,
  music: true,
};

function load() {
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem(STORAGE_KEY)) };
  } catch {
    return { ...defaults };
  }
}

const Ctx = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(load);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  function update(key, value) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  return <Ctx.Provider value={{ settings, update }}>{children}</Ctx.Provider>;
}

export function useSettings() {
  return useContext(Ctx);
}
