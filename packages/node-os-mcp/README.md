# Node OS MCP Server

This is a Model Context Protocol (MCP) server that provides tools to get information about the operating system.

## Tools

- **cpu_average_usage**: Get the average CPU usage percentage on the local machine
- **get_hostname**: Get the hostname of the local machine
- **get_architecture**: Get the architecture of the local machine
- **get_uptime**: Get the uptime of the local machine in seconds

## Usage

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the server:
   ```bash
   npm run build
   ```

3. Start the server:
   ```bash
   npm start
   ```

This will start the MCP server at http://localhost:8080.

## Debugging in the Agent Builder

You can debug this server in the AI Toolkit Agent Builder by using the "Debug in Agent Builder" launch configuration in VS Code.
