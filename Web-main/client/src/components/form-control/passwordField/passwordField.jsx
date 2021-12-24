import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import FormHelperText from '@mui/material/FormHelperText';

PasswordField.propTypes = {
  form: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,

  label: PropTypes.string,
  disable: PropTypes.bool,
};

function PasswordField(props) {
  const { form, name, label, disable } = props;
  const [showPassword, setShowPassword] = useState(false);

  const { errors } = form;
  const hasError = !!errors[name];

  const toggleShowPassword = () => {
    setShowPassword((x) => !x);
  };

  return (
    <FormControl error={hasError} fullWidth margin="normal" variant="outlined">
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <Controller
        name={name}
        control={form.control}
        render={({ onChange, onBlur, value, name }) => (
          <OutlinedInput
            id={name}
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            label={label}
            endAdornment={
              <InputAdornment position="end">
                <IconButton aria-label="toggle password visibility" onClick={toggleShowPassword}>
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            disabled={disable}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
          />
        )}
      />
      <FormHelperText> {errors[name]?.message}</FormHelperText>
    </FormControl>
  );
}

export default PasswordField;
