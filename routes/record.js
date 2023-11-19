const express = require("express");

const recordRoutes = express.Router();

const dbo = require("../db/conn");

const ObjectId = require("mongodb").ObjectId;

recordRoutes.route("/products").get(async function (req, res) {
    let db_connect = dbo.getDb("stepik");

    const sortField = req.query.sortField || "quantity";
    const sortOrder = parseInt(req.query.sortOrder) || 1;
    const filter = req.query.filter || {};

    const sortObject = {[sortField]: sortOrder};
    const filterObject = JSON.parse(filter);

    await db_connect
        .collection("products")
        .find(filterObject)
        .sort(sortObject)
        .toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});

recordRoutes("/products").post(async function (req, res) {
    let db_connect = dbo.getDb("stepik");
    let myobj = {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        quantity: req.body.quantity,
        unit: req.body.unit
    };
    const nameInDb = await db_connect.collection("products").findOne({name: myobj[name]});
    if (nameInDb) {
        console.error("Name already in database.");
    } else {
        await db_connect
            .collection("products")
            .insertOne(myobj, function (err, result) {
                if (err) throw err;
                res.json(result)
            })
    }
})

recordRoutes("/products/:id").put(async function (req, res) {
    const { id } = req.params;
    const { name, price, description, quantity, unit } = req.body;

    const productInDb = await db_connect.collection("products").findOne({_id: ObjectId(id)})
    if (!productInDb) {
        console.error("Product doesn't exist in database")
    } else {
        await db_connect.collection("products").updateOne(
            {_id: ObjectId(id)},
            {$set: {name, price, description, quantity, unit}},
            function (err, result) {
                if (err) throw err;
                res.json(result)
            }
        )
    }
})

recordRouter("/products/:id").delete(async function (req, res) {
    const { id } = req.params

    const productInDb = await db_connect.collection("products").findOne({_id: ObjectId(id)})
    if (!productInDb) {
        throw new Error("No product in db");
    } else {
        await db_connect.collection("products").deleteOne({_id: ObjectId(id)}, function(err, result) {
            if (err) throw err;
            res.json(result)
        })
    }
})

