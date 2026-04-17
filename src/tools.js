import axios from "axios";

// ---------------------------------------------------------------------------
// Config (read from env at call time so .env is loaded first)
// ---------------------------------------------------------------------------

function supersetConfig() {
  return {
    baseUrl: (process.env.SUPERSET_BASE_URL || "").replace(/\/$/, ""),
    username: process.env.SUPERSET_USERNAME || "",
    password: process.env.SUPERSET_PASSWORD || "",
    databaseId: Number(process.env.SUPERSET_DATABASE_ID || 1),
    catalog: process.env.SUPERSET_CATALOG || "hive",
    schema: process.env.SUPERSET_SCHEMA || "user_info"
  };
}

function intercomConfig() {
  return {
    baseUrl: process.env.INTERCOM_API_BASE_URL || "https://api.intercom.io",
    token: process.env.INTERCOM_ACCESS_TOKEN || "",
    version: process.env.INTERCOM_API_VERSION || "2.14"
  };
}

// ---------------------------------------------------------------------------
// Webot markets cache — refreshed every 10 minutes
// ---------------------------------------------------------------------------

let marketsCache = null;
let marketsCacheExpiry = 0;

async function getWebotMarkets() {
  if (marketsCache && Date.now() < marketsCacheExpiry) {
    return marketsCache;
  }
  const url = process.env.WEBOT_MARKETS_URL || "";
  if (!url) throw new Error("WEBOT_MARKETS_URL not configured");
  // Fetch as raw text to sanitize control characters before JSON parsing
  const res = await axios.get(url, {
    timeout: 10000,
    responseType: "text",
    transformResponse: [(data) => data]
  });
  const cleaned = res.data.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "");
  const parsed = JSON.parse(cleaned);
  const markets = (parsed?.data || []).filter((m) => m.active !== false);
  marketsCache = markets;
  marketsCacheExpiry = Date.now() + 10 * 60 * 1000; // 10 min
  return markets;
}

// ---------------------------------------------------------------------------
// Superset auth — token cached for 1 hour
// ---------------------------------------------------------------------------

let supersetTokenCache = null;
let supersetTokenExpiry = 0;

async function getSupersetToken() {
  if (supersetTokenCache && Date.now() < supersetTokenExpiry) {
    return supersetTokenCache;
  }
  const cfg = supersetConfig();
  const res = await axios.post(`${cfg.baseUrl}/api/v1/security/login`, {
    username: cfg.username,
    password: cfg.password,
    provider: "db",
    refresh: true
  });
  supersetTokenCache = res.data.access_token;
  supersetTokenExpiry = Date.now() + 55 * 60 * 1000; // 55 min
  return supersetTokenCache;
}

function supersetClient(token) {
  const cfg = supersetConfig();
  return axios.create({
    baseURL: `${cfg.baseUrl}/api/v1`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    timeout: 30000
  });
}

function intercomClient() {
  const cfg = intercomConfig();
  return axios.create({
    baseURL: cfg.baseUrl,
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "Intercom-Version": cfg.version
    },
    timeout: 15000
  });
}

// ---------------------------------------------------------------------------
// Tool definitions (Anthropic tool_use format)
// ---------------------------------------------------------------------------

export const TOOL_DEFINITIONS = [
  {
    name: "superset_execute_sql",
    description:
      "Execute a SQL query against the company data warehouse (Trino/Hive). " +
      "Use for user lookups, invite/referral data, balance, trading volume, KYC info. " +
      "Always use fully-qualified table names: hive.<schema>.<table>. " +
      "Always include LIMIT. Key schemas: user_info, user_info_us, wallet_us, transactions_us.",
    input_schema: {
      type: "object",
      properties: {
        sql: {
          type: "string",
          description: "The SQL query to execute. Must include LIMIT."
        },
        database_id: {
          type: "integer",
          description: "Database ID (default: 1 for hive)"
        }
      },
      required: ["sql"]
    }
  },
  {
    name: "superset_list_dashboards",
    description: "List Superset dashboards. Useful for sharing dashboard links with users.",
    input_schema: {
      type: "object",
      properties: {
        search: {
          type: "string",
          description: "Search term to filter dashboards by title"
        }
      },
      required: []
    }
  },
  {
    name: "superset_list_charts",
    description: "List Superset charts. Useful for finding specific charts to share.",
    input_schema: {
      type: "object",
      properties: {
        search: {
          type: "string",
          description: "Search term to filter charts by name"
        }
      },
      required: []
    }
  },
  {
    name: "webot_check_pair",
    description:
      "Check if a specific coin or trading pair is listed on Webot. " +
      "ONLY call this when the user explicitly names a coin or token symbol (e.g. 'is BTC listed?', 'do you support BDAG?'). " +
      "Do NOT call this for general deposit, balance, or account questions.",
    input_schema: {
      type: "object",
      properties: {
        coin: {
          type: "string",
          description: "Coin symbol to look up (e.g. BTC, ETH, SOL, BDAG). Case-insensitive."
        }
      },
      required: ["coin"]
    }
  },
  {
    name: "webot_list_all_pairs",
    description:
      "List all active trading pairs on Webot. Use when the user asks for a full list of supported coins or markets.",
    input_schema: {
      type: "object",
      properties: {},
      required: []
    }
  },
];

