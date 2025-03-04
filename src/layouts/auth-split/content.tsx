'use client';

import type { BoxProps } from '@mui/material/Box';
import type { Breakpoint } from '@mui/material/styles';

import Image from 'next/image';
import { mergeClasses } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { layoutClasses } from '../core/classes';
import { FormHead } from '../../auth/components/form-head';

import img from '/public/assets/images/illustration-seo.png';

// ----------------------------------------------------------------------

export type AuthSplitContentProps = BoxProps & { layoutQuery?: Breakpoint };

export function AuthSplitContent({
  sx,
  children,
  className,
  layoutQuery = 'md',
  ...other
}: AuthSplitContentProps) {
  return (
    <Box
      className={mergeClasses([layoutClasses.content, className])}
      sx={[
        (theme) => ({
          display: 'flex',
          flex: '1 1 auto',
          alignItems: 'center',
          flexDirection: 'column',
          p: theme.spacing(3, 2, 10, 2),
          [theme.breakpoints.up(layoutQuery)]: {
            justifyContent: 'center',
            p: theme.spacing(10, 2, 10, 2),
          },
        }),
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
        <Box sx={{ borderRadius: 2, backgroundColor: '#ffff', p: 2 }}>
          <Stack textAlign="center" spacing={1} alignItems="center">
            <Image src={img} width={200} alt="illustration" />
            <FormHead title="ورود به کوچی" description="دستیار هوش مصنوعی مهاجرت تحصیلی" />
          </Stack>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
