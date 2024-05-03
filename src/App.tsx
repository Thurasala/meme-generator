import React from 'react';
import { Box, Typography } from '@mui/material';
import MemeGenerator from './Components/MemeGenerator';
import './App.css';

function App() {
  return (
    <Box className="App">
      <Typography sx={{fontSize: {
      lg: 40,md: 30, sm: 25,xs: 20 }}}>Meme Generator</Typography>
    
      <MemeGenerator />
    </Box>
  );
}

export default App;
