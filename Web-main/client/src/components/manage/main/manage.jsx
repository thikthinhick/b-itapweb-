import * as React from 'react';
import Cookies from 'js-cookie';
import A1Manage from '../A1/manage';
import A2Manage from '../A2/manage';
import A3Manage from '../A3/manage';
import B1Manage from '../B1/manage';

export default function Citizen() {
  const role = Cookies.get('role');
  if (role === 'A1') return <A1Manage />;
  else if (role === 'A2') return <A2Manage />;
  else if (role === 'A3') return <A3Manage />;
  else return <B1Manage />;
}
