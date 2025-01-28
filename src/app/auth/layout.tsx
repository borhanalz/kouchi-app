import { AuthSplitLayout } from 'src/layouts/auth-split';

import { GuestGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
  auth: React.ReactNode;
};

export default function Layout({ auth }: Props) {
  return (
    <GuestGuard>
      <AuthSplitLayout>{auth}</AuthSplitLayout>
    </GuestGuard>
  );
}
