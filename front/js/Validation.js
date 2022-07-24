export default class Validation {
  constructor() {
     this.nameMask =  /[^a-zA-Z-éèï]/;
     this.addressMask = /\d\s[a-zA-Z]+\s\S/;
     this.mailMask = /\S[@]\S+[.][a-zA-Z]/
     this.fieldTypes = {firstName:"checkName",lastName:"checkName",city:"checkName",address:"checkAddress",email:"checkMail"}
  }
  checkName(field){
      console.log(this);
      if(this.nameMask.test(field)){
          return false;
      }
      else{
          return true;
      }
  }
  checkAddress(field){
      if(this.addressMask.test(field) == false){
        return false;
      }
      else{
        return true;
      }
    }
  checkMail(field){
      if(this.mailMask.test(field) == false){
          return false;
      }
      else{
          return true;
      }
  }


  flip(input){
      let daddy = input.closest('div')
      , picto = daddy.children[2]
      , msg = daddy.children[3]
      , bool

      input.addEventListener('change', event => { 
          bool = ["firstName","lastName","city"].indexOf(input.name) != -1
          ? this.checkName(input.value)
          : input.name == 'email'
              ? this.checkMail(input.value)
              : this.checkAddress(input.value)
          if(bool){
          picto.style.display = 'block';
          msg.style.display = 'none';
          }
          else{
          picto.style.display = 'none';
          msg.style.display = 'block';
          }
          if(input.value ==""){
          picto.style.display = 'none';
          msg.style.display = 'none';
          }
      });
  }


  checkForm(){

      if(  this.checkName(firstName?.value) == false
          || this.checkName(lastName?.value) == false
          || this.checkName(city?.value) == false
          || this.checkAddress(address?.value) == false
          || this.checkMail(email?.value) == false
      ) return false;

      return true;
  }
  
  
}