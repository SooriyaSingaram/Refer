/**
 * Menu Router
 */
var Menu = require('../models/menu'),
    express = require('express'),
    ksHelper = require('../helper/ksHelper'),
    router = express.Router();

//configure routes
router.route('/Menus')
    .get(getMenus)
    .post(addMenu);

router.route('/Menus/:id')
    .put(updateMenu)
    .get(getMenuById)
    .delete(deleteMenu);

//Get the All the Menu Details
function getMenus(req, res) {
    Menu.aggregate({
            $lookup: {
                from: "menucategories",
                localField: "menucategoryId",
                foreignField: "categoryId",
                as: "menucategories_collection"
            },
        }, {
            $unwind: "$menucategories_collection"
        },
         {
            $lookup: {
                from: "units",
                localField: "unitId",
                foreignField: "unitId",
                as: "units_collection"
            },
        }, {
            $unwind: "$units_collection"
        },
         {
            $match: {
                isActive: true
            }
        },
        function(err, menus) {
            if (err)
                res.send(err);

            res.json(menus);
        });
}
//Update the Menu Details for Particular Id
function updateMenu(req, res) {
    Menu.findOne({
        _id: req.params.id
    }, function(err, menu) {

        if (err)
            res.send(err);

        for (prop in req.body) {
            menu[prop] = req.body[prop];
        }

        // save menu details
        menu.save(function(err) {
            if (err)
                res.send(err);

            res.json({
                message: 'Successfully Done'
            });
        });

    });
}
//Delete the Particular Menu
function deleteMenu(req, res) {
    Menu.remove({
        _id: req.params.id
    }, function(err, menu) {
        if (err)
            res.send(err);

        res.json({
            message: 'Successfully Done'
        });
    });
}
//Create the New Menu
function addMenu(req, res) {
    var menu = new Menu(req.body);
    Menu.count({}, function(err, count) {
        menu.menuId = ksHelper.getModelId('KS_M', count);
        menu.save(function(err) {
            if (err)
                res.send(err);
            res.send({
                message: 'Successfully Done'
            });
        });
    })
}
//Get the Menu Details for Particular Id
function getMenuById(req, res) {
    Menu.findOne({
        _id: req.params.id
    }, function(err, menu) {
        if (err)
            res.send(err);

        res.json(menu);
    });
}

module.exports = router;