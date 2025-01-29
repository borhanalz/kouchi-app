import type {SxProps} from "@mui/material/styles";
import type {TypographyProps} from "@mui/material/Typography";

import { Stack, Typography } from '@mui/material';

import { Iconify } from '../iconify';
// ----------------------------------------------------------------------
type IconTextType = {
  icon:string,
  label:string,
  typographyProps?:TypographyProps,
  iconifySx?:SxProps
}
// ----------------------------------------------------------------------------
function IconText({ icon, label,typographyProps,iconifySx }:IconTextType) {
  return (
    <Stack direction="row" textAlign='center' alignItems='center' spacing={1}>
      <Iconify sx={{ width: 18, height: 18,...iconifySx }} icon={icon} />
      <Typography variant='body2' fontWeight="bold" {...typographyProps}>
        {label}
      </Typography>
    </Stack>
  );
}

export default IconText;
