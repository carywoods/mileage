// main.ts
const html = await Deno.readTextFile("index.html");
const PORT = 9090;
const url = `http://localhost:${PORT}`;

// Start the HTTP server — returns a signal when it's stopped
const listener = Deno.listen({ port: PORT });
console.log(`✅ Server running at ${url}`);

// Open browser after short delay
setTimeout(async () => {
  let command: string[];

  if (Deno.build.os === "windows") {
    command = ["cmd", "/c", "start", "", url];
  } else if (Deno.build.os === "darwin") {
    command = ["open", url];
  } else {
    // Linux fallback for missing xdg-open
    const check = new Deno.Command("which", { args: ["xdg-open"] });
    const status = await check.spawn().status;
    if (!status.success) {
      console.warn("⚠️ 'xdg-open' not found. Please open your browser manually:", url);
      return;
    }
    command = ["xdg-open", url];
  }

  try {
    new Deno.Command(command[0], {
      args: command.slice(1),
    }).spawn();
  } catch (err) {
    console.error("❌ Failed to open browser:", err);
  }
}, 500);

// Serve requests
for await (const conn of listener) {
  handleHttp(conn);
}

// Basic HTTP handler
async function handleHttp(conn: Deno.Conn) {
  const httpConn = Deno.serveHttp(conn);
  for await (const requestEvent of httpConn) {
    requestEvent.respondWith(
      new Response(html, {
        headers: { "content-type": "text/html" },
      }),
    );
  }
}
