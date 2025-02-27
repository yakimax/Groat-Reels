'use client'
import React, { useEffect, useState }   from 'react'
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { createClient } from '@supabase/supabase-js';
import Button from '@mui/material/Button';


let url = "https://dlrehwydsvuxrpesaemj.supabase.co"
let key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRscmVod3lkc3Z1eHJwZXNhZW1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzNzU4MzgsImV4cCI6MjA1NTk1MTgzOH0.RqykeoJ0KGhryJOgSWp3XnGhGople6oDyd3fLB8OolU"

const supabase = createClient(url,key);

const columns = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'code', label: 'ISO\u00a0Code', minWidth: 100 },
    {
      id: 'population',
      label: 'Population',
      minWidth: 170,
      align: 'right',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'size',
      label: 'Size\u00a0(km\u00b2)',
      minWidth: 170,
      align: 'right',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'density',
      label: 'Density',
      minWidth: 170,
      align: 'right',
      format: (value) => value.toFixed(2),
    },
  ];
  
//   function createData(name, code, population, size) {
//     const density = population / size;
//     return { name, code, population, size, density };
//   }
  
//   const rows = [
//     createData('India', 'IN', 1324171354, 3287263),
//     createData('China', 'CN', 1403500365, 9596961),
//     createData('Italy', 'IT', 60483973, 301340),
//     createData('United States', 'US', 327167434, 9833520),
//     createData('Canada', 'CA', 37602103, 9984670),
//     createData('Australia', 'AU', 25475400, 7692024),
//     createData('Germany', 'DE', 83019200, 357578),
//     createData('Ireland', 'IE', 4857000, 70273),
//     createData('Mexico', 'MX', 126577691, 1972550),
//     createData('Japan', 'JP', 126317000, 377973),
//     createData('France', 'FR', 67022000, 640679),
//     createData('United Kingdom', 'GB', 67545757, 242495),
//     createData('Russia', 'RU', 146793744, 17098246),
//     createData('Nigeria', 'NG', 200962417, 923768),
//     createData('Brazil', 'BR', 210147125, 8515767),
//   ];

  
function page() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [rows, setRows] = useState([]);

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };
  
  const getRemovedVideos = async () => {
    const { data, error } = await supabase.from('RemovedVideos').select('*');
    if (error) {
      console.error('Error fetching removed videos:', error);
    } else {
      setRows(data);
      console.log(data);
    }
  };
  useEffect(() => {
    getRemovedVideos();
  }, []);

  const handleAddBack = async (videoId) => {
    const { data, error } = await supabase.from('RemovedVideos').delete().eq('video_id', videoId);
    if (error) {
      console.error('Error deleting video:', error);
    } else {
      console.log('Video deleted successfully');
    }
    getRemovedVideos();
  };

  return (
    <div>    
    <Paper sx={{ width: '100%' }}>
    <TableContainer sx={{ maxHeight: 440 }}>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
              <TableCell><h1>Id</h1></TableCell>
              <TableCell><h1>Created_At</h1></TableCell>
              <TableCell><h1>Video_Id</h1></TableCell>
              <TableCell><h1>Add Back</h1></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                  {columns.map((column) => {
                    return (
                      <TableCell key={column.id} align={column.id === 'population' || column.id === 'size' ? 'left' : column.align}>
                        {column.id === 'name' ? row.id : column.id === 'code' ? row.created_at : column.id === 'population' ? row.video_id : column.id === 'size' ? <Button onClick={()=>handleAddBack(row.video_id)} variant="contained" color="success">Add Again</Button> : ''}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
    <TablePagination
      rowsPerPageOptions={[10, 25, 100]}
      component="div"
      count={rows.length}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  </Paper>
</div>
  )
}

export default page;