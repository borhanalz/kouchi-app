'use client';

import 'swiper/css';
import 'swiper/css/autoplay';

import Image from 'next/image';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import type { BoxProps } from '@mui/material/Box';
import type { Breakpoint } from '@mui/material/styles';

import { mergeClasses } from 'minimal-shared/utils';
import illustration from 'public/assets/images/login-illustrator.png';

import { Logo } from '../../components/logo';
import { FormHead } from '../../auth/components/form-head';
import { layoutClasses } from '../core/classes';

export type AuthSplitContentProps = BoxProps & { layoutQuery?: Breakpoint };

export function AuthSplitContent({
                                   sx,
                                   children,
                                   className,
                                   layoutQuery = 'md',
                                   ...other
                                 }: AuthSplitContentProps) {
  const theme = useTheme();

  return (
    <Box
      className={mergeClasses([layoutClasses.content, className])}
      sx={[
        {
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: 'column',
          alignItems: 'center',
          p: theme.spacing(3, 2, 10, 2),
          [theme.breakpoints.up(layoutQuery)]: {
            justifyContent: 'center',
            p: theme.spacing(10, 2, 10, 2),
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        sx={{
          width: 1,
          display: 'flex',
          flexDirection: 'column',
          maxWidth: 'var(--layout-auth-content-width)',
        }}
      >
        <Box sx={{ borderRadius: 2, p: 1 }}>
          <Stack textAlign="center" spacing={3} alignItems="center">
            <Logo width={170} height={75} />
            {/*<Box>*/}
            {/*  <Image*/}
            {/*    alt="illustration"*/}
            {/*    src={illustration}*/}
            {/*    style={{ width: '100px', height: 'auto' }}*/}
            {/*  />*/}
            {/*</Box>*/}

            <FormHead
              title="ابزار هوش مصنوعی مهاجرت"
              description={'جستجوگر هوشمندِ منابع رسمی و به‌روز'}
            />
          </Stack>

          {children}
        </Box>
      </Box>
    </Box>
  );
}
