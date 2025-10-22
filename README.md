# 🧩 String Analyzer Service  
*Stage 1 Backend Wizards Challenge — 2025 Cohort*

---

## 📖 Overview

The **String Analyzer Service** is a RESTful API that analyzes text strings, computes detailed properties, and stores the results in a local SQLite database.

It provides endpoints for:
- Analyzing and storing new strings  
- Retrieving stored strings (individually or with filters)  
- Querying via natural language  
- Deleting strings from the system  

This project is implemented in **TypeScript** using **Express.js**, **better-sqlite3**, and **Winston** for logging.

---

## 🚀 Features

For each analyzed string, the service computes and stores:

| Property                  | Description |
|---------------------------|--------------|
| `length`                  | Number of characters in the string |
| `is_palindrome`           | Boolean indicating if the string reads the same forwards and backwards |
| `unique_characters`       | Number of distinct characters |
| `word_count`              | Number of words separated by whitespace |
| `sha256_hash`             | SHA-256 hash of the string (acts as a unique ID) |
| `character_frequency_map` | Object showing how often each character appears |

---

## 🛠️ Tech Stack

- **Language:** TypeScript  
- **Runtime:** Node.js (v18+)  
- **Framework:** Express.js  
- **Database:** SQLite (via `better-sqlite3`)  
- **Logging:** Winston  
- **Rate Limiting:** express-rate-limit  
- **CORS Enabled:** Yes  

---

## 📁 Project Structure

├── api/
│ ├── controller.ts # Main logic for each endpoint
│ ├── db.ts # Database initialization and queries
│ └── route.ts # API route definitions
│
├── middleware/
│ ├── logger.ts # Winston-based logging setup
│ └── rate-limiter.ts # Request rate limiting
│
├── utils/
│ └── helper_functions.ts # Utility functions for string analysis
│
└── index.ts # Server entry point
.env # Environment variables



---

## ⚙️ Setup & Installation

### 1️⃣ Clone the repository
```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>
```

### 2️⃣ Install dependencies
```bash
npm install
```

###3️⃣ Configure environment variables

Create a .env file in the root directory (already included in this project):

```bash
PORT=5000
```

You can modify the port number as needed.

###4️⃣ Run the project
Development
```bash
npm run dev
```

Production
```bash
npm run build
npm start
```

## 🧠 API Endpoints
### 1. Analyze & Store a String

POST /strings

Request Body:
```json
{
  "value": "string to analyze"
}
```

Response (201 Created):
```json
{
  "id": "sha256_hash_value",
  "value": "string to analyze",
  "properties": {
    "length": 16,
    "is_palindrome": false,
    "unique_characters": 12,
    "word_count": 3,
    "sha256_hash": "abc123...",
    "character_frequency_map": {
      "s": 2,
      "t": 3
    }
  },
  "created_at": "2025-08-27T10:00:00Z"
}
```

Errors:

400 Bad Request: Missing or invalid "value" field

409 Conflict: String already exists

422 Unprocessable Entity: Value is not a string

### 2. Get a Specific String

GET /strings/{string_value}

Response (200 OK):
```json
{
  "id": "sha256_hash_value",
  "value": "requested string",
  "properties": { /* computed properties */ },
  "created_at": "2025-08-27T10:00:00Z"
}
```

Error:

404 Not Found: String not found

### 3. Get All Strings (With Filtering)

```bash
GET /strings?is_palindrome=true&min_length=5&max_length=20&word_count=2&contains_character=a
```

Response (200 OK):
```json
{
  "data": [ /* array of string objects */ ],
  "count": 15,
  "filters_applied": {
    "is_palindrome": true,
    "min_length": 5,
    "max_length": 20,
    "word_count": 2,
    "contains_character": "a"
  }
}
```

Error:

400 Bad Request: Invalid filter types or values

### 4. Natural Language Filtering

```bash
GET /strings/filter-by-natural-language?query=all%20single%20word%20palindromic%20strings
```

Example Queries Supported:

- all single word palindromic strings

- strings longer than 10 characters

- palindromic strings that contain the first vowel

- strings containing the letter z

Response (200 OK):
```json
{
  "data": [ /* matching strings */ ],
  "count": 3,
  "interpreted_query": {
    "original": "all single word palindromic strings",
    "parsed_filters": {
      "word_count": 1,
      "is_palindrome": true
    }
  }
}
```

Errors:

400 Bad Request: Unable to parse query

422 Unprocessable Entity: Conflicting or invalid filters

### 5. Delete a String

```bash
DELETE /strings/{string_value}
```

Response (204 No Content):

```bash
(no content)
```

Error:

404 Not Found: String does not exist

### 6. Health Check

```bash
GET /health
```

Response:

```json
{
  "status": "ok",
  "timestamp": "2025-10-22T16:00:00.000Z"
}
```

---
🗄️ Database

SQLite is used for local persistent storage.

The database file (data.db) is automatically created in the project root when the server starts for the first time.

Each string record is uniquely identified by its SHA-256 hash.

---
🌐 Deployment Notes

This service can be hosted on:

Railway

Heroku

AWS EC2

Pxxl App

Render (❌ Forbidden for this cohort)

Ensure your deployment exposes the correct base URL and environment variables (PORT).

---

👤 Author

- Full Name: ATTOH ALEXANDER IFEANYICHUKWU
- Email: alexander.attoh22@gmail.com
- Stack: Node.js / TypeScript / Express.js
