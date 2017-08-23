/**
 * Bank Deposit Router
 */
var BankDeposit = require('../models/bankdeposit'),
    express = require('express'),
    ksHelper = require('../helper/ksHelper'),
    router = express.Router();

//configure routes
router.route('/bankdeposit')
    .get(getBankdeposit)
    .post(addBankdeposit);

router.route('/bankDepositFilter')
    .get(getBankDepositFilter)

router.route('/bankdeposit/:id')
    .put(updateBankdeposit)
    .get(getBankDepositById);

//Get the last 2 month the Bank Deposit Details
function getBankdeposit(req, res) {
    var filterDetail = ksHelper.getMonthDetails();
    BankDeposit.aggregate([{
            $project: {
                month: {
                    $month: "$depositDate"
                },
                year: {
                    $year: "$depositDate"
                },
                depositId: '$depositId',
                depositDate: '$depositDate',
                Date: "$Date",
                depositAmount: "$depositAmount",
                branchId: "$branchId",
                bankName: "$bankName",
                bankAc: "$bankAc",
                receipt: "$receipt",
                reason: "$reason",
                franchise: "$franchise",
                isActive: "$isActive"
            },
        },
        {
            $match: {
                $or: [{
                        $and: [{
                            'month': filterDetail.fromMonth
                        }, {
                            'year': parseInt(filterDetail.fromYear)
                        }]
                    },
                    {
                        $and: [{
                            'month': filterDetail.toMonth
                        }, {
                            'year': parseInt(filterDetail.toYear)
                        }]
                    }
                ]
            }
        },
        {
            $sort: {
                'depositDate': -1,
            }
        },

    ], function(err, bankDeposit) {
        if (err)
            res.send(err);

        res.json(bankDeposit);
    });
}

//Update the Bank Deposit Details for Particular Id
function updateBankdeposit(req, res) {
    BankDeposit.findOne({
        _id: req.params.id
    }, function(err, bankDeposit) {

        if (err)
            res.send(err);

        for (prop in req.body) {
            bankDeposit[prop] = req.body[prop];
        }

        // save Bank Deposit details
        bankDeposit.save(function(err) {
            if (err)
                res.send(err);

            res.json({
                message: 'Successfully Done'
            });
        });

    });
}
//Delete the Particular  Bank Deposit details
function deleteBankDeposit(req, res) {
    BankDeposit.remove({
        _id: req.params.id
    }, function(err, bankDeposit) {
        if (err)
            res.send(err);

        res.json({
            message: 'Successfully Done'
        });
    });
}
//Create the New  Bank Deposit details
function addBankdeposit(req, res) {
    var bankdeposit = new BankDeposit(req.body);
    BankDeposit.count({}, function(err, count) {
        bankdeposit.depositId = ksHelper.getModelId('KS_DT', count);
        bankdeposit.save(function(err) {
            if (err)
                res.send(err);
            res.send({
                message: 'Successfully Done'
            });
        });
    })
}
//Get the  Bank Deposit Details for Particular Id
function getBankDepositById(req, res) {
    BankDeposit.findOne({
        _id: req.params.id
    }, function(err, bankdeposit) {
        if (err)
            res.send(err);
        res.json(bankdeposit);
    });
}
//Based on the from,to date and branchId filter the details
function getBankDepositFilter(req, res) {
    console.log(req.query);
    BankDeposit.aggregate([
       
        {
            $match: {
                $and: [{
                        "depositDate": {
                            '$gte': new Date(req.query.fromDate),
                            '$lte': new Date(req.query.toDate)
                        }
                    },
                    {
                        "branchId": req.query.branchId
                    }
                ]

            }
        },
        {
            $sort: {
                'depositDate': -1,
            }
        },

    ], function(err, bankDeposit) {
        if (err)
            res.send(err);

        res.json(bankDeposit);
    });
}

module.exports = router;