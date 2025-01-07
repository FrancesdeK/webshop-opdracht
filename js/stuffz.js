let _url = "http://localhost/stuffz/php/all_data.php";

var _types = []; 
var _colors = [];
var _filters = []; 
var _articles = [];
var _allArticles = [];
var _myBasket = [];

let _filterCode = '';
let _selectedFiltersCode = '';
let _artikelCode = '';
let _artikelRijCode = '';
let _winkelwagenCode = '';

// true => gebruiken van html of js data
// false => gebruiken van database data
let _test = false;

//----------
// Wordt bij het laden van de pagina aangeroepen om alle artikelen op te halen van de server en 
//      bepaald welke soorten en welke kleuren deze artikelen hebben om deze als selectie-criteria
//      voor de filters toe te kunnen passen. Zorgt er ook voor dat een eventuele winkelmand, die nog 
//      besteld is weer wordt geladen.
//----------
async function initialize() {
  // haal de dynamische html-code uit de html-code
  _filterCode = getHTMLcode('artikelFilter');
  _selectedFiltersCode = getHTMLcode('gekozenFilters');
  _artikelCode = getHTMLcode('artikelen');
  _artikelRijCode = getHTMLcode('artikelRij');
  _winkelwagenCode = getHTMLcode('winkelwagen');
  
  // haal de artikelen op
  if (_test) 
  {
    // Hier loopt het via de testdata uit de javascript file
    if (_url.length > 0) {
      _articles = getArticles();
    }
    _allArticles = getAllArticles();
  }
  else 
  {
    // Hier loopt het via de database
    if (_url.length > 0) {
      _articles = await getData(_url);
    }
    _allArticles = await getData('http://localhost/stuffz/php/all_data.php');
  }
  
  // bepaal de soorten en kleuren waarop gefilterd kan worden
  for (let i = 0; i<_articles.length; i++) {
   // voeg het soort toe aan de types-array als deze daarin nog niet aanwezig is
    if (_types.indexOf(_articles[i].type) < 0) {
      _types.push(_articles[i].type);
    }
    // voeg de kleur soort toe aan de colors-array als deze daarin nog niet aanwezig is
    if (_colors.indexOf(_articles[i].color) < 0) {
      _colors.push(_articles[i].color);
    }
  }
  if (_filterCode.length > 0 ) {
    let filters = '';
    // Creeer de HTML-code voor de filter opties voor soorten
    if (_types.length > 0) {
      filters += '<ul><b>Soort</b>'
      
      for (let i = 0; i < _types.length; i++) {
        filters += _filterCode.replace(/@item@/gi, _types[i]);
      }
      filters += '</ul>'
    }
    // Creeer de HTML-code voor de filter opties voor kleuren
    if (_colors.length > 0) {
      filters += '<ul><b>Kleur</b>'
      
      for (let i = 0; i < _colors.length; i++) {
        filters += _filterCode.replace(/@item@/gi, _colors[i]);
      }
      filters += '</ul>'
      
      this.document.getElementById('artikelFilter').innerHTML = filters;
    }
  }
  // Maak - als dat van toepassing is - de nog niet bestelde winkelmand aan
  restoreBasketFromLocalStorage();
  // Toon de artikelen
  displayArticles();
}

//----------
// Haalt de HTML-code uit een HTML-element en  verwijderd eventuele commentaar regels
//----------
function getHTMLcode(elementId) {
  let code = '';
  // Haal de code van het HTML-element op
  if (this.document.getElementById(elementId) != undefined) {
    code = this.document.getElementById(elementId).innerHTML;
    // Verwijder de HTML-commentaar tekens
    code = code.replace('<!--', '');
    code = code.replace('-->', '');
  }
  
  return code;
}

//----------
// Haalt alle artikelen op bij van de server
//----------
async function getData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    return json.articles;
    
  } catch (error) {
    console.error(error.message);
  }
}

