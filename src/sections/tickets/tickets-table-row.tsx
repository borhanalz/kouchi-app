'use client';

import type { IDocumentsItem } from 'src/types/documents';

import {format} from "date-fns-jalali";

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import { useTheme } from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { grey } from '../../theme';
import { Iconify } from '../../components/iconify';

import type {ITicketFormData} from "../../types/tickets";
import {useRouter} from "next/navigation";
import {paths} from "../../routes/paths";

// ------------------------------------------------------------------

const TicketsTableRow = ({ row,index }: { row: ITicketFormData,index:number }) => {
  const { title, status,createdAt } = row;
  const theme = useTheme();
  const router = useRouter();
  return (
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
      <TableCell align="center">{createdAt&&format(createdAt,"yyyy-MM-dd")}</TableCell>
      <TableCell align="center">
        <Tooltip title="مشاهده جزئیات">
          <IconButton onClick={()=>router.push(paths.dashboard.tickets.details(row?._id))}>
            <Iconify icon="eye" sx={{ cursor: 'pointer', color: grey[500] }} />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};
export default TicketsTableRow;
