'use client';

import { useBoolean } from 'minimal-shared/hooks';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { yellow } from '@mui/material/colors';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';
import IconText from 'src/components/icon-text/icon-text';

import { grey } from '../../../theme';
import ProPackagesPeyment from '../pro-packages-peyment';
import {DashboardContent} from "../../../layouts/dashboard";

// ------------------------------------------------------------------------------

const data = [
  {
    id: 1,
    icon: 'rhombusStar',
    title: 'کوچ‌راه',
    subTitle: 'حواسش بهت هست!',
    featuresTitle: 'امکانات شخصی سازی شده',
    featuresList: [
      'نقشه‌راه کامل',
      'راهنمای شغل و درآمد بعد از تحصیل',
      'راهنمای پیدا کردن موقعیت‌های تحصیلی',
      'راهنمای نوشتن رزومه و سایر مدارک',
      'راهنمای اقدام برای اخذ ویزا',
      'مدیریت تسک‌ها و یادآوری با پیامک',
      'راهنمای اقامت و شروع تحصیل در مقصد',
    ],
    price: '790',
  },
  {
    id: 2,
    icon: 'gem',
    title: 'کوچ‌نویس',
    subTitle: 'نوشتار با متخصص!',
    featuresTitle: ' + همه‌ی امکانات کوچ‌راه',
    featuresList: [
      'نوشتن رزومه توسط کارشناس متخصص',
      'لیست موقعیت‌های تحصیلی مختص شما',
      'دستیار گام به گام ثبت درخواست پذیرش',
      'پشتیبانی تیکت با کارشناس در مورد رزومه',
    ],
    price: '3.900',
  },
  {
    id: 3,
    icon: 'gems',
    title: 'کوچ‌پرو',
    subTitle: 'خیالت راحته!',
    featuresTitle: ' + همه‌ی امکانات کوچ‌نویس',
    featuresList: [
      'ثبت درخواست پذیرش توسط کارشناس',
      'پشتیبانی تیکت با کارشناس برای اخذ ویزا',
      'راهنمای اقامت با کارشناس مقیم کشور مقصد',
    ],
    price: '5.900',
  },
];

export const ProPackages = () => {
  const theme = useTheme();
  const peymentDialog = useBoolean();

  return (
    <>
      <DashboardContent
        maxWidth={false}
        sx={{
          display: "flex",
          flex: "1 1 auto",
          flexDirection: "column"
        }}
        title="سرویس ها"
      >
      <Stack
        sx={{
          border:1,
          borderRadius: 2,
          borderColor: theme.palette.mode==="dark"?theme.vars.palette.grey[800]: theme.vars.palette.grey[300],
          p:2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Stack textAlign="center" spacing={1} mb={2}>
          <Stack direction="row" spacing={1}>
            <Iconify icon="goldStar" sx={{ color: yellow[700] }} />
            <Typography variant="h4">بسته های کوچی</Typography>
            <Iconify icon="goldStar" sx={{ color: yellow[700] }} />
          </Stack>
          <Typography variant="body2" color={grey[500]}>
            کوچی فکر همه‌جا رو کرده
          </Typography>
        </Stack>
        <Stack
          direction={{md:"row",xs:'column'}}
          justifyContent="center"
          spacing={5}
          textAlign="center"
          alignItems="stretch"
          sx={{ height: '100%' }}
        >
          {data?.map((item) => (
            <Stack
              spacing={3}
              sx={{
                border: 1,
                maxHeight: '100%',
                borderColor: theme.palette.mode==="dark"?theme.vars.palette.grey[800]: theme.vars.palette.grey[300],
                borderRadius: 2,
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <Stack direction="row" justifyContent="space-between">
                <Stack spacing={2}>
                  <Typography fontWeight="bold" variant="h6" textAlign="left">
                    {item?.title}
                  </Typography>
                  <Typography variant="body2" color={grey[500]}>
                    {item?.subTitle}
                  </Typography>
                </Stack>
                <Iconify
                  icon={item?.icon}
                  sx={{ color: theme.vars.palette.primary.main, width: 35, height: 35 }}
                />
              </Stack>
              <Stack direction="row" justifyContent="end">
                <Typography fontWeight="bolder" variant="h4">
                  {item?.price}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  هزار تومان
                </Typography>
              </Stack>
              <Divider sx={{ borderStyle: 'dashed' }} />
              <Stack direction="row" spacing={4} justifyContent="space-between">
                <Typography variant="body2" fontWeight="bold">
                  {item?.featuresTitle}
                </Typography>
                <Link fontSize={14}>نمایش کامل</Link>
              </Stack>
              <Stack
                direction="column"
                spacing={2}
                sx={{
                  flexGrow: 1,
                }}
              >
                {item?.featuresList?.map((feature) => (
                  <IconText
                    key={feature}
                    icon="tick"
                    label={feature}
                    typographyProps={{ color: theme.vars.palette.primary.main }}
                    iconifySx={{ color: theme.vars.palette.primary.main }}
                  />
                ))}
              </Stack>
              <Button variant="contained" color="primary" onClick={peymentDialog.onTrue}>
                می‌خوام شروع کنم!
              </Button>
            </Stack>
          ))}
        </Stack>
      </Stack>
      <ProPackagesPeyment dialog={peymentDialog} />
      </DashboardContent>
    </>
  );
};

export default ProPackages;
