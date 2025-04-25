import fetch from 'node:fetch'

const RQLITE_HOST = process.env.RQLITE_HOST || 'http://rqlite:4001'

const TABLES = {
  flows: 'flows',
  credentials: 'credentials',
}

async function ensureTablesExist() {
  for (const table of Object.values(TABLES)) {
    await fetch(`${RQLITE_HOST}/db/execute?pretty`, {
      method: 'POST',
      body: JSON.stringify({
        statements: [`CREATE TABLE IF NOT EXISTS ${table} (id TEXT PRIMARY KEY, data TEXT)`],
      }),
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

async function readOne(table, id) {
  const res = await fetch(`${RQLITE_HOST}/db/query?pretty`, {
    method: 'POST',
    body: JSON.stringify({
      statements: [`SELECT data FROM ${table} WHERE id='${id}'`],
    }),
    headers: { 'Content-Type': 'application/json' },
  })
  const json = await res.json()
  const rows = json.results?.[0]?.rows
  return rows?.[0]?.data ? JSON.parse(rows[0].data) : null
}

async function writeOne(table, id, value) {
  const payload = JSON.stringify(value)
  const sql = `INSERT OR REPLACE INTO ${table} (id, data) VALUES ('${id}', '${payload.replace(
    /'/g,
    "''"
  )}')`
  await fetch(`${RQLITE_HOST}/db/execute?pretty`, {
    method: 'POST',
    body: JSON.stringify({ statements: [sql] }),
    headers: { 'Content-Type': 'application/json' },
  })
}

const plugin = {
  async init(settings) {
    await ensureTablesExist()
  },

  async getFlows() {
    return (await readOne(TABLES.flows, 'flows')) || {}
  },

  async saveFlows(flows) {
    return await writeOne(TABLES.flows, 'flows', flows)
  },

  async getCredentials() {
    return (await readOne(TABLES.credentials, 'credentials')) || {}
  },

  async saveCredentials(credentials) {
    return await writeOne(TABLES.credentials, 'credentials', credentials)
  },

  async getSettings() {
    return {}
  },

  async saveSettings() {
    return
  },

  async getSessions() {
    return {}
  },

  async saveSessions() {
    return
  },

  async getLibraryEntry(type, path) {
    return null
  },

  async saveLibraryEntry(type, path, meta, body) {
    return
  },
}

export default plugin
