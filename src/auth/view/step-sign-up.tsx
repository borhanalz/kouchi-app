'use client'

import {useForm} from "react-hook-form";
import {useBoolean} from "minimal-shared/hooks";

import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import LoadingButton from "@mui/lab/LoadingButton";
import InputAdornment from "@mui/material/InputAdornment";

import {Iconify} from "src/components/iconify";
import {Form, Field} from "src/components/hook-form";
import OtpTimer from "src/components/hook-form/otp-timer";
// -----------------------------------------------------------------
type FormData = {
  fullname:string,
  password:string,
  confirmPassword:string,
  phoneNumber:string,
}
// ------------------------------------------------------------------
const SignUpStep = () => {

  const methods = useForm<FormData>();
  const {handleSubmit} = methods;
  const showPassword = useBoolean();

  const handleTimeReset = ()=>{
    console.log('test');
  }
  const handleTimeOut=()=>{};

  const HandleSubmit = handleSubmit((data)=>{
    console.log(data)
  })

  return (
    <Form methods={methods} onSubmit={HandleSubmit}>
      <Stack spacing={2} mt={5}>
        <Field.Text label='شماره موبایل' name='phoneNumber'/>
        <Field.Text label='نام و نام خانوادگی' name='applicant'/>
        <Field.Text label='رمز عبور' name='password'
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
        <Field.Text label='تکرار رمز عبور' name='confirmPassword'
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
          ثبت نام و ورود
        </LoadingButton>
      </Stack>
    </Form>
  );
};
export default SignUpStep;
