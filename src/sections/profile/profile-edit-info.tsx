'use client';

import {z as zod} from "zod";
import {toast} from "sonner";
import {useEffect} from "react";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm, useFieldArray} from "react-hook-form";
import {useMutation, useQuery} from "@tanstack/react-query";

import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

import {endpoints} from "../../hooks/endPoints";
import {Field, Form} from "../../components/hook-form";
import IconText from "../../components/icon-text/icon-text";
import {EditCreateRequest, GetRequest} from "../../lib/axios";
import {
  IApiEditUserDetail,
  IApiUserDetails,
  IEditUserDetailFormData,
  IUserDetailFormData,
} from "../../types/user";
import {LoadingScreen} from "../../components/loading-screen";

// -----------------------------------------------------------------------
const profileEditInfoSchema = zod.object({
  age: zod.preprocess(
    (a) => Number(a),
    zod.number().min(18, "حداقل سن 18 سال میباشد")
  ),
  gender: zod.enum(["male", "female"], {
    errorMap: () => ({message: "جنسیت معتبر نیست"}),
  }),
  married: zod.boolean(),
  militaryStatus: zod.string().min(2, {
    message: "لطفا وضعیت سربازی خود را مشخص کنید",
  }),
  graduations: zod.array(
    zod.object({
      university: zod.string().min(1, "دانشگاه الزامی است"),
      degree: zod.string().min(1, "مقطع الزامی است"),
      field: zod.string().min(1, "رشته الزامی است"),
      GPA: zod.preprocess(
        (a) => Number(a),
        zod.number().min(1, "معدل خود را به درستی وارد کنید")
      ),
      graduated: zod.boolean().optional(),
    })
  ),
  languageCertificates: zod.array(
    zod.object({
      type: zod.string().min(1, "نوع مدرک الزامی است"),
      totalScore: zod.preprocess(
        (a) => Number(a),
        zod.number().min(1, "نمره overall را به درستی وارد کنید")
      ),
      speakingScore:zod.preprocess(
        (a) => Number(a),
        zod.number().min(1, "نمره speaking را به درستی وارد کنید")
      ),
      listeningScore: zod.preprocess(
        (a) => Number(a),
        zod.number().min(1, "نمره listening را به درستی وارد کنید")
      ),
      writingScore: zod.preprocess(
        (a) => Number(a),
        zod.number().min(1, "نمره writing را به درستی وارد کنید")
      ),
      readingScore: zod.preprocess(
        (a) => Number(a),
        zod.number().min(1, "نمره reading را به درستی وارد کنید")
      ),
    })
  ),
});

const ProfileEditInfo = () => {
  // Fetch user details via react-query
  const {data: userDetails,isPending:userDetailsPending} = useQuery({
    queryKey: ["get-user-info-detail"],
    queryFn: () =>
      GetRequest<IApiUserDetails>(endpoints.PROFILE.DETAIL_INFO),
  });

  const methods = useForm<IUserDetailFormData>({
    resolver: zodResolver(profileEditInfoSchema),
    defaultValues: {
      age: 0,
      gender: "male",
      married: false,
      militaryStatus: "",
      graduations: [],
      languageCertificates: [],
    },
  });
  const {handleSubmit, control, reset} = methods;

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
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Stack mt={5} spacing={5}>
      {userDetailsPending?<LoadingScreen/>: <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack direction="column" spacing={3}>
          <IconText
            typographyProps={{fontWeight: "bold", variant: "h4"}}
            iconifySx={{width: 25, height: 25}}
            label="اطلاعات پایه"
            icon="profile"
          />
          <Field.Text type="number" name="age" label="سن"/>
          <Field.Text name="militaryStatus" label="وضعیت معافیت"/>
          <Field.RadioGroup
            row
            name="gender"
            label="جنسیت"
            options={[
              {label: "مرد", value: "male"},
              {label: "زن", value: "female"},
            ]}
          />
          <Field.RadioGroup
            row
            name="married"
            label="وضعیت تعهل"
            options={[
              {label: "مجرد", value: false},
              {label: "متعهل", value: true},
            ]}
          />
          <Divider/>
          <IconText
            typographyProps={{fontWeight: "bold", variant: "h4"}}
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
                  name={`graduations.${index}.GPA`}
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
                <Button onClick={() => remove(index)} color="error">
                  حذف
                </Button>
              </Grid>
            </Grid>
          ))}
          <Button
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
          >
            افزودن اطلاعات تحصیلی
          </Button>
          <Divider/>
          <IconText
            typographyProps={{fontWeight: "bold", variant: "h4"}}
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
                  name={`languageCertificates.${index}.totalScore`}
                  label="نمره overall"
                />
              </Grid>
              <Grid size={6}>
                <Field.Text
                  name={`languageCertificates.${index}.speakingScore`}
                  label="نمره Speaking"
                />
              </Grid>
              <Grid size={6}>
                <Field.Text
                  name={`languageCertificates.${index}.listeningScore`}
                  label="نمره Listening"
                />
              </Grid>
              <Grid size={6}>
                <Field.Text
                  name={`languageCertificates.${index}.writingScore`}
                  label="نمره Writing"
                />
              </Grid>
              <Grid size={6}>
                <Field.Text
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
                <Button onClick={() => removeLanguage(index)} color="error">
                  حذف زبان
                </Button>
              </Grid>
            </Grid>
          ))}
          <Button
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
          >
            افزودن اطلاعات زبان
          </Button>
          <Button type="submit" variant="contained" loading={isPending}>
            ثبت اطلاعات
          </Button>
        </Stack>
      </Form>}
    </Stack>
  );
};

export default ProfileEditInfo;
