const profileModel = require('../models/Profile');
const userModel = require('../models/User');

async function displayProfiles(req, res) {
    const currentUserID = req.session.user.userid;
    const profilesOfCurrentUser = await profileModel.find({user:currentUserID}).lean();

    let scripts = [{ script: '/js/profile.js' }]; //scripturile pt front-end pe care o sa le contina view-ul
    res.render('profiles',{profiles:profilesOfCurrentUser, scripts});
}

function addProfile(req, res) {
    const newProfileName = req.body.profilename; //noul nume de profil
    const userloggedObjId = req.session.user.userid; //id-ul userului curent 
    const response = new profileModel({name:newProfileName, user:userloggedObjId});

    //get all profiles and count , 
    //daca avem mai multe profile -> mesaj eroare cu prea multe profile pe user-ul curent 
    profileModel.countDocuments({user : userloggedObjId}, (err, result ) => {
        if (result >= 4)
           res.json({message:'too many profiles . Maximum is 4', alreadyProfiles : result });
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
    profileModel.updateOne({_id:profileToEdit}, {name:req.body.profileId}).then( () => {
        res.redirect('/profiles'); 
    })
}

module.exports.addProfile    = addProfile;
module.exports.deleteProfile = deleteProfile;
module.exports.editProfile   = editProfile;
module.exports.displayProfiles = displayProfiles;