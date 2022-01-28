const dbModels = require('../models');
const Cookies = require("cookies");

/*****************************
 User Registretion controller
 *****************************/

const keys = ['Users']

const UNEXPECTED_ERROR = 'Something went wrong, please try again later'
const PASSWORD_CONFORMATION_ERROR = 'The password conformation does not match'
const REGISTRATION_TIME_ERROR = 'Time registration ended'
const USER_EXISTED_ERROR = 'User already registered'


// Handle GET request for registration page.
exports.registerGetHandling = (req, res)=>{
    // Get the cookie
    const cookies = new Cookies(req, res, { keys: keys })
    const lastVisit = cookies.get('isRegistering', { signed: false })

    if (!lastVisit) {
        res.render('register',{warning:''} );
    }
    else{
        res.redirect('/register/password')
    }
}


// Check if the user is already stored in the data base.
exports.isUserExisted = (req, res)=>{
    dbModels.User.findOne({
        where:{email:req.query.email}
    }).then(user =>{
        if(user)
        {
            res.send({warning: USER_EXISTED_ERROR});
        }else{
            res.send({warning: ''});
        }
    }).catch(error =>{
        res.render('register',{warning: UNEXPECTED_ERROR});
    })
}


/* Store in COOKIE user intial registration info:
   First name,Last name,Email */
exports.storeInitialRegistrationInfo = (req, res)=> {
    let [email, first, last] = [req.body.emailInput.trim(),
        req.body.firstNameInput.trim(),
        req.body.lastNameInput.trim()];
    dbModels.User.findOne({
        where: {email: req.body.emailInput}
    }).then(user => {
        if (user) {
            res.send({warning: 'User already registered: ' + user});
        } else {
            const cookies = new Cookies(req, res, {keys: keys})
            const myJson = JSON.stringify({'email': email, 'firstName': first, 'lastName': last});

            cookies.set('isRegistering', myJson, {signed: false, maxAge: 60 * 1000});//60 seconds

            res.redirect('/register/password');
        }
    }).catch(error => {
        res.render('register', {warning: UNEXPECTED_ERROR});
    })

}


// Redirect user to password registration if already inserted initial registration:
exports.checkStartedRegistration = (req, res)=> {
    const cookies = new Cookies(req, res, {keys: keys})
    const lastRegister = cookies.get('isRegistering', {signed: false})

    // Check if user is middle registration.
    if (lastRegister) {
        res.render('password', {warning: ''})
    } else {
        res.render('register', {warning: REGISTRATION_TIME_ERROR});
    }
}



/* Store the user info in the users data base.
   The registration will fail if the user registered too late
   or the password and conformation password were not match.*/
exports.handlePasswordRegistration = (req,res) => {
    const cookies = new Cookies(req, res, {keys: keys})
    const lastRegister = cookies.get('isRegistering', {signed: false})

    if (lastRegister) {
        if (req.body.passwordInput.length !== 0 &&
            req.body.passwordInput === req.body.confirmPasswordInput) {
            const values = JSON.parse(lastRegister);


            dbModels.User.create({
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                password: req.body.passwordInput
            });
            cookies.set('newRegistered', true, {signed: false, maxAge: 10 * 1000});
            cookies.set('isRegistering', '', {signed: false, maxAge: -1});
            res.redirect('/');

        } else {
            res.render('password', {warning: PASSWORD_CONFORMATION_ERROR});
        }
    } else {
        res.render('register', {warning: REGISTRATION_TIME_ERROR});
    }
}


// Server side register validation
exports.registerValidateData = (req, res) => {
    let [email, first, last] = [
        req.body.emailInput,
        req.body.firstNameInput,
        req.body.lastNameInput]

    let v1 = registerInputValidatorModule.isEmailValid(email)
    let v2 = registerInputValidatorModule.isOnlyLetters(first) &&
        registerInputValidatorModule.isOnlyLetters(last)
    let v = v1 && v2

    if (v)
        return next();

    return render('register', {warning: v.message})
}


// Register validator module
let registerInputValidatorModule = (()=> {
    const EMAIL_VALIDATION_ERROR = 'Email format invalid'
    const NAME_VALIDATION_ERROR = 'Names should be only with letters'
    /**
     * Check the email format.
     * @param str - string to validate
     * @returns {{isValid: boolean, message: string}}- boolean and a message in case validation failed.
     */
    const isEmailValid = function (str) {
        return {
            isValid: (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(str)),
            message: EMAIL_VALIDATION_ERROR
        }
    }

    /**
     * Check only characters.
     * @param str - string to validate
     * @returns {{isValid: boolean, message: string}}- boolean and a message in case validation failed.
     */
    const isOnlyLetters = function (str) {
        return {
            isValid: (/^[a-zA-Z]+$/.test(str)),
            message: NAME_VALIDATION_ERROR
        }
    }

    return {
        isEmailValid: isEmailValid,
        isOnlyLetters: isOnlyLetters,
    }
})()