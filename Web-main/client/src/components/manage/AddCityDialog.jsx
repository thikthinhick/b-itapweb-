import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AddIcon from '@mui/icons-material/Add';

import { makeStyles } from '@mui/styles';
import {
  isNotDuplicatedCode,
  isNotDuplicatedName,
  isNumber,
} from '../../constants/utils/CheckText';
import { isVietnamese } from '../../constants/utils/CheckText';

const useStyles = makeStyles({
  textField: {
    marginBottom: '40px',
  },
  warning: {
    color: 'red',
  },
});

export default function FormDialog(props) {
  const [open, setOpen] = React.useState(false);
  const [cityName, setCityName] = React.useState('');
  const [cityCode, setCityCode] = React.useState('');
  const [notification, setNotification] = React.useState('');

  const classes = useStyles();

  // Set length of code and get the list of city name and code to check if
  // the code and name is duplicated
  let codeLength = 0;
  if (props.title === 'Tỉnh/Thành phố') {
    codeLength = 2;
  } else if (props.title === 'Quận/huyện') {
    codeLength = 4;
  } else if (props.title === 'Xã/phường') {
    codeLength = 6;
  } else if (props.title === 'Thôn/khu phố') {
    codeLength = 8;
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNotification('');
  };

  const handleSubmit = () => {
    // Kiểm tra hợp thức dữ liệu đầu vào
    if (cityName && cityCode) {
      if (cityName.length > 1 && cityName.length < 200 && isVietnamese(cityName)) {
        if (isNotDuplicatedName(props.listLocal, cityName)) {
          if (cityCode.length === codeLength && isNumber(cityCode)) {
            if (isNotDuplicatedCode(props.listLocal, cityCode)) {
              props.handler(cityName, cityCode);
              // Đóng modal lại
              setOpen(false);
            } else {
              setNotification(`Mã ${props.title} này đã được sử dụng!`);
            }
          } else {
            setNotification(
              `Mã ${props.title} của bạn không hợp lệ! Mã ${props.title} phải có ${codeLength} chữ số!`
            );
          }
        } else {
          setNotification(`Tên ${props.title} này đã được sử dụng!`);
        }
      } else {
        setNotification(`Tên ${props.title} của bạn không hợp lệ!`);
      }
    } else {
      setNotification('Bạn phải nhập đầy đủ thông tin');
    }
  };

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen}>
        Thêm {props.title}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Thêm {props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Điền các thông tin cần sau. Các thông tin có dấu * là bắt buộc.
          </DialogContentText>
          <DialogContentText className={classes.warning}>{notification}</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="cityName"
            label={`Tên ${props.title} (*)`}
            type="text"
            fullWidth
            variant="standard"
            className={classes.textField}
            onChange={(e) => setCityName(e.target.value)}
          />

          <TextField
            margin="dense"
            id="cityCode"
            label={`Mã ${props.title} (*)`}
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => setCityCode(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleSubmit}>Thêm mới</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
