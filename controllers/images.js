const dbModels = require('../models');



/**************************
Images database controller
 **************************/

// Insert new image data into db if it is not existed.
exports.insertImage = (req,res)=>{
    dbModels.Image.findOrCreate({
        where:{url:req.body.imgSrc,email:req.session.userLoggedIn.email}
        ,defaults:{
            imageId:req.body.id,
            url:req.body.imgSrc,
            sol:req.body.sol,
            earth_date:req.body.earth_date,
            camera:req.body.camera,
            email:req.session.userLoggedIn.email
        }
    }).then(respond=>{
        res.send({created:respond[1]})
    })
        .catch(()=>{
        res.send('')
    });
}

// Delete image data by url and email given.
exports.deleteImage = (req,res)=>{
    dbModels.Image.destroy({where:{url:req.body.url,email:req.session.userLoggedIn.email}})
        .then(image=>{res.send('deleted')})
        .catch(()=>{res.send('')});
}

// Retrieve all images data according given email.
exports.getList = (req,res)=>{
    dbModels.Image.findAll({where:{email:req.session.userLoggedIn.email}}).
    then(data=>{res.send(data)});
}

