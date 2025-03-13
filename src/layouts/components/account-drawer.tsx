'use client';

import type {IconButtonProps} from '@mui/material/IconButton';

import {usePopover} from 'minimal-shared/hooks';

import Stack from "@mui/material/Stack";
import Avatar from '@mui/material/Avatar';
import Divider from "@mui/material/Divider";
import MenuList from '@mui/material/MenuList';
import MenuItem from "@mui/material/MenuItem";

import {usePathname} from 'src/routes/hooks';

import {Iconify} from 'src/components/iconify';
import {AnimateBorder} from 'src/components/animate';

import {useMockedUser} from 'src/auth/hooks';

import {CustomPopover} from "../../components/custom-popover";
import Typography from "@mui/material/Typography";
import {AccountButton} from "./account-button";
import Button from "@mui/material/Button";

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
  const pathname = usePathname();
  const {open, anchorEl, onClose, onOpen} = usePopover();
  const {user} = useMockedUser();

  const renderAvatar = () => (
    <AnimateBorder
      sx={{mb: 2, p: '6px', width: 96, height: 96, borderRadius: '50%'}}
      slotProps={{
        primaryBorder: {size: 120, sx: {color: 'primary.main'}},
      }}
    >
      <Avatar src={user?.photoURL} alt={user?.displayName} sx={{width: 1, height: 1}}>
        {user?.displayName?.charAt(0).toUpperCase()}
      </Avatar>
    </AnimateBorder>
  );


  const renderMenuActions = () => (
    <CustomPopover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      slotProps={{paper: {sx: {p: 0, width: 150}}, arrow: {offset: 10,placement:'top-left'}}}
    >

      <Divider sx={{borderStyle: 'dashed'}}/>

      <MenuList sx={{p: 1, my: 1, '& li': {p: 0}}}>
       <MenuItem>
         <Typography>{data?.name}</Typography>
       </MenuItem>
        <Divider />
        <MenuItem>
          <Stack direction='row' spacing={0.5} sx={{py:1,px:0.5}}>
            <Iconify icon='profile'/>
            <Typography variant='body2'>پروفایل</Typography>
          </Stack>
        </MenuItem>
        <MenuItem>
          <Stack direction='row' spacing={0.5} sx={{py:1,px:0.5}}>
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
        // photoURL={user?.photoURL}
        displayName={data?.name as string}
      />
      {renderMenuActions()}
    </>
  );
}
