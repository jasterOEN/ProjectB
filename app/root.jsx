import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from "@remix-run/react";
import { Toaster } from "react-hot-toast";

import style from '~/styles/common.css';

// import LiveReload from '~/components/Universal/LiveReload';

export const links = () => [
  { rel: 'icon', href: '/favicon.ico' },
  { rel: 'stylesheet', href: style },
];

export const meta = () => ({
  charset: "utf-8",
  title: "Project A",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {

  return (
    <html lang="zh-Hant">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {/* <LiveReload /> */}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <html>
      <head>
        <title>發生錯誤</title>
        <Meta />
        <Links />
      </head>
      <body className="w-full h-screen flex justify-center items-center">
        <h1 className="text-4xl font-bold text-primary-400">
          {caught.status} {caught.statusText}
        </h1>

        <Scripts />
      </body>
    </html>
  );
}
