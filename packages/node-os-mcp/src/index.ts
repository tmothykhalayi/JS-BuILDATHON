import { server } from "./server.js";

// Start the server
console.log("Starting MCP server...");
server
  .listen({ port: 8080 })
  .then(({ port }) => {
    console.log(`🚀 MCP server listening at http://localhost:${port}`);
  })
  .catch((error) => {
    console.error("Failed to start MCP server:", error);
  });
