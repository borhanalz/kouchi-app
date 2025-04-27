'use client';

import React, {useState} from 'react';

import Tab from '@mui/material/Tab';
import Stack from '@mui/material/Stack';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomTabs } from 'src/components/custom-tabs';
import {usePathname, useRouter} from "next/navigation";

//-----------------------------------------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function TabLayout({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const handleTabChange = (_: unknown, value: string) => {
    if (pathname?.split('/')[3] !== value) {
      router.push(`/dashboard/profile/${value}`);
    }
  };


  return (
    <DashboardContent maxWidth="xl">
      <Stack spacing={2} sx={{ my: 2 }}>
        <CustomTabs
          value={pathname?.split('/')[3]}
          variant="fullWidth"
          onChange={handleTabChange}
          color='primary'
          textColor='primary'
        >
          <Tab color='primary' value='edit-profile' label="پروفایل" />
          <Tab color='primary' value='financial-records' label="سوابق مالی" />
        </CustomTabs>
        {children}
      </Stack>
    </DashboardContent>
  );
}
