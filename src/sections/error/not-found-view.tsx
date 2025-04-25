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

export function NotFoundView() {
  return (
    <SimpleLayout
      slotProps={{
        content: { compact: true },
      }}
    >
        <m.div variants={varBounce('in')}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            متاسفانه صفحه مورد نظر یافت نشد !
          </Typography>
        </m.div>

        <m.div variants={varBounce('in')}>
          <Typography sx={{ color: 'text.secondary' }}>
           متاسفانه نتوانستیم صفحه مورد نظر شما رو پیدا کنیم. ادرس وارد شده اشتباه است ، لطفا در وارد کردن ادرس دقت فرمایید.
          </Typography>
        </m.div>

        <m.div variants={varBounce('in')}>
          <Image src={illustration} style={{width:400,height:"auto"}} alt='404error'/>
        </m.div>

        <Button component={RouterLink} href="/" size="large" variant="contained">
          برگشت به صفحه اصلی
        </Button>
    </SimpleLayout>
  );
}
