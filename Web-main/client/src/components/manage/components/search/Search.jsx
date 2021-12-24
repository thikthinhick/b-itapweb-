import * as React from 'react';
import { makeStyles } from '@mui/styles';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import './styles.scss';

export default function Search(props) {
  return (
    <div className="search-manage">
      <button class="search-button">
        <SearchIcon />
      </button>

      <input type="text" class="input-manage" placeholder="Tìm kiếm..." onChange={props.handler} />
    </div>
  );
}
