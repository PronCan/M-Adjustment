import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

export function useDarkMode() {
  const theme = useAppStore((state) => state.settings.theme);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.removeAttribute('data-theme');
    }
  }, [theme]);
}
