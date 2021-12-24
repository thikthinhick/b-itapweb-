import * as React from 'react';
import Cookies from 'js-cookie';
import A_Task from '../tasks'
import B_Task from '../taskB1'

export default function Citizen() {
  const role = Cookies.get('role')
  if (role.indexOf('A') === 0)
    return <A_Task/>
  else if (role === 'B1') return <B_Task/>
}
