import React, { useState } from "react";

const StudentNav = () => {
  const [orderDetails, setOrderDetails] = useState({
    orderType: "Writing",
    deadline: "",
    pages: 1,
    subject: "Other",
    topic: "",
    details: "",
    level: "All levels",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    alert("Order submitted successfully!");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Place Your Order</h1>
      <form onSubmit={handleSubmit}>
        {/* Order Form */}
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
        >
          Submit Order
        </button>
      </form>
    </div>
  );
};

export default StudentNav;
