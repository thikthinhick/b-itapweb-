// import { DataGrid } from '@mui/x-data-grid';
import * as React from 'react';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import Pagination from '../Pagination';
import Select from '../select';
import TableCitizen from '../TableCitizen';
import Search from '../searchCitizen';
import SelectOption from '../selectOption';
import { useEffect, useState } from 'react';
import '../styleCitizen.scss';

const citizenFix = [
  {
    id_citizen: '010047276406',
    citizen_name: 'Dương Viễn Cảnh',
    date_of_birth: '1923-01-31',
    gender: 'Nam',
    hometown: '01260303',
    tempAddress: '17090503',
    address: '24170705',
    ethnic: 'Chu-ru',
    religion: 'Cơ đốc Phục lâm',
    level: 'Trung học cơ sở',
    job: 'Ca sĩ',
    createdAt: null,
    updatedAt: null,
    addHamlet_name: 'Thôn 5',
    addWard_name: 'Xã Ia Phang',
    addDistrict_name: 'Huyện Chư Pưh',
    addCity_name: 'Tỉnh Gia Lai',
    tempHamlet_name: 'Khu phố 3',
    tempWard_name: 'Thị trấn Rạch Gốc',
    tempDistrict_name: 'Huyện Ngọc Hiển',
    tempCity_name: 'Tỉnh Cà Mau',
    homeHamlet_name: 'Thôn 3',
    homeWard_name: 'Xã Bích Hòa',
    homeDistrict_name: 'Huyện Thanh Oai',
    homeCity_name: 'Thành phố Hà Nội',
  },
  {
    id_citizen: '010050431794',
    citizen_name: 'Lý Hữu Minh',
    date_of_birth: '1923-11-07',
    gender: 'Nam',
    hometown: '01271703',
    tempAddress: '27102502',
    address: '15030603',
    ethnic: 'Mường',
    religion: "Tôn giáo Baha'l",
    level: 'Trung học cơ sở',
    job: 'Streamer',
    createdAt: null,
    updatedAt: null,
    addHamlet_name: 'Thôn 3',
    addWard_name: 'Xã Thanh Phú',
    addDistrict_name: 'Thị xã Bình Long',
    addCity_name: 'Tỉnh Bình Phước',
    tempHamlet_name: 'Thôn 2',
    tempWard_name: 'Xã Cẩm Sơn',
    tempDistrict_name: 'Huyện Cẩm Xuyên',
    tempCity_name: 'Tỉnh Hà Tĩnh',
    homeHamlet_name: 'Thôn 3',
    homeWard_name: 'Xã Nguyễn Trãi',
    homeDistrict_name: 'Huyện Thường Tín',
    homeCity_name: 'Thành phố Hà Nội',
  },
  {
    id_citizen: '010085013557',
    citizen_name: 'Hoàng Trung Thành',
    date_of_birth: '1987-10-03',
    gender: 'Nam',
    hometown: '07020301',
    tempAddress: '01140503',
    address: '13070903',
    ethnic: 'Khơ mú',
    religion: 'Hồi giáo',
    level: 'Trung học cơ sở',
    job: 'Nhà khảo sát',
    createdAt: null,
    updatedAt: null,
    addHamlet_name: 'Thôn 3',
    addWard_name: 'Xã Tây Bình',
    addDistrict_name: 'Huyện Tây Sơn',
    addCity_name: 'Tỉnh Bình Định',
    tempHamlet_name: 'Thôn 3',
    tempWard_name: 'Xã Hữu Hoà',
    tempDistrict_name: 'Huyện Thanh Trì',
    tempCity_name: 'Thành phố Hà Nội',
    homeHamlet_name: 'Khu phố 1',
    homeWard_name: 'Phường Phước Nguyên',
    homeDistrict_name: 'Thành phố Bà Rịa',
    homeCity_name: 'Tỉnh Bà Rịa - Vũng Tàu',
  },
];

