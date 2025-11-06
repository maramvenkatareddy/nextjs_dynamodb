// /pages/api/updateData.js
import { ddbDocClient } from "../../config/ddbDocClient";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";

const TABLE_NAME = process.env.NEXT_PUBLIC_DYNAMO_TABLE_NAME;

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { id, EmployeeName, Designation, city, phoneNumber } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Missing id for update." });
    }

    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { id },
      UpdateExpression:
        "set EmployeeName = :f, Designation = :l, city = :c, phoneNumber = :p, dateModified = :d",
      ExpressionAttributeValues: {
        ":f": EmployeeName,
        ":l": Designation,
        ":c": city,
        ":p": phoneNumber,
        ":d": new Date().toISOString(),
      },
      ReturnValues: "UPDATED_NEW",
    });

    const response = await ddbDocClient.send(command);

    return res
      .status(200)
      .json({ message: "Record updated successfully", updated: response.Attributes });
  } catch (error) {
    console.error("❌ Error updating data:", error);
    return res.status(500).json({ message: "Failed to update data", error: error.message });
  }
}
