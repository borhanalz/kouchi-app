'use client';

import {toast} from 'sonner';
import {z as zod} from 'zod';
import {useForm} from 'react-hook-form';
import {useEffect, useState} from 'react';
import {useBoolean} from 'minimal-shared/hooks';
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
import PhoneNumberField from "../../components/phone-number-input";
import {isValidPhoneNumber} from "react-phone-number-input";

// --------------------------------------------------------------
export interface PhoneNumberSchemaType {
  mobileNumber: string
}

export const MobileNumberSchema = zod.object({
  mobileNumber: zod
    .string()
    .regex(/^09\d{9}$/, {message: 'شماره موبایل معتبر نیست'})
    .min(11, {message: 'شماره موبایل باید 11 رقم باشد'})
    .max(11, {message: 'شماره موبایل باید 11 رقم باشد'}),
});
// --------------------------------------------------------------
const PhoneNumberStep = () => {
  const methods = useForm<PhoneNumberSchemaType>({
    resolver: zodResolver(MobileNumberSchema),
    defaultValues: {
      mobileNumber: '',
    },
  });
  const {handleSubmit} = methods;
  const dialog = useBoolean();
  const [signUpStatus, setSignUpStatus] = useState(false);
  const [otpStatus, setOtpStatus] = useState(false);
  const {getParam} = useURLSearchParams();

  // const ref = useRef<HTMLDivElement | null>(null);
  // const captcha = useRef<any>(null);
  // const [keyRender, resetKeyRender] = useState<number>(0);

  const {mutateAsync, isPending} = useMutation({
    mutationKey: ['check-user-signup-status'],
    mutationFn: (payload: PhoneNumberSchemaType) => GetRequest<IApiCheckUser>(endpoints.AUTH.CHECK_USER_SIGNUP_STATUS(payload?.mobileNumber as string)),
  });

  const CheckUser = async (data: PhoneNumberSchemaType) => {
    const mobileNumberCorrectFormat=data?.mobileNumber?.replace(/^(\+98)/, "0")
    try {
      const response = await mutateAsync({mobileNumber:mobileNumberCorrectFormat});
      sessionStorage.setItem("mobileNumber", mobileNumberCorrectFormat);
      if (response?.exists) {
        setOtpStatus(true);
      } else {
        setSignUpStatus(true);
      }
    } catch (error: any) {
      console.log(error)
      toast.error(error?.message);
    }
  }

  const HandleSubmit = handleSubmit(async (data) => {
    await CheckUser(data);
  });

  useEffect(() => {
    if (getParam("name") !== '') {
      CheckUser({mobileNumber: getParam("mobileNumber")})
    }
  }, []);

  // useEffect(() => {
  //   if (!dialog.value) return;
  //
  //   setTimeout(() => {
  //     if (ref.current && !captcha.current) {
  //       captcha.current = window.sliderCaptcha({
  //         element: ref.current,
  //         loadingText: 'لطفا صبر کنید',
  //         failedText: 'مجدد تلاش کنید',
  //         barText: 'پازل را سر جایس بگذارید',
  //         repeatIcon: 'fa fa-redo',
  //         onSuccess: async () => {
  //           toast.success('چالش با موفقیت انجام شد');
  //           dialog.onFalse();
  //           try {
  //             const response = await mutateAsync({ mobileNumber: mobileNumberVal });
  //             if (response?.hasPassword) {
  //               sessionStorage.setItem("mobileNumber",mobileNumberVal)
  //               router.push(paths.auth.password);
  //             } else {
  //               router.push(paths.auth.signUp);
  //             }
  //           } catch (error) {
  //             console.log(error);
  //           }
  //         },
  //       });
  //     }
  //   }, 300);
  // }, [dialog.value]);

  return (
    <>
      {signUpStatus ? <StepRegister onClose={() => {
        setSignUpStatus(false);
        setOtpStatus(false);
      }}/> : otpStatus ? <StepOtpSignIn onClose={() => {
          setSignUpStatus(false);
          setOtpStatus(false);
        }}/> :
        <Form methods={methods} onSubmit={HandleSubmit}>
          <Stack spacing={2}>
            <Field.Text maxLength={11} label="شماره موبایل" name="mobileNumber" placeholder='**** *** **09'/>
            <LoadingButton fullWidth color="primary" size="large" type="submit" variant="contained" loading={isPending}>
              ادامه
            </LoadingButton>
          </Stack>
        </Form>}
      {/*<Dialog open={dialog.value}>*/}
      {/*  <DialogContent sx={{p: 3}}>*/}
      {/*    <div key={keyRender} ref={ref}/>*/}
      {/*  </DialogContent>*/}
      {/*</Dialog>*/}
    </>
  );
};

export default PhoneNumberStep;
