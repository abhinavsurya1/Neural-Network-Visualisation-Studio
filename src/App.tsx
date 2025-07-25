import React from 'react';
import { ThemeProvider, CssBaseline, Box, Container, Typography } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import NeuralNetwork from './components/NeuralNetwork';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default'
      }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: 4
          }}>
            <Typography variant="h3" component="h1" gutterBottom>
              Neural Network Visualization Studio
            </Typography>
            <Box sx={{ height: '600px' }}>
              <NeuralNetwork />
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App; 