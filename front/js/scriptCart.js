import Validation from './Validation.js'


let check = new Validation()
, copyLoco = []
, contact = ''







/*** CORP DU CODE ***/

var item = document.getElementsByClassName("cart__item")
var inputQty = document.getElementsByClassName("itemQuantity")
var del = document.getElementsByClassName("deleteItem")

/*
let firstName = document.getElementById('firstName')
let lastName = document.getElementById('lastName')
let address = document.getElementById('address')
let city = document.getElementById('city')
let email = document.getElementById('email')
*/

// I°)
// Notifie que le panier est vide
if(localStorage.length == 0){  
  document.querySelector("h1").innerHTML = "Votre panier est vide"
}

// II°)
// Ajoute les produits dans le DOM
for( let i = 0 ; i < localStorage.length ; i++){   
  // if(i > 0){
    var copy = item[0].cloneNode(true)
    document.getElementById("cart__items").removeChild(item[0])
    document.getElementById("cart__items").appendChild(copy)
  // }
  var ID = readn(i).id
  var color = readn(i).color
  item[i].dataset.key = ID + color
  document.getElementsByClassName("cart__item__content__description")[i].children[1].innerHTML = color
  inputQty[i].value = readn(i).quantity
  product(i)
}




// III°)
/**ACCROCHER DES ÉVÈNEMENTS */
//empêcher le comportement d'envoie du formulaire par défaut
document.getElementsByClassName("cart__order__form")[0].addEventListener("submit", function(event){
  event.preventDefault()
})
//Bouton commander
document.getElementById('order').addEventListener("click", function() {  
  var elem = []
  for( let i = 0 ; i < localStorage.length ; i++){   // Ajoute les produits dU Localstorage dans un tableau
    elem = readn(i).id
    copyLoco.push(elem)
  }

  if(localStorage.length == 0){
    let msgEmpty = document.getElementsByClassName('cart__order__form__submit')[0].children[1]
    msgEmpty.style.display = 'block'
  }
  else{
    if(check.checkForm()){
      send()

      setTimeout(function() {
        window.location ="./confirmation.html"
      },100) 
    }
  }
})

// Modifie la quantité à chaque changement de l'utilisateur dans le panier
Array.from(inputQty).forEach(function(elem) {  
  elem.addEventListener("click", function() {  
    var newQty = elem.value
    var article = elem.closest('article')
    var ID = readk(article.dataset.key).id
    var color = readk(article.dataset.key).color
    stock(newQty,color,ID)
    console.log(localStorage)
    total()
  })
})

// Permet la suppression d'élément dans le panier
Array.from(del).forEach(function(elem) {  
  elem.addEventListener("click", function() {
    var article = elem.closest('article')
    article.remove()
    localStorage.removeItem(article.dataset.key)
    console.log(localStorage)
    if(localStorage.length == 0){
      document.querySelector("h1").innerHTML = "Votre panier est vide"
    }
  })
})



/*** FONCTIONS ***/

// I°)
/**LES FONCTION CONCERNANT LE LOCALSTORAGE */
function stock(qty,clr,ID){  // Stock en format Json dans le localStorage 
  let objJson = {
    color : clr,
    id : ID,
    quantity : qty
  }
  let objLinea = JSON.stringify(objJson)
  var key = ID + clr
  localStorage.setItem(key,objLinea)
}

function readn(n){  // Récupère le n-ième item du localStorage et renvoie sa quantité, sa couleur et son id
  let objLinea = localStorage.getItem(localStorage.key(n))
  let objJson = JSON.parse(objLinea)
  return objJson
}

function readk(key){  // Récupère l'item localStorage de key k et renvoie sa quantité, sa couleur et son id
  let objLinea = localStorage.getItem(key)
  let objJson = JSON.parse(objLinea)
  return objJson
}



// II°)
/**LES FONCTIONS CONCERNANT L'ASYNCHRONE */

