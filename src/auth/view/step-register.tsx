'use client';

import {toast} from "sonner";
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import {useMutation} from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';

import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';

import { Form, Field } from 'src/components/hook-form';
import OtpTimer from 'src/components/hook-form/otp-timer';

import { useAuthContext } from '../hooks';
import {type IApiCheckUser, IApiLogin} from "../../types/auth";
import { setSession } from '../context/jwt';
import { endpoints } from '../../hooks/endPoints';
import {EditCreateRequest, GetRequest} from '../../lib/axios';
import {FormReturnLink} from "../components/form-return-link";
import {useURLSearchParams} from "../../hooks/use-search-params";
// -----------------------------------------------------------------
interface IRegisterFormData {
  mobileNumber: string;
  otp: string;
  name: string;
  instaId?:string|number;
}

export const SignUpSchema = zod.object({
  name: zod.string().min(1, { message: 'لطفا نام را وارد کنید' }),
  mobileNumber: zod
    .string()
    .regex(/^09\d{9}$/, { message: 'شماره موبایل معتبر نیست' })
    .min(11, { message: 'شماره موبایل باید 11 رقم باشد' })
    .max(11, { message: 'شماره موبایل باید 11 رقم باشد' }),
  otp: zod.string().min(6, { message: 'کد ارسالی را بدرستی وارد کنید' }),
});
// ------------------------------------------------------------------
const RegisterStep = ({onClose}:{onClose?:()=>void}) => {
  const { checkUserSession } = useAuthContext();
  const {getParam}=useURLSearchParams();
  const mobileNumber=getParam("mobileNumber")===''?sessionStorage?.getItem("mobileNumber"):getParam("mobileNumber");


  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['sign-up'],
    mutationFn: (payload: IRegisterFormData) => EditCreateRequest<IRegisterFormData,IApiLogin>(endpoints.AUTH.REGISTER, {
      ...payload,
      ...(sessionStorage.getItem("instaId") && { instaId: sessionStorage.getItem("instaId") as string })
    }),
  });

  const methods = useForm<IRegisterFormData>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: getParam("name")!==''?getParam("name"):'',
      mobileNumber: mobileNumber as string,
      otp: '',
    },
  });
  const { handleSubmit } = methods;

  const handleTimeOut = () => {};

  const HandleSubmit = handleSubmit(async (data: IRegisterFormData) => {
    try {
      const response = await mutateAsync(data);
      setSession(response?.data?.token);
      await checkUserSession?.();
    } catch (error:any) {
      toast.error(error.message);
    }
  });
  const {mutateAsync:ResendOtp, isPending:resendOtpPending} = useMutation({
    mutationKey: ['resend-check-user-signup-status'],
    mutationFn: () =>
      GetRequest<IApiCheckUser>(
        endpoints.AUTH.CHECK_USER_SIGNUP_STATUS,undefined,{mobileNumber}
      ),
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
        <Field.Text disabled label="شماره موبایل" name="mobileNumber" />
        <Field.Text label="نام" name="name" />
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
