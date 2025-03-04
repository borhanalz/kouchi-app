'use client';

import Image from 'next/image';
import italy from 'public/assets/images/italy.png';
import canada from 'public/assets/images/canadaFlag.jpg';

import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Card, CardActions, CardContent } from '@mui/material';

import { grey } from '../../../theme';
import { Iconify } from '../../../components/iconify';
import { DashboardContent } from '../../../layouts/dashboard';
import IconText from '../../../components/icon-text/icon-text';
import { paths } from '../../../routes/paths';
import { useRouter } from 'next/navigation';
// ---------------------------------------------------------------------------
const RoadMapView = () => {
  const theme = useTheme();
  const data = [
    {
      id: 'canada',
      title: 'کارشناسی متالوژی کانادا',
      img: canada,
      cities: 'شهرهای مونترال و تورنتو',
      amount: 'حدود 13 تا 15 هزار دلار کانادا',
    },
    {
      id: 'italy',
      title: 'کارشناسی شیمی ایتالیا',
      img: italy,
      cities: 'شهرهای تورین و سیِ‌نا',
      amount: 'حدود 4 تا 6 هزار یورو',
    },
  ];
  const router = useRouter();
  return (
    <DashboardContent
      maxWidth={false}
      sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column' }}
      title="نقشه راه"
    >
      <Grid container gap={2}>
        {data?.map((item) => (
          <Grid size={{ xs: 12, md: 6, xl: 4 }}>
            <Card sx={{ border: 1.4, boxShadow: 0.2, borderColor: grey[300] }}>
              <CardContent sx={{ p: 2 }}>
                <Stack spacing={2}>
                  <Image
                    src={item?.img}
                    alt="canada"
                    width={100}
                    height={60}
                    style={{ borderRadius: 7 }}
                  />
                  <Typography fontSize={16} fontWeight="bold">
                    {item?.title}
                  </Typography>
                  <Typography fontSize={12} color="grey">
                    {item?.cities}
                  </Typography>
                  <Typography
                    fontSize={12}
                    fontWeight="bold"
                    color={theme.vars.palette.primary.main}
                  >
                    <IconText icon="money" label={item?.amount} />
                  </Typography>
                  <Divider sx={{ border: 1, borderStyle: 'dashed', color: grey[400] }} />
                  <Grid container spacing={2}>
                    <Grid size={6}>
                      <IconText
                        iconifySx={{ color: 'grey' }}
                        typographyProps={{ color: 'grey' }}
                        icon="timer"
                        label="3 ساله"
                      />
                    </Grid>
                    <Grid size={6}>
                      <IconText
                        iconifySx={{ color: 'grey' }}
                        typographyProps={{ color: 'grey' }}
                        icon="bell"
                        label="ددلاین تا آخر اسفند"
                      />
                    </Grid>
                    <Grid size={6}>
                      <IconText
                        iconifySx={{ color: 'grey' }}
                        typographyProps={{ color: 'grey' }}
                        icon="routeStart"
                        label="شروع دوره مهر 1404"
                      />
                    </Grid>
                    <Grid size={6}>
                      <IconText
                        iconifySx={{ color: 'grey', width: 25, height: 25 }}
                        typographyProps={{ color: 'grey' }}
                        icon="userInfo"
                        label="پاسپورت بعد از 5 سال"
                      />
                    </Grid>
                  </Grid>
                </Stack>
              </CardContent>
              <CardActions sx={{ flexDirection: 'row-reverse' }}>
                <Button
                  onClick={() => router.push(paths.dashboard.roadMap.countryRoadMap(item?.id))}
                  variant="contained"
                  color="primary"
                  startIcon={<Iconify icon="check" />}
                >
                  انتخاب و نمایش نقشه راه
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </DashboardContent>
  );
};
export default RoadMapView;
