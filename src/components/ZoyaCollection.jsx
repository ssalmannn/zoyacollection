import React, { useState } from "react";

const TagCalculator = () => {
  const [mode, setMode] = useState("purchaseToTag"); // "purchaseToTag" or "tagToPurchase"
  const [input, setInput] = useState(""); // User input
  const [summary, setSummary] = useState(null); // Summary result object

  // Category ranges and values
  const categories = [
    {
      range: [300, 500],
      outputRange: [460, 760],
      profit: 0.3,
      margin: 0.05,
      discount: 0.1,
    },
    {
      range: [500, 800],
      outputRange: [760, 1310],
      profit: 0.3,
      margin: 0.07,
      discount: 0.15,
    },
    {
      range: [800, 1200],
      outputRange: [1310, 2150],
      profit: 0.3,
      margin: 0.1,
      discount: 0.2,
    },
    {
      range: [1200, 1600],
      outputRange: [2150, 3130],
      profit: 0.3,
      margin: 0.13,
      discount: 0.25,
    },
    {
      range: [1600, 2000],
      outputRange: [3130, 3990],
      profit: 0.3,
      margin: 0.15,
      discount: 0.25,
    },
    {
      range: [2000, 2400],
      outputRange: [3990, 5130],
      profit: 0.3,
      margin: 0.15,
      discount: 0.3,
    },
  ];

  // Utility functions
  const roundToTens = (value) => Math.round(value / 10) * 10;

  const findCategory = (amount, isPurchase = true) => {
    return categories.find((cat) =>
      isPurchase
        ? amount >= cat.range[0] && amount <= cat.range[1]
        : amount >= cat.outputRange[0] && amount <= cat.outputRange[1]
    );
  };

  const calculateTaggedPrice = (purchaseAmount) => {
    const category = findCategory(purchaseAmount, true);
    if (!category) return null;

    const { profit, margin, discount } = category;

    // Calculate intermediate values
    const profitAmount = {
      name: "Profit",
      profit: purchaseAmount * profit,
      total: purchaseAmount * (1 + profit),
      percentage: profit * 100,
    };

    const marginAmount = {
      name: "Margin",
      profit: profitAmount.profit + profitAmount.total * margin,
      total: profitAmount.total * (1 + margin),
      percentage: Math.round(margin * 100),
    };

    const discountAmount = {
      name: "Discount",
      profit: marginAmount.profit + marginAmount.total * discount,
      total: marginAmount.total / (1 - discount),
      percentage: discount * 100,
    };

    const taggedPrice = {
      name: "Tagged",
      profit: roundToTens(discountAmount.total) - purchaseAmount,
      total: roundToTens(discountAmount.total), // Rounding as per the original code logic
      percentage: 0,
    };

    return {
      purchaseAmount: {
        name: "Purchase",
        profit: 0,
        total: purchaseAmount,
        percentage: 0,
      },
      profitAmount,
      marginAmount,
      discountAmount,
      taggedPrice,
    };
  };

  const calculatePurchasePrice = (taggedAmount) => {
    const category = findCategory(taggedAmount, false);
    if (!category) return null;

    const { profit, margin, discount } = category;

    // Reverse calculation
    const purchaseAmount =
      (taggedAmount * (1 - discount)) / ((1 + margin) * (1 + profit));
    const discountAmount = taggedAmount * discount;
    const marginAmount = purchaseAmount * margin;
    const profitAmount = purchaseAmount * profit;

    return {
      taggedAmount: {
        name: "Tagged",
        total: taggedAmount,
        profit: taggedAmount - purchaseAmount,
        percentage: Math.round(
          ((taggedAmount - purchaseAmount) / purchaseAmount) * 100
        ),
      },
      discountAmount: {
        name: "Discount",
        total: taggedAmount - discountAmount,
        profit: taggedAmount - discountAmount - purchaseAmount,
        percentage: discount * 100,
      },
      marginAmount: {
        name: "Margin",
        total: taggedAmount - discountAmount - marginAmount,
        profit: taggedAmount - discountAmount - marginAmount - purchaseAmount,
        percentage: Math.round(margin * 100),
      },
      profitAmount: {
        name: "Profit",
        total: taggedAmount - discountAmount - marginAmount - profitAmount,
        profit:
          taggedAmount -
          discountAmount -
          marginAmount -
          profitAmount -
          purchaseAmount,
        percentage: profit * 100,
      },
      purchaseAmount: {
        name: "Purchase",
        total: roundToTens(purchaseAmount),
        profit: Math.abs(purchaseAmount - roundToTens(purchaseAmount)),
        percentage: 0,
      },
    };
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(input);

    if (isNaN(amount)) {
      setSummary({ error: "Please enter a valid number" });
      return;
    }

    const result =
      mode === "purchaseToTag"
        ? calculateTaggedPrice(amount)
        : calculatePurchasePrice(amount);

    console.log(result);

    if (!result) {
      setSummary({ error: "Amount does not fall into a valid range" });
    } else {
      setSummary(result);
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={() => {
            setMode("purchaseToTag");
            setSummary("");
          }}
          style={{
            padding: "10px 20px",
            backgroundColor: mode === "purchaseToTag" ? "#007bff" : "#ddd",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Purchase to Tag
        </button>
        <button
          onClick={() => {
            setMode("tagToPurchase");
            setSummary("");
          }}
          style={{
            padding: "10px 20px",
            backgroundColor: mode === "tagToPurchase" ? "#007bff" : "#ddd",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Tag to Purchase
        </button>
      </header>

      <form onSubmit={handleSubmit}>
        <label>
          Enter {mode === "purchaseToTag" ? "Purchase Amount" : "Tagged Amount"}
          :
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              marginLeft: "10px",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </label>
        <button
          type="submit"
          style={{
            marginLeft: "10px",
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Calculate
        </button>
      </form>

      {summary && (
        <div style={{ marginTop: "20px", fontSize: "16px" }}>
          {summary.error ? (
            <div style={{ color: "red" }}>{summary.error}</div>
          ) : (
            <div>
              <p>
                <strong>Summary:</strong>
              </p>
              {Object.keys(summary).map((key) => (
                <div key={key} style={{ margin: "10px" }}>
                  <strong>{summary[key].name}: </strong>
                  Rs {summary[key].total.toFixed(2)} (Rs{" "}
                  {summary[key].profit.toFixed(2)}) | {summary[key].percentage}%
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TagCalculator;
