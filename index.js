//Instructions
// I am assuming that Year and Month will Not Be Provided To Me..So when we will call api for scroll left to right ,data
// will change according to past date...irrespective of month year

// I have assumed that event can be maked weekly yearly and monthly basis, Monthly event will show event on same date of every month.
//weekly event will be shown every week
//Constant - hoursAtATime  =12    assuming that screen will show 12 hours at same time


// i have assumed that event time from and to will be saved in diffreent columns in 24 hr format like event time is 10:30 am to 5:25 pm
//save this in column as 10 in event_start_hour columns and 5 in event_end_hour column



//There are 3 types of API

//1. You can call this api at page loading .first Time
//path- http://localhost:4100/getEventsList/starting/Weekly
//Required variable parameter - Weekly or Monthly
//Weekly or Monthly will decide what number of days will be fetched to show on screen


// O/p of Every API is Same- each Response is provided with folowing variables

// result - it will have Events details. this is a object which have date as a key.each key has a array of object having key Hr for Hour name in 24 hr format
// and  key events which is array of events

//pathToTopToBottomApi - to check api easily i have provided a link to open new API which will fetch data for the same dates but diffreent hours.
// it will work when you will scroll to bottom


//pathToLeftToRightApi -  to check api easily i have provided a link to open new API which will fetch data for the next dates (depending On Weekly or Monthly)  and starting Hours.
// it will work when you will scroll to right


//lastToDate,lastFromDate and lastToHour will be required for calling next api ..it is for pagination..their details is in deatils of next API
//{ "result": '', "pathToTopToBottomApi": '', "pathToLeftToRightApi":  : '' , "query": '', "message": "data found",lastFromDate:'', "lastToDate": toDateStr, "lastToHour": toHour });



//2. You can call this api when scrolling Top To Bottom . 
//path- http://localhost:4100/getEventsList/topToBottom/Weekly/2021-01-22/2
//Required variable parameter - Weekly or Monthly  and lastFromDate   and lastToHour
//lastFromDate and lastToHour will be provided as a output of each response
// this api will use lastToHour as  and plus hoursAtATime constant to fromHour to make toHour and will fetch data for lastFromDate to (lastFromDate+(no. of days according to Week or Month parameter))

//3. You can call this api when scrolling Top To Bottom . 
//path- http://localhost:4100/getEventsList/leftToRight/Weekly/2021-01-28
//Required variable parameter - Weekly or Monthly  and lastFromDate  
//lastToDate  will be provided as a output of each response

//Note if a event Object having key putEventnameInThisBlock=true that means this is the first date of event 



const express = require('express');
var cors = require('cors');

var mysql = require('mysql')
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'events',
    timezone: "+00:00"
})

connection.connect()



Date.prototype.withoutTime = function () {
    var d = new Date(this);
    d.setHours(0, 0, 0, 0);
    return d;
}

var bodyParser = require('body-parser');
const { json } = require('body-parser');


var app = express();

app.use(cors());



const hoursAtATime = 12;

app.get('/', function (req, res) {

    res.send("Hello Tester...You have successfully get api access !");



});
app.get('/getEventsList/starting/:dayBreak', function (req, res) {
    var dayBreak = req.params.dayBreak;
    if (dayBreak == "Weekly") {
        var daysAtATime = 7;
    } else if (dayBreak == "Monthly") {
        var daysAtATime = 31;
    } else {
        var daysAtATime = 7;
    }

    var fromDate = new Date();
    var toDate = addDays(fromDate, daysAtATime - 1);
    var fromHour = 0;
    var toHour = fromHour + hoursAtATime;

    functiontoQuery(fromDate, toDate, fromHour, toHour, res);
});
app.get('/getEventsList/topToBottom/:dayBreak/:lastFromDate/:lastToHour', function (req, res) {
    var dayBreak = req.params.dayBreak;
    if (dayBreak == "Weekly") {
        var daysAtATime = 7;
    } else if (dayBreak == "Monthly") {
        var daysAtATime = 31;
    } else {
        var daysAtATime = 7;
    }



    var lastToHour = req.params.lastToHour;
    var fromDate = new Date(req.params.lastFromDate);

    var toDate = addDays(fromDate, daysAtATime - 1);

    //time
    var fromHour = lastToHour;
    var toHour = parseInt(fromHour) + hoursAtATime;

    if (toHour > 24) {

        var fromHour = lastToHour - hoursAtATime + 1;
        var toHour = lastToHour;
    }
    //time end


    functiontoQuery(fromDate, toDate, fromHour, toHour, res);






});

app.get('/getEventsList/leftToRight/:dayBreak/:lastToDate', function (req, res) {
    var dayBreak = req.params.dayBreak;
    if (dayBreak == "Weekly") {
        var daysAtATime = 7;
    } else if (dayBreak == "Monthly") {
        var daysAtATime = 31;
    } else {
        var daysAtATime = 7;
    }



    var lastToDate = new Date(req.params.lastToDate);

    var fromDate = addDays(lastToDate, 1);
    var toDate = addDays(fromDate, daysAtATime - 1);

    //time
    var fromHour = 0;
    var toHour = fromHour + hoursAtATime;
    //time end



    functiontoQuery(fromDate, toDate, fromHour, toHour, res);





});

