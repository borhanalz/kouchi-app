'use client';

import type {UseBooleanReturn} from 'minimal-shared';

import Image from 'next/image';
import {useState} from 'react';
import {useMutation} from "@tanstack/react-query";

import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import LoadingButton from "@mui/lab/LoadingButton";
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';

import {grey} from '../../theme';
import {endpoints} from "../../hooks/endPoints";
import {EditCreateRequest} from "../../lib/axios";
import {toPersianNumber} from "../../utils/persian-number";
import {IApiPaymentRequest, IPaymentRequest, IService} from "../../types/services";

import zarinLogo from '/public/assets/images/zarin-logo.png';

// -------------------------------------------------------------------------------------------

const ProPackagesPeyment = ({dialog,isTicketService=false, data}: { dialog: UseBooleanReturn,isTicketService?:boolean, data: IService|any }) => {
  const [peymentBank, setPeymentBank] = useState<string>('zarin');

  const {mutateAsync, isPending} = useMutation({
    mutationKey: ['payment-request'],
    mutationFn: (payload:IPaymentRequest) => EditCreateRequest<IPaymentRequest, IApiPaymentRequest>(endpoints?.SERVICES?.PAYMENT, payload)
  })

  return (
    <Dialog open={dialog.value} onClose={dialog.onFalse} fullWidth>
      <DialogTitle>
        <Typography variant="h4">فاکتور پرداخت</Typography>
      </DialogTitle>
      <DialogContent sx={{p: 3}}>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography color={grey[600]}>مبلغ</Typography>
            <Typography fontWeight="bold">{isTicketService?data?.regularPrice?.toLocaleString():toPersianNumber(Number(data?.buttons?.[0]?.prices?.sale!==0?data?.buttons?.[0]?.prices?.sale:data?.buttons?.[0]?.prices?.regular)?.toLocaleString())} تومان </Typography>
          </Stack>
          <Divider sx={{borderStyle: 'dashed'}}/>
          <Stack direction="row" justifyContent="space-between">
            <Typography color={grey[600]}>بسته</Typography>
            <Typography fontWeight="bold">{data?.title}</Typography>
          </Stack>
          <Divider sx={{borderStyle: 'dashed'}}/>
          <Stack direction="row" justifyContent="space-between">
            <Typography color={grey[600]}>روش پرداخت</Typography>
            <Typography fontWeight="bold">انلاین</Typography>
          </Stack>
          <ToggleButtonGroup exclusive value={peymentBank}>
            <Stack direction="row" justifyContent="space-between" mt={5} sx={{width: '100%'}}>
              <ToggleButton value="zarin" sx={{width: '100%'}}>
                <Image src={zarinLogo} alt="zarin-logo" width={100}/>
                <Typography>زرین پال</Typography>
              </ToggleButton>
            </Stack>
          </ToggleButtonGroup>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={dialog.onFalse} color="error">
          لغو
        </Button>
        <LoadingButton
          loading={isPending}
          variant="contained"
          onClick={async () => {
            const payload: IPaymentRequest = {
              ...(!isTicketService && data?.buttons[0]?.params),
              type: isTicketService ? 'ticket' : data?.buttons[0]?.action,
              ...(isTicketService && { ticketId: data?.id }),
            };
            console.log(payload)
            try {
             const response = await mutateAsync(payload);
             window.location.href=response?.paymentUrl;
            } catch (e) {
              console.log(e)
            }
          }}
          color="primary"
        >
          پرداخت
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ProPackagesPeyment;
