import { CONFIG } from 'src/global-config';

import RoadMapView from "../../../sections/road-map/view";

// ----------------------------------------------------------------------

export const metadata = { title: `${CONFIG.appName} |  نقشه راه ` };

export default function Page() {
  return <RoadMapView/>;
}
