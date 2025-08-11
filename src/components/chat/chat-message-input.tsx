'use client'

import type {IApiUserDetails, IUserDetailFormData} from 'src/types/user';

import { toast } from "sonner";
import { z as zod } from 'zod';
import { usePathname } from "next/navigation";
import { zodResolver } from '@hookform/resolvers/zod';
import React, {useRef, useState, useEffect, useCallback} from 'react';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import {useTheme} from "@mui/material/styles";
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { useAppSelector } from 'src/lib/redux/hooks';
import { AccountButton } from 'src/layouts/components/account-button';

import { Field } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { DeleteButton, SingleFilePreview } from 'src/components/upload/components/preview-single-file';

import { endpoints } from '../../hooks/endPoints';
import { CustomPopover } from '../custom-popover';
import {GetRequest, EditCreateRequest} from '../../lib/axios';

import type { IChat } from "../../types/chat";
import type { ITicketResponse } from "../../types/tickets";

//----------------------------------------------------------------------------------
type Props = {
  isNewTicket?: boolean;
  isTicket: boolean;
  HandleChatResponse: () => void;
  addChatResponsePending: boolean;
  isChatLoading: boolean;
  setChatMessage?: any;
  chatMessage?: string;
  messages: ITicketResponse[] | IChat[];
};

// --------------------------------------------------------------------------------
// Profile schema (copy from ProfileEditInfo)
const profileEditInfoSchema = zod.object({
  age: zod.preprocess(
    (a) => a === '' || a === null ? null : Number(a),
    zod.number().nullable().optional()
  ),
  married: zod.preprocess(
    (val) => val === null || val === undefined ? undefined : (val === 'true' || val === true),
    zod.boolean().optional()
  ),
  graduations: zod.array(
    zod.object({
      university: zod.string().min(1, 'دانشگاه الزامی است').optional(),
      degree: zod.string().min(1, 'مقطع الزامی است').optional(),
      field: zod.string().min(1, 'رشته الزامی است').optional(),
      average: zod.preprocess(
        (a) => a === '' || a === null ? null : Number(a),
        zod.number().min(1, 'معدل خود را به درستی وارد کنید').nullable().optional()
      ),
      graduated: zod.boolean().optional(),
    })
  ).optional(),
  languageCertificates: zod.array(
    zod.object({
      type: zod.string().min(1, 'نوع مدرک الزامی است').optional(),
      totalScore: zod.preprocess(
        (a) => a === '' || a === null ? null : Number(a),
        zod.number().min(1, 'نمره overall را به درستی وارد کنید').nullable().optional()
      ),
      speakingScore: zod.preprocess(
        (a) => a === '' || a === null ? null : Number(a),
        zod.number().min(1, 'نمره speaking را به درستی وارد کنید').nullable().optional()
      ),
      listeningScore: zod.preprocess(
        (a) => a === '' || a === null ? null : Number(a),
        zod.number().min(1, 'نمره listening را به درستی وارد کنید').nullable().optional()
      ),
      writingScore: zod.preprocess(
        (a) => a === '' || a === null ? null : Number(a),
        zod.number().min(1, 'نمره writing را به درستی وارد کنید').nullable().optional()
      ),
      readingScore: zod.preprocess(
        (a) => a === '' || a === null ? null : Number(a),
        zod.number().min(1, 'نمره reading را به درستی وارد کنید').nullable().optional()
      ),
    })
  ).optional(),
});

