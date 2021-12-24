// import { DataGrid } from '@mui/x-data-grid';
import * as React from 'react';
// import './styles.scss';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 3 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
// const names = ['Quê quán', 'Địa chỉ thường trú', 'Địa chỉ tạm trú']
export default function SelectItem(props) {
  const [itemName, setItemName] = React.useState('');
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    props.changeItem(value, props.item);
    if (value.indexOf('All') > -1) {
      if (props.names.length === itemName.length) {
        setItemName([]);
        // props.changeItem([], props.item)
      } else {
        setItemName(props.names);
        // props.changeItem(props.names, props.item)
      }
    } else {
      setItemName(
        // On autofill we get a the stringified value.
        typeof value === 'string' ? value.split(',') : value
      );
      //   props.changeItem( typeof value === 'string' ? value.split(',') : value, props.item)
    }
  };
  return (
    <FormControl>
      <InputLabel>Chọn {props.label}</InputLabel>
      <Select
        value={itemName}
        onChange={handleChange}
        input={<OutlinedInput label={`Chọn ${props.label}`} />}
        // renderValue={(selected) =>
        //   selected.length === props.names.length ? 'All' : selected.join(', ')
        // }
        MenuProps={MenuProps}
      >
        {/* <MenuItem key="all" value="All">
          <Checkbox checked={itemName.length === props.names.length} />
          <ListItemText primary="All" />
        </MenuItem> */}
        {props.names.map((name) => (
          <MenuItem key={name} value={name}>
            {/* <Checkbox checked={itemName.indexOf(name) > -1} value = {name}/> */}
            <ListItemText primary={name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
