'use client'

import {FC} from "react";
import Image from "next/image";
import italyImg from 'public/assets/images/italy.png'
import canadaImg from 'public/assets/images/canadaFlag.jpg'

import Stack from "@mui/material/Stack";
import {useTheme} from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import {DashboardContent} from "src/layouts/dashboard";
import {Accordion, AccordionDetails, AccordionSummary, Step, StepLabel, Stepper} from "@mui/material";
import {ArrowDropDownIcon} from "@mui/x-date-pickers";
import {Iconify} from "../../../../components/iconify";
import {grey} from "../../../../theme";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import {paths} from "../../../../routes/paths";
import {useRouter} from "next/navigation";

// ---------------------------------------------------------------------------
interface IPrepareDocuments{
  countryName:string
}

const PrepareDocumentsView:FC<IPrepareDocuments> = ({countryName}) => {
  const theme = useTheme();
  const router = useRouter();
  const activeStep=1;
  const countryLangs= [{en:"canada",fa:"کانادا"},{en:"italy",fa:"ایتالیا"}]
  const faCountryName = countryLangs?.filter((country)=>country.en===countryName).map((selectedCountry)=>selectedCountry.fa);
  const steps = [
    {
      id:1,
      label: 'اماده سازی مدارک',
      description: `تا 8 بهمن - 12 روز`,
      icon:'file',
      path:paths.dashboard.roadMap.prepareDocuments(countryName)
    }
  ];
  return <DashboardContent
    maxWidth={false}
    sx={{display: 'flex', flex: '1 1 auto', flexDirection: 'column'}}
    title="اماده سازی مدارک"
  >
    <Stack direction='row' justifyContent='left' alignItems='center' spacing={2}>
      <Image src={countryName==="canada"?canadaImg:italyImg} width={60} height={30} alt='country'/>
      <Typography fontWeight='bold' variant='h3'> نقشه راه کارشناسی {faCountryName}</Typography>
    </Stack>
            <Stack direction='row' justifyContent='space-between' sx={{borderRadius:2,p:1.5,border:1,borderColor:grey[300],mt:5}} spacing={1}>
              <Stack spacing={1}>
                <Iconify icon='file' sx={{width:30,height:30,color:theme.vars.palette.primary.main}}/>
                <Typography fontWeight='bold'>اماده سازی مدارک</Typography>
                <Typography fontSize={10} color='grey' variant='caption'>تا 8 بهمن - 12 روز</Typography>
                <Accordion sx={{mt:5}}>
                  <AccordionSummary
                    expandIcon={<Iconify icon='arrowDown' />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                    sx={{backgroundColor:grey[200],borderRadius:1}}
                  >
                    <Typography component="span" variant='h5'>مدرک زبان</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>چون بیشتر از 6 ماه از زمان دریافت مدرکت گذشته باید دوباره اقدام کنی، ایندفعه می‌تونی بیشتر روی اسپیکینگ کار کنی چون روی شانس ویزا شدن تاثیر می‌زاره.</Typography>
                    <Stack direction='row' spacing={2} mt={3}>
                      <Button variant='contained'>اضافه کردن به کارها</Button>
                      <Button variant='outlined'>سوال دارم</Button>
                    </Stack>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<Iconify icon='arrowDown' />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                    sx={{backgroundColor:grey[200],borderRadius:1}}
                  >
                    <Typography component="span" variant='h5'>مدارک تحصیلی</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={1}>
                      <Stack sx={{border:1,borderRadius:2,p:2,borderColor:grey[400]}}>
                        <Typography variant='body1'>مدرک تحصیلی دیپلم</Typography>
                        <Stack direction='row' spacing={2} mt={3}>
                          <Button variant='contained'>اضافه کردن به کارها</Button>
                          <Button variant='contained' color='primary'>دارم</Button>
                          <Button variant='outlined'>سوال دارم</Button>
                        </Stack>
                      </Stack>
                      <Stack sx={{border:1,borderRadius:2,p:2,borderColor:grey[400]}}>
                        <Typography variant='body1'>ریز نمرات پیش دانشگاهی</Typography>
                        <Stack direction='row' spacing={2} mt={3}>
                          <Button variant='contained'>اضافه کردن به کارها</Button>
                          <Button variant='contained' color='primary'>دارم</Button>
                          <Button variant='outlined'>سوال دارم</Button>
                        </Stack>
                      </Stack>
                    </Stack>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<Iconify icon='arrowDown' />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                    sx={{backgroundColor:grey[200],borderRadius:1}}
                  >
                    <Typography component="span" variant='h5'>رزومه</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={1}>
                      <Stack sx={{border:1,borderRadius:2,p:2,borderColor:grey[400]}}>
                        <Typography variant='body1'>رزومه</Typography>
                        <Stack direction='row' spacing={2} mt={3}>
                          <Button variant='contained'>اضافه کردن به کارها</Button>
                          <Button variant='contained' color='primary'>دارم</Button>
                          <Button variant='outlined'>سوال دارم</Button>
                        </Stack>
                      </Stack>
                      <Stack sx={{border:1,borderRadius:2,p:2,borderColor:grey[400]}}>
                        <Typography variant='body1'>انگیزه نامه (SOP)</Typography>
                        <Stack direction='row' spacing={2} mt={3}>
                          <Button variant='contained'>اضافه کردن به کارها</Button>
                          <Button variant='contained' color='primary'>دارم</Button>
                          <Button variant='outlined'>سوال دارم</Button>
                        </Stack>
                      </Stack>
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              </Stack>
            </Stack>
  </DashboardContent>
}
export default PrepareDocumentsView;
