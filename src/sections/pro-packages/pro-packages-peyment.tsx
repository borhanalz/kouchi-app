'use client'

import type { UseBooleanReturn } from "minimal-shared";
import Image from "next/image";
import { useState } from "react";

import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { DialogActions, DialogContent, DialogTitle, ToggleButton, ToggleButtonGroup } from "@mui/material";

import { grey } from "../../theme";

import zarinLogo from '/public/assets/images/zarin-logo.png';
import samanLogo from '/public/assets/images/saman-logo.png';

// -------------------------------------------------------------------------------------------

const ProPackagesPeyment = ({ dialog }: { dialog: UseBooleanReturn }) => {
  const [peymentBank, setPeymentBank] = useState<string>('saman');

  const handlePeymentBankChange = (
    event: React.MouseEvent<HTMLElement>,
    newPeymentBank: string | null,
  ) => {
      setPeymentBank(newPeymentBank as string);
  };

  return (
    <Dialog open={dialog.value} onClose={dialog.onFalse} fullWidth>
      <DialogTitle>
        <Typography variant='h4'>فاکتور پرداخت</Typography>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Stack direction='row' justifyContent='space-between'>
            <Typography color={grey[600]}>مبلغ</Typography>
            <Typography fontWeight='bold'>790,000 تومان</Typography>
          </Stack>
          <Divider sx={{ borderStyle: 'dashed' }} />
          <Stack direction='row' justifyContent='space-between'>
            <Typography color={grey[600]}>بسته</Typography>
            <Typography fontWeight='bold'>کوچ راه</Typography>
          </Stack>
          <Divider sx={{ borderStyle: 'dashed' }} />
          <Stack direction='row' justifyContent='space-between'>
            <Typography color={grey[600]}>روش پرداخت</Typography>
            <Typography fontWeight='bold'>انلاین</Typography>
          </Stack>
          <ToggleButtonGroup
            exclusive
            value={peymentBank}
            onChange={handlePeymentBankChange}
          >
            <Stack direction='row' justifyContent='space-between' mt={5} sx={{ width: '100%' }}>
              <ToggleButton value='zarin' sx={{ width: '100%' }}>
                <Image src={zarinLogo} alt='zarin-logo' width={40} />
              </ToggleButton>
              <ToggleButton value='saman' sx={{ width: '100%' }}>
                <Image src={samanLogo} alt='saman-logo' width={40} />
              </ToggleButton>
            </Stack>
          </ToggleButtonGroup>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant='outlined' onClick={dialog.onFalse} color='error'>
          لغو
        </Button>
        <Button variant='contained' color='primary'>
          پرداخت
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProPackagesPeyment;
