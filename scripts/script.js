

  var openButton = document.querySelector("header > button");

  openButton.onclick = openMenu;

  function openMenu() {
      var deNav = document.querySelector("nav");
      deNav.classList.add("toonMenu");
  }

  var sluitButton = document.querySelector("nav button");

  sluitButton.onclick = sluitMenu;

  function sluitMenu() {
      var deNav = document.querySelector("nav");
      deNav.classList.remove("toonMenu");
  }

  window.onkeydown = handleKeydown;

  function handleKeydown(event) {
      if (event.key == "Escape") {
          var deNav = document.querySelector("nav");
          deNav.classList.remove("toonMenu");
      }
  }


  function createCaroCaroussel(
    {
        carouselID,
        bolletjesOn = false,
        linkButtonsOn = false,
        arrowKeysOn = false,
        swipenOn = false,
        autoScrollOn = false,
        autoScrollInterval = 4000,
        elementWidth = "100%",
        startElement = 1,
        scrollTop = 0
    }
) {





/***************************/
/* VARIABELEN PER CAROUSEL */
/***************************/

let carousel,
        carouselElementsContainer,
        carouselElements;

let autoScrollTimer;

let previous = "previous",
        next = "next",
        start = "start",
        center = "center",
        end = "end";





/***********************************************/
/* INI WAARDES INSTELLEN EN INTERACTIE STARTEN */
/***********************************************/

// eerst checken of de carousel wel bestaat en elementen bevat
function iniCarousel() {
    carousel = document.querySelector("#"+carouselID);
    if (carousel) {
      carouselElementsContainer = carousel.querySelector(":scope > ul");
        if (carouselElementsContainer) {
            carouselElements = carouselElementsContainer.querySelectorAll(":scope > li");
            if(carouselElements.length > 1) {
                iniCarouselInteration();
            }
        }
    }
}

// de verschillende interacties initieren
function iniCarouselInteration() {
    var interactionIniArray = [];

    /*********************************************/
    /* verzamelen welke interacties gewenst zijn */
    /*********************************************/

    // als link-buttons gewenst zijn
    if (linkButtonsOn) interactionIniArray.push(iniLinkButtons);

    // als arrow-keys gewenst zijn
    if (arrowKeysOn) interactionIniArray.push(iniArrowKeys);

    // als swipen gewenst zijn
    if (swipenOn) interactionIniArray.push(iniSwipen);

    // als bolletjes gewenst zijn
    if (bolletjesOn) interactionIniArray.push(iniBolletjes);
    
    // als auto scrollen gewenst is
    if (autoScrollOn) interactionIniArray.push(iniAutoScroll);

    // url hacks ondervangen
    interactionIniArray.push(iniUrlHacks);

    // de carousel naar de start-positie scrollen
    interactionIniArray.push(iniStartPosition);

    /*****************************************/
    /* dan de gewenste interacties initieren */
    /*****************************************/

    // als er minimaal 1 interactie gewenst is (buiten url-start en url-hack)
    if (interactionIniArray.length >= 3) {
        // de elementen (de li's) een unieke ID geven - gebaseerd op carousel ID
        for (i=0; i < carouselElements.length; i++) {
            carouselElements[i].id = carouselID + i;
        }

        // breedte als custom property aan de carousel meegeven
        // zodat de breedte in css en js gelijk is
        setStyle('--caroCarouselElementWidth', elementWidth);
      // handmatig scrollen onderdrukken
        setAttribute('tabIndex', -1);
        addClass("customInteraction");

        // interacties initieren
        interactionIniArray.forEach(fn => fn());

        // controleren of de elemenetn samen wel breder zijn dan de container
        checkNeedForScrolling();
        // dat ook weer doen als het window geresized wordt
        window.addEventListener('resize', handleWindowResize);
    }
}

var handleWindowResize = debounce( function() {
    checkNeedForScrolling();
}, 250);

function checkNeedForScrolling() {
    if (carouselElementsContainer.offsetWidth >= carouselElementsContainer.scrollWidth) {
        addClass("noScrollingNeeded");
    } else {
        removeClass("noScrollingNeeded");
    }
}





/****************/
/* DE BOLLETJES */
/****************/

// de bolletjes initialiseren en activeren
function iniBolletjes() {

    function addBolletjes() {
        // HTML voor de bolletjes componeren
        let bolletjesHTML = "";
        for (carouselElement of carouselElements) {
            bolletjesHTML += `<li><a href="#${carouselElement.id}" aria-label-"ga naar ${carouselElement.id}"></a></li>`;
        }
        bolletjesHTML = `<nav><ul>${bolletjesHTML}</ul></nav>`;
        // html toevoegen aan carousel
        carousel.insertAdjacentHTML('beforeend', bolletjesHTML);

        // de bolletjes aanzetten
        activateBolletjes();
    }

    function activateBolletjes() {
        // de bolletje opzoeken
        let bolletjes = carousel.querySelectorAll(":scope > nav a");
        // elk bolletje laten luisteren naar kliks
        for(bolletje of bolletjes) {
            bolletje.addEventListener("click", function(e){
                // als er geklikt wordt
                // de default-actie (de link volgen) niet uitvoeren
                e.preventDefault();	
                // de href van het bolletje opzoeken - en daarmee het doelelement
                let newElement = carousel.querySelector(this.hash);
                // naar het bijbehorende element scrollen
                scrollToElement(newElement);
            });
        }
    }

    // class aan de carousel toevoegen
    addClass("bolletjesOn");
    
    // de bolletjes toevoegen
    addBolletjes();
}





/*****************************/
/* LINKS/RECHTS LINK-BUTTONS */
/*****************************/  

// de links/rechts link-buttons initialiseren en activeren
function iniLinkButtons() {

    function addLinkButton(direction, omschrijving) {
        // html voor linkbutton componeren
        let linkButtonHTML = `<a href="${direction}" aria-label="${omschrijving}"></a>`;
        // html toevoegen aan carousel
        carousel.insertAdjacentHTML('beforeend', linkButtonHTML);

        // linkbutton activeren - luisteren naar kliks
        carousel.querySelector(':scope > [href="'+direction+'"]').addEventListener("click", function(e) {
            // de default-actie (de link volgen) niet uitvoeren
            e.preventDefault();
            goToElement(direction);
        });
    }

    // class aan de carousel toevoegen
    addClass("linkButtonsOn");

    // de links/rechts link-buttons toevoegen
    addLinkButton(previous, "Naar het element aan de linkerkant");
    addLinkButton(next, "Naar het element aan de rechterkant");
}





/***************************/
/* PIJLTJES OP TOETSENBORD */
/***************************/

function iniArrowKeys() {

    function activateArrowKeys() {
        carousel.addEventListener('keydown', function(e) {
            if ( e.code == "ArrowLeft") {
                e.preventDefault();
                if (e.shiftKey) {
                    // naar eerste
                    newElement = carouselElementsContainer.firstElementChild;
                    scrollToElement(newElement);
                } else {
                    // naar vorige
                    goToElement(previous);
                }
            }
            else if ( e.code == "ArrowRight") {
                e.preventDefault();
                if (e.shiftKey) {
                    // naar laatste
                    newElement = carouselElementsContainer.lastElementChild;
                    scrollToElement(newElement);
                } else {
                    // naar volgende
                    goToElement(next);
                }
            }
        });
    }

    // class aan de carousel toevoegen
    addClass("arrowKeysOn");

    // de pijltjes activeren
    activateArrowKeys();
}





/**********/
/* SWIPEN */
/**********/

// werkt op touch devices (is te simuleren in de inspector)
function iniSwipen() {
    let touchstartX = 0;
    let touchendX = 0;
let touchstartY = 0;
    let touchendY = 0;

    function activateSwipen() {
        // het begin van de swipe
        carousel.addEventListener('pointerstart', function(e) {
            // vastleggen waar de swipe is begonnen
            touchstartX = e.changedTouches[0].screenX;
            touchstartY = e.changedTouches[0].screenY;
        }, { capture: false, passive: true });
        
        // het einde van de swipe
        carousel.addEventListener('pointerend', function(e) {
            // vastleggen waar de swipe is geeindigd
            touchendX = e.changedTouches[0].screenX;
            touchendY = e.changedTouches[0].screenY;
            // dan berekenen of en in welke richting
            handleGesture();
        }, { capture: false, passive: true }); 
    }

// berekenen of en in welke richting
    function handleGesture() {
  // de afgelegde afstand in X- en Y-richting bepalen
        let deltaX = touchendX - touchstartX;
        let deltaY = touchendY - touchstartY;
  
  // er is geswiped als de deltaX 5x zo groot is als deltaY
  // dat betekent een redelijk horizontale swipe
        if ( Math.abs(deltaX) > (Math.abs(deltaY) * 5) ) {
    // dan moet de afgelegde afstand ook nog groter zijn dan 30px
    // als de afstand positoef is dan is van links naar rechts geswiped
            if (deltaX > 30) {
                goToElement(previous);
            }
    // als de afstand negatief is dan is van rechts naar links geswiped
            else if (deltaX < -30) {
                goToElement(next);
            }
        }
    }

    // class aan de carousel toevoegen
    addClass("swipenOn");

    // swipen activeren
    activateSwipen();
}





/*****************/
/* AUTO SCROLLEN */
/*****************/

// auto scroll starten
function startAutoScroll() {
autoScrollTimer = setInterval(function(){
  goToElement(next, false);
}, autoScrollInterval);
    addClass("autoScrolling");
}

// auto scroll stoppen
function stopAutoScroll() {
clearInterval(autoScrollTimer);
    removeClass("autoScrolling")
}

// auto scroll initieren en activeren
function iniAutoScroll() {

    function addPlayButton() {
        // HTML voor playbutton componeren
        let playButtonHTML = `<button aria-label="start/stop autoscroll"></button>`;
        // HTML toevoegen aan carousel
        carousel.insertAdjacentHTML('beforeend', playButtonHTML);

        // playbutton activeren - luisteren naar kliks
        carousel.querySelector(':scope > button').addEventListener("click", function(e) {
            if(carousel.classList.contains("autoScrolling")) {
                stopAutoScroll();
            } else {
                startAutoScroll();
            }
        });

        // escape activeren - om te stoppen
        carousel.addEventListener('keydown', function(e) {
            if ( e.code == "Escape") {
                if(carousel.classList.contains("autoScrolling")) {
                    stopAutoScroll();
                }
            }
        });
        
    }

    // class aan de carousel toevoegen
    addClass("autoScrollOn");
    // interval-tijd als custom property aan de carousel meegeven
    // zodat de interval-tijd in css en js gelijk is
    setStyle('--caroCarouselAutoScrollInterval', autoScrollInterval);

    // de play button toevoegen 
    addPlayButton();
    
    // autoscroll starten
    startAutoScroll();
}





/*****************************/
/* START POSITIE & URL HACKS */
/*****************************/

// als de fragment identifier (# met een id van een element) handmatig wordt aangepast
function iniUrlHacks() {

    function handleUrlHacks (e) {
        // checken of er binnen de carousel een element is met de opgegeven ID 
        if (carousel.querySelector(location.hash)) {
            // if so - dat element in beeld brengen
            goToUrlHash(location.hash);
        }
    }

    // het window naar hash changes laten luisteren
    window.addEventListener('hashchange', handleUrlHacks);
}


// als er een url wordt ingevoerd met een fragment identifier (# met een id van een element)
// bijv. www.sinds1971.nl/fed/bolletjes/index.html#element3
// dan moet de carousel daar beginnen
function iniStartPosition() {
    // checken of er een fragment identifier (hash) is
    // en dan of er binnen de carousel een anchor met die ID is
if (location.hash && carousel.querySelector(location.hash)) {	
        // if so - dat element in beeld brengen
        goToUrlHash(location.hash, false);
    }
    else {
        // default starten bij het begin van de carousel
        let newElement = carouselElements[0];

        if (startElement == 1 || startElement == start) {
            // bij 1 of start  hoeft niets te veranderen
        }
        else if (startElement == end) {
            // bij end het laatste element opzoeken
            newElement = carouselElements[carouselElements.length - 1];
        }
        else if (startElement == center) {
            // bij center het aantal element door 2 delem en naar boven afronden
            let newElementNumber = Math.ceil(carouselElements.length / 2);
            newElement = carouselElements[newElementNumber - 1];
        }
        else if ( Number.isInteger(startElement)  &&  1 < startElement && startElement <= carouselElements.length) {
            newElement = carouselElements[startElement - 1];
        }

        scrollToElement(newElement, false);
    }
}


function goToUrlHash(theHash, user = true) {
    let newElement = document.querySelector(theHash);
    let deCaroCarousel = newElement.closest(".caroCarousel");

    // in de pagina naar de de carousel scrollen
    // dat vind ik gewenst gedrag (de gebruiker tikt expliciet de id van een element in)
    let carouselOffset = deCaroCarousel.offsetTop - scrollTop;

    document.documentElement.scrollTo({
        top: carouselOffset
    });

    // dan binnen de carousel naar het element scrollen
    scrollToElement(newElement, user);
}





/*********************/
/* ALGEMENE FUNCTIES */
/*********************/

// naar volgende/vorige element
// user = true --> gebruiker initieert (linkbuttons, pijltjes-toetsen, swipe)
// user = false --> systeem initieert (autoscroll)
function goToElement(direction, user = true) {
// console.log("go");

    // het huidige current element opzoeken
    let currentElement = carousel.querySelector(":scope > ul > .current");
    let newElement;

    if (direction == previous) {
        // het nieuwe element is het vorige broertje/zusje
        newElement = currentElement.previousElementSibling;
        // checken of nieuwe element bestaat - anders naar laatste
        if (!newElement) {
            newElement = carouselElementsContainer.lastElementChild;
        }
    } else {
        // het nieuwe element is het volgende broertje/zusje
        newElement = currentElement.nextElementSibling;
        // checken of nieuwe element bestaat - anders naar eerste
        if (!newElement) {
            newElement = carouselElementsContainer.firstElementChild;
        }
    }

    // previous/next linkbutton de focus geven
    if(linkButtonsOn && user) {
        carousel.querySelector(':scope > [href="'+direction+'"]').focus();
    }

    // naar het nieuwe element scrollen
    scrollToElement(newElement, user);
}


// scrollen naar nieuw element regelen
// user = true --> gebruiker initieert (linkbuttons, pijltjes-toetsen, swipe, url hack)
// user = false --> systeem initieert (autoscroll, bij laden pagina)
function scrollToElement(newElement, user = true) {
    // nieuwe element current element maken
    updateCurrentElement(newElement);

    // scrollLeft van de container aanpassen
    setScrollLeft(newElement);
    
    // de bolletjes updaten
    if(bolletjesOn) {
        updateBolletjes(newElement);
    }

    // auto-scroll stoppen als de gebruiker interactie heeft met de carousel
    if(autoScrollOn && user) {
        stopAutoScroll();
    }
}


// het daadwerkelijke scrollen
function setScrollLeft (newElement) {

    // de breedte van de container bepalen
    let carouselElementsContainerWidth = carouselElementsContainer.offsetWidth;

    // de breedte van het element bepalen
    let newElementWidth = newElement.offsetWidth;

    // de linker offset van het nieuwe element bepalen 
    let newElementOffset = newElement.offsetLeft;
    // als de container breder is dan het elemenet
    // de ruimte die aan weerzijde van het element aanwezig aftrekken van de offsetLeft
    // als de container en de elementen even breed zijn, dan verandert er hier niets
    newElementOffset -= (carouselElementsContainerWidth - newElementWidth) / 2;
    
    // de carousel naar de berekende positie scrollen
    carouselElementsContainer.scrollTo({
        left: newElementOffset
    });
}


// update current element
function updateCurrentElement(newElement) {
    // het huidige current element opzoeken
    let currentElement = carousel.querySelector(":scope > ul > .current");
    // als een element current is (niet zo na laden pagina)
    if (currentElement) {
        // de class current verwijderen
        removeClass("current", currentElement);
    }

    // de class current toevoegen
    addClass("current", newElement);
}


// update bolletjes
function updateBolletjes(newElement){
    // het huidige current bolletje opzoeken
    let currentBolletje = carousel.querySelector(":scope > nav .current");
    // als een bolletje current is (niet zo na laden pagina)
    if (currentBolletje) {
        // de class current verwijderen
        removeClass("current", currentBolletje);
    }
    
    // het nieuwe bolletje opzoeken
let newBolletje = carousel.querySelector("a[href='#"+newElement.id+"']");
    // de class current toevoegen
    addClass("current", newBolletje);
}





/**********************/
/* ADD/REMOVE CLASSES */
/**********************/

function addClass(theClass, element = carousel) {
    element.classList.add(theClass);
}

function removeClass(theClass, element = carousel) {
    element.classList.remove(theClass);
}

function setStyle(property, value, element = carousel) {
    element.style.setProperty(property, value);
}

function setAttribute(attribute, value, element = carousel) {
    element.setAttribute(attribute, value);
}

// https://davidwalsh.name/javascript-debounce-function
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};