export default function Citizen() {
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [listCitizen, setListCitizen] = useState([]);
  const [listCityName, setListCityName] = useState([]);
  const [rows, setRows] = useState([]);
  const [listCity, setListCity] = useState([]);
  const [listDistrictName, setListDistrictName] = useState([]);
  const [listDistrict, setListDistrict] = useState([]);
  const [searchId, setSearchId] = useState('');
  const selectOptionName = ['Quê quán', 'Địa chỉ thường trú', 'Địa chỉ tạm trú'];
  const [filter, setFilter] = useState({
    id_city: [],
    id_district: [],
    id_ward: [],
    id_hamlet: [],
  });
  var addName = {
    city_name: 'addCity_name',
    district_name: 'addDistrict_name',
    ward_name: 'addWard_name',
    hamlet_name: 'addHamlet_name',
  };
  const [idCity, setIdCity] = useState('');
  const [idDistrict, setIdDistrict] = useState('');
  const [idWard, setIdWard] = useState('');
  const [listWardName, setListWardName] = useState([]);
  const [listWard, setListWard] = useState([]);
  const [listHamletName, setListHamletName] = useState([]);
  const [listHamlet, setListHamlet] = useState([]);
  var tempListCityName = [];
  var tempListDistrictName = [];
  var tempListWardName = [];
  var tempListHamletName = [];

  useEffect(() => {
    axios.get('http://localhost:3001/city').then((response) => {
      for (let i = 0; i < response.data.length; i++) {
        tempListCityName[i] = response.data[i].city_name;
      }
      setListCityName(tempListCityName);
      setListCity(response.data);
    });
    // axios.get('http://localhost:3001/citizen').then((response) => {
    setRows(citizenFix);
    setListCitizen(citizenFix);
    // });
  }, []);
  // useEffect(() => {
  //   // if (searchId !== '') {
  //   // console.log(searchId);
  //   axios.get(`http://localhost:3001/citizen/${searchId}`).then((response) => {
  //     setListCitizen(response.data);
  //   });
  // }, [searchId]);
  // useEffect(() => {
  //   if (idCity !== '') {
  //     axios.get(`http://localhost:3001/district/${idCity}`).then((response) => {
  //       for (let i = 0; i < response.data.length; i++) {
  //         if (tempListDistrictName.indexOf(response.data[i].district_name) === -1) {
  //           tempListDistrictName[tempListDistrictName.length] = response.data[i].district_name;
  //         }
  //       }
  //       setListDistrictName(tempListDistrictName);
  //       setListDistrict(response.data);
  //     });
  //   }
  // }, [idCity]);
  // useEffect(() => {
  //   if (idDistrict !== '') {
  //     axios.get(`http://localhost:3001/ward/${idDistrict}`).then((response) => {
  //       for (let i = 0; i < response.data.length; i++) {
  //         if (tempListWardName.indexOf(response.data[i].ward_name) === -1) {
  //           tempListWardName[tempListWardName.length] = response.data[i].ward_name;
  //         }
  //       }
  //       setListWardName(tempListWardName);
  //       setListWard(response.data);
  //     });
  //   }
  // }, [idDistrict]);
  // useEffect(() => {
  //   if (idWard !== '') {
  //     axios.get(`http://localhost:3001/hamlet/${idWard}`).then((response) => {
  //       for (let i = 0; i < response.data.length; i++) {
  //         if (tempListHamletName.indexOf(response.data[i].hamlet_name) === -1) {
  //           tempListHamletName[tempListHamletName.length] = response.data[i].hamlet_name;
  //         }
  //       }
  //       setListHamletName(tempListHamletName);
  //       setListHamlet(response.data);
  //     });
  //   }
  // }, [idWard]);
  function changeRows(item, name) {
    if (name === 'id_add') {
      if (item === 'Địa chỉ tạm trú') {
        addName.city_name = 'tempCity_name';
        addName.district_name = 'tempDistrict_name';
        addName.ward_name = 'tempWard_name';
        addName.hamlet_name = 'tempHamlet_name';
      } else if (item === 'Địa chỉ thường trú') {
        addName.city_name = 'addCity_name';
        addName.district_name = 'addDistrict_name';
        addName.ward_name = 'addWard_name';
        addName.hamlet_name = 'addHamlet_name';
      } else {
        addName.city_name = 'homeCity_name';
        addName.district_name = 'homeDistrict_name';
        addName.ward_name = 'homeWard_name';
        addName.hamlet_name = 'homeHamlet_name';
      }
    } else filter[name] = item;
    if (name === 'id_city') {
      filter.id_district = [];
      filter.id_ward = [];
      filter.id_hamlet = [];
      if (filter.id_city.length > 1) setListDistrictName([]);
      setListWardName([]);
      setListHamletName([]);
    } else if (name === 'id_district') {
      filter.id_ward = [];
      filter.id_hamlet = [];
      if (filter.id_district.length > 1) setListWardName([]);
      setListHamletName([]);
    } else if (name === 'id_ward') {
      if (filter.id_ward.length > 1) setListHamletName([]);
    }
    // if (item.length > 0) {
    var temp = rows.filter((row) => {
      return (
        (filter.id_district.indexOf(row[addName.district_name]) !== -1 ||
          filter.id_district.length === 0) &&
        (filter.id_city.indexOf(row[addName.city_name]) !== -1 || filter.id_city.length === 0) &&
        (filter.id_ward.indexOf(row[addName.ward_name]) !== -1 || filter.id_ward.length === 0) &&
        (filter.id_hamlet.indexOf(row[addName.hamlet_name]) !== -1 || filter.id_hamlet.length === 0)
      );
    });
    setListCitizen(temp);
    // }
    if (item.length === 1) {
      if (name === 'id_city') {
        let index = listCity.findIndex((x) => x.city_name === item[0]);
        setIdCity(listCity[index].id_city);
      } else if (name === 'id_district') {
        let index = listDistrict.findIndex((x) => x.district_name === item[0]);
        setIdDistrict(listDistrict[index].id_district);
      } else if (name === 'id_ward') {
        let index = listWard.findIndex((x) => x.ward_name === item[0]);
        setIdWard(listWard[index].id_ward);
      }
    }
  }
  return (
    <div className="grid container-all-citizen">
      <div className="row">
        <div className="col l-12 m-12 c-12">
          <h2>Danh sách dân số toàn quốc</h2>
        </div>
      </div>
      <div className="row">
        <div className="col l-12 m-12 c-12">
          <Paper>
            <div className="row first">
              <div className="col l-2 m-5 c-12">
                <SelectOption
                  label="Địa điểm"
                  item="id_add"
                  changeItem={(item, name) => changeRows(item, name)}
                  names={selectOptionName}
                ></SelectOption>
              </div>
              <div className="col l-2-4 m-5 c-12">
                <Select
                  names={listCityName}
                  label="Tỉnh/Thành phố"
                  item="id_city"
                  changeItem={(item, name) => changeRows(item, name)}
                />
              </div>
              <div className="col l-2-4 m-5 c-12">
                <Select
                  names={listDistrictName}
                  label="Quận/Huyện"
                  item="id_district"
                  changeItem={(item, name) => changeRows(item, name)}
                />
              </div>
              <div className="col l-2 m-5 c-12">
                <Select
                  names={listWardName}
                  label="Phường/Xã"
                  item="id_ward"
                  changeItem={(item, name) => changeRows(item, name)}
                />
              </div>
              <div className="col l-2 m-5 c-12">
                <Select
                  names={listHamletName}
                  label="Thôn/Xóm"
                  item="id_hamlet"
                  changeItem={(item, name) => changeRows(item, name)}
                />
              </div>
              <div className="col l-3 m-5 c-12">
                <Search search={(idCitizen) => setSearchId(idCitizen)} change={listCitizen} />
              </div>
            </div>

            <div className="row">
              <div className="col l-12 m-12 c-12">
                <Pagination
                  page={page}
                  rowsPerPage={rowsPerPage}
                  totalRecords={listCitizen.length}
                  changePage={(page) => setPage(page)}
                  changeRowsPerPage={(rowsPerPage) => setRowsPerPage(rowsPerPage)}
                />
              </div>
            </div>

            <div className="row table-container">
              <div className="col l-12 m-12 c-12">
                <TableCitizen rows={listCitizen} page={page} rowsPerPage={rowsPerPage} />
              </div>
            </div>
          </Paper>
        </div>
      </div>
    </div>
  );
}
