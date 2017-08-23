/**
 * Employee Router
 */
var Employee = require('../models/employee'),
    express = require('express'),
    ksHelper = require('../helper/ksHelper'),
    crypto = require('crypto');
    router = express.Router();

var customJwt = require('../utilities/custom-jwt.js');
var expressJwt = require('express-jwt');
var ctrlEmployee = require("../controllers/employeeController");

var auth = expressJwt({
    secret: '123456ABCDEF',
    userProperty: 'payload'
});

//configure routes
router.route('/Employees')
    .get(auth, ctrlEmployee.employeeRead)
    .post(addEmployee);

router.route('/Employees/:id')
    .put(updateEmployee)
    .get(getEmployeeById)
    .delete(deleteEmployee);

//Update the Employee Details for Particular Id 
function updateEmployee(req, res) {
    Employee.findOne({
        _id: req.params.id
    }, function(err, employee) {

        if (err)
            res.send(err);

        var user = req.body;
        if (user.password !== undefined) {
            user.salt = crypto.randomBytes(16).toString('hex');
            user.hashed_pwd = crypto.createHmac('sha256', user.salt)
                .update(user.password)
                .digest('hex')
        }

        for (prop in user) {
            employee[prop] = user[prop];
        }

        // update employee details
        employee.save(function(err) {
            if (err)
                res.send(err);

            res.json({
                message: 'Successfully Done'
            });
        });
    });
}
//Delete the Particular Employee
function deleteEmployee(req, res) {
    Employee.remove({
        _id: req.params.id
    }, function(err, employee) {
        if (err)
            res.send(err);
        res.json({
            message: 'Successfully Done'
        });
    });
}
//Create the New Employee
function addEmployee(req, res) {
    var employee = new Employee(req.body);
    employee.setPassword(req.body.password);
    Employee.count({}, function(err, count) {
        employee.employeeId = ksHelper.getModelId('KS_E', count);
        employee.save(function(err) {
            if (err)
                res.send(err);
            res.send({
                message: 'Successfully Done'
            });
        });
    })
}
//Get the Employee Details for Particular Id
function getEmployeeById(req, res) {
    Employee.findOne({
        _id: req.params.id
    }, function(err, employee) {
        if (err)
            res.send(err);

        res.json(employee);
    });
}

module.exports = router;