'use client';

import type { IDocumentsItem } from 'src/types/documents';

import { useBoolean } from 'minimal-shared/hooks';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Card, Table, TableBody } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { useTable, TableHeadCustom } from 'src/components/table';

import { grey } from '../../../theme';
import DocumentsTableRow from '../documents-table-row';
import { Scrollbar } from '../../../components/scrollbar';
import DocumentsCreateDialog from '../documents-create-dialog';
// -----------------------------------------------------------------------------------------------------
const TableHead = [
  { id: 'id', label: 'شماره' },
  { id: 'title', label: 'عنوان' },
  { id: 'status', label: 'وضعیت' },
  { id: 'date', label: 'تاریخ' },
];
const data: IDocumentsItem[] = [
  { id: 1, title: 'ریز نمرات پیش دانشگاهی', status: true, date: '21 بهمن 1403' },
  { id: 2, title: 'دیپلم', status: false, date: '21 بهمن 1403' },
];

const DocumentsView = () => {
  const table = useTable();
  const dialogStatus = useBoolean();
  return (
    <DashboardContent
      maxWidth={false}
      sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column' }}
      title="لیست مدارک"
    >
      <Stack direction="column" spacing={2}>
        <Stack direction="row" justifyContent="right">
          <Button
            startIcon={<Iconify icon="circularPlus" sx={{ width: 25, height: 25 }} />}
            color="primary"
            variant="contained"
            onClick={dialogStatus.onTrue}
          >
            مدرک جدید
          </Button>
        </Stack>
        <Card sx={{ borderRadius: 2, border: 1.5, borderColor: grey[300] }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHeadCustom headCells={TableHead} sx={{ whiteSpace: 'nowrap' }} />
              <TableBody>
                {data?.map((row) => <DocumentsTableRow row={row} />)}
                {/*<TableSkeleton rowCount={table.rowsPerPage} cellCount={TableHead.length}/> /!*is loading*!/*/}
              </TableBody>
            </Table>
          </Scrollbar>
        </Card>
      </Stack>
      {dialogStatus?.value && <DocumentsCreateDialog dialogStatus={dialogStatus} />}
    </DashboardContent>
  );
};
export default DocumentsView;
