import setup from "./setup"
import sani from "sanitize-against"
import argon2 from "argon2"





setup("pw").then(async ({app, db}) => {
  async function authOk(username: string, authToken: string): Promise<boolean> {
    try {
      const userDoc = await db.collection("users").findOne({ username })
      if (userDoc === null) throw new Error()
      const valid = await argon2.verify(userDoc.hashedAuthToken, authToken)
      if (!valid) throw new Error()
      return true
    }
    catch(e) {
      return false
    }
  }

  const saniAddUser = sani({
    username: String,
    authToken: String
  })
  
  app.post("/addUser", async (req, res) => {
    try {
      const body = saniAddUser(req.body)
      const found = await db.collection("users").findOne({ username: body.username })
      if (found !== null) throw new Error()
      const hash = await argon2.hash(body.authToken);
      await db.collection("users").insertOne({ username: body.username, hashedAuthToken: hash })
      await db.createCollection(body.username)
      res.json({
        ok: true
      })
    }
    catch(e) {
      res.json({
        ok: false
      })
    }
  })

  const saniSave = sani({
    username: String,
    authToken: String,
    data: {
      documentName: "default",
      content: String
    }
  })
  

  app.post("/save", async (req, res) => {
    try {
      const body = saniSave(req.body)

      if (!await authOk(body.username, body.authToken)) throw new Error()

    
      await db.collection(body.username).updateOne({ documentName: body.data.documentName }, { $set: body.data }, { upsert: true })
      res.json({
        ok: true
      })
    }
    catch(e) {
      res.json({
        ok: false
      })
    }
    
  })

  const saniQuery = sani({
    username: String,
    authToken: String,
    documentName: "default"
  })

  app.post("/query", async (req, res) => {
    try {
      const body = saniQuery(req.body)

      if (!await authOk(body.username, body.authToken)) throw new Error()
      
      const doc = await db.collection(body.username).findOne({ documentName: body.documentName })
      if (doc === null) throw new Error()
      res.json({
        ok: true,
        content: doc.content
      })
    }
    catch(e) {
      res.json({
        ok: false
      })
    }

  })
})
