'use client'

import {FC} from "react";
import Image from "next/image";
import {useRouter} from "next/navigation";
import italyImg from 'public/assets/images/italy.png'
import canadaImg from 'public/assets/images/canadaFlag.jpg'

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import {useTheme} from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import {Step, StepContent, StepLabel, Stepper} from "@mui/material";

import {DashboardContent} from "src/layouts/dashboard";

import {grey} from "../../../theme";
import {paths} from "../../../routes/paths";
import {Iconify} from "../../../components/iconify";

// ---------------------------------------------------------------------------
interface IRoadSteps {
  countryName:string
}
interface IStepsData {
  id:number,
  label:string,
  description:string,
  icon:string,
  path:string
}
const RoadStepsView:FC<IRoadSteps> = ({countryName}) => {
  const theme = useTheme();
  const activeStep=1;
  const countryLangs= [{en:"canada",fa:"کانادا"},{en:"italy",fa:"ایتالیا"}]
  const faCountryName = countryLangs?.filter((country)=>country.en===countryName).map((selectedCountry)=>selectedCountry.fa);
  const router=useRouter();
  const steps:IStepsData[] = [
    {
      id:1,
      label: 'اماده سازی مدارک',
      description: `تا 8 بهمن - 12 روز`,
      icon:'file',
      path:paths.dashboard.roadMap.prepareDocuments(countryName)
    },
    {
      id:2,
      label: 'انتخاب دانشگاه',
      description:
        'تا 15 بهمن - 19 روز',
      icon:"university",
      path:paths.dashboard.roadMap.prepareDocuments(countryName)
    },
    {
      id:3,
      label: 'ارسال درخواست (اپلای)',
      description: `تا 15 اسفند - 59 روز`,
      icon:"sendFile",
      path:paths.dashboard.roadMap.prepareDocuments(countryName)
    },
    {
      id:4,
      label: 'دریافت پذیرش',
      description: `تا 30 اردیبهشت - 134 روز`,
      icon:"paperLetter",
      path:paths.dashboard.roadMap.prepareDocuments(countryName)
    },
  ];
  return <DashboardContent
    maxWidth={false}
    sx={{display: 'flex', flex: '1 1 auto', flexDirection: 'column'}}
      title={` نقشه راه`}
  >
  <Stack direction='row' justifyContent='left' alignItems='center' spacing={2}>
    <Image src={countryName==="canada"?canadaImg:italyImg} width={60} height={30} alt='country'/>
    <Typography fontWeight='bold' variant='h3'> نقشه راه کارشناسی {faCountryName}</Typography>
  </Stack>
    <Stack mt={5}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
            >
              <Stack direction='row' justifyContent='space-between' sx={{borderRadius:2,p:1.5,border:1,borderColor:grey[300]}} spacing={1}>
               <Stack spacing={1}>
                 <Iconify icon={step?.icon} sx={{width:30,height:30,color:theme.vars.palette.primary.main}}/>
                 <Typography fontWeight='bold'>{step?.label}</Typography>
                 <Typography fontSize={10} color='grey' variant='caption'>{step?.description}</Typography>
                 <Button sx={{mt:2}} variant='contained' color='primary' onClick={()=>router.push(step?.path)} disabled={step?.id!==activeStep}>شروع مسیر</Button>
               </Stack>
                <Iconify icon='doubleChecked' sx={{color:step.id===activeStep?theme.vars.palette.primary.main:"grey"}}/>
              </Stack>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Stack>
  </DashboardContent>
}
export default RoadStepsView;
