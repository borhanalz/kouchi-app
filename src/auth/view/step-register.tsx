'use client';

import {toast} from "sonner";
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import {useMutation, useQuery} from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import OtpTimer from 'src/components/hook-form/otp-timer';

import {paths} from "../../routes/paths";
import { useAuthContext } from '../hooks';
import { setSession } from '../context/jwt';
import { endpoints } from '../../hooks/endPoints';
import { EditCreateRequest } from '../../lib/axios';
import {FormReturnLink} from "../components/form-return-link";
import {IApiRegister, type IApiSendOtp, ISendOtpFormData} from "../../types/auth";
import {useSearchParams} from "../../routes/hooks";
import {useURLSearchParams} from "../../hooks/use-search-params";
// -----------------------------------------------------------------
interface IRegisterFormData {
  mobileNumber: string;
  otp: string;
  password: string;
  name: string;
}

export const SignUpSchema = zod.object({
  name: zod.string().min(1, { message: 'لطفا نام را وارد کنید' }),
  mobileNumber: zod
    .string()
    .regex(/^09\d{9}$/, { message: 'شماره موبایل معتبر نیست' })
    .min(11, { message: 'شماره موبایل باید 11 رقم باشد' })
    .max(11, { message: 'شماره موبایل باید 11 رقم باشد' }),
  password: zod.string().min(6, { message: 'رمزعبور حداقل باید 6 کاراکتر باشد' }),
  otp: zod.string().min(6, { message: 'کد ارسالی را بدرستی وارد کنید' }),
});
// ------------------------------------------------------------------
const RegisterStep = ({onClose}:{onClose?:()=>void}) => {
  const showPassword = useBoolean();
  const { checkUserSession } = useAuthContext();
  const {getParam}=useURLSearchParams();
  const mobileNumber=getParam("mobileNumber")===''?sessionStorage?.getItem("mobileNumber"):getParam("mobileNumber");


  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['sign-up'],
    mutationFn: (payload: IRegisterFormData) => EditCreateRequest<IRegisterFormData,IApiRegister>(endpoints.AUTH.REGISTER, payload),
  });

  const methods = useForm<IRegisterFormData>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: getParam("name")!==''?getParam("name"):'',
      mobileNumber: mobileNumber as string,
      password: '',
      otp: '',
    },
  });
  const { handleSubmit } = methods;

  const handleTimeReset = () => {};
  const handleTimeOut = () => {};

  const HandleSubmit = handleSubmit(async (data: IRegisterFormData) => {
    try {
      const response = await mutateAsync(data);
      setSession(response?.token);
      await checkUserSession?.();
    } catch (error:any) {
      toast.error(error.message);
    }
  });

  return (
    <Form methods={methods} onSubmit={HandleSubmit}>
      <Stack spacing={2}>
        <Field.Text disabled label="شماره موبایل" name="mobileNumber" />
        <Field.Text label="نام" name="name" />
        <Field.Text
          label="رمز عبور"
          name="password"
          type={showPassword.value ? 'text' : 'password'}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={showPassword.onToggle} edge="end">
                    <Iconify
                      icon={showPassword.value ? 'eye' : 'eye-closed'}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        <OtpTimer time={120} onTimeOut={handleTimeOut} onReset={handleTimeReset} />
        <Field.Code name="otp" />
        <LoadingButton
          fullWidth
          color="primary"
          size="large"
          type="submit"
          variant="contained"
          loading={isPending}
        >
          ثبت نام و ورود
        </LoadingButton>
        <FormReturnLink onClick={onClose}/>
      </Stack>
    </Form>
  );
};
export default RegisterStep;
