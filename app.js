const express = require('express')
const dotenv = require("dotenv")
const pool = require('./config')
const router = require('./Router/index')
// const movies = require('./Router/movies')
// const users = require ('./Router/user')
// const auth = require ('./Router/auth')
const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')
const morgan = require('morgan')

const app = express()
const port = 3000

dotenv.config();

app.use(morgan('tiny'));
// Menerima request body ==> JSON
app.use(express.json())
// Menerima request body ==> urlencoded
app.use(express.urlencoded({extended: true}))


pool.connect((err,res)=>{
    if (err) {
        console.log(err)
    } else{
        console.log("connected")
    }
})

app.use(router)


const options = {
    definition:{
        openapi: '3.0.0',
        info: {
            title: "Express API with swagger",
            version: '0.1.0',
            description: 
                'this is a simple CRUD API application made with Express'
        },
        servers: [
             {
                url: 'http://localhost:3000',
            },

        ],
    },
    apis: ['./Router/*.js'],
};

// const specs = swaggerJsdoc(options);
const swaggerDocument = require('./swaggerDocument.json')
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})