// de ini function voor de carousel aanroepen
iniCarousel();
}











/***************************/
/* DE CAROUSELLEN CREËREN */
/***************************/

// nadat de pagina geladen is, de carousels activeren
(function() {

//opties:
// carouselID - verplicht

// bolletjesOn - default: false - boolean
// linkButtonsOn - default: false - boolean
// arrowKeysOn - default: false - boolean
// swipenOn - default: false - boolean
// autoScrollOn - default: false - boolean
// autoScrollInterval - default: 4000 - in ms

// elementWidth - default: 100% - percentage of afmeting
// startElement - default: 1 - integer of start, center, end

// scrollTop - default: 0 - in px    


const JustBut = new createCaroCaroussel({
    carouselID: "justLinkButtons",
    linkButtonsOn: true,
    scrollTop: 96,
    startElement: "center"
});

const JustBol = new createCaroCaroussel({
    carouselID: "justBolletjes",
    bolletjesOn: true,
    scrollTop: 96,
    startElement: "center"
});

const BolAndBut = new createCaroCaroussel({
    carouselID: "bolletjesAndLinkButtons",
    bolletjesOn: true,
    linkButtonsOn: true,
    scrollTop: 96
});

const BolAndKeys = new createCaroCaroussel({
    carouselID: "bolletjesAndArrowKeys",
    bolletjesOn: true,
    arrowKeysOn: true,
    scrollTop: 96
});

const BolAndSwipe = new createCaroCaroussel({
    carouselID: "bolletjesAndSwipen",
    bolletjesOn: true,
    swipenOn: true,
    scrollTop: 96
});

const Auto = new createCaroCaroussel({
    carouselID: "bolletjesAndAutoScroll",
    bolletjesOn: true,
    autoScrollOn: true,
    scrollTop: 96
});

const VisClues = new createCaroCaroussel({
    carouselID: "visualClues",
    bolletjesOn: true,
    elementWidth: "90%",
    scrollTop: 96,
    startElement: 5
});

const TwoEle = new createCaroCaroussel({
    carouselID: "twoElements",
    bolletjesOn: true,
    elementWidth: "50%",
    scrollTop: 96
});

const ThreeEle = new createCaroCaroussel({
    carouselID: "threeElements",
    bolletjesOn: true,
    elementWidth: "33.34%",
    scrollTop: 96
});

const FixWidth = new createCaroCaroussel({
    carouselID: "fixedWithElements",
    bolletjesOn: true,
    elementWidth: "10em",
    scrollTop: 96
});

const All = new createCaroCaroussel({
    carouselID: "everything",
    bolletjesOn: true,
    elementWidth: "24em",
    linkButtonsOn: true,
    arrowKeysOn: true,
    swipenOn: true,
    autoScrollOn: true,
    autoScrollInterval: 6000,
    scrollTop: 96,
    startElement: "start"
});

})();