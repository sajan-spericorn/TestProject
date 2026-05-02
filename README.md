# Calculator Backend

A Node.js API with both basic arithmetic and scientific math operations.

## Setup

```bash
npm install
npm start
```

The server runs on port 3000 (or set `PORT` environment variable).

## API Endpoints

### Health Check
```bash
GET /health
```

### Generic Calculate
```bash
POST /calculate
Content-Type: application/json

{
  "operation": "add",
  "a": 10,
  "b": 5
}
```

Supported operations: `add`, `subtract`, `multiply`, `divide`

### Individual Endpoints

#### Add
```bash
POST /add
{
  "a": 10,
  "b": 5
}
```

#### Subtract
```bash
POST /subtract
{
  "a": 10,
  "b": 3
}
```

#### Multiply
```bash
POST /multiply
{
  "a": 4,
  "b": 7
}
```

#### Divide
```bash
POST /divide
{
  "a": 20,
  "b": 4
}
```

## Scientific Functions

### Advanced Math
```bash
POST /calculate-advanced
{
  "operation": "sqrt|square|cube|sin|cos|tan|asin|acos|atan|log|ln|exp|factorial|reciprocal|percent|negate|abs|pi|e",
  "value": 5,
  "angle": "degrees"  // optional, for trig functions: "degrees" or "radians"
}
```

Supported operations:
- **sqrt** - Square root
- **square** - Square (x²)
- **cube** - Cube (x³)
- **sin, cos, tan** - Trigonometric functions (angle mode: degrees/radians)
- **asin, acos, atan** - Inverse trigonometric functions
- **log** - Base 10 logarithm
- **ln** - Natural logarithm
- **exp** - e^x
- **factorial** - n! (only integers)
- **reciprocal** - 1/x
- **percent** - x%
- **negate** - -x (±)
- **abs** - Absolute value |x|
- **pi** - π (3.14159...)
- **e** - Euler's number (2.71828...)

### Power
```bash
POST /power
{
  "base": 2,
  "exponent": 3
}
```
Result: 8 (2^3)

```bash
curl -X POST http://localhost:3000/add \
  -H "Content-Type: application/json" \
  -d '{"a": 15, "b": 8}'

# Response:
# {"result": 23}
```

## Development

Run with auto-reload on file changes:
```bash
npm run dev
```
