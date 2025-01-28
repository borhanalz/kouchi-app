'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from '../../routes/paths';
import { Form, Field } from '../../components/hook-form';
import OtpTimer from '../../components/hook-form/otp-timer';
import { FormReturnLink } from '../components/form-return-link';

type FormData = {
  phoneNumber: string;
};

const OtpSignInStep = () => {
  const methods = useForm<FormData>();
  const { handleSubmit } = methods;
  const router = useRouter();

  const HandleSubmit = handleSubmit((data) => {
    console.log(data);
    router.push(paths.auth.password);
  });

  const handleTimeReset = () => {
    console.log('test');
  };

  const handleTimeOut = () => {
    console.log('Time out');
  };

  return (
    <Form methods={methods} onSubmit={HandleSubmit}>
      <Stack spacing={2} mt={5}>
        <Field.Text label="شماره موبایل" name="phoneNumber" />
        <OtpTimer time={120} onTimeOut={handleTimeOut} onReset={handleTimeReset} />
        <Field.Code name="otpCode" />
        <LoadingButton fullWidth color="inherit" size="large" type="submit" variant="contained">
          ورود
        </LoadingButton>
        <FormReturnLink href={paths.auth.password} />
      </Stack>
    </Form>
  );
};

export default OtpSignInStep;
