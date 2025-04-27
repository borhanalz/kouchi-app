import { CONFIG } from 'src/global-config';

import ProfileEditInfo from "../../../../../../sections/profile/profile-edit-info";

// ----------------------------------------------------------------------

export const metadata = { title: `${CONFIG.appName} | پروفایل ` };

export default function Page() {
  return <ProfileEditInfo />;
}
