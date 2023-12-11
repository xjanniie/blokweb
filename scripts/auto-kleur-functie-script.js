// gekozen voor 2 scripts omdat het niet mogelijk was om 

document.addEventListener('DOMContentLoaded', function() {
    console.log("Hallo en welkom bij Ekris BMW");
  
    var kleuren = ['bmw-7-series-i7-kleurafbeelding-blue.png', 'bmw-7-series-i7-kleurafbeelding-green.png', 'bmw-7-series-i7-kleurafbeelding-pink.png', 'bmw-7-series-i7-kleurafbeelding-red.png'];
  
    var aantalKleuren = kleuren.length;
    console.log("Er zijn totaal: " + aantalKleuren + " verschillende kleuren");
  
    var btnKleur = document.querySelector("#random_kleur")
  
    btnKleur.onclick = btnActie;
  
    function btnActie() {
        var willekeurigeWaarde = Math.random();
  
        //lengte
        willekeurigeWaarde *= kleuren.length;
  
        //afronden
        willekeurigeWaarde = Math.floor(willekeurigeWaarde);
        var kleurAfbeelding = kleuren[willekeurigeWaarde];
        console.log('de willekeurige waarde die is toegekend is: ' + willekeurigeWaarde);
  
        //print
        console.log("Gekregen kleur nummer: " + kleuren[willekeurigeWaarde])
        document.getElementById("auto").src = 'images/' + kleurAfbeelding;
    }
}
);