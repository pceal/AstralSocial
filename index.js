require('dotenv').config();
const express = require('express');
const { dbConnection } = require('./config/config');
const { handleTypeError } = require('./middlewares/errors');
const app = express();
const PORT = process.env.PORT;
const swaggerUI = require('swagger-ui-express');
const docs = require('./docs/index');
const cors = require('cors');
dbConnection();

// MIDDLEWARE
app.use(express.json());
app.use(cors());

// ENDPOINTS
app.use('/users', require('./routes/users'));
app.use('/posts', require('./routes/posts'));
app.use('/comments', require('./routes/comments'));
app.use('/uploads', express.static('uploads'));

app.use(handleTypeError);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(docs));

// SERVER
app.listen(PORT, () => {
  console.log(`Server started on port http://localhost:${PORT}`);
});
