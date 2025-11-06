// /pages/viewdata.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function ViewData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/getData");
        const result = await res.json();

        if (!res.ok) throw new Error(result.message);
        setData(result.items || []);
      } catch (err) {
        console.error("❌ Failed to load data:", err);
        alert("Failed to load data. Check console for details.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this record?")) return;

    try {
      const res = await fetch(`/api/deleteData?id=${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      alert("✅ Record deleted successfully!");
      setData(data.filter((item) => item.id !== id));
    } catch (err) {
      console.error("❌ Failed to delete data:", err);
      alert("Failed to delete data. Check console for details.");
    }
  };

  const handleEdit = (item) => {
    router.push({
      pathname: "/updatedata",
      query: item, // send the record’s data to update page
    });
  };

  if (loading) return <p className="text-center mt-10">Loading data...</p>;

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">View Data</h1>
        <button
          onClick={() => router.push("/adddata")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          ➕ Add New Record
        </button>
      </div>

      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
        <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
          <tr>
            <th className="py-3 px-6 text-left">ID</th>
            <th className="py-3 px-6 text-left">Employee Name</th>
            <th className="py-3 px-6 text-left">Designation</th>
            <th className="py-3 px-6 text-left">City</th>
            <th className="py-3 px-6 text-left">Phone</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {data.length > 0 ? (
            data.map((item) => (
              <tr
                key={item.id}
                className="border-b hover:bg-gray-50 transition duration-150"
              >
                <td className="py-3 px-6">{item.id}</td>
                <td className="py-3 px-6">{item.EmployeeName}</td>
                <td className="py-3 px-6">{item.Designation}</td>
                <td className="py-3 px-6">{item.city}</td>
                <td className="py-3 px-6">{item.phoneNumber}</td>
                <td className="py-3 px-6 text-center space-x-3">
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="6"
                className="text-center py-5 text-gray-500 italic"
              >
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
