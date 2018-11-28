const Validator = require('validator');
// Validator validate the type of information in the inputs
const isEmpty = require('./is-empty') ;

module.exports = function validateRegisterInput(data){
  let errors={};
  //pour être sûr que data.name ne soit pas empty, on lui attribue a minima une valeur ' ';
  data.name= !isEmpty(data.name) ? data.name : '';
  data.email= !isEmpty(data.email) ? data.email : '';
  data.password= !isEmpty(data.password) ? data.password : '';
  data.password2= !isEmpty(data.password2) ? data.password2 : ''; //utilisé dans le serveur

// on s'assure que le nom fait entre 2 et 30 caractères
  if(!Validator.isLength(data.name, {min: 2, max: 30})){
    errors.name= 'Name must be between 2 and 30 characters';
  }

  // on introduit data.name en amont pour être sûr qu'il contienne qlqchose
  if(Validator.isEmpty(data.name)){
    errors.name= 'Name field is required';
  }

  // on fait la même pour l'email
  if(Validator.isEmpty(data.email)){
    errors.email= 'Email field is required';
  }

  // on s'assure qu'on est bien dans un format email
  if(!Validator.isEmail(data.email)){
    errors.email= 'Email is invalid';
  }

  // on fait la même pour le password
  if(Validator.isEmpty(data.password)){
    errors.password= 'Password field is required';
  }

// on s'assure que le password fait entre 2 et 8 caractères
  if(!Validator.isLength(data.password, {min: 6, max:15})){
    errors.password= 'Password must be between 6 and 15 characters';
  }


  // on fait la même pour le password2 qui permet de confirmer
  if(Validator.isEmpty(data.password2)){
    errors.password2= 'Confirm password';
  }

  // on s'assure que password et password2 sont les mêmes
  if(!Validator.equals(data.password, data.password2)){
    errors.password2= 'Passwords must match';
  }

   return {
     errors,
     isValid: isEmpty(errors)
   }
}
