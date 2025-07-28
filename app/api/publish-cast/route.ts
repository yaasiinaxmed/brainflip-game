import { NeynarAPIClient, Configuration } from "@neynar/nodejs-sdk"

export async function POST(req: Request) {
  const { text, embeds } = await req.json()

  const signerUuid = process.env.NEYNAR_SIGNER_UUID! // from your onboarding flow

  const client = new NeynarAPIClient(
    new Configuration({ apiKey: process.env.NEYNAR_API_KEY! })
  )

  try {
    const cast = await client.publishCast({
      signerUuid,
      text,
      embeds,
    })

    return Response.json({ success: true, cast })
  } catch (error) {
    return Response.json({ error: 'Failed to publish cast' }, { status: 500 })
  }
}
