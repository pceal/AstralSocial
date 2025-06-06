const express = require("express")
const { dbConnection } = require("./config/config")
const app = express()
const PORT = 8080


dbConnection()


// MIDDLEWARE
app.use(express.json())

// ENDPOINTS
app.use("/users", require("./routes/users"))
app.use("/posts", require("./routes/posts"))



// SERVER
app.listen(PORT, () => {
  console.log(`Server started on port http://localhost:${PORT}`)
})