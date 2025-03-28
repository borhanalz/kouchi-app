'use client';

import {toast} from 'sonner';
import {z as zod} from 'zod';
import {useForm} from 'react-hook-form';
import {useRouter} from 'next/navigation';
import {useBoolean} from 'minimal-shared/hooks';
import {useEffect, useRef, useState} from 'react';
import {useMutation} from '@tanstack/react-query';
import {zodResolver} from '@hookform/resolvers/zod';

import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import {DialogContent} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import {paths} from 'src/routes/paths';

import {Form, Field} from 'src/components/hook-form';

import {GetRequest} from '../../lib/axios';
import {endpoints} from '../../hooks/endPoints';

import type {IApiCheckUser} from '../../types/auth';

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
  const router = useRouter();
  const dialog = useBoolean();
  // const [mobileNumberVal, setMobileNumberVal] = useState<string>('');

  const ref = useRef<HTMLDivElement | null>(null);
  const captcha = useRef<any>(null);
  const [keyRender, resetKeyRender] = useState<number>(0);

  const {mutateAsync, isPending} = useMutation({
    mutationKey: ['check-user-signup-status'],
    mutationFn: (payload: PhoneNumberSchemaType) => GetRequest<IApiCheckUser>(endpoints.AUTH.CHECK_USER_SIGNUP_STATUS(payload?.mobileNumber as string)),
  });

  const HandleSubmit = handleSubmit(async (data) => {
    // setMobileNumberVal(data?.mobileNumber);
    // dialog.onTrue();
    try {
      const response = await mutateAsync({mobileNumber: data?.mobileNumber});
      if (response?.hasPassword) {
        sessionStorage.setItem("mobileNumber", data?.mobileNumber)
        router.push(paths.auth.password);
      } else {
        router.push(paths.auth.signUp);
      }
    } catch (error) {
      console.log(error);
    }
  });

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
      <Form methods={methods} onSubmit={HandleSubmit}>
        <Stack spacing={2}>
          <Field.Text label="شماره موبایل" name="mobileNumber"/>
          <LoadingButton fullWidth color="primary" size="large" type="submit" variant="contained" loading={isPending}>
            ادامه
          </LoadingButton>
        </Stack>
      </Form>
      <Dialog open={dialog.value}>
        <DialogContent sx={{p: 3}}>
          <div key={keyRender} ref={ref}/>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PhoneNumberStep;
