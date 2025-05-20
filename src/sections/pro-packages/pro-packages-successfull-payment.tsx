'use client';

import Image from 'next/image';
import {useRouter} from 'next/navigation';
import {useQuery} from "@tanstack/react-query";
import illustrationSuccessful from 'public/assets/images/illustration-box.png';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from "@mui/material/Dialog";
import {DialogContent} from "@mui/material";
import Typography from '@mui/material/Typography';

import {paths} from '../../routes/paths';
import {GetRequest} from "../../lib/axios";
import {endpoints} from "../../hooks/endPoints";
import {Iconify} from "../../components/iconify";
import {LoadingScreen} from "../../components/loading-screen";
import {useURLSearchParams} from "../../hooks/use-search-params";

import type {IPaymentVerifyApi} from "../../types/services";
//-------------------------------------------------------------------------------------------
const ProPackagesSuccessfullPayment = () => {
  const router = useRouter();
  const {getParam} = useURLSearchParams();

  const {data,isPending}=useQuery({queryKey:['verify-payment'],queryFn:()=>GetRequest<IPaymentVerifyApi>(endpoints?.SERVICES?.PAYMENY_VERIFY,undefined,{Authority:getParam("Authority"),Status:getParam("Status")})})
  return (
    <Dialog open fullWidth>
        <DialogContent>
          <Stack alignItems="center" justifyContent="center" p={3}>
            {isPending?<LoadingScreen/>:<Stack
              spacing={3}
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              {data?.success ? <Image src={illustrationSuccessful} alt="illustration"
                                      style={{width: 220, height: 'auto', marginRight: 70}}/> :
                <Iconify icon='danger' sx={{color: 'red', height: '150px', width: '100px'}}/>}
              <Typography variant="h5" fontWeight='bold'
                          color={data?.success ? "green" : "red"}>{data?.success ? "بسته با موفقیت فعال شد!" : "پرداخت با موفقیت انجام نشد"}</Typography>
              {/*{data?.success && <Typography variant="body2">*/}
              {/*  از بخش بسته‌ها می‌تونی سوابق تراکنش ها و وضعیت بسته‌هات رو ببینی.*/}
              {/*</Typography>}*/}
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => router.push(paths?.dashboard?.root)}
              >
                {data?.success? "بزن بریم" : "برو به صفحه اصلی"}
              </Button>
            </Stack>}
          </Stack>
        </DialogContent>
      </Dialog>
  );
};
export default ProPackagesSuccessfullPayment;
