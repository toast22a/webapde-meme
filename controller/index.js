module.exports.controller = function(app) {
    
    app.get("/",(req,res,next)=>{
    console.log("GET /")
    var username = req.session.username
    if(username){
        res.render("homepage.hbs",{
                hUsername:username})
       }else{
        res.render("index.hbs")
       }


    })
}