import { server } from "../src/index.js";

export default async function handler(req: any, res: any) {
  return await server.handleSseRequest(req, res);
}
