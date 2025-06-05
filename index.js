const express = require("express")
const app = express()
const PORT = 8080
const { dbConnection } = require("./config/config")


dbConnection()

// MIDDLEWARE
app.use(express.json())



// SERVER
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})