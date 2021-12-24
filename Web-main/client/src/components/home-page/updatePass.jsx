import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import * as yup from 'yup';
import PasswordField from '../form-control/passwordField/passwordField';

function UpdatePass(props) {
  // Lấy một khẩu hiện tại rồi cho vào biến crPass nhé Loan:
  const crPass = '';

  const schema = yup.object().shape({
    current: yup
      .string()
      .required('Chưa nhập mật khẩu hiện tại')
      .test('check cũ mới', 'Mật khẩu không chính xác', (value) => {
        return value === crPass;
      }),
    new: yup
      .string()
      .required('Chưa nhập mật khẩu mới')
      .matches(/[A-Z,0-9]/, 'Phải tồn tại ít nhất 1 chữ số và 1 chữ cái viết hoa')
      .min(6, 'Độ dài tối thiểu phải là 6 kí tự'),
    confirm: yup
      .string()
      .required('Xác nhận lại mật khẩu')
      .oneOf([yup.ref('new')], 'Mật khẩu không trùng nhau'),
  });

  const form = useForm({
    defaultValues: {
      current: '',
      new: '',
      confirm: '',
    },
    resolver: yupResolver(schema),
  });

  let { id } = useParams();
  let history = useHistory();

  // const submit = (e) => {
  //   e.preventDefault();
  //   if (newPassword !== cfPassword) {
  //     Swal.fire({
  //       title: 'Oops...',
  //       text: 'Wrong New Password And Confirm Password Combination',
  //       icon: 'question',
  //       button: 'Done',
  //     });
  //   } else {
  //     props.handleClose();
  //   }
  // };

  const handleSubmit = (values) => {
    console.log(values);
  };

  return (
    <div class="container-change-pass">
      <form method="POST" action="/" onSubmit={form.handleSubmit(handleSubmit)} className="grid">
        <h3>Thay đổi mật khẩu</h3>
        <div className="row">
          <div className="col l-12">
            <DialogContent>
              <PasswordField name="current" label="Mật khẩu hiện tại" form={form} />
              <PasswordField name="new" label="Mật khẩu mới" form={form} />
              <PasswordField name="confirm" label="Xác nhận mật khẩu" form={form} />
            </DialogContent>
          </div>
        </div>
        <div className="row">
          <div className="col l-4 l-o-4">
            <Button variant="contained" type="submit" fullWidth>
              Cập nhật
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default UpdatePass;
