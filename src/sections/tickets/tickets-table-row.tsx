'use client'

import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import TableRow from "@mui/material/TableRow";
import {useTheme} from "@mui/material/styles";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import {grey} from "../../theme";
import {Iconify} from "../../components/iconify";

import type {IDocumentsItem} from ".src/types/documents";

// ------------------------------------------------------------------

const TicketsTableRow = ({row}: { row: IDocumentsItem }) => {
  const {title, date, status, id} = row;
  const theme = useTheme();
  return <TableRow>
    <TableCell align='center'>{id}</TableCell>
    <TableCell align='center'>{title}</TableCell>
    <TableCell align='center'><Box sx={{
      textAlign: 'center',
      borderRadius: 2,
      color: status ? theme.palette.success.darker : theme.palette.warning.darker,
      display: 'inline-block',
      p: 1.5,
      backgroundColor: status ? theme.palette.success.lighter : theme.palette.warning.lighter
    }}><Typography fontWeight={500} variant='caption'>{status ? 'پاسخ داده شده' : 'پاسخ داده نشده'}</Typography></Box></TableCell>
    <TableCell align='center'>{date}</TableCell>
    <TableCell align='center'><Tooltip title='مشاهده جزئیات'><IconButton><Iconify icon='eye' sx={{cursor:'pointer',color:grey[500]}}/></IconButton></Tooltip></TableCell>
  </TableRow>
}
export default TicketsTableRow;
