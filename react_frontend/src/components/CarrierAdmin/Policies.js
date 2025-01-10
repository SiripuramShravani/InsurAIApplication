import React from 'react';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';
import { styled } from '@mui/system';

const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: theme.shadows[3],
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(2),
  },
}));

const ResponsiveTypography = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.875rem',
  },
  [theme.breakpoints.up('sm')]: {
    fontSize: '1rem',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '1.25rem',
  },
}));

export default function Policies(){
    return (
        <Box sx={{ flexGrow: 1, padding: 2 }}>
          <Grid container spacing={2}>
            {['Card 1', 'Card 2', 'Card 3'].map((card, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <StyledCard>
                  <CardContent>
                    <ResponsiveTypography variant="h5" component="div">
                      {card}
                    </ResponsiveTypography>
                    <ResponsiveTypography variant="body2" color="text.secondary">
                      This is some sample text inside the card. It will adjust its size according to the screen size.
                    </ResponsiveTypography>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        </Box>
      );
    
}
