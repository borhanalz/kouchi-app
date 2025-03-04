'use client';

import type {IDocumentsItem} from 'src/types/documents';

import {useRouter} from "next/navigation";
import {useQuery} from "@tanstack/react-query";
import {useBoolean} from 'minimal-shared/hooks';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import {Card, Table, TableBody} from '@mui/material';

import {DashboardContent} from 'src/layouts/dashboard';

import {Iconify} from 'src/components/iconify';
import {Scrollbar} from 'src/components/scrollbar';
import {useTable, TableHeadCustom, TableSkeleton, TablePaginationCustom} from 'src/components/table';

import {grey} from '../../../theme';
import {paths} from "../../../routes/paths";
import {EditCreateRequest, GetRequest} from "../../../lib/axios";
import TicketsTableRow from '../tickets-table-row';
import {endpoints} from "../../../hooks/endPoints";

import type {IApiTicketsList} from "../../../types/tickets";
// -----------------------------------------------------------------------------------------------------
const TableHead = [
  {id: 'id', label: 'شماره'},
  {id: 'title', label: 'عنوان'},
  {id: 'status', label: 'وضعیت'},
  {id: 'date', label: 'تاریخ'},
  {id: 'detail', label: ''},
];

interface ITicketListFormData {
  page: number,
  limit: number,
  mobileNumber: string
}

const TicketsView = () => {
  const table = useTable();
  const router = useRouter();

  const {data: TicketsList, isPending} = useQuery({
    queryKey: ['tickets-list',table.page,table.rowsPerPage],
    queryFn: () => EditCreateRequest<ITicketListFormData,IApiTicketsList>(endpoints.TICKETS.LIST, {
      page: table.page,
      limit: table.rowsPerPage,
      mobileNumber: '09127017331'
    })
  });
 const rowNumber = (index:number) => table.page * table.rowsPerPage + index + 1;
  return (
    <DashboardContent
      maxWidth={false}
      sx={{display: 'flex', flex: '1 1 auto', flexDirection: 'column'}}
      title="تیکت ها"
    >
      <Stack direction="column" spacing={2}>
        <Stack direction="row" justifyContent="right">
          <Button
            startIcon={<Iconify icon="circularPlus" sx={{width: 25, height: 25}}/>}
            color="primary"
            variant="contained"
            onClick={() => router.push(paths.dashboard.tickets.create)}
          >
            تیکت جدید
          </Button>
        </Stack>
        <Card sx={{borderRadius: 2, border: 1.5, borderColor: grey[300]}}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{minWidth: 960}}>
              <TableHeadCustom headCells={TableHead} sx={{whiteSpace: 'nowrap'}}/>
              <TableBody>
                {TicketsList?.tickets?.map((row,index) => <TicketsTableRow row={row} index={rowNumber(index)}/>)}
                {isPending && <TableSkeleton rowCount={5} cellCount={TableHead.length}/>}
              </TableBody>
            </Table>
          </Scrollbar>
        </Card>
        <TablePaginationCustom
          page={table.page}
          count={TicketsList?.tickets?.length || 0}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Stack>
    </DashboardContent>
  );
};
export default TicketsView;
