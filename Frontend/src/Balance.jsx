import React, { useState } from "react";

const Balance = () => {
  const [transactions, setTransactions] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [pendingBalance, setPendingBalance] = useState(0);
  const [outstandingFine, setOutstandingFine] = useState(0);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [showWithdrawPage, setShowWithdrawPage] = useState(false);

  // Function to add a transaction
  const addTransaction = (amount, source, status) => {
    const newTransaction = {
      amount: `$${amount}`,
      source,
      status,
      time: new Date().toLocaleDateString(),
    };
    setTransactions([...transactions, newTransaction]);

    // Update balances dynamically
    const numericAmount = parseFloat(amount);
    if (status.toLowerCase() === "pending") {
      setPendingBalance((prev) => prev + numericAmount);
    } else if (status.toLowerCase() === "cleared") {
      setTotalBalance((prev) => prev + numericAmount);
      setAvailableBalance((prev) => prev + numericAmount - outstandingFine);
    }
  };

  // Function to add a refund
  const addRefund = (amount, source) => {
    const newRefund = {
      amount: `$${amount}`,
      source,
      time: new Date().toLocaleDateString(),
    };
    setRefunds([...refunds, newRefund]);

    // Deduct from balances
    const numericAmount = parseFloat(amount);
    setTotalBalance((prev) => prev - numericAmount);
    setAvailableBalance((prev) => prev - numericAmount);
  };

  // Function to navigate to the withdrawal page
  const handleWithdraw = () => {
    setShowWithdrawPage(true);
  };

  if (showWithdrawPage) {
    return (
      <div className="bg-white shadow p-6 rounded">
        <h1 className="text-2xl font-bold mb-6 text-blue-600">Withdraw Money</h1>

        <div className="mb-6">
          <p className="text-gray-700 mb-4">A minimum of ${availableBalance.toFixed(2)} in your available balance is required to withdraw your money.</p>
          <p className="text-gray-700 mb-4">Withdraw requests are reviewed and typically take 1 business day to be approved. Requests submitted after 4:00 AM GMT on Friday will be reviewed on Mondays (unless Monday is a holiday).</p>
          <p className="text-gray-700 mb-4">If your withdraw request is approved, your entire available balance will be transferred to you via your method of choice.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-gray-700">
          <div>
            <p className="font-bold">Total Balance:</p>
            <p>${totalBalance.toFixed(2)}</p>
          </div>
          <div>
            <p className="font-bold">Outstanding Refunds:</p>
            <p>${refunds.length ? refunds.reduce((acc, refund) => acc + parseFloat(refund.amount.slice(1)), 0).toFixed(2) : "0.00"}</p>
          </div>
          <div>
            <p className="font-bold">Outstanding Fines:</p>
            <p>${outstandingFine.toFixed(2)}</p>
          </div>
          <div>
            <p className="font-bold">Available Balance:</p>
            <p>${availableBalance.toFixed(2)}</p>
          </div>
        </div>

        <div className="mt-6">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Transfer Method</th>
                <th className="border border-gray-300 px-4 py-2">Service Charge</th>
                <th className="border border-gray-300 px-4 py-2">Transfer Time</th>
                <th className="border border-gray-300 px-4 py-2">Description</th>
                <th className="border border-gray-300 px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Payoneer</td>
                <td className="border border-gray-300 px-4 py-2">$3 Flat Fee</td>
                <td className="border border-gray-300 px-4 py-2">Instant</td>
                <td className="border border-gray-300 px-4 py-2">Payoneer is very similar to PayPal. Store earnings on your Payoneer account, transfer them to your bank, or to a prepaid Mastercard.</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button className="bg-green-500 text-white px-4 py-2 rounded">Select</button>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">PayPal</td>
                <td className="border border-gray-300 px-4 py-2">~3.50%</td>
                <td className="border border-gray-300 px-4 py-2">Instant</td>
                <td className="border border-gray-300 px-4 py-2">PayPal lets you store your earnings within your PayPal account. You can transfer your PayPal balance to your bank or use it to make purchases.</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button className="bg-green-500 text-white px-4 py-2 rounded">Select</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow p-6 rounded">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-6 text-blue-600">Account Balance</h1>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={handleWithdraw}
        >
          Withdraw
        </button>
      </div>

      <div className="border-b pb-4 mb-4">
        <div className="flex justify-between text-gray-700">
          <div>
            <p className="font-bold">Total Balance:</p>
            <p>${totalBalance.toFixed(2)}</p>
          </div>
          <div>
            <p className="font-bold">Pending Balance:</p>
            <p>${pendingBalance.toFixed(2)}</p>
          </div>
          <div>
            <p className="font-bold">Outstanding Fine:</p>
            <p>-${outstandingFine.toFixed(2)}</p>
          </div>
          <div>
            <p className="font-bold">Available Balance:</p>
            <p>${availableBalance.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="font-bold text-gray-700 mb-4">Fund Transactions</h2>
        {transactions.length === 0 ? (
          <p className="text-gray-500">You don't have any fund transactions yet.</p>
        ) : (
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Amount</th>
                <th className="border border-gray-300 px-4 py-2">Source</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
                <th className="border border-gray-300 px-4 py-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">{transaction.amount}</td>
                  <td className="border border-gray-300 px-4 py-2">{transaction.source}</td>
                  <td
                    className={`border border-gray-300 px-4 py-2 ${
                      transaction.status.toLowerCase() === "pending"
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {transaction.status}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{transaction.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div>
        <h2 className="font-bold text-gray-700 mb-4">Refund Transactions</h2>
        {refunds.length === 0 ? (
          <p className="text-gray-500">You don't have any refund transactions yet.</p>
        ) : (
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Amount</th>
                <th className="border border-gray-300 px-4 py-2">Source</th>
                <th className="border border-gray-300 px-4 py-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {refunds.map((refund, index) => (
                <tr key={index} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">{refund.amount}</td>
                  <td className="border border-gray-300 px-4 py-2">{refund.source}</td>
                  <td className="border border-gray-300 px-4 py-2">{refund.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Balance;
