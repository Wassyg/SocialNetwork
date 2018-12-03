const Validator = require('validator');
// Validator validate the type of information in the inputs
const isEmpty = require('./is-empty') ;

module.exports = function validatePostInput(data){
  let errors={};

  //pareil que register, sauf qu'on a besoin que de l'email et du password
  data.text= !isEmpty(data.text) ? data.text : '';
  
  if(!Validator.isLength(data.text, {max: 300})){
    errors.text= 'Post must be less than 300 characters';
  }
  
  if(Validator.isEmpty(data.text)){
    errors.text= 'Text field is required';
  }

   return {
     errors,
     isValid: isEmpty(errors)
   }
}