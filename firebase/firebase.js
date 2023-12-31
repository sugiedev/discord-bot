const { initializeApp, cert, getApps } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore') 

if (!getApps()?.length) {
  initializeApp({
    credential: cert(require("./config.json")) 
  })
}

const db = getFirestore()
module.exports = { db };