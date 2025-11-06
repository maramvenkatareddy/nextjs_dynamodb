// /pages/adddata.js
import { useRouter } from "next/router";

const styles = {
  inputField:
    "form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none",
};

const AddData = () => {
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const EmployeeName = event.target.EmployeeName.value.trim();
    const Designation = event.target.Designation.value.trim();
    const city = event.target.city.value.trim();
    const phoneNumber = event.target.phoneNumber.value.trim();

    if (!EmployeeName || !Designation || !city || !phoneNumber) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    try {
      const res = await fetch("/api/addData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ EmployeeName, Designation, city, phoneNumber }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      alert("✅ Data Added Successfully!");
      document.getElementById("addData-form").reset();
      router.push("/viewdata");
    } catch (err) {
      console.error("❌ Failed to add data:", err);
      alert(`Failed to add data: ${err.message || "Check console for details."}`);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
      <p className="text-3xl mb-10 font-semibold text-gray-800">Add Data</p>
      <div className="block p-8 rounded-2xl shadow-lg bg-white w-1/3">
        <form onSubmit={handleSubmit} id="addData-form">
          <div className="form-group mb-6">
            <label
              htmlFor="EmployeeName"
              className="form-label inline-block mb-2 text-gray-700"
            >
              Employee Name
            </label>
            <input
              type="text"
              id="EmployeeName"
              name="EmployeeName"
              className={styles.inputField}
            />
          </div>

          <div className="form-group mb-6">
            <label
              htmlFor="Designation"
              className="form-label inline-block mb-2 text-gray-700"
            >
              Designation
            </label>
            <input
              type="text"
              id="Designation"
              name="Designation"
              className={styles.inputField}
            />
          </div>

          <div className="form-group mb-6">
            <label
              htmlFor="city"
              className="form-label inline-block mb-2 text-gray-700"
            >
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              className={styles.inputField}
            />
          </div>

          <div className="form-group mb-6">
            <label
              htmlFor="phoneNumber"
              className="form-label inline-block mb-2 text-gray-700"
            >
              Phone Number
            </label>
            <input
              type="number"
              id="phoneNumber"
              name="phoneNumber"
              className={styles.inputField}
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-2.5 bg-blue-600 text-white font-medium text-sm uppercase rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddData;
