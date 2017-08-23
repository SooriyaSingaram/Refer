/**
 * Daily Occurrence Router
 */
var DailyOccurrence = require('../models/daily-occurrence'),
    express = require('express'),
    ksHelper = require('../helper/ksHelper'),
    router = express.Router();
emailer = require('../emailer/emailer'),
    Employee = require('../models/employee'),
    ComplaintType = require('../models/complaint-type'),

//configure routes
router.route('/DailyOccurrences')
    .get(getDailyOccurrence)
    .post(addDailyOccurrence);
router.route('/DailyOccurrences/:id')
    .put(updateDailyOccurrence)
    .get(getDailyOccurrenceById)
    .delete(deleteDailyOccurrence);

//Get the All the DailyOccurrence Details
function getDailyOccurrence(req, res) {
    DailyOccurrence.aggregate({

        $lookup: {
            from: "complainttypes",
            localField: "complaintId",
            foreignField: "complaintId",
            as: "complaint_collection"
        },
    }, {
        $unwind: "$complaint_collection"
    }, {
        $lookup: {
            from: "employees",
            localField: "reportedBy",
            foreignField: "employeeId",
            as: "employees_collection"
        },
    }, {
        $unwind: "$employees_collection"
    },{
        $sort: {
            priorityLevel: 1,
               'depositDate': -1,
        }
    }, 
    function(err, dailyOccurrences) {
        if (err)
            res.send(err);

        res.json(dailyOccurrences);
    });
}

//Update the DailyOccurrence Details for Particular Id
function updateDailyOccurrence(req, res) {
    DailyOccurrence.findOne({
        _id: req.params.id
    }, function(err, dailyOccurrence) {

        if (err)
            res.send(err);

        for (prop in req.body) {
            dailyOccurrence[prop] = req.body[prop];
        }

        // save dailyOccurrence details
        dailyOccurrence.save(function(err) {
            if (err)
                res.send(err);

            res.json({
                message: 'Successfully Done'
            });
        });

    });
}
//Delete the Particular DailyOccurrence
function deleteDailyOccurrence(req, res) {
    DailyOccurrence.remove({
        _id: req.params.id
    }, function(err, dailyOccurrence) {
        if (err)
            res.send(err);

        res.json({
            message: 'Successfully Done'
        });
    });
}
//Create the New DailyOccurrence
function addDailyOccurrence(req, res) {
    var dailyOccurrence = new DailyOccurrence(req.body);
    DailyOccurrence.count({}, function(err, count) {
        dailyOccurrence.dailyOccurrenceId = ksHelper.getModelId('AP_DO', count);
        if (dailyOccurrence.priorityLevel == "High Level") {
            sentMail(dailyOccurrence);
        }
        dailyOccurrence.save(function(err) {

            if (err)
                res.send(err);
            res.send({
                message: 'Successfully Done'
            });
        });
    })
}

function sentMail(complaint) {
    var dailyComplaint = [];
    return new Promise(function(handleSuccess, handleFailure) {
        try {
            Employee.find({
                role: "KS_RS001"
            }, function(err, employees) {
                handleSuccess(employees);
                Employee.findOne({
                    employeeId: complaint.reportedBy
                }, function(err, reports) {
                        ComplaintType.findOne({
                            complaintId: complaint.complaintId
                        }, function(err, complaints) {
                            handleSuccess(complaints);
                            complaint.reportedBy = reports.employeeName;
                            complaint.complaintType = complaints.complaintName;
                            dailyComplaint.push(complaint);
                            var subject = "Daily Occurrences";
                            var content = {
                                EmployeeName: "Sir/Madam",
                                SubjectContent: 'Please find the following daily occurrence complaint',
                                rows: dailyComplaint
                            }
                        for (var i = 0, len = employees.length; i < len; i++) {
                            var receiver = [employees[i].userName];
                            var templateName = 'mail';
                            mailsent = emailer.sendEmailNotification(receiver, templateName, content, subject);

                               }
                                                    });
                    });
            });
        } catch (ex) {
            handleFailure(ex);
        }
    });
}
//Get the DailyOccurrence Details for Particular Id
function getDailyOccurrenceById(req, res) {
    DailyOccurrence.findOne({
        _id: req.params.id
    }, function(err, dailyOccurrence) {
        if (err)
            res.send(err);

        res.json(dailyOccurrence);
    });
}

module.exports = router;