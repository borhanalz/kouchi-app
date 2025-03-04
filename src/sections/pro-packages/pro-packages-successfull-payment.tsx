'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import illustration from 'public/assets/images/illustration-order_complete.png';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { paths } from '../../routes/paths';
//-------------------------------------------------------------------------------------------
const ProPackagesSuccessfullPayment = () => {
  const router = useRouter();
  return (
    <>
      <Stack alignItems="center" justifyContent="center" sx={{ height: '100vh' }}>
        <Stack
          spacing={3}
          direction="column"
          justifyContent="center"
          alignItems="center"
          sx={{ p: 2 }}
        >
          <Image src={illustration} alt="illustration" />
          <Typography variant="h2">بسته کوچ‌راه با موفقیت فعال شد!</Typography>
          <Typography variant="body2">
            از بخش بسته‌ها می‌تونی سوابق تراکنش ها و وضعیت بسته‌هات رو ببینی.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => router.push(paths.dashboard.roadMap.root)}
          >
            بزن بریم
          </Button>
        </Stack>
      </Stack>
    </>
  );
};
export default ProPackagesSuccessfullPayment;
