'use client';

import {z as zod} from "zod";
import {toast} from "sonner";
import {useState, useEffect} from "react";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm, useFieldArray} from "react-hook-form";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";

import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import LoadingButton from "@mui/lab/LoadingButton";

import {endpoints} from "../../hooks/endPoints";
import {Iconify} from "../../components/iconify";
import {Form, Field} from "../../components/hook-form";
import IconText from "../../components/icon-text/icon-text";
import {GetRequest, EditCreateRequest} from "../../lib/axios";
import {LoadingScreen} from "../../components/loading-screen";

import type {
  IApiUserDetails,
  IApiEditUserDetail,
  IUserDetailFormData,
  IEditUserDetailFormData,
} from "../../types/user";

// -----------------------------------------------------------------------
const profileEditInfoSchema = zod.object({
  age: zod.preprocess(
    (a) => a === "" || a === null ? null : Number(a),
    zod.number().nullable().optional()
  ),
  gender: zod.enum(["male", "female"], {
    errorMap: () => ({message: "جنسیت معتبر نیست"}),
  }).optional(),
  married: zod.preprocess(
    (val) => val === null || val === undefined ? undefined : (val === 'true' || val === true),
    zod.boolean().optional()
  ),
  militaryStatus: zod.string()
    .min(2, {message: "لطفا وضعیت سربازی خود را مشخص کنید"})
    .nullable()
    .optional(),
  graduations: zod.array(
    zod.object({
      university: zod.string().min(1, "دانشگاه الزامی است").optional(),
      degree: zod.string().min(1, "مقطع الزامی است").optional(),
      field: zod.string().min(1, "رشته الزامی است").optional(),
      average: zod.preprocess(
        (a) => a === "" || a === null ? null : Number(a),
        zod.number().min(1, "معدل خود را به درستی وارد کنید").nullable().optional()
      ),
      graduated: zod.boolean().optional(),
    })
  ).optional(),
  languageCertificates: zod.array(
    zod.object({
      type: zod.string().min(1, "نوع مدرک الزامی است").optional(),
      totalScore: zod.preprocess(
        (a) => a === "" || a === null ? null : Number(a),
        zod.number().min(1, "نمره overall را به درستی وارد کنید").nullable().optional()
      ),
      speakingScore: zod.preprocess(
        (a) => a === "" || a === null ? null : Number(a),
        zod.number().min(1, "نمره speaking را به درستی وارد کنید").nullable().optional()
      ),
      listeningScore: zod.preprocess(
        (a) => a === "" || a === null ? null : Number(a),
        zod.number().min(1, "نمره listening را به درستی وارد کنید").nullable().optional()
      ),
      writingScore: zod.preprocess(
        (a) => a === "" || a === null ? null : Number(a),
        zod.number().min(1, "نمره writing را به درستی وارد کنید").nullable().optional()
      ),
      readingScore: zod.preprocess(
        (a) => a === "" || a === null ? null : Number(a),
        zod.number().min(1, "نمره reading را به درستی وارد کنید").nullable().optional()
      ),
    })
  ).optional(),
});

