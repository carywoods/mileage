// main.ts
const PORT = 9090;
const html = await Deno.readTextFile("index.html");
const url = `http://localhost:${PORT}`;

// Open browser after short delay
setTimeout(async () => {
  let command: string[];

  if (Deno.build.os === "windows") {
    command = ["cmd", "/c", "start", "", url];
  } else if (Deno.build.os === "darwin") {
    command = ["open", url];
  } else {
    // Linux fallback
    const check = new Deno.Command("which", { args: ["xdg-open"] });
    const status = await check.spawn().status;
    if (!status.success) {
      console.warn("⚠️ 'xdg-open' not found. Please open manually:", url);
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

// Use Deno.serve — keeps running
Deno.serve({ port: PORT }, (_req) =>
  new Response(html, {
    headers: { "content-type": "text/html" },
  })
);

// 💡 Important: Don't exit the main thread
// Deno.serve internally uses an async server loop, but in compiled .exe builds,
// the script can sometimes exit immediately unless we anchor it with a forever promise.
await new Promise(() => {});  // Keep the process alive
