import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AppProviders } from "./AppContext";
import { SpeedInsights } from "@vercel/speed-insights/react";

export default function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
      <SpeedInsights />
    </AppProviders>
  );
}
