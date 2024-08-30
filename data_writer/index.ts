import { Pool } from 'pg';
import { SNSHandler } from 'aws-lambda';
import * as functions from '@google-cloud/functions-framework';
import { HttpRequest } from '@azure/functions';
// import * as dotenv from 'dotenv';

// Load environment variables
// dotenv.config();

// Database connection pool
const pool = new Pool({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: parseInt(process.env.DB_PORT || '5432', 10),
});

// Function to insert data into the database
async function insertCurrencyPrice(data: any): Promise<void> {
    const client = await pool.connect();
    try {
        const query = `
            INSERT INTO currency_price (currency_id, price_usdc, checked_timestamp, pricing_source_id)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (currency_id, checked_timestamp, pricing_source_id) DO NOTHING
        `;
        await client.query(query, [
            data.currency_id,
            data.price_usdc,
            data.checked_timestamp,
            data.pricing_source_id
        ]);
    } finally {
        client.release();
    }
}

// AWS Lambda Function
export const processWriteAWS: SNSHandler = async (event) => {
    for (const record of event.Records) {
        const data = JSON.parse(record.Sns.Message);
        await insertCurrencyPrice(data);
    }
};

// Google Cloud Function
functions.cloudEvent('processWriteGCP', async (event: any) => {
    const pubsubMessage = event.data;
    const data = JSON.parse(Buffer.from(pubsubMessage.message.data, 'base64').toString());
    await insertCurrencyPrice(data);
});

// Azure Function
export async function processWriteAzure(context: any, req: HttpRequest): Promise<void> {
    const data = req.body;
    await insertCurrencyPrice(data);
}
