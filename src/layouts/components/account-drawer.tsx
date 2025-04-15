'use client';


import {useRouter} from "next/navigation";
import {usePopover} from 'minimal-shared/hooks';

import Stack from "@mui/material/Stack";
import Avatar from '@mui/material/Avatar';
import Divider from "@mui/material/Divider";
import MenuList from '@mui/material/MenuList';
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

import {Iconify} from 'src/components/iconify';
import {AnimateBorder} from 'src/components/animate';

import {useMockedUser} from 'src/auth/hooks';

import {paths} from "../../routes/paths";
import {AccountButton} from "./account-button";
import {CustomPopover} from "../../components/custom-popover";
import {signOut} from "../../auth/context/jwt";
import IconText from "../../components/icon-text/icon-text";

// ----------------------------------------------------------------------
export interface IAccountDrawer {
  data: {
    "userId": string,
    "name": string,
    "mobileNumber": string,
    "lastLoginAt": null|string,
    "refreshToken": string,
    "email": string
  }|undefined|null
};

export function AccountDrawer({data}:IAccountDrawer) {
  const router = useRouter();
  const {open, anchorEl, onClose, onOpen} = usePopover();


  const renderMenuActions = () => (
    <CustomPopover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      slotProps={{paper: {sx: {p: 0, width: 150}}, arrow: {offset: 10,placement:'top-left'}}}
    >

      <Divider sx={{borderStyle: 'dashed'}}/>

      <MenuList  sx={{p: 1, my: 1, '& li': {p: 0}}}>
        <Stack p={1}>
          <IconText icon='user' label={data?.name as string} />
        </Stack>
        <Divider />
        <MenuItem onClick={()=>router.push(paths.dashboard.profile.root)}>
          <Stack direction='row' alignItems='center' spacing={0.5} sx={{py:1,px:0.5}}>
            <Iconify icon='profile'/>
            <Typography variant='body2'>پروفایل</Typography>
          </Stack>
        </MenuItem>
        <MenuItem onClick={signOut}>
          <Stack direction='row' alignItems='center' spacing={0.5} sx={{py:1,px:0.5}}>
            <Iconify icon='logout' sx={{color:'red'}}/>
            <Typography color='error' variant='body2'>خروچ</Typography>
          </Stack>
        </MenuItem>
      </MenuList>

      <Divider sx={{borderStyle: 'dashed'}}/>

    </CustomPopover>
  );

  return (
    <>
      <AccountButton
        onClick={onOpen}
        displayName={data?.name as string}
      />
      {renderMenuActions()}
    </>
  );
}
