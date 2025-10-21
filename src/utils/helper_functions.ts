import { createHash } from "crypto";

export interface StringProperties {
    value: string;
    length: number;
    is_palindrome: boolean;
    unique_characters: number;
    word_count: number;
    sha256_hash: string;
    character_frequency_map: Record<string, number>;
    created_at: string;
};

const reverseString = (str: string): string => {
    return str.split("").reverse().join("");
};

export const lengthOfString = (str: string): number => {
    return str.length;
};

export const isPalindrome = (str: string): boolean => {
    const cleaned = str.replace(/[\W_]/g, "").toLowerCase();
    return cleaned === reverseString(cleaned);
};

export const uniqueCharacters = (str: string): number => {
    const cleaned = str.replace(/[\W_]/g, "").toLowerCase();
    const uniqueChars = new Set(cleaned);
    return uniqueChars.size;
};

export const wordCount = (str: string): number => {
    const trimmed = str.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
};

export const sha256Hash = (str: string): string => {
    return createHash("sha256")
        .update(str)
        .digest("hex");
};

export const characterFrequencyMap = (str: string): Record<string, number> => {
    const frequencyMap: Record<string, number> = {};
    const cleaned = str.replace(/[\W_]/g, "").toLowerCase();

    for (const char of cleaned) {
        frequencyMap[char] = (frequencyMap[char] || 0) + 1;
    }

    return frequencyMap;
};

export function stringProperties(value: string): StringProperties {
    const now = new Date().toISOString();
    const sha256_hash = sha256Hash(value);
    const length = lengthOfString(value);
    const is_palindrome = isPalindrome(value);
    const unique_characters = uniqueCharacters(value);
    const word_count = wordCount(value);
    const character_frequency_map = characterFrequencyMap(value);

    return {
        value: value,
        length,
        is_palindrome,
        unique_characters,
        word_count,
        sha256_hash,
        character_frequency_map,
        created_at: now,
    };
};

export interface NaturalLanguageResult {
    ok: boolean;
    parsed?: Record<string, any>;
    error?: string;
};

export function parseNaturalLanguageQuery(q: string): NaturalLanguageResult {
    if (!q) return { ok: false, error: "Empty query" };
    const lower = q.toLowerCase();
    const parsed: Record<string, any> = {};

    if (/single[-\s]*word/.test(lower) || /one[-\s]*word/.test(lower))
        parsed.word_count = 1;

    if (/\bpalindrom(e|ic|romic)?\b/.test(lower))
        parsed.is_palindrome = true;

    const longerMatch = lower.match(/longer than (\d+)\s*characters?/);
    if (longerMatch)
        parsed.min_length = Number(longerMatch[1]) + 1;

    const containsLetter = lower.match(/contains?(?: the)? letter ([a-z])/);
    if (containsLetter)
        parsed.contains_character = containsLetter[1];

    if (/first vowel/.test(lower))
        parsed.contains_character = "a";

    if (Object.keys(parsed).length === 0)
        return { ok: false, error: "No recognizable filters" };

    return { ok: true, parsed };
};