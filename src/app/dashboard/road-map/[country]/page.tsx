import { CONFIG } from 'src/global-config';

import RoadStepsView from "../../../../sections/road-map/road-steps/road-steps";

// ----------------------------------------------------------------------

export const metadata = { title: `${CONFIG.appName} |  نقشه راه ` };

export default function Page({params}:{params:{country:string}}) {
  return <RoadStepsView countryName={params.country}/>;
}
