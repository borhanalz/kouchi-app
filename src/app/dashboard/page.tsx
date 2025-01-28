import { CONFIG } from 'src/global-config';

import { BlankView } from 'src/sections/blank/view';
import ChatView from "../../sections/chat/view";

// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <ChatView/>;
}
