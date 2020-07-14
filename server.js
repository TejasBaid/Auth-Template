const express = require('express')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const app = express()
const port = 3000


mongoose.connect('mongodb://localhost:27017/authDB', {useNewUrlParser: true});
const authSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String,
})

const User = new mongoose.model("User", authSchema)


app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view-engine', 'ejs')
app.listen(port, () => console.log("Server running on port " + port))

app.get('/login', (req,res) => {
    res.render('login.ejs')
})
app.get('/signup', (req,res)=>{
    res.render('signup.ejs')
})

app.get('/' ,(req,res) => {
    res.send("Home")
})
app.post('/login', (req,res) => {
     var email = req.body.email
     var password = req.body.password
     
     User.find({email:email},(err,result) => {
         if(err){
             throw err
         }else{
            const hashPass = result[0].password
            bcrypt.compare(password, hashPass, function(err, result) {
                if (result == true){
                    console.log("True")
                    res.redirect('/success')
                }else{
                    console.log("False");
                }
              });
         }
     })
})

app.post('/signup', (req,res) => {
    
    var fname = req.body.firstname
    var lname = req.body.lastname
    var email = req.body.email
    var name = fname + " " + lname
    var password = req.body.password
    var confPass  =req.body.passwordConfirmation
    
    
    // Email Validation
    if(password != confPass){
        //TODO: Implement password error
        console.log("Err");
    }else{
        User.find({email : email},(err,result) => {
            if(err){
                throw err
            }else{
                const count = result.length;
                if(count <= 0){
                    res.redirect('/success')
                    //Hashing
                    bcrypt.hash(password, 10, (err, hash) => {
                        if(err){
                            console.log(err);
                        }else{
                            const newUser = new User({
                                name : name,
                                email : email,
                                password : hash,
                            })
                            newUser.save()
                        }
                        });

                }else{
                    //TODO: Implement email error
                    console.log("Email Exists");
                }
            }
        })   
    }
    
})

app.get('/success', (req,res) => {
    res.send("Success")
})

