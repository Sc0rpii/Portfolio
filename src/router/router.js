import { createElement } from "react";
import { createBrowserRouter } from "react-router-dom";

import App from "../App";
import Services from "../pages/Services";
import PageNotFound from "../pages/PageNotFound";
import ProjectDetailView from "../pages/ProjectDetailView";
import Privacy from "../pages/Privacy";
import SiteLayout from "../components/layout/SiteLayout";

export const router = createBrowserRouter(
  [
    {
      element: createElement(SiteLayout),
      children: [
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
          path: "/privacy-policy",
          element: createElement(Privacy),
        },
        {
          path: "*",
          element: createElement(PageNotFound),
        },
      ],
    },
    {
      path: "/it",
      element: createElement(SiteLayout, { locale: "it" }),
      children: [
        { index: true, element: createElement(App) },
        { path: "services", element: createElement(Services) },
        { path: "project/:id", element: createElement(ProjectDetailView) },
        { path: "privacy-policy", element: createElement(Privacy) },
        { path: "*", element: createElement(PageNotFound) },
      ],
    },
    {
      path: "/eng",
      element: createElement(SiteLayout, { locale: "en" }),
      children: [
        { index: true, element: createElement(App) },
        { path: "services", element: createElement(Services) },
        { path: "project/:id", element: createElement(ProjectDetailView) },
        { path: "privacy-policy", element: createElement(Privacy) },
        { path: "*", element: createElement(PageNotFound) },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
);
