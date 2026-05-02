'use client';

import { useState } from 'react';
import styles from '@/styles/scientific-calculator.module.css';

const API_BASE_URL = 'http://localhost:3000';

export default function ScientificCalculator() {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState(null);
  const [operation, setOperation] = useState(null);
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);
  const [angleMode, setAngleMode] = useState('degrees');
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

  const handleAdvancedFunction = async (func) => {
    setError(null);
    const value = parseFloat(display);

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/calculate-advanced`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operation: func,
          value,
          angle: angleMode
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Calculation failed');
      }

      const data = await response.json();
      setDisplay(String(data.result));
      setFirstOperand(null);
      setOperation(null);
      setShouldResetDisplay(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePower = async () => {
    setError(null);
    const base = parseFloat(display);

    if (firstOperand === null) {
      setFirstOperand(base);
      setOperation('power');
      setShouldResetDisplay(true);
    } else if (operation === 'power') {
      try {
        setLoading(true);
        const exponent = base;
        const response = await fetch(`${API_BASE_URL}/power`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base: firstOperand, exponent })
        });

        if (!response.ok) {
          throw new Error('Power calculation failed');
        }

        const data = await response.json();
        setDisplay(String(data.result));
        setFirstOperand(null);
        setOperation(null);
        setShouldResetDisplay(true);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEquals = async (nextOp = null) => {
    setError(null);

    if (firstOperand === null || operation === null) {
      return;
    }

    const secondOperand = parseFloat(display);

    try {
      setLoading(true);
      const endpoint =
        operation === 'power' ? `${API_BASE_URL}/power` : `${API_BASE_URL}/${operation}`;

      const body =
        operation === 'power'
          ? { base: firstOperand, exponent: secondOperand }
          : { a: firstOperand, b: secondOperand };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Calculation failed');
      }

      const data = await response.json();
      const result = data.result;

      setDisplay(String(result));
      setFirstOperand(nextOp ? result : null);
      setOperation(nextOp || null);
      setShouldResetDisplay(nextOp ? true : false);
    } catch (err) {
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

  const toggleAngleMode = () => {
    setAngleMode(angleMode === 'degrees' ? 'radians' : 'degrees');
  };

  return (
    <div className={styles.scientificCalc}>
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.header}>
        <button className={styles.angleToggle} onClick={toggleAngleMode}>
          {angleMode.toUpperCase()}
        </button>
      </div>

      <div className={styles.display} data-testid="display">{display}</div>

      <div className={styles.grid}>
        {/* Row 1 */}
        <button className={styles.btnFunction} onClick={handleClear}>
          AC
        </button>
        <button className={styles.btnFunction} onClick={handleBackspace}>
          ←
        </button>
        <button className={styles.btnFunction} onClick={() => handleAdvancedFunction('negate')}>
          ±
        </button>
        <button className={styles.btnOperator} onClick={() => handleOperation('divide')}>
          ÷
        </button>

        {/* Row 2 */}
        <button onClick={() => handleAdvancedFunction('percent')}>%</button>
        <button onClick={() => handleAdvancedFunction('sqrt')}>√</button>
        <button onClick={() => handleAdvancedFunction('square')}>x²</button>
        <button onClick={() => handleAdvancedFunction('cube')}>x³</button>

        {/* Row 3 */}
        <button onClick={() => handleAdvancedFunction('sin')}>sin</button>
        <button onClick={() => handleAdvancedFunction('cos')}>cos</button>
        <button onClick={() => handleAdvancedFunction('tan')}>tan</button>
        <button className={styles.btnOperator} onClick={() => handleOperation('multiply')}>
          ×
        </button>

        {/* Row 4 */}
        <button onClick={() => handleAdvancedFunction('asin')}>asin</button>
        <button onClick={() => handleAdvancedFunction('acos')}>acos</button>
        <button onClick={() => handleAdvancedFunction('atan')}>atan</button>
        <button className={styles.btnOperator} onClick={() => handleOperation('subtract')}>
          −
        </button>

        {/* Row 5 */}
        <button onClick={() => handleAdvancedFunction('log')}>log</button>
        <button onClick={() => handleAdvancedFunction('ln')}>ln</button>
        <button onClick={() => handleAdvancedFunction('exp')}>eˣ</button>
        <button className={styles.btnOperator} onClick={() => handleOperation('add')}>
          +
        </button>

        {/* Row 6 */}
        <button onClick={() => handleAdvancedFunction('factorial')}>n!</button>
        <button onClick={() => handleAdvancedFunction('reciprocal')}>1/x</button>
        <button onClick={handlePower}>xʸ</button>
        <button className={styles.btnOperator} onClick={() => handleAdvancedFunction('pi')}>
          π
        </button>

        {/* Row 7 - Numbers */}
        <button onClick={() => handleNumber(7)}>7</button>
        <button onClick={() => handleNumber(8)}>8</button>
        <button onClick={() => handleNumber(9)}>9</button>
        <button onClick={() => handleAdvancedFunction('e')}>e</button>

        {/* Row 8 */}
        <button onClick={() => handleNumber(4)}>4</button>
        <button onClick={() => handleNumber(5)}>5</button>
        <button onClick={() => handleNumber(6)}>6</button>
        <button onClick={() => handleAdvancedFunction('abs')}>|x|</button>

        {/* Row 9 */}
        <button onClick={() => handleNumber(1)}>1</button>
        <button onClick={() => handleNumber(2)}>2</button>
        <button onClick={() => handleNumber(3)}>3</button>
        <button className={styles.btnEquals} onClick={() => handleEquals()}>
          =
        </button>

        {/* Row 10 */}
        <button className={styles.btnZero} onClick={() => handleNumber(0)}>
          0
        </button>
        <button onClick={handleDecimal}>.</button>
      </div>

      {loading && <div className={styles.loading}>Calculating...</div>}
    </div>
  );
}
