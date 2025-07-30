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
import CountDownTimer from "../../../components/CountDowner/CountDownTimer";

// ------------------------------------------------------------------------------

export const ProPackages = () => {
  const theme = useTheme();
  const peymentDialog = useBoolean();
  const [paymentInfo, setPaymentInfo] = useState<IService|null>(null);
  const {data: ServicesList, isPending} = useQuery({
    queryKey: ['services-list'],
    queryFn: () => GetRequest<IApiServices>(endpoints.SERVICES.LIST)
  })
  console.log(ServicesList)
  return (
    <DashboardContent
        maxWidth={false}
        sx={{
          display: "flex",
          flex: "1 1 auto",
          flexDirection: "column"
        }}
        title='سرویس‌های کوچی'
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
            {ServicesList?.services?.map((item) => {
              if (item?.hide) return null; // فقط آیتم‌هایی که hide=true هستن رو نشون بده

              return (
                <Grid key={item.id} size={{xs: 12, md: 6, lg: 4}} sx={{display: 'flex'}}>
                  <Stack
                    spacing={3}
                    sx={{
                      border: 1,
                      width: '100%',
                      borderColor: theme.palette.mode === "dark"
                        ? theme.vars.palette.grey[800]
                        : theme.vars.palette.grey[300],
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

                    <Stack spacing={4}>
                      {item?.prices?.map((priceItem, i) => (
                        <Stack key={i} alignItems="center" direction="row" justifyContent="space-between">
                          <Typography color={theme?.palette?.grey[600]}>
                            {priceItem?.text}
                          </Typography>
                          <Stack direction="column" alignItems="center" spacing={1}>
                            {priceItem?.price && (
                              <Stack direction="row" alignItems="center" spacing={0.5}>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    textDecoration:
                                      priceItem?.sale && Number(priceItem?.sale) !== 0
                                        ? 'line-through'
                                        : 'none',
                                    color: theme.palette.grey[500],
                                  }}
                                >
                                  {toPersianNumber(Number(priceItem.price).toLocaleString())}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{mt: 0.3}}>
                                  تومان
                                </Typography>
                              </Stack>
                            )}
                            {priceItem?.sale && Number(priceItem?.sale) !== 0 && (
                              <Stack direction="row" alignItems="center" justifyContent="center">
                                <Typography fontWeight="bold" variant="h6">
                                  {toPersianNumber(Number(priceItem?.sale).toLocaleString())}
                                </Typography>
                                <Typography variant="body2">تومان</Typography>
                              </Stack>
                            )}
                          </Stack>
                        </Stack>
                      ))}
                    </Stack>

                    {item?.countDown && (
                      <CountDownTimer target={item.countDown}/>
                    )}

                    <Divider sx={{borderStyle: 'dashed'}}/>

                    <Stack direction="column" spacing={2} sx={{flexGrow: 1}}>
                      {item?.features?.map((feature, i) => (
                        <IconText
                          key={i}
                          icon="tick"
                          label={feature}
                          typographyProps={{
                            color: theme?.palette.mode !== "dark"
                              ? theme.vars.palette.primary.main
                              : '#fff',
                            textAlign: 'left'
                          }}
                          iconifySx={{color: theme.vars.palette.primary.main}}
                        />
                      ))}
                    </Stack>

                    <Grid container spacing={2}>
                      {item?.buttons?.map((button, i) => (
                        <Grid size={12}>
                          <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={() => {
                              setPaymentInfo({...item, buttons: [button]});
                              peymentDialog.onTrue();
                            }}
                          >
                            {button?.text}
                          </Button>
                        </Grid>
                      ))}
                    </Grid>
                  </Stack>
                </Grid>
              );
            })}

          </Grid>
        </Stack>
        <ProPackagesPeyment dialog={peymentDialog} data={paymentInfo as IService}/>
      </DashboardContent>
  );
};

export default ProPackages;
