# mcp-exchangerate

ExchangeRate MCP — wraps open.er-api.com (free, no auth)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `get_rates` | Get current exchange rates for a base currency (e.g., 'USD', 'EUR'). Returns conversion rates for all major currencies. Use when you need multiple rates at once. |
| `get_pair` | Get the current exchange rate between two specific currencies (e.g., USD to EUR). Returns the conversion rate. Use for single currency pair lookups. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "exchangerate": {
      "url": "https://gateway.pipeworx.io/exchangerate/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Exchangerate data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
