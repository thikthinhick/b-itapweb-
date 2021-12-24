import React from 'react';
import PropTypes from 'prop-types';
import CensusForm from '../censusForm/censusForm';
import { useSnackbar } from 'notistack';
import axios from 'axios';

Census.propTypes = {};

function Census() {
  const { enqueueSnackbar } = useSnackbar();

  const showNoti = () => {
    enqueueSnackbar('Thêm dữ liệu thành công', { variant: 'success' });
  };

  const handleSubmit = (values, information, address, address1, address2) => {
    // Dữ liệu ném lên đây là đã oke rồi, thêm vào db thôiiii

   const date =
      information.dateOfBirth.getFullYear().toString() +
      '-' +
      (information.dateOfBirth.getMonth() + 1).toString() +
      '-' +
      information.dateOfBirth.getDate().toString();
    const data = {
      id_citizen: values.citizenID,
      citizen_name: values.name,
      date_of_birth: date,
      gender: information.gender,
      hometown: address,
      tempAddress: address2,
      address: address1,
      ethnic: information.ethnic,
      religion: information.religion,
      level: information.level,
      job: information.career,
    };
    axios.post(`http://localhost:3001/citizen`, data).then((response) => {
      showNoti();
    });
  };

  return (
    <div>
      <CensusForm onSubmit={handleSubmit} />
    </div>
  );
}

export default Census;
