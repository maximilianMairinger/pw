import setup from "./setup"
import sani from "sanitize-against"
import argon2 from "argon2"
import { decode, encode } from "circ-msgpack"
import crypto from "crypto"
import ms from "ms"
import "tiny-msgpack/lib/index"

function makeSessionToken() {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(48, (err, buffer) => {
      if (err) reject(err)
      else resolve(buffer.toString('hex'));
    });
  });
}




setup("pw").then(async ({app, db}) => {

  // await Promise.all([
  //   db.createCollection("users"),
  //   db.createCollection("sessions"),
  //   db.createCollection("documents")
  // ])
  
  
  const maxDurForSession = ms("30min")
  async function checkAuth(sessionToken: string): Promise<User> {
    const sessionDoc = await db.collection("sessions").findOne({ sessionToken })
    if (sessionDoc === null) throw new Error()
    if (Date.now() - +sessionDoc.lastUsed > maxDurForSession) {
      await db.collection("sessions").deleteOne({ _id: sessionDoc._id })
      throw new Error()
    }
    const user = await db.collection("users").findOne({ _id: sessionDoc.userId })
    return user
  }


  type UID = any

  type Session = {
    _id: UID,
    userId: UID,
    lastUsed: Date,
    sessionToken: string
  }

  async function makeSession(userId: UID) {
    const sessionToken = await makeSessionToken()
    await db.collection("sessions").insertOne({ userId, lastUsed: new Date(), sessionToken })
    return sessionToken
  }

  const saniAddUser = sani({
    username: String,
    password: String
  })
  
  type User = {
    _id: UID,
    username: string,
    hashedPassword: string
  }


  app.post("/addUser", async (req, res) => {
    try {
      const body = saniAddUser(req.body)
      console.log("addUser", body)
      const found = await db.collection("users").findOne({ username: body.username })
      if (found !== null) throw new Error()
      const hashedPassword = await argon2.hash(body.password);
      const { insertedId: userId } = await db.collection("users").insertOne({ username: body.username, hashedPassword })
      const sessionToken = await makeSession(userId)
      
      res.send(encode({
        ok: true,
        sessionToken
      }))
    }
    catch(e) {
      console.error("addUser", e)
      res.send(encode({
        ok: false
      }))
    }
  })

  const saniSave = sani({
    sessionToken: String,
    documentName: "default",
    content: String
  })
  

  app.post("/save", async (req, res) => {
    try {
      const body = saniSave(req.body)
      console.log("save", body)
      const user = await checkAuth(body.sessionToken)

      await db.collection("documents").updateOne({ userId: user._id, documentName: body.documentName }, { $set: { userId: user._id, documentName: body.documentName, lastChanged: new Date(), content: body.content } }, { upsert: true })

      res.send(encode({
        ok: true
      }))
    }
    catch(e) {
      console.error("save", e)
      res.send(encode({
        ok: false
      }))
    }
    
  })

  
  const saniCheckAuth = sani({
    sessionToken: String
  })

  

  app.post("/checkAuth", async (req, res) => {
    try {
      const body = saniCheckAuth(req.body)
      console.log("checkAuth", body)

      const user = await checkAuth(body.sessionToken)

      res.send(encode({
        ok: true,
        username: user.username
      }))
    }
    catch(e) {
      res.send(encode({
        ok: false
      }))
    }
    


  })

  const saniQuery = sani({
    sessionToken: String,
    documentName: "default"
  })

  app.post("/query", async (req, res) => {
    try {
      const body = saniQuery(req.body)
      console.log("query", body)

      const user = await checkAuth(body.sessionToken)
      
      const doc = await db.collection("documents").findOne({ userId: user._id, documentName: body.documentName })
      if (doc === null) throw new Error()

      res.send(encode({
        ok: true,
        content: doc.content
      }))
    }
    catch(e) {
      console.error("query", e)
      res.send(encode({
        ok: false
      }))
    }

  })
})
