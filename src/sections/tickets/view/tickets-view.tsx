'use client';


import {useRouter} from "next/navigation";
import {useQuery} from "@tanstack/react-query";

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import {Card, Table, TableBody} from '@mui/material';

import {DashboardContent} from 'src/layouts/dashboard';

import {Iconify} from 'src/components/iconify';
import {Scrollbar} from 'src/components/scrollbar';
import {useTable, TableSkeleton, TableHeadCustom, TablePaginationCustom} from 'src/components/table';

import {paths} from "../../../routes/paths";
import TicketsTableRow from '../tickets-table-row';
import {endpoints} from "../../../hooks/endPoints";
import {EditCreateRequest} from "../../../lib/axios";
import {EmptyContent} from "../../../components/empty-content";
import {LoadingScreen} from "../../../components/loading-screen";

import type {IApiTicketsList} from "../../../types/tickets";
import {useTheme} from "@mui/material/styles";
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
  mobileNumber: string,
}
// ------------------------------------------------------------------------------------------------------
const TicketsView = ({isProServices = false}: { isProServices: boolean }) => {
  const table = useTable();
  const router = useRouter();
  const theme = useTheme();

  const {data: TicketsList, isPending} = useQuery({
    queryKey: [`tickets-list-${isProServices}`, table.page, table.rowsPerPage],
    queryFn: () => EditCreateRequest<ITicketListFormData, IApiTicketsList>(endpoints.TICKETS.LIST, {
      page: table.page,
      limit: table.rowsPerPage,
      mobileNumber: '09127017331'
    }).then((res) => {
      const filteredTickets = res.tickets?.filter(ticket => ticket?.requiresPayment == isProServices);
      return {...res, tickets: filteredTickets}
    })
  });
  const rowNumber = (index: number) => table.page * table.rowsPerPage + index + 1;
  return (
    <DashboardContent
      maxWidth={false}
      sx={{display: 'flex', flex: '1 1 auto', flexDirection: 'column'}}
      title={isProServices ? "سرویس های من" : "تیکت ها"}
    >
      {isPending ? <LoadingScreen/> : <Stack direction="column" spacing={2}>
        {!isProServices && <Stack direction="row" justifyContent="right">
          <Button
            startIcon={<Iconify icon="circularPlus" sx={{width: 25, height: 25}}/>}
            color="primary"
            variant="contained"
            onClick={() => router.push(paths.dashboard.tickets.create)}
          >
            تیکت جدید
          </Button>
        </Stack>}
        {!TicketsList?.tickets?.length ?
          <Stack mt={8}><EmptyContent title={isProServices ? "سرویسی برای شما یافت نشد" : 'تیکتی برای شما یافت نشد'}
                                      description={isProServices ? "" : 'برای ساخت تیکت از قسمت تیکت جدید اقدام فرمایید'}/></Stack> :
          <Card sx={{
            borderRadius: 2,
            border: 1.5,
            borderColor: theme.palette.mode === "dark" ? theme.vars.palette.grey[800] : theme.vars.palette.grey[300]
          }}>
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{minWidth: 960}}>
                <TableHeadCustom headCells={TableHead} sx={{whiteSpace: 'nowrap'}}/>
                <TableBody>
                  {TicketsList?.tickets?.map((row, index) => <TicketsTableRow row={row} index={rowNumber(index)}/>)}
                  {isPending && <TableSkeleton rowCount={5} cellCount={TableHead.length}/>}
                </TableBody>
              </Table>
            </Scrollbar>
          </Card>}
        {TicketsList && TicketsList?.tickets?.length > 0 && <TablePaginationCustom
          page={table.page}
          count={TicketsList?.totalCount as number}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />}
      </Stack>}

    </DashboardContent>
  );
};
export default TicketsView;
