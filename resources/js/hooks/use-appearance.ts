type Theme = 'light' | 'dark' | 'system';

/**
 * Initialize the theme based on stored preferences or system defaults
 */
export function initializeTheme(): void {
  const storedTheme = localStorage.getItem('theme') as Theme | null;
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const theme = storedTheme || 'system';
  
  if (theme === 'dark' || (theme === 'system' && systemTheme === 'dark')) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  // Store the theme preference if not already set
  if (!storedTheme) {
    localStorage.setItem('theme', 'system');
  }
}

/**
 * Hook to manage theme appearance preferences
 */
export function useAppearance() {
  const getTheme = (): Theme => {
    return (localStorage.getItem('theme') as Theme) || 'system';
  };
  
  const setTheme = (theme: Theme): void => {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    
    localStorage.setItem('theme', theme);
    
    if (theme === 'dark' || (theme === 'system' && systemTheme === 'dark')) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  return { theme: getTheme(), setTheme };
}
