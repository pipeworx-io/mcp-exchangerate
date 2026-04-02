/**
 * ExchangeRate MCP — wraps open.er-api.com (free, no auth)
 *
 * Tools:
 * - get_rates: Get all exchange rates for a base currency
 * - get_pair: Get the exchange rate between two specific currencies
 */

interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

const BASE_URL = 'https://open.er-api.com/v6';

interface ErApiResponse {
  result: string;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
  base_code: string;
  rates: Record<string, number>;
  'error-type'?: string;
}

const tools: McpToolExport['tools'] = [
  {
    name: 'get_rates',
    description:
      'Get all exchange rates for a given base currency. Returns a map of currency codes to rates relative to the base.',
    inputSchema: {
      type: 'object',
      properties: {
        base_currency: {
          type: 'string',
          description: 'ISO 4217 currency code to use as the base (e.g., "USD", "EUR", "GBP")',
        },
      },
      required: ['base_currency'],
    },
  },
  {
    name: 'get_pair',
    description: 'Get the exchange rate from one currency to another.',
    inputSchema: {
      type: 'object',
      properties: {
        from: {
          type: 'string',
          description: 'Source currency code (e.g., "USD")',
        },
        to: {
          type: 'string',
          description: 'Target currency code (e.g., "JPY")',
        },
      },
      required: ['from', 'to'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'get_rates':
      return getRates(args.base_currency as string);
    case 'get_pair':
      return getPair(args.from as string, args.to as string);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function fetchLatest(base: string): Promise<ErApiResponse> {
  const res = await fetch(`${BASE_URL}/latest/${encodeURIComponent(base.toUpperCase())}`);
  if (!res.ok) throw new Error(`open.er-api.com error: ${res.status}`);
  const data = (await res.json()) as ErApiResponse;
  if (data.result !== 'success') {
    throw new Error(`open.er-api.com error: ${data['error-type'] ?? 'unknown error'}`);
  }
  return data;
}

async function getRates(baseCurrency: string) {
  const data = await fetchLatest(baseCurrency);
  return {
    base: data.base_code,
    last_updated: data.time_last_update_utc,
    next_update: data.time_next_update_utc,
    rate_count: Object.keys(data.rates).length,
    rates: data.rates,
  };
}

async function getPair(from: string, to: string) {
  const data = await fetchLatest(from);
  const toCode = to.toUpperCase();
  const rate = data.rates[toCode];
  if (rate === undefined) {
    throw new Error(`Currency not found: ${toCode}`);
  }
  return {
    from: data.base_code,
    to: toCode,
    rate,
    last_updated: data.time_last_update_utc,
  };
}

export default { tools, callTool } satisfies McpToolExport;
