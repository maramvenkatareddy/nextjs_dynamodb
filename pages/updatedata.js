import { ddbDocClient } from "../config/ddbDocClient";
import { useRouter } from "next/router";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";

const NEXT_PUBLIC_DYNAMO_TABLE_NAME = process.env.NEXT_PUBLIC_DYNAMO_TABLE_NAME;

const styles = {
  inputField:
    "form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none",
};

const UpdateData = () => {
  const router = useRouter();
  const data = router.query; // contains LockID and other fields passed from viewdata.js

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Ensure LockID exists
    if (!data.LockID) {
      alert("Missing LockID — cannot update record!");
      return;
    }

    const params = {
      TableName: NEXT_PUBLIC_DYNAMO_TABLE_NAME,
      Key: {
        LockID: String(data.LockID), // ✅ Correct primary key name & type
      },
      UpdateExpression:
        "set firstName = :p, lastName = :r, city = :q, phoneNumber = :z, dateModified = :k",
      ExpressionAttributeValues: {
        ":p": event.target.firstName.value,
        ":r": event.target.lastName.value,
        ":q": event.target.city.value,
        ":z": event.target.phoneNumber.value,
        ":k": new Date().toISOString(),
      },
      ReturnValues: "UPDATED_NEW",
    };

    try {
      const response = await ddbDocClient.send(new UpdateCommand(params));
      console.log("✅ Success - item updated:", response);
      alert("Data Updated Successfully!");
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
        <form onSubmit={handleSubmit} id="updateData-form">
          <div className="form-group mb-6">
            <label
              htmlFor="firstName"
              className="form-label inline-block mb-2 text-gray-700"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              defaultValue={data.firstName}
              className={styles.inputField}
            />
          </div>

          <div className="form-group mb-6">
            <label
              htmlFor="lastName"
              className="form-label inline-block mb-2 text-gray-700"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              defaultValue={data.lastName}
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
              defaultValue={data.city}
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
              defaultValue={data.phoneNumber}
              className={styles.inputField}
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-2.5 bg-blue-600 text-white font-medium text-sm uppercase rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateData;
