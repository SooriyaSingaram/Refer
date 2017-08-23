    // set up ========================
    var db = require('./database'); // connect to mongoDB database in local
    var logger = require('./server/utils/logger');

    var express = require('express');
    var morgan = require('morgan'); // log requests to the console (express4)
    var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
    var cookieParser = require('cookie-parser');
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
    var http = require('http');
    var path = require('path');
    var jwt = require('jwt-simple'); // login auth with session 
    var _ = require('underscore');
    var mongoose = require('mongoose'); // mongoose for mongodb
    var passport = require('passport');
    require('./server/models/employee');
    require('./server/config/passport');
    var app = express(); // create our app with  express

    app.set('jwtTokenSecret', '123456ABCDEF');
    app.use(bodyParser.urlencoded({
        limit: '1000mb'
    })); // parse application/x-www-form-urlencoded
    app.use(bodyParser.json({
        limit: '1000mb'
    }));
    app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
    app.use(morgan('dev')); // log every request to the console

    app.use(bodyParser.json({
        type: 'application/vnd.api+json'
    })); // parse application/vnd.api+json as json
    app.use(cookieParser());
    app.use(passport.initialize());

    // routes ======================================================================
    var configuration = require('./server/routes/configuration');
    var roleSetups = require('./server/routes/roleSetups');
    var categories = require('./server/routes/categories');
    var subcategories = require('./server/routes/subcategories');
    var units = require('./server/routes/units');
    var complainttypes = require('./server/routes/complaint-types.js');
    var products = require('./server/routes/products');
    var suppliers = require('./server/routes/suppliers');
    var menucategories = require('./server/routes/menucategories');
    var employees = require('./server/routes/employees.js');
    var dailyoccurrences = require('./server/routes/daily-occurrence');
    var outlets = require('./server/routes/outlet');
    var franchisebranchs = require('./server/routes/franchisebranch');
    var requests = require('./server/routes/requests');
    var inventorysettings = require('./server/routes/inventorysettings');
    var bankdeposit = require('./server/routes/bankdeposit');
    var bankDepositFilter= require('./server/routes/bankdeposit');
    var inventorysettings = require('./server/routes/inventorysettings');
    var purachseOrders = require('./server/routes/purchaseorders');
    var productReport=require('./server/routes/productReport');
    var menuReport=require('./server/routes/menuReport');
    var expiryProduct=require('./server/routes/productReport');
  
    var menuDetails=require('./server/routes/menuReport');
    var topsoldmenu=require('./server/routes/menuReport');
    var topsoldProduct=require('./server/routes/productReport');
    var supplierReport=require('./server/routes/supplierReport');
    var supplierFilterReport=require('./server/routes/supplierReport');
    var inventorySuppliedReport = require('./server/routes/suppliedby-inventoryreport');
    var menuSuppliedReport = require('./server/routes/suppliedby-inventoryreport');
    var purchaseOrderDetails=require('./server/routes/purchaseorders');
    var purchaseOrdersPaymentReport=require('./server/routes/purchaseorders');
    var purchaseOrdersSellingReport=require('./server/routes/purchaseorders');
    var invoices=require('./server/routes/invoices');
    var suppliedByProductFilter = require('./server/routes/suppliedby-inventoryreport');
    var suppliedByMenuFilter = require('./server/routes/suppliedby-inventoryreport');
    var receivedByProductReport = require('./server/routes/receivedby-inventoryreport');
    var receivedByMenuReport = require('./server/routes/receivedby-inventoryreport');
    var receivedByFilterProductReport = require('./server/routes/receivedby-inventoryreport');
    var receivedByFilterMenuReport = require('./server/routes/receivedby-inventoryreport');
    var labourcost = require('./server/routes/labourcost');
    var overheadprices = require('./server/routes/overheadprice')



    var Employee = require('./server/models/employee');// model for Employee
    var menus = require('./server/routes/menus'); 
    var loginCtrl = require('./server/controllers/login');// controller for login


    app.use('/api', configuration);
    app.use('/api', categories);
    app.use('/api', subcategories);
    app.use('/api', units);
    app.use('/api', products);
    app.use('/api', suppliers);
    app.use('/api', menucategories);
    app.use('/api', complainttypes);
    app.use('/api', roleSetups);
    app.use('/api', employees);
    app.use('/api', dailyoccurrences);
    app.use('/api', outlets);
    app.use('/api', franchisebranchs);
    app.use('/api', requests);
    app.use('/api', inventorysettings);
    app.use('/api', menus);
    app.use('/api', bankdeposit);
    app.use('/api', menuReport);
    app.use('/api', expiryProduct);
    app.use('/api', menuDetails);
    app.use('/api', productReport);
    app.use('/api', purachseOrders);
    app.use('/api', topsoldmenu);
    app.use('/api', topsoldProduct);
    app.use('/api', purchaseOrderDetails);
    app.use('/api', supplierReport);
    app.use('/api', supplierFilterReport);
    app.use('/api', invoices);
    app.use('/api', inventorySuppliedReport);
    app.use('/api', menuSuppliedReport);
    app.use('/api', suppliedByProductFilter);
    app.use('api',  suppliedByMenuFilter);
    app.use('/api', receivedByProductReport);
    app.use('/api', receivedByMenuReport);
    app.use('/api', receivedByFilterProductReport);
    app.use('/api', receivedByFilterMenuReport);
    app.use('/api', bankDepositFilter);
    app.use('/api', purchaseOrdersPaymentReport);
    app.use('/api', labourcost);
    app.use('/api', overheadprices);
    app.use('/api', purchaseOrdersSellingReport);


    app.get('/', function(request, response) {// intial load the index.html
            response.sendfile("index.html");


    });

    app.post('/api/login', loginCtrl.login); // for login the data

    app.use(function(err, req, res, next) { // error thorw msg for unauthorized login 
        if (err.name === 'UnauthorizedError') {
            res.status(401);
            res.json({
                "message": err.name + ": " + err.message
            });
        }
    });

    module.exports = app;
    app.listen(4000, function() { //Port to access
        Employee.findOne({
            userName: "surya.s@zencode.guru"
        }, function(err, employees) { // adding super admin in intial while system start
            if (!err && employees === null) {
                var superAdmin = new Employee();
                superAdmin.userName = "surya.s@zencode.guru";
                superAdmin.employeeId = "KS_E001";
                superAdmin.employeeName = "Super Admin";
                superAdmin.setPassword("admin123");
                superAdmin.role = 'KS_RS001';
                superAdmin.save();
            }
        })
    });
    // listen (start app with node server.js) ======================================
    console.log("App listening on port 4000");

