import { handle } from "hono/vercel"
import { server } from "../src/index.js"

export default handle(server.getApp())
