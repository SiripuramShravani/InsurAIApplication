import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

const CustomCheckbox = ({
  label,
  checked,
  onChange,
  color = 'primary',
  ...props
}) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          onChange={onChange}
          color={color}
          sx={{
            color: '#000000',
            '&.Mui-checked': {
              color: '#0B70FF',
            },
            '& .MuiSvgIcon-root': {
              fontSize: 24,
            },
          }}
          {...props}
        />
      }
      label={label}
    />
  );
};

export default CustomCheckbox;
