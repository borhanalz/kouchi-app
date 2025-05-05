'use client';

import {format} from "date-fns-jalali";
import {useRouter} from "next/navigation";

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import { useTheme } from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { grey } from '../../theme';
import {paths} from "../../routes/paths";
import { Iconify } from '../../components/iconify';

import type {ITicketFormData} from "../../types/tickets";
import {toPersianNumber} from "../../utils/persian-number";
import {CustomPopover} from "../../components/custom-popover";
import {useBoolean, usePopover} from "minimal-shared/hooks";
import Stack from "@mui/material/Stack";
import LoadingButton from "@mui/lab/LoadingButton";
import ProPackagesPeyment from "../pro-packages/pro-packages-peyment";
import type {IService} from "../../types/services";

// ------------------------------------------------------------------

const TicketsTableRow = ({ row,index }: { row: ITicketFormData,index:number }) => {
  const { title, status,createdAt,id,requiresPayment } = row;
  const theme = useTheme();
  const router = useRouter();
  const {open,onOpen,onClose,anchorEl}=usePopover();
  const paymentDialog=useBoolean();
  console.log(row)
  return (<>
      <TableRow>
        <TableCell align="center">{index}</TableCell>
        <TableCell align="center">{title}</TableCell>
        <TableCell align="center">
          <Box
            sx={{
              textAlign: 'center',
              borderRadius: 2,
              color: status ? theme.palette.success.darker : theme.palette.warning.darker,
              display: 'inline-block',
              p: 1.5,
              backgroundColor: status ? theme.palette.success.lighter : theme.palette.warning.lighter,
            }}
          >
            <Typography fontWeight={500} variant="caption">
              {status}
            </Typography>
          </Box>
        </TableCell>
        <TableCell align="center">{createdAt&&toPersianNumber(format(createdAt,"yyyy-MM-dd"))}</TableCell>
        <TableCell align="center">
            <IconButton onClick={requiresPayment?onOpen:()=> {
              if(!requiresPayment) {
                router.push(paths.dashboard.tickets.details(String(id)))
              }
            }}>
              <Iconify icon={requiresPayment?"lock":"eye"} sx={{ cursor: 'pointer', color: grey[500] }} />
            </IconButton>
        </TableCell>
      </TableRow>
      <CustomPopover open={open} anchorEl={anchorEl} onClose={onClose}>
        <Stack p={2} spacing={2}>
          <Typography variant='subtitle1'>نیازمند خرید سرویس اشتراکی</Typography>
          <LoadingButton size='small' onClick={paymentDialog?.onTrue} color='primary' variant='contained'>پرداخت</LoadingButton>
        </Stack>
      </CustomPopover>
      <ProPackagesPeyment isTicketService dialog={paymentDialog} data={row}/>

    </>
  );
};
export default TicketsTableRow;
