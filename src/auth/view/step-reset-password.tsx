'use client'

import {useForm} from "react-hook-form";
import {useRouter} from "next/navigation";
import {useBoolean} from "minimal-shared/hooks";

import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import LoadingButton from "@mui/lab/LoadingButton";
import InputAdornment from "@mui/material/InputAdornment";

import {paths} from "src/routes/paths";

import {Iconify} from "src/components/iconify";
import {Form, Field} from "src/components/hook-form";
import OtpTimer from "src/components/hook-form/otp-timer";

import {FormReturnLink} from "src/auth/components/form-return-link";
// ------------------------------------------------------------------
type FormData = {
  phoneNumber: string;
  otpCode:string,
  password:string,
  confirmPassword:string,
}
// -------------------------------------------------------------------
const AuthView = () => {

  const methods = useForm<FormData>();
  const {handleSubmit} = methods;
  const showPassword = useBoolean();
  const router = useRouter();

  const HandleSubmit = handleSubmit((data)=>{
    console.log(data);
    router.push(paths.auth.newjwt.resetPassword);
  });

  const handleTimeReset = ()=>{
    console.log('test');
  }
  const handleTimeOut=()=>{};
  return (
    <Form methods={methods} onSubmit={HandleSubmit}>
      <Stack spacing={2} mt={5}>
        <Field.Text label='شماره موبایل' name='phoneNumber'/>
        <Field.Text label='رمز عبور جدید' name='password'
                    type={showPassword.value ? 'text' : 'password'}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={showPassword.onToggle} edge="end">
                              <Iconify
                                icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                              />
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
        />
        <Field.Text label='تکرار رمز عبور جدید' name='confirmPassword'
                    type={showPassword.value ? 'text' : 'password'}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={showPassword.onToggle} edge="end">
                              <Iconify
                                icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                              />
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
        />
        <OtpTimer time={120} onTimeOut={handleTimeOut} onReset={handleTimeReset}/>
        <Field.Code name='otpCode'/>
        <LoadingButton
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
        >
          تغییر رمز عبور
        </LoadingButton>
        <FormReturnLink href={paths.auth.newjwt.password}/>
      </Stack>
    </Form>
  );
};
export default AuthView;
