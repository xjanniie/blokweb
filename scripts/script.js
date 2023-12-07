// JavaScript Document
console.log("Hallo en welkom bij Ekris BMW");

// array verschillende stickers
// bron: https://scrimba.com/scrim/coade4a0084e984e77df5b04b?pl=pZgNL9HV

let kleuren = ['bmw-7-series-i7-kleurafbeelding-blue.png', 'bmw-7-series-i7-kleurafbeelding-green.png', 'bmw-7-series-i7-kleurafbeelding-pink.png', 'bmw-7-series-i7-kleurafbeelding-red.png'];

aantalKleuren = kleuren.length
console.log("Er zijn totaal: " + aantalKleuren + " verschillende kleuren");

let btn = document.querySelector("#radom_kleur")

btn.addEventListener('click', btnActie)

// bron: week 2 dobbelsteen opdracht
function btnActie() {
    let willekeurigeWaarde = Math.random();

    //lengte
    willekeurigeWaarde *= kleuren.length

    //afronden
    willekeurigeWaarde = Math.floor(willekeurigeWaarde);
    let kleurAfbeelding = kleuren[willekeurigeWaarde];
    console.log('de willekeurige waarde die is toegekend is: ' + willekeurigeWaarde);

    //print
    console.log("Gekregen kleur nummer: " + kleuren[willekeurigeWaarde])
    document.querySelector("img").src = 'images/' + kleurAfbeelding;


}


/******************************/
/* menu openen de MENU button */
/******************************/

/* JOUW CODE HIER - stap 4 */

// stap 1: zoek de menu-button op en sla die op in een variabele
var openButton = document.querySelector("header > button");

// stap 2: laat de menu-button luisteren naar kliks en voer dan een functie uit
openButton.onclick = openMenu;

// stap 3: voeg in de functie een class toe aan de nav
function openMenu() {  
  // zoek de nav op
  var deNav = document.querySelector("nav");
  // voeg class toe aan nav
  deNav.classList.add("toonMenu");
}




/************************************/
/* menu sluiten met de sluit button */
/************************************/

/* JOUW CODE HIER - stap 5 */

// stap 1 - zoek sluiten button op
var sluitButton = document.querySelector("nav button");

// stap 2 - laat die button luisteren naar kliks
sluitButton.onclick = sluitMenu;

// stap 3 - in de functie verwijder de class van de nav
function sluitMenu() {
  var deNav = document.querySelector("nav");
  deNav.classList.remove("toonMenu");
}




/**********************************/
/* bonus: menu sluiten met escape */
/**********************************/
window.onkeydown = handleKeydown;

function handleKeydown(event) {
  if (event.key == "Escape") {
    var deNav = document.querySelector("nav");
    deNav.classList.remove("toonMenu");
  }
}


