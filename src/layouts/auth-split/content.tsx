'use client';

import type { BoxProps } from '@mui/material/Box';
import type { Breakpoint } from '@mui/material/styles';

import { mergeClasses } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import {Logo} from "../../components/logo";
import { layoutClasses } from '../core/classes';
import { FormHead } from '../../auth/components/form-head';
import illustration from 'public/assets/images/login-illustrator.png'
import Image from "next/image";
import Typography from "@mui/material/Typography";
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
        <Box sx={{ borderRadius: 2, p: 1 }}>
          <Stack textAlign="center" spacing={3} alignItems="center">
            <Logo width={170} height={75}/>
            <Box>
              <Image alt='illustration' src={illustration} style={{width:'100px',height:'auto'}}/>
            </Box>
            <FormHead title="با ورود به پنل کوچی : " description={<Stack spacing={2}>
              <Typography>🚀 چت‌بات با اطلاعات کامل داری</Typography>
              <Typography> 🎓 کوچ‌یار هم‌رشته‌ت کنارته</Typography>
              <Typography>🎯 بعلاوه سرویس‌هایی برای انتخاب دانشگاه، پذیرش و بورسیه</Typography>
            </Stack>} />
          </Stack>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
