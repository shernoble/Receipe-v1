const express=require("express");
const expressLayouts=require("express-ejs-layouts");
const fileUpload=require("express-fileupload");
const session=require("express-session");
const cookieParser=require("cookie-parser");
const flash=require("connect-flash");

require('dotenv').config();

const app=express();
const port=process.env.PORT || 3000;



app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(expressLayouts);

app.use(cookieParser('CookingBlogSecure'));
app.use(session({
    secret:'CookingBlogSecretSession',
    saveUninitialized:true,
    resave:true
}));
app.use(flash());
app.use(fileUpload());

app.set('view engine','ejs');

// setting express-ejs-layout
app.set('layout','./layouts/main');

// basic routes get redirected here
const routes=require('./server/routes/recipeRoutes.js');
const { trusted } = require("mongoose");
app.use("/",routes);

app.listen(port,()=>{
    console.log(`server started at port ${port}`);
});
