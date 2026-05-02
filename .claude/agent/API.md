# API Reference

Base URL: `http://localhost:3000`

All `POST` endpoints require `Content-Type: application/json`. All responses are `application/json`.

---

## Health & Info

### `GET /`

Returns API metadata and available endpoint descriptions.

**Response `200`:**
```json
{
  "message": "Calculator API",
  "endpoints": {
    "health": "GET /health",
    "calculate": "POST /calculate - { operation, a, b }",
    "add": "POST /add - { a, b }",
    "subtract": "POST /subtract - { a, b }",
    "multiply": "POST /multiply - { a, b }",
    "divide": "POST /divide - { a, b }"
  }
}
```

---

### `GET /health`

**Response `200`:**
```json
{ "status": "ok" }
```

---

## Basic Arithmetic

### `POST /add`

| Field | Type | Required |
|---|---|---|
| `a` | `number` | yes |
| `b` | `number` | yes |

**Request:**
```json
{ "a": 10, "b": 5 }
```

**Response `200`:**
```json
{ "result": 15 }
```

**Error `400`** (non-numeric input):
```json
{ "error": "a and b must be numbers" }
```

---

### `POST /subtract`

| Field | Type | Required |
|---|---|---|
| `a` | `number` | yes |
| `b` | `number` | yes |

**Response `200`:**
```json
{ "result": 7 }
```

---

### `POST /multiply`

| Field | Type | Required |
|---|---|---|
| `a` | `number` | yes |
| `b` | `number` | yes |

**Response `200`:**
```json
{ "result": 28 }
```

---

### `POST /divide`

| Field | Type | Required |
|---|---|---|
| `a` | `number` | yes |
| `b` | `number` | yes, must be non-zero |

**Response `200`:**
```json
{ "result": 5 }
```

**Error `400`:**
```json
{ "error": "Cannot divide by zero" }
```

---

### `POST /calculate`

Generic arithmetic endpoint. Operation name is **case-insensitive**.

| Field | Type | Required | Values |
|---|---|---|---|
| `operation` | `string` | yes | `add`, `subtract`, `multiply`, `divide` |
| `a` | `number` | yes | any |
| `b` | `number` | yes | any (non-zero for divide) |

**Request:**
```json
{ "operation": "add", "a": 10, "b": 5 }
```

**Response `200`:**
```json
{ "operation": "add", "a": 10, "b": 5, "result": 15 }
```

**Errors `400`:**
```json
{ "error": "Missing required fields: operation, a, b" }
{ "error": "Values a and b must be numbers" }
{ "error": "Unknown operation: foo. Supported: add, subtract, multiply, divide" }
{ "error": "Cannot divide by zero" }
```

---

## Scientific Functions

### `POST /calculate-advanced`

Performs unary scientific operations. The `angle` field is optional (defaults to `"degrees"`) and only affects trigonometric functions.

| Field | Type | Required | Default |
|---|---|---|---|
| `operation` | `string` | yes | — |
| `value` | `number` | yes | — |
| `angle` | `string` | no | `"degrees"` |

**Request:**
```json
{ "operation": "sin", "value": 90, "angle": "degrees" }
```

**Response `200`:**
```json
{ "operation": "sin", "value": 90, "result": 1 }
```

#### Supported operations

| Operation | Description | Input constraint | Output |
|---|---|---|---|
| `sqrt` | √x | x ≥ 0 | number |
| `square` | x² | — | number |
| `cube` | x³ | — | number |
| `sin` | Sine | — | number (respects `angle` mode) |
| `cos` | Cosine | — | number (respects `angle` mode) |
| `tan` | Tangent | — | number (respects `angle` mode) |
| `asin` | Inverse sine | −1 ≤ x ≤ 1 | degrees or radians (respects `angle`) |
| `acos` | Inverse cosine | −1 ≤ x ≤ 1 | degrees or radians (respects `angle`) |
| `atan` | Inverse tangent | — | degrees or radians (respects `angle`) |
| `log` | log₁₀(x) | x > 0 | number |
| `ln` | ln(x) | x > 0 | number |
| `exp` | eˣ | — | number |
| `factorial` | n! | n ≥ 0, integer | number |
| `reciprocal` | 1/x | x ≠ 0 | number |
| `percent` | x ÷ 100 | — | number |
| `negate` | −x | — | number |
| `abs` | \|x\| | — | number |
| `pi` | π (ignores `value`) | — | 3.141592653589793 |
| `e` | Euler's e (ignores `value`) | — | 2.718281828459045 |

Operation names are **case-insensitive**.

**Errors `400`:**
```json
{ "error": "Missing required fields: operation, value" }
{ "error": "Value must be a number" }
{ "error": "Cannot take square root of negative number" }
{ "error": "asin domain: value must be between -1 and 1" }
{ "error": "acos domain: value must be between -1 and 1" }
{ "error": "Log undefined for non-positive numbers" }
{ "error": "Ln undefined for non-positive numbers" }
{ "error": "Factorial only for non-negative integers" }
{ "error": "Cannot divide by zero" }
{ "error": "Unknown operation: <name>" }
```

---

### `POST /power`

Computes `base ^ exponent` using `Math.pow`.

| Field | Type | Required |
|---|---|---|
| `base` | `number` | yes |
| `exponent` | `number` | yes |

**Request:**
```json
{ "base": 2, "exponent": 10 }
```

**Response `200`:**
```json
{ "result": 1024, "expression": "2^10" }
```

**Errors `400`:**
```json
{ "error": "Missing required fields: base, exponent" }
{ "error": "Base and exponent must be numbers" }
```

---

## Error Format

All error responses follow a consistent shape:

```json
{ "error": "<human-readable message>" }
```

HTTP status codes used:
- `200` — success
- `400` — validation error, domain violation, or unknown operation
