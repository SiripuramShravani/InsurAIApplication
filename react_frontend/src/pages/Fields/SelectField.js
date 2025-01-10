import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const SelectField = ({
  label,
  value,
  onChange, 
  options,
  required,
  labelId,
  name,
  autoComplete,
  fontSize, // Add fontSize prop
  disabled, 
}) => {
  const isRequired = required !== 'notrequired';

  return (
    <FormControl fullWidth variant="standard">
      <InputLabel
        id={labelId}
        sx={{
          fontSize: '0.775rem', 
        }}
        required={isRequired} 
      >
        {label} 
      </InputLabel>
      <Select
        labelId={labelId}
        id={name}
        name={name}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}   
        disabled={disabled} // Pass disabled prop here     
        sx={{
          '&:before': {
            borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
          },
          '&:hover:not(.Mui-disabled):before': {
            borderBottom: '1px solid rgba(0, 0, 0, 0.87)',
          },
          '&.Mui-focused:after': {
            borderBottom: '2px solid rgba(0, 0, 0, 0.87)',
          },
          '& .MuiSelect-select': { // Target the displayed value element
            textAlign: 'left',
            padding: '0rem 0rem 0.3rem 0rem',
            fontSize: fontSize || '13px', // Apply fontSize here 
          },
        }}
        MenuProps={{
          style: {
            maxHeight: 350,
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectField;