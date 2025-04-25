'use client';

import Image from 'next/image';
import {useRouter} from 'next/navigation';
import illustrationSuccessful from 'public/assets/images/illustration-box.png';
import illustrationError from 'public/assets/images/empty-illustrator.png';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from "@mui/material/Dialog";
import {DialogContent} from "@mui/material";
import Typography from '@mui/material/Typography';

import {paths} from '../../routes/paths';
import {useURLSearchParams} from "../../hooks/use-search-params";
import {Iconify} from "../../components/iconify";
//-------------------------------------------------------------------------------------------
const ProPackagesSuccessfullPayment = () => {
  const router = useRouter();
  const {getParam} = useURLSearchParams();
  return (
    <>
      <Dialog open fullWidth>
        <DialogContent>
          <Stack alignItems="center" justifyContent="center" p={3}>
            <Stack
              spacing={3}
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              {getParam("Status") === "OK" ? <Image src={illustrationSuccessful} alt="illustration"
                                                    style={{width: 220, height: 'auto', marginRight: 70}}/> :
                <Iconify icon='danger' sx={{color: 'red',height:'150px',width:'100px'}}/>}
              <Typography variant="h5" fontWeight='bold'
                          color={getParam("Status") === "OK" ? "green" : "red"}>{getParam("Status") === "OK" ? "بسته با موفقیت فعال شد!" : "پرداخت با موفقیت انجام نشد"}</Typography>
              {getParam("Status") === "OK" && <Typography variant="body2">
                از بخش بسته‌ها می‌تونی سوابق تراکنش ها و وضعیت بسته‌هات رو ببینی.
              </Typography>}
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => router.push(getParam("Status")==="OK"?paths.dashboard.roadMap.root:paths?.dashboard.root)}
              >
                {getParam("Status") === "OK" ? "بزن بریم" : "برو به صفحه اصلی"}
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default ProPackagesSuccessfullPayment;
