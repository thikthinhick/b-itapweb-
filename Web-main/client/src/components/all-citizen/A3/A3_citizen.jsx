// import { DataGrid } from '@mui/x-data-grid';
import * as React from 'react';
import axios from 'axios';
import '../styleCitizen.scss';
import Paper from '@mui/material/Paper';
import Pagination from '../Pagination';
import Select from '../select';
import TableCitizen from '../TableCitizen';
import Search from '../searchCitizen';
import SelectOption from '../selectOption';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export default function Citizen() {
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [listCitizen, setListCitizen] = useState([]);
  const [rows, setRows] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [filter, setFilter] = useState({
    id_ward: [],
    id_hamlet: [],
  });
  const selectOptionName = ['Quê quán', 'Địa chỉ thường trú', 'Địa chỉ tạm trú'];
  var addName = {
    city_name: 'addCity_name',
    district_name: 'addDistrict_name',
    ward_name: 'addWard_name',
    hamlet_name: 'addHamlet_name',
  };
  const [districtName, setDistrictName] = useState('');
  const [cityName, setCityName] = useState('');
  const idDistrict = Cookies.get('user');
  var idCity = idDistrict.toString().substr(0, 2);
  console.log(idCity);
  const [idWard, setIdWard] = useState('');
  const [listWardName, setListWardName] = useState([]);
  const [listWard, setListWard] = useState([]);
  const [listHamletName, setListHamletName] = useState([]);
  const [listHamlet, setListHamlet] = useState([]);

  var tempListWardName = [];
  var tempListHamletName = [];

  useEffect(() => {
    axios.get(`http://localhost:3001/district/id?id=${idDistrict}`).then((response) => {
      setDistrictName(response.data.district_name);
    });
    axios.get(`http://localhost:3001/city/${idCity}`).then((response) => {
      setCityName(response.data.city_name);
    });
    axios.get(`http://localhost:3001/citizen/`).then((response) => {
      setRows(response.data);
      var temp = response.data.filter((row) => {
        return row.address.indexOf(idCity) === 0;
      });
      setListCitizen(temp);
    });
    axios.get(`http://localhost:3001/ward/${idDistrict}`).then((response) => {
      let tempListWardName = [];
      for (let i = 0; i < response.data.length; i++) {
        tempListWardName[tempListWardName.length] = response.data[i].ward_name;
      }
      setListWardName(tempListWardName);
      setListWard(response.data);
    });
  }, []);

  useEffect(() => {
    if (searchId != '') {
      axios.get(`http://localhost:3001/citizen/${searchId}`).then((response) => {
        setListCitizen(response.data);
      });
    }
  }, [searchId]);

  useEffect(() => {
    if (idDistrict !== '') {
      axios.get(`http://localhost:3001/ward/${idDistrict}`).then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          if (tempListWardName.indexOf(response.data[i].ward_name) === -1) {
            tempListWardName[tempListWardName.length] = response.data[i].ward_name;
          }
        }
        setListWardName(tempListWardName);
        setListWard(response.data);
      });
    }
  }, [idDistrict]);
  useEffect(() => {
    if (idWard !== '') {
      axios.get(`http://localhost:3001/hamlet/${idWard}`).then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          if (tempListHamletName.indexOf(response.data[i].hamlet_name) === -1) {
            tempListHamletName[tempListHamletName.length] = response.data[i].hamlet_name;
          }
        }
        setListHamletName(tempListHamletName);
        setListHamlet(response.data);
      });
    }
  }, [idWard]);
  // console.log(listCitizen)
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
    if (name === 'id_district') {
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
        row[addName.district_name] === districtName &&
        row[addName.city_name] === cityName &&
        (filter.id_ward.indexOf(row[addName.ward_name]) !== -1 || filter.id_ward.length === 0) &&
        (filter.id_hamlet.indexOf(row[addName.hamlet_name]) !== -1 || filter.id_hamlet.length === 0)
      );
    });
    setListCitizen(temp);
    // }
    if (item.length === 1) {
      if (name === 'id_ward') {
        let index = listWard.findIndex((x) => x.ward_name === item[0]);
        setIdWard(listWard[index].id_ward);
      }
    }
  }
  return (
    <div className="grid container-all-citizen">
      <div className="row">
        <div className="col l-12 m-12 c-12">
          <h2>
            Danh sách dân số {districtName}, {cityName}
          </h2>
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
                  names = {selectOptionName}
                ></SelectOption>
              </div>
              <div className="col l-2-4 m-5 c-12">
                <Select
                  names={listWardName}
                  label="Phường/Xã"
                  item="id_ward"
                  changeItem={(item, name) => changeRows(item, name)}
                />
              </div>
              <div className="col l-2-4 m-5 c-12">
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