// ---------------------------------------------------------------------------
// Tool executor
// ---------------------------------------------------------------------------

export async function executeToolCall(toolUse) {
  const { id, name, input } = toolUse;
  let result;

  try {
    switch (name) {
      case "superset_execute_sql":
        result = await toolSupersetExecuteSql(input);
        break;
      case "superset_list_dashboards":
        result = await toolSupersetListDashboards(input);
        break;
      case "superset_list_charts":
        result = await toolSupersetListCharts(input);
        break;
      case "webot_check_pair":
        result = await toolWebotCheckPair(input);
        break;
      case "webot_list_all_pairs":
        result = await toolWebotListAllPairs();
        break;
      default:
        result = { error: `Unknown tool: ${name}` };
    }
  } catch (err) {
    result = { error: err.response?.data?.message || err.message };
  }

  return {
    type: "tool_result",
    tool_use_id: id,
    content: JSON.stringify(result)
  };
}

// ---------------------------------------------------------------------------
// Superset tool implementations
// ---------------------------------------------------------------------------

async function toolSupersetExecuteSql({ sql, database_id }) {
  const cfg = supersetConfig();
  const token = await getSupersetToken();
  const client = supersetClient(token);

  const res = await client.post("/sqllab/execute/", {
    database_id: database_id || cfg.databaseId,
    sql,
    catalog: cfg.catalog,
    schema: cfg.schema,
    runAsync: false,
    select_as_cta: false
  });

  const data = res.data;
  const rows = data.data || data.rows || [];
  const columns = (data.columns || []).map((c) => c.name || c);

  return {
    columns,
    rows: rows.slice(0, 50), // cap at 50 rows for context size
    row_count: rows.length,
    status: data.status || "success"
  };
}

async function toolSupersetListDashboards({ search } = {}) {
  const token = await getSupersetToken();
  const client = supersetClient(token);

  const params = { page: 0, page_size: 20 };
  if (search) params.filters = JSON.stringify([{ col: "dashboard_title", opr: "ilike", val: `%${search}%` }]);

  const res = await client.get("/dashboard/", { params });
  return (res.data.result || []).map((d) => ({
    id: d.id,
    title: d.dashboard_title,
    url: d.url,
    published: d.published
  }));
}

async function toolSupersetListCharts({ search } = {}) {
  const token = await getSupersetToken();
  const client = supersetClient(token);

  const params = { page: 0, page_size: 20 };
  if (search) params.filters = JSON.stringify([{ col: "slice_name", opr: "ilike", val: `%${search}%` }]);

  const res = await client.get("/chart/", { params });
  return (res.data.result || []).map((c) => ({
    id: c.id,
    name: c.slice_name,
    viz_type: c.viz_type,
    url: c.url
  }));
}

// ---------------------------------------------------------------------------
// Webot markets tool implementations
// ---------------------------------------------------------------------------

async function toolWebotCheckPair({ coin }) {
  const markets = await getWebotMarkets();
  const search = (coin || "").replace(/^\$/, "").toUpperCase().trim();
  const matches = markets.filter(
    (m) =>
      (m.base || "").toUpperCase() === search ||
      (m.symbol || "").toUpperCase().startsWith(search + "/") ||
      (m.id || "").toUpperCase().startsWith(search + "_")
  );

  if (matches.length === 0) {
    return {
      listed: false,
      coin: search,
      pairs: [],
      message: `${search} is not currently listed on Webot. If you believe this is an error, check the Webot app for the latest listings.`
    };
  }

  return {
    listed: true,
    coin: search,
    pairs: matches.map((m) => ({
      symbol: m.symbol || m.id,
      base: m.base,
      quote: m.quote,
      active: m.active,
      taker_fee: m.taker,
      maker_fee: m.maker,
      min_amount: m.limits?.amount?.min,
      min_cost: m.limits?.cost?.min,
      tags: m.tags
    }))
  };
}

async function toolWebotListAllPairs() {
  const markets = await getWebotMarkets();
  // Return just symbols to keep context size manageable
  const pairs = markets.map((m) => m.symbol || m.id).sort();
  return { total: pairs.length, pairs };
}

// ---------------------------------------------------------------------------
// Intercom tool implementations
// ---------------------------------------------------------------------------

async function toolIntercomLookupContact({ email, external_id }) {
  const client = intercomClient();

  if (email) {
    const res = await client.get(`/contacts?query=${encodeURIComponent(email)}`);
    return res.data.data?.slice(0, 5) || [];
  }

  if (external_id) {
    const res = await client.get(`/contacts?external_id=${encodeURIComponent(external_id)}`);
    return res.data.data?.slice(0, 5) || [];
  }

  return { error: "Provide email or external_id" };
}

async function toolIntercomListConversations({ contact_id, limit = 10 } = {}) {
  const client = intercomClient();
  const params = { per_page: Math.min(limit, 20) };

  let url = "/conversations";
  if (contact_id) url = `/contacts/${contact_id}/conversations`;

  const res = await client.get(url, { params });
  return (res.data.conversations || res.data.data || []).map((c) => ({
    id: c.id,
    state: c.state,
    created_at: c.created_at,
    updated_at: c.updated_at,
    subject: c.title || c.conversation_message?.subject || "",
    preview: c.conversation_message?.body?.replace(/<[^>]+>/g, "").slice(0, 100) || ""
  }));
}
