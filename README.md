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

