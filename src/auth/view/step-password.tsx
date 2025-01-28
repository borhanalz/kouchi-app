'use client'

import {z as zod} from "zod";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {useRouter} from "next/navigation";
import {useBoolean} from "minimal-shared/hooks";
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
import {Iconify} from "../../components/iconify";
import {signInWithPassword} from "../context/jwt";
import {Form, Field} from "../../components/hook-form";
import {FormReturnLink} from "../components/form-return-link";

// ---------------------------------------------------------------------------

export type SignInSchemaType = zod.infer<typeof SignInSchema>;

export const SignInSchema = zod.object({
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  password: zod
    .string()
    .min(1, { message: 'Password is required!' })
    .min(6, { message: 'Password must be at least 6 characters!' }),
});
// ---------------------------------------------------------------------------
const PasswordStep = () => {
  const showPassword = useBoolean();
  const { checkUserSession } = useAuthContext();
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const defaultValues: SignInSchemaType = {
    email: 'demo@minimals.cc',
    password: '@demo1',
  };

  const methods = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
    defaultValues,
  });

  const {handleSubmit, formState: { isSubmitting },} = methods;

  const HandleSubmit = handleSubmit(async(data) => {
    try {
      await signInWithPassword({ email: data.email, password: data.password });
      await checkUserSession?.();

      router.refresh();
    } catch (error) {
      console.error(error);
      const feedbackMessage = getErrorMessage(error);
      setErrorMessage(feedbackMessage);
    }  });

  return (
    <Form methods={methods} onSubmit={HandleSubmit}>
      <Stack spacing={2} mt={5}>
        <Field.Text label="شماره موبایل" name="phoneNumber"/>
        <Field.Text label='رمز عبور' name='phoneNumber'
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
          <Box sx={{p:1,fontSize:10,border:1,borderRadius:2,cursor:'pointer'}} onClick={()=>router.push(paths.auth.newjwt.otpSignIn)}>ورود با کد یکبار مصرف</Box>
          <Box sx={{p:1,fontSize:10,border:1,borderRadius:2,cursor:'pointer'}} onClick={()=>router.push(paths.auth.newjwt.resetPassword)}>بازیابی رمز عبور</Box>
        </Stack>
        <LoadingButton
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          ورود
        </LoadingButton>
        <FormReturnLink href={paths.auth.newjwt.signIn}/>
      </Stack>
    </Form>
  );
};

export default PasswordStep;
