import { RHFCode } from './rhf-code';
import {RHFUpload} from "./rhf-upload";
import {RHFCheckbox} from "./rhf-checkbox";
import { RHFTextField } from './rhf-text-field';
import {RHFRadioGroup} from "./rhf-radio-group";

// ----------------------------------------------------------------------

export const Field = {
  Text: RHFTextField,
  Code: RHFCode,
  RadioGroup: RHFRadioGroup,
  Checkbox: RHFCheckbox,
  Upload: RHFUpload,
};
