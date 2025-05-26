'use client';

import {format} from "date-fns-jalali";
import {useRouter} from "next/navigation";
import {useBoolean, usePopover} from "minimal-shared/hooks";

import Box from '@mui/material/Box';
import Stack from "@mui/material/Stack";
import TableRow from '@mui/material/TableRow';
import { useTheme } from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from "@mui/lab/LoadingButton";

import { grey } from '../../theme';
import {paths} from "../../routes/paths";
import { Iconify } from '../../components/iconify';
import {toPersianNumber} from "../../utils/persian-number";
import {CustomPopover} from "../../components/custom-popover";
import ProPackagesPeyment from "../pro-packages/pro-packages-peyment";

import type {ITicketFormData} from "../../types/tickets";

// ------------------------------------------------------------------

const TicketsTableRow = ({ row,index }: { row: ITicketFormData,index:number }) => {
  const { title, status,createdAt,id,requiresPayment,paymentStatus } = row;
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
            <IconButton onClick={(event)=> {
              if(!requiresPayment) {
                router.push(paths.dashboard.tickets.details(String(id)))
              }else if(requiresPayment&&paymentStatus==="paid") {
                router.push(paths.dashboard.services.userServicesDetails(String(id)))
              }else{
                onOpen(event);
              }
            }}>
              <Iconify icon={requiresPayment&&paymentStatus!=="paid"?"lock":"eye"} sx={{ cursor: 'pointer', color: grey[500] }} />
            </IconButton>
        </TableCell>
      </TableRow>
      <CustomPopover open={open} anchorEl={anchorEl} onClose={onClose}>
        <Stack p={2} spacing={2}>
          <Typography variant='subtitle1'>در انتظار پرداخت</Typography>
          <LoadingButton size='small' onClick={paymentDialog?.onTrue} color='primary' variant='contained'>پرداخت</LoadingButton>
        </Stack>
      </CustomPopover>
      <ProPackagesPeyment isTicketService dialog={paymentDialog} data={row}/>

    </>
  );
};
export default TicketsTableRow;
