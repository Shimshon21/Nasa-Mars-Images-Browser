const dbModels = require('../models');
const Cookies = require("cookies");

/**************************
 User login controller
 **************************/

const SUCCESS_REGISTERED_MESSAGE = 'You successfully registered!'
const WRONG_PASSWORD_EMAIL_ERROR  = 'Email or password are invalid!'
const UNEXPECTED_ERROR = 'Something went wrong, please try again later.'
const keys = ['Users']

// Handle GET request, if user already registered he will be redirected to the images list screen.
exports.loginGetHandling = (req,res)=> {
    const cookies = new Cookies(req, res, {keys: keys})
    const lastRegister = cookies.get('newRegistered', {signed: false})

    if (req.session.userLoggedIn) {
        return res.redirect('/marsImages')
    }

    if (lastRegister) {
        res.render('login', {info: SUCCESS_REGISTERED_MESSAGE ,warning:''});
    }

    res.render('login', {warning: '',info:''});
}


/* Login the user into the images list,
   if  the user is not registered or password is not match to email, error message will be shown. */
exports.loginUserHandling = (req,res) => {
        dbModels.User.findOne({
            where:{email:req.body.emailInput, password:req.body.passwordInput}
        }).then(user=>{
            if(user)
            {
                req.session.userLoggedIn = user;
                res.redirect('/marsImages');
            }else
            {
                res.render('login',{info:'',warning:WRONG_PASSWORD_EMAIL_ERROR});
            }

        }).catch(()=>{
            res.render('login',{info:'',warning:UNEXPECTED_ERROR});
        })
}