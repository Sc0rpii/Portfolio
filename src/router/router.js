import { createElement } from "react";
import { createBrowserRouter } from "react-router-dom";

import App from "../App";
import Services from "../pages/Services";
import PageNotFound from "../pages/PageNotFound";
import ProjectDetailView from "../pages/ProjectDetailView";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: createElement(App),
    },
    {
      path: "/services",
      element: createElement(Services),
    },
    {
      path: "/project/:id",
      element: createElement(ProjectDetailView),
    },
    {
      path: "*",
      element: createElement(PageNotFound),
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
);
