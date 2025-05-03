'use client';

import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {useBoolean} from 'minimal-shared/hooks';

import Link from '@mui/material/Link';
import Grid from "@mui/material/Grid2";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import {useTheme} from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import {Iconify} from 'src/components/iconify';
import IconText from 'src/components/icon-text/icon-text';

import {grey} from '../../../theme';
import {GetRequest} from "../../../lib/axios";
import {endpoints} from "../../../hooks/endPoints";
import ProPackagesPeyment from '../pro-packages-peyment';
import {DashboardContent} from "../../../layouts/dashboard";
import {toPersianNumber} from "../../../utils/persian-number";

import type {IApiServices, IService} from "../../../types/services";

// ------------------------------------------------------------------------------

export const ProPackages = () => {
  const theme = useTheme();
  const peymentDialog = useBoolean();
  const [paymentInfo, setPaymentInfo] = useState<IService|null>(null);

  const {data: ServicesList, isPending} = useQuery({
    queryKey: ['services-list'],
    queryFn: () => GetRequest<IApiServices>(endpoints.SERVICES.LIST)
  })
  return (
    <DashboardContent
        maxWidth={false}
        sx={{
          display: "flex",
          flex: "1 1 auto",
          flexDirection: "column"
        }}
        title='بسته های کوچی'
      >
        <Stack
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Grid
            container
            spacing={5}
            sx={{height: '100%'}}
          >
            {ServicesList?.services?.map((item) => (
              <Grid size={{xs:12,md:6,lg:4}} sx={{display:'flex'}}>
                <Stack
                  spacing={3}
                  sx={{
                    border: 1,
                    width:'100%',
                    borderColor: theme.palette.mode === "dark" ? theme.vars.palette.grey[800] : theme.vars.palette.grey[300],
                    borderRadius: 2,
                    p: 3,
                  }}
                >
                  <Stack direction="row" justifyContent="space-between">
                    <Stack spacing={2}>
                      <Typography fontWeight="bolder" variant="h6" textAlign="left">
                        {item?.title}
                      </Typography>
                      <Typography variant="body2" color={grey[500]}>
                        {item?.subtitle}
                      </Typography>
                    </Stack>
                    <Iconify
                      icon={item?.id}
                      sx={{color: theme.vars.palette.secondary.main, width: 35, height: 35}}
                    />
                  </Stack>
                  <Stack direction="row" justifyContent="end" spacing={0.5}>
                    <Typography fontWeight="bolder" variant="h4">
                      {toPersianNumber(item?.prices?.regular?.toLocaleString())}
                    </Typography>
                    <Typography variant="body2" sx={{mt: 1}}>
                       تومان
                    </Typography>
                  </Stack>
                  <Divider sx={{borderStyle: 'dashed'}}/>
                  <Stack
                    direction="column"
                    spacing={2}
                    sx={{
                      flexGrow: 1,
                    }}
                  >
                    {item?.features?.map((feature) => (
                      <IconText
                        key={feature}
                        icon="tick"
                        label={feature}
                        typographyProps={{color: theme.vars.palette.primary.main,textAlign:'left'}}
                        iconifySx={{color: theme.vars.palette.primary.main}}
                      />
                    ))}
                  </Stack>
                  <Grid container spacing={2}>
                    {item?.buttons?.map((button) => (<Grid size={12}>
                      <Button fullWidth variant="contained" color="primary" onClick={()=>{
                        setPaymentInfo({...item,buttons:[button]})
                        peymentDialog.onTrue();
                      }}>
                        {button?.text}
                      </Button></Grid>))}
                  </Grid>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Stack>
        <ProPackagesPeyment dialog={peymentDialog} data={paymentInfo as IService}/>
      </DashboardContent>
  );
};

export default ProPackages;
