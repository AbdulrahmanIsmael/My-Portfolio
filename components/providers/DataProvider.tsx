"use client";

import { createContext, useContext } from "react";

const DataContext = createContext<any>(null);

export function DataProvider({
  children,
  data,
}: {
  children: React.ReactNode;
  data: any;
}) {
  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
}

export function useData() {
  return useContext(DataContext);
}
