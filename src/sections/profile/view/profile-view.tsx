'use client';

import Stack from "@mui/material/Stack";
import {useTheme} from "@mui/material/styles";

import {DashboardContent} from 'src/layouts/dashboard';
import Typography from "@mui/material/Typography";
import {useAppSelector} from "../../../lib/redux/hooks";
import {AccountButton} from "../../../layouts/components/account-button";
import {CustomTabs} from "../../../components/custom-tabs";
import Tab from "@mui/material/Tab";
// -----------------------------------------------------------------------------------------------------
function TitleValue ({title,value}:{title:string,value:string}) {
 return <Stack direction='row' spacing={2} justifyContent='space-between'>
    <Typography>{title} : </Typography>
    <Typography color='grey'>{value||'--'}</Typography>
  </Stack>
}
const ProfileView = () => {
  const theme = useTheme();
  const selectUserData = useAppSelector(state=>state.userReducer.info);
  return (
    <DashboardContent
      maxWidth={false}
      sx={{display: 'flex', flex: '1 1 auto', flexDirection: 'column'}}
      title="پروفایل"
    >
    <Stack sx={{boxShadow:0.5,border:0.5,borderColor:theme.vars.palette.grey[300],borderRadius:2,p:3}}>
      <CustomTabs value={1} variant='fullWidth'>
        <Tab value={1} label='اطلاعات کاربری'/>
        <Tab value={2} label='ویرایش پروفایل'/>
        <Tab value={3} label='سوابق مالی'/>
      </CustomTabs>
      <Stack justifyContent='center' mt={5} alignItems='center' spacing={5}>
        <AccountButton
          displayName={selectUserData?.name as string}
        />
        <Stack spacing={2}>
          <TitleValue title='نام' value={selectUserData?.name as string}/>

          <TitleValue title='شماره همراه' value={selectUserData?.mobileNumber as string}/>
          <TitleValue title='ایمیل' value={selectUserData?.email as string}/>
        </Stack>
      </Stack>
    </Stack>
    </DashboardContent>
  );
};
export default ProfileView;
