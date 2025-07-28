import { NeynarAPIClient, Configuration } from "@neynar/nodejs-sdk"

export async function POST(req: Request) {
  const { fid } = await req.json()

  if (!fid) {
    return Response.json({ error: "Missing FID" }, { status: 400 })
  }

  const client = new NeynarAPIClient(
    new Configuration({ apiKey: process.env.NEYNAR_API_KEY! })
  )

  try {
    const { users } = await client.fetchBulkUsers({ fids: [fid] })
    return Response.json(users[0])
  } catch (error) {
    return Response.json({ error: "Failed to fetch user data" }, { status: 500 })
  }
}
