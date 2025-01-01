import React, { useState } from "react";

const SupportContact = () => {
  const [orderId, setOrderId] = useState(""); // Track Order ID
  const [issueDescription, setIssueDescription] = useState(""); // Track issue description
  const [isMessageSent, setIsMessageSent] = useState(false); // Track if message is sent
  const [errors, setErrors] = useState({}); // Validation errors

  // Validate input fields
  const validateFields = () => {
    const newErrors = {};
    if (!orderId.trim()) newErrors.orderId = "Order ID is required.";
    if (!issueDescription.trim()) newErrors.issueDescription = "Issue description is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle sending the message
  const handleSend = () => {
    if (!validateFields()) return;

    // Simulate message sending
    alert("Your message has been sent to Support. We will get back to you shortly!");
    setIsMessageSent(true);

    // Reset the form fields
    setOrderId("");
    setIssueDescription("");
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Contact Support</h1>
        {isMessageSent ? (
          <div className="text-center">
            <h2 className="text-lg font-semibold text-green-600">Message Sent Successfully!</h2>
            <p className="mt-4 text-gray-700">
              Thank you for reaching out to Support. We will respond to your issue soon.
            </p>
            <button
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
              onClick={() => setIsMessageSent(false)}
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <>
            {/* Order ID Field */}
            <label className="block text-gray-700 font-medium">Order ID</label>
            <input
              type="text"
              placeholder="Enter your Order ID"
              className={`block mt-2 px-4 py-2 w-full rounded-md border ${
                errors.orderId ? "border-red-500" : "border-gray-300"
              }`}
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
            />
            {errors.orderId && (
              <p className="text-red-500 text-sm mt-1">{errors.orderId}</p>
            )}

            {/* Issue Description Field */}
            <label className="block mt-4 text-gray-700 font-medium">Issue Description</label>
            <textarea
              placeholder="Describe your issue here"
              className={`block mt-2 px-4 py-2 w-full rounded-md border ${
                errors.issueDescription ? "border-red-500" : "border-gray-300"
              }`}
              rows="4"
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
            ></textarea>
            {errors.issueDescription && (
              <p className="text-red-500 text-sm mt-1">{errors.issueDescription}</p>
            )}

            {/* Send Button */}
            <button
              className="mt-6 w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
              onClick={handleSend}
            >
              Send to Support
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SupportContact;
