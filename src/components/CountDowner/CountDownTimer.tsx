'use client'


import {useEffect, useState} from "react";
import dayjs from "dayjs";
import {toPersianNumber} from "../../utils/persian-number";
import Typography from "@mui/material/Typography";
import {Iconify} from "../iconify";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

const CountDownTimer = ({ target }: { target: string }) => {

  const [remaining, setRemaining] = useState('');
const [day, setday] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      const now = dayjs();
      const end = dayjs(target);

      if (end.isBefore(now)) {
        setRemaining('پایان یافته');
        clearInterval(interval);
        return;
      }

      const diff = dayjs.duration(end.diff(now));
      const days = diff.days();
      const hours = diff.hours().toString().padStart(2, '0');
      const minutes = diff.minutes().toString().padStart(2, '0');
      const seconds = diff.seconds().toString().padStart(2, '0');

      setday(days as number);
      setRemaining(`${toPersianNumber(hours)}:${toPersianNumber(minutes)}:${toPersianNumber(seconds)}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [target]);

  return (
    <Stack sx={{border:1,borderColor: 'error.main',borderRadius:'8px',py:2,px:0}} alignItems='center' spacing={0.5} justifyContent='center'>
      <Typography
        variant='body2'
        sx={{
          color: 'error.main',
          fontSize: '17px',
          textAlign: 'center',
        }}
      >
        {day>0?`فرصت باقی مانده ${day} روز`:`فرصت باقی مانده`}
      </Typography>
      <Stack direction='row' alignItems='center' spacing={0.5} justifyContent='center'>
        <Iconify icon='timer' sx={{color:'error.main'}}/>
        <Typography
          variant='h5'
          sx={{
            fontWeight: 'bold',
            color: 'error.main',
            fontSize: '40px',
            textAlign: 'center',
          }}
        >
          {remaining}
        </Typography>
      </Stack>
    </Stack>
  );
};
export default CountDownTimer;
