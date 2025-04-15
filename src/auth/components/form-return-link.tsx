import Link from 'next/link';

import { LinkProps } from '@mui/material/Link';

import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';
import Stack from '@mui/material/Stack';
import {useTheme} from "@mui/material/styles";

// ----------------------------------------------------------------------

type FormReturnLinkProps = LinkProps & {
  href?: string;
  icon?: React.ReactNode;
  label?: React.ReactNode;
};

export function FormReturnLink({ sx, href, label, icon, children, ...other }: FormReturnLinkProps) {
  const theme = useTheme();
  return (
    <Link
      component={RouterLink}
      href={href??''}
      variant="subtitle2"
      style={{
        textDecoration: 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color:theme?.palette?.secondary?.main,
      }}
      {...other}
    >
      {label || 'بازگشت'}
      {icon || <Iconify sx={{ width: 12, height: 12 }} icon="arrowHeadLeft" />}
      {children}
    </Link>
  );
}
