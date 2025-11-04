import { Bitcount_Grid_Single, Inter, Lusitana } from "next/font/google";

import { NextFont } from "next/dist/compiled/@next/font";

export const bitcountGridSingle: NextFont = Bitcount_Grid_Single({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  fallback: ["sans-serif"],
});
export const inter: NextFont = Inter({ subsets: ["latin"] });
export const lusitana: NextFont = Lusitana({
  subsets: ["latin"],
  weight: ["400", "700"],
});
