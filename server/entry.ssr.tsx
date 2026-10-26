import { createFromReadableStream, getClientEntryUrl } from "@vitejs/plugin-rsc/ssr";
import { use } from "react";
import type { ReactFormState } from "react-dom/client";
import { renderToReadableStream } from "react-dom/server.edge";
import { injectRSCPayload } from "rsc-html-stream/server";
import { RouterProvider } from "@/client/router";
import type { RscPayload } from "./entry.rsc";

export async function renderHTML(rscStream: ReadableStream<Uint8Array>, options: { formState?: ReactFormState } = {}) {
  const [renderStream, hydrationStream] = rscStream.tee();
  let payload: Promise<RscPayload> | undefined;
  function SsrRoot() {
    payload ??= createFromReadableStream<RscPayload>(renderStream);
    const result = use(payload);
    return <RouterProvider url={result.url} pending={false} failedHref={null} navigate={async () => {}} refresh={async () => {}}>{result.root}</RouterProvider>;
  }
  const stream = await renderToReadableStream(<SsrRoot />, {
    bootstrapScriptContent: options.formState ? `self.__AFRAME_FORM_STATE__=${JSON.stringify(options.formState).replace(/</g, "\\u003c")}` : undefined,
    bootstrapModules: [getClientEntryUrl()],
    formState: options.formState,
  });
  return { stream: stream.pipeThrough(injectRSCPayload(hydrationStream)), status: 200 };
}
