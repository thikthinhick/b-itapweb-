import '../style.scss';

import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
// Icons
import EditIcon from '@mui/icons-material/EditOutlined';
import DoneIcon from '@mui/icons-material/DoneAllTwoTone';

import { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useSnackbar } from 'notistack';
// Components
import Search from '../components/search/Search';
import CustomTableCell from '../EditableCell';
import AddCityDialog from '../AddCityDialog';
import AddAccountDialog from '../AddAccountDialog';
import ConfirmDialog from '../ConfirmDeleteOne';
import ConfirmDeleteSelected from '../ConfirmDeleteSelected';
import ConfirmResetAccount from '../ConfirmResetAccount';
import AddCodeExcel from '../AddCodeExcel';
import { isNumber, isVietnamese } from '../../../constants/utils/CheckText';
var removeVietnameseTones = require('../../../constants/utils/CheckText').removeVietnameseTones;

function Manage() {
  const [cities, setCities] = useState([]);
  const [previous, setPrevious] = React.useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { enqueueSnackbar } = useSnackbar();

  // Checkbox - Id của các thành phố khi được checkbox
  const [isAllChecked, setAllChecked] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:3001/city`).then((response) => {
      setCities(
        response.data.map((element) => {
          return {
            id: element.id_city,
            name: element.city_name,
            hasAccount: element.hasAccount,
            isEditMode: false,
            isChecked: false,
          };
        })
      );
    });
  }, []);

  // Pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //Custom table Cell
  const onToggleEditMode = (id) => {
    setCities((state) => {
      return cities.map((city) => {
        if (city.id === id) {
          return { ...city, isEditMode: !city.isEditMode };
        }
        return city;
      });
    });
  };

  const onChangeCityCode = (e, city) => {
    if (!previous[city.id]) {
      setPrevious((state) => ({ ...state, [city.id]: city }));
    }
    const value = e.target.value;
    const name = e.target.name;
    const { id } = city;
    const newCities = cities.map((city) => {
      if (city.id === id) {
        return { ...city, [name]: value };
      }
      return city;
    });
    setCities(newCities);

    // Update city code
    axios.post(`http://localhost:3001/city/${id}`, { newCode: value }).then((res) => {});
  };

  const onChangeCityName = (e, city) => {
    if (!previous[city.id]) {
      setPrevious((state) => ({ ...state, [city.id]: city }));
    }
    const value = e.target.value;
    const name = e.target.name;

    const { id } = city;
    const newCities = cities.map((city) => {
      if (city.id === id) {
        return { ...city, [name]: value };
      }
      return city;
    });
    setCities(newCities);
    axios.post(`http://localhost:3001/city/${id}`, { newName: value }).then((res) => {});
  };

  // Supply new code from excel file
  const supplyCodeExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: 'buffer' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        if (data.length === 0) {
          enqueueSnackbar('Không có dữ liệu', { variant: 'error' });
        } else {
          resolve(data);
        }
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((data) => {
      deleteCity();

      let newCities = [];
      data.forEach((row) => {
        if (
          row['Tên tỉnh/thành'] &&
          row['Mã tỉnh/thành'] &&
          isVietnamese(row['Tên tỉnh/thành']) &&
          isNumber(row['Mã tỉnh/thành'])
        ) {
          axios.post(`http://localhost:3001/city/`, {
            cityName: row['Tên tỉnh/thành'],
            cityCode: row['Mã tỉnh/thành'],
          });
          newCities.push({
            id: row['Mã tỉnh/thành'],
            name: row['Tên tỉnh/thành'],
            hasAccount: false,
            isEditMode: false,
            isChecked: false,
          });
        }
      });
      if (newCities.length > 0) {
        setCities(newCities);
        enqueueSnackbar('Thêm thành công', { variant: 'Success' });
      } else {
        enqueueSnackbar('Thêm không thành công', { variant: 'error' });
      }
    });
  };

  // Export File to Excel
  const exportExcel = () => {
    var wb = XLSX.utils.book_new();
    wb.SheetNames.push('Sheet 1');
    if (cities.length === 0) {
      var ws = XLSX.utils.json_to_sheet([
        {
          STT: 'Số thứ tự',
          'Tên tỉnh/thành': 'Nhập tên của tỉnh/thành phố',
          'Mã tỉnh/thành': 'Nhập mã của tỉnh/thành phố gồm 2 chữ số',
        },
      ]);
    } else {
      ws = XLSX.utils.json_to_sheet(
        cities.map((city, key) => {
          return {
            STT: key + 1,
            'Tên tỉnh/thành': city.name,
            'Mã tỉnh/thành': city.id,
          };
        })
      );
    }
    wb.Sheets['Sheet 1'] = ws;

    var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    function s2ab(s) {
      var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
      var view = new Uint8Array(buf); //create uint8array as viewer
      for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff; //convert to octet
      return buf;
    }

    saveAs(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' }),
      'Danh sách tỉnh/thành phố.xlsx'
    );
    enqueueSnackbar('Lưu file thành công', { variant: 'Success' });
  };

  // Supply account
  const supplyAccount = (defaultPassword) => {
    cities.forEach((city) => {
      Promise.all([
        axios.post(`http://localhost:3001/account`, {
          username: city.id,
          password: defaultPassword,
        }),
        axios.post(`http://localhost:3001/city/${city.id}`, {
          hasAccount: true,
        }),
      ]);
    });

    const newCities = cities.map((city) => {
      return {
        id: city.id,
        name: city.name,
        hasAccount: true,
        isEditMode: false,
        isChecked: city.isChecked,
      };
    });
    setCities(newCities);
    enqueueSnackbar('Cấp thành công', { variant: 'Success' });
  };

  const supplyOneAccount = (cityId, defaultPassword) => {
    Promise.all([
      axios.post(`http://localhost:3001/account`, {
        username: cityId,
        password: defaultPassword,
      }),
      axios.post(`http://localhost:3001/city/${cityId}`, {
        hasAccount: true,
      }),
    ]);

    const newCities = cities.map((city) => {
      return city.id === cityId
        ? {
            id: city.id,
            name: city.name,
            hasAccount: true,
            isEditMode: false,
            isChecked: city.isChecked,
          }
        : city;
    });
    setCities(newCities);
    enqueueSnackbar('Cấp mã thành công', { variant: 'Success' });
  };

  // Reset all account
  const resetAccount = () => {
    // Xóa các tài khoản đăng nhập và set lại trạng thái chưa cập nhật tài khoản
    cities.forEach((city) => {
      Promise.all([
        axios.post(`http://localhost:3001/city/${city.id}`, {
          hasAccount: false,
        }),
        axios.delete(`http://localhost:3001/account/${city.id}`),
      ]);
    });

    const newCities = cities.map((city) => {
      return {
        id: city.id,
        name: city.name,
        hasAccount: false,
        isEditMode: false,
        isChecked: city.isChecked,
      };
    });
    setCities(newCities);
    enqueueSnackbar('Reset thành công', { variant: 'Success' });
  };

  // Reset one account
  const resetOneAccount = (cityId) => {
    Promise.all([
      axios.post(`http://localhost:3001/city/${cityId}`, {
        hasAccount: false,
      }),
      axios.delete(`http://localhost:3001/account/${cityId}`),
    ]);

    const newCities = cities.map((city) => {
      return city.id === cityId
        ? {
            id: city.id,
            name: city.name,
            hasAccount: false,
            isEditMode: false,
            isChecked: city.isChecked,
          }
        : city;
    });
    setCities(newCities);
    enqueueSnackbar('Reset thành công', { variant: 'Success' });
  };

  // Add new city
  const handleAddNewCity = (cityName, cityCode) => {
    console.log('running');
    axios
      .post(`http://localhost:3001/city/`, { cityName: cityName, cityCode: cityCode })
      .then((res) => {});
    const newCity = {
      id: cityCode,
      name: cityName,
      hasAccount: false,
      isEditMode: false,
      isChecked: false,
    };
    const newCities = [...cities, newCity];
    setCities(newCities);
    enqueueSnackbar('Thêm thành công', { variant: 'Success' });
  };

  // Delete city
  const deleteCity = (id) => {
    const newCities = [];
    cities.forEach((city) => {
      if (city.id !== id) {
        newCities.push(city);
      }
    });
    setCities(newCities);
    Promise.all([
      axios.delete(`http://localhost:3001/city/${id}`),
      axios.delete(`http://localhost:3001/account/${id}`),
    ]);
    enqueueSnackbar('Xóa thành công', { variant: 'Success' });
  };

  // Handle search
  const handleSearch = (e) => {
    axios.get(`http://localhost:3001/city`).then((response) => {
      const listCities = response.data.map((element) => {
        return {
          id: element.id_city,
          name: element.city_name,
          hasAccount: element.hasAccount,
          isEditMode: false,
          isChecked: element.isChecked,
        };
      });

      let typed = removeVietnameseTones(e.target.value).toLowerCase();
      if (typed === '') {
        setCities(listCities);
      } else {
        let newCities = listCities.filter((city, index) => {
          return removeVietnameseTones(city.name).toLowerCase().includes(typed);
        });
        setCities(newCities);
      }
    });
  };

  // Delete selected City
  const deleteSelectedCity = () => {
    const newCities = [];
    cities.forEach((city) => {
      if (!city.isChecked) {
        newCities.push(city);
      }
    });
    setCities(newCities);

    cities.forEach((city) => {
      if (city.isChecked) {
        Promise.all([
          axios.delete(`http://localhost:3001/city/${city.id}`),
          axios.delete(`http://localhost:3001/account/${city.id}`),
        ]);
      }
    });

    // Reset lại danh sách các city đã được chọn
    setAllChecked(false);
    enqueueSnackbar('Xóa thành công', { variant: 'Success' });

    // Reset lại các checkbox
    // const listCheckbox = document.querySelectorAll('.checkbox');
    // for (let i = 0; i < listCheckbox.length; i++) {
    //   listCheckbox[i].checked = false;
    // }
  };

  const handleCheckboxAll = (e) => {
    setAllChecked(!isAllChecked);
    const newCities = cities.map((city) => {
      return {
        id: city.id,
        name: city.name,
        hasAccount: city.hasAccount,
        isEditMode: false,
        isChecked: e.target.checked,
      };
    });
    setCities(newCities);
  };

  // Handle onchange of the checkbox
  const onChangeCheckbox = (id, checked) => {
    const newCities = cities.map((city) => {
      return city.id === id
        ? {
            id: city.id,
            name: city.name,
            hasAccount: city.hasAccount,
            isEditMode: false,
            isChecked: checked,
          }
        : city;
    });
    setCities(newCities);

    // Kiểm tra nút check all
    const allChecked = newCities.every((city) => city.isChecked);
    setAllChecked(allChecked);
  };

  return (
    <div className="grid container-manage">
      <div className="row first">
        <div className="col l-2-4 m-5 c-12">
          <div className="actionButton">
            <AddCityDialog title="Tỉnh/Thành phố" handler={handleAddNewCity} listLocal={cities} />
          </div>
        </div>
        

        <div className="col l-1-8 m-3 c-12">
          <div className="actionButton">
            <AddAccountDialog
              title="Cấp tài khoản"
              name="tỉnh/thành"
              variant="contained"
              handler={supplyAccount}
            />
          </div>
        </div>

      </div>

      <div className="row second">
        <div className="col l-2-4 m-4 c-12">
          <Search handler={handleSearch} />
        </div>
      </div>

      <div className="row container-table">
        <div className="col l-12 m-12 c-12">
          <Paper className="row container-table">
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={cities.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <Table aria-label="table" className="table-manage">
              <TableHead>
                <TableRow>
                  <TableCell align="center">STT</TableCell>
                  <TableCell align="center">Tên</TableCell>
                  <TableCell align="center">Mã</TableCell>
                  <TableCell align="center">Tài khoản</TableCell>
                  <TableCell align="center">Hành động</TableCell>
                  <TableCell align="right" className="last-column">
                    <ConfirmDeleteSelected
                      handler={deleteSelectedCity}
                      title="Xóa các tỉnh thành đã chọn"
                    />
                    <input type="checkbox" checked={isAllChecked} onChange={handleCheckboxAll} />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cities
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((city, key) => (
                    <TableRow key={city.key}>
                      <TableCell>{key + 1}</TableCell>
                      <CustomTableCell
                        source={city}
                        name="name"
                        handleOnChange={onChangeCityName}
                      />
                      <CustomTableCell source={city} name="id" handleOnChange={onChangeCityCode} />
                      <TableCell>
                        {city.hasAccount ? (
                          <AddAccountDialog
                            title="Đang hoạt động"
                            className="actionButton button"
                            variant="outlined"
                            handler={resetOneAccount}
                            cityId={city.id}
                          />
                        ) : (
                          <AddAccountDialog
                            title="Chưa cấp"
                            name="tỉnh/thành"
                            className="actionButton button"
                            variant="outlined"
                            color="error"
                            cityId={city.id}
                            handler={supplyOneAccount}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {city.isEditMode ? (
                          <>
                            <IconButton aria-label="done" onClick={() => onToggleEditMode(city.id)}>
                              <DoneIcon />
                            </IconButton>
                          </>
                        ) : (
                          <>
                            <IconButton
                              aria-label="delete"
                              onClick={() => onToggleEditMode(city.id)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton>
                              <ConfirmDialog
                                title="xoá tỉnh/thành phố"
                                handler={deleteCity}
                                id={city.id}
                              />
                            </IconButton>
                          </>
                        )}
                      </TableCell>
                      <TableCell className="row-right">
                        <input
                          type="checkbox"
                          className="checkbox"
                          checked={city.isChecked}
                          onChange={(e) => onChangeCheckbox(city.id, e.target.checked)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Paper>
        </div>
      </div>
    </div>
  );
}

export default Manage;