//----------
// Past het filter aan obv het opgeven iten (welke wordt toegevoegd of verwijderd afhankelijk of dit item wel of niet in de filters-array zit)
//----------
function setFilter(item) {
  // Haal de checkbox op van het gekozen item
  const chkbox = this.document.getElementById('filter_' + item);
  
  // Bepaal of het gekozen item al was gekozem
  if (_filters.indexOf(item) < 0) {
    // Item was nog niet gekozen: voeg het toe aan de array met filter items en check de checkbox
    _filters.push(item);
    chkbox.checked = true;
  }
  else {
    // Item was al niet gekozen: verwijder het uit de array met filter items en uncheck de checkbox
    let index = _filters.indexOf(item);
    
    if (index >= 0) {
      _filters.splice(index, 1);
    }
    chkbox.checked = false;
  }
  // Toon de gekozen filter
  let code = '';
  
  if (_filters.length > 0) {
    for (var i = 0; i < _filters.length; i++) {
      code += _selectedFiltersCode.replace(/@item@/gi, _filters[i]);
    }
  }
  this.document.getElementById('gekozenFilters').innerHTML = code;
  // Toon de artikelen (die voldoen aan de gekozen filters)
  displayArticles();
}

//----------
// Toont alle artikelen (obv van de gekozen filters)
//----------
function displayArticles() {
  // Haal alle artikelen op die voldoen aan de gekozen filters
  const articles = getFilteredArticles();
  // Toon de artikelen
  displayArticleList(articles);
}
  
//----------
// Toont alle artikelen (obv van de aangeleverde array)
//----------
function displayArticleList(articles) {
  let code = ''; 
  
  if (articles.length > 0) { 
    // Sorteer de artikelen
    sortArticles(articles);
    
    // Genereer de code voor de artikelen
    for (let i = 0; i < articles.length; i++) {    
      const article = articles[i];
      
      let articleCode = _artikelCode.replace(/@artikel@/gi, article.name);
      articleCode = articleCode.replace(/@image@/gi, article.image);
      articleCode = articleCode.replace(/@soort@/gi, article.type);
      articleCode = articleCode.replace(/@kleur@/gi, article.color);
      articleCode = articleCode.replace(/@prijs@/gi, article.price);
      articleCode = articleCode.replace(/@artikel_id@/gi, article.id);
      
      code += articleCode;
    }
  }
  // Toon de artikelen
  if (code.length > 0) {
    this.document.getElementById('artikelen').innerHTML = code;
  }
  else {
    this.document.getElementById('artikelen').innerHTML = '<div class=\"col-3 col-s-4\">Er zijn geen artikelen gevonden</div>;'
  }
}

//----------
// Bepaald welke filter items gekozen en geeft een array terug met de artikelen die aan deze gekozen filter items voldoen
//----------
function getFilteredArticles() {
  const articles = [];
  // Bepaal op welke soorten en kleurein is gefilterd
  const typesFilter = getTypeFilters();
  const colorFilter = getColorFilters();
  
  if (_filters.length == 0) {
    // Geen filters: toon alle artikelen
    for (let a = 0; a <_articles.length; a++) {
      articles.push(_articles[a]);
    }
  }
  else {
    // Vind alle artikelen die aan de gekozen filters voldoen
    for (let a = 0; a <_articles.length; a++) {
      const article = _articles[a];
      
      hasType = false;
      hasColor = false;
      // Controleer of er op soort is gefilterd en zo ja, of het artikel van deze soort is
      if (typesFilter.length == 0 || typesFilter.indexOf(article.type) >= 0) {
        hasType = true;
      }
      // Controleer of er op kleur is gefilterd en zo ja, of het artikel deze kleur heeft
      if (colorFilter.length == 0 || colorFilter.indexOf(article.color) >= 0) {
        hasColor = true;
      }
      // Voeg het artikel toe als deze voldoet aan de filters op type en kleur
      if (hasType && hasColor) {
        articles.push(article);
      }
    }
  }
  // Toon het aantal getoonde artikelen 
  this.document.getElementById('aantalArtikelen').innerHTML = articles.length;
  
  return articles; 
}

//----------
// Geeft een array met alle gekozen soorten als filter
//----------
function getTypeFilters() {
  const types = [];
  // Zoek de filters op type
  for (let i = 0; i <_types.length; i++) {
    if (_filters.indexOf(_types[i]) >= 0) {
      types.push(_types[i]);
    }
  }
  return types;
}  

