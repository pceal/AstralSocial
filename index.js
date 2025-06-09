const express = require("express")
const { dbConnection } = require("./config/config")
const app = express()
const PORT = 8080

dbConnection()
// MIDDLEWARE
app.use(express.json())

//RUTAS



app.use("/comments", require("./routes/comments"))

// SERVER
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})