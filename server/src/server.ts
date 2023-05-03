import setup from "./setup"



setup("pw").then(async ({app, db}) => {

  
  app.post("/echo", (req, res) => {
    res.send(req.body)
  })
})
