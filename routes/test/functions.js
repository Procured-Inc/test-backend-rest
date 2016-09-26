//return an array of objects according to key, value, or key and value matching

var express = require('express');
var request = require('sync-request');
var router = express.Router();
var http = require('http');
var connection = require('../../connection/mysql');

app = express();


module.exports = {
    getObjects: function(obj, key, val) {
            var objects = [];
            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                if (typeof obj[i] == 'object') {
                    objects = objects.concat(getObjects(obj[i], key, val));
                } else
                //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
                if (i == key && obj[i] == val || i == key && val == '') { //
                    objects.push(obj);
                } else if (obj[i] == val && key == ''){
                    //only add if the object is not already in the array
                    if (objects.lastIndexOf(obj) == -1){
                        objects.push(obj);
                    }
                }
            }
            return objects;
        },

    getValues: function(obj, key) {
                var objects = [];
                for (var i in obj) {
                    if (!obj.hasOwnProperty(i)) continue;
                    if (typeof obj[i] == 'object') {
                        objects = objects.concat(getValues(obj[i], key));
                    } else if (i == key) {
                        objects.push(obj[i]);
                    }
                }
                return objects;
        },

    getKeys: function(obj, val) {
        // whatever
        var objects = [];
        for (var i in obj) {
            if (!obj.hasOwnProperty(i)) continue;
            if (typeof obj[i] == 'object') {
                objects = objects.concat(getKeys(obj[i], val));
            } else if (obj[i] == val) {
                objects.push(i);
            }
        }
        return objects;
        },


    sort_by : function(field, reverse, primer){

        var key = primer ?
            function(x) {return primer(x[field])} :
            function(x) {return x[field]};

        reverse = !reverse ? 1 : -1;

        return function (a, b) {
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
            }
        }
    };


