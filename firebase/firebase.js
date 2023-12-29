const { initializeApp, cert, getApps } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore') 

if (!getApps()?.length) {
  initializeApp({
    credential: cert(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    ) 
  })
}

const db = getFirestore()
module.exports = { db };