//----------
// Geeft een array met alle gekozen kleuren als filter
//----------
function getColorFilters() {
  const colors = [];
  // Zoek de filters op color
  for (let i = 0; i <_colors.length; i++) {
    if (_filters.indexOf(_colors[i]) >= 0) {
      colors.push(_colors[i]);
    }
  }
  return colors;
}  

//----------
// Sorteert de array met artikelen volgens de sortering die is gekozen in het "Sorteer op" veld
//----------
function sortArticles(articles) {
  // Bepaal de gekozen sortering
  sort = this.document.getElementById('sortering').value;
  
  if (sort == 'Prijs (laag-hoog)') {
    // Sorteer de artikelen-array op prijs van laag naar hoog
    articles.sort(function(a, b){return a.price - b.price});
  }
  else if (sort == 'Prijs (hoog-laag)') {
    // Sorteer de artikelen-array op prijs van hoog naar laag
    articles.sort(function(a, b){return b.price - a.price});
  }
  else if (sort == 'Soort') {
    // Sorteer de artikelen-array op soort (alfabetisch)
    articles.sort(function(a, b){
      let x = a.type.toLowerCase();
      let y = b.type.toLowerCase();
      if (x < y) {return -1;}
      if (x > y) {return 1;}
      return 0;
    });
  }
  else if (sort == 'Kleur') {
    // Sorteer de artikelen-array op kleur (alfabetisch)
    articles.sort(function(a, b){
      let x = a.color.toLowerCase();
      let y = b.color.toLowerCase();
      if (x < y) {return -1;}
      if (x > y) {return 1;}
      return 0;
    });
  }
}

//----------
// Maak een nieuw orderLine object
//----------
function OrderLine (articleId, amount) {
  this.articleId = articleId;
  this.amount = amount;
}

//----------
// Voegt een artikel toe aan de winkemand
//----------
function addToBasket(articleId, amount) {
  let hasArticle = false;
  // Controleer of het artikel al in de winkelmand aanwezig is
  for (let i = 0; i < _myBasket.length; i++) {
    const orderLine = _myBasket[i];
    
    if (orderLine.articleId == articleId) {
      // Hoog het aantal van een bestaand artikel op met het opgegeven hoeveelheid
      orderLine.amount += amount;
      // Onthoud dat het artikel al in de winkelmand aanwezig is
      hasArticle = true;
      
      break;
    }
  }
  if (!hasArticle && amount > 0) {
    // Voeg een nieuwe artikel toe aan de winkelmand met de opgegeven hoeveelheid
    _myBasket.push(new OrderLine(articleId, amount));
  }
  // Werk de HTML-code van winkelmand bij
  generateBasket();
}

//----------
// Past de winkelmand aan met de opgegeven hoeveelheid van een artikel
//----------
function updateBasket(articleId, amount) {
  let hasArticle = false;
  // Controleer of het artikel al in de winkelmand aanwezig is
  for (let i = 0; i < _myBasket.length; i++) {
    const orderLine = _myBasket[i];
    
    if (orderLine.articleId == articleId) {
      if (amount > 0) {
        // Pas de hoeveelheid van een bestaand artikel in de winkelmand aan met de opgegeven hoeveelheid
        orderLine.amount = amount;
      }
      else {
        // Verwijder het artikel uit de winkelmand als de opgegeven hoeveelheid nul is
        _myBasket.splice(i, 1);
      }
      // Onthoud dat het artikel bestaat in de winkelmand
      hasArticle = true;
      
      break;
    }
  }
  if (!hasArticle && amount > 0) {
    // Voeg een nieuwe artikel toe aan de winkelmand met de opgegeven hoeveelheid (als deze groter dan nul is)
    _myBasket.push(new OrderLine(articleId, amount));
  }
  // Werk de HTML-code van winkelmand bij
  generateBasket();
}

