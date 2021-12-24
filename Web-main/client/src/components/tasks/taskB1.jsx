import React from 'react';
// import PropTypes from 'prop-types';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import SaveIcon from '@mui/icons-material/Save';
import { useSnackbar } from 'notistack';
import './styles.scss';
import Picker from './components/picker/picker';
import clsx from 'clsx';
// Tasks.propTypes = {};
import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import ImageNotDeclare from '../../constants/images/work/canNotDeclare.svg'
const initialRows = [
  {
    id: 1,
    cityName: 'Hà Nội',
    startDate: '2020-11-15', // year / month 0 - 11 / day 1 - 31
    endDate: '2020-11-16',
    progress: 5000,
    status: 'Chưa hoàn thành',
  },
  // {
  //   id: 2,
  //   cityName: 'Thanh Hóa',
  //   startDate: new Date(2021, 0, 1), // year / month 0 - 11 / day 1 - 31
  //   endDate: new Date(2021, 1, 1),
  //   progress: 3000,
  //   status: 'Chưa hoàn thành',
  // },
];

const role = Cookies.get('role')
const id = Cookies.get('user')
const nameTitle = (role === 'A1' ? 'Tỉnh / Thành phố' : (role === 'A2' ? 'Quận / Huyện' : 
                  (role === 'A3' ? 'Xã / Phường' : 'Thôn / Xóm')))
const nameData = (role === 'A1' ? 'city' : (role === 'A2' ? 'district' : 
                  (role === 'A3' ? 'ward' : 'hamlet')))                              