// --------------------------------------------------------------------------------
export function ChatMessageInput({
                                   isNewTicket = true,
                                   isChatLoading,
                                   addChatResponsePending,
                                   isTicket,
                                   HandleChatResponse,
                                   setChatMessage,
                                   chatMessage,
                                   messages
                                 }: Props) {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const theme = useTheme();

  const fileRef = useRef<HTMLInputElement>(null);
  const attachmentButtonRef = useRef<HTMLButtonElement | null>(null);
  const ticketId = pathname?.split("/")[3];
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [popoverAnchor, setPopoverAnchor] = useState<null | HTMLElement>(null);
  const latestMessage: any = messages[messages?.length - 1];
  const disableInput = !isTicket && latestMessage?.options?.length > 0;

  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);
  const { data: userInfo, isPending: userDetailsPending }:any = useQuery({
    queryKey: ["get-user-info-detail"],
    queryFn: () => GetRequest<IApiUserDetails>(endpoints.PROFILE.DETAIL_INFO),
  });
  const user = useAppSelector((state) => state.userReducer.info);
  const defaultValues: IUserDetailFormData = {
    age: null,
    married: false,
    graduations: [],
    languageCertificates: [],
  };

  const methods = useForm<IUserDetailFormData>({
    resolver: zodResolver(profileEditInfoSchema),
    defaultValues,
  });

  const { control, handleSubmit, reset, setValue, watch } = methods;

  const {
    fields: graduationFields,
    append: appendGraduation,
    remove: removeGraduation,
    replace: graduationReplace,
  } = useFieldArray<IUserDetailFormData, 'graduations'>({
    control,
    name: 'graduations',
  });
  const {
    fields: languageFields,
    append: appendLanguage,
    remove: removeLanguage,
    replace: languageReplace,
  }:any = useFieldArray<IUserDetailFormData, 'languageCertificates'>({
    control,
    name: 'languageCertificates',
  });

  const { mutateAsync: saveProfile, isPending: profileLoading }:any = useMutation({
    mutationKey: ['edit-info-details'],
    mutationFn: (payload) =>
      EditCreateRequest(
        endpoints.PROFILE.DETAIL_INFO,
        { userData: payload },
        undefined,
        'put'
      ),
  });

  const handleOpenProfile = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchor(event.currentTarget);
  };
  const handleCloseProfile = () => {
    setProfileAnchor(null);
  };

  const onSubmitProfile = async (data: IUserDetailFormData) => {
    try {
      await saveProfile(data);
      toast.success('پروفایل با موفقیت ذخیره شد');
      await queryClient.invalidateQueries({ queryKey: ["get-user-info-detail"] });
    } catch (e: any) {
      toast.error('خطا در ذخیره پروفایل');
    }
  };

  const handleAttach = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setPopoverAnchor(event.currentTarget);
    if (fileRef.current) {
      fileRef.current.click();
    }
  }, []);

  const handleClosePopover = useCallback(() => {
    setPopoverAnchor(null);
  }, []);

  const handleChangeMessage = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (isTicket) {
      setMessage(event.target.value);
    } else {
      setChatMessage(event.target.value);
    }
  }, [isTicket, setChatMessage]);

  const handleSendResponse = useCallback(async () => {
    if (message.trim() || chatMessage?.trim() !== '') {
      try {
        if (isTicket) {
          toast.error('ارسال پاسخ تیکت پیاده‌سازی نشده است');
        } else {
          await HandleChatResponse();
        }
        setMessage('');
        setFile(null);
      } catch (e) {
        toast.error('ارسال پیام با خطا مواجه شد');
      }
    } else {
      toast.error('لطفا پیغام خود را وارد کنید');
    }
  }, [message, isTicket, ticketId, HandleChatResponse, file, chatMessage]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendResponse();
    }
  }, [handleSendResponse]);


  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
    }
  }, []);

  const handleRemoveFile = useCallback(() => {
    setFile(null);
    handleClosePopover();
  }, [handleClosePopover]);

  useEffect(() => {
    if (userInfo?.payload?.details?.userData) {
      const userData = userInfo?.payload?.details.userData;

      // Reset form with user data
      reset({
        age: userData.age || null,
        married: userData.married || false,
        graduations: userData.graduations || [],
        languageCertificates: userData.languageCertificates || [],
      });

      if (userData.graduations && userData.graduations.length > 0) {
        graduationReplace(userData.graduations);
      } else {
        graduationReplace([]);
      }

      if (userData.languageCertificates && userData.languageCertificates.length > 0) {
        languageReplace(userData.languageCertificates);
      } else {
        languageReplace([]);
      }
    }
  }, [userInfo, reset, graduationReplace, languageReplace]);
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1,p:1 }}>
        <AccountButton
          displayName={user?.name || ''}
          onClick={handleOpenProfile}
          height={32}
          width={32}
        />
        <Typography sx={{ ml: 1, fontWeight: 500 }}>{user?.name}</Typography>
      </Box>
      <CustomPopover
        open={Boolean(profileAnchor)}
        anchorEl={profileAnchor}
        onClose={handleCloseProfile}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { width: 350, maxHeight: {xs:400,md:600}, overflowY: 'auto',p:3 } } }}
      >
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmitProfile)}>
            <Stack spacing={2}>
              <Stack
                mb={2}
                direction="row"
                alignItems="center"
                sx={{ position: 'relative' }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    mx: 'auto',
                  }}
                >
                  ویرایش پروفایل
                </Typography>

                <IconButton  sx={{
                  position: 'absolute',
                  left: 0,
                }} onClick={handleCloseProfile}>
                  <Iconify
                    icon="close"
                  />
                </IconButton>
              </Stack>

              <Field.Text type="number" name="age" label="سن" />
              <Field.RadioGroup
                row
                name="married"
                label="وضعیت تاهل"
                options={[
                  { label: 'مجرد', value: false },
                  { label: 'متاهل', value: true },
                ]}
              />
              <Divider />
              <Typography variant="subtitle2">اطلاعات تحصیلی</Typography>
              {graduationFields.map((field, index) => (
                <Grid container spacing={1} key={field.id} sx={{ mb: 1 }}>
                  <Grid size={6}>
                    <Field.Text name={`graduations.${index}.university`} label="دانشگاه" />
                  </Grid>
                  <Grid size={6}>
                    <Field.Text name={`graduations.${index}.degree`} label="مقطع" />
                  </Grid>
                  <Grid size={6}>
                    <Field.Text name={`graduations.${index}.field`} label="رشته" />
                  </Grid>
                  <Grid size={6}>
                    <Field.Text type="number" name={`graduations.${index}.average`} label="معدل" />
                  </Grid>
                  <Grid size={6}>
                    <Field.Checkbox name={`graduations.${index}.graduated`} label="فارغ التحصیل شدم" />
                  </Grid>
                  <Grid size={6} display="flex" alignItems="center" justifyContent="flex-end">
                    <LoadingButton size="small" color="error" onClick={() => removeGraduation(index)}>
                      حذف
                    </LoadingButton>
                  </Grid>
                </Grid>
              ))}
              <LoadingButton
                onClick={() =>
                  appendGraduation({
                    university: '',
                    degree: '',
                    field: '',
                    average: null,
                    graduated: false,
                  })
                }
                variant="outlined"
                color="secondary"
                fullWidth={false}
                size="small"
              >
                {graduationFields.length > 0 ? 'افزودن مدرک تحصیلی دیگر' : 'افزودن مدرک تحصیلی'}
              </LoadingButton>
              <Divider />
              <Typography variant="subtitle2">اطلاعات مدارک زبان</Typography>
              {languageFields.map((field:any, index:number) => (
                <Grid container spacing={1} key={field.id} sx={{ mb: 1 }}>
                  <Grid size={6}>
                    <Field.Text name={`languageCertificates.${index}.type`} label="نوع مدرک" />
                  </Grid>
                  <Grid size={6}>
                    <Field.Text type="number" name={`languageCertificates.${index}.totalScore`} label="نمره overall" />
                  </Grid>
                  <Grid size={6}>
                    <Field.Text type="number" name={`languageCertificates.${index}.speakingScore`} label="نمره Speaking" />
                  </Grid>
                  <Grid size={6}>
                    <Field.Text type="number" name={`languageCertificates.${index}.listeningScore`} label="نمره Listening" />
                  </Grid>
                  <Grid size={6}>
                    <Field.Text type="number" name={`languageCertificates.${index}.writingScore`} label="نمره Writing" />
                  </Grid>
                  <Grid size={6}>
                    <Field.Text type="number" name={`languageCertificates.${index}.readingScore`} label="نمره Reading" />
                  </Grid>
                  <Grid size={12} display="flex" alignItems="center" justifyContent="flex-end">
                    <LoadingButton size="small" color="error" onClick={() => removeLanguage(index)}>
                      حذف
                    </LoadingButton>
                  </Grid>
                </Grid>
              ))}
              <LoadingButton
                onClick={() =>
                  appendLanguage({
                    type: '',
                    totalScore: null,
                    speakingScore: null,
                    listeningScore: null,
                    writingScore: null,
                    readingScore: null,
                  })
                }
                variant="outlined"
                color="secondary"
                fullWidth={false}
                size="small"
              >
                {languageFields.length > 0 ? 'افزودن مدرک زبان دیگر' : 'افزودن مدرک زبان'}
              </LoadingButton>
              <LoadingButton
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                loading={profileLoading}
              >
                ذخیره اطلاعات
              </LoadingButton>
            </Stack>
          </form>
        </FormProvider>
      </CustomPopover>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          borderTop: (BoxTheme) => `1px solid ${BoxTheme.palette.divider}`,
          backgroundColor:theme.palette?.grey[100],
          borderRadius: 4,
          border:'none',
          px: 1,
          py: 0.5,
        }}
      >
        <IconButton
          onClick={handleSendResponse}
          disabled={isChatLoading || addChatResponsePending}
        >
          {addChatResponsePending ? (
            <Iconify icon="circularLoading" />
          ) : (
            <Iconify icon="send" />
          )}
        </IconButton>

        <TextField
          multiline
          maxRows={4}
          fullWidth
          variant="standard"
          value={isTicket ? message : chatMessage}
          onChange={handleChangeMessage}
          onKeyDown={handleKeyDown}
          disabled={isChatLoading}
          placeholder="سوالت رو اینجا بنویس..."
          InputProps={{
            disableUnderline: true,
            sx: {
              px: 1,
              py: 0.5,
              display: 'flex',
              alignItems: 'center',
              '& textarea': {
                resize: 'none',
                minHeight: '40px',
                maxHeight: '120px',
                overflowY: 'auto !important',
                paddingTop: '10px', // this helps center it vertically
              },
            },
          }}
        />


        {isTicket && (
          <IconButton
            ref={attachmentButtonRef}
            onClick={handleAttach}
            disabled={addChatResponsePending || disableInput}
          >
            <Iconify icon="attachment" />
          </IconButton>
        )}
      </Box>

      <CustomPopover
        open={Boolean(popoverAnchor)}
        anchorEl={popoverAnchor}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        sx={{ mt: -2 }}
        slotProps={{ arrow: { placement: 'bottom-center' } }}
      >
        {file ? (
          <Box sx={{ position: 'relative', p: 1, width: 100, height: 100 }}>
            <SingleFilePreview file={file} />
            <DeleteButton onClick={handleRemoveFile} />
          </Box>
        ) : (
          <Box sx={{ p: 2, fontSize: '14px' }}>فایلی انتخاب نشده است !</Box>
        )}
      </CustomPopover>

      <input
        type="file"
        ref={fileRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        disabled={addChatResponsePending}
      />
    </>
  );
}
