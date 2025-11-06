import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../../config/ddbDocClient";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.query;

  try {
    await ddbDocClient.send(
      new DeleteCommand({
        TableName: process.env.NEXT_PUBLIC_DYNAMO_TABLE_NAME,
        Key: { id },
      })
    );
    res.status(200).json({ message: "Record deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting record:", err);
    res.status(500).json({ message: err.message });
  }
}
