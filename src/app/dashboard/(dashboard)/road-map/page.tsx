import { CONFIG } from 'src/global-config';

import RoadMapView from 'src/sections/road-map/view';

// ----------------------------------------------------------------------

export const metadata = { title: `${CONFIG.appName} |  نقشه راه ` };

export default function Page() {
  return <RoadMapView />;
}
