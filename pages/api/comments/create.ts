import type { NextApiRequest, NextApiResponse } from "next";
import sanityClient from "@sanity/client";

type ResponseType = {
  success: boolean;
  message?: string;
};

const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!, //Using bang operator for resolving type error
  useCdn: process.env.NODE_ENV === "production",
  token: process.env.SANITY_API_TOKEN,
};

const client = sanityClient(config);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  try {
    const { _id, name, email, comment } = req.body;
    await client.create({
      _type: "comment",
      post: {
        _type: "reference",
        _ref: _id,
      },
      name,
      email,
      comment,
    });
    res.status(200).json({
      success: true,
      message: "Added comment successfully",
    });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err?.message,
    });
  }
}
