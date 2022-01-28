var express = require('express');
const Image = require('../controllers/images')


var router = express.Router();


router.get('/', function(req, res) {
    if (req.session.userLoggedIn) {
        res.render('imageList',{
            firstName:req.session.userLoggedIn.firstName,
            lastName:req.session.userLoggedIn.lastName,
            email:req.session.userLoggedIn.email})
    }else{
       res.redirect('/')
    }

});

router.get('/error',function (req,res) {
    req.session.userLoggedIn = undefined;
    res.render('errorMarsImagesPage');
});

router.get('/logout',function(req, res) {

    if (req.session.userLoggedIn) {
        req.session.userLoggedIn = undefined;
    }
    res.redirect('/')
});

router.post('/add',isSessionExist,Image.insertImage);

router.get('/add',function (req,res){
    res.redirect('/error');
});


router.delete('/remove',isSessionExist,Image.deleteImage);

router.get('/remove',function (req,res){
    res.redirect('/error');
});

router.get('/saveList',isSessionExist,Image.getList);

// Middleware checking if the user session exist.
function isSessionExist(req,res,next) {
    if(req.session.userLoggedIn)
    {
        return next();
    }

    return res.send('');
}

module.exports = router;