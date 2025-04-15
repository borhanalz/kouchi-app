import type { CSSObject, Breakpoint } from '@mui/material/styles';
import type { TypographyOptions } from '@mui/material/styles/createTypography';

import { pxToRem } from 'minimal-shared/utils';

import { createTheme } from '@mui/material/styles';

import { themeConfig } from '../theme-config';

// ----------------------------------------------------------------------

export type FontStyleExtend = {
  fontWeightSemiBold: CSSObject['fontWeight'];
  fontSecondaryFamily: CSSObject['fontFamily'];
};

export type ResponsiveFontSizesInput = Partial<Record<Breakpoint, number>>;
export type ResponsiveFontSizesResult = Record<string, { fontSize: string }>;

const defaultMuiTheme = createTheme();

function responsiveFontSizes(obj: ResponsiveFontSizesInput): ResponsiveFontSizesResult {
  const breakpoints: Breakpoint[] = defaultMuiTheme.breakpoints.keys;
  const result: ResponsiveFontSizesResult = {};

  breakpoints.forEach((breakpoint) => {
    const value = obj[breakpoint];
    if (value !== undefined) {
      result[defaultMuiTheme.breakpoints.up(breakpoint)] = {
        fontSize: pxToRem(value),
      };
    }
  });

  return result;
}

// ----------------------------------------------------------------------

export const typography: TypographyOptions & FontStyleExtend = {
  fontFamily: "'Kalameh', 'Helvetica', 'Arial', sans-serif",
  fontSecondaryFamily: "'Kalameh', 'Helvetica', 'Arial', sans-serif",
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightSemiBold: 600,
  fontWeightBold: 700,

  // Standardized scale based on 4px baseline (Material Design standard)
  h1: {
    fontWeight: 800,
    lineHeight: 1.2,
    fontSize: pxToRem(32),
    ...responsiveFontSizes({ xs: 32, sm: 36, md: 40, lg: 44, xl: 48 }),
  },
  h2: {
    fontWeight: 800,
    lineHeight: 1.3,
    fontSize: pxToRem(28),
    ...responsiveFontSizes({ xs: 28, sm: 30, md: 32, lg: 34, xl: 36 }),
  },
  h3: {
    fontWeight: 700,
    lineHeight: 1.4,
    fontSize: pxToRem(24),
    ...responsiveFontSizes({ xs: 24, sm: 26, md: 28, lg: 30, xl: 32 }),
  },
  h4: {
    fontWeight: 700,
    lineHeight: 1.4,
    fontSize: pxToRem(20),
    ...responsiveFontSizes({ xs: 20, sm: 22, md: 24, lg: 26, xl: 28 }),
  },
  h5: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(18),
    ...responsiveFontSizes({ xs: 18, sm: 20, md: 22, lg: 24, xl: 26 }),
  },
  h6: {
    fontWeight: 600,
    lineHeight: 1.5,
    fontSize: pxToRem(16),
    ...responsiveFontSizes({ xs: 16, sm: 18, md: 20, lg: 22, xl: 24 }),
  },
  // Body text follows a different scale for better readability
  body1: {
    lineHeight: 1.5,
    fontSize: pxToRem(16),
    ...responsiveFontSizes({ xs: 16, sm: 16, md: 17, lg: 18, xl: 18 }),
  },
  body2: {
    lineHeight: 1.5,
    fontSize: pxToRem(14),
    ...responsiveFontSizes({ xs: 14, sm: 14, md: 15, lg: 16, xl: 16 }),
  },
  // Smaller text elements
  caption: {
    lineHeight: 1.4,
    fontSize: pxToRem(12),
    ...responsiveFontSizes({ xs: 12, sm: 12, md: 13, lg: 14, xl: 14 }),
  },
  overline: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(12),
    ...responsiveFontSizes({ xs: 12, sm: 12, md: 13, lg: 14, xl: 14 }),
    textTransform: 'uppercase',
  },
  button: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(14),
    ...responsiveFontSizes({ xs: 14, sm: 14, md: 15, lg: 16, xl: 16 }),
    textTransform: 'unset',
  },
};
