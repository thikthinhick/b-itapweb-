import './app.scss';
import { Route, Switch, Redirect } from 'react-router';
import HomePage from './components/home-page/home-page';
import { roleA } from './constants/listItem';
import Login from './components/home-page/Login';
import Cookies from 'js-cookie';
import { useState } from 'react';
import ProtectedRoute from './ProtectedRoute';
import RedirectRoute from './RedirectRoute';
import axios from 'axios';

function App() {
  var auth = Cookies.get('user');
  const [user, setUser] = useState(null);
  if (auth) auth = '';
  const [isAuth, setIsAuth] = useState(Cookies.get('user'));

  axios.interceptors.request.use((config) => {
    config.headers.Authorization = Cookies.get('token');
    return config;
  });

  
  //const [id, setId] = useState(localStorage.getItem("id"))
  return (
    <div className="App">
      <Switch>
        <Redirect from="/" to="/trangchu" exact></Redirect>
        <RedirectRoute path="/login" exact component={Login} isAuth={isAuth} />
        <ProtectedRoute path="/" isAuth={isAuth}>
          {/* <HomePage listItems={roleA} /> */}
        </ProtectedRoute>
      </Switch>
    </div>
  );
}

export default App;
