import { useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const storedValue = localStorage.getItem(key);
  const initial = storedValue ? JSON.parse(storedValue) : initialValue;
  const [value, setValue] = useState<T>(initial);

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setStoredValue = (value: T) => {
    // Save state
    setValue(value);
    // Save to local storage
    localStorage.setItem(key, JSON.stringify(value));
  };

  return [value, setStoredValue];
}
