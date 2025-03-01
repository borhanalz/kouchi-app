'use client'

import {toast} from "sonner";
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

import {useURLSearchParams} from "../../hooks/use-search-params";
import {useMutation, useQuery} from "@tanstack/react-query";
import {EditCreateRequest, GetRequest} from "../../lib/axios";
import {endpoints} from "../../hooks/endPoints";
import {useEffect} from "react";
// ------------------------------------------------------------------
type formData = {
  mobileNumber: string;
  otp:string,
  newPassword:string,
}
// -------------------------------------------------------------------
const AuthView = () => {
  const showPassword = useBoolean();
  const router = useRouter();
  const {getParam}=useURLSearchParams();

  const {mutateAsync,isPending}=useMutation({mutationKey:['update-password'],mutationFn:(payload:formData)=>EditCreateRequest(endpoints.AUTH.CHANGE_PASSWORD,payload)});
  const methods = useForm<formData>({
    defaultValues:{
      mobileNumber:getParam("mobileNumber"),
      newPassword:"",
      otp:""
    }
  });

  const {handleSubmit} = methods;
  const HandleSubmit = handleSubmit(async(data)=>{
    try {
      await mutateAsync(data);
      toast.success("با موفقیت انجام شد")
      router.push(paths.auth.password);
    }catch (error){
      console.log(error)
    }
  });

  const handleTimeReset = ()=>{}
  const handleTimeOut=()=>{};
  return (
    <Form methods={methods} onSubmit={HandleSubmit}>
      <Stack spacing={2} mt={5}>
        <Field.Text label='رمز عبور جدید' name='newPassword'
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
        <Field.Code name='otp'/>
        <LoadingButton
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isPending}
        >
          تغییر رمز عبور
        </LoadingButton>
        <FormReturnLink href={paths.auth.password}/>
      </Stack>
    </Form>
  );
};
export default AuthView;
