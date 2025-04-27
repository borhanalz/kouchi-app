'use client'

import { CONFIG } from 'src/global-config';

import {ErrorView} from "../sections/error/error";

// ----------------------------------------------------------------------

export const metadata = { title: `404 page not found! | Error - ${CONFIG.appName}` };

export default function Error() {
  return <ErrorView />;
}
