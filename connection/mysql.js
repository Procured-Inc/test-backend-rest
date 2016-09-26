/**
 * Created by Shubhampatidar on 9/19/2016.
 */
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: '178.33.132.20',
    port: '3306',
    user: 'root',
    password: 'Incture_09132016',
    database: 'procured'
});
connection.connect();
module.exports=connection;

