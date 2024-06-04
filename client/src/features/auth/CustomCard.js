import React from 'react';
import { Card, CardContent, Typography, Box, ButtonBase } from '@mui/material';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';

const StyledCard = styled(Card)({
  width: 300,
  height: 300,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  transition: 'transform 0.3s, opacity 0.3s',
  opacity: 0.9,
  '&:hover': {
    transform: 'translateY(-10px)',
    opacity: 1,
  },
  animation: 'fadeIn 0.3s ease-in',
  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to: { opacity: 0.9 },
  },
});

const IconBox = styled(Box)({
  fontSize: 50,
  marginBottom: 10,
});

const CustomCard = ({ role, description, icon, link }) => {
  return (
    <ButtonBase component={Link} to={link} sx={{ width: '100%' }}>
      <StyledCard>
        <CardContent>
          <IconBox>{icon}</IconBox>
          <Typography variant="h5" component="div">
            {role}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </StyledCard>
    </ButtonBase>
  );
};

export default CustomCard;
