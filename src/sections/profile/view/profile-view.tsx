'use client';

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";

import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid2"; // new Grid component
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import { DashboardContent } from "src/layouts/dashboard";
import { useAppSelector } from "../../../lib/redux/hooks";
import { Form, Field } from "../../../components/hook-form";
import { CustomTabs } from "../../../components/custom-tabs";
import { AccountButton } from "../../../layouts/components/account-button";
import ProfileEditInfo from "../profile-edit-info";

// Define the shape of your form values
interface FormValues {
  age: string;
  gender: string;
  married: string;
  graduations: {
    university: string;
    degree: string;
    field: string;
    GPA: string;
    graduated: boolean;
  }[];
  languages: {
    language: string;
    proficiency: string;
  }[];
}

function TitleValue({ title, value }: { title: string; value: string }) {
  return (
    <Stack direction="row" spacing={2} justifyContent="space-between">
      <Typography>{title} : </Typography>
      <Typography color="grey">{value || "--"}</Typography>
    </Stack>
  );
}

const ProfileView = () => {
  const theme = useTheme();
  const selectUserData = useAppSelector((state) => state.userReducer.info);
  const [tabVal, setTabVal] = useState(1);

  return (
    <DashboardContent
      maxWidth={false}
      sx={{
        display: "flex",
        flex: "1 1 auto",
        flexDirection: "column"
      }}
      title="پروفایل"
    >
      <Stack
        sx={{
          bosizehadow: 0.5,
          border: 0.5,
          borderColor: theme.vars.palette.grey[300],
          borderRadius: 2,
          p: 3
        }}
      >
        <CustomTabs
          value={tabVal}
          variant="fullWidth"
          onChange={(_, n) => setTabVal(n)}
          color='primary'
          textColor='primary'
        >
          <Tab color='primary' value={1} label="اطلاعات کاربری" />
          <Tab color='primary' value={2} label="ویرایش پروفایل" />
          <Tab color='primary' value={3} label="سوابق مالی" />
        </CustomTabs>
        {tabVal === 1 && (
          <Stack justifyContent="center" mt={5} alignItems="center" spacing={5}>
            <AccountButton
              width={80}
              height={80}
              displayName={selectUserData?.name as string}
              size="large"
            />
            <Stack spacing={2}>
              <TitleValue title="نام" value={selectUserData?.name as string} />
              <TitleValue
                title="شماره همراه"
                value={selectUserData?.mobileNumber as string}
              />
              <TitleValue
                title="ایمیل"
                value={selectUserData?.email as string}
              />
            </Stack>
          </Stack>
        )}
        {tabVal === 2 && (
          <ProfileEditInfo/>
        )}
      </Stack>
    </DashboardContent>
  );
};

export default ProfileView;