//Calcul le prix total
setTimeout(function() {
  var sum = 0
  for (let i = 0 ; i < item.length ; i++){
    var prix = document.getElementsByClassName("cart__item__content__description")[i].children[2].innerHTML
    var prixInt = Number(prix.split(',')[0])
    var prixTot = inputQty[i].value * prixInt
    sum = sum + prixTot
  }
  document.getElementById('totalQuantity').innerHTML = item.length
  document.getElementById('totalPrice').innerHTML = sum
},100)

// Récupère les données dans l'API et les stock dans le domaine
function product(i) {   
  fetch("http://localhost:3000/api/products/" + ID)
  .then(function(res) {
    if (res.ok) {
      return res.json()
    }
  })
  .then(function(value) {
      var desc = document.getElementsByClassName("cart__item__content__description")[i]
      desc.children[0].innerHTML = value.name  
      desc.children[2].innerHTML = value.price +",00 €" 
      var image = document.getElementsByClassName("cart__item__img")[i].children[0] 
      image.alt = value.altTxt 
      image.src = value.imageUrl
  }) 
  .catch(function(err) {
    alert("Une erreur est survenue")
  })

}

// Fonction qui envoie à l'API les coordonnées et le contenue de la commande en renvoie l'ID de commande
function send(){   
fetch("http://localhost:3000/api/products/order", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    contact : {
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      city: document.getElementById('city').value,
      address: document.getElementById('address').value,
      email: document.getElementById('email').value,
    },
    products : copyLoco,
})
})
  .then((res) => res.json())
  // to check res.ok status in the network
  .then((data) => {
    localStorage.clear()
    console.log(data)
    localStorage.setItem("orderId", data.orderId)
  })
  .catch(() => {
    alert("Une erreur est survenue")
  }) // catching errors
}





// III°)
/**LES FONCTION CONCERNANT LA VALIDATION DU FORMULAIRE */
/*
// Vérifie que la syntaxe correspond à un(e) nom/prénom/ville
function checkName(field){
  let nameMask =  /[^a-zA-Z-éèï]/
  if(nameMask.test(field)){
    return false
  }
  else{
    return true
  }
}

// Vérifie que la syntaxe correspond à une adresse
function checkAddress(field){
  let addressMask = /\d\s[a-zA-Z]+\s\S/
  if(addressMask.test(field) == false){
    return false
  }
  else{
    return true
  }
}

// Vérifie que la syntaxe correspond à un email
function checkMail(field){
  let mailMask = /\S[@]\S+[.][a-zA-Z]/
  if(mailMask.test(field) == false){
    return false
  }
  else{
    return true
  }
}
*/

/*
// Vérifie que la syntaxe de tous les champs du formulaire est correct
function checkForm(){

  if(  check.checkName(firstName.value) == false
    || check.checkName(lastName.value) == false
    || check.checkName(city.value) == false
    || check.checkAddress(address.value) == false
    || check.checkMail(email.value) == false
  ) return false

  return true
}
*/

[firstName,lastName,city,email,address].forEach(elt => { check.flip(elt) })


/*
//Érreur quand on modifie les champs du formulaire :
function flip(div,f){
  let daddy = div.closest('div')
  let picto = daddy.children[2]
  let msg = daddy.children[3]
  addEventListener('change', event => { 
    console.log(f)
    if(check[f](div.value)){
      picto.style.display = 'block'
      msg.style.display = 'none'
    }
    else{
      picto.style.display = 'none'
      msg.style.display = 'block'
    }
    if(div.value ==""){
      picto.style.display = 'none'
      msg.style.display = 'none'
    }
  })
}


//Champ prénom
flip(firstName,"checkName")
//Champ nom
flip(lastName,"checkName")
//Champ adresse
flip(address,"checkAddress")
//Champ ville
flip(city,"checkName")
//Champ email
flip(email,"checkMail")
*/