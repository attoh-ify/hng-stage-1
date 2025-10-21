import { Request, Response, NextFunction } from "express";
import { logger } from "../middleware/logger";
import dotenv from "dotenv";
import { parseNaturalLanguageQuery, stringProperties } from "../utils/helper_functions";
import { deleteByHash, getAllWithFilters, getByHash, insertString } from "./db";
dotenv.config();


export const analyzeString = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { value } = req.body;

        if (!value) {
            return res.status(400).json({ message: 'Invalid request body or missing "value" field' });
        }

        if (typeof value !== "string") {
            return res.status(422).json({ message: 'Invalid data type for "value" (must be string)' });
        }

        const properties = stringProperties(value);
        const exists = getByHash(properties.sha256_hash);

        if (exists) {
            return res.status(409).json({ error: "String already exists in the system" });
        };

        insertString(properties);

        return res.status(201).json(
            {
                id: properties.sha256_hash,
                value,
                properties: {
                    length: properties.length,
                    is_palindrome: properties.is_palindrome,
                    unique_characters: properties.unique_characters,
                    word_count: properties.word_count,
                    sha256_hash: properties.sha256_hash,
                    character_frequency_map: properties.character_frequency_map,
                },
                created_at: properties.created_at,
            }
        );
    } catch (error) {
        logger.error(`Internal Server Error: ${(error as Error).message}`);
        res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    };
};


export const specificString = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const value = decodeURIComponent(req.params.string_value);
        const properties = stringProperties(value);
        const exists = getByHash(properties.sha256_hash);

        if (!exists) {
            return res.status(404).json({ error: "String does not exist in the system" });
        };

        return res.status(200).json(
            {
                ...exists
            }
        )
    } catch (error) {
        logger.error(`Internal Server Error: ${(error as Error).message}`);
        res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    };
};


export const getAllStringsWithFiltering = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const filters: Record<string, any> = {};
        const { is_palindrome, min_length, max_length, word_count, contains_character } = req.query;

        if (
            is_palindrome !== undefined &&
            is_palindrome !== "true" &&
            is_palindrome !== "false"
        ) {
            return res.status(400).json({ error: "Invalid query parameter values or types" });
        }

        if (min_length !== undefined && isNaN(Number(min_length))) {
            return res.status(400).json({ error: "Invalid query parameter values or types" });
        }

        if (max_length !== undefined && isNaN(Number(max_length))) {
            return res.status(400).json({ error: "Invalid query parameter values or types" });
        }

        if (word_count !== undefined && isNaN(Number(word_count))) {
            return res.status(400).json({ error: "Invalid query parameter values or types" });
        }

        if (contains_character !== undefined && typeof contains_character !== "string") {
            return res.status(400).json({ error: "Invalid query parameter values or types" });
        }

        if (is_palindrome !== undefined)
            filters.is_palindrome = is_palindrome === "true";
        if (min_length !== undefined)
            filters.min_length = parseInt(min_length as string, 10);
        if (max_length !== undefined)
            filters.max_length = parseInt(max_length as string, 10);
        if (word_count !== undefined)
            filters.word_count = parseInt(word_count as string, 10);
        if (contains_character !== undefined)
            filters.contains_character = (contains_character as string)[0];

        const data = getAllWithFilters(filters);

        return res.status(200).json(
            {
                data,
                count: data.length,
                filters_applied: filters
            }
        );
    } catch (error) {
        logger.error(`Internal Server Error: ${(error as Error).message}`);
        res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    };
};


export const naturalLanguageFiltering = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const q = req.query.query as string;
        if (!q) return res.status(400).json({ error: "Missing query parameter" });

        const parsed = parseNaturalLanguageQuery(q);
        if (!parsed.ok)
            return res.status(400).json({ error: "Unable to parse query", detail: parsed.error });

        const filters = parsed.parsed!;
        const data = getAllWithFilters(filters);

        res.status(200).json({
            data,
            count: data.length,
            interpreted_query: {
                original: q,
                parsed_filters: filters
            }
        });
    } catch (error) {
        logger.error(`Internal Server Error: ${(error as Error).message}`);
        res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    };
};


export const deleteString = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const value = decodeURIComponent(req.params.string_value);
        const properties = stringProperties(value);
        const found = getByHash(properties.sha256_hash);

        if (!found) {
            return res.status(404).json({ error: "String does not exist in the system" });
        };

        deleteByHash(properties.sha256_hash);

        return res.status(204).json({
            message: "String deleted successfully"
        });
    } catch (error) {
        logger.error(`Internal Server Error: ${(error as Error).message}`);
        res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    };
};