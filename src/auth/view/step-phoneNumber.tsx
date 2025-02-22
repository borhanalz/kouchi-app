'use client'

import { useForm } from "react-hook-form";
import {useRouter} from "next/navigation";

import Stack from "@mui/material/Stack";
import LoadingButton from "@mui/lab/LoadingButton";

import {paths} from "src/routes/paths";

import { Form, Field } from "src/components/hook-form";

import SlideCaptcha from "../../components/slide-captcha/slide-captcha";
import {useEffect, useRef, useState} from "react";
import {DialogContent} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import {useBoolean} from "minimal-shared/hooks";
import "src/lib/slide-captcha/slide-captcha";
import {toast} from "sonner";

// --------------------------------------------------------------
type FormData = {
  phoneNumber: string;
};
// --------------------------------------------------------------
const PhoneNumberStep = () => {
  const methods = useForm<FormData>();
  const { handleSubmit } = methods;
  const router=useRouter();
  const dialog=useBoolean();

  const HandleSubmit = handleSubmit((data) => {
    console.log(data);
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
            setTimeout(() => {
              toast.success('چالش با موفقیت انجام شد');
              // captcha.current?.reset();
              dialog.onFalse();
              router.push(paths.auth.password);
            }, 1000);
          },
        });
      }
    }, 300); // Small delay for modal rendering
  }, [dialog.value]); // Runs only when modal state changes

  return (
    <>
      <Form methods={methods} onSubmit={HandleSubmit}>
        <Stack spacing={2} mt={5}>
          <Field.Text label="شماره موبایل" name="phoneNumber" />
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
        <DialogContent sx={{ p: 3 }}>
          <div key={keyRender} ref={ref} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PhoneNumberStep;
