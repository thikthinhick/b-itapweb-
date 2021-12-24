import * as React from 'react';
import Input from '@mui/material/Input';
import TableCell from '@mui/material/TableCell';

export default function CustomTableCell(props) {
  const { isEditMode } = props.source;
  return (
    <TableCell>
      {isEditMode ? (
        <Input
          value={props.source[props.name]}
          name={props.name}
          onChange={(e) => props.handleOnChange(e, props.source)}
        />
      ) : (
        props.source[props.name]
      )}
    </TableCell>
  );
}
