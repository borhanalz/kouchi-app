'use client'

import { useForm } from "react-hook-form";
import {useRouter} from "next/navigation";

import Stack from "@mui/material/Stack";
import LoadingButton from "@mui/lab/LoadingButton";

import {paths} from "src/routes/paths";

import { Form, Field } from "src/components/hook-form";
// --------------------------------------------------------------
type FormData = {
  phoneNumber: string;
};
// --------------------------------------------------------------
const PhoneNumberStep = () => {
  const methods = useForm<FormData>();
  const { handleSubmit } = methods;
  const router=useRouter();

  const HandleSubmit = handleSubmit((data) => {
    console.log(data);
    router.push(paths.auth.password);
  });

  return (
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
  );
};

export default PhoneNumberStep;
