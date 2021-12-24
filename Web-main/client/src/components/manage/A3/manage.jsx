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
import Cookies from 'js-cookie';
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
  const [wards, setWards] = useState([]);
  const [previous, setPrevious] = React.useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const idDistrict = Cookies.get('user');

  // Checkbox - Id của các thành phố khi được checkbox
  const [isAllChecked, setAllChecked] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    axios.get(`http://localhost:3001/ward/${idDistrict}`).then((response) => {
      console.log(response.data);
      setWards(
        response.data.map((element) => {
          return {
            id: element.id_ward,
            name: element.ward_name,
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
    setWards((state) => {
      return wards.map((ward) => {
        if (ward.id === id) {
          return { ...ward, isEditMode: !ward.isEditMode };
        }
        return ward;
      });
    });
  };

  const onChangewardCode = (e, ward) => {
    if (!previous[ward.id]) {
      setPrevious((state) => ({ ...state, [ward.id]: ward }));
    }
    const value = e.target.value;
    const name = e.target.name;
    const { id } = ward;
    const newwards = wards.map((ward) => {
      if (ward.id === id) {
        return { ...ward, [name]: value };
      }
      return ward;
    });
    setWards(newwards);

    // Update city code
    axios.post(`http://localhost:3001/ward/${id}`, { newCode: value }).then((res) => {});
  };

  const onChangewardName = (e, ward) => {
    if (!previous[ward.id]) {
      setPrevious((state) => ({ ...state, [ward.id]: ward }));
    }
    const value = e.target.value;
    const name = e.target.name;
    const { id } = ward;
    const newwards = wards.map((ward) => {
      if (ward.id === id) {
        return { ...ward, [name]: value };
      }
      return ward;
    });
    setWards(newwards);

    // Update city code
    axios.post(`http://localhost:3001/ward/${id}`, { newName: value }).then((res) => {});
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
      deleteWard();

      let newWards = [];
      data.forEach((row) => {
        if (
          row['Tên xã/phường'] &&
          row['Mã xã/phường'] &&
          isVietnamese(row['Tên xã/phường']) &&
          isNumber(row['Mã xã/phường'])
        ) {
          axios.post(`http://localhost:3001/ward/`, {
            wardName: row['Tên xã/phường'],
            wardCode: row['Mã xã/phường'],
            idDistrict: idDistrict,
          });
          newWards.push({
            id: row['Mã xã/phường'],
            name: row['Tên xã/phường'],
            hasAccount: false,
            isEditMode: false,
            isChecked: false,
          });
        }
      });
      if (newWards.length > 0) {
        setWards(newWards);
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

    if (wards.length === 0) {
      var ws = XLSX.utils.json_to_sheet([
        {
          STT: 'Số thứ tự',
          'Tên xã/phường': 'Nhập tên của xã/phường',
          'Mã xã/phường': 'Nhập mã của xã/phường phố gồm 6 chữ số, 4 chữ số đầu là mã quận/huyện',
        },
      ]);
    } else {
      ws = XLSX.utils.json_to_sheet(
        wards.map((ward, key) => {
          return {
            STT: key + 1,
            'Tên xã/phường': ward.name,
            'Mã xã/phường': ward.id,
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
      'Danh sách xã/phường.xlsx'
    );
    enqueueSnackbar('Lưu file thành công', { variant: 'Success' });
  };

  // Supply account
  const supplyAccount = (defaultPassword) => {
    wards.forEach((ward) => {
      Promise.all([
        axios.post(`http://localhost:3001/account`, {
          username: ward.id,
          password: defaultPassword,
        }),
        axios.post(`http://localhost:3001/ward/${ward.id}`, {
          hasAccount: true,
        }),
      ]);
    });

    const newWards = wards.map((ward) => {
      return {
        id: ward.id,
        name: ward.name,
        hasAccount: true,
        isEditMode: false,
        isChecked: ward.isChecked,
      };
    });
    setWards(newWards);
    enqueueSnackbar('Cấp thành công', { variant: 'Success' });
  };

  const supplyOneAccount = (cityId, defaultPassword) => {
    Promise.all([
      axios.post(`http://localhost:3001/account`, {
        username: cityId,
        password: defaultPassword,
      }),
      axios.post(`http://localhost:3001/ward/${cityId}`, {
        hasAccount: true,
      }),
    ]);

    const newCities = wards.map((city) => {
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
    setWards(newCities);
    enqueueSnackbar('Cấp thành công', { variant: 'Success' });
  };

  // Reset all account
  const resetAccount = () => {
    // Xóa các tài khoản đăng nhập và set lại trạng thái chưa cập nhật tài khoản
    wards.forEach((ward) => {
      Promise.all([
        axios.post(`http://localhost:3001/ward/${ward.id}`, {
          hasAccount: false,
        }),
        axios.delete(`http://localhost:3001/account/${ward.id}`),
      ]);
    });

    const newwards = wards.map((ward) => {
      return {
        id: ward.id,
        name: ward.name,
        hasAccount: false,
        isEditMode: false,
        isChecked: ward.isChecked,
      };
    });
    setWards(newwards);
    enqueueSnackbar('Reset thành công', { variant: 'Success' });
  };

  // Reset one account
  const resetOneAccount = (wardId) => {
    Promise.all([
      axios.post(`http://localhost:3001/ward/${wardId}`, {
        hasAccount: false,
      }),
      axios.delete(`http://localhost:3001/account/${wardId}`),
    ]);

    const newCities = wards.map((city) => {
      return city.id === wardId
        ? {
            id: city.id,
            name: city.name,
            hasAccount: false,
            isEditMode: false,
            isChecked: city.isChecked,
          }
        : city;
    });
    setWards(newCities);
    enqueueSnackbar('Reset thành công', { variant: 'Success' });
  };

  // Add new ward
  const handleAddNewWard = (wardName, wardCode) => {
    axios.post(`http://localhost:3001/ward/`, {
      wardName: wardName,
      wardCode: wardCode,
      idDistrict: idDistrict,
    });

    const newward = {
      id: wardCode,
      name: wardName,
      hasAccount: false,
      isEditMode: false,
      isChecked: false,
    };
    const newwards = [...wards, newward];
    setWards(newwards);
    enqueueSnackbar('Thêm thành công', { variant: 'Success' });
  };

  // Delete ward
  const deleteWard = (id) => {
    const newWards = [];
    wards.forEach((ward) => {
      if (ward.id !== id) {
        newWards.push(ward);
      }
    });
    setWards(newWards);
    Promise.all([
      axios.delete(`http://localhost:3001/ward/${id}`),
      axios.delete(`http://localhost:3001/account/${id}`),
    ]);
    enqueueSnackbar('Xóa thành công', { variant: 'Success' });
  };

  // Handle search
  const handleSearch = (e) => {
    axios.get(`http://localhost:3001/ward/${idDistrict}`).then((response) => {
      const wards = response.data.map((element) => {
        return {
          id: element.id_ward,
          name: element.ward_name,
          hasAccount: element.hasAccount,
          isEditMode: false,
          isChecked: element.isChecked,
        };
      });

      let typed = removeVietnameseTones(e.target.value).toLowerCase();
      if (typed === '') {
        setWards(wards);
      } else {
        let newward = wards.filter((city, index) => {
          return removeVietnameseTones(city.name).toLowerCase().includes(typed);
        });
        setWards(newward);
      }
    });
  };

  // Delete selected ward
  const deleteSelectedWard = () => {
    const newCities = [];
    wards.forEach((ward) => {
      if (!ward.isChecked) {
        newCities.push(ward);
      }
    });
    setWards(newCities);

    wards.forEach((ward) => {
      if (ward.isChecked) {
        Promise.all([
          axios.delete(`http://localhost:3001/ward/${ward.id}`),
          axios.delete(`http://localhost:3001/account/${ward.id}`),
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
    const newCities = wards.map((city) => {
      return {
        id: city.id,
        name: city.name,
        hasAccount: city.hasAccount,
        isEditMode: false,
        isChecked: e.target.checked,
      };
    });
    setWards(newCities);
  };

  // Handle onchange of the checkbox
  const onChangeCheckbox = (id, checked) => {
    const newwards = wards.map((ward) => {
      return ward.id === id
        ? {
            id: ward.id,
            name: ward.name,
            hasAccount: ward.hasAccount,
            isEditMode: false,
            isChecked: checked,
          }
        : ward;
    });
    setWards(newwards);

    // Kiểm tra nút check all
    const allChecked = newwards.every((ward) => ward.isChecked);
    setAllChecked(allChecked);
  };

  return (
    <div className="grid container-manage">
      <div className="row first">
        <div className="col l-2-4 m-5 c-12">
          <div className="actionButton">
            <AddCityDialog title="Xã/phường" handler={handleAddNewWard} listLocal={wards} />
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
              name="xã/phường"
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
              count={wards.length}
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
                      handler={deleteSelectedWard}
                      title="Xóa các xã/phường đã chọn"
                    />
                    <input type="checkbox" checked={isAllChecked} onChange={handleCheckboxAll} />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {wards
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((city, key) => (
                    <TableRow key={city.key}>
                      <TableCell>{key + 1}</TableCell>
                      <CustomTableCell
                        source={city}
                        name="name"
                        handleOnChange={onChangewardName}
                      />
                      <CustomTableCell source={city} name="id" handleOnChange={onChangewardCode} />
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
                            name="xã/phường"
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
                                title="xoá xã/phường"
                                handler={deleteWard}
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
