'use client'
import { useState } from "react";
const performOperation = (a: number, b: number, operator: string): number => {
  switch (operator) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return b !== 0 ? a / b : NaN;
    default:
      return NaN;
  }
};

// Function to evaluate an expression following BODMAS
const evaluateExpression = (expression: string): number | string => {
  // Split the expression into numbers and operators
  const tokens = expression.match(/[+\-*/()]|\d+\.?\d*/g);

  if (!tokens) return "Error";

  // Stacks to store numbers and operators
  const numbers: number[] = [];
  const operators: string[] = [];

  // Operator precedence: higher numbers mean higher precedence
  const precedence: { [key: string]: number } = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2,
  };

  const applyOperator = () => {
    const b = numbers.pop()!;
    const a = numbers.pop()!;
    const operator = operators.pop()!;
    numbers.push(performOperation(a, b, operator));
  };

  for (const token of tokens) {
    if (!isNaN(Number(token))) {
      // It's a number, push to the numbers stack
      numbers.push(parseFloat(token));
    } else if (token in precedence) {
      // It's an operator, handle precedence
      while (
        operators.length > 0 &&
        precedence[operators[operators.length - 1]] >= precedence[token]
      ) {
        applyOperator();
      }
      operators.push(token);
    }
  }

  // Apply remaining operators
  while (operators.length > 0) {
    applyOperator();
  }

  return numbers.pop()!.toString();
};

const Calculator = () => {
  const [displayValue, setDisplayValue] = useState("0");
  const [expression, setExpression] = useState<string>("");

  const inputDigit = (digit: string) => {
    if (displayValue === "0" && digit !== ".") {
      setDisplayValue(digit);
      setExpression(digit);
    } else {
      setDisplayValue(displayValue + digit);
      setExpression(expression + digit);
    }
  };

  const inputDot = () => {
    if (!displayValue.includes(".")) {
      setDisplayValue(displayValue + ".");
      setExpression(expression + ".");
    }
  };

  const clearDisplay = () => {
    setDisplayValue("0");
    setExpression("");
  };

  const toggleSign = () => {
    if (displayValue.charAt(0) === "-") {
      setDisplayValue(displayValue.slice(1));
      setExpression(expression.slice(1));
    } else {
      setDisplayValue("-" + displayValue);
      setExpression("-" + expression);
    }
  };

  const inputPercent = () => {
    const currentValue = parseFloat(displayValue);
    if (currentValue === 0) return;
    const newValue = currentValue / 100;
    setDisplayValue(newValue.toString());
    setExpression(newValue.toString());
  };

  const handleOperator = (operator: string) => {
    if (expression.length === 0) return;
    const lastChar = expression[expression.length - 1];
    if ("+-*/".includes(lastChar)) {
      // Replace last operator with the new one
      setExpression(expression.slice(0, -1) + operator);
      setDisplayValue(displayValue.slice(0, -1) + operator);
    } else {
      setExpression(expression + operator);
      setDisplayValue(displayValue + operator);
    }
  };

  const handleEqual = () => {
    const result = evaluateExpression(expression);
    setDisplayValue(result.toString());
    setExpression(result.toString());
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="w-80 bg-gray-800 rounded-lg shadow-lg p-4">
        <div className="bg-black text-white text-right text-4xl p-4 rounded-lg mb-4">
          {displayValue}
        </div>

        <div className="grid grid-cols-4 gap-2">
          <button className="btn" onClick={clearDisplay}>
            AC
          </button>
          <button className="btn" onClick={toggleSign}>
            ±
          </button>
          <button className="btn" onClick={inputPercent}>
            %
          </button>
          <button className="btn bg-orange-500" onClick={() => handleOperator("/")}>
            ÷
          </button>

          <button className="btn" onClick={() => inputDigit("7")}>
            7
          </button>
          <button className="btn" onClick={() => inputDigit("8")}>
            8
          </button>
          <button className="btn" onClick={() => inputDigit("9")}>
            9
          </button>
          <button className="btn bg-orange-500" onClick={() => handleOperator("*")}>
            ×
          </button>

          <button className="btn" onClick={() => inputDigit("4")}>
            4
          </button>
          <button className="btn" onClick={() => inputDigit("5")}>
            5
          </button>
          <button className="btn" onClick={() => inputDigit("6")}>
            6
          </button>
          <button className="btn bg-orange-500" onClick={() => handleOperator("-")}>
            −
          </button>

          <button className="btn" onClick={() => inputDigit("1")}>
            1
          </button>
          <button className="btn" onClick={() => inputDigit("2")}>
            2
          </button>
          <button className="btn" onClick={() => inputDigit("3")}>
            3
          </button>
          <button className="btn bg-orange-500" onClick={() => handleOperator("+")}>
            +
          </button>

          <button className="btn col-span-2" onClick={() => inputDigit("0")}>
            0
          </button>
          <button className="btn" onClick={inputDot}>
            .
          </button>
          <button className="btn bg-orange-500" onClick={handleEqual}>
            =
          </button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
