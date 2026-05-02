const request = require('supertest');
const app = require('../index');

describe('Calculator API', () => {
  describe('GET /health', () => {
    it('should return ok status', async () => {
      const res = await request(app)
        .get('/health')
        .expect(200);

      expect(res.body).toEqual({ status: 'ok' });
    });
  });

  describe('GET /', () => {
    it('should return API info', async () => {
      const res = await request(app)
        .get('/')
        .expect(200);

      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('endpoints');
      expect(res.body.message).toBe('Calculator API');
    });
  });

  describe('POST /add', () => {
    it('should add two numbers correctly', async () => {
      const res = await request(app)
        .post('/add')
        .send({ a: 5, b: 3 })
        .expect(200);

      expect(res.body).toEqual({ result: 8 });
    });

    it('should add negative numbers', async () => {
      const res = await request(app)
        .post('/add')
        .send({ a: -5, b: 3 })
        .expect(200);

      expect(res.body).toEqual({ result: -2 });
    });

    it('should add decimals', async () => {
      const res = await request(app)
        .post('/add')
        .send({ a: 5.5, b: 2.5 })
        .expect(200);

      expect(res.body).toEqual({ result: 8 });
    });

    it('should return error for missing a', async () => {
      const res = await request(app)
        .post('/add')
        .send({ b: 5 })
        .expect(400);

      expect(res.body).toHaveProperty('error');
    });

    it('should return error for missing b', async () => {
      const res = await request(app)
        .post('/add')
        .send({ a: 5 })
        .expect(400);

      expect(res.body).toHaveProperty('error');
    });

    it('should return error if a is not a number', async () => {
      const res = await request(app)
        .post('/add')
        .send({ a: 'five', b: 3 })
        .expect(400);

      expect(res.body).toEqual({ error: 'a and b must be numbers' });
    });

    it('should return error if b is not a number', async () => {
      const res = await request(app)
        .post('/add')
        .send({ a: 5, b: 'three' })
        .expect(400);

      expect(res.body).toEqual({ error: 'a and b must be numbers' });
    });
  });

  describe('POST /subtract', () => {
    it('should subtract two numbers correctly', async () => {
      const res = await request(app)
        .post('/subtract')
        .send({ a: 10, b: 3 })
        .expect(200);

      expect(res.body).toEqual({ result: 7 });
    });

    it('should handle negative results', async () => {
      const res = await request(app)
        .post('/subtract')
        .send({ a: 3, b: 10 })
        .expect(200);

      expect(res.body).toEqual({ result: -7 });
    });

    it('should return error for non-numeric input', async () => {
      const res = await request(app)
        .post('/subtract')
        .send({ a: 'ten', b: 3 })
        .expect(400);

      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /multiply', () => {
    it('should multiply two numbers correctly', async () => {
      const res = await request(app)
        .post('/multiply')
        .send({ a: 4, b: 5 })
        .expect(200);

      expect(res.body).toEqual({ result: 20 });
    });

    it('should multiply by zero', async () => {
      const res = await request(app)
        .post('/multiply')
        .send({ a: 100, b: 0 })
        .expect(200);

      expect(res.body).toEqual({ result: 0 });
    });

    it('should handle negative multiplication', async () => {
      const res = await request(app)
        .post('/multiply')
        .send({ a: -4, b: 5 })
        .expect(200);

      expect(res.body).toEqual({ result: -20 });
    });

    it('should return error for non-numeric input', async () => {
      const res = await request(app)
        .post('/multiply')
        .send({ a: '4', b: 5 })
        .expect(400);

      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /divide', () => {
    it('should divide two numbers correctly', async () => {
      const res = await request(app)
        .post('/divide')
        .send({ a: 20, b: 4 })
        .expect(200);

      expect(res.body).toEqual({ result: 5 });
    });

    it('should handle decimal division', async () => {
      const res = await request(app)
        .post('/divide')
        .send({ a: 10, b: 4 })
        .expect(200);

      expect(res.body).toEqual({ result: 2.5 });
    });

    it('should return error for division by zero', async () => {
      const res = await request(app)
        .post('/divide')
        .send({ a: 10, b: 0 })
        .expect(400);

      expect(res.body).toEqual({ error: 'Cannot divide by zero' });
    });

    it('should return error for non-numeric input', async () => {
      const res = await request(app)
        .post('/divide')
        .send({ a: 20, b: 'four' })
        .expect(400);

      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /calculate', () => {
    it('should add using generic endpoint', async () => {
      const res = await request(app)
        .post('/calculate')
        .send({ operation: 'add', a: 5, b: 3 })
        .expect(200);

      expect(res.body).toEqual({ operation: 'add', a: 5, b: 3, result: 8 });
    });

    it('should subtract using generic endpoint', async () => {
      const res = await request(app)
        .post('/calculate')
        .send({ operation: 'subtract', a: 10, b: 3 })
        .expect(200);

      expect(res.body).toEqual({ operation: 'subtract', a: 10, b: 3, result: 7 });
    });

    it('should multiply using generic endpoint', async () => {
      const res = await request(app)
        .post('/calculate')
        .send({ operation: 'multiply', a: 4, b: 5 })
        .expect(200);

      expect(res.body).toEqual({ operation: 'multiply', a: 4, b: 5, result: 20 });
    });

    it('should divide using generic endpoint', async () => {
      const res = await request(app)
        .post('/calculate')
        .send({ operation: 'divide', a: 20, b: 4 })
        .expect(200);

      expect(res.body).toEqual({ operation: 'divide', a: 20, b: 4, result: 5 });
    });

    it('should handle case-insensitive operations', async () => {
      const res = await request(app)
        .post('/calculate')
        .send({ operation: 'ADD', a: 5, b: 3 })
        .expect(200);

      expect(res.body.result).toBe(8);
    });

    it('should return error for missing operation', async () => {
      const res = await request(app)
        .post('/calculate')
        .send({ a: 5, b: 3 })
        .expect(400);

      expect(res.body).toHaveProperty('error');
    });

    it('should return error for missing operands', async () => {
      const res = await request(app)
        .post('/calculate')
        .send({ operation: 'add' })
        .expect(400);

      expect(res.body).toHaveProperty('error');
    });

    it('should return error for unknown operation', async () => {
      const res = await request(app)
        .post('/calculate')
        .send({ operation: 'power', a: 2, b: 3 })
        .expect(400);

      expect(res.body.error).toContain('Unknown operation');
    });

    it('should return error for division by zero in generic endpoint', async () => {
      const res = await request(app)
        .post('/calculate')
        .send({ operation: 'divide', a: 10, b: 0 })
        .expect(400);

      expect(res.body).toEqual({ error: 'Cannot divide by zero' });
    });
  });

  describe('POST /calculate-advanced', () => {
    describe('Algebraic operations', () => {
      it('sqrt returns square root', async () => {
        const res = await request(app)
          .post('/calculate-advanced')
          .send({ operation: 'sqrt', value: 9 })
          .expect(200);

        expect(res.body.result).toBe(3);
      });

      it('sqrt returns error for negative input', async () => {
        const res = await request(app)
          .post('/calculate-advanced')
          .send({ operation: 'sqrt', value: -4 })
          .expect(400);

        expect(res.body.error).toMatch(/negative/i);
      });

      it('square returns value squared', async () => {
        const res = await request(app)
          .post('/calculate-advanced')
          .send({ operation: 'square', value: 7 })
          .expect(200);

        expect(res.body.result).toBe(49);
      });

      it('square handles negative input', async () => {
        const res = await request(app)
          .post('/calculate-advanced')
          .send({ operation: 'square', value: -3 })
          .expect(200);

        expect(res.body.result).toBe(9);
      });

      it('cube returns value cubed', async () => {
        const res = await request(app)
          .post('/calculate-advanced')
          .send({ operation: 'cube', value: 3 })
          .expect(200);

        expect(res.body.result).toBe(27);
      });

      it('reciprocal returns 1/x', async () => {
        const res = await request(app)
          .post('/calculate-advanced')
          .send({ operation: 'reciprocal', value: 4 })
          .expect(200);

        expect(res.body.result).toBe(0.25);
      });

      it('reciprocal returns error for zero', async () => {
        const res = await request(app)
          .post('/calculate-advanced')
          .send({ operation: 'reciprocal', value: 0 })
          .expect(400);

        expect(res.body.error).toMatch(/zero/i);
      });

      it('percent divides by 100', async () => {
        const res = await request(app)
          .post('/calculate-advanced')
          .send({ operation: 'percent', value: 50 })
          .expect(200);

        expect(res.body.result).toBe(0.5);
      });

      it('negate flips the sign', async () => {
        const res = await request(app)
          .post('/calculate-advanced')
          .send({ operation: 'negate', value: 5 })
          .expect(200);

        expect(res.body.result).toBe(-5);
      });

      it('negate of negative returns positive', async () => {
        const res = await request(app)
          .post('/calculate-advanced')
          .send({ operation: 'negate', value: -8 })
          .expect(200);

        expect(res.body.result).toBe(8);
      });

      it('abs returns absolute value of negative', async () => {
        const res = await request(app)
          .post('/calculate-advanced')
          .send({ operation: 'abs', value: -12 })
          .expect(200);

        expect(res.body.result).toBe(12);
      });

      it('abs of positive is unchanged', async () => {
        const res = await request(app)
          .post('/calculate-advanced')
          .send({ operation: 'abs', value: 7 })
          .expect(200);

        expect(res.body.result).toBe(7);
      });
    });

    describe('Trigonometric functions (degrees)', () => {
      it('sin(0) = 0', async () => {
        const res = await request(app)
          .post('/calculate-advanced')
          .send({ operation: 'sin', value: 0, angle: 'degrees' })
          .expect(200);

        expect(res.body.result).toBeCloseTo(0);
      });

      it('sin(90) = 1', async () => {
        const res = await request(app)
          .post('/calculate-advanced')
          .send({ operation: 'sin', value: 90, angle: 'degrees' })
          .expect(200);

        expect(res.body.result).toBeCloseTo(1);
      });

      it('cos(0) = 1', async () => {
        const res = await request(app)
          .post('/calculate-advanced')
          .send({ operation: 'cos', value: 0, angle: 'degrees' })
          .expect(200);

        expect(res.body.result).toBeCloseTo(1);
      });

      it('cos(90) ≈ 0', async () => {
        const res = await request(app)
          .post('/calculate-advanced')
          .send({ operation: 'cos', value: 90, angle: 'degrees' })
          .expect(200);

        expect(res.body.result).toBeCloseTo(0);
      });

      it('tan(45) = 1', async () => {
        const res = await request(app)
          .post('/calculate-advanced')
          .send({ operation: 'tan', value: 45, angle: 'degrees' })
          .expect(200);

        expect(res.body.result).toBeCloseTo(1);
      });
    });

    describe('Trigonometric functions (radians)', () => {
      it('sin(π/2) = 1 in radians mode', async () => {
        const res = await request(app)
          .post('/calculate-advanced')
          .send({ operation: 'sin', value: Math.PI / 2, angle: 'radians' })
          .expect(200);

        expect(res.body.result).toBeCloseTo(1);
      });

      it('cos(π) = -1 in radians mode', async () => {
        const res = await request(app)
          .post('/calculate-advanced')
          .send({ operation: 'cos', value: Math.PI, angle: 'radians' })
          .expect(200);

        expect(res.body.result).toBeCloseTo(-1);
      });
    });

    describe('Inverse trigonometric functions', () => {
      it('asin(1) = 90 in degrees mode', async () => {
        const res = await request(app)
          .post('/calculate-advanced')
          .send({ operation: 'asin', value: 1, angle: 'degrees' })
          .expect(200);

        expect(res.body.result).toBeCloseTo(90);
      });

      it('asin returns error for value > 1', async () => {
        const res = await request(app)
          .post('/calculate-advanced')
          .send({ operation: 'asin', value: 2, angle: 'degrees' })
          .expect(400);

        expect(res.body.error).toMatch(/domain/i);
      });

      it('acos(1) = 0 in degrees mode', async () => {
        const res = await request(app)
          .post('/calculate-advanced')
          .send({ operation: 'acos', value: 1, angle: 'degrees' })
          .expect(200);

        expect(res.body.result).toBeCloseTo(0);
      });

      it('acos returns error for value < -1', async () => {
        const res = await request(app)
          .post('/calculate-advanced')
          .send({ operation: 'acos', value: -2, angle: 'degrees' })
          .expect(400);

        expect(res.body.error).toMatch(/domain/i);
      });

      it('atan(1) = 45 in degrees mode', async () => {
        const res = await request(app)
          .post('/calculate-advanced')
          .send({ operation: 'atan', value: 1, angle: 'degrees' })
          .expect(200);

        expect(res.body.result).toBeCloseTo(45);
      });

      it('asin returns radians when angle mode is radians', async () => {
        const res = await request(app)
          .post('/calculate-advanced')
          .send({ operation: 'asin', value: 1, angle: 'radians' })
          .expect(200);

        expect(res.body.result).toBeCloseTo(Math.PI / 2);
      });
    });

    describe('Logarithms and exponents', () => {
      it('log(100) = 2', async () => {
        const res = await request(app)
          .post('/calculate-advanced')
          .send({ operation: 'log', value: 100 })
          .expect(200);

        expect(res.body.result).toBeCloseTo(2);
      });

      it('log(1) = 0', async () => {
        const res = await request(app)
          .post('/calculate-advanced')
          .send({ operation: 'log', value: 1 })
          .expect(200);

        expect(res.body.result).toBeCloseTo(0);
      });

      it('log returns error for zero', async () => {
        const res = await request(app)
          .post('/calculate-advanced')
          .send({ operation: 'log', value: 0 })
          .expect(400);

        expect(res.body.error).toMatch(/non-positive/i);
      });

      it('log returns error for negative value', async () => {
        const res = await request(app)
          .post('/calculate-advanced')
          .send({ operation: 'log', value: -1 })
          .expect(400);

        expect(res.body.error).toMatch(/non-positive/i);
      });

      it('ln(e) = 1', async () => {
        const res = await request(app)
          .post('/calculate-advanced')
          .send({ operation: 'ln', value: Math.E })
          .expect(200);

        expect(res.body.result).toBeCloseTo(1);
      });

      it('ln returns error for non-positive', async () => {
        const res = await request(app)
          .post('/calculate-advanced')
          .send({ operation: 'ln', value: 0 })
          .expect(400);

        expect(res.body.error).toMatch(/non-positive/i);
      });

      it('exp(1) = e', async () => {
        const res = await request(app)
          .post('/calculate-advanced')
          .send({ operation: 'exp', value: 1 })
          .expect(200);

        expect(res.body.result).toBeCloseTo(Math.E);
      });

      it('exp(0) = 1', async () => {
        const res = await request(app)
          .post('/calculate-advanced')
          .send({ operation: 'exp', value: 0 })
          .expect(200);

        expect(res.body.result).toBe(1);
      });
    });

    describe('Factorial', () => {
      it('0! = 1', async () => {
        const res = await request(app)
          .post('/calculate-advanced')
          .send({ operation: 'factorial', value: 0 })
          .expect(200);

        expect(res.body.result).toBe(1);
      });

      it('5! = 120', async () => {
        const res = await request(app)
          .post('/calculate-advanced')
          .send({ operation: 'factorial', value: 5 })
          .expect(200);

        expect(res.body.result).toBe(120);
      });

      it('10! = 3628800', async () => {
        const res = await request(app)
          .post('/calculate-advanced')
          .send({ operation: 'factorial', value: 10 })
          .expect(200);

        expect(res.body.result).toBe(3628800);
      });

      it('factorial returns error for negative number', async () => {
        const res = await request(app)
          .post('/calculate-advanced')
          .send({ operation: 'factorial', value: -1 })
          .expect(400);

        expect(res.body).toHaveProperty('error');
      });

      it('factorial returns error for non-integer', async () => {
        const res = await request(app)
          .post('/calculate-advanced')
          .send({ operation: 'factorial', value: 2.5 })
          .expect(400);

        expect(res.body).toHaveProperty('error');
      });
    });

    describe('Constants', () => {
      it('pi returns Math.PI', async () => {
        const res = await request(app)
          .post('/calculate-advanced')
          .send({ operation: 'pi', value: 0 })
          .expect(200);

        expect(res.body.result).toBe(Math.PI);
      });

      it('e returns Math.E', async () => {
        const res = await request(app)
          .post('/calculate-advanced')
          .send({ operation: 'e', value: 0 })
          .expect(200);

        expect(res.body.result).toBe(Math.E);
      });
    });

    describe('Validation', () => {
      it('returns error when value is missing', async () => {
        const res = await request(app)
          .post('/calculate-advanced')
          .send({ operation: 'sqrt' })
          .expect(400);

        expect(res.body.error).toMatch(/missing/i);
      });

      it('returns error when operation is missing', async () => {
        const res = await request(app)
          .post('/calculate-advanced')
          .send({ value: 9 })
          .expect(400);

        expect(res.body.error).toMatch(/missing/i);
      });

      it('returns error when value is not a number', async () => {
        const res = await request(app)
          .post('/calculate-advanced')
          .send({ operation: 'sqrt', value: 'nine' })
          .expect(400);

        expect(res.body.error).toMatch(/number/i);
      });

      it('returns error for unknown operation', async () => {
        const res = await request(app)
          .post('/calculate-advanced')
          .send({ operation: 'hyperbolicsin', value: 1 })
          .expect(400);

        expect(res.body.error).toMatch(/unknown/i);
      });

      it('is case-insensitive for operation names', async () => {
        const res = await request(app)
          .post('/calculate-advanced')
          .send({ operation: 'SQRT', value: 16 })
          .expect(200);

        expect(res.body.result).toBe(4);
      });

      it('defaults angle to degrees when not provided', async () => {
        const res = await request(app)
          .post('/calculate-advanced')
          .send({ operation: 'sin', value: 90 })
          .expect(200);

        expect(res.body.result).toBeCloseTo(1);
      });
    });
  });

  describe('POST /power', () => {
    it('calculates 2^3 = 8', async () => {
      const res = await request(app)
        .post('/power')
        .send({ base: 2, exponent: 3 })
        .expect(200);

      expect(res.body.result).toBe(8);
    });

    it('any number to the power of 0 is 1', async () => {
      const res = await request(app)
        .post('/power')
        .send({ base: 99, exponent: 0 })
        .expect(200);

      expect(res.body.result).toBe(1);
    });

    it('handles negative base with odd exponent', async () => {
      const res = await request(app)
        .post('/power')
        .send({ base: -2, exponent: 3 })
        .expect(200);

      expect(res.body.result).toBe(-8);
    });

    it('handles fractional exponent (square root equivalent)', async () => {
      const res = await request(app)
        .post('/power')
        .send({ base: 9, exponent: 0.5 })
        .expect(200);

      expect(res.body.result).toBeCloseTo(3);
    });

    it('includes expression in response', async () => {
      const res = await request(app)
        .post('/power')
        .send({ base: 2, exponent: 10 })
        .expect(200);

      expect(res.body.result).toBe(1024);
      expect(res.body.expression).toBe('2^10');
    });

    it('returns error when base is missing', async () => {
      const res = await request(app)
        .post('/power')
        .send({ exponent: 3 })
        .expect(400);

      expect(res.body.error).toMatch(/missing/i);
    });

    it('returns error when exponent is missing', async () => {
      const res = await request(app)
        .post('/power')
        .send({ base: 2 })
        .expect(400);

      expect(res.body.error).toMatch(/missing/i);
    });

    it('returns error when base is not a number', async () => {
      const res = await request(app)
        .post('/power')
        .send({ base: 'two', exponent: 3 })
        .expect(400);

      expect(res.body.error).toMatch(/number/i);
    });

    it('returns error when exponent is not a number', async () => {
      const res = await request(app)
        .post('/power')
        .send({ base: 2, exponent: 'three' })
        .expect(400);

      expect(res.body.error).toMatch(/number/i);
    });
  });
});