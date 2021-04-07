export function isDarkModeOSPreferred(): boolean {
  return (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
}

export function getDarkModePreference(): 'light' | 'dark' {
  // check localstorage for overrides
  if (window.localStorage) {
    try {
      const colorScheme = localStorage.getItem('color-scheme');
      if (colorScheme && (colorScheme === 'light' || colorScheme === 'dark')) {
        return colorScheme;
      }
    } catch (e) {}
  }

  // default to OS preference
  return isDarkModeOSPreferred() ? 'dark' : 'light';
}

export function setDarkModePreference(
  colorScheme: 'light' | 'dark' | null
): void {
  if (!window.localStorage) {
    return;
  }
  if (colorScheme === null) {
    localStorage.removeItem('color-scheme');
    return;
  }
  localStorage.setItem('color-scheme', colorScheme);
}
