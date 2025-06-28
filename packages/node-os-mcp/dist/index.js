"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const sse_js_1 = require("@modelcontextprotocol/sdk/server/sse.js");
const express_1 = __importDefault(require("express"));
const server_1 = require("./server");
// Start the server
async function main() {
    const args = process.argv.slice(2);
    const type = args.at(0) || "stdio";
    if (type === "sse") {
        const app = (0, express_1.default)();
        let transport;
        app.get("/sse", async (req, res) => {
            transport = new sse_js_1.SSEServerTransport("/messages", res);
            await server_1.server.connect(transport);
        });
        app.post("/messages", async (req, res) => {
            // Note: to support multiple simultaneous connections, these messages will
            // need to be routed to a specific matching transport. (This logic isn't
            // implemented here, for simplicity.)
            await transport.handlePostMessage(req, res);
        });
        app.listen(process.env.PORT || 3001);
        console.error("MCP Server running on sse");
    }
    else if (type === "stdio") {
        const transport = new stdio_js_1.StdioServerTransport();
        await server_1.server.connect(transport);
        console.error("MCP Server running on stdio");
    }
    else {
        throw new Error(`Unknown transport type: ${type}`);
    }
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map