function Tasks() {
  const [declare, setDeclare] = useState(null)  
  const [rows, setRows] = React.useState([]);
  const [initEnd, setInitEnd] = useState(new Date(Date.now() +  60*60*24*31*1000));
  const [listCityName, setListCityName] = useState([]);
  var tempListCityName = [];
  useEffect(() => {
    if (role === 'A1') setDeclare(true)
    if (nameData === 'city') {
      axios.get(`http://localhost:3001/${nameData}`).then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          tempListCityName[i] = response.data[i].city_name;
        }
        setListCityName(tempListCityName);
      });
    } else {
      axios.get(`http://localhost:3001/task/${id}`).then((response) => {
        if (response.data) {
          setInitEnd(new Date(response.data.end_date))
          let endDate = new Date(response.data.end_date)
          let startDate = new Date(response.data.start_date)
          if (endDate >= new Date(Date.now()) && startDate <= new Date(Date.now())) setDeclare(true);
          else setDeclare(false)
        }
      else setDeclare(false)
    });
      axios.get(`http://localhost:3001/${nameData}/${Cookies.get('user')}`).then((response) => {
        let name = nameData + '_name'
        for (let i = 0; i < response.data.length; i++) {
          tempListCityName[i] = response.data[i][name];
        }
        setListCityName(tempListCityName);
      });
    }
    axios.get(`http://localhost:3001/task/${nameData}`).then((response) => {
      setRows(response.data);
    });
  }, []);
  const { enqueueSnackbar } = useSnackbar();
  const showNoti = (message, type) => {
    enqueueSnackbar(message, { variant: type });
  };

  const updateTask = React.useCallback(
    (params) => () => {
      const id = params.id;
      const start = new Date(
        params.startDate.getFullYear(),
        params.startDate.getMonth(),
        params.startDate.getDate()
      );

      const end = new Date(
        params.endDate.getFullYear(),
        params.endDate.getMonth(),
        params.endDate.getDate()
      );
      const now = new Date(Date.now());

      const check = end - start;
      const inYearEnd =
        end - new Date(now.getFullYear(), 0, 1) >= 0 && new Date(now.getFullYear(), 11, 31) - end;
      const inYearStart =
        start - new Date(now.getFullYear(), 0, 1) >= 0 &&
        new Date(now.getFullYear(), 11, 31) - start;

      if (check > 0 && inYearEnd && inYearStart) {
        setRows((prevRows) => {
          const indexOfTaskUpdate = prevRows.findIndex((row) => row.id === id);
          const rowToUpdate = prevRows.find((row) => row.id === id);
          const newRows = [...prevRows];
          newRows[indexOfTaskUpdate] = {
            ...rowToUpdate,
            startDate: start,
            endDate: end,
            canDeclare: true
            // status: 'Chưa hoàn thành',
          };

          var timeStart =
            start.getFullYear().toString() +
            '-' +
            (start.getMonth() + 1).toString() +
            '-' +
            start.getDate().toString();
          var timeEnd =
            end.getFullYear().toString() +
            '-' +
            (end.getMonth() + 1).toString() +
            '-' +
            end.getDate().toString();
          axios
            .put(`http://localhost:3001/task/${id}`, {
              startDate: timeStart,
              endDate: timeEnd,
            })
            .then((response) => {
              // setRows(response.data)
            });
          showNoti('Thay đổi thành công', 'success');
          return newRows;
        });
      } else {
        showNoti('Ngày bắt đầu và Ngày kết thúc không hợp lệ', 'error');
      }
    },
    []
  );

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      type: 'number',
      flex: 0.2,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: 'cityName',
      headerName: nameTitle,
      type: 'string',
      sortable: false,
      flex: 1.2,
    },
    {
      field: 'startDate',
      headerName: 'Ngày bắt đầu',
      type: 'date',
      sortable: false,
      editable: true,
      flex: 1,
    },
    {
      field: 'endDate',
      headerName: 'Ngày kết thúc',
      type: 'date',
      sortable: false,
      editable: true,
      flex: 1,
    },
    {
      field: 'progress',
      headerName: 'Tiến độ',
      type: 'number',
      sortable: true,
      disableColumnMenu: true,
      flex: 0.6,
      valueFormatter: (params) => {
        const valueFormatted = params.value.toLocaleString();
        return `${valueFormatted} người`;
      },
    },
    
    {
      field: 'actions',
      type: 'actions',
      flex: 0.1,
      getActions: (params) => [
        <GridActionsCellItem icon={<SaveIcon />} label="Save" onClick={updateTask(params.row)} />,
      ],
    },
  ];


  const updateBySelect = (select, start, end) => {
    if (select.length === 0) {
      showNoti(`Vui lòng chọn ${nameTitle}`, 'error');
      return;
    }
    if (start - end >= 0) {
      showNoti('Ngày bắt đầu và Ngày kết thúc không hợp lệ', 'error');
      return;
    }
    let index = 0;
    let newRows = [...rows];
    newRows.forEach((row) => {
      if (row.cityName === select[index]) {
        row.startDate = start;
        row.endDate = end;
        row.canDeclare = true
        // row.status = 0;
        var timeStart =
          start.getFullYear().toString() +
          '-' +
          (start.getMonth() + 1).toString() +
          '-' +
          start.getDate().toString();
        var timeEnd =
          end.getFullYear().toString() +
          '-' +
          (end.getMonth() + 1).toString() +
          '-' +
          end.getDate().toString();
        axios
          .put(
            `http://localhost:3001/task/${row.id}`,
            { startDate: timeStart, endDate: timeEnd }
          )
          .then((response) => {
            // setRows(response.data)
            console.log(response.data);
          });
        index++;
      }
    });
    setRows(newRows);
    showNoti('Thay đổi thành công', 'success');
  };

  const updateByComplete = () => {
    axios
      .put(
        `http://localhost:3001/task/complete`            
      )
      .then((response) => {
        // setRows(response.data)
        console.log(response.data);
      });
showNoti('Thay đổi thành công', 'success');
};
  return (
    <div className="wrapper">
      {declare === false  ? <div className="statistic-img" style={{ height: '80%', width: '80%'}}>
        <h2>Chưa được cấp quyền</h2>
          <img src={ImageNotDeclare} alt="notDeclare" />
        </div> : <div></div>}
        {declare === true ? 
        <div style={{ height: '95%', width: '100%', backgroundColor: 'white' }}>
        <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
          <div style={{ flexGrow: 0, padding: '20px 20px 0 20px' }}>
            <Picker listCity={listCityName} nameTitle = {nameTitle} toggleApplyButton={updateBySelect} toggleCompleteButton={updateByComplete} initEnd = {initEnd}/>
          </div>
          <div style={{ flexGrow: 1, padding: '20px' }}>
            <div style={{ height: '80vh' }}>
              <DataGrid
                autoHeight
                rows={rows.map((row) => {
                  if (row.startDate) {
                    row = {
                      ...row,
                      startDate: new Date(row.startDate),
                      endDate: new Date(row.endDate),
                      status:  (row.status == 0 ? 'Chưa hoàn thành' : 'Hoàn thành'),
                    };
                  } else {
                    row = {
                      ...row,
                      startDate: '',
                      endDate: '',
                      status: 'Đang khóa quyền',
                    };
                  }
                  return row;
                })}
                columns={columns}
                pageSize={7}
                disableSelectionOnClick
              />
            </div>
          </div>
        </div>
      </div> : <div></div>}
      
      
    </div>
  );
}

export default Tasks;
