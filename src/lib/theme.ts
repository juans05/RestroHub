export interface ThemeConfig {
  primaryColor: string;
  accentColor: string;
  fontDisplay?: string;
  fontBody?: string;
}

export const FONT_OPTIONS = {
  fredoka: {
    name: 'Fredoka',
    fontFamily: 'Fredoka',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap',
  },
  nunito: {
    name: 'Nunito',
    fontFamily: 'Nunito',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700&display=swap',
  },
  lobster: {
    name: 'Lobster',
    fontFamily: 'Lobster',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Lobster:wght@400&display=swap',
  },
  poppins: {
    name: 'Poppins',
    fontFamily: 'Poppins',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap',
  },
  pacifico: {
    name: 'Pacifico',
    fontFamily: 'Pacifico',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Pacifico&display=swap',
  },
};

export const COLOR_PRESETS: Record<string, { name: string; primary: string; accent: string }> = {
  rauletti: {
    name: '🍊 Rauletti Naranja',
    primary: '#E8621A',
    accent: '#FF6B9D',
  },
  burgundy: {
    name: '🍷 Clásica Burdeos',
    primary: '#6B1A2A',
    accent: '#C5A059',
  },
  coffee: {
    name: '☕ Café Moderno',
    primary: '#5C4033',
    accent: '#A8C5A0',
  },
  rose: {
    name: '🌸 Rosa Dulce',
    primary: '#D63384',
    accent: '#FFD700',
  },
  green: {
    name: '🌿 Verde Natural',
    primary: '#2D6A4F',
    accent: '#F5B942',
  },
};

/**
 * Genera CSS string con las variables dinámicas del tema
 * Se usa en layout.tsx para inyectar en <style> tag
 */
export function buildThemeCSS(config?: {
  primaryColor?: string;
  accentColor?: string;
  fontDisplay?: string;
  fontBody?: string;
}): string {
  const primary = config?.primaryColor || '#E8621A';
  const accent = config?.accentColor || '#FF6B9D';
  const fontDisplay = config?.fontDisplay || 'Fredoka';
  const fontBody = config?.fontBody || 'Nunito';

  // Deriving secondary (dark) color from primary by darkening it
  const primaryDark = darkenColor(primary, 20);

  return `
    :root {
      --rauletti-naranja: ${primary};
      --rauletti-naranja-dark: ${primaryDark};
      --rauletti-rosa: ${accent};
      --font-serif: '${fontDisplay}', sans-serif;
      --font-sans: '${fontBody}', sans-serif;
    }
  `;
}

/**
 * Darken a hex color by a percentage
 */
function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, (num >> 16) - amt);
  const G = Math.max(0, (num >> 8 & 0x00FF) - amt);
  const B = Math.max(0, (num & 0x0000FF) - amt);
  return '#' + (0x1000000 + (R < 255 ? R : 255) * 0x10000 + (G < 255 ? G : 255) * 0x100 + (B < 255 ? B : 255)).toString(16).slice(1);
}

/**
 * Apply theme colors to document.documentElement dynamically
 * Used by ThemeSync component for real-time updates
 */
export function applyThemeToDocument(config: ThemeConfig): void {
  if (typeof document === 'undefined') return;

  const primary = config.primaryColor;
  const accent = config.accentColor;
  const fontDisplay = config.fontDisplay || 'Fredoka';
  const fontBody = config.fontBody || 'Nunito';
  const primaryDark = darkenColor(primary, 20);

  const root = document.documentElement;
  root.style.setProperty('--rauletti-naranja', primary);
  root.style.setProperty('--rauletti-naranja-dark', primaryDark);
  root.style.setProperty('--rauletti-rosa', accent);
  root.style.setProperty('--font-serif', `'${fontDisplay}', sans-serif`);
  root.style.setProperty('--font-sans', `'${fontBody}', sans-serif`);
}
