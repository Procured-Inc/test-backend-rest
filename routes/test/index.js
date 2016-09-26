var express = require('express');
var request = require('sync-request');
var router = express.Router();
var http = require('http');
var connection = require('../../connection/mysql');
var bodyParser = require('body-parser');


app = express();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })



var functions = require('./functions');



router.route('/starttest/:testid')
    .get(function(req, res) {

        var testid = req.params.testid;
        console.log(testid);
        var urlapti = 'http://178.33.132.20:30000/questions/apti/starttest/' + testid;
        var urltech = 'http://178.33.132.20:30000/questions/tech/starttest/' + testid;
        var urlpsycho = 'http://178.33.132.20:30000/questions/psycho/starttest/' + testid;

        var jsonapti = "";
        var jsontech = "";
        var jsonpsycho = "";

        var resapti = request('GET', urlapti);
        jsonapti = JSON.parse(resapti.getBody(('utf8')));
        var restech = request('GET', urltech);
        jsontech = JSON.parse(restech.getBody(('utf8')));
        var restpsycho = request('GET', urlpsycho);
        jsonpsycho = JSON.parse(restpsycho.getBody(('utf8')));


        var questionset = {
            testID: testid,
            apti: jsonapti,
            tech: jsontech,
            psycho: jsonpsycho
        };
        res.json(questionset);
        console.log(questionset);



    });


router.route('/start/:testid')
    .post(function (req, res) {
        var testid = req.params.testid;
        console.log(testid);
        var studentid = req.body.student_id;
        var starttime = new Date(req.body.starttime);
        var starttime1 = starttime.toISOString().slice(0, 19).replace('T', ' ');
        var minute = 10;
        var endtime;
        console.log(starttime);
        var get1 = connection.query("select test_dur, test_date, test_done, test_det from test_details where test_id = ?", testid, function (err, rows) {
            console.log(err, rows);
            if (!err && rows[0]!=null) {
                console.log(rows);
                var hours = rows[0].test_dur;
                endtime = new Date(starttime.setHours(starttime.getHours()+ hours));
                endtime = new Date(endtime.setMinutes(endtime.getMinutes()+ minute));
                // console.log(endtime);
                endtime = endtime.toISOString().slice(0, 19).replace('T', ' ');
                console.log(testid, studentid, starttime1, endtime);
                var urlapti = 'http://178.33.132.20:30000/questions/apti/starttest/' + testid;
                var urltech = 'http://178.33.132.20:30000/questions/tech/starttest/' + testid;
                var urlpsycho = 'http://178.33.132.20:30000/questions/psycho/starttest/' + testid;

                var jsonapti = "";
                var jsontech = "";
                var jsonpsycho = "";

                var resapti = request('GET', urlapti);
                jsonapti = JSON.parse(resapti.getBody(('utf8')));
                var restech = request('GET', urltech);
                jsontech = JSON.parse(restech.getBody(('utf8')));
                var restpsycho = request('GET', urlpsycho);
                jsonpsycho = JSON.parse(restpsycho.getBody(('utf8')));

                var post = {
                    test_id: testid,
                    student_id: studentid,
                    start_time: starttime1,
                    end_time: endtime

                };

                console.log(post);


                connection.query('select * from student_info where student_id=?', studentid, function (err, rows
                ) {
                    if(!rows) {
                        console.log("USER registration not present");
                        //res.send.JSON({message: "user not registered to give test"});
                    }

                });
                // console.log(post);
                //connection.query('select ')
                // connection.query('select * from result_info where student_id =? and test_id=?', studentid, testid, function(err, rows) {
                //
                // });
                var query2 = connection.query('INSERT into result_info SET ?', post, function(rows, err) {
                    if(err) {
                        console.log(err);
                    }
                    else {



                    }

                });
                var questionset = {
                    testID: testid,
                    apti: jsonapti,
                    tech: jsontech,
                    psycho: jsonpsycho
                };
                res.json(questionset);


            }
            // res.send(post1);

        });



    });










