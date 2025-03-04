'use client';

import { useState, useEffect } from 'react';

import { Box, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';

export interface OtpTimerProps {
  time: number;
  onTimeOut?: () => void;
  onReset: () => void;
}

function getTimerString(time: number): string {
  return `${Math.floor(time / 60)
    .toString()
    .padStart(2, '0')}:${time % 60}`;
}

function OtpTimer({ time, onTimeOut, onReset }: OtpTimerProps) {
  const [remainingTime, setRemainingTime] = useState(time);
  const [showTimer, setShowTimer] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      if (remainingTime > 0) {
        setRemainingTime((oldValue) => oldValue - 1);
      } else {
        // onTimeOut();
        setShowTimer(false);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [onTimeOut, remainingTime]);

  const handleResent = () => {
    setRemainingTime(time);
    setShowTimer(true);
    onReset();
  };

  const renderResend = () => (
    <Box
      onClick={handleResent}
      display="flex"
      alignItems="center"
      color={(theme) => theme.vars.palette.primary.darker}
      sx={{ cursor: 'pointer' }}
    >
      <Iconify icon="refresh" sx={{ width: 16, height: 16, mr: 1 }} />
      <Typography variant="subtitle2">ارسال مجدد کد</Typography>
    </Box>
  );

  const renderTimer = () => (
    <Typography variant="subtitle2">{getTimerString(remainingTime)} تا ارسال مجدد کد</Typography>
  );

  return (
    <Box display="flex" justifyContent="center">
      {showTimer && renderTimer()}
      {!showTimer && renderResend()}
    </Box>
  );
}

export default OtpTimer;
