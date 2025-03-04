import type { UseBooleanReturn } from 'minimal-shared';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { DialogActions, DialogContent, DialogTitle } from '@mui/material';

import { Field, Form } from '../../components/hook-form';
import { UploadBox } from '../../components/upload';
// -------------------------------------------------------------------------------------------
type FormData = zod.infer<typeof schema>;
const schema = zod.object({
  title: zod.string().min(1, { message: 'Email is required!' }),
  status: zod.string().min(1, { message: 'Password is required!' }),
});
const TicketsCreateDialog = ({ dialogStatus }: { dialogStatus: UseBooleanReturn }) => {
  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <Dialog open={dialogStatus.value} onClose={dialogStatus.onFalse} fullWidth>
      <DialogTitle>
        <Typography variant="h4">تیکت جدید</Typography>
      </DialogTitle>
      <DialogContent
        sx={{
          p: 3,
        }}
      >
        <Form methods={methods}>
          <Stack spacing={2} p={2}>
            <Field.Text name="title" label="عنوان تیکت: مثلا درخواست چک کردن مدارک" />
            <Field.Text multiline rows={4} name="status" label="متن درخواست" />
            <UploadBox
              placeholder="فایل مورد نظر را اینجا رها کنید."
              description="یا برای بارگذاری  اینجا کلیک کنید."
            />
          </Stack>
        </Form>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={dialogStatus.onFalse} color="error">
          لغو
        </Button>
        <Button variant="contained" color="primary">
          ثبت
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default TicketsCreateDialog;
