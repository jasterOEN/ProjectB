import { PassThrough } from "stream";
import { renderToPipeableStream } from "react-dom/server";
import { Response } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import isbot from "isbot";

const ABORT_DELAY = 5000;

async function handleBotRequest(
  request,
  responseStatusCode,
  responseHeaders,
  remixContext,
  resolve,
  reject,
) {
  let didError = false;

  const { pipe, abort } = renderToPipeableStream(
    <RemixServer context={remixContext} url={request.url} />,
    {
      onAllReady() {
        const body = new PassThrough();

        responseHeaders.set("Content-Type", "text/html");

        resolve(
          new Response(body, {
            headers: responseHeaders,
            status: didError ? 500 : responseStatusCode,
          })
        );

        pipe(body);
      },
      onShellError(error) {
        reject(error);
      },
      onError(error) {
        didError = true;

        console.error(error);
      },
    }
  );

  setTimeout(abort, ABORT_DELAY);
}


function handleBrowserRequest(
  request,
  responseStatusCode,
  responseHeaders,
  remixContext,
  resolve,
  reject,
) {
  let didError = false;

  const { pipe, abort } = renderToPipeableStream(
    <RemixServer context={remixContext} url={request.url} />,
    {
      onShellReady() {
        const body = new PassThrough();

        responseHeaders.set("Content-Type", "text/html");

        resolve(
          new Response(body, {
            headers: responseHeaders,
            status: didError ? 500 : responseStatusCode,
          })
        );

        pipe(body);
      },
      onShellError(err) {
        reject(err);
      },
      onError(error) {
        didError = true;

        console.error(error);
      },
    }
  );

  setTimeout(abort, ABORT_DELAY);
}

async function streamRequest(
  request,
  responseStatusCode,
  responseHeaders,
  remixContext,
  resolve,
  reject
) {
  const handler = isbot(request.headers.get("user-agent"))
    ? handleBotRequest
    : handleBrowserRequest;

  handler(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext,
    resolve,
    reject,
  );
}

export default function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  remixContext
) {
  return new Promise((resolve, reject) => {
    streamRequest(
      request,
      responseStatusCode,
      responseHeaders,
      remixContext,
      resolve,
      reject
    );
  });
}