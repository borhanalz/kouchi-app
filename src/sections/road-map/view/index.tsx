'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { Card, CardActions, CardContent } from '@mui/material';

import { grey } from '../../../theme';
import { paths } from '../../../routes/paths';
import {RootState} from "../../../lib/redux/store";
import { Iconify } from '../../../components/iconify';
import {useAppSelector} from "../../../lib/redux/hooks";
import { DashboardContent } from '../../../layouts/dashboard';
import {EmptyContent} from "../../../components/empty-content";

import type {IApiUserDetails} from "../../../types/user";
// ---------------------------------------------------------------------------
const RoadMapView = () => {
  const theme = useTheme();
  const router = useRouter();
  const roadsMapData = useAppSelector((state:RootState)=>state?.userReducer?.details?.activeRoadmap)
  return (
    <DashboardContent
      maxWidth={false}
      sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column' }}
      title="نقشه های راه"
    >
      {roadsMapData?.length===0?
        <Stack mt={8}><EmptyContent imgUrl='locked.png' title='درحال حاضر نقشه راه فعالی ندارید'
                                    description='برای ایجاد نقشه راه ، از منوی سرویس های کوچی قسمت سرویس نقشه راه مهاجرتی اقدام فرمایید.'/></Stack>:<Grid container gap={2}>
        {roadsMapData?.map((item: IApiUserDetails['details']['activeRoadmap'][number]) => (
          <Grid size={{ xs: 12, md: 6, xl: 4 }}>
            <Card sx={{ border: 1.4, boxShadow: 0.2,borderColor: theme.palette.mode==="dark"?theme.vars.palette.grey[800]: theme.vars.palette.grey[300],}}>
              <CardContent sx={{ p: 2 }}>
                <Stack spacing={2}>
                  <Stack direction='row' alignItems='center' spacing={2}>
                    <Image
                      src={`/assets/images/${item.template.thumbnail}.png`}
                      alt={item?.template?.thumbnail}
                      width={100}
                      height={60}
                      style={{ borderRadius: 7 }}
                    />
                    <Typography>{item?.template?.track}</Typography>
                  </Stack>
                  <Typography fontSize={16} fontWeight="bold">
                    {item?.template?.name}
                  </Typography>
                </Stack>
              </CardContent>
              <CardActions sx={{ flexDirection: 'row-reverse' }}>
                <Button
                  onClick={() => router.push(paths.dashboard.roadMap.countryRoadMap(item?.template?.thumbnail))}
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
      </Grid>}
    </DashboardContent>
  );
};
export default RoadMapView;
