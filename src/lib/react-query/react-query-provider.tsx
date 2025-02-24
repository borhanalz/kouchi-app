'use client'

import type {FC, ReactNode} from "react";

import { useState} from "react";
import {QueryClientProvider} from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import {GetQueryClient} from "./query-client";
// ----------------------------------------------------------------------------------------
interface IReactQueryClient {
  children:ReactNode
}
const ReactQueryProvider:FC<IReactQueryClient>=({children})=>{
  const [QueryClient] = useState(GetQueryClient);
  return <QueryClientProvider client={QueryClient}>
    {children}
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
}
export default ReactQueryProvider;
