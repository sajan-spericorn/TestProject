import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ScientificCalculator from '@/components/ScientificCalculator';

global.fetch = jest.fn();

const getDisplay = () => document.querySelector('[class*="display"]');

describe('ScientificCalculator Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('Rendering', () => {
    it('renders with initial display of 0', () => {
      render(<ScientificCalculator />);
      expect(getDisplay()).toHaveTextContent('0');
    });

    it('renders angle mode toggle defaulting to DEGREES', () => {
      render(<ScientificCalculator />);
      expect(screen.getByRole('button', { name: 'DEGREES' })).toBeInTheDocument();
    });

    it('renders all number buttons 0-9', () => {
      render(<ScientificCalculator />);
      for (let i = 0; i <= 9; i++) {
        expect(screen.getByRole('button', { name: i.toString() })).toBeInTheDocument();
      }
    });

    it('renders scientific function buttons', () => {
      render(<ScientificCalculator />);
      expect(screen.getByRole('button', { name: 'sin' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'cos' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'tan' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'asin' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'acos' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'atan' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '√' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'log' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'ln' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'n!' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '1/x' })).toBeInTheDocument();
    });

    it('renders operator and utility buttons', () => {
      render(<ScientificCalculator />);
      expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '−' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '×' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '÷' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '=' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'AC' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '←' })).toBeInTheDocument();
    });
  });

  describe('Number Input', () => {
    it('displays a clicked number', () => {
      render(<ScientificCalculator />);
      fireEvent.click(screen.getByRole('button', { name: '7' }));
      expect(getDisplay()).toHaveTextContent('7');
    });

    it('appends digits to build multi-digit numbers', () => {
      render(<ScientificCalculator />);
      fireEvent.click(screen.getByRole('button', { name: '4' }));
      fireEvent.click(screen.getByRole('button', { name: '2' }));
      expect(getDisplay()).toHaveTextContent('42');
    });

    it('replaces leading 0 with first digit', () => {
      render(<ScientificCalculator />);
      fireEvent.click(screen.getByRole('button', { name: '5' }));
      expect(getDisplay()).toHaveTextContent('5');
      expect(getDisplay()).not.toHaveTextContent('05');
    });

    it('supports decimal input', () => {
      render(<ScientificCalculator />);
      fireEvent.click(screen.getByRole('button', { name: '3' }));
      fireEvent.click(screen.getByRole('button', { name: '.' }));
      fireEvent.click(screen.getByRole('button', { name: '1' }));
      expect(getDisplay()).toHaveTextContent('3.1');
    });

    it('does not allow multiple decimal points', () => {
      render(<ScientificCalculator />);
      fireEvent.click(screen.getByRole('button', { name: '3' }));
      fireEvent.click(screen.getByRole('button', { name: '.' }));
      fireEvent.click(screen.getByRole('button', { name: '.' }));
      expect(getDisplay()).toHaveTextContent('3.');
    });

    it('resets display to new digit after an operator', () => {
      render(<ScientificCalculator />);
      fireEvent.click(screen.getByRole('button', { name: '5' }));
      fireEvent.click(screen.getByRole('button', { name: '+' }));
      fireEvent.click(screen.getByRole('button', { name: '3' }));
      expect(getDisplay()).toHaveTextContent('3');
    });
  });

  describe('Clear and Backspace', () => {
    it('resets display to 0 on AC', () => {
      render(<ScientificCalculator />);
      fireEvent.click(screen.getByRole('button', { name: '9' }));
      fireEvent.click(screen.getByRole('button', { name: 'AC' }));
      expect(getDisplay()).toHaveTextContent('0');
    });

    it('removes last character on backspace', () => {
      render(<ScientificCalculator />);
      fireEvent.click(screen.getByRole('button', { name: '4' }));
      fireEvent.click(screen.getByRole('button', { name: '2' }));
      fireEvent.click(screen.getByRole('button', { name: '←' }));
      expect(getDisplay()).toHaveTextContent('4');
    });

    it('resets to 0 when backspacing the only digit', () => {
      render(<ScientificCalculator />);
      fireEvent.click(screen.getByRole('button', { name: '8' }));
      fireEvent.click(screen.getByRole('button', { name: '←' }));
      expect(getDisplay()).toHaveTextContent('0');
    });

    it('AC clears error message', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Some error' })
      });
      render(<ScientificCalculator />);
      fireEvent.click(screen.getByRole('button', { name: '5' }));
      fireEvent.click(screen.getByRole('button', { name: 'sin' }));
      await waitFor(() => expect(screen.getByText('Some error')).toBeInTheDocument());
      fireEvent.click(screen.getByRole('button', { name: 'AC' }));
      expect(screen.queryByText('Some error')).not.toBeInTheDocument();
    });
  });

  describe('Angle Mode Toggle', () => {
    it('toggles from DEGREES to RADIANS', () => {
      render(<ScientificCalculator />);
      fireEvent.click(screen.getByRole('button', { name: 'DEGREES' }));
      expect(screen.getByRole('button', { name: 'RADIANS' })).toBeInTheDocument();
    });

    it('toggles back from RADIANS to DEGREES', () => {
      render(<ScientificCalculator />);
      fireEvent.click(screen.getByRole('button', { name: 'DEGREES' }));
      fireEvent.click(screen.getByRole('button', { name: 'RADIANS' }));
      expect(screen.getByRole('button', { name: 'DEGREES' })).toBeInTheDocument();
    });

    it('sends degrees angle mode by default', async () => {
      fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ result: 0 }) });
      render(<ScientificCalculator />);
      fireEvent.click(screen.getByRole('button', { name: '0' }));
      fireEvent.click(screen.getByRole('button', { name: 'sin' }));
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:3000/calculate-advanced',
          expect.objectContaining({
            body: JSON.stringify({ operation: 'sin', value: 0, angle: 'degrees' })
          })
        );
      });
    });

    it('sends radians angle mode after toggle', async () => {
      fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ result: 0 }) });
      render(<ScientificCalculator />);
      fireEvent.click(screen.getByRole('button', { name: 'DEGREES' }));
      fireEvent.click(screen.getByRole('button', { name: '0' }));
      fireEvent.click(screen.getByRole('button', { name: 'sin' }));
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:3000/calculate-advanced',
          expect.objectContaining({
            body: JSON.stringify({ operation: 'sin', value: 0, angle: 'radians' })
          })
        );
      });
    });
  });

  describe('Advanced Functions (API integration)', () => {
    const mockResult = (result) =>
      fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ result }) });

    it('sqrt: calls API and displays result', async () => {
      mockResult(3);
      render(<ScientificCalculator />);
      fireEvent.click(screen.getByRole('button', { name: '9' }));
      fireEvent.click(screen.getByRole('button', { name: '√' }));
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:3000/calculate-advanced',
          expect.objectContaining({
            body: JSON.stringify({ operation: 'sqrt', value: 9, angle: 'degrees' })
          })
        );
        expect(getDisplay()).toHaveTextContent('3');
      });
    });

    it('sin: calls API with correct payload', async () => {
      mockResult(1);
      render(<ScientificCalculator />);
      fireEvent.click(screen.getByRole('button', { name: '9' }));
      fireEvent.click(screen.getByRole('button', { name: '0' }));
      fireEvent.click(screen.getByRole('button', { name: 'sin' }));
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:3000/calculate-advanced',
          expect.objectContaining({
            body: JSON.stringify({ operation: 'sin', value: 90, angle: 'degrees' })
          })
        );
        expect(getDisplay()).toHaveTextContent('1');
      });
    });

    it('cos: calls API with correct operation', async () => {
      mockResult(0);
      render(<ScientificCalculator />);
      fireEvent.click(screen.getByRole('button', { name: '9' }));
      fireEvent.click(screen.getByRole('button', { name: '0' }));
      fireEvent.click(screen.getByRole('button', { name: 'cos' }));
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:3000/calculate-advanced',
          expect.objectContaining({
            body: JSON.stringify({ operation: 'cos', value: 90, angle: 'degrees' })
          })
        );
      });
    });

    it('log: calls API with log operation', async () => {
      mockResult(2);
      render(<ScientificCalculator />);
      fireEvent.click(screen.getByRole('button', { name: '1' }));
      fireEvent.click(screen.getByRole('button', { name: '0' }));
      fireEvent.click(screen.getByRole('button', { name: '0' }));
      fireEvent.click(screen.getByRole('button', { name: 'log' }));
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:3000/calculate-advanced',
          expect.objectContaining({
            body: JSON.stringify({ operation: 'log', value: 100, angle: 'degrees' })
          })
        );
        expect(getDisplay()).toHaveTextContent('2');
      });
    });

    it('n!: calls factorial and displays result', async () => {
      mockResult(120);
      render(<ScientificCalculator />);
      fireEvent.click(screen.getByRole('button', { name: '5' }));
      fireEvent.click(screen.getByRole('button', { name: 'n!' }));
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:3000/calculate-advanced',
          expect.objectContaining({
            body: JSON.stringify({ operation: 'factorial', value: 5, angle: 'degrees' })
          })
        );
        expect(getDisplay()).toHaveTextContent('120');
      });
    });

    it('±: calls negate and displays result', async () => {
      mockResult(-5);
      render(<ScientificCalculator />);
      fireEvent.click(screen.getByRole('button', { name: '5' }));
      fireEvent.click(screen.getByRole('button', { name: '±' }));
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:3000/calculate-advanced',
          expect.objectContaining({
            body: JSON.stringify({ operation: 'negate', value: 5, angle: 'degrees' })
          })
        );
        expect(getDisplay()).toHaveTextContent('-5');
      });
    });

    it('π: calls pi and displays Math.PI', async () => {
      mockResult(Math.PI);
      render(<ScientificCalculator />);
      fireEvent.click(screen.getByRole('button', { name: 'π' }));
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:3000/calculate-advanced',
          expect.objectContaining({
            body: JSON.stringify({ operation: 'pi', value: 0, angle: 'degrees' })
          })
        );
        expect(getDisplay()).toHaveTextContent(String(Math.PI));
      });
    });

    it('1/x: calls reciprocal and displays result', async () => {
      mockResult(0.25);
      render(<ScientificCalculator />);
      fireEvent.click(screen.getByRole('button', { name: '4' }));
      fireEvent.click(screen.getByRole('button', { name: '1/x' }));
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:3000/calculate-advanced',
          expect.objectContaining({
            body: JSON.stringify({ operation: 'reciprocal', value: 4, angle: 'degrees' })
          })
        );
        expect(getDisplay()).toHaveTextContent('0.25');
      });
    });

    it('resets firstOperand and operation state after advanced function', async () => {
      mockResult(3);
      render(<ScientificCalculator />);
      fireEvent.click(screen.getByRole('button', { name: '9' }));
      fireEvent.click(screen.getByRole('button', { name: '√' }));
      await waitFor(() => expect(getDisplay()).toHaveTextContent('3'));
      // After sqrt, pressing a number should start fresh
      fireEvent.click(screen.getByRole('button', { name: '5' }));
      expect(getDisplay()).toHaveTextContent('5');
    });
  });

  describe('Power Operation (xʸ)', () => {
    it('first xʸ press stores base without calling API', () => {
      render(<ScientificCalculator />);
      fireEvent.click(screen.getByRole('button', { name: '2' }));
      fireEvent.click(screen.getByRole('button', { name: 'xʸ' }));
      expect(fetch).not.toHaveBeenCalled();
    });

    it('second xʸ press calls /power with base and exponent', async () => {
      fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ result: 8 }) });
      render(<ScientificCalculator />);
      fireEvent.click(screen.getByRole('button', { name: '2' }));
      fireEvent.click(screen.getByRole('button', { name: 'xʸ' }));
      fireEvent.click(screen.getByRole('button', { name: '3' }));
      fireEvent.click(screen.getByRole('button', { name: 'xʸ' }));
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:3000/power',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({ base: 2, exponent: 3 })
          })
        );
        expect(getDisplay()).toHaveTextContent('8');
      });
    });
  });

  describe('Basic Arithmetic Operations', () => {
    it('addition: calls /add and shows result', async () => {
      fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ result: 7 }) });
      render(<ScientificCalculator />);
      fireEvent.click(screen.getByRole('button', { name: '4' }));
      fireEvent.click(screen.getByRole('button', { name: '+' }));
      fireEvent.click(screen.getByRole('button', { name: '3' }));
      fireEvent.click(screen.getByRole('button', { name: '=' }));
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:3000/add',
          expect.objectContaining({
            body: JSON.stringify({ a: 4, b: 3 })
          })
        );
        expect(getDisplay()).toHaveTextContent('7');
      });
    });

    it('subtraction: calls /subtract and shows result', async () => {
      fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ result: 6 }) });
      render(<ScientificCalculator />);
      fireEvent.click(screen.getByRole('button', { name: '9' }));
      fireEvent.click(screen.getByRole('button', { name: '−' }));
      fireEvent.click(screen.getByRole('button', { name: '3' }));
      fireEvent.click(screen.getByRole('button', { name: '=' }));
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:3000/subtract',
          expect.objectContaining({
            body: JSON.stringify({ a: 9, b: 3 })
          })
        );
        expect(getDisplay()).toHaveTextContent('6');
      });
    });

    it('multiplication: calls /multiply and shows result', async () => {
      fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ result: 15 }) });
      render(<ScientificCalculator />);
      fireEvent.click(screen.getByRole('button', { name: '5' }));
      fireEvent.click(screen.getByRole('button', { name: '×' }));
      fireEvent.click(screen.getByRole('button', { name: '3' }));
      fireEvent.click(screen.getByRole('button', { name: '=' }));
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:3000/multiply',
          expect.objectContaining({
            body: JSON.stringify({ a: 5, b: 3 })
          })
        );
        expect(getDisplay()).toHaveTextContent('15');
      });
    });

    it('division: calls /divide and shows result', async () => {
      fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ result: 5 }) });
      render(<ScientificCalculator />);
      fireEvent.click(screen.getByRole('button', { name: '1' }));
      fireEvent.click(screen.getByRole('button', { name: '0' }));
      fireEvent.click(screen.getByRole('button', { name: '÷' }));
      fireEvent.click(screen.getByRole('button', { name: '2' }));
      fireEvent.click(screen.getByRole('button', { name: '=' }));
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:3000/divide',
          expect.objectContaining({
            body: JSON.stringify({ a: 10, b: 2 })
          })
        );
        expect(getDisplay()).toHaveTextContent('5');
      });
    });

    it('chained operations trigger intermediate calculation', async () => {
      fetch.mockResolvedValue({ ok: true, json: async () => ({ result: 10 }) });
      render(<ScientificCalculator />);
      fireEvent.click(screen.getByRole('button', { name: '5' }));
      fireEvent.click(screen.getByRole('button', { name: '+' }));
      fireEvent.click(screen.getByRole('button', { name: '5' }));
      fireEvent.click(screen.getByRole('button', { name: '+' }));
      await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    });
  });

  describe('Error Handling', () => {
    it('displays API error message', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Cannot take square root of negative number' })
      });
      render(<ScientificCalculator />);
      fireEvent.click(screen.getByRole('button', { name: '√' }));
      await waitFor(() => {
        expect(
          screen.getByText('Cannot take square root of negative number')
        ).toBeInTheDocument();
      });
    });

    it('clears error message on next number input', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Some error' })
      });
      render(<ScientificCalculator />);
      fireEvent.click(screen.getByRole('button', { name: '5' }));
      fireEvent.click(screen.getByRole('button', { name: 'sin' }));
      await waitFor(() => expect(screen.getByText('Some error')).toBeInTheDocument());
      fireEvent.click(screen.getByRole('button', { name: '1' }));
      expect(screen.queryByText('Some error')).not.toBeInTheDocument();
    });

    it('clears error and resets display after failed arithmetic', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Cannot divide by zero' })
      });
      render(<ScientificCalculator />);
      fireEvent.click(screen.getByRole('button', { name: '5' }));
      fireEvent.click(screen.getByRole('button', { name: '÷' }));
      fireEvent.click(screen.getByRole('button', { name: '0' }));
      fireEvent.click(screen.getByRole('button', { name: '=' }));
      await waitFor(() => {
        expect(screen.getByText('Cannot divide by zero')).toBeInTheDocument();
        expect(getDisplay()).toHaveTextContent('0');
      });
    });

    it('handles network failure gracefully', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));
      render(<ScientificCalculator />);
      fireEvent.click(screen.getByRole('button', { name: '5' }));
      fireEvent.click(screen.getByRole('button', { name: 'sin' }));
      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });
    });
  });
});