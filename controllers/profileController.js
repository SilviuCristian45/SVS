const profileModel = require('../models/Profile');
const userModel = require('../models/User');

const defaultProfile = '618d4f41633aaf355f05f4a3';

async function displayProfiles(req, res) {
    const currentUserID = req.session.user.userid;

    let scripts = [{ script: '/js/profile.js' }]; //scripturile pt front-end pe care o sa le contina view-ul
    
    userModel.findOne({_id:currentUserID}).populate('profiles').lean().exec( (err, user) => {
        if(err) return handleError(err)
        res.render('profiles',{profiles:user.profiles, scripts, message: req.flash('message'), session:req.session, layout: 'profiles'});
    })
    
}

function addProfile(req, res) {
    const newProfileName = req.body.profilename; //noul nume de profil
    const userloggedObjId = req.session.user.userid; //id-ul userului curent 
    const response = new profileModel({title:newProfileName, user:userloggedObjId});

    //get all profiles and count , 
    //daca avem mai multe profile -> mesaj eroare cu prea multe profile pe user-ul curent 
    profileModel.countDocuments({user : userloggedObjId}, (err, result ) => {
        if (result >= 4){
            //res.json({message:'too many profiles . Maximum is 4', alreadyProfiles : result });
            req.flash('message', 'too many profiles. maximum is 4');
            res.redirect('/profiles')
        }   
        else {
            response.save().then( () => { 
                userModel.findByIdAndUpdate(userloggedObjId, {$push : {"profiles" : response._id}}).then( () => {
                    res.redirect('/profiles'); 
                })
            })
        }
    }) 
}

function deleteProfile(req, res) {
    const profileToDelete = req.params.id;
    profileModel.deleteOne({_id:profileToDelete}).then( () => {
        userModel.findByIdAndUpdate(req.session.user.userid, {
            $pull : {"profiles" : {$in : profileToDelete}}
        }).then( () => {
            res.redirect('/profiles');
        });
    });
}

function editProfile(req, res) {
    const profileToEdit = req.params.id;
    if(profileToEdit == defaultProfile)
        res.redirect('/profiles');
    else profileModel.updateOne({_id:profileToEdit}, {title:req.body.profileId}).then( () => {
        res.redirect('/profiles'); 
    })
}

module.exports.addProfile      = addProfile;
module.exports.deleteProfile   = deleteProfile;
module.exports.editProfile     = editProfile;
module.exports.displayProfiles = displayProfiles;