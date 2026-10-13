import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../demo/", import.meta.url));
const types = {
	".html": "text/html; charset=utf-8",
	".css": "text/css",
	".js": "text/javascript",
	".woff2": "font/woff2",
};
const port = Number(process.env.PORT || 4173);
createServer(async (request, response) => {
	try {
		const pathname = decodeURIComponent(
			new URL(request.url, "http://localhost").pathname,
		);
		const file = resolve(
			root,
			`.${pathname === "/" ? "/index.html" : pathname}`,
		);
		if (!file.startsWith(root.endsWith(sep) ? root : root + sep))
			throw new Error("Outside demo");
		const content = await readFile(file);
		response.writeHead(200, {
			"Content-Type": types[extname(file)] || "application/octet-stream",
		});
		response.end(content);
	} catch {
		response.writeHead(404);
		response.end("Not found");
	}
}).listen(port, "127.0.0.1", () =>
	console.log(`Demo: http://127.0.0.1:${port}`),
);
