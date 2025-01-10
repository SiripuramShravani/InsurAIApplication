import React, { useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select, FormHelperText, OutlinedInput, TextField } from '@mui/material';

export const InputField = ({ label, name, value, onChange, regex, placeholder }) => {
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { value: inputValue } = e.target;
    onChange(name, inputValue);
    setError(inputValue && !regex.test(inputValue) ? `Enter a valid ${label}` : '');
  };

  return (
    <TextField
      error={Boolean(error)}
      label={label}
      variant="outlined"
      fullWidth
      margin="normal"
      name={name}
      value={value}
      onChange={handleInputChange}
      helperText={error}
      placeholder={placeholder}
    />
  );
};

export const SelectField = ({ label, name, value, onChange, options }) => {
  const [error, setError] = useState('');

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    onChange(name, selectedValue);
    setError(selectedValue ? '' : `Please select a ${label}`);
  };

  return (
    <FormControl fullWidth margin="normal" error={Boolean(error)}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={handleSelectChange}
        input={<OutlinedInput label={label} />}
        MenuProps={{ style: { maxHeight: 300 } }}
        sx={{ 
          '& .MuiSelect-select': { textAlign: 'left' },          
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};
