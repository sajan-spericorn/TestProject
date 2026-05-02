const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Calculator API',
    endpoints: {
      health: 'GET /health',
      calculate: 'POST /calculate - { operation, a, b }',
      add: 'POST /add - { a, b }',
      subtract: 'POST /subtract - { a, b }',
      multiply: 'POST /multiply - { a, b }',
      divide: 'POST /divide - { a, b }'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Advanced math endpoint
app.post('/calculate-advanced', (req, res) => {
  const { operation, value, angle = 'degrees' } = req.body;

  if (value === undefined || !operation) {
    return res.status(400).json({
      error: 'Missing required fields: operation, value'
    });
  }

  if (typeof value !== 'number') {
    return res.status(400).json({
      error: 'Value must be a number'
    });
  }

  let result;
  const toRadians = (deg) => (deg * Math.PI) / 180;
  const toDegrees = (rad) => (rad * 180) / Math.PI;

  try {
    switch (operation.toLowerCase()) {
      case 'sqrt':
        if (value < 0) throw new Error('Cannot take square root of negative number');
        result = Math.sqrt(value);
        break;
      case 'square':
        result = value * value;
        break;
      case 'cube':
        result = value * value * value;
        break;
      case 'sin':
        const sinInput = angle === 'degrees' ? toRadians(value) : value;
        result = Math.sin(sinInput);
        break;
      case 'cos':
        const cosInput = angle === 'degrees' ? toRadians(value) : value;
        result = Math.cos(cosInput);
        break;
      case 'tan':
        const tanInput = angle === 'degrees' ? toRadians(value) : value;
        result = Math.tan(tanInput);
        break;
      case 'asin':
        if (value < -1 || value > 1) throw new Error('asin domain: value must be between -1 and 1');
        result = Math.asin(value);
        if (angle === 'degrees') result = toDegrees(result);
        break;
      case 'acos':
        if (value < -1 || value > 1) throw new Error('acos domain: value must be between -1 and 1');
        result = Math.acos(value);
        if (angle === 'degrees') result = toDegrees(result);
        break;
      case 'atan':
        result = Math.atan(value);
        if (angle === 'degrees') result = toDegrees(result);
        break;
      case 'log':
        if (value <= 0) throw new Error('Log undefined for non-positive numbers');
        result = Math.log10(value);
        break;
      case 'ln':
        if (value <= 0) throw new Error('Ln undefined for non-positive numbers');
        result = Math.log(value);
        break;
      case 'exp':
        result = Math.exp(value);
        break;
      case 'factorial':
        if (value < 0 || !Number.isInteger(value)) throw new Error('Factorial only for non-negative integers');
        result = 1;
        for (let i = 2; i <= value; i++) result *= i;
        break;
      case 'reciprocal':
        if (value === 0) throw new Error('Cannot divide by zero');
        result = 1 / value;
        break;
      case 'percent':
        result = value / 100;
        break;
      case 'negate':
        result = -value;
        break;
      case 'abs':
        result = Math.abs(value);
        break;
      case 'pi':
        result = Math.PI;
        break;
      case 'e':
        result = Math.E;
        break;
      default:
        return res.status(400).json({
          error: `Unknown operation: ${operation}`
        });
    }

    res.json({ operation, value, result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Power endpoint (base^exponent)
app.post('/power', (req, res) => {
  const { base, exponent } = req.body;

  if (base === undefined || exponent === undefined) {
    return res.status(400).json({
      error: 'Missing required fields: base, exponent'
    });
  }

  if (typeof base !== 'number' || typeof exponent !== 'number') {
    return res.status(400).json({
      error: 'Base and exponent must be numbers'
    });
  }

  const result = Math.pow(base, exponent);
  res.json({ result, expression: `${base}^${exponent}` });
});

app.post('/calculate', (req, res) => {
  const { operation, a, b } = req.body;

  // Validate inputs
  if (a === undefined || b === undefined || !operation) {
    return res.status(400).json({
      error: 'Missing required fields: operation, a, b'
    });
  }

  if (typeof a !== 'number' || typeof b !== 'number') {
    return res.status(400).json({
      error: 'Values a and b must be numbers'
    });
  }

  let result;

  switch (operation.toLowerCase()) {
    case 'add':
      result = a + b;
      break;
    case 'subtract':
      result = a - b;
      break;
    case 'multiply':
      result = a * b;
      break;
    case 'divide':
      if (b === 0) {
        return res.status(400).json({ error: 'Cannot divide by zero' });
      }
      result = a / b;
      break;
    default:
      return res.status(400).json({
        error: `Unknown operation: ${operation}. Supported: add, subtract, multiply, divide`
      });
  }

  res.json({
    operation,
    a,
    b,
    result
  });
});

// Individual operation endpoints
app.post('/add', (req, res) => {
  const { a, b } = req.body;
  if (typeof a !== 'number' || typeof b !== 'number') {
    return res.status(400).json({ error: 'a and b must be numbers' });
  }
  res.json({ result: a + b });
});

app.post('/subtract', (req, res) => {
  const { a, b } = req.body;
  if (typeof a !== 'number' || typeof b !== 'number') {
    return res.status(400).json({ error: 'a and b must be numbers' });
  }
  res.json({ result: a - b });
});

app.post('/multiply', (req, res) => {
  const { a, b } = req.body;
  if (typeof a !== 'number' || typeof b !== 'number') {
    return res.status(400).json({ error: 'a and b must be numbers' });
  }
  res.json({ result: a * b });
});

app.post('/divide', (req, res) => {
  const { a, b } = req.body;
  if (typeof a !== 'number' || typeof b !== 'number') {
    return res.status(400).json({ error: 'a and b must be numbers' });
  }
  if (b === 0) {
    return res.status(400).json({ error: 'Cannot divide by zero' });
  }
  res.json({ result: a / b });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Calculator API listening on port ${PORT}`);
  });
}

module.exports = app;
