import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/login",
    lazy: async () => ({ Component: (await import("./pages/Login")).default }),
  },
  {
    path: "/signup",
    lazy: async () => ({ Component: (await import("./pages/RequestAccess")).default }),
  },
  {
    path: "/forgot-password",
    lazy: async () => ({ Component: (await import("./pages/ForgotPassword")).default }),
  },
  {
    path: "/reset-password",
    lazy: async () => ({ Component: (await import("./pages/ResetPassword")).default }),
  },
  {
    path: "/terms",
    lazy: async () => ({ Component: (await import("./pages/Policies")).Terms }),
  },
  {
    path: "/privacy",
    lazy: async () => ({ Component: (await import("./pages/Policies")).Privacy }),
  },
  {
    path: "/upload",
    lazy: async () => ({ Component: (await import("./pages/Upload")).default }),
  },
  {
    path: "/admin",
    lazy: async () => ({ Component: (await import("./pages/Admin")).default }),
  },
  {
    path: "/issues/:id",
    lazy: async () => ({ Component: (await import("./pages/IssueDetail")).default }),
  },
  {
    path: "/articles/:id",
    lazy: async () => ({ Component: (await import("./pages/ArticleDetail")).default }),
  },
  {
    path: "/",
    lazy: async () => ({ Component: (await import("./pages/Home")).default }),
  },
  {
    path: "*",
    lazy: async () => ({ Component: (await import("./pages/NotFound")).default }),
  },
]);
