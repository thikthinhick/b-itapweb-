import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import {useState, useEffect } from "react";

export default function Search(props) {
  const [idCitizen, setIdCitizen] = useState('')
  useEffect(()=> {
    setIdCitizen('')
  }, [props.change])
  return (
    <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Tìm kiếm theo CCCD/CMND"
        value = {idCitizen}
        onChange = {e => setIdCitizen(e.target.value)}
        // inputProps={{ 'aria-label': 'search google maps' }}
      />
      <IconButton  sx={{ p: '10px' }} aria-label="search">
        <SearchIcon onClick = {e => props.search(idCitizen)}/>
      </IconButton>
   
    </Paper>
  );
}