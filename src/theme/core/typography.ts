import type {CSSObject, Breakpoint} from '@mui/material/styles';
import type { TypographyOptions } from '@mui/material/styles/createTypography';

import { pxToRem, setFont } from 'minimal-shared/utils';

import { createTheme as getTheme } from '@mui/material/styles';

import { themeConfig } from '../theme-config';

// ----------------------------------------------------------------------

/**
 * TypeScript (type definition and extension)
 * @to {@link file://./../extend-theme-types.d.ts}
 */
export type FontStyleExtend = {
  fontWeightSemiBold: CSSObject['fontWeight'];
  fontSecondaryFamily: CSSObject['fontFamily'];
};

export type ResponsiveFontSizesInput = Partial<Record<Breakpoint, number>>;
export type ResponsiveFontSizesResult = Record<string, { fontSize: string }>;

const defaultMuiTheme = getTheme();

function responsiveFontSizes(obj: ResponsiveFontSizesInput): ResponsiveFontSizesResult {
  const breakpoints: Breakpoint[] = defaultMuiTheme.breakpoints.keys;

  return breakpoints.reduce((acc, breakpoint) => {
    const value = obj[breakpoint];

    if (value !== undefined && value >= 0) {
      acc[defaultMuiTheme.breakpoints.up(breakpoint)] = {
        fontSize: pxToRem(value),
      };
    }

    return acc;
  }, {} as ResponsiveFontSizesResult);
}

// ----------------------------------------------------------------------

const primaryFont = setFont(themeConfig.fontFamily.primary);
const secondaryFont = setFont(themeConfig.fontFamily.secondary);
export const typography: TypographyOptions = {
  fontFamily: "kalameh",
  fontSecondaryFamily: "kalameh",
  fontWeightLight: '300',
  fontWeightRegular: '400',
  fontWeightMedium: '500',
  fontWeightSemiBold: '600',
  fontWeightBold: '700',

  h1: {
    fontFamily: "kalameh",
    fontWeight: 800,
    lineHeight: 1.2,
    fontSize: pxToRem(20),
    ...responsiveFontSizes({ sm: 22, md: 24, lg: 26 }),
  },
  h2: {
    fontFamily: "kalameh",
    fontWeight: 800,
    lineHeight: 1.3,
    fontSize: pxToRem(18),
    ...responsiveFontSizes({ sm: 20, md: 22, lg: 24 }),
  },
  h3: {
    fontFamily: "kalameh",
    fontWeight: 700,
    lineHeight: 1.4,
    fontSize: pxToRem(16),
    ...responsiveFontSizes({ sm: 18, md: 20, lg: 22 }),
  },
  h4: {
    fontFamily:"kalameh",
    fontWeight: 700,
    lineHeight: 1.4,
    fontSize: pxToRem(14),
    ...responsiveFontSizes({ sm: 16, md: 18, lg: 20 }),
  },
  h5: {
    fontFamily:"kalameh",
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(12),
    ...responsiveFontSizes({ sm: 14, md: 16, lg: 18 }),
  },
  h6: {
    fontFamily:"kalameh",
    fontWeight: 600,
    lineHeight: 1.5,
    fontSize: pxToRem(10),
    ...responsiveFontSizes({ sm: 12, md: 14, lg: 16 }),
  },
  subtitle1: {
    fontFamily:"kalameh",
    fontWeight: 600,
    lineHeight: 1.5,
    fontSize: pxToRem(10),
    ...responsiveFontSizes({ sm: 12, md: 14, lg: 16 }),
  },
  subtitle2: {
    fontFamily:"kalameh",
    fontWeight: 600,
    lineHeight: 1.5,
    fontSize: pxToRem(9),
    ...responsiveFontSizes({ sm: 10, md: 12, lg: 14 }),
  },
  body1: {
    fontFamily:"kalameh",
    lineHeight: 1.5,
    fontSize: pxToRem(10),
    ...responsiveFontSizes({ sm: 12, md: 14, lg: 16 }),
  },
  body2: {
    fontFamily:"kalameh",
    lineHeight: 1.5,
    fontSize: pxToRem(9),
    ...responsiveFontSizes({ sm: 10, md: 12, lg: 14 }),
  },
  caption: {
    fontFamily:"kalameh",
    lineHeight: 1.4,
    fontSize: pxToRem(8),
    ...responsiveFontSizes({ sm: 9, md: 10, lg: 12 }),
  },
  overline: {
    fontFamily:"kalameh",
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(8),
    ...responsiveFontSizes({ sm: 9, md: 10, lg: 12 }),
    textTransform: 'uppercase',
  },
  button: {
    fontFamily:"kalameh",
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(9),
    ...responsiveFontSizes({ sm: 10, md: 12, lg: 14 }),
    textTransform: 'unset',
  },
};

