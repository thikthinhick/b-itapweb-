import { yupResolver } from '@hookform/resolvers/yup';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DatePicker from '@mui/lab/DatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import { listCareer, listEthnic, listLevel, listReligion } from '../../constants/listAboutPeople';
import InputField from '../form-control/inputField/inputField';
import './styles.scss';
import axios from 'axios';

CensusForm.propTypes = {
  onSubmit: PropTypes.func,
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 3 + ITEM_PADDING_TOP,
    },
  },
};

function CensusForm({ onSubmit }) {
  //id_hamlet của quê quán, địa chỉ thường trú, tạm trú
  const [addressId, setAddressId] = useState('');
  const [address1Id, setAddress1Id] = useState('');
  const [address2Id, setAddress2Id] = useState('');

  //id+name của quê quán
  const [listCityFull, setListCityFull] = useState([]);
  const [listDistrictFull, setListDistrictFull] = useState([]);
  const [listWardFull, setListWardFull] = useState([]);
  const [listHamletFull, setListHamletFull] = useState([]);

  //id+name của địa chỉ thường trú
  const [listDistrict1Full, setListDistrict1Full] = useState([]);
  const [listWard1Full, setListWard1Full] = useState([]);
  const [listHamlet1Full, setListHamlet1Full] = useState([]);

  //id+name của địa chỉ tạm trú
  const [listDistrict2Full, setListDistrict2Full] = useState([]);
  const [listWard2Full, setListWard2Full] = useState([]);
  const [listHamlet2Full, setListHamlet2Full] = useState([]);

  const { enqueueSnackbar } = useSnackbar();
  const showNoti = () => {
    enqueueSnackbar('Một số trường chưa có dữ liệu, vui lòng kiểm tra lại', { variant: 'error' });
  };
  // Thông tin cơ bản
  const [information, setInformation] = useState({
    dateOfBirth: new Date(),
    gender: '',
    religion: '',
    ethnic: 'Kinh',
    level: '',
    career: '',
  });

  // Quê quán
  const [address, setAddress] = useState({
    hamlet: '',
    ward: '',
    district: '',
    city: '',
  });
  const [listCity, setListCity] = useState([]);
  const [listDistrict, setListDistrict] = useState([]);
  const [listWard, setListWard] = useState([]);
  const [listHamlet, setListHamlet] = useState([]);

  // Địa chỉ thường trú
  const [address1, setAddress1] = useState({
    hamlet: '',
    ward: '',
    district: '',
    city: '',
  });
  const [listDistrict1, setListDistrict1] = useState([]);
  const [listWard1, setListWard1] = useState([]);
  const [listHamlet1, setListHamlet1] = useState([]);

  // Địa chỉ tạm trú
  const [address2, setAddress2] = useState({
    hamlet: '',
    ward: '',
    district: '',
    city: '',
  });
  const [listDistrict2, setListDistrict2] = useState([]);
  const [listWard2, setListWard2] = useState([]);
  const [listHamlet2, setListHamlet2] = useState([]);

  useEffect(() => {
    var listCityName = [];
    axios.get('http://localhost:3001/city').then((response) => {
      for (let i = 0; i < response.data.length; i++) {
        listCityName[i] = response.data[i].city_name;
      }
      setListCity(listCityName);
      setListCityFull(response.data);
    });
  }, []);

  //Lấy dữ liệu cho quê quán
  useEffect(() => {
    if (address.city) {
      let index = listCityFull.findIndex((x) => x.city_name === address.city);
      let id_city = listCityFull[index].id_city;
      var listDistrictName = [];
      axios.get(`http://localhost:3001/district/${id_city}`).then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          listDistrictName[i] = response.data[i].district_name;
        }
        setListDistrict(listDistrictName);
        setListDistrictFull(response.data);
      });
    }
  }, [address.city]);
  useEffect(() => {
    if (address.district) {
      let index = listDistrictFull.findIndex((x) => x.district_name === address.district);
      let id_district = listDistrictFull[index].id_district;
      var listWardName = [];
      axios.get(`http://localhost:3001/ward/${id_district}`).then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          listWardName[i] = response.data[i].ward_name;
        }
        setListWard(listWardName);
        setListWardFull(response.data);
      });
    }
  }, [address.district]);
  useEffect(() => {
    if (address.ward) {
      let index = listWardFull.findIndex((x) => x.ward_name === address.ward);
      let id_ward = listWardFull[index].id_ward;
      var listHamletName = [];
      axios.get(`http://localhost:3001/hamlet/${id_ward}`).then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          listHamletName[i] = response.data[i].hamlet_name;
        }
        setListHamlet(listHamletName);
        setListHamletFull(response.data);
      });
    }
  }, [address.ward]);
  useEffect(() => {
    if (address.hamlet) {
      let index = listHamletFull.findIndex((x) => x.hamlet_name === address.hamlet);
      setAddressId(listHamletFull[index].id_hamlet);
    }
  }, [address.hamlet]);

  //Lấy dữ liệu cho địa chỉ thường trú
  useEffect(() => {
    if (address1.city) {
      let index = listCityFull.findIndex((x) => x.city_name === address1.city);
      let id_city = listCityFull[index].id_city;
      var listDistrictName = [];
      axios.get(`http://localhost:3001/district/${id_city}`).then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          listDistrictName[i] = response.data[i].district_name;
        }
        setListDistrict1(listDistrictName);
        setListDistrict1Full(response.data);
      });
    }
  }, [address1.city]);
  useEffect(() => {
    if (address1.district) {
      let index = listDistrict1Full.findIndex((x) => x.district_name === address1.district);
      let id_district = listDistrict1Full[index].id_district;
      var listWardName = [];
      axios.get(`http://localhost:3001/ward/${id_district}`).then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          listWardName[i] = response.data[i].ward_name;
        }
        setListWard1(listWardName);
        setListWard1Full(response.data);
      });
    }
  }, [address1.district]);
  useEffect(() => {
    if (address1.ward) {
      let index = listWard1Full.findIndex((x) => x.ward_name === address1.ward);
      let id_ward = listWard1Full[index].id_ward;
      var listHamletName = [];
      axios.get(`http://localhost:3001/hamlet/${id_ward}`).then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          listHamletName[i] = response.data[i].hamlet_name;
        }
        setListHamlet1(listHamletName);
        setListHamlet1Full(response.data);
      });
    }
  }, [address1.ward]);
  useEffect(() => {
    if (address1.hamlet) {
      let index = listHamlet1Full.findIndex((x) => x.hamlet_name === address1.hamlet);
      setAddress1Id(listHamlet1Full[index].id_hamlet);
    }
  }, [address1.hamlet]);

  //Lấy dữ liệu cho địa chỉ tạm trú
  useEffect(() => {
    if (address2.city) {
      let index = listCityFull.findIndex((x) => x.city_name === address2.city);
      let id_city = listCityFull[index].id_city;
      var listDistrictName = [];
      axios.get(`http://localhost:3001/district/${id_city}`).then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          listDistrictName[i] = response.data[i].district_name;
        }
        setListDistrict2(listDistrictName);
        setListDistrict2Full(response.data);
      });
    }
  }, [address2.city]);
  useEffect(() => {
    if (address2.district) {
      let index = listDistrict2Full.findIndex((x) => x.district_name === address2.district);
      let id_district = listDistrict2Full[index].id_district;
      var listWardName = [];
      axios.get(`http://localhost:3001/ward/${id_district}`).then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          listWardName[i] = response.data[i].ward_name;
        }
        setListWard2(listWardName);
        setListWard2Full(response.data);
      });
    }
  }, [address2.district]);
  useEffect(() => {
    if (address2.ward) {
      let index = listWard2Full.findIndex((x) => x.ward_name === address2.ward);
      let id_ward = listWard2Full[index].id_ward;
      var listHamletName = [];
      axios.get(`http://localhost:3001/hamlet/${id_ward}`).then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          listHamletName[i] = response.data[i].hamlet_name;
        }
        setListHamlet2(listHamletName);
        setListHamlet2Full(response.data);
      });
    }
  }, [address2.ward]);
  useEffect(() => {
    if (address2.hamlet) {
      let index = listHamlet2Full.findIndex((x) => x.hamlet_name === address2.hamlet);
      setAddress2Id(listHamlet2Full[index].id_hamlet);
    }
  }, [address2.hamlet]);

  //Validate Họ và tên + CCCD / CMND
  const schema = yup.object().shape({
    name: yup
      .string()
      .required('Vui lòng nhập họ và tên')
      .test('Kí tự bắt đầu', 'Kí tự bắt đầu không hợp lệ', (value) => {
        return !(value[0] === ' ');
      })
      .test('Kí tự kết thúc', 'Kí tự kết thúc không hợp lệ', (value) => {
        const idx = value.length - 1;
        return !(value[idx] === ' ');
      })
      .matches(
        /^[a-zA-Záàạảãăắằặẳẵâấầậẩẫéèẹẻẽêếềệểễíìịỉĩóòọỏõôốồộổỗơớờợởỡúùụủũưứừựửữ][a-zA-Záàạảãăắằặẳẵâấầậẩẫéèẹẻẽêếềệểễíìịỉĩóòọỏõôốồộổỗơớờợởỡúùụủũưứừựửữ\s]*$/,
        'Chỉ nhập các kí tự tiếng Việt'
      )
      .max(100, 'Tối đa 100 kí tự')
      .test('Nhập đúng theo mẫu', 'Mỗi từ cách nhau 1 khoảng trắng', (value) => {
        const list = value.split(' ');
        let space = 0;
        list.forEach((item) => {
          if (!!item === false) space++;
        });

        return space === 0;
      }),
    citizenID: yup
      .string()
      .required('Vui lòng nhập CCCD / CMND')
      .test('Kí tự bắt đầu', 'Kí tự bắt đầu không hợp lệ', (value) => {
        return !(value[0] === ' ');
      })
      .test('Kí tự kết thúc', 'Kí tự kết thúc không hợp lệ', (value) => {
        const idx = value.length - 1;
        return !(value[idx] === ' ');
      })
      .matches(/^[0-9]/, 'Chỉ nhập các chữ số')
      .min(9, 'Nhập tối thiểu 9 chữ số')
      .test('Nhập đúng độ dài', 'Nhập 9 chữ số CMND / 12 chữ số CCCD', (value) => {
        return value.length === 9 || value.length === 12;
      })
      .test('CCCD', 'Số CCCD phải bắt đầu là 0', (value) => {
        return (value[0] === '0' && value.length === 12) || value.length === 9;
      })
      .max(12, 'Nhập tối đa 12 chữ số')
      .test('Khoảng trắng', 'Tồn tại khoảng trắng không hợp lệ', (value) => {
        return value.split(' ').length === 1;
      }),
  });
  const form = useForm({
    defaultValues: {
      name: '',
      citizenID: '',
    },
    resolver: yupResolver(schema),
  });

  const checkValidField = (object) => {
    for (const property in object) {
      if (!!object[property] === false) return false;
    }
    return true;
  };

  const handleSubmit = (values) => {
    console.log(values);
    if (onSubmit) {
      // values là object chứa: Họ tên + CCCD / CMND
      // information chứa: Ngày sinh / Giới tính / Tôn giáo / Dân tộc / Trình độ / Nghề nghiệp
      const check =
        checkValidField(information) &&
        checkValidField(address) &&
        checkValidField(address1) &&
        checkValidField(address2);

      if (!check) {
        showNoti();
        return;
      } else {
        onSubmit(values, information, addressId, address1Id, address2Id);

        // Dữ liệu chuẩn và ko bị thiếu trường nào thì reset lại toàn bộ các trường
        // form.reset();
        // Reset lại thông tin cơ bản
        setInformation({
          dateOfBirth: new Date(),
          gender: '',
          religion: '',
          ethnic: 'Kinh',
          level: '',
          career: '',
        });
        // Reset lại quê quán
        setAddress({
          hamlet: '',
          ward: '',
          district: '',
          city: '',
        });
        // Reset lại địa chỉ thường trú
        setAddress1({
          hamlet: '',
          ward: '',
          district: '',
          city: '',
        });
        // Reset lại địa chỉ tạm trú
        setAddress2({
          hamlet: '',
          ward: '',
          district: '',
          city: '',
        });
      }
    }
  };
  return (
    <div className="wrapper-census">
      <div style={{ height: '82%', width: '100%', backgroundColor: 'white' }}>
        <div style={{ flexGrow: 1, padding: '40px' }}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <h3 style={{ marginTop: '14px' }}>
              Phiếu điều tra dân số {new Date(Date.now()).getFullYear()}
            </h3>
            <div className="line four">
              <InputField name="name" label="Họ và tên" form={form} />
              <InputField name="citizenID" label="Số CCCD / CMND" form={form} />
              <LocalizationProvider dateAdapter={AdapterDateFns} className="select-date">
                <DatePicker
                  label="Ngày / Tháng / Năm sinh"
                  inputFormat="dd/MM/yyyy"
                  value={information.dateOfBirth}
                  onChange={(newValue) => setInformation({ ...information, dateOfBirth: newValue })}
                  renderInput={(params) => <TextField {...params} />}
                  maxDate={new Date(Date.now())}
                  minDate={new Date(1900, 0, 1)}
                />
              </LocalizationProvider>

              <FormControl className="select-gender">
                <InputLabel>Giới tính</InputLabel>
                <Select
                  value={information.gender}
                  label="Giới tính"
                  onChange={(event) =>
                    setInformation({ ...information, gender: event.target.value })
                  }
                >
                  <MenuItem value="Nam">Nam</MenuItem>
                  <MenuItem value="Nữ">Nữ</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className="line four">
              <FormControl className="select-religion">
                <InputLabel>Tôn giáo</InputLabel>
                <Select
                  value={information.religion}
                  label="Tôn giáo"
                  onChange={(event) =>
                    setInformation({ ...information, religion: event.target.value })
                  }
                  MenuProps={MenuProps}
                >
                  {listReligion.map((rel) => (
                    <MenuItem value={rel} key={rel}>
                      {rel}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Autocomplete
                disablePortal
                className="select-ethnic"
                onChange={(event, newValue) => {
                  setInformation({ ...information, ethnic: newValue });
                }}
                value={information.ethnic}
                options={listEthnic}
                renderInput={(params) => <TextField {...params} label="Dân tộc" />}
              />

              <FormControl className="select-level">
                <InputLabel>Trình độ văn hóa</InputLabel>
                <Select
                  value={information.level}
                  label="Trình độ văn hóa"
                  onChange={(event) =>
                    setInformation({ ...information, level: event.target.value })
                  }
                  MenuProps={MenuProps}
                >
                  {listLevel.map((level) => (
                    <MenuItem value={level} key={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Autocomplete
                disablePortal
                className="select-career"
                onChange={(event, newValue) => {
                  setInformation({ ...information, career: newValue });
                }}
                value={information.career}
                options={listCareer}
                renderInput={(params) => <TextField {...params} label="Nghề nghiệp" />}
              />
            </div>

            <h3 style={{ marginTop: '30px' }}>Quê quán</h3>
            <div className="line three">
              <Autocomplete
                disablePortal
                className="select-address"
                onChange={(event, newValue) => {
                  setAddress({
                    ...address,
                    city: newValue,
                  });
                }}
                value={address.city}
                options={listCity}
                renderInput={(params) => <TextField {...params} label="Tỉnh / Thành phố" />}
              />

              <Autocomplete
                disablePortal
                disabled={!address.city ? true : false}
                className="select-address"
                onChange={(event, newValue) => {
                  setAddress({
                    ...address,
                    district: newValue,
                  });
                }}
                value={address.district}
                options={listDistrict}
                renderInput={(params) => <TextField {...params} label="Quận / Huyện" />}
              />

              <Autocomplete
                disablePortal
                disabled={!address.district ? true : false}
                className="select-address"
                onChange={(event, newValue) => {
                  setAddress({
                    ...address,
                    ward: newValue,
                  });
                }}
                value={address.ward}
                options={listWard}
                renderInput={(params) => <TextField {...params} label="Xã / Phường" />}
              />

              <Autocomplete
                disablePortal
                disabled={!address.ward ? true : false}
                className="select-address"
                onChange={(event, newValue) => {
                  setAddress({
                    ...address,
                    hamlet: newValue,
                  });
                }}
                value={address.hamlet}
                options={listHamlet}
                renderInput={(params) => <TextField {...params} label="Thôn / Khu phố" />}
              />
            </div>

            <h3 style={{ marginTop: '30px' }}>Địa chỉ thường trú</h3>
            <div className="line three">
              <Autocomplete
                disablePortal
                className="select-address"
                onChange={(event, newValue) => {
                  setAddress1({
                    ...address1,
                    city: newValue,
                  });
                }}
                value={address1.city}
                options={listCity}
                renderInput={(params) => <TextField {...params} label="Tỉnh / Thành phố" />}
              />

              <Autocomplete
                disablePortal
                disabled={!address1.city ? true : false}
                className="select-address"
                onChange={(event, newValue) => {
                  setAddress1({
                    ...address1,
                    district: newValue,
                  });
                }}
                value={address1.district}
                options={listDistrict1}
                renderInput={(params) => <TextField {...params} label="Quận / Huyện" />}
              />

              <Autocomplete
                disablePortal
                disabled={!address1.district ? true : false}
                className="select-address"
                onChange={(event, newValue) => {
                  setAddress1({
                    ...address1,
                    ward: newValue,
                  });
                }}
                value={address1.ward}
                options={listWard1}
                renderInput={(params) => <TextField {...params} label="Xã / Phường" />}
              />

              <Autocomplete
                disablePortal
                disabled={!address1.ward ? true : false}
                className="select-address"
                onChange={(event, newValue) => {
                  setAddress1({
                    ...address1,
                    hamlet: newValue,
                  });
                }}
                value={address1.hamlet}
                options={listHamlet1}
                renderInput={(params) => <TextField {...params} label="Thôn / Khu phố" />}
              />
            </div>

            <h3 style={{ marginTop: '30px' }}>Địa chỉ tạm trú</h3>
            <div className="line three">
              <Autocomplete
                disablePortal
                className="select-address"
                onChange={(event, newValue) => {
                  setAddress2({
                    ...address2,
                    city: newValue,
                  });
                }}
                value={address2.city}
                options={listCity}
                renderInput={(params) => <TextField {...params} label="Tỉnh / Thành phố" />}
              />

              <Autocomplete
                disablePortal
                disabled={!address2.city ? true : false}
                className="select-address"
                onChange={(event, newValue) => {
                  setAddress2({
                    ...address2,
                    district: newValue,
                  });
                }}
                value={address2.district}
                options={listDistrict2}
                renderInput={(params) => <TextField {...params} label="Quận / Huyện" />}
              />

              <Autocomplete
                disablePortal
                disabled={!address2.district ? true : false}
                className="select-address"
                onChange={(event, newValue) => {
                  setAddress2({
                    ...address2,
                    ward: newValue,
                  });
                }}
                value={address2.ward}
                options={listWard2}
                renderInput={(params) => <TextField {...params} label="Xã / Phường" />}
              />

              <Autocomplete
                disablePortal
                disabled={!address2.ward ? true : false}
                className="select-address"
                onChange={(event, newValue) => {
                  setAddress2({
                    ...address2,
                    hamlet: newValue,
                  });
                }}
                value={address2.hamlet}
                options={listHamlet2}
                renderInput={(params) => <TextField {...params} label="Thôn / Khu phố" />}
              />
            </div>

            <button className="button" type="submit">
              <p>THÊM VÀO DANH SÁCH</p>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CensusForm;
