'use client';

import React, { useEffect } from 'react';
import { useSystemConfig } from '@/hooks/useSystemConfig';
import { applyThemeToDocument } from '@/lib/theme';

/**
 * Client-side component that syncs theme colors from SystemConfig
 * Applies CSS variables dynamically for real-time updates in admin panel
 */
export const ThemeSync: React.FC = () => {
  const { config } = useSystemConfig();

  useEffect(() => {
    if (!config) return;

    applyThemeToDocument({
      primaryColor: config.primaryColor || '#E8621A',
      accentColor: config.accentColor || '#FF6B9D',
      fontDisplay: config.fontDisplay || 'Fredoka',
      fontBody: config.fontBody || 'Nunito',
    });
  }, [config?.primaryColor, config?.accentColor, config?.fontDisplay, config?.fontBody]);

  return null; // This component doesn't render anything
};
