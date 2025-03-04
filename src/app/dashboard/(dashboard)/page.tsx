import { CONFIG } from 'src/global-config';

import ChatView from '../../../sections/chat/view';

// ----------------------------------------------------------------------

export const metadata = { title: `${CONFIG.appName} |  گفت و گو با کوچی ` };

export default function Page() {
  return <ChatView />;
}
