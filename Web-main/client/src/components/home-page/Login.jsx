import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@mui/material/Button';
import axios from 'axios';
import Cookies from 'js-cookie';
import React from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import * as yup from 'yup';
import logoUrl from '../../constants/images/logo.png';
import InputField from '../form-control/inputField/inputField';
import PasswordField from '../form-control/passwordField/passwordField';
import './styles.scss';
import '../../grid.scss';

function Login() {
  const schema = yup.object().shape({
    username: yup
      .string()
      .required('Bạn chưa điền tên đăng nhập')
      .test('Độ dài', 'Tên đăng nhập không hợp lệ', (value) => {
        return value.length % 2 === 0 && value.length >= 2 && value.length <= 8;
      }),
    password: yup.string().required('Bạn chưa điền mật khẩu'),
  });

  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    resolver: yupResolver(schema),
  });

  const handleSubmit = (values) => {
    const data = values;
    axios.post('http://localhost:3001/account/login', data).then((response) => {
      console.log(response.data);
      if (response.data.error) {
        Swal.fire({
          title: 'Oops...',
          text: response.data.error,
          icon: 'question',
          button: 'Done',
        });
      } else {
        Cookies.set('user', response.data.username, {
          //expires: new Date(new Date(Date.now()).getTime() + 60*60 * 1000),
          expires: 1 / 2,
          secure: true,
        });
        Cookies.set('token', response.data.accessToken, { expires: 1 / 2, secure: true });
        Cookies.set('role', response.data.role, { expires: 1 / 2, secure: true });
        window.location.reload();
      }
    });
  };

  return (
    <div class="container-login">
      
      <div style={{textAlign: 'center', fontSize: '40px', fontFamily: 'Roboto', }}>HỆ THỐNG ĐIỀU TRA DÂN SỐ</div>
     

      <div className="row">
        <div className="col l-4 l-o-4 m-6 m-o-3 c-12">
          <div class="login-input">
            <form
              method="POST"
              action="/login"
              onSubmit={form.handleSubmit(handleSubmit)}
              className="login-form"
            >
              <InputField name="username" label="Username" form={form} />
              <PasswordField name="password" label="Password" form={form} />
              <div style={{display: 'flex', justifyContent: 'center'}}>
                <Button
                //disabled={isSubmitting}
                type="submit"
                color=""
                variant="contained"
                size="medium"
              >
                Đăng nhập
              </Button>
              </div>
              
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
