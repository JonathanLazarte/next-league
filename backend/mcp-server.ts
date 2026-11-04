/**
 * Servidor MCP (stdio) que expone las operaciones de `usersModel` y `shopModel`
 * de `models/pokemon.js`, alineado con el patrón de herramientas del SDK:
 * nombre, descripción, inputSchema (Zod → JSON Schema) y handler.
 *
 * Ejecutar: `npm run mcp` (stdio; pensado para Cursor / Claude Code vía config MCP).
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'
import { usersModel, shopModel } from './models/pokemon.js'
import { z } from 'zod'

function jsonResult(data: unknown): CallToolResult {
  return {
    content: [
      {
        type: 'text',
        text:
          typeof data === 'string'
            ? data
            : JSON.stringify(data, null, 2),
      },
    ],
  }
}

function errorResult(message: string): CallToolResult {
  return {
    isError: true,
    content: [{ type: 'text', text: message }],
  }
}

async function runTool(
  fn: () => Promise<unknown>,
): Promise<CallToolResult> {
  try {
    return jsonResult(await fn())
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return errorResult(msg)
  }
}

const bodyRecord = z
  .record(z.string(), z.unknown())
  .describe('Cuerpo del registro (userName, password, id, etc.)')

function buildServer(): McpServer {
  const server = new McpServer(
    {
      name: 'lol-players-db',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    },
  )

  server.registerTool(
    'players_register',
    {
      description:
        'Registra un usuario en la colección users (equivalente a POST /auth/register).',
      inputSchema: { body: bodyRecord },
    },
    async ({ body }) =>
      runTool(() => usersModel.registerUser({ body })),
  )

  server.registerTool(
    'players_login',
    {
      description:
        'Inicia sesión y devuelve token/id de usuario (POST /auth/login).',
      inputSchema: {
        userName: z.string(),
        password: z.string(),
      },
    },
    async (args) =>
      runTool(() =>
        usersModel.loginUser({ body: { userName: args.userName, password: args.password } }),
      ),
  )

  server.registerTool(
    'players_verify_token',
    {
      description: 'Eco del token (verifyToken en el modelo).',
      annotations: { readOnlyHint: true },
      inputSchema: { token: z.string() },
    },
    async ({ token }) => runTool(() => usersModel.verifyToken({ token })),
  )

  server.registerTool(
    'players_get_user_data',
    {
      description:
        'Obtiene datos del usuario por id guardado como token (getUserData).',
      annotations: { readOnlyHint: true },
      inputSchema: { token: z.string().describe('id del usuario en la BD') },
    },
    async ({ token }) => runTool(() => usersModel.getUserData({ token })),
  )

  server.registerTool(
    'players_get_owned_champions',
    {
      description:
        'Lista campeones poseídos (proyección champions) para un usuario.',
      annotations: { readOnlyHint: true },
      inputSchema: { id: z.string().describe('id del usuario') },
    },
    async ({ id }) => runTool(() => usersModel.getAllOwned({ id })),
  )

  server.registerTool(
    'players_add_champion',
    {
      description: 'Añade un campeón al inventario del usuario (addToPokedex).',
      inputSchema: {
        userID: z.string(),
        championId: z.union([z.string(), z.number()]),
        coin: z.enum(['BE', 'RP']),
        price: z.number(),
      },
    },
    async (args) => runTool(() => usersModel.addToPokedex({ ...args })),
  )

  server.registerTool(
    'players_sell_pokemon',
    {
      description: 'Elimina un Pokémon del array pokemon del usuario.',
      inputSchema: {
        userId: z.string(),
        pokemonIndex: z.union([z.string(), z.number()]),
      },
    },
    async (args) => runTool(() => usersModel.sellPokemon({ ...args })),
  )

  server.registerTool(
    'players_update_level',
    {
      description:
        'Actualiza nivel/exp/stats de Pokémon en combate (updateLevel). Estructuras según el cliente.',
      inputSchema: {
        userId: z.string(),
        pokeballsState: z.any().optional(),
        pokemonExp: z.any().optional(),
      },
    },
    async (args) =>
      runTool(() =>
        usersModel.updateLevel({
          userId: args.userId,
          pokeballsState: args.pokeballsState,
          pokemonExp: args.pokemonExp,
        }),
      ),
  )

  server.registerTool(
    'players_learn_move',
    {
      description: 'Reemplaza un movimiento en un Pokémon (learnMove).',
      inputSchema: {
        userId: z.string(),
        pokemonIndex: z.union([z.string(), z.number()]),
        moveToLearn: z.unknown(),
        moveToForget: z.union([z.string(), z.number()]),
      },
    },
    async (args) => runTool(() => usersModel.learnMove({ ...args })),
  )

  server.registerTool(
    'players_buy_item',
    {
      description: 'Compra un ítem de la API Pokéapi y actualiza inventario/moneda.',
      inputSchema: {
        userId: z.string(),
        itemId: z.union([z.string(), z.number()]),
        price: z.number(),
        coin: z.enum(['BE', 'RP']),
      },
    },
    async (args) => runTool(() => usersModel.buyItem({ ...args })),
  )

  server.registerTool(
    'players_get_skins',
    {
      description: 'Obtiene las skins del usuario.',
      annotations: { readOnlyHint: true },
      inputSchema: { userID: z.string() },
    },
    async ({ userID }) => runTool(() => usersModel.getUserSkins({ userID })),
  )

  server.registerTool(
    'players_save_settings',
    {
      description: 'Guarda objeto settings del usuario.',
      inputSchema: {
        userId: z.string(),
        settings: z.record(z.string(), z.unknown()),
      },
    },
    async ({ userId, settings }) =>
      runTool(() => usersModel.saveSettings({ userId, settings })),
  )

  server.registerTool(
    'shop_buy_skin',
    {
      description: 'Compra una skin en la tienda (shopModel.buySkin).',
      inputSchema: {
        userId: z.string(),
        skinId: z.union([z.string(), z.number()]),
        coin: z.enum(['BE', 'RP']),
        price: z.number(),
      },
    },
    async (args) => runTool(() => shopModel.buySkin({ ...args })),
  )

  return server
}

async function main(): Promise<void> {
  const transport = new StdioServerTransport()
  const mcp = buildServer()
  await mcp.connect(transport)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
