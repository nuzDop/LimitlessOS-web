import React, { useState } from 'react';

export const Calculator: React.FC = () => {
  const [display, setDisplay] = useState("0");
  const [currentValue, setCurrentValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(true);

  const handleDigitClick = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  };

  const handleOperatorClick = (op: string) => {
    const inputValue = parseFloat(display);
    if (currentValue === null) {
      setCurrentValue(inputValue);
    } else if (operator) {
      const result = calculate();
      setCurrentValue(result);
      setDisplay(String(result));
    }
    setWaitingForOperand(true);
    setOperator(op);
  };

  const calculate = () => {
    const inputValue = parseFloat(display);
    if (currentValue === null || operator === null) return inputValue;
    switch (operator) {
      case '+': return currentValue + inputValue;
      case '-': return currentValue - inputValue;
      case '*': return currentValue * inputValue;
      case '/': return currentValue / inputValue;
      default: return inputValue;
    }
  };

  const handleEquals = () => {
    const result = calculate();
    setCurrentValue(result);
    setDisplay(String(result));
    setOperator(null);
    setWaitingForOperand(true);
  };

  const handleClear = () => {
    setDisplay("0");
    setCurrentValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  };

  const buttons = [
    'C', '±', '%', '/',
    '7', '8', '9', '*',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    '0', '.', '='
  ];

  const handleButtonClick = (btn: string) => {
    if (!isNaN(parseInt(btn))) handleDigitClick(btn);
    else if (btn === '.') setDisplay(display.includes('.') ? display : display + '.');
    else if (['/', '*', '-', '+'].includes(btn)) handleOperatorClick(btn);
    else if (btn === '=') handleEquals();
    else if (btn === 'C') handleClear();
  };

  return (
    <div className="h-full bg-os-dark text-os-bright flex flex-col p-2">
        <div className="bg-os-shadow text-right text-4xl p-4 rounded-md mb-2">{display}</div>
        <div className="grid grid-cols-4 gap-2 flex-1">
            {buttons.map(btn => (
                <button key={btn} onClick={() => handleButtonClick(btn)} className="bg-os-medium hover:bg-os-light/20 rounded-md text-xl font-bold transition-colors">
                    {btn}
                </button>
            ))}
        </div>
    </div>
  );
};
