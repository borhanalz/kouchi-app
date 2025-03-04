'use client';

import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import { useTheme } from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

import type { IDocumentsItem } from '../../types/documents';

// ------------------------------------------------------------------

const DocumentsTableRow = ({ row }: { row: IDocumentsItem }) => {
  const { title, date, status, id } = row;
  const theme = useTheme();
  return (
    <TableRow>
      <TableCell align="center">{id}</TableCell>
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
            {status ? 'ترجمه شده' : 'ترجمه نشده'}
          </Typography>
        </Box>
      </TableCell>
      <TableCell align="center">{date}</TableCell>
    </TableRow>
  );
};
export default DocumentsTableRow;
