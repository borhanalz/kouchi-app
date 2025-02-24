import type {ReactNode} from "react";
import type { QueryOptions } from '@tanstack/react-query';

import { dehydrate, HydrationBoundary as RQHydrationBoundary } from '@tanstack/react-query';

import {GetQueryClient} from "./query-client";
// ----------------------------------------------------------------------------------------------
interface HydrationBoundaryProps {
  children: ReactNode;
  queries?: {
    queryKey: QueryOptions['queryKey'];
    queryFn: QueryOptions['queryFn'];
  }[];
}
// --------------------------------------------------------------------------------------------------
const HydrationBoundry = async({children,queries}:HydrationBoundaryProps)=>{
  const queryClient = GetQueryClient();

  const prefetches = queries?.map((query) =>
    queryClient.prefetchQuery({
      queryKey: query.queryKey!,
      queryFn: query.queryFn,
    })
  );

  if (prefetches) {
    await Promise.all(prefetches);
  }

  return <RQHydrationBoundary state={dehydrate(queryClient)}>{children}</RQHydrationBoundary>;
}

export default HydrationBoundry;
