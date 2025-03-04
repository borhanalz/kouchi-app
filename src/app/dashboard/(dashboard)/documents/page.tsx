import { CONFIG } from 'src/global-config';

import DocumentsView from 'src/sections/documents/view/documents-view';

// ----------------------------------------------------------------------

export const metadata = { title: `${CONFIG.appName} |  لیست مدارک ` };

export default function Page() {
  return <DocumentsView />;
}
