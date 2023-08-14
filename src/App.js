import React, { useState, useEffect } from "react";
import "./App.css";
const duration = [12, 24, 36, 48, 60];

function App() {
  const [inputFields, setInputFields] = useState({
    assetCost: "",
    interestRate: 10,
    processingFee: 1,
  });

  const [amount, setAmount] = useState({
    downPayment: 0,
    totalDownPayment: 0,
    loanAmount: 0,
    totalLoanAmount: 0,
    calculatedLoanAmount: 0,
    tenure: 12,
  });

  const handleInputFieldChange = (e) => {
    setInputFields((prevState) => {
      return { ...prevState, [e.target.id]: e.target.value };
    });
  };

  useEffect(() => {
    const p = inputFields.assetCost;
    const r = inputFields.interestRate / 100;
    const n = parseInt(amount.tenure / 12);
    console.log(p, r, n);
    const loan = parseInt(
      (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    );
    console.log(loan);

    setAmount((prevState) => {
      return {
        ...prevState,
        totalLoanAmount: loan,
        loanAmount: parseInt(loan / amount.tenure),
        calculatedLoanAmount: loan,
        // downPayment: 0,
        // totalDownPayment: 0,
      };
    });
  }, [inputFields, amount.tenure]);

  const handleAmountSlider = (e) => {
    //console.log(e.target.id);
    if (e.target.id === "loanAmount") {
      const downPaymentWithoutProcessingFee =
        amount.calculatedLoanAmount - e.target.value * amount.tenure;
      const downPaymentWithProcessingFee = parseInt(
        downPaymentWithoutProcessingFee +
          (inputFields.processingFee / 100) * downPaymentWithoutProcessingFee
      );
      setAmount((prevState) => {
        return {
          ...prevState,
          downPayment: downPaymentWithoutProcessingFee,
          totalDownPayment: downPaymentWithProcessingFee,
          loanAmount: e.target.value,
          totalLoanAmount: e.target.value * amount.tenure,
        };
      });
    } else {
      const downPayment = e.target.value;

      setAmount((prevState) => {
        return {
          ...prevState,
          downPayment: downPayment,
          totalDownPayment: parseInt(
            (inputFields.processingFee / 100) * downPayment +
              Number(downPayment)
          ),
          loanAmount: parseInt(
            (amount.calculatedLoanAmount - downPayment) / amount.tenure
          ),
          totalLoanAmount: amount.calculatedLoanAmount - downPayment,
        };
      });
    }
  };

  return (
    <div className="App">
      <div>
        <h1>EMI Calculator</h1>
      </div>
      <div className="InputFields">
        <div className="Inputs">
          <label for="assetCost">Total Cost of Asset</label>
          <input
            type="number"
            id="assetCost"
            value={inputFields.assetCost}
            onChange={handleInputFieldChange}
          />
        </div>
        <div className="Inputs">
          <label for="interestRate">Interest Rate (in %)</label>
          <input
            type="number"
            id="interestRate"
            value={inputFields.interestRate}
            onChange={handleInputFieldChange}
          />
        </div>
        <div className="Inputs">
          <label for="processingFee">Processing Fee (in %)</label>
          <input
            type="number"
            id="processingFee"
            value={inputFields.processingFee}
            onChange={handleInputFieldChange}
          />
        </div>
      </div>
      <div className="Amount">
        <label>Down Payment</label>
        <p className="TotalAmount">
          Total Down Payment - {amount.totalDownPayment}
        </p>
        <input
          type="range"
          min="0"
          max={amount.calculatedLoanAmount}
          className="slider"
          id="downPayment"
          value={amount.downPayment}
          onChange={handleAmountSlider}
        />
        <div className="PercentageValues">
          <p>0%</p>
          <p>{amount.downPayment}</p>
          <p>100%</p>
        </div>
      </div>
      <div className="Amount">
        <label>Loan Per Month</label>
        <p className="TotalAmount">
          Total Loan Amount - {amount.totalLoanAmount}
        </p>
        <input
          type="range"
          min="0"
          max={parseInt(amount.calculatedLoanAmount / amount.tenure)}
          className="slider"
          id="loanAmount"
          value={amount.loanAmount}
          onChange={handleAmountSlider}
        />
        <div className="PercentageValues">
          <p>0%</p>
          <p>{amount.loanAmount}</p>
          <p>100%</p>
        </div>
      </div>
      <div className="Tenure">
        <label>Tenure</label>
        <div className="DurationContainer">
          {duration.map((duration) => {
            return (
              <div
                key={duration}
                className={
                  duration === amount.tenure ? "Duration Active" : "Duration"
                }
                onClick={() =>
                  setAmount((prevState) => ({
                    ...prevState,
                    tenure: duration,
                  }))
                }
              >
                {duration}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
