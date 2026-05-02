'use client';

import { useState } from 'react';
import styles from '@/styles/calculator.module.css';

const API_BASE_URL = 'http://localhost:3000';

export default function CalculatorUI() {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState(null);
  const [operation, setOperation] = useState(null);
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleNumber = (num) => {
    setError(null);
    if (shouldResetDisplay) {
      setDisplay(String(num));
      setShouldResetDisplay(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  const handleDecimal = () => {
    setError(null);
    if (shouldResetDisplay) {
      setDisplay('0.');
      setShouldResetDisplay(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperation = (op) => {
    setError(null);
    const currentNum = parseFloat(display);

    if (firstOperand === null) {
      setFirstOperand(currentNum);
    } else if (operation) {
      handleEquals(op);
      return;
    }

    setOperation(op);
    setShouldResetDisplay(true);
  };

  const handleEquals = async (nextOp = null) => {
    setError(null);

    if (firstOperand === null || operation === null) {
      return;
    }

    const secondOperand = parseFloat(display);

    try {
      setLoading(true);
      const endpoint = `${API_BASE_URL}/${operation}`;

      console.log('Calling:', endpoint, { a: firstOperand, b: secondOperand });

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ a: firstOperand, b: secondOperand })
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: Calculation failed`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      const result = data.result;

      setDisplay(String(result));
      setFirstOperand(nextOp ? result : null);
      setOperation(nextOp || null);
      setShouldResetDisplay(nextOp ? true : false);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
      setDisplay('0');
      setFirstOperand(null);
      setOperation(null);
      setShouldResetDisplay(false);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperation(null);
    setShouldResetDisplay(false);
    setError(null);
  };

  const handleBackspace = () => {
    setError(null);
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  return (
    <div className={styles.calculator}>
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.display} data-testid="display">
        {display}
      </div>

      <div className={styles.buttons}>
        <button className={styles.btnFunction} onClick={handleClear}>
          AC
        </button>
        <button className={styles.btnFunction} onClick={handleBackspace}>
          ←
        </button>
        <button className={styles.btnOperator} onClick={() => handleOperation('divide')}>
          ÷
        </button>
        <button className={styles.btnOperator} onClick={() => handleOperation('multiply')}>
          ×
        </button>

        <button onClick={() => handleNumber(7)}>7</button>
        <button onClick={() => handleNumber(8)}>8</button>
        <button onClick={() => handleNumber(9)}>9</button>
        <button className={styles.btnOperator} onClick={() => handleOperation('subtract')}>
          −
        </button>

        <button onClick={() => handleNumber(4)}>4</button>
        <button onClick={() => handleNumber(5)}>5</button>
        <button onClick={() => handleNumber(6)}>6</button>
        <button className={styles.btnOperator} onClick={() => handleOperation('add')}>
          +
        </button>

        <button onClick={() => handleNumber(1)}>1</button>
        <button onClick={() => handleNumber(2)}>2</button>
        <button onClick={() => handleNumber(3)}>3</button>
        <button className={styles.btnEquals} rowSpan="2" onClick={() => handleEquals()}>
          =
        </button>

        <button className={styles.btnZero} onClick={() => handleNumber(0)}>
          0
        </button>
        <button onClick={handleDecimal}>.</button>
      </div>

      {loading && <div className={styles.loading}>Calculating...</div>}
    </div>
  );
}
