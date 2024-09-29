
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


// https://chatgpt.com/share/66f8bc06-4bd0-8012-ae29-b51d49013bc0 chat gpt gevraagd om al mijn oude code te verwijderen
// geprobeerd zelf eerst uit te zoeken waarom het niet meer werkte via de bestaande links. na een paar uur heb ik dat opgegeven en
// hem van een 900 regels java een korte versie te maken. 

  function createCaroCaroussel({
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
}) {
    let carousel,
        carouselElementsContainer,
        carouselElements;

    let autoScrollTimer;

    let previous = "previous",
        next = "next";

    function iniCarousel() {
        carousel = document.querySelector("#" + carouselID);
        if (carousel) {
            carouselElementsContainer = carousel.querySelector(":scope > ul");
            if (carouselElementsContainer) {
                carouselElements = carouselElementsContainer.querySelectorAll(":scope > li");
                if (carouselElements.length > 1) {
                    iniCarouselInteration();
                }
            }
        }
    }

    function iniCarouselInteration() {
        let interactionIniArray = [];

        if (linkButtonsOn) interactionIniArray.push(iniLinkButtons);
        if (arrowKeysOn) interactionIniArray.push(iniArrowKeys);
        if (swipenOn) interactionIniArray.push(iniSwipen);
        if (bolletjesOn) interactionIniArray.push(iniBolletjes);
        if (autoScrollOn) interactionIniArray.push(iniAutoScroll);

        interactionIniArray.push(iniStartPosition);

        if (interactionIniArray.length >= 1) {
            for (let i = 0; i < carouselElements.length; i++) {
                carouselElements[i].id = carouselID + i;
            }

            interactionIniArray.forEach(fn => fn());
        }
    }

    function iniBolletjes() {
        function addBolletjes() {
            let bolletjesHTML = "";
            for (let carouselElement of carouselElements) {
                bolletjesHTML += `<li><a href="#${carouselElement.id}" aria-label="Ga naar ${carouselElement.id}"></a></li>`;
            }
            bolletjesHTML = `<nav><ul>${bolletjesHTML}</ul></nav>`;
            carousel.insertAdjacentHTML('beforeend', bolletjesHTML);
            activateBolletjes();
        }

        function activateBolletjes() {
            let bolletjes = carousel.querySelectorAll(":scope > nav a");
            for (let bolletje of bolletjes) {
                bolletje.addEventListener("click", function (e) {
                    e.preventDefault();
                    let newElement = carousel.querySelector(this.hash);
                    scrollToElement(newElement);
                });
            }
        }

        addBolletjes();
    }

    function iniArrowKeys() {
        function activateArrowKeys() {
            carousel.addEventListener('keydown', function (e) {
                if (e.code == "ArrowLeft") {
                    e.preventDefault();
                    goToElement(previous);
                } else if (e.code == "ArrowRight") {
                    e.preventDefault();
                    goToElement(next);
                }
            });
        }
        activateArrowKeys();
    }

    function iniSwipen() {
        let touchstartX = 0;
        let touchendX = 0;

        function activateSwipen() {
            carousel.addEventListener('touchstart', function (e) {
                touchstartX = e.changedTouches[0].screenX;
            });

            carousel.addEventListener('touchend', function (e) {
                touchendX = e.changedTouches[0].screenX;
                handleGesture();
            });
        }

        function handleGesture() {
            let deltaX = touchendX - touchstartX;
            if (Math.abs(deltaX) > 30) {
                if (deltaX > 0) {
                    goToElement(previous);
                } else {
                    goToElement(next);
                }
            }
        }

        activateSwipen();
    }

    function iniStartPosition() {
        let newElement = carouselElements[0];
        scrollToElement(newElement);
    }

    function goToElement(direction) {
        let currentElement = carousel.querySelector(":scope > ul > li.current");
        let newElement;

        if (direction === previous) {
            newElement = currentElement.previousElementSibling || carouselElements[carouselElements.length - 1];
        } else {
            newElement = currentElement.nextElementSibling || carouselElements[0];
        }

        scrollToElement(newElement);
    }

    function scrollToElement(newElement) {
        // Verander hier de huidige element styling en scrol naar het nieuwe element
        const currentElement = carousel.querySelector(":scope > ul > li.current");
        if (currentElement) currentElement.classList.remove('current');
        newElement.classList.add('current');
        carouselElementsContainer.scrollTo({
            left: newElement.offsetLeft,
            behavior: 'smooth'
        });
    }

    // Initialiseer de carousel
    iniCarousel();
}

// Roep de functie aan met de juiste parameters
createCaroCaroussel({
    carouselID: "bolletjesAndSwipen",
    bolletjesOn: true,
    arrowKeysOn: true,
    swipenOn: true,
    autoScrollOn: false,
});