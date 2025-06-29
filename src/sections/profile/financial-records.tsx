'use client'

import {format} from "date-fns-jalali";
import {useQuery} from "@tanstack/react-query";

import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import {useTheme} from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import {GetRequest} from "../../lib/axios";
import {endpoints} from "../../hooks/endPoints";
import {Iconify} from "../../components/iconify";
import {toPersianNumber} from "../../utils/persian-number";
import {EmptyContent} from "../../components/empty-content";
import RectangleSkeleton from "../../components/Skeleton/rectangle-skeleton";

import type {IApiUserDetails} from "../../types/user";
import {useAppSelector} from "../../lib/redux/hooks";
// ----------------------------------------------------------------------------
const FinancialRecords = () => {
  const theme = useTheme();

  const userDetails = useAppSelector(state=>state?.userReducer.details);
  return <>
    <Stack mt={2} spacing={2}>
    {!userDetails?.payments?.length?<EmptyContent sx={{mt:10}} title='سوابق مالی برای شما یافت نشد'/>:userDetails?.payments?.map((payment) => <Stack
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
            {payment?.createdAt && toPersianNumber(format(payment?.createdAt, 'yyyy-MM-dd'))}
          </Typography>
        </Stack>
        <Divider orientation="vertical" flexItem />
        <Typography variant='subtitle1' fontWeight={800}>
          {toPersianNumber(payment?.amount?.toLocaleString())} <span style={{fontSize:'13px',color:theme?.palette?.grey[500]}}>تومان</span>
        </Typography>
      </Stack>
      </Stack>)}
  </Stack>
  </>
}
export default FinancialRecords;
