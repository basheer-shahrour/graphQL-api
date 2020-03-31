const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const webpush = require("web-push");
const fs = require("fs");

const graphQLSchema = require("./api/schema/index");
const graphQLResolvers = require("./api/resolvers/index");
require("dotenv").config();

const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use('/graphql', graphqlHttp({
    schema: graphQLSchema,
    rootValue: graphQLResolvers,
    graphiql: true
}));

// Write init clients file
// if(!fs.existsSync("./clients.json")) {
//     fs.writeFileSync("./clients.json", JSON.stringify([]), 'utf-8');
// }

// Setup web-push
const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVAT_VAPID_KEY;
webpush.setVapidDetails("mailto:test@test.com", publicVapidKey, privateVapidKey);

app.post('/subscribe', (req, res) => {
    const subscription = req.body;
    res.status(201).json({});
    let clients = [];
    try {
        clients = require("./clients.json");
        clients.push(subscription);
        fs.writeFileSync("./clients.json", JSON.stringify(clients, null, 2), 'utf-8');
    } catch (exp) {
        console.log(exp);
    }
});

app.post('/push', (req, res) => {
    let clients = [];
    clients = require("./clients.json");
    res.status(201).json({});
    clients.map((subscription, index) => {
        console.log("sending push to client " + index);
        try {
            const payload = JSON.stringify({
                title: 'Computer Engineering Site',
                body: `There is new content, ${req.body.data}, check it out!`
            });
            webpush.sendNotification(subscription, payload).catch((error) => {
                console.error(error);
            });
        } catch (exp) {
            console.log(exp);
        }
    });
});

app.post('/resetClientsFile', (req, res) => {
    res.status(201).json({});
    fs.writeFileSync("./clients.json", JSON.stringify([]), 'utf-8');
});

// Setup mongoose
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB is ready ...");
}).catch((error) => {
    console.log(error);
});
//const connection = mongoose.connection;

app.listen(port, () => {
    console.log("Server is running on port: " + port);
});
