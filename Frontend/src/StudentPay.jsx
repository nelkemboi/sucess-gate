import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaCcApplePay,
  FaGooglePay,
  FaCcVisa,
  FaCcMastercard,
  FaPaypal,
  FaCcDiscover,
} from "react-icons/fa";

const PaymentPage = () => {
  const { projectId, writerId } = useParams();
  const navigate = useNavigate();

  const handlePaymentOptionClick = async (paymentMethod) => {
    try {
      const userId = localStorage.getItem("userID"); // Ensure userID is retrieved
      const deadline = new Date(); // Replace with the actual project deadline
  
      // Send payment details to the backend
      const response = await axios.post("http://localhost:5000/api/payment/process", {
        projectId,
        writerId,
        userId, // Include userId
        paymentMethod,
        amount: 100, // Replace with actual amount
        deadline: deadline.toISOString(), // Ensure the deadline is sent as a valid ISO date string
      });
  
      console.log("Payment successful:", response.data);
  
      // Redirect to the desired page after successful payment
      navigate("/StudentBody");
    } catch (error) {
      console.error("Error processing payment:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Payment failed. Please try again.");
    }
  };
  

  return (
    <div className="w-full h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-md shadow-md w-2/3">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Options</h2>
        <p className="text-gray-600 mb-4">
          Please choose a payment method to proceed with hiring the expert for your project.
        </p>
        <div className="flex justify-center space-x-6">
          <FaCcApplePay
            size={36}
            className="text-gray-300 hover:text-black transition cursor-pointer"
            onClick={() => handlePaymentOptionClick("ApplePay")}
          />
          <FaGooglePay
            size={36}
            className="text-gray-300 hover:text-black transition cursor-pointer"
            onClick={() => handlePaymentOptionClick("GooglePay")}
          />
          <FaCcVisa
            size={36}
            className="text-blue-500 hover:text-black transition cursor-pointer"
            onClick={() => handlePaymentOptionClick("Visa")}
          />
          <FaCcMastercard
            size={36}
            className="text-red-500 hover:text-black transition cursor-pointer"
            onClick={() => handlePaymentOptionClick("Mastercard")}
          />
          <FaPaypal
            size={36}
            className="text-blue-700 hover:text-black transition cursor-pointer"
            onClick={() => handlePaymentOptionClick("PayPal")}
          />
          <FaCcDiscover
            size={36}
            className="text-orange-500 hover:text-black transition cursor-pointer"
            onClick={() => handlePaymentOptionClick("Discover")}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
