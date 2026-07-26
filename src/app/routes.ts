import { createBrowserRouter } from "react-router";
import Login from "./pages/Login";
import Home from "./pages/Home";
import RequestAccess from "./pages/RequestAccess";
import UploadPage from "./pages/Upload";
import Admin from "./pages/Admin";
import IssueDetail from "./pages/IssueDetail";
import ArticleDetail from "./pages/ArticleDetail";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { Privacy, Terms } from "./pages/Policies";

export const router = createBrowserRouter([
  { path: "/login", Component: Login },
  { path: "/signup", Component: RequestAccess },
  { path: "/forgot-password", Component: ForgotPassword },
  { path: "/reset-password", Component: ResetPassword },
  { path: "/terms", Component: Terms },
  { path: "/privacy", Component: Privacy },
  { path: "/upload", Component: UploadPage },
  { path: "/admin", Component: Admin },
  { path: "/issues/:id", Component: IssueDetail },
  { path: "/articles/:id", Component: ArticleDetail },
  { path: "/", Component: Home },
  { path: "*", Component: NotFound },
]);
