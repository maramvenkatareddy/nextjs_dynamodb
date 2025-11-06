// /pages/api/getData.js
import { ddbDocClient } from "../../config/ddbDocClient";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";

const TABLE_NAME = process.env.NEXT_PUBLIC_DYNAMO_TABLE_NAME;

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
    });

    const response = await ddbDocClient.send(command);

    return res.status(200).json({ items: response.Items || [] });
  } catch (error) {
    console.error("❌ Error fetching data:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch data", error: error.message });
  }
}
