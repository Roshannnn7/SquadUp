import admin from 'firebase-admin';

/**
 * Initialize Firebase Admin SDK
 * Used for verifying Firebase Authentication tokens
 */
const initializeFirebase = () => {
    try {
        // Parse service account key from environment variable
        const serviceAccount = JSON.parse(
            process.env.FIREBASE_SERVICE_ACCOUNT_KEY
        );

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });

        console.log('✅ Firebase Admin SDK initialized');
    } catch (error) {
        console.error('❌ Firebase initialization error:', error.message);
        console.error('Make sure FIREBASE_SERVICE_ACCOUNT_KEY is set in .env');
    }
};

/**
 * Verify Firebase ID token
 * @param {string} idToken - Firebase ID token from client
 * @returns {Promise<Object>} Decoded token with user info
 */
export const verifyFirebaseToken = async (idToken) => {
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        return decodedToken;
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

export { initializeFirebase };
export default admin;
