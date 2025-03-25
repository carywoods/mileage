// main.ts
const html = await Deno.readTextFile("index.html");

// Start the HTTP server
const server = Deno.serve({ port: 9090 }, (_req) => {
  return new Response(html, {
    headers: { "content-type": "text/html" },
  });
});

// Open the browser after a short delay
setTimeout(async () => {
  const url = "http://localhost:9090";

  let command: string[];

  if (Deno.build.os === "windows") {
    command = ["cmd", "/c", "start", "", url];
  } else if (Deno.build.os === "darwin") {
    command = ["open", url];
  } else {
    // For Linux, check if xdg-open exists
    const check = new Deno.Command("which", { args: ["xdg-open"] });
    const status = await check.spawn().status;
    if (!status.success) {
      console.warn("⚠️ 'xdg-open' not found. Please open the browser manually:", url);
      return;
    }
    command = ["xdg-open", url];
  }

  try {
    new Deno.Command(command[0], {
      args: command.slice(1),
    }).spawn();
  } catch (error) {
    console.error("❌ Failed to open browser:", error);
  }
}, 500);

// Keep the server running
await server.finished;
