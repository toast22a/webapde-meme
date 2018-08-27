var user = require('../model/User');
module.exports.controller = function (router) {

    router.post("/login", urlencoder, (req, res) => {

        console.log("POST /login")
        var username = req.body.loginUser;
        var pass = req.body.loginPassword;


        console.log(pass)

        if (username && pass) {
            console.log(username + "has logged in")
            req.session.username = username
            res.render("homepage.hbs", {
                hUsername: username
            })
        } else {
            console.log("missing entry log in failed")
            res.render("index.hbs")
        }
    })

    router.post("/register", urlencoder, (req, res) => {
        console.log("POST /register")
        var username = req.body.signUser;
        var pass = req.body.signPassword;
        var desc = req.body.signDescription;

        if (username && pass) {
            console.log(username + "has signed up")
            req.session.username = username
            req.session.description = username
            res.render("homepage.hbs", {
                hUsername: username
            })
        } else {
            console.log("missing entry sign up failed")
            res.render("index.hbs")
        }
    })

    router.get("/logout", (req, res) => {
        console.log("GET /logout")
        console.log("User " + req.session.username + " logged out")

        req.session.destroy((err) => {
            if (err) {
                console.log(err)
            } else {
                console.log("Succesfully destroyed session")
            }
        });
        res.render("index.hbs")
    })

}