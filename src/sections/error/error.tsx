'use client';

import Image from "next/image";
import { m } from 'framer-motion';
import illustration from 'public/assets/images/404.png';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { SimpleLayout } from 'src/layouts/simple';
import { PageNotFoundIllustration } from 'src/assets/illustrations';

import { varBounce, MotionContainer } from 'src/components/animate';
// ----------------------------------------------------------------------

export function ErrorView() {
  return (
    <SimpleLayout
      slotProps={{
        content: { compact: true },
      }}
    >
      <m.div variants={varBounce('in')}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          متاسفیم بنظر مشکلی پیش امده !
        </Typography>
      </m.div>

      <m.div variants={varBounce('in')}>
        <Typography sx={{ color: 'text.secondary' }}>
         لطفا دقایقی دیگر امتحان کنید
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>
          از صبوری شما متشکریم
        </Typography>
      </m.div>

    </SimpleLayout>
  );
}
