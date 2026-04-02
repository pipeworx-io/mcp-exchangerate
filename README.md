# mcp-exchangerate

MCP server for currency exchange rates via [open.er-api.com](https://www.exchangerate-api.com/docs/free). No authentication required.

## Tools

| Tool | Description |
|------|-------------|
| `get_rates` | Get all exchange rates for a given base currency |
| `get_pair` | Get the exchange rate from one currency to another |

## Quickstart via Pipeworx Gateway

Call any tool through the hosted gateway with zero setup:

```bash
curl -X POST https://gateway.pipeworx.io/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "exchangerate_get_pair",
      "arguments": { "from": "USD", "to": "EUR" }
    }
  }'
```

## License

MIT
