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

export interface PhoneNumberSchemaType {
  mobileNumber: string;
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

  const [captchaToken, setCaptchaToken] = useState('');
  const captchaRef = useRef<HCaptcha>(null);

  const {mutateAsync, isPending} = useMutation({
    mutationKey: ['check-user-signup-status'],
    mutationFn: (payload: PhoneNumberSchemaType) =>
      GetRequest<IApiCheckUser>(
        endpoints.AUTH.CHECK_USER_SIGNUP_STATUS(payload?.mobileNumber)
      ),
  });

  const CheckUser = async (data: PhoneNumberSchemaType) => {
    const mobileNumberCorrectFormat = data?.mobileNumber?.replace(/^(\+98)/, "0");
    try {
      const response = await mutateAsync({ mobileNumber: mobileNumberCorrectFormat });
      sessionStorage.setItem("mobileNumber", mobileNumberCorrectFormat);
      if (response?.exists) {
        setOtpStatus(true);
      } else {
        setSignUpStatus(true);
      }
    } catch (e) {
      toast.error("مشکلی در سرور پیش آمده لطفا دقایقی دیگر امتحان کنید !");
    }
  };

  const HandleSubmit = handleSubmit(async (data) => {
    if (!captchaToken) {
      toast.error("لطفاً کپچا را کامل کنید");
      return;
    }
    await CheckUser(data);
  });

  useEffect(() => {
    if (getParam("name") !== '') {
      CheckUser({mobileNumber: getParam("mobileNumber")});
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
              name="mobileNumber"
              placeholder='**** *** **09'
            />

            <HCaptcha
              sitekey="b8c8e580-841e-4580-9ea0-23747f0e6c22"
              onVerify={(token) => setCaptchaToken(token)}
              onExpire={() => setCaptchaToken('')}
              ref={captchaRef}
              languageOverride="fa"
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
