/**
 *  Defining the CRUD functions that will be called in routes/promo.js 
 */
// importing model
const { findOne } = require("../models/promo");
const Promo = require("../models/promo");
const { promoEmail } = require("./users");

// export addMovie function
exports.addPromo = async (req, res) => {
    let promo = await Promo.findOne({code: req.body.code});
    
    if (!promo) {
        let newPromo = new Promo({
            descriptor: req.body.descriptor,
            discount: req.body.discount,
            code: req.body.code,
            adminEdit: true,
            sentEmail: false,
        })
        try {
            await newPromo.save();
            return res.json(newPromo);
        } catch (e) {
            console.log(e);
            return res.json(e);
        }
    } else {
        return res.json({ message: "Promotion already exists", status: 400 })
    }
};

exports.sendPromo = async (req, res) => {
    let code = req.body.code;

    let updatedPromo = {
        adminEdit: false,
        sentEmail: true,
    }
    
    let promo = await promo.findOneAndUpdate(code, updatedPromo);
    
    try {
        //finds users who want promotional emails and puts them in an array
        const promoUsers = [];
        const cursor = User.find({promo: true});
        const results = await cursor.toArray();

        //pushes all the users emails into an array
        if (results.length > 0) {
            results.forEach((result) => { 
                promoUsers.push(result.email);
            });
        } else {
            console.log("No users found");
        }

        //sends each email in the array a promotional email
        if (promoUsers.length > 0) {
            promoUsers.forEach(async (result) => {
                try {
                    await sendEmail(result.email, "Promotional Email", "Check out our new promotion!");
                } catch (e) {
                    console.log(`Promotional email could not be sent to ${result.email}`);
                }
            })
        }
    } catch (e) {
        console.log(e);
        return res.json(e);
    }
};

exports.findPromos = async (req, res) => {
    const allPromos = Promo.find();

    if (allPromos.length > 0) {
        return res.json(allPromos);
    } else {
        console.log("No promos found");
    }
}