const validator = require('validator');
const isEmpty = require('./is-empty');

// below also can be written 
// module.exports = validateRegister => {}

module.exports = function validateRegisterInput(data){   //old way
    const errors ={};
    
    //name validation
    if(!validator.isLength(data.name, {min:2, max:30})){
        errors.name = 'Name must be between 2 and 30';        
    }
    //we can't have this before above validation 
    if(isEmpty(data.name)){
        errors.name = 'Name field is required';   
    }

    //Email validation
    if(!validator.isEmail(data.email)){
        errors.email = 'Email is invalid';        
    }  
    if(isEmpty(data.email)){
        errors.name = 'Email field is required';   
    }

    //Pssword validation
    if(!validator.isLength(data.password, {min:6 , max:30})){
        errors.password = 'Password mist be between 6and 30 character';        
    }  
    if(isEmpty(data.password)){
        errors.password = 'password field is required';   
    }

    //Pssword2 validation    
    if(isEmpty(data.password2)){
        errors.password2 = 'Confirm password field is required';   
    }
    if(!validator.equals(data.password, data.password2)){
        errors.password = 'Passwords must match'; 
           
    } 

    return {
        errors,
        isValid: isEmpty(errors)
    }
}
