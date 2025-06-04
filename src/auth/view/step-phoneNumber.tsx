'use client';

import {toast} from 'sonner';
import {z as zod} from 'zod';
import {useForm} from 'react-hook-form';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import {useEffect, useRef, useState} from 'react';
import {useMutation} from '@tanstack/react-query';
import {zodResolver} from '@hookform/resolvers/zod';

import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';

import {Form, Field} from 'src/components/hook-form';

import {GetRequest} from '../../lib/axios';
import StepRegister from "./step-register";
import StepOtpSignIn from "./step-otp-sign-in";
import {endpoints} from '../../hooks/endPoints';
import {useURLSearchParams} from "../../hooks/use-search-params";

import type {IApiCheckUser} from '../../types/auth';
import log from "eslint-plugin-react/lib/util/log";

export interface PhoneNumberSchemaType {
  mobileNumber: string;
  instaId?:string|number;
}

export const MobileNumberSchema = zod.object({
  mobileNumber: zod
    .string()
    .regex(/^09\d{9}$/, {message: 'شماره موبایل معتبر نیست'})
    .min(11, {message: 'شماره موبایل باید 11 رقم باشد'})
    .max(11, {message: 'شماره موبایل باید 11 رقم باشد'}),
});

const PhoneNumberStep = () => {
  const methods = useForm<PhoneNumberSchemaType>({
    resolver: zodResolver(MobileNumberSchema),
    defaultValues: {
      mobileNumber: '',
    },
  });

  const {handleSubmit} = methods;
  const [signUpStatus, setSignUpStatus] = useState(false);
  const [otpStatus, setOtpStatus] = useState(false);
  const {getParam} = useURLSearchParams();

  const {mutateAsync, isPending} = useMutation({
    mutationKey: ['check-user-signup-status'],
    mutationFn: (payload: PhoneNumberSchemaType) =>
      GetRequest<IApiCheckUser>(
        endpoints.AUTH.CHECK_USER_SIGNUP_STATUS,undefined,payload
      ),
  });

  const CheckUser = async (data: PhoneNumberSchemaType) => {
    const instaId = getParam("instaId");
    try {
      const response = await mutateAsync({...data, ...(instaId && { instaId:instaId })});
      sessionStorage.setItem("mobileNumber", data?.mobileNumber);
      if(getParam("instaId")) {
        sessionStorage.setItem("instaId", String(instaId));
      }
      if (response?.exists) {
        setOtpStatus(true);
      } else {
        setSignUpStatus(true);
      }
    } catch (e:any) {
      toast.error(e?.message||"مشکلی بوجود آمده");
    }
  };

  const HandleSubmit = handleSubmit(async (data) => {
     await CheckUser(data);
  });

  useEffect(() => {
    const mobileNumber = getParam("mobileNumber");
    if (mobileNumber) {
      methods.setValue("mobileNumber", mobileNumber);
      HandleSubmit();
    }
  }, []);

  return (
    <>
      {signUpStatus ? (
        <StepRegister onClose={() => { setSignUpStatus(false); setOtpStatus(false); }}/>
      ) : otpStatus ? (
        <StepOtpSignIn onClose={() => { setSignUpStatus(false); setOtpStatus(false); }}/>
      ) : (
        <Form methods={methods} onSubmit={HandleSubmit}>
          <Stack spacing={2}>
            <Field.Text
              maxLength={11}
              label="شماره موبایل"
              isMobileNumber
              name="mobileNumber"
              placeholder='**** *** **09'
            />

            <LoadingButton
              fullWidth
              color="primary"
              size="large"
              type="submit"
              variant="contained"
              loading={isPending}
            >
              ادامه
            </LoadingButton>
          </Stack>
        </Form>
      )}
    </>
  );
};

export default PhoneNumberStep;
