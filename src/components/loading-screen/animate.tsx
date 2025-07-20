import Lottie from "lottie-react";
import { useEffect, useState } from "react";

import { Box, useTheme, Typography, Stack } from "@mui/material";

import darkLoading from "src/components/loading-screen/dark-loading.json";
import lightLoading from "src/components/loading-screen/light-loading.json";

import {Iconify} from "../iconify";

const loadingMessages = [
  { text: "در حال پردازش پیام شما", range: null },
  { text: "در حال بررسی مشخصات شما", range: null },
  { text: "در حال جستجوی منابع معتبر", range: null },
  { text: "پردازش", range: [2, 4] },
  { text: "پردازش", range: [4, 6] },
  { text: "پردازش", range: [7, 8] },
  { text: "تحلیلی جستجوها و نتیجه‌گیری", range: null },
  { text: "پردازش نهایی پاسخ", range: null },
];

const getRandomMessage = (step: number) => {
  const item = loadingMessages[step];
  if (item.range) {
    const [min, max] = item.range;
    const randNum = Math.floor(Math.random() * (max - min + 1)) + min;
    return `${item.text} (${randNum}) منبع`;
  }
  return item.text;
};

const LgAnimateLoading = ({isChatLoading=false}:{isChatLoading?:boolean}) => {
  const theme = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [message, setMessage] = useState(getRandomMessage(0));

  useEffect(() => {
    if (currentStep >= loadingMessages.length - 1) return;

    const timeout = Math.floor(Math.random() * (18000 - 12000 + 1)) + 12000;

    const timer = setTimeout(() => {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setMessage(getRandomMessage(nextStep));
    }, timeout);

    return () => clearTimeout(timer);
  }, [currentStep]);

  return (
    <Stack spacing={2} alignItems="center">
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "137px",
          width: "200px",
          backgroundColor:
            theme.palette.mode === "dark" ? theme.palette.grey[800] : "#fff",
          zIndex: 9999,
        }}
      >
        <Lottie
          style={{ height: 150 }}
          animationData={
            theme?.palette.mode === "dark" ? darkLoading : lightLoading
          }
          loop
        />
      </Box>
      {isChatLoading&&<Stack direction='row' alignItems="center" spacing={1}>
        <Typography color={theme.palette.grey[500]} variant="body1" sx={{textAlign: "center"}}>
          {message}
        </Typography>
        <Iconify sx={{color: theme.palette.grey[500]}} icon='spinner'/>
      </Stack>}
    </Stack>
  );
};

export default LgAnimateLoading;
