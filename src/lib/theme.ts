export const THEME_STORAGE_KEY = "capitalbridge-theme";

// Runs inline in <head> before first paint (see layout.tsx): the stored
// choice wins, otherwise follow the OS. Kept as a plain string so it runs
// before any JS bundle loads — no flash of the light theme.
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){}})();`;
