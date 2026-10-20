import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from "react-router-dom";

import i18n from "./hooks/i18n.js";
import { routes } from "./router/routes.js";
import { getLocaleFromPathname } from "./utils/locale.js";

const handler = createStaticHandler(routes);

// Renders one route to the markup that main.jsx later hydrates.
export async function render(pathname) {
  await i18n.changeLanguage(getLocaleFromPathname(pathname));

  const context = await handler.query(
    new Request(new URL(pathname, "http://localhost")),
  );

  if (context instanceof Response) {
    throw new Error(`Prerender: ${pathname} answered with a redirect.`);
  }

  const router = createStaticRouter(handler.dataRoutes, context);

  return renderToString(
    <StrictMode>
      <StaticRouterProvider router={router} context={context} hydrate={false} />
    </StrictMode>,
  );
}
