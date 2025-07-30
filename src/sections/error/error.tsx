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
import Stack from "@mui/material/Stack";
import {Iconify} from "../../components/iconify";
import Box from "@mui/material/Box";
// ----------------------------------------------------------------------

export function ErrorView() {
  return (
    <SimpleLayout
      slotProps={{
        content: { compact: true },
      }}
      sx={{display:'flex',alignItems:'center',justifyContent:'center'}}
    >
      <Stack spacing={2}>
        <Stack direction='row' justifyContent='center'>
          <Iconify icon='errorFile' sx={{color:'red',width:'100px',height:'100px'}} />
        </Stack>
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
        <Box sx={{p:1.5,border:1,borderRadius:2,backgroundColor:'text.primary',color:'#fff'}}>
          <Typography>اگر از تحریم شکن استفاده میکنید،آن را خاموش کنید</Typography>
        </Box>
      </Stack>
    </SimpleLayout>
  );
}
