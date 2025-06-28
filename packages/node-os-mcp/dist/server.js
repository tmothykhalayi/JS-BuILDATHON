"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const os = __importStar(require("os"));
// Create server instance
const server = new mcp_js_1.McpServer({
    name: "node-os-mcp",
    description: "A server that provides tools to get information about the operating system.",
    version: "0.0.1",
});
exports.server = server;
server.tool("cpu_average_usage", "Get the average CPU usage percentage on the local machine", {}, async () => {
    // Calculate average CPU usage over 100ms
    function cpuAverage() {
        const cpus = os.cpus();
        let totalIdle = 0, totalTick = 0;
        for (const cpu of cpus) {
            for (const type in cpu.times) {
                totalTick += cpu.times[type];
            }
            totalIdle += cpu.times.idle;
        }
        return { idle: totalIdle / cpus.length, total: totalTick / cpus.length };
    }
    const start = cpuAverage();
    await new Promise(res => setTimeout(res, 100));
    const end = cpuAverage();
    const idleDiff = end.idle - start.idle;
    const totalDiff = end.total - start.total;
    const usage = totalDiff > 0 ? (1 - idleDiff / totalDiff) * 100 : 0;
    return {
        content: [{
                type: "text",
                text: `Average CPU usage: ${usage.toFixed(2)}%`
            }],
        isError: false
    };
});
server.tool("get_hostname", "Get the hostname of the local machine", {}, async () => ({
    content: [{
            type: "text",
            text: `Hostname: ${os.hostname()}`
        }],
    isError: false
}));
server.tool("get_architecture", "Get the architecture of the local machine", {}, async () => ({
    content: [{
            type: "text",
            text: `Architecture: ${os.arch()}`
        }],
    isError: false
}));
server.tool("get_uptime", "Get the uptime of the local machine in seconds", {}, async () => ({
    content: [{
            type: "text",
            text: `Uptime: ${os.uptime()} seconds`
        }],
    isError: false
}));
//# sourceMappingURL=server.js.map