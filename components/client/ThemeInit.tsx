'use client';

import { useEffect } from 'react';
import { themeChange } from 'theme-change';

export function ThemeInit() {
  useEffect(() => {
    themeChange(false); // false = do not auto-init, you manually control it
  }, []);

  return null;
}
