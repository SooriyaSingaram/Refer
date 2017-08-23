/**
 * employee controller for get all employee based on JWT
 */
var mongoose = require('mongoose');
var Employee = require('../models/employee');


module.exports.employeeRead = function(req, res) {
  // If no user ID exists in the JWT return a 401
  if (!req.payload.role === "Admin") {
    res.status(401).json({
      "message": "UnauthorizedError: No Access"
    });
  } else {
    // Otherwise continue
    Employee.aggregate([{
        $lookup: {
          from: "rolesetups",
          localField: "role",
          foreignField: "roleId",
          as: "role_collection"
        },
      },
      { $unwind: "$role_collection" },
      { $match: { isActive: true } }
    ], function(err, employee) {
      if (err)
        res.send(err);
      res.json(employee);
    });
  }
};