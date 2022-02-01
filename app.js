const express = require('express');
const app = express();
const mongoose = require('mongoose');
// use for autocreate API documentation
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

require('dotenv/config'); //permits access to .env/

const bodyParser = require('body-parser');
const cors = require('cors')

//middelwares -> is it execute each time a route is called
//app.use(auth);
app.use(cors()); //this permits cross domain request 
app.use(bodyParser.json());

//import routes
const postsRoute = require('./routes/posts')
const stationsRoute = require('./routes/stations')

//ROUTES
app.get('/', (req, res)=> {
    res.send("we are on home");
});

app.use('/posts', postsRoute); 
app.use('/stations', stationsRoute);

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

//connect to db

mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    })
    .catch(err => { //if there are any errors...
        console.error('DB Connection error:', err.stack)
        throw err
    })
    .then(() => {
        console.log("Connection to MongoDB successfully!")
    });

//how to we start listening to the server
app.listen(process.env.PORT);