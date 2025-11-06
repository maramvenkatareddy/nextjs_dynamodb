// /pages/updatedata.js
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const styles = {
  inputField:
    "form-control block w-full px-3 py-1.5 text-base text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out focus:border-blue-600 focus:outline-none",
};

export default function UpdateData() {
  const router = useRouter();
  const [form, setForm] = useState({
    id: "",
    EmployeeName: "",
    Designation: "",
    city: "",
    phoneNumber: "",
  });

  // ✅ Load query data from navigation
  useEffect(() => {
    if (router.query.id) {
      setForm({
        id: router.query.id,
        EmployeeName: router.query.EmployeeName || "",
        Designation: router.query.Designation || "",
        city: router.query.city || "",
        phoneNumber: router.query.phoneNumber || "",
      });
    }
  }, [router.query]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/updateData", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      alert("✅ Data updated successfully!");
      router.push("/viewdata");
    } catch (err) {
      console.error("❌ Error updating data:", err);
      alert("Failed to update data. Check console for details.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
      <p className="text-3xl mb-10 font-semibold text-gray-800">Update Data</p>
      <div className="block p-8 rounded-2xl shadow-lg bg-white w-1/3">
        <form onSubmit={handleSubmit}>
          {["EmployeeName", "Designation", "city", "phoneNumber"].map((field) => (
            <div key={field} className="form-group mb-6">
              <label
                htmlFor={field}
                className="form-label inline-block mb-2 text-gray-700 capitalize"
              >
                {field.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type={field === "phoneNumber" ? "number" : "text"}
                id={field}
                name={field}
                value={form[field]}
                onChange={handleChange}
                className={styles.inputField}
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full px-6 py-2.5 bg-blue-600 text-white font-medium text-sm uppercase rounded-lg shadow-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 transition"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
}
