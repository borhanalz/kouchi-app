import { useDropzone } from 'react-dropzone';
import { varAlpha, mergeClasses } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Iconify } from '../iconify';
import { uploadClasses } from './classes';

import type { UploadProps } from './types';

// ----------------------------------------------------------------------

export function UploadBox({
  placeholder,
  description,
  error,
  disabled,
  className,
  sx,
  ...other
}: UploadProps) {
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    disabled,
    ...other,
  });

  const hasError = isDragReject || error;

  return (
    <Box
      {...getRootProps()}
      className={mergeClasses([uploadClasses.uploadBox, className])}
      sx={[
        (theme) => ({
          width: '100%',
          height: '100%',
          p: 2,
          flexShrink: 0,
          display: 'flex',
          borderRadius: 1,
          cursor: 'pointer',
          alignItems: 'center',
          color: 'text.disabled',
          fontSize: 12,
          justifyContent: 'center',
          bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
          border: `dashed 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
          ...(isDragActive && { opacity: 0.72 }),
          ...(disabled && { opacity: 0.48, pointerEvents: 'none' }),
          ...(hasError && {
            color: 'error.main',
            borderColor: 'error.main',
            bgcolor: varAlpha(theme.vars.palette.error.mainChannel, 0.08),
          }),
          '&:hover': { opacity: 0.72 },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <input {...getInputProps()} />
      <Stack textAlign="center" alignItems="center">
        <Typography>{placeholder}</Typography>
        <Iconify icon="upload" width={28} sx={{ my: 1.5 }} />
        <Typography color="grey" variant="caption">
          {description}
        </Typography>
      </Stack>
    </Box>
  );
}
