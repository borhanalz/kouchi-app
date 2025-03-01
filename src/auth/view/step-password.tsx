'use client'

import {z as zod} from "zod";
import {toast} from "sonner";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {useRouter} from "next/navigation";
import {useBoolean} from "minimal-shared/hooks";
import { useMutation} from "@tanstack/react-query";
import {zodResolver} from "@hookform/resolvers/zod";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import InputAdornment from "@mui/material/InputAdornment";

import {useAuthContext} from "../hooks";
import {paths} from "../../routes/paths";
import {getErrorMessage} from "../utils";
import {endpoints} from "../../hooks/endPoints";
import {Iconify} from "../../components/iconify";
import {signInWithPassword} from "../context/jwt";
import { EditCreateRequest} from "../../lib/axios";
import {Form, Field} from "../../components/hook-form";
import {FormReturnLink} from "../components/form-return-link";
import {useURLSearchParams} from "../../hooks/use-search-params";

// ---------------------------------------------------------------------------

export type SignInSchemaType = zod.infer<typeof SignInSchema>;

export const SignInSchema = zod.object({
  password: zod
    .string()
    .min(6, {message: 'رمزعبور حداقل باید 6 کاراکتر باشد'})
});
// ---------------------------------------------------------------------------
interface ISendOtpFormData {
  mobileNumber:string,
  otpType:"reset"|"otp"
}
const PasswordStep = () => {
  const showPassword = useBoolean();
  const {checkUserSession} = useAuthContext();
  const router = useRouter();
  const {getParam} = useURLSearchParams();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {mutateAsync:sendOtp,isPending:sendOtpPending}=useMutation({mutationKey:['send-otp-reset-password'],mutationFn:(data:ISendOtpFormData)=>EditCreateRequest(endpoints.AUTH.SEND_OTP,data)});

  const defaultValues: SignInSchemaType = {
    password: '',
  };

  const methods = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
    defaultValues,
  });

  const {handleSubmit, formState: {isSubmitting},} = methods;

  const HandleSubmit = handleSubmit(async (data) => {
    try {
      await signInWithPassword({mobileNumber: getParam("mobileNumber"), password: data.password});
      await checkUserSession?.();
      router.refresh();
    } catch (error) {
      console.error(error);
      const feedbackMessage = getErrorMessage(error);
      setErrorMessage(feedbackMessage);
    }
  });

  const HandleSendOtp = async(type:string)=>{
  try {
    const response = await sendOtp({mobileNumber:getParam("mobileNumber"),otpType:"reset"});
    console.log(response);
    router.push(`${paths.auth.resetPassword}?mobileNumber=${encodeURIComponent(getParam("mobileNumber"))}`);
  }catch (e:any) {
    toast.error(e?.message);
  }
  }

  return (
    <Form methods={methods} onSubmit={HandleSubmit}>
      <Stack spacing={2} mt={5}>
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
        <Typography>رمز عبور خود را فراموش کردید؟</Typography>
        <Stack direction='row' justifyContent='space-between'>
          <Box sx={{p: 1, fontSize: 10, border: 1, borderRadius: 2, cursor: 'pointer'}}
               onClick={()=>HandleSendOtp("otp")}>ورود با کد یکبار مصرف</Box>
          <Box sx={{p: 1, fontSize: 10, border: 1, borderRadius: 2, cursor: 'pointer'}} onClick={()=>HandleSendOtp("reset")}>بازیابی رمز عبور</Box>
        </Stack>
        <LoadingButton
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting||sendOtpPending}
        >
          ورود
        </LoadingButton>
        <FormReturnLink href={paths.auth.signIn}/>
      </Stack>
    </Form>
  );
};

export default PasswordStep;
