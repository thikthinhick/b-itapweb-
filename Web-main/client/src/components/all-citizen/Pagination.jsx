import * as React from 'react';
import { TablePagination } from '@trendmicro/react-paginations';
import '@trendmicro/react-paginations/dist/react-paginations.css';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';

export default function Pagination(props) {
  return (
    <TablePagination
      type="full"
      page={props.page}
      pageLength={props.rowsPerPage}
      totalRecords={props.totalRecords}
      pageLengthMenu={[5, 10, 50, 100, 500, 1000]}
      onPageChange={({ page, pageLength }) => {
            props.changePage(page);
            props.changeRowsPerPage(pageLength)
      }}
      prevPageRenderer={() => <SkipNextIcon fontSize="small" />}
      nextPageRenderer={() => <SkipPreviousIcon fontSize="small" />}
    />
  );
}
