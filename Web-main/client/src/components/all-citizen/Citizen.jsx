import * as React from 'react';
import Cookies from 'js-cookie';
import A1_Citizen from './A1/allCitizen'
import A2_Citizen from './A2/A2_cititizen'
import A3_Citizen from './A3/A3_citizen'
import B1_Citizen from './B1/B1_Citizen'

export default function Citizen() {
  const role = Cookies.get('role')
  if (role === 'A1')
    return <A1_Citizen/>
  else if (role === 'A2') return <A2_Citizen/>
  else if (role === 'A3') return <A3_Citizen/>
  else if (role === 'B1')return <B1_Citizen/>
}
