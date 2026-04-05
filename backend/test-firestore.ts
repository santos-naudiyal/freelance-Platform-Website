import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

const serviceAccountPath = path.resolve(__dirname, 'serviceAccountKey.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function checkProjects() {
  const snapshot = await db.collection('Projects').orderBy('createdAt', 'desc').limit(10).get();
  
  if (snapshot.empty) {
    console.log('No matching project documents.');
    return;
  }
  
  snapshot.forEach(doc => {
    const d = doc.data();
    console.log(`ID: ${doc.id} | Status: ${d.status} | Budget: ${JSON.stringify(d.budget)} | Pricing.Total: ${d.pricing?.total}`);
  });
}

checkProjects()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