const ProfileEditInfo = () => {
  const [gender, setGender] = useState<"male"|"female">('male');
  const queryClient = useQueryClient();

  const {data: userDetails,isPending:userDetailsPending} = useQuery({
    queryKey: ["get-user-info-detail"],
    queryFn: () =>
      GetRequest<IApiUserDetails>(endpoints.PROFILE.DETAIL_INFO),
  });

  const methods = useForm<IUserDetailFormData>({
    resolver: zodResolver(profileEditInfoSchema),
    defaultValues: {
      age: null,
      gender: "male",
      married: false,
      militaryStatus: "",
      graduations: [],
      languageCertificates: [],
    },
  });
  const {handleSubmit, control, reset,setValue} = methods;

  useEffect(() => {
    if (userDetails?.details?.userData) {
      reset(userDetails.details.userData);
    }
  }, [userDetails, reset]);

  const {fields: graduationFields, append, remove} = useFieldArray({
    control,
    name: "graduations",
  });

  const {
    fields: languageFields,
    append: appendLanguage,
    remove: removeLanguage,
  } = useFieldArray({
    control,
    name: "languageCertificates",
  });

  const {mutateAsync, isPending} = useMutation({
    mutationKey: ["edit-info-details"],
    mutationFn: (payload: IEditUserDetailFormData) =>
      EditCreateRequest<IEditUserDetailFormData, IApiEditUserDetail>(
        endpoints.PROFILE.DETAIL_INFO,
        payload,
        undefined,
        "put"
      ),
  });

  const onSubmit = async (data: IUserDetailFormData) => {
    try {
      await mutateAsync({userData: data});
      toast.success("ویرایش با موفقیت انجام شد");
      await queryClient.invalidateQueries({queryKey:["get-user-info-detail"]})
    } catch (e:any) {
      toast.error(e.message);
    }
  };
  console.log(userDetails)
  return (
    <Stack mt={5} spacing={5}>
      {userDetailsPending?<LoadingScreen/>: <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack direction="column" spacing={3}>
          <IconText
            typographyProps={{fontWeight: "bold", variant: "h6"}}
            iconifySx={{width: 25, height: 25}}
            label="اطلاعات پایه"
            icon="profile"
          />
          <Field.Text type="number" name="age" label="سن"/>
          <Field.RadioGroup
            row
            name="gender"
            label="جنسیت"
            onChange={(e) => {
              setValue("gender", e.target.value as "male" | "female");
            }}
            options={[
              { label: "مرد", value: "male" },
              { label: "زن", value: "female" },
            ]}
          />

          <Field.Text name="militaryStatus" label="وضعیت معافیت" disabled={gender==="female"}/>
          <Field.RadioGroup
            row
            name="married"
            label="وضعیت تاهل"
            options={[
              {label: "مجرد", value: false},
              {label: "متاهل", value: true},
            ]}
          />
          <Divider/>
          <IconText
            typographyProps={{fontWeight: "bold", variant: "h6"}}
            iconifySx={{width: 25, height: 25}}
            label="اطلاعات تحصیلی"
            icon="graduate"
          />
          {graduationFields.map((field, index) => (
            <Grid container spacing={2} key={field.id} sx={{mb: 2}}>
              <Grid size={6}>
                <Field.Text
                  name={`graduations.${index}.university`}
                  label="دانشگاه"
                />
              </Grid>
              <Grid size={6}>
                <Field.Text
                  name={`graduations.${index}.degree`}
                  label="مقطع"
                />
              </Grid>
              <Grid size={6}>
                <Field.Text name={`graduations.${index}.field`} label="رشته"/>
              </Grid>
              <Grid size={6}>
                <Field.Text
                  type="number"
                  name={`graduations.${index}.average`}
                  label="معدل"
                />
              </Grid>
              <Grid size={6}>
                <Field.Checkbox
                  name={`graduations.${index}.graduated`}
                  label="فارغ التحصیل شدم"
                />
              </Grid>
              <Grid
                size={6}
                display="flex"
                alignItems="center"
                justifyContent="flex-end"
              >
                <LoadingButton startIcon={<Iconify icon='trash'/>} onClick={() => remove(index)} color="error">
                  حذف
                </LoadingButton>
              </Grid>
            </Grid>
          ))}
          <Stack direction='row' justifyContent='left'>
            <LoadingButton
              onClick={() =>
                append({
                  university: "",
                  degree: "",
                  field: "",
                  GPA: 0,
                  graduated: false,
                })
              }
              variant="outlined"
              color='secondary'
              fullWidth={false}
              startIcon={<Iconify icon='plus' sx={{width:15}} />}
            >
              {graduationFields?.length>0?'افرودن مدرک تحصیلی دیگر':'افزودن مدرک تحصیلی'}
            </LoadingButton>
          </Stack>
          <Divider/>
          <IconText
            typographyProps={{fontWeight: "bold", variant: "h6"}}
            iconifySx={{width: 25, height: 25}}
            label="اطلاعات مدارک زبان"
            icon="a-letter"
          />
          {languageFields.map((field, index) => (
            <Grid container spacing={2} key={field.id} sx={{mb: 2}}>
              <Grid size={6}>
                <Field.Text
                  name={`languageCertificates.${index}.type`}
                  label="نوع مدرک"
                />
              </Grid>
              <Grid size={6}>
                <Field.Text
                  type='number'
                  name={`languageCertificates.${index}.totalScore`}
                  label="نمره overall"
                />
              </Grid>
              <Grid size={6}>
                <Field.Text
                  type='number'
                  name={`languageCertificates.${index}.speakingScore`}
                  label="نمره Speaking"
                />
              </Grid>
              <Grid size={6}>
                <Field.Text
                  type='number'
                  name={`languageCertificates.${index}.listeningScore`}
                  label="نمره Listening"
                />
              </Grid>
              <Grid size={6}>
                <Field.Text
                  type='number'
                  name={`languageCertificates.${index}.writingScore`}
                  label="نمره Writing"
                />
              </Grid>
              <Grid size={6}>
                <Field.Text
                  type='number'
                  name={`languageCertificates.${index}.readingScore`}
                  label="نمره Reading"
                />
              </Grid>
              <Grid
                size={12}
                display="flex"
                alignItems="center"
                justifyContent="flex-end"
              >
                <LoadingButton startIcon={<Iconify icon='trash'/>} onClick={() => removeLanguage(index)} color="error">
                  حذف
                </LoadingButton>
              </Grid>
            </Grid>
          ))}
          <Stack direction='row' justifyContent='left'>
            <LoadingButton
              onClick={() =>
                appendLanguage({
                  language: "",
                  totalScore: 0,
                  speakingScore: 0,
                  listeningScore: 0,
                  writingScore: 0,
                  readingScore: 0,
                })
              }
              variant="outlined"
              color='secondary'
              fullWidth={false}
              startIcon={<Iconify icon='plus' sx={{width:15}} />}
            >
              {languageFields?.length>=1?'افرودن مدرک زبان دیگر':'افزودن مدرک زبان'}

            </LoadingButton>
          </Stack>
          <Stack direction='row' justifyContent='right'>
          <LoadingButton type="submit" variant="contained" color='primary' loading={isPending}>
            ذخیره اطلاعات
          </LoadingButton>
          </Stack>
        </Stack>
      </Form>}
    </Stack>
  );
};

export default ProfileEditInfo;
