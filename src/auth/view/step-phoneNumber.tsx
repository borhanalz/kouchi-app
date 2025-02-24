'use client'

import "src/lib/slide-captcha/slide-captcha";

import {toast} from "sonner";
import {useForm} from "react-hook-form";
import {useBoolean} from "minimal-shared/hooks";
import {useEffect, useRef, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";

import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import {DialogContent} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import {paths} from "src/routes/paths";

import {Form, Field} from "src/components/hook-form";

import {useURLSearchParams} from "../../hooks/use-search-params";

// --------------------------------------------------------------
type FormData = {
  mobileNumber: string;
};
// --------------------------------------------------------------
const PhoneNumberStep = () => {
  const methods = useForm<FormData>();
  const {handleSubmit} = methods;
  const router = useRouter();
  const dialog = useBoolean();
  const [phoneNumberVal, setPhoneNumberVal] = useState<string>("");

  const HandleSubmit = handleSubmit((data) => {
    setPhoneNumberVal(data?.mobileNumber)
    dialog.onTrue();
  });

  const ref = useRef<HTMLDivElement | null>(null);
  const captcha = useRef<any>(null);
  const [keyRender, resetKeyRender] = useState<number>(0);

  useEffect(() => {
    if (!dialog.value) return; // Initialize ONLY when modal opens

    setTimeout(() => {
      if (ref.current && !captcha.current) {
        captcha.current = window.sliderCaptcha({
          element: ref.current,
          loadingText: 'لطفا صبر کنید',
          failedText: 'مجدد تلاش کنید',
          barText: 'پازل را سر جایس بگذارید',
          repeatIcon: 'fa fa-redo',
          onSuccess() {
            toast.success('چالش با موفقیت انجام شد');
            dialog.onFalse();
            router.push(`${paths.auth.password}?mobileNumber=${encodeURIComponent(phoneNumberVal)}`);
          },
        });
      }
    }, 300); // Small delay for modal rendering
  }, [dialog.value]); // Runs only when modal state changes

  return (
    <>
      <Form methods={methods} onSubmit={HandleSubmit}>
        <Stack spacing={2} mt={5}>
          <Field.Text label="شماره موبایل" name="mobileNumber"/>
          <LoadingButton
            fullWidth
            color="inherit"
            size="large"
            type="submit"
            variant="contained"
          >
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
