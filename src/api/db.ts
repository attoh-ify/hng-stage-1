import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { StringProperties } from "../utils/helper_functions";

const DB_FILE = path.join(process.cwd(), "data.db");
let db: Database.Database;

export function initDb(): void {
  const exists = fs.existsSync(DB_FILE);
  db = new Database(DB_FILE);
  if (!exists) {
    db.exec(`
      CREATE TABLE strings (
        id TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        length INTEGER NOT NULL,
        is_palindrome INTEGER NOT NULL,
        unique_characters INTEGER NOT NULL,
        word_count INTEGER NOT NULL,
        sha256_hash TEXT NOT NULL,
        character_frequency_map TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
    `);
  }
}

export function insertString(properties: StringProperties): void {
  const stmt = db.prepare(`
    INSERT INTO strings 
    (id, value, length, is_palindrome, unique_characters, word_count, sha256_hash, character_frequency_map, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    properties.sha256_hash,
    properties.value,
    properties.length,
    properties.is_palindrome ? 1 : 0,
    properties.unique_characters,
    properties.word_count,
    properties.sha256_hash,
    JSON.stringify(properties.character_frequency_map),
    properties.created_at
  );
}

export function getByHash(hash: string) {
  const row = db.prepare("SELECT * FROM strings WHERE sha256_hash = ?").get(hash) as DBRow | undefined;
  if (!row) return null;
  return formatRow(row);
}

export function deleteByHash(hash: string): void {
  db.prepare("DELETE FROM strings WHERE sha256_hash = ?").run(hash);
  return;
}

interface DBRow {
  id: string;
  value: string;
  length: number;
  is_palindrome: number;
  unique_characters: number;
  word_count: number;
  sha256_hash: string;
  character_frequency_map: string; // stored as JSON
  created_at: string;
}

export function getAllWithFilters(filters: Record<string, any>) {
  const clauses: string[] = [];
  const params: (string | number | boolean | null)[] = [];

  if (filters.is_palindrome !== undefined) {
    clauses.push("is_palindrome = ?");
    params.push(filters.is_palindrome ? 1 : 0);
  }
  if (filters.min_length !== undefined) {
    clauses.push("length >= ?");
    params.push(filters.min_length);
  }
  if (filters.max_length !== undefined) {
    clauses.push("length <= ?");
    params.push(filters.max_length);
  }
  if (filters.word_count !== undefined) {
    clauses.push("word_count = ?");
    params.push(filters.word_count);
  }

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const stmt = db.prepare(`SELECT * FROM strings ${where}`) as any;

  const rows = stmt.all(params) as DBRow[];

  if (filters.contains_character) {
    const ch = filters.contains_character;
    return rows
      .filter((r: DBRow) => {
        const freq = JSON.parse(r.character_frequency_map) as Record<string, number>;
        return freq[ch] !== undefined;
      })
      .map(formatRow);
  }

  return rows.map(formatRow);
}

function formatRow(row: DBRow) {
  return {
    id: row.id,
    value: row.value,
    properties: {
      length: row.length,
      is_palindrome: !!row.is_palindrome,
      unique_characters: row.unique_characters,
      word_count: row.word_count,
      sha256_hash: row.sha256_hash,
      character_frequency_map: JSON.parse(row.character_frequency_map)
    },
    created_at: row.created_at
  };
}