function functiontoQuery(fromDate, toDate, fromHour, toHour, res) {


    var fromDateStr = dateString(fromDate);
    var toDateStr = dateString(toDate);

    let query = `select * from eventslist where   ( ( event_start_date>='${fromDateStr}' and event_start_date<='${toDateStr}') or ( event_end_date>='${fromDateStr}' and event_end_date<='${toDateStr}'))  and ( ( event_start_hour>='${fromHour}' and event_start_hour<='${toHour}') or ( event_end_hour>='${fromHour}' and event_end_hour<='${toHour}'))`;

    connection.query(query, function (err, rows, fields) {
        if (err) throw err

        var includedRows = [];
        var finalArr = {};
        var dates = splitdateArr(fromDate, toDate);

        for (perDate of dates) {

            let timeArr = [];
            var j = fromHour;
            while (j != toHour + 1) {
                timeArr[j] = { Hr: parseInt(j), "events": [] };

                j++;
            }

            finalArr[dateString(perDate)] = timeArr;

        }

        for (perDate of dates) {
            for (perTableRow of rows) {
                if (perTableRow['event_end_hour'] == 0) {
                    perTableRow['event_end_hour'] = 24;
                }
                if (perTableRow['event_start_date'].withoutTime() <= perDate.withoutTime() && perTableRow['event_end_date'].withoutTime() >= perDate.withoutTime()) {
                    if (perTableRow['event_type'] == 'Daily') {
                        finalArr = assignEventToTimeOfThisDate(finalArr, perDate, perTableRow['event_start_hour'], perTableRow['event_end_hour'], perTableRow, fromHour, toHour)


                    } else {
                        let diffTime = Math.abs(perDate - perTableRow['event_start_date']);
                        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                        if (perTableRow['event_type'] == 'Weekly') {

                            if (diffDays % 6 == 0) {
                                finalArr = assignEventToTimeOfThisDate(finalArr, perDate, perTableRow['event_start_hour'], perTableRow['event_end_hour'], perTableRow, fromHour, toHour)


                            }
                        } else if (perTableRow['event_type'] == 'Yearly') {
                            if (perDate.toString().substring(4, 10) == perTableRow['event_start_date'].toString().substring(4, 10)) {
                                finalArr = assignEventToTimeOfThisDate(finalArr, perDate, perTableRow['event_start_hour'], perTableRow['event_end_hour'], perTableRow, fromHour, toHour)



                            }
                        } else if (perTableRow['event_type'] == 'Monthly') {
                            if (perDate.toString().substring(8, 10) == perTableRow['event_start_date'].toString().substring(8, 10)) {
                                finalArr = assignEventToTimeOfThisDate(finalArr, perDate, perTableRow['event_start_hour'], perTableRow['event_end_hour'], perTableRow, fromHour, toHour)


                                // need to handle 31 and 30th day of month
                            }
                        }
                    }
                }

            }
        }


        res.json({ "result": finalArr, "pathToTopToBottomApi": "http://localhost:4100/getEventsList/topToBottom/Weekly/" + fromDateStr + "/" + toHour, "pathToLeftToRightApi": "http://localhost:4100/getEventsList/leftToRight/Weekly/" + toDateStr, "query": query, "message": "data found", "lastFromDate": fromDateStr, "lastToDate": toDateStr, "lastToHour": toHour });
    })

}
function assignEventToTimeOfThisDate(finalArr, calenderdate, calender_start_hour, calender_end_hour, event_detailsObj, fromHour, toHour) {




    let i = 0;
    var eventStartH = calender_start_hour;

    while (calender_start_hour <= calender_end_hour) {
        var event_details = { ...event_detailsObj };
        if (calender_start_hour == eventStartH) {
            event_details.putEventnameInThisBlock = true;

        } else {
            event_details.putEventnameInThisBlock = false;
        }
        if (calender_start_hour == 24) {
            event_details.hourName = `0 Hr`;

        } else {
            event_details.hourName = `${calender_start_hour} Hr`;

        }

        console.log(calender_start_hour); console.log(finalArr[dateString(calenderdate)]);
        if (calender_start_hour >= fromHour && calender_start_hour <= toHour){
            finalArr[dateString(calenderdate)][calender_start_hour]['events'].push(event_details);
        }
  
        // finalArr[dateString(calenderdate)].forEach((perhrObj) => {



        //     if (calender_start_hour >= fromHour && calender_start_hour <= toHour && calender_start_hour == perhrObj.Hr) {


        //         var found = false;
        //         perhrObj.events.forEach((perEvent) => {

        //             if (perEvent.id == event_details.id) {
        //                 found = true;


        //             }

        //         });
        //         if (found == false) {
        //             perhrObj.events.push(event_details);
        //         }

        //     }

        // }
        // );

        i++;
        calender_start_hour++;
    }

    return finalArr;
}

function splitdateArr(fromDate, toDate) {
    year = fromDate.getFullYear(),
        month = fromDate.getMonth()
    day = fromDate.getDate(),
        dates = [fromDate];

    while (dates[dates.length - 1] < toDate) {


        dates.push(new Date(year, month, ++day));
    }
    return dates;
}
function dateString(date) {
    var dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
        .toISOString()
        .split("T")[0];

    return dateString;
}

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
} function subDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
}

const Port = process.env.Port || 4100;
app.listen(Port, () => {

    console.log('Listening kp ' + Port);
});
