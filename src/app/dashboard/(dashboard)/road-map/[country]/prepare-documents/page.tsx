import { CONFIG } from 'src/global-config';

import PrepareDocuments from 'src/sections/road-map/road-steps/prepare-documents/prepare-documents';

// ----------------------------------------------------------------------

export const metadata = { title: `${CONFIG.appName} |  اماده سازی مدارک ` };

export default function Page({ params }: { params: { country: string } }) {
  return <PrepareDocuments countryName={params.country} />;
}
