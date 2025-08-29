import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

export const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForNewValue(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
    }
  };

  const clearAll = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const clearEntry = () => {
    setDisplay('0');
  };

  const inputDecimal = () => {
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  return (
    <div className="h-full bg-os-dark text-os-bright p-4 max-w-sm mx-auto">
      <div className="mb-4">
        <div className="bg-os-void p-4 rounded-lg text-right text-2xl font-mono min-h-16 flex items-center justify-end border border-os-medium">
          {display}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {/* Row 1 */}
        <Button variant="outline" onClick={clearAll} className="bg-os-medium hover:bg-os-light">
          AC
        </Button>
        <Button variant="outline" onClick={clearEntry} className="bg-os-medium hover:bg-os-light">
          CE
        </Button>
        <Button variant="outline" onClick={() => inputOperation('÷')} className="bg-infinity-primary hover:bg-infinity-secondary text-white">
          ÷
        </Button>
        <Button variant="outline" onClick={() => inputOperation('×')} className="bg-infinity-primary hover:bg-infinity-secondary text-white">
          ×
        </Button>

        {/* Row 2 */}
        <Button variant="outline" onClick={() => inputNumber('7')} className="bg-os-shadow hover:bg-os-medium">
          7
        </Button>
        <Button variant="outline" onClick={() => inputNumber('8')} className="bg-os-shadow hover:bg-os-medium">
          8
        </Button>
        <Button variant="outline" onClick={() => inputNumber('9')} className="bg-os-shadow hover:bg-os-medium">
          9
        </Button>
        <Button variant="outline" onClick={() => inputOperation('-')} className="bg-infinity-primary hover:bg-infinity-secondary text-white">
          -
        </Button>

        {/* Row 3 */}
        <Button variant="outline" onClick={() => inputNumber('4')} className="bg-os-shadow hover:bg-os-medium">
          4
        </Button>
        <Button variant="outline" onClick={() => inputNumber('5')} className="bg-os-shadow hover:bg-os-medium">
          5
        </Button>
        <Button variant="outline" onClick={() => inputNumber('6')} className="bg-os-shadow hover:bg-os-medium">
          6
        </Button>
        <Button variant="outline" onClick={() => inputOperation('+')} className="bg-infinity-primary hover:bg-infinity-secondary text-white">
          +
        </Button>

        {/* Row 4 */}
        <Button variant="outline" onClick={() => inputNumber('1')} className="bg-os-shadow hover:bg-os-medium">
          1
        </Button>
        <Button variant="outline" onClick={() => inputNumber('2')} className="bg-os-shadow hover:bg-os-medium">
          2
        </Button>
        <Button variant="outline" onClick={() => inputNumber('3')} className="bg-os-shadow hover:bg-os-medium">
          3
        </Button>
        <Button variant="outline" onClick={performCalculation} className="row-span-2 bg-infinity-secondary hover:bg-infinity-primary text-white">
          =
        </Button>

        {/* Row 5 */}
        <Button variant="outline" onClick={() => inputNumber('0')} className="col-span-2 bg-os-shadow hover:bg-os-medium">
          0
        </Button>
        <Button variant="outline" onClick={inputDecimal} className="bg-os-shadow hover:bg-os-medium">
          .
        </Button>
      </div>
    </div>
  );
};