import { createBrowserRouter } from "react-router";
import Login from "./pages/Login";
import Home from "./pages/Home";
import RequestAccess from "./pages/RequestAccess";
import UploadPage from "./pages/Upload";
import Admin from "./pages/Admin";
import IssueDetail from "./pages/IssueDetail";

export const router = createBrowserRouter([
  { path: "/login", Component: Login },
  { path: "/signup", Component: RequestAccess },
  { path: "/upload", Component: UploadPage },
  { path: "/admin", Component: Admin },
  { path: "/issues/:id", Component: IssueDetail },
  { path: "/", Component: Home },
]);
