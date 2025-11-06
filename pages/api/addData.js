// /pages/api/addData.js
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "../../config/ddbDocClient.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { EmployeeName, Designation, city, phoneNumber } = req.body;

  if (!EmployeeName || !Designation || !city || !phoneNumber) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const params = {
    TableName: process.env.NEXT_PUBLIC_DYNAMO_TABLE_NAME,
    Item: {
      id: Math.floor(Math.random() * 1000000).toString(),
      dateAdded: new Date().toISOString(),
      dateModified: "",
      EmployeeName,
      Designation,
      city,
      phoneNumber,
    },
  };

  try {
    const data = await ddbDocClient.send(new PutCommand(params));
    console.log("✅ Item added:", data);
    return res.status(200).json({ message: "Data added successfully" });
  } catch (err) {
    console.error("❌ DynamoDB Error:", err);
    return res
      .status(500)
      .json({ message: err.message || "Failed to add data" });
  }
}