router.route('/stop/:testid')
    .post(jsonParser, function (req, res) {
        console.log(1);
        try {
            console.log(req.body)
            var keys = [];
            for(var k in req.body) keys.push(k);
            console.log(keys);
            var bb = JSON.parse(keys[0]);
            console.log(bb);
        }
        catch (ex) {
            console.log(ex);
        }
        // console.log(JSON.parse(req.body));
        var testid = req.params.testid;
        console.log(2);
        var studentid = bb.student_id;
        console.log(3);
        console.log(typeof(bb.endtime));
        var endtime = new Date(Date.parse(bb.endtime));
        console.log(4);
        var answers = bb.answers;
        console.log(answers);
        console.log(5);
        console.log(testid, studentid, endtime, answers);
        var endtime1 = endtime.toISOString().slice(0, 19).replace('T', ' ');
        var urlapti = 'http://178.33.132.20:30000/questions/apti/stoptest/' + testid;
        var urltech = 'http://178.33.132.20:30000/questions/tech/stoptest/' + testid;
        var urlpsycho = 'http://178.33.132.20:30000/questions/psycho/stoptest/' + testid;

        var jsonapti = "";
        var jsontech = "";
        var jsonpsycho = "";

        var resapti = request('GET', urlapti);
        jsonapti = JSON.parse(resapti.getBody(('utf8')));
        var restech = request('GET', urltech);
        jsontech = JSON.parse(restech.getBody(('utf8')));
        var restpsycho = request('GET', urlpsycho);
        jsonpsycho = JSON.parse(restpsycho.getBody(('utf8')));



        var correctset = {
            apti: jsonapti,
            tech: jsontech,
            psycho: jsonpsycho

        };



        var apti_marks = 0;
        var tech_marks = 0;
        var psycho_marks = 0;
        var code_marks = 0;
        var total_marks = 0;



        console.log(correctset);


        console.log(answers);
        for(var i in answers.apti) {
            var e = correctset.apti[i].qid;
            var f = correctset.apti[i].correct;
            var d = answers.apti[i].qid;
            var g = answers.apti[i].answer;
            console.log(f, g);
            if(f==g) {
                { console.log("true");
                apti_marks++;
                }
                console.log(apti_marks);
            }
        }

        res.json({message: "done"});
        // var studentid = req.body.student_id;
        // var starttime = new Date(req.body.starttime);
        // var starttime1 = starttime.toISOString().slice(0, 19).replace('T', ' ');
        // var minute = 10;
        // var endtime;
        // console.log(starttime);
        // var get1 = connection.query("select test_dur, test_date, test_done, test_det from test_details where test_id = ?", testid, function (err, rows) {
        //     console.log(err);
        //     if (!err) {
        //         console.log(rows);
        //         var hours = rows[0].test_dur;
        //         endtime = new Date(starttime.setHours(starttime.getHours()+ hours));
        //         endtime = new Date(endtime.setMinutes(endtime.getMinutes()+ minute));
        //         // console.log(endtime);p
        //         endtime = endtime.toISOString().slice(0, 19).replace('T', ' ');
        //         // console.log(starttime1, endtime);
        //         // console.log(data);
        //         console.log(testid, studentid, starttime1, endtime);
        //         // var urlapti = 'http://178.33.132.20:30000/questions/apti/starttest' + testid;
        //         // var urltech = 'http://l78.33.132.20:30000/questions/tech/starttest' + testid;
        //         // var jsonapti;
        //         // var jsontech;
        //         // console.log(url);
        //         // request({url: urlapti}, function (err, response, body) {
        //         //     jsonapti =  body;
        //         //     console.log(jsonapti);
        //         //     console.log(typeof(jsonapti));
        //         // });
        //         // console.log(jsonapti);
        //         //
        //         // request({url: urltech}, function (err, response, body) {
        //         //     var jsontech =  body;
        //         //     console.log(jsontech);
        //         //     console.log(typeof(jsontech));
        //         // });
        //         //
        //         // console.log(typeof(jsonapti+jsontech));
        //         var query1 = connection.query('select * from student_info where student_id=?', studentid, function (rows, err) {
        //                 console.log("bc", rows, err);
        //                 console.log("not present");
        //
        //         });
        //         console.log(query1.sql);
        //         var post = {
        //             test_id: testid,
        //             student_id: studentid,
        //             start_time: starttime1,
        //             end_time: endtime
        //
        //         };
        //         // console.log(post);
        //         var query2 = connection.query('INSERT into result_info SET ?', post, function(rows, err) {
        //             if(err) {
        //                 console.log(err);
        //             }
        //             else {
        //                 console.log("blob" + query2.sql);
        //
        //
        //             }
        //
        //         });
        //
        //
        //     }
        //
        //     else {
        //
        //     }
        //
        // });



    });


module.exports = router;




