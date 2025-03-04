'use client';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';

import { useAuthContext } from '../hooks';
import { paths } from '../../routes/paths';
import { setSession } from '../context/jwt';
import { endpoints } from '../../hooks/endPoints';
import { EditCreateRequest } from '../../lib/axios';
import { Form, Field } from '../../components/hook-form';
import OtpTimer from '../../components/hook-form/otp-timer';
import { FormReturnLink } from '../components/form-return-link';
import {useURLSearchParams} from "../../hooks/use-search-params";

import type {IApiSendOtp, IApiOtpLogin, ISendOtpFormData} from '../../types/auth';

// ------------------------------------------------------------------------------------------
interface IOtpLoginFormData {
  mobileNumber: string;
  otp: string;
}

export const OtpLoginSchema = zod.object({
  otp: zod.string().min(6, { message: 'کد ارسالی به شماره همراه خود را وارد کنید' }),
});
// ----------------------------------------------------------------------------------------------
const OtpSignInStep = () => {
  const { checkUserSession } = useAuthContext();
  const {getParam} = useURLSearchParams();

  const methods = useForm<IOtpLoginFormData>({
    resolver: zodResolver(OtpLoginSchema),
    defaultValues: {
      mobileNumber: getParam("mobileNumber"),
      otp: '',
    },
  });
  const { handleSubmit } = methods;

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['otp-login'],
    mutationFn: (payload: IOtpLoginFormData) =>
      EditCreateRequest<IOtpLoginFormData, IApiOtpLogin>(endpoints.AUTH.VERIFY_OTP, payload),
  });

  const { mutateAsync: sendOtp } = useMutation({
    mutationKey: ['resent-otp-reset-password'],
    mutationFn: () =>
      EditCreateRequest<ISendOtpFormData, IApiSendOtp>(endpoints.AUTH.SEND_OTP, {mobileNumber:getParam("mobileNumber"),otpType:'login'}),
  });

  const HandleSubmit = handleSubmit(async (data) => {
    const response = await mutateAsync({...data,mobileNumber:getParam('mobileNumber') });
    setSession(response?.token);
    await checkUserSession?.();
  });

  const handleTimeReset = async() => {
    try{
       await sendOtp();
    }catch (e){
      console.log(e)
    }
  };

  return (
    <Form methods={methods} onSubmit={HandleSubmit}>
      <Stack spacing={2} mt={5}>
        <OtpTimer time={120} onReset={handleTimeReset} />
        <Field.Code name="otp" />
        <LoadingButton
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isPending}
        >
          ورود
        </LoadingButton>
        <FormReturnLink href={paths.auth.password} />
      </Stack>
    </Form>
  );
};

export default OtpSignInStep;
