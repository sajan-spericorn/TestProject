'use client';

import { useState } from 'react';
import ScientificCalculator from '@/components/ScientificCalculator';
import CalculatorUI from '@/components/CalculatorUI';
import styles from '@/styles/page.module.css';

export default function Home() {
  const [mode, setMode] = useState('scientific');

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1>Calculator</h1>
        <div className={styles.modeToggle}>
          <button
            className={mode === 'scientific' ? styles.active : ''}
            onClick={() => setMode('scientific')}
          >
            Scientific
          </button>
          <button
            className={mode === 'basic' ? styles.active : ''}
            onClick={() => setMode('basic')}
          >
            Basic
          </button>
        </div>
        {mode === 'scientific' ? <ScientificCalculator /> : <CalculatorUI />}
      </div>
    </main>
  );
}

