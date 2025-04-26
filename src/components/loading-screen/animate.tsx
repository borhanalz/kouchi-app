import Lottie from 'lottie-react';

import { Box, useTheme } from '@mui/material';

import lightLoading from 'src/components/loading-screen/light-loading.json'
import darkLoading from 'src/components/loading-screen/dark-loading.json'

// -------------------------------------------------------------

const LgAnimateLoading = () => {
  const theme = useTheme();
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'left',
          alignItems: 'left',
          height: '200px',
          width: '200px',
          backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#ffff', // Optional background color
          zIndex: 9999,
        }}
      >
        <Lottie size={150} animationData={theme?.palette.mode==="dark"?darkLoading:lightLoading} loop />
      </Box>
    </>
  );
};
export default LgAnimateLoading;
