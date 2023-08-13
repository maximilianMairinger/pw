import express from "express"
import detectPort from "detect-port"

const app = express()



app.use(express.static("public"))

detectPort(3000).then(port => {
  app.listen(port, () => {
    console.log(`Server is running http://127.0.0.1:${port}`)
  })
})
