import { ddbDocClient } from "../config/ddbDocClient";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const NEXT_PUBLIC_DYNAMO_TABLE_NAME = process.env.NEXT_PUBLIC_DYNAMO_TABLE_NAME;

const ViewData = () => {
  const [items, setItems] = useState([]);
  const router = useRouter();

  // Fetch all data from DynamoDB
  const fetchData = async () => {
    try {
      const data = await ddbDocClient.send(
        new ScanCommand({ TableName: NEXT_PUBLIC_DYNAMO_TABLE_NAME })
      );
      setItems(data.Items || []);
    } catch (err) {
      console.error("❌ Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Redirect to Update Page with record info
  const handleUpdate = (item) => {
    router.push({
      pathname: "/updatedata",
      query: {
        LockID: item.LockID, // ✅ Required for DynamoDB key
        firstName: item.firstName,
        lastName: item.lastName,
        city: item.city,
        phoneNumber: item.phoneNumber,
      },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center p-10 bg-gray-50 min-h-screen">
      <p className="text-3xl mb-8 font-semibold text-gray-800">View Data</p>

      <table className="table-auto border-collapse border border-gray-300 w-3/4 text-center">
        <thead className="bg-blue-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2">LockID</th>
            <th className="border border-gray-300 px-4 py-2">First Name</th>
            <th className="border border-gray-300 px-4 py-2">Last Name</th>
            <th className="border border-gray-300 px-4 py-2">City</th>
            <th className="border border-gray-300 px-4 py-2">Phone Number</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? (
            items.map((item) => (
              <tr key={item.LockID}>
                <td className="border border-gray-300 px-4 py-2">{item.LockID}</td>
                <td className="border border-gray-300 px-4 py-2">{item.firstName}</td>
                <td className="border border-gray-300 px-4 py-2">{item.lastName}</td>
                <td className="border border-gray-300 px-4 py-2">{item.city}</td>
                <td className="border border-gray-300 px-4 py-2">{item.phoneNumber}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => handleUpdate(item)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="border px-4 py-2 text-gray-500">
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ViewData;
