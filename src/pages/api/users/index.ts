import { NextApiRequest, NextApiResponse } from "next";

export default function Index(
  request: NextApiRequest,
  response: NextApiResponse
) {
  return response.json({});
}
