import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import { Box, useTheme, Typography, Stack, LinearProgress } from "@mui/material";
import darkLoading from "src/components/loading-screen/dark-loading.json";
import lightLoading from "src/components/loading-screen/light-loading.json";
import { Iconify } from "../iconify";

const loadingMessages = [
  { text: "در حال پردازش پیام شما", range: null },
  { text: "در حال بررسی مشخصات شما", range: null },
  { text: "🔍 در حال جستوجوی منابع معتبر", range: null },
  { text: "پردازش", range: [2, 4] },
  { text: "پردازش", range: [4, 6] },
  { text: "پردازش", range: [7, 8] },
  { text: "تحلیلی جستجوها و نتیجه‌گیری", range: null },
  { text: "پردازش نهایی پاسخ", range: null },
];

const getRandomMessage = (step: number) => {
  const item = loadingMessages[step] ?? { text: "نتیجه‌گیری مجدد", range: null };
  if (item.range) {
    const [min, max] = item.range;
    const randNum = Math.floor(Math.random() * (max - min + 1)) + min;
    return `${item.text} ${randNum} منبع`;
  }
  return item.text;
};

const LgAnimateLoading = ({ isChatLoading = false }: { isChatLoading?: boolean }) => {
  const theme = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [message, setMessage] = useState(getRandomMessage(0));
  const [startTime, setStartTime] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  // Step messages
  useEffect(() => {
    if (!isChatLoading) return;

    const timeout = Math.floor(Math.random() * (8000 - 6000 + 1)) + 6000;

    const timer = setTimeout(() => {
      const nextStep = currentStep + 1;
      const isBeyondLastStep = nextStep >= loadingMessages.length;

      setCurrentStep(isBeyondLastStep ? loadingMessages.length : nextStep);
      setMessage(getRandomMessage(isBeyondLastStep ? loadingMessages.length : nextStep));
    }, timeout);

    return () => clearTimeout(timer);
  }, [currentStep, isChatLoading]);

  // Progress bar logic
  useEffect(() => {
    if (isChatLoading) {
      if (!startTime) setStartTime(Date.now());

      const interval = setInterval(() => {
        const elapsed = Date.now() - (startTime ?? Date.now());
        const percent = Math.min((elapsed / 60000) * 90, 90); // 90% in 60 seconds
        setProgress(percent);
      }, 500);

      return () => clearInterval(interval);
    } else {
      setProgress(100); // When finished
    }
  }, [isChatLoading, startTime]);

  return (
    <Stack spacing={2} alignItems={isChatLoading?"start":"center"} width="100%">
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

      {isChatLoading && (
        <Stack spacing={1} alignItems="center" sx={{ width: 200 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ height: 6, borderRadius: 4, width: '100%' }}
          />
          {/*<Typography*/}
          {/*  variant="caption"*/}
          {/*  color="text.secondary"*/}
          {/*  sx={{ textAlign: "center" }}*/}
          {/*>*/}
          {/*  {`${Math.round(progress)}٪`}*/}
          {/*</Typography>*/}
        </Stack>
      )}

      {isChatLoading && (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography
            color={theme.palette.grey[500]}
            variant="body1"
            sx={{ textAlign: "center" }}
          >
            {message}
          </Typography>
          <Iconify sx={{ color: theme.palette.grey[500] }} icon="spinner" />
        </Stack>
      )}
    </Stack>
  );
};

export default LgAnimateLoading;