//----------
// Past de HTML-code van de winkelmand bij
//----------
function generateBasket() {
  let code = '';
  let totalPrice = 0;
  let numberOfArticles = 0;
  
  if (_myBasket.length > 0) {
    // Behandel all artikelen in de winkelmand
    for (let i = 0; i < _myBasket.length; i++) {
      const orderLine = _myBasket[i];
      
      numberOfArticles += 1;
      // Zoek het artikel in de artikelen array
      for (let a = 0; a < _allArticles.length; a++) {
        const article = _allArticles[a];
        
        if (article.id == orderLine.articleId) {
          // Brereken de totaal prijs voor het artikel (aantal x prijs per stuk)
          let price = article.price * orderLine.amount;
          // Maak de HTML code voor het artikel
          let articleCode = _artikelRijCode.replace(/@artikel@/gi, article.name);
          
          articleCode = articleCode.replace(/@image@/gi, article.image);
          articleCode = articleCode.replace(/@prijs@/gi, article.price.toLocaleString('nl-NL', {minimumFractionDigits: 2}));
          articleCode = articleCode.replace(/@artikel_id@/gi, article.id);
          articleCode = articleCode.replace(/@aantal@/gi, orderLine.amount);
          articleCode = articleCode.replace(/@artikel_prijs@/gi, price.toLocaleString('nl-NL', {minimumFractionDigits: 2}));
          articleCode = articleCode.replace(/@volgnummer@/gi, numberOfArticles);
          
          code += articleCode;
          // Voeg toe aan de totaalprijs
          totalPrice += price;
        }
      }
    }
  }
  // Maak de HTML code af
  if (numberOfArticles > 0) {
    // Code als er artikelen in de winkelmand zitten
    code = _winkelwagenCode.replace(/@artikel_lijst@/gi, code);
    code = code.replace(/@totaalprijs@/gi, totalPrice.toLocaleString('nl-NL', {minimumFractionDigits: 2}));            
  }
  else {
    // Code als er geen artikelen in de winkelmand zitten
    code = 'Jouw winkelmand is nog leeg';
  }
  // Zet de HTML-code voor de winkelmand en werk het aantal artikelen in de winkelmand bij
  this.document.getElementById('winkelwagen').innerHTML = code;
  this.document.getElementById('aantalInWinkelwagen').innerHTML = numberOfArticles;
  // Sla de inhoud van de winkewagen op in de local store van de browser
  storeBasketInLocalStorage();
}

//----------
// Toont de winkelmand of verbergt deze
//----------
function toggleBasket() {
  basket = this.document.getElementById('basket');
  // Controleer of de winkelmand zichtbaar is
  if (basket.style.display.length == 0 || basket.style.display == 'none') {
    // Toon de winkelmand
    basket.style.display = 'block';
  }
  else {
    // Verberg de winkelmand
    basket.style.display = 'none';
  }
}

//----------
// Slaat de winkelmand op in de local store (voor later gebruik of om te zorgen dat de winkelmand niet leeg is 
//      als de gebruiker naar een andere pagina gaat en daarna weer terugkomt)
//----------
function storeBasketInLocalStorage(){
  localStorage.clear(); 
  
  if (_myBasket.length > 0) {
    localStorage.setItem("stuffzBasket", JSON.stringify(_myBasket));
  }
}

//----------
// Haalt de winkelmand op uit de local store en genereeert de HTML-code voor deze winkelmand
//----------
function restoreBasketFromLocalStorage(){
  let basket = localStorage.getItem("stuffzBasket");
  
  if (basket != null) {
    if (basket.length > 0 ) {
        _myBasket = JSON.parse(basket);
    }
  }
  generateBasket();
}

//----------
// Zoekt of de tekst in het zoekveld voorkomt in de naam. soort of kleur van de artikeleb
//----------
function search() {
  const articles = [];
  // Haal de zoekterm op en tranformeer deze naar kleine letters
  let text = this.document.getElementById('zoekenOp').value;
  text = text.trim().toLowerCase();
  
  if (text.length > 0) {
      // zoek in alle artikelen of de zoektermn voorkomt in de naam, soort of kleur
    for (let i = 0; i < _allArticles.length; i++) {
      const article = _allArticles[i];
      
      if (article.name.toLowerCase().includes(text) || article.type.toLowerCase().includes(text) || article.color.toLowerCase().includes(text)) {
        articles.push(article);
      }            
    }
    // Toon de gevonden artikelen
    displayArticleList(articles);
   }
}