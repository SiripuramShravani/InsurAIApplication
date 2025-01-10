import React from 'react';
import { TextField } from '@mui/material';

const CustomTextField = ({
  id,
  label,
  value, 
  onChange, // Add onChange
  required,
}) => {

  const isRequired = required !== 'notrequired'

  return (
    <TextField
      id={id}
      name={id} // Add name 
      label={label}
      variant="standard"
      value={value} // Add value
      onChange={onChange} // Pass onChange
      fullWidth
      required={required} 
      InputLabelProps={{ shrink: true }}
      InputProps={{
        sx: {
          '&:before': {
            borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
          },
          '&:hover:not(.Mui-disabled):before': {
            borderBottom: '1px solid rgba(0, 0, 0, 0.87)',
          },
          '&.Mui-focused:after': {
            borderBottom: '2px solid rgba(0, 0, 0, 0.87)',
          },
        },
      }}
    />
  );
};

export default CustomTextField;