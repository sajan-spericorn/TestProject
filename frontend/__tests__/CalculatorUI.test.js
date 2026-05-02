import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CalculatorUI from '@/components/CalculatorUI';

// Mock fetch globally
global.fetch = jest.fn();

describe('CalculatorUI Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  const getDisplay = () => screen.getByTestId('display');

  describe('Rendering', () => {
    it('should render calculator with initial display of 0', () => {
      render(<CalculatorUI />);
      const display = getDisplay();
      expect(display).toHaveTextContent('0');
    });

    it('should render all number buttons', () => {
      render(<CalculatorUI />);
      for (let i = 0; i <= 9; i++) {
        expect(screen.getByRole('button', { name: i.toString() })).toBeInTheDocument();
      }
    });

    it('should render operation buttons', () => {
      render(<CalculatorUI />);
      expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '−' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '×' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '÷' })).toBeInTheDocument();
    });

    it('should render equals button', () => {
      render(<CalculatorUI />);
      expect(screen.getByRole('button', { name: '=' })).toBeInTheDocument();
    });

    it('should render clear and backspace buttons', () => {
      render(<CalculatorUI />);
      expect(screen.getByRole('button', { name: 'AC' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '←' })).toBeInTheDocument();
    });
  });

  describe('Number Input', () => {
    it('should display clicked numbers', () => {
      render(<CalculatorUI />);
      fireEvent.click(screen.getByRole('button', { name: '5' }));
      const display = getDisplay();
      expect(display).toHaveTextContent('5');
    });

    it('should append numbers to display', () => {
      render(<CalculatorUI />);
      fireEvent.click(screen.getByRole('button', { name: '1' }));
      fireEvent.click(screen.getByRole('button', { name: '2' }));
      fireEvent.click(screen.getByRole('button', { name: '3' }));
      const display = getDisplay();
      expect(display).toHaveTextContent('123');
    });

    it('should support decimal input', () => {
      render(<CalculatorUI />);
      fireEvent.click(screen.getByRole('button', { name: '5' }));
      fireEvent.click(screen.getByRole('button', { name: '.' }));
      fireEvent.click(screen.getByRole('button', { name: '5' }));
      const display = getDisplay();
      expect(display).toHaveTextContent('5.5');
    });

    it('should not allow multiple decimals', () => {
      render(<CalculatorUI />);
      fireEvent.click(screen.getByRole('button', { name: '5' }));
      fireEvent.click(screen.getByRole('button', { name: '.' }));
      fireEvent.click(screen.getByRole('button', { name: '.' }));
      const display = getDisplay();
      expect(display).toHaveTextContent('5.');
    });

    it('should keep first number visible after operator', () => {
      render(<CalculatorUI />);
      fireEvent.click(screen.getByRole('button', { name: '5' }));
      fireEvent.click(screen.getByRole('button', { name: '+' }));
      const display = getDisplay();
      expect(display).toHaveTextContent('5');
    });

    it('should reset display when typing after operator', () => {
      render(<CalculatorUI />);
      fireEvent.click(screen.getByRole('button', { name: '5' }));
      fireEvent.click(screen.getByRole('button', { name: '+' }));
      fireEvent.click(screen.getByRole('button', { name: '3' }));
      const display = getDisplay();
      expect(display).toHaveTextContent('3');
    });
  });

  describe('Clear and Backspace', () => {
    it('should reset display to 0 on AC click', () => {
      render(<CalculatorUI />);
      fireEvent.click(screen.getByRole('button', { name: '5' }));
      fireEvent.click(screen.getByRole('button', { name: '3' }));
      fireEvent.click(screen.getByRole('button', { name: 'AC' }));
      const display = getDisplay();
      expect(display).toHaveTextContent('0');
    });

    it('should remove last digit on backspace', () => {
      render(<CalculatorUI />);
      fireEvent.click(screen.getByRole('button', { name: '1' }));
      fireEvent.click(screen.getByRole('button', { name: '2' }));
      fireEvent.click(screen.getByRole('button', { name: '3' }));
      fireEvent.click(screen.getByRole('button', { name: '←' }));
      const display = getDisplay();
      expect(display).toHaveTextContent('12');
    });

    it('should reset to 0 when backspacing single digit', () => {
      render(<CalculatorUI />);
      fireEvent.click(screen.getByRole('button', { name: '5' }));
      fireEvent.click(screen.getByRole('button', { name: '←' }));
      const display = getDisplay();
      expect(display).toHaveTextContent('0');
    });
  });

  describe('API Integration', () => {
    it('should call API on equals for addition', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ result: 8 })
      });

      render(<CalculatorUI />);
      fireEvent.click(screen.getByRole('button', { name: '5' }));
      fireEvent.click(screen.getByRole('button', { name: '+' }));
      fireEvent.click(screen.getByRole('button', { name: '3' }));
      fireEvent.click(screen.getByRole('button', { name: '=' }));

      await waitFor(() => {
        expect(fetch).toHaveBeenCalled();
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:3000/add',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({ a: 5, b: 3 })
          })
        );
      });
    });

    it('should display result after API call', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ result: 10 })
      });

      render(<CalculatorUI />);
      fireEvent.click(screen.getByRole('button', { name: '6' }));
      fireEvent.click(screen.getByRole('button', { name: '+' }));
      fireEvent.click(screen.getByRole('button', { name: '4' }));
      fireEvent.click(screen.getByRole('button', { name: '=' }));

      await waitFor(() => {
        const display = getDisplay();
        expect(display).toHaveTextContent('10');
      });
    });

    it('should handle API errors', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Cannot divide by zero' })
      });

      render(<CalculatorUI />);
      fireEvent.click(screen.getByRole('button', { name: '5' }));
      fireEvent.click(screen.getByRole('button', { name: '÷' }));
      fireEvent.click(screen.getByRole('button', { name: '0' }));
      fireEvent.click(screen.getByRole('button', { name: '=' }));

      await waitFor(() => {
        expect(screen.getByText('Cannot divide by zero')).toBeInTheDocument();
      });
    });

    it('should handle fetch errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      render(<CalculatorUI />);
      fireEvent.click(screen.getByRole('button', { name: '5' }));
      fireEvent.click(screen.getByRole('button', { name: '+' }));
      fireEvent.click(screen.getByRole('button', { name: '3' }));
      fireEvent.click(screen.getByRole('button', { name: '=' }));

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });
    });

    it('should support all operations', async () => {
      const operations = [
        { button: '+', endpoint: 'add', a: 5, b: 3 },
        { button: '−', endpoint: 'subtract', a: 5, b: 3 },
        { button: '×', endpoint: 'multiply', a: 5, b: 3 },
        { button: '÷', endpoint: 'divide', a: 6, b: 3 }
      ];

      for (const { button, endpoint, a, b } of operations) {
        fetch.mockClear();
        fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ result: 1 })
        });

        const { unmount } = render(<CalculatorUI />);

        // Input first number
        for (let i = 0; i < a; i++) {
          fireEvent.click(screen.getByRole('button', { name: '1' }));
        }

        fireEvent.click(screen.getByRole('button', { name: button }));

        // Input second number
        for (let i = 0; i < b; i++) {
          fireEvent.click(screen.getByRole('button', { name: '1' }));
        }

        fireEvent.click(screen.getByRole('button', { name: '=' }));

        await waitFor(() => {
          expect(fetch).toHaveBeenCalledWith(
            `http://localhost:3000/${endpoint}`,
            expect.any(Object)
          );
        });

        unmount();
      }
    });
  });

  describe('Chained Operations', () => {
    it('should support operation chaining', async () => {
      fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ result: 10 })
      });

      render(<CalculatorUI />);
      fireEvent.click(screen.getByRole('button', { name: '5' }));
      fireEvent.click(screen.getByRole('button', { name: '+' }));
      fireEvent.click(screen.getByRole('button', { name: '5' }));
      fireEvent.click(screen.getByRole('button', { name: '+' })); // Should calculate 5 + 5 first

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Decimal edge cases', () => {
    it('should reset to 0. when pressing decimal after operator', () => {
      render(<CalculatorUI />);
      fireEvent.click(screen.getByRole('button', { name: '5' }));
      fireEvent.click(screen.getByRole('button', { name: '+' }));
      fireEvent.click(screen.getByRole('button', { name: '.' }));
      const display = getDisplay();
      expect(display).toHaveTextContent('0.');
    });

    it('should allow decimal after operator then digit', () => {
      render(<CalculatorUI />);
      fireEvent.click(screen.getByRole('button', { name: '5' }));
      fireEvent.click(screen.getByRole('button', { name: '+' }));
      fireEvent.click(screen.getByRole('button', { name: '.' }));
      fireEvent.click(screen.getByRole('button', { name: '5' }));
      const display = getDisplay();
      expect(display).toHaveTextContent('0.5');
    });
  });

  describe('Error state', () => {
    it('should clear error on AC press', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Cannot divide by zero' })
      });

      render(<CalculatorUI />);
      fireEvent.click(screen.getByRole('button', { name: '5' }));
      fireEvent.click(screen.getByRole('button', { name: '÷' }));
      fireEvent.click(screen.getByRole('button', { name: '0' }));
      fireEvent.click(screen.getByRole('button', { name: '=' }));

      await waitFor(() => {
        expect(screen.getByText('Cannot divide by zero')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: 'AC' }));
      expect(screen.queryByText('Cannot divide by zero')).not.toBeInTheDocument();
    });

    it('should reset display to 0 after a failed operation', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Cannot divide by zero' })
      });

      render(<CalculatorUI />);
      fireEvent.click(screen.getByRole('button', { name: '9' }));
      fireEvent.click(screen.getByRole('button', { name: '÷' }));
      fireEvent.click(screen.getByRole('button', { name: '0' }));
      fireEvent.click(screen.getByRole('button', { name: '=' }));

      await waitFor(() => {
        const display = getDisplay();
        expect(display).toHaveTextContent('0');
      });
    });

    it('should clear error when typing a new number', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Some error' })
      });

      render(<CalculatorUI />);
      fireEvent.click(screen.getByRole('button', { name: '5' }));
      fireEvent.click(screen.getByRole('button', { name: '+' }));
      fireEvent.click(screen.getByRole('button', { name: '3' }));
      fireEvent.click(screen.getByRole('button', { name: '=' }));

      await waitFor(() => expect(screen.getByText('Some error')).toBeInTheDocument());

      fireEvent.click(screen.getByRole('button', { name: '1' }));
      expect(screen.queryByText('Some error')).not.toBeInTheDocument();
    });
  });

  describe('Does not call API prematurely', () => {
    it('should not call API when pressing equals with no operation set', async () => {
      render(<CalculatorUI />);
      fireEvent.click(screen.getByRole('button', { name: '5' }));
      fireEvent.click(screen.getByRole('button', { name: '=' }));
      expect(fetch).not.toHaveBeenCalled();
    });

    it('should reuse display value as second operand when = pressed without entering one', async () => {
      fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ result: 10 }) });
      render(<CalculatorUI />);
      fireEvent.click(screen.getByRole('button', { name: '5' }));
      fireEvent.click(screen.getByRole('button', { name: '+' }));
      fireEvent.click(screen.getByRole('button', { name: '=' }));
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:3000/add',
          expect.objectContaining({
            body: JSON.stringify({ a: 5, b: 5 })
          })
        );
      });
    });
  });
});
