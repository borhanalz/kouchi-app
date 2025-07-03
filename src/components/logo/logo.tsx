import type { LinkProps } from '@mui/material/Link';

import Image from 'next/image';
import { useId, forwardRef } from 'react';
import { mergeClasses } from 'minimal-shared/utils';

import Link from '@mui/material/Link';
import { styled, useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

import { logoClasses } from './classes';
import { CONFIG } from '../../global-config';

// ----------------------------------------------------------------------

export type LogoProps = LinkProps & {
  isSingle?: boolean;
  disabled?: boolean;
  width?:number;
  height?:number;
};

export const Logo = forwardRef<HTMLAnchorElement, LogoProps>((props, ref) => {
  const { className, href = '/', isSingle = true, disabled,width=100,height=45, sx, ...other } = props;

  const theme = useTheme();

  const singleLogo = (
    <Image
      alt="Single logo"
      src={`${CONFIG.assetsDir}${theme.palette.mode === 'dark' ? '/logo/logo-png.png' : '/logo/logo-full.png'}`}
      width={width}
      height={height}
    />
  );

  const fullLogo = (
    <Image
      alt="Full logo"
      src={`${CONFIG.assetsDir}${theme.palette.mode === 'dark' ? '/logo/logo-png.png' : '/logo/logo-full.png'}`}
      width={width}
      height={height}
    />
  );

  return (
    <LogoRoot
      ref={ref}
      component={RouterLink}
      href={href}
      aria-label="Logo"
      underline="none"
      className={mergeClasses([logoClasses.root, className])}
      sx={[
        () => ({
          width: width,
          height: height,
          ...(!isSingle && { width: width, height: height }),
          ...(disabled && { pointerEvents: 'none' }),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {isSingle ? singleLogo : fullLogo}
    </LogoRoot>
  );
});

// ----------------------------------------------------------------------

const LogoRoot = styled(Link)(() => ({
  flexShrink: 0,
  color: 'transparent',
  display: 'inline-flex',
  verticalAlign: 'middle',
}));
