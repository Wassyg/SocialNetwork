const Validator = require('validator');
// Validator validate the type of information in the inputs
const isEmpty = require('./is-empty') ;
module.exports = function validateProfileInput(data){
  let errors={};

  //pareil que register ou Login, sauf qu'on a besoin des champs required
  data.handle= !isEmpty(data.handle) ? data.handle : '';
  data.status= !isEmpty(data.status) ? data.status : '';
  data.skills= !isEmpty(data.skills) ? data.skills : '';

  // on s'assure que le nom fait entre 2 et 30 caractères
    if(!Validator.isLength(data.handle, {min: 2, max: 40})) {
      errors.handle= 'Handle must be between 2 and 4 characters';
    }
    if(Validator.isEmpty(data.handle)){
      errors.handle= 'Profile Handle required';
    }
    if(Validator.isEmpty(data.status)){
      errors.status= 'Status field required';
    }
    if(Validator.isEmpty(data.skills)){
      errors.skills= 'Skills field required';
    }

    //Pour ajouter des vérifs sur les champs Github et Website (URL) syntaxe Validator Validator.isURL
    if(!isEmpty(data.website)){
      if(!Validator.isURL(data.website)){
        errors.website = "Not a valid URL";
      }
    }
    if(!isEmpty(data.twitter)){
      if(!Validator.isURL(data.twitter)){
        errors.twitter = "Not a valid URL";
      }
    }
    if(!isEmpty(data.youtube)){
      if(!Validator.isURL(data.youtube)){
        errors.youtube = "Not a valid URL";
      }
    }
    if(!isEmpty(data.facebook)){
      if(!Validator.isURL(data.facebook)){
        errors.facebook = "Not a valid URL";
      }
    }
    if(!isEmpty(data.instagram)){
      if(!Validator.isURL(data.instagram)){
        errors.instagram = "Not a valid URL";
      }
    }
    // if(!isEmpty(data.githubusername)){
    //   if(!Validator.isURL(data.githubusername)){
    //     errors.githubusername = "Not a valid URL";
    //   }
    // }

   return {
     errors,
     isValid: isEmpty(errors)
   }
}
