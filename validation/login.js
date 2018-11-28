const Validator = require('validator');
// Validator validate the type of information in the inputs
const isEmpty = require('./is-empty') ;

module.exports = function validateLoginInput(data){
  let errors={};
  //pareil que register, sauf qu'on a besoin que de l'email et du password
  data.email= !isEmpty(data.email) ? data.email : '';
  data.password= !isEmpty(data.password) ? data.password : '';

  // on s'assure qu'on est bien dans un format email
  if(!Validator.isEmail(data.email)){
    errors.email= 'Email is invalid';
  }
  // on le place après pour que la condition soit celle affichée si rien n'a été écrit dans le champs email
  if(Validator.isEmpty(data.email)){
    errors.email= 'Email field is required';
  }

  // on fait la même pour le password
  if(Validator.isEmpty(data.password)){
    errors.password= 'Password field is required';
  }


   return {
     errors,
     isValid: isEmpty(errors)
   }
}
