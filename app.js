const express = require('express');
const app = express();

const bodyParser = require('body-parser');

const index = require('./routes/index.route');
const api = require('./routes/api.route');

const CorrectingService = require("./services/correcting.service");

app.use(express.static('public'));
app.use('/scripts/angular', express.static('node_modules/angular/'));
app.use('/styles/bulma', express.static('node_modules/bulma/css/'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended': true}));

app.use('/', index);
app.use('/api', api);

const port = 3000 | process.argv[2];
app.listen(port);