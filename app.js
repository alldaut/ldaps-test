require('dotenv').config();
const express = require('express');
const ldap = require('./src/ldap-client')
const app = express();

let client = ldap.getClient();
ldap.bindAd(client)
    .then(() => console.log('user successfully binded in AD'))
    .catch((e) => console.log('error during binding user in AD :'+e))
    .finally(() => client.destroy())

app.listen(process.env.PORT || 3000, function () {
    console.log('Starting the server at port ' + process.env.PORT || 3000);
});