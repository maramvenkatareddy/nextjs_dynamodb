import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ddbDocClient } from "../config/ddbDocClient";
import { ScanCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const NEXT_PUBLIC_DYNAMO_TABLE_NAME = process.env.NEXT_PUBLIC_DYNAMO_TABLE_NAME;

const ViewData = () => {
  const [items, setItems] = useState([]);
  const router = useRouter();

  // ✅ Fetch all data
  const fetchData = async () => {
    try {
      const result = await ddbDocClient.send(
        new ScanCommand({ TableName: NEXT_PUBLIC_DYNAMO_TABLE_NAME })
      );
      setItems(result.Items || []);
    } catch (err) {
      console.error("❌ Error fetching data:", err);
      alert("Failed to load data. Check console for details.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Navigate to add data page
  const handleAddNew = () => {
    router.push("/adddata"); // change to / if your form is on the home page
  };

  // ✅ Edit data
  const handleUpdate = (item) => {
    router.push({
      pathname: "/updatedata",
      query: item,
    });
  };

  // ✅ Delete data
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this record?")) return;

    try {
      await ddbDocClient.send(
        new DeleteCommand({
          TableName: NEXT_PUBLIC_DYNAMO_TABLE_NAME,
          Key: { id: id },
        })
      );
      alert("✅ Record deleted successfully!");
      setItems(items.filter((i) => i.id !== id));
    } catch (err) {
      console.error("❌ Error deleting record:", err);
      alert("Failed to delete record. Check console for details.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-10 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center w-3/4 mb-6">
        <p className="text-3xl font-semibold text-gray-800">View Data</p>
        <button
          onClick={handleAddNew}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ➕ Add New Record
        </button>
      </div>

      <table className="table-auto border-collapse border border-gray-300 w-3/4 text-center">
        <thead className="bg-blue-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2">id</th>
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
              <tr key={item.id}>
                <td className="border border-gray-300 px-4 py-2">{item.id}</td>
                <td className="border border-gray-300 px-4 py-2">{item.firstName}</td>
                <td className="border border-gray-300 px-4 py-2">{item.lastName}</td>
                <td className="border border-gray-300 px-4 py-2">{item.city}</td>
                <td className="border border-gray-300 px-4 py-2">{item.phoneNumber}</td>
                <td className="border border-gray-300 px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleUpdate(item)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="border px-4 py-4 text-gray-500">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ViewData;
