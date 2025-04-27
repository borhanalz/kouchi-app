'use client'

import {format} from "date-fns-jalali";
import {useQuery} from "@tanstack/react-query";

import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import {useTheme} from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import {GetRequest} from "../../lib/axios";
import {endpoints} from "../../hooks/endPoints";
import RectangleSkeleton from "../../components/Skeleton/rectangle-skeleton";

import type {IApiUserDetails} from "../../types/user";
import Divider from "@mui/material/Divider";
import {EmptyContent} from "../../components/empty-content";
import {Iconify} from "../../components/iconify";
// ----------------------------------------------------------------------------
const FinancialRecords = () => {
  const theme = useTheme();

  const {data: userDetails, isPending: userDetailsPending} = useQuery({
    queryKey: ["get-user-info-detail"],
    queryFn: () =>
      GetRequest<IApiUserDetails>(endpoints.PROFILE.DETAIL_INFO),
  });
  console.log(userDetails)
  return <>
    {userDetailsPending&&<RectangleSkeleton/>}
    {!userDetails?.details?.payments&&<EmptyContent title='سوابق مالی برای شما یافت نشد'/>}
    <Stack mt={2} spacing={2}>
    {userDetails?.details?.payments?.map((payment) => <Stack
                    sx={{border: 1, borderRadius: 2, p: 2, borderColor: theme?.palette?.grey[theme?.palette?.mode==="dark"?800:200]}}>
        <Stack direction='row' justifyContent='space-between' alignItems='center'>
          <Stack direction='row' spacing={1} alignItems='center'>
            <Iconify icon={payment?.serviceType} sx={{color:theme?.palette?.grey[400],width:20}}/>
            <Typography fontWeight={800}>{payment?.title}</Typography>
          </Stack>
          <Alert severity='success' sx={{p:0,px:3,py:0.5,fontSize:15}} icon={false}>{payment?.status}</Alert>
        </Stack>
      <Typography mt={2} variant='subtitle1' color={theme?.palette?.grey[500]}>{payment?.subTitle}</Typography>
      <Stack my={2}>
        <Divider/>
      </Stack>
      <Stack direction="row" spacing={2} alignItems="center">
        <Stack direction='row' spacing={1} alignItems='center'>
          <Typography variant='subtitle1' color={theme?.palette?.grey[500]}>تاریخ ثبت : </Typography>
          <Typography variant='subtitle1' fontWeight={800}>
            {payment?.createdAt && format(payment?.createdAt, 'yyyy-MM-dd')}
          </Typography>
        </Stack>
        <Divider orientation="vertical" flexItem />
        <Typography variant='subtitle1' fontWeight={800}>
          {payment?.amount?.toLocaleString()} <span style={{fontSize:'13px',color:theme?.palette?.grey[500]}}>تومان</span>
        </Typography>
      </Stack>
      </Stack>)}
  </Stack>
  </>
}
export default FinancialRecords;
