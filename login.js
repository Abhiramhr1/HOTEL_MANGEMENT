const mysql = require("mysql");
const express = require("express");
const bodyParser =require("body-parser");
const encoder =bodyParser.urlencoded();

const app =express();

app.use("/assets",express.static("assets"));

const connection =mysql.createConnection({
    host: "localhost",
    user:"root",
    password:"@Abkudabku123",
    database:"boundless_ascent"
});

connection.connect(function(error){
    if (error) throw error
    else console.log("connected to database successfully!")
});

app.get("/",function(req,res){
    res.sendFile(__dirname+ "/index.html");
})
app.post("/",encoder,function(req,res){
    var email=req.body.email;
    var password=req.body.password;
    connection.query("select * from user_login where email=? and password=?",[email,password],function(error,results,field){
        if(results.length>0){
            res.redirect("/rooms");
        }
        else{
            res.send(`
        <script>
            alert("Incorrect credentials. Please try again.");
            window.location.href = "/login.html";
        </script>
    `);
    return;
        }
        res.end();
    })
})
app.get("/login.html",function(req,res){
    res.sendFile(__dirname+"/login.html");
})
app.get("/booking.html",function(req,res){
    res.sendFile(__dirname+"/booking.html");
})
app.get("/register.html",function(req,res){
    res.sendFile(__dirname+"/register.html");
})
app.post("/reg", encoder, function(req, res) {
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var gender = req.body.gender;
    var dob = req.body.birth_date; // Assuming this is in the format 'DD/MM/YYYY'
    var address = req.body.address;
    var pincode = req.body.pincode;
    var email = req.body.email;
    var password = req.body.password;
    var password1 = req.body.password1;

    const sql = "INSERT INTO `boundless_ascent`.`register` (`email`, `password`, `first_name`, `last_name`, `gender`, `dob`, `address`, `pincode`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const sql1 = "INSERT INTO `boundless_ascent`.`user_login`(`email`,`password`) VALUES (?,?)";

    if (password1 === password) {
        connection.query(sql, [email, password, first_name, last_name, gender, dob, address, pincode], function(error, results, fields) {
            if (error) {
                console.error("Error executing query:", error);
                res.redirect("/register.html"); // Redirect to an error page or display an error message
            } else {
                console.log("Data inserted successfully:", results);
                // Execute the second query only after the first one is complete
                connection.query(sql1, [email, password], function(error, results, fields) {
                    if (error) {
                        console.error("Error executing query:", error);
                        res.redirect("/register.html"); // Redirect to an error page or display an error message
                    } else {
                        console.log("Data inserted successfully:", results);
                        res.redirect("/login.html");
                    }
                });
            }
        });
    } else {
        res.send(`
            <script>
                alert("Password Not Equal!!!");
                window.location.href = "/register.html";
            </script>
        `);
        return;
    }
});


//when login is success
app.get("/rooms",function(req,res){
    res.sendFile(__dirname+"/rooms.html")
})
//set app port
app.listen(2000);

