'use client';

import {toast} from "sonner";
import {z as zod} from 'zod';
import {useForm} from 'react-hook-form';
import {useMutation} from '@tanstack/react-query';
import {zodResolver} from '@hookform/resolvers/zod';

import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';

import {useAuthContext} from '../hooks';
import {setSession} from '../context/jwt';
import {endpoints} from '../../hooks/endPoints';
import {EditCreateRequest, GetRequest} from '../../lib/axios';
import {Form, Field} from '../../components/hook-form';
import OtpTimer from '../../components/hook-form/otp-timer';
import {FormReturnLink} from '../components/form-return-link';

import type {IApiCheckUser, IApiLogin, IApiSendOtp, ISendOtpFormData} from '../../types/auth';
import {PhoneNumberSchemaType} from "./step-phoneNumber";

// ------------------------------------------------------------------------------------------
interface IOtpLoginFormData {
  mobileNumber: string;
  otp: string;
}

export const OtpLoginSchema = zod.object({
  otp: zod.string().min(6, {message: 'کد ارسالی به شماره همراه خود را وارد کنید'}),
});
// ----------------------------------------------------------------------------------------------
const OtpSignInStep = ({onClose}: { onClose: () => void }) => {
  const {checkUserSession} = useAuthContext();
  const mobileNumber = sessionStorage.getItem("mobileNumber") as string

  const methods = useForm<IOtpLoginFormData>({
    resolver: zodResolver(OtpLoginSchema),
    defaultValues: {
      mobileNumber: '',
      otp: '',
    },
  });
  const {handleSubmit} = methods;

  const {mutateAsync, isPending} = useMutation({
    mutationKey: ['otp-login'],
    mutationFn: (payload: IOtpLoginFormData) =>
      EditCreateRequest<IOtpLoginFormData, IApiLogin>(endpoints.AUTH.VERIFY_OTP, payload),
  });

  const {mutateAsync:ResendOtp, isPending:resendOtpPending} = useMutation({
    mutationKey: ['resend-check-user-signup-status'],
    mutationFn: () =>
      GetRequest<IApiCheckUser>(
        endpoints.AUTH.CHECK_USER_SIGNUP_STATUS,undefined,{mobileNumber}
      ),
  });

  const HandleSubmit = handleSubmit(async (data) => {
    try {
      const response = await mutateAsync({...data, mobileNumber});
      setSession(response?.data?.token);
      await checkUserSession?.();
    } catch (e: any) {
      toast.error(e?.message);
    }
  });

  const handleTimeReset = async () => {
    try {
      await ResendOtp();
    } catch (e: any) {
      toast?.error(e?.message);
    }
  };

  return (
    <Form methods={methods} onSubmit={HandleSubmit}>
      <Stack spacing={2}>
        <OtpTimer time={120} onReset={handleTimeReset}/>
        <Field.Code name="otp"/>
        <LoadingButton
          fullWidth
          color="primary"
          size="large"
          type="submit"
          variant="contained"
          loading={isPending}
        >
          ورود
        </LoadingButton>
        <FormReturnLink onClick={onClose}/>
      </Stack>
    </Form>
  );
};

export default OtpSignInStep;
