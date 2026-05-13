import process from "node:process"
import { Hono } from "hono"
import { handle } from "hono/vercel"
import { server } from "../src/index.js"

const app = new Hono()

app.get("/api/oauth/authorize", (c) => {
  const redirectUri = c.req.query("redirect_uri")
  const state = c.req.query("state")
  if (!redirectUri) {
    return c.text("Missing redirect_uri", 400)
  }
  const url = new URL(redirectUri)
  url.searchParams.append("code", "mock_code")
  if (state) {
    url.searchParams.append("state", state)
  }
  return c.redirect(url.toString())
})

app.post("/api/oauth/token", async (c) => {
  let clientSecret: string | undefined

  try {
    const body = await c.req.parseBody()
    clientSecret = body.client_secret as string
  } catch {
    // ignore
  }

  if (!clientSecret) {
    clientSecret = c.req.query("client_secret")
  }

  const apiKey = process.env.API_KEY

  if (!apiKey || clientSecret === apiKey) {
    return c.json({
      access_token: apiKey || "mock_token",
      token_type: "Bearer",
    })
  }
  return c.json({ error: "invalid_client" }, 401)
})

app.route("/", server.getApp())

export default handle(app)
