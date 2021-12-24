import PropTypes from 'prop-types';
import React from 'react';
import { Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';

InputField.propTypes = {
  form: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,

  label: PropTypes.string,
};

function InputField(props) {
  const { form, name, label } = props;

  const { errors } = form;
  const hasError = errors[name];

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ onChange, onBlur, value, name }) => (
        <TextField
          variant="outlined"
          label={label}
          error={!!hasError}
          helperText={errors[name]?.message}
          name={name}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
        />
      )}
    />
  );
}

export default InputField;
