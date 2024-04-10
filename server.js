const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const db=require('./db');
require('dotenv').config();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

const { jwtAuthMiddleware} = require("./jwt");

const userRouter = require('./routes/userRoutes');
const candidateRouter = require('./routes/candidateRouters');

app.use('./user',userRouter);
app.use('./candidate', candidateRouter);

app.listen(PORT,()=>{
    console.log('LIstnig on PORT 30000')

})