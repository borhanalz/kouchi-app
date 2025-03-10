import type { LinkProps } from '@mui/material/Link';

import Image from "next/image";
import { useId, forwardRef } from 'react';
import { mergeClasses } from 'minimal-shared/utils';

import Link from '@mui/material/Link';
import { styled, useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

import { logoClasses } from './classes';
import {CONFIG} from "../../global-config";

// ----------------------------------------------------------------------

export type LogoProps = LinkProps & {
  isSingle?: boolean;
  disabled?: boolean;
};

export const Logo = forwardRef<HTMLAnchorElement, LogoProps>((props, ref) => {
  const { className, href = '/', isSingle = true, disabled, sx, ...other } = props;

  const theme = useTheme();

  const singleLogo = (
    <Image
      alt="Single logo"
      src={`${CONFIG.assetsDir}${theme.palette.mode==='dark'?'/logo/logo-single.svg':'/logo/logo-single-dark.svg'}`}
      width={40}
      height={45}
    />
  );

  const fullLogo = (
    <Image
      alt="Full logo"
      src={`${CONFIG.assetsDir}${theme.palette.mode==='dark'?'/logo/logo-single.svg':'/logo/logo-single-dark.svg'}`}
      width={40}
      height={45}
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
          width: 40,
          height: 40,
          ...(!isSingle && {width: 102, height: 36}),
          ...(disabled && {pointerEvents: 'none'}),
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
