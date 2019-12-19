const express=require('express');
const mongoose=require('mongoose');
var exphbs  = require('express-handlebars');
var methodoverride=require('method-override')
const multer=require('multer')
const bodyparser=require('body-parser')
const handlebars=require('handlebars')
var handlebarsIntl=require('handlebars-intl')
var session=require('express-session')
var flash=require('connect-flash')

const app=express();

handlebarsIntl.registerWith(handlebars);
//load profile schema model
require("./Model/Profile");
const Profile=mongoose.model("profile");
//connecting mongodb
const mongodbUrl="mongodb+srv://divya:divya2498@cluster0-ale0b.mongodb.net/test?retryWrites=true&w=majority"
mongoose.connect(mongodbUrl,{useUnifiedTopology:true, useNewUrlparser:true}, (err)=>{
    if(err) throw err;
    console.log('mongodb is connected')
})
//session middleware
app.use(
    session({
        secret:"keyboard cat",
        resave:false,
        saveUninitialized:true,
    })
)


//connect flash middlewARE
app.use(flash());

//create global middleware
app.use(function(req,res,next){
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error')
    next()
})
//middleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
//static files
app.use(express.static(__dirname+'public'))
app.use(methodoverride('_method'));
handlebars.registerHelper("trimString",function (passedString){
    var theString=[...passedString].splice(6).join("");
    return new handlebars.SafeString(theString);
});
//bodyparser
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json());
//multer
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'public/upload')
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+file.originalname)
    }
});
const upload=multer({storage:storage});
//multer code is ending
//basic route
app.get('/',(req,res)=>{
    res.render('home.handlebars');
});
//profile form
app.get("/profile/addprofile",(req,res)=>{
    res.render("profile/addprofile")
})

app.get("/profile/userprofile",(req,res)=>{
    profile.find({}).then (profile =>{
        res.render('profile/useprofile',{
        profile:profile
    })
}).catch(err=>console.log(err))
});
//create profile by using http post method

// create editprofile
app.get('/profile/editprofile/:id')
//post method
app.post('/profile/addprofile',upload.single('photo'),(req,res)=>{
    const errors=[];
    if(!req.body.name){
        errors.push({text:'namr is required'})
    }
    if(!req.body.phonenumber){
        errors.push({text:'phonenumber is required'})
    }
    if(!req.body.company){
        errors.push({text:"company is required"})
    }
    if(!req.body.location){
        errors.push({text:'location is required'})
    }
    if(!req.body.education){
        errors.push({text:'education is required'})
    }
    if(errors.length > 0){
        res.render('profile/addprofile',{
            errors:errors,
            name:req.body.name,
            phonenumber:req.body.phonenumber,
            company:req.body.company,
            location:req.body.location,
            education:req.body.education
        })
    }else{
        const newProfile={
            photo:req.file,
            name:req.body.name,
            phonenumber:req.body.phonenumber,
            company:req.body.company,
            location:req.body.location,
            education:req.body.education
        }
        new Profile(newProfile)
        .save()
        .then(profile =>{
            console.log(profile);
            req.flash('success_msg','successfully profilr created')
            res.redirect('/profile/userprofile')
        })
        .catch()
    }
    
})
//
app.put('/profile/editprofile/:id',upload.single('photo'),(req,res)=>{
    profile.findone({_id:req.params.id}).then(profile=>{
        profile.photo=req.file;
        profile.name=req.body.name;
        profile.phonenumber=req.body.phonenumber;
        profile.company=req.body.company;
        profile.location=req.body.location;
        profile.education=req.body.education;
        //after this need to save data to database
        profile.save().then(profile =>{
            res.redirect('/profile/userprofile');
        }).catch(err => console.log(err))
    }).catch(err => console.log(err))
})
// delete profile route with help of http of http delete method
app.delete("/profile/deleteprofile/:id",(req,res)=>{
    profile.remove({_id:req.params.id}).then(profile =>{
        req.flash('delete_msg','successfully profile deleted')
        res.redirect('/profile/userprofile');
    }).catch(err=>console.log(err))
})

app.get('**',(req,res)=>{
    res.render("404.handlebars");
});
const port=process.env.PORT|| 5000;
app.listen(port,(err)=>{
    if(err) throw err;
    console.log(`app listening on port ${port} `)
})


