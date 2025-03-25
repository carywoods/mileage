// main.ts
const html = await Deno.readTextFile("index.html");

Deno.serve({ port: 8080 }, (req) => {
  return new Response(html, {
    headers: { "content-type": "text/html" },
  });
});

// Open browser after short delay
setTimeout(() => {
  const url = "http://localhost:8080";
  const cmd = Deno.build.os === "windows"
    ? ["cmd", "/c", "start", url]
    : Deno.build.os === "darwin"
    ? ["open", url]
    : ["xdg-open", url];
  const p = new Deno.Command(cmd[0], {
    args: cmd.slice(1),
  });
  p.spawn(); // fire and forget
}, 500);
