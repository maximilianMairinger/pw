import liveReloadServer from "./liveReloadServer"
import delay from "tiny-delay"


(async () => {
  const app = await liveReloadServer()

  app.post("/call", (req, res) => {
    console.log("call")
    delay(300).then(() => res.send("\"Hello\""))
  })
})()
