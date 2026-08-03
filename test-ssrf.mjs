import { assertSafeFetchUrl, isDeniedIp } from "./src/core/security/ssrf.ts";

async function run() {
  try {
    const url = await assertSafeFetchUrl("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
    console.log("Safe:", url.toString());
  } catch (err) {
    console.error("Error:", err);
  }
}
run();
