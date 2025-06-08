
'use strict';
/**
 * @fileOverview Cloud Function to ingest historical sensor data from ESP32 devices.
 *
 * This function provides an HTTPS endpoint that ESP32 devices can call to POST
 * their sensor readings. The readings are then stored as new documents in the
 * 'historicalMetrics' Firestore collection.
 *
 * HTTP Method: POST
 * Expected JSON Payload:
 * {
 *   "deviceId": "ESP32-Unit1", // Optional: Unique identifier for the ESP32 device
 *   "voltage": 230.5,
 *   "current": 4.75,
 *   "power": 1094.875,
 *   "irradiance": 850.0,
 *   "temperature": 25.5
 * }
 *
 * Successful Response:
 * Status: 201 Created
 * Body: { "status": "success", "message": "Data saved successfully", "docId": "firestore_document_id" }
 *
 * Error Responses:
 * Status: 400 Bad Request (e.g., missing required fields, invalid data types)
 * Status: 405 Method Not Allowed (if not a POST request)
 * Status: 500 Internal Server Error
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK if not already initialized.
// This is typically done once at the top level of your functions/index.ts or similar.
if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

export const ingestHistoricalData = functions.https.onRequest(async (req, res) => {
  // Allow CORS for development/testing if needed, configure more strictly for production
  res.set('Access-Control-Allow-Origin', '*'); // Adjust for production
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    // Pre-flight request. Reply successfully:
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ status: 'error', message: 'Method Not Allowed. Please use POST.' });
    return;
  }

  if (req.headers['content-type'] !== 'application/json') {
    res.status(400).json({ status: 'error', message: 'Invalid Content-Type. Please send application/json.' });
    return;
  }

  try {
    const data = req.body;

    // Basic validation for required fields
    const requiredFields = ['voltage', 'current', 'power', 'irradiance', 'temperature'];
    for (const field of requiredFields) {
      if (data[field] === undefined || typeof data[field] !== 'number') {
        res.status(400).json({
          status: 'error',
          message: `Missing or invalid field: '${field}'. It must be a number.`,
        });
        return;
      }
    }

    const metricRecord: any = {
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      voltage: data.voltage,
      current: data.current,
      power: data.power,
      irradiance: data.irradiance,
      temperature: data.temperature,
    };

    if (data.deviceId && typeof data.deviceId === 'string') {
      metricRecord.deviceId = data.deviceId;
    }

    const docRef = await db.collection('historicalMetrics').add(metricRecord);
    functions.logger.info(`Historical data saved for device: ${data.deviceId || 'N/A'}, docId: ${docRef.id}`, {structuredData: true});
    res.status(201).json({ status: 'success', message: 'Data saved successfully', docId: docRef.id });

  } catch (error) {
    functions.logger.error('Error ingesting historical data:', error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error. Could not save data.' });
  }
});

