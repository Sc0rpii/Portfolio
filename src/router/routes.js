import { createElement } from "react";

import App from "../App";
import Services from "../pages/Services";
import PageNotFound from "../pages/PageNotFound";
import ProjectDetailView from "../pages/ProjectDetailView";
import Privacy from "../pages/Privacy";
import SiteLayout from "../components/layout/SiteLayout";

// Shared by the browser router and the build-time prerender. The optional /it
// prefix keeps one layout mounted across both languages.
export const routes = [
  {
    path: "/it?",
    element: createElement(SiteLayout),
    children: [
      { index: true, element: createElement(App) },
      { path: "services", element: createElement(Services) },
      { path: "project/:id", element: createElement(ProjectDetailView) },
      { path: "privacy-policy", element: createElement(Privacy) },
      { path: "*", element: createElement(PageNotFound) },
    ],
  },
];
