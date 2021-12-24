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
import Cookies from 'js-cookie';

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
  const [districts, setDistricts] = useState([]);
  const [previous, setPrevious] = React.useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const idCity = Cookies.get('user');

  // Checkbox - Id của các thành phố khi được checkbox
  const [isAllChecked, setAllChecked] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    axios.get(`http://localhost:3001/district/${idCity}`).then((response) => {
      console.log(response.data);
      setDistricts(
        response.data.map((element) => {
          return {
            id: element.id_district,
            name: element.district_name,
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
    setDistricts((state) => {
      return districts.map((district) => {
        if (district.id === id) {
          return { ...district, isEditMode: !district.isEditMode };
        }
        return district;
      });
    });
  };

  const onChangeDistrictCode = (e, district) => {
    if (!previous[district.id]) {
      setPrevious((state) => ({ ...state, [district.id]: district }));
    }
    const value = e.target.value;
    const name = e.target.name;
    const { id } = district;
    const newDistricts = districts.map((district) => {
      if (district.id === id) {
        return { ...district, [name]: value };
      }
      return district;
    });
    setDistricts(newDistricts);

    // Update city code
    axios.post(`http://localhost:3001/district/${id}`, { newCode: value }).then((res) => {});
  };

  const onChangeDistrictName = (e, district) => {
    if (!previous[district.id]) {
      setPrevious((state) => ({ ...state, [district.id]: district }));
    }
    const value = e.target.value;
    const name = e.target.name;
    const { id } = district;
    const newDistricts = districts.map((district) => {
      if (district.id === id) {
        return { ...district, [name]: value };
      }
      return district;
    });
    setDistricts(newDistricts);

    // Update city code
    axios.post(`http://localhost:3001/district/${id}`, { newName: value }).then((res) => {});
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
        resolve(data);
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
      deleteDistrict();

      let districts = [];
      data.forEach((row) => {
        if (
          row['Tên quận/huyện'] &&
          row['Mã quận/huyện'] &&
          isVietnamese(row['Tên quận/huyện']) &&
          isNumber(row['Mã quận/huyện'])
        ) {
          axios.post(`http://localhost:3001/district/`, {
            districtName: row['Tên quận/huyện'],
            districtCode: row['Mã quận/huyện'],
            idCity: idCity,
          });
          districts.push({
            id: row['Mã quận/huyện'],
            name: row['Tên quận/huyện'],
            hasAccount: false,
            isEditMode: false,
            isChecked: false,
          });
        }
      });
      if (districts.length > 0) {
        setDistricts(districts);
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

    if (districts.length === 0) {
      var ws = XLSX.utils.json_to_sheet([
        {
          STT: 'Số thứ tự',
          'Tên quận/huyện': 'Nhập tên của quận/huyện',
          'Mã quận/huyện': 'Nhập mã của quận/huyện phố gồm 4 chữ số, 2 chữ số đầu là mã tỉnh/thành',
        },
      ]);
    } else {
      ws = XLSX.utils.json_to_sheet(
        districts.map((district, key) => {
          return {
            STT: key + 1,
            'Tên quận/huyện': district.name,
            'Mã quận/huyện': district.id,
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
      'Danh sách quận/huyện.xlsx'
    );
    enqueueSnackbar('Lưu file thành công', { variant: 'Success' });
  };

  // Supply account
  const supplyAccount = (defaultPassword) => {
    districts.forEach((city) => {
      Promise.all([
        axios.post(`http://localhost:3001/account`, {
          username: city.id,
          password: defaultPassword,
        }),
        axios.post(`http://localhost:3001/district/${city.id}`, {
          hasAccount: true,
        }),
      ]);
    });

    const newCities = districts.map((city) => {
      return {
        id: city.id,
        name: city.name,
        hasAccount: true,
        isEditMode: false,
        isChecked: city.isChecked,
      };
    });
    setDistricts(newCities);
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

    const newCities = districts.map((city) => {
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
    setDistricts(newCities);
    enqueueSnackbar('Cấp thành công', { variant: 'Success' });
  };

  // Reset all account
  const resetAccount = () => {
    // Xóa các tài khoản đăng nhập và set lại trạng thái chưa cập nhật tài khoản
    districts.forEach((district) => {
      Promise.all([
        axios.post(`http://localhost:3001/district/${district.id}`, {
          hasAccount: false,
        }),
        axios.delete(`http://localhost:3001/account/${district.id}`),
      ]);
    });

    const newDistricts = districts.map((district) => {
      return {
        id: district.id,
        name: district.name,
        hasAccount: false,
        isEditMode: false,
        isChecked: district.isChecked,
      };
    });
    setDistricts(newDistricts);
    enqueueSnackbar('Reset thành công', { variant: 'Success' });
  };

  // Reset one account
  const resetOneAccount = (districtId) => {
    Promise.all([
      axios.post(`http://localhost:3001/district/${districtId}`, {
        hasAccount: false,
      }),
      axios.delete(`http://localhost:3001/account/${districtId}`),
    ]);

    const newDistricts = districts.map((district) => {
      return district.id === districtId
        ? {
            id: district.id,
            name: district.name,
            hasAccount: false,
            isEditMode: false,
            isChecked: district.isChecked,
          }
        : district;
    });
    setDistricts(newDistricts);
    enqueueSnackbar('Reset thành công', { variant: 'Success' });
  };

  // Add new district
  const handleAddNewDistrict = (districtName, districtCode) => {
    axios
      .post(`http://localhost:3001/district/`, {
        districtName: districtName,
        districtCode: districtCode,
        idCity: idCity,
      })
      .then((res) => {});
    const newDistrict = {
      id: districtCode,
      name: districtName,
      hasAccount: false,
      isEditMode: false,
      isChecked: false,
    };
    const newDistricts = [...districts, newDistrict];
    setDistricts(newDistricts);
    enqueueSnackbar('Thêm thành công', { variant: 'Success' });
  };

  // Delete district
  const deleteDistrict = (id) => {
    const newCities = [];
    districts.forEach((city) => {
      if (city.id !== id) {
        newCities.push(city);
      }
    });
    setDistricts(newCities);
    Promise.all([
      axios.delete(`http://localhost:3001/district/${id}`),
      axios.delete(`http://localhost:3001/account/${id}`),
    ]);
    enqueueSnackbar('Xóa thành công', { variant: 'Success' });
  };

  // Handle search
  const handleSearch = (e) => {
    axios.get(`http://localhost:3001/district/${idCity}`).then((response) => {
      const districts = response.data.map((element) => {
        return {
          id: element.id_district,
          name: element.district_name,
          hasAccount: element.hasAccount,
          isEditMode: false,
          isChecked: element.isChecked,
        };
      });

      let typed = removeVietnameseTones(e.target.value).toLowerCase();
      if (typed === '') {
        setDistricts(districts);
      } else {
        let newDistrict = districts.filter((city, index) => {
          return removeVietnameseTones(city.name).toLowerCase().includes(typed);
        });
        setDistricts(newDistrict);
      }
    });
  };

  // Delete selected district
  const deleteSelectedDistrict = () => {
    const newCities = [];
    districts.forEach((district) => {
      if (!district.isChecked) {
        newCities.push(district);
      }
    });
    setDistricts(newCities);

    districts.forEach((district) => {
      if (district.isChecked) {
        Promise.all([
          axios.delete(`http://localhost:3001/district/${district.id}`),
          axios.delete(`http://localhost:3001/account/${district.id}`),
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
    const newCities = districts.map((city) => {
      return {
        id: city.id,
        name: city.name,
        hasAccount: city.hasAccount,
        isEditMode: false,
        isChecked: e.target.checked,
      };
    });
    setDistricts(newCities);
  };

  // Handle onchange of the checkbox
  const onChangeCheckbox = (id, checked) => {
    const newDistricts = districts.map((district) => {
      return district.id === id
        ? {
            id: district.id,
            name: district.name,
            hasAccount: district.hasAccount,
            isEditMode: false,
            isChecked: checked,
          }
        : district;
    });
    setDistricts(newDistricts);

    // Kiểm tra nút check all
    const allChecked = newDistricts.every((city) => city.isChecked);
    setAllChecked(allChecked);
  };

  return (
    <div className="grid container-manage">
      <div className="row first">
        <div className="col l-2-4 m-5 c-12">
          <div className="actionButton">
            <AddCityDialog
              title="Quận/huyện"
              handler={handleAddNewDistrict}
              listLocal={districts}
            />
          </div>
        </div>
        <div className="col l-2 m-3 c-12">
          <div className="actionButton">
            <AddCodeExcel handler={supplyCodeExcel} title="Nhập từ Excel" />
          </div>
        </div>

        <div className="col l-1-8 m-3 c-12">
          <div className="actionButton">
            <AddAccountDialog
              title="Cấp tài khoản"
              variant="contained"
              handler={supplyAccount}
              name="quận/huyện"
            />
          </div>
        </div>

        <div className="col l-1-8 m-3 c-12">
          <div className="actionButton">
            <Button variant="contained" onClick={exportExcel}>
              Xuất ra Excel
            </Button>
          </div>
        </div>
        <div className="col l-1-92 m-4 c-12">
          <div className="actionButton">
            <ConfirmResetAccount handler={resetAccount} title="Reset lại tài khoản" />
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
              count={districts.length}
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
                      handler={deleteSelectedDistrict}
                      title="Xóa các quận/huyện đã chọn"
                    />
                    <input type="checkbox" checked={isAllChecked} onChange={handleCheckboxAll} />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {districts
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((city, key) => (
                    <TableRow key={city.key}>
                      <TableCell>{key + 1}</TableCell>
                      <CustomTableCell
                        source={city}
                        name="name"
                        handleOnChange={onChangeDistrictName}
                      />
                      <CustomTableCell
                        source={city}
                        name="id"
                        handleOnChange={onChangeDistrictCode}
                      />
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
                            name="quận/huyện"
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
                                title="xoá quận/huyện"
                                handler={deleteDistrict}
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
