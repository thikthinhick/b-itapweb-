// import { DataGrid } from '@mui/x-data-grid';
import * as React from 'react';
// import './styles.scss';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { useEffect } from "react";

const ITEM_HEIGHT = 60;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 300,
    },
  },
};

export default function SelectItem(props) {
  const [itemName, setItemName] = React.useState([]);
  useEffect(()=> {
    setItemName([])
  }, [props.names])
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    if (value.indexOf('Chọn tất cả') > -1) {
      if (props.names.length === itemName.length) {
        setItemName([]);
        props.changeItem([], props.item)
      } else {
        setItemName(props.names);
        props.changeItem(props.names, props.item)
      }
    } else {
      setItemName(
        // On autofill we get a the stringified value.
        typeof value === 'string' ? value.split(',') : value
      );
      props.changeItem( typeof value === 'string' ? value.split(',') : value, props.item)
    }
  };
  
  return (
    <FormControl sx={{ m: 2, width: 200 }}>
      <InputLabel id="demo-multiple-checkbox-label">Chọn {props.label}</InputLabel>
      <Select
        labelId="demo-multiple-checkbox-label"
        id="demo-multiple-checkbox"
        multiple
        value={itemName}
        onChange={handleChange}
        input={<OutlinedInput label= {`Chọn ${props.label}`} />}
        renderValue={(selected) =>
          selected.length === props.names.length ? 'Chọn tất cả' : selected.join(', ')
        }
        MenuProps={MenuProps}
      >
        <MenuItem key="all" value="Chọn tất cả">
          <Checkbox checked={itemName.length === props.names.length} />
          <ListItemText primary="Chọn tất cả" />
        </MenuItem>
        {props.names.map((name) => 
        (
          <MenuItem key={name} value={name}>
            <Checkbox checked={itemName.indexOf(name) > -1} value = {name}/>
            <ListItemText primary={name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
