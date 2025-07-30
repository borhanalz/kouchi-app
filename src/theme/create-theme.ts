'use client';

import type { SettingsState } from 'src/components/settings';
import type { Theme, Components, Palette } from '@mui/material/styles';

import { createTheme as createMuiTheme } from '@mui/material/styles';

import { mixins } from './core/mixins';
import { shadows } from './core/shadows';
import { palette } from './core/palette';
import { themeConfig } from './theme-config';
import { components } from './core/components';
import { typography } from './core/typography';
import { customShadows } from './core/custom-shadows';
import { updateCoreWithSettings, updateComponentsWithSettings } from './with-settings';

import type { ThemeOptions } from './types';

// ----------------------------------------------------------------------

export const baseTheme: ThemeOptions = {
  colorSchemes: {
    light: {
      palette: palette.light,
      shadows: shadows.light,
      customShadows: customShadows.light,
    },
    dark: {
      palette: {
        ...palette.dark!,
        primary: {
          ...palette.dark!.primary,
          main: themeConfig.palette.secondary.main, // ✅ override only `main`
        } as Palette['primary'],
      },
      shadows: shadows.dark,
      customShadows: customShadows.dark,

      // ✅ Add dark mode specific component overrides here
      components: {
        // MuiButton: {
        //   styleOverrides: {
        //     root: {
        //       color: , // ✅ Set button text color to black in dark mode
        //     },
        //   },
        // },
        MuiTypography: {
          styleOverrides: {
            root: {
              color: '#fff',
            },
          },
        },
      },
    },
  },
  mixins,
  components,
  typography,
  shape: { borderRadius: 8 },
  direction: themeConfig.direction,
  cssVariables: themeConfig.cssVariables,
  defaultColorScheme: themeConfig.defaultMode,
};

// ----------------------------------------------------------------------

type CreateThemeProps = {
  settingsState?: SettingsState;
  themeOverrides?: ThemeOptions;
  localeComponents?: { components?: Components<Theme> };
};

export function createTheme({
                              settingsState,
                              themeOverrides = {},
                              localeComponents = {},
                            }: CreateThemeProps = {}): Theme {
  const updatedCore = settingsState ? updateCoreWithSettings(baseTheme, settingsState) : baseTheme;

  const updatedComponents = settingsState
    ? updateComponentsWithSettings(components, settingsState)
    : {};

  const theme = createMuiTheme(updatedCore, updatedComponents, localeComponents, themeOverrides);

  return theme;
}
