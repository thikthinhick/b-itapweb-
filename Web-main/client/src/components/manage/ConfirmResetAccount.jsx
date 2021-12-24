import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { makeStyles } from '@mui/styles';

export default function AlertDialog(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAgree = () => {
    props.handler();
    setOpen(false);
  };

  const useStyles = makeStyles({
    warning: {
      color: 'red',
    },
  });
  const classes = useStyles();

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen}>
        Reset tài khoản
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`${props.title}`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắc muốn {props.title} hay không? <br /> Hành vi này là không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleAgree} className={classes.warning}>
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
