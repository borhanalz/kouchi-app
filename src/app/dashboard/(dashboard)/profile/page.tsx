import { CONFIG } from 'src/global-config';

import ProfileView from "src/sections/profile/view/profile-view";

// ----------------------------------------------------------------------

export const metadata = { title: `${CONFIG.appName} | پروفایل ` };

export default function Page() {
  return <ProfileView />;
}
