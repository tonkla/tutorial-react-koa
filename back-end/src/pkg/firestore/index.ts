import admin from 'firebase-admin'

admin.initializeApp({
  credential: admin.credential.cert('./src/configs/key.json'),
})

export default admin
