
//Keywords
var keywordsFileName = "keywords.json"
var keywordsArr;

//Recipes
var recipesFileName = "recipes.json"
var recipes;

//World Cloud - Chart
var chart;

//Page load events
window.addEventListener('load', function() {

  //Load keywords
  loadKeywords()

  //Format keywordsArr
  formatKeywords()

  //Create a word cloud
  chart = anychart.tagCloud(keywordsArr);

  //Format world cloud
  formatWordCloud()

  //Display the word cloud chart
  chart.container("wordCloudWords");
  chart.draw();

  //Add listener - Add 'clicked' word to search terms
  chart.listen("pointClick", function(e){
    ingredient = e.point.get("x")
    addIngredient(ingredient)
  });

  //Load recipies & populate recipe cards
  loadRecipes()

  //Tie the Filter button to a function
  document.getElementById("filterButton").addEventListener("click", filterCards);
  document.getElementById("clearButton").addEventListener("click", clearSearchTerms);
});

//Refresh background
function updateBackground(){
  document.body.style.background = "linear-gradient(151deg, rgba(34, 193, 195, 0.8547794117647058) 0%, rgba(253, 187, 45, 0.8911939775910365) 100%)";
}


/*
  Filters cards based off search terms/word cloud.
*/
function filterCards(){
  //Get search terms from filterTerms. Dump into list
  var searchTerms = document.getElementById("filterTerms").placeholder;
  var patternTerms = buildRegexQuery(searchTerms)

  //Create regex for terms - ignore case
  var regexPattern = new RegExp(patternTerms, 'gim')

  //Get list by ID
  var recipeIDs = Object.keys(recipes)

  //Loop through each recipes[ingredients] for search terms
  recipeIDs.forEach( function(item, i){
    //console.log(recipes[item]['ingredients']);

    ingredientsToSearch = recipes[item]['ingredients']
    ingredientsToSearch = ingredientsToSearch.replace(/\n/g,' ');

    //Search terms in Ingredients
    if ( ingredientsToSearch.match(regexPattern) ){
      //Add card to list
      addCard(item)
    } else {
      //Remove card from list
      removeCard(item)
    }
    updateBackground()

  });
}


function buildRegexQuery(termStr){
  //Remove any spaces at the end
  termStr = termStr.trim()

  //Another attempt to remove characters at the end
  termStr = termStr.replace(/[ |\t|\s]+$/gm, '');

  terms = termStr.split(" ");

  var pattern = "^";

  for(var i=0; i < terms.length; i++){
      pattern += "(?=.*\\b";
      pattern += terms[i];
      pattern += "\\b)";
  }
  pattern += ".+";
  return pattern;
}

function removeCard(id){
  if (document.contains(document.getElementById(id))) {
    document.getElementById(id).remove();
  }
}

function addCard(id){
  if (document.contains(document.getElementById(id)) == false) {
    buildRecipeCard(id)
  }

}

//Builds the individual card in HTML
function buildRecipeCard(id){

  rName = recipes[id]['name']
  rIngredients = recipes[id]['ingredients']
  rDirections = recipes[id]['directions']
  rNotes = recipes[id]['notes']
  rID = id

  var htmlToAdd = `<div class="recipe-card p-1 my-flex-item" id="${rID}">
    <aside>
      <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/203277/oatmeal.jpg" alt="Chai Oatmeal" />
    </aside>

    <article>
      <h2>${rName}</h2>
      <h3>Drank</h3>

      <p class="ingredients"><span>Ingredients: </span>${rIngredients}</p>
      <p class="ingredients"><span>Directions: </span>${rDirections}</p>
    </article>
  </div>`

  var div = document.getElementById('recipes');
  div.innerHTML += htmlToAdd;
}

//Takes entire dictionary of recipes
function buildRecipeCards(){
  //Loop through JSON by getting the keys (number)
  var recipeIDs = Object.keys(recipes)

  recipeIDs.forEach( function(item, i){
    buildRecipeCard(item);
  });
}

/*
 Loads recipes from external file. Calls function to build cards in html.
 I believe this has to be this way because of race conditions.
*/
function loadRecipes(){
  $.ajax({
    dataType: "json",
    url: recipesFileName,

    success: function(response, status, xhr){
      //console.log(status)
      recipes = response;

      //Build cards based on entire dict
      buildRecipeCards()
    }
  });
}

function formatWordCloud(){
  chart.background().fill('white', 0.3)
  chart.background().cornerType("round");
  chart.background().corners(10);

  chart.tooltip(false);

  chart.angles([0, 90])
}

/*
  Format the keywords for the world cloud.
*/
function formatKeywords(){
  keywordsArr = [
    {"x": "Gin", "value": 1, category: "Base-spirit"},
    {"x": "Rum", "value": 1, category: "Base-spirit"},
    {"x": "Vodka", "value": 1, category: "Base-spirit"},
    {"x": "Champange", "value": 1, category: "Base-spirit"},
    {"x": "Whiskey", "value": 1, category: "Base-spirit"},
    {"x": "Vermouth", "value": 2, category: "Aperitif"},
    {"x": "Cherry Herring", "value": 2, category: "Aperitif"},
    {"x": "Ferrnet", "value": 2, category: "Aperitif"},
    {"x": "Amaro", "value": 2, category: "Aperitif"},
    {"x": "Campari", "value": 2, category: "Aperitif"},
    {"x": "Lime", "value": 3, category: "Citrus"},
    {"x": "Lemon", "value": 3, category: "Citrus"},
    {"x": "Grapefruit", "value": 3, category: "Citrus"},
  ];
}

function addIngredient(word){
  //console.log(word)
  word = word + " "
  document.getElementById("filterTerms").placeholder += word;
}

function clearSearchTerms(){
  document.getElementById("filterTerms").placeholder = "";

  buildRecipeCards()
}

/*
  Load the keywords from a csv file to var keywordsArr
*/
function loadKeywords(){
  $.ajax({
	  type: "GET",
	  url: keywordsFileName,
	  dataType: "text",
	  success: function(response){
      var keywordsArr = parseCSV(response);
    }
	});
}

function parseCSV(str) {
    var arr = [];
    var quote = false;  // 'true' means we're inside a quoted field

    // Iterate over each character, keep track of current row and column (of the returned array)
    for (var row = 0, col = 0, c = 0; c < str.length; c++) {
        var cc = str[c], nc = str[c+1];        // Current character, next character
        arr[row] = arr[row] || [];             // Create a new row if necessary
        arr[row][col] = arr[row][col] || '';   // Create a new column (start with empty string) if necessary

        // If the current character is a quotation mark, and we're inside a
        // quoted field, and the next character is also a quotation mark,
        // add a quotation mark to the current column and skip the next character
        if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }

        // If it's just one quotation mark, begin/end quoted field
        if (cc == '"') { quote = !quote; continue; }

        // If it's a comma and we're not in a quoted field, move on to the next column
        if (cc == ',' && !quote) { ++col; continue; }

        // If it's a newline (CRLF) and we're not in a quoted field, skip the next character
        // and move on to the next row and move to column 0 of that new row
        if (cc == '\r' && nc == '\n' && !quote) { ++row; col = 0; ++c; continue; }

        // If it's a newline (LF or CR) and we're not in a quoted field,
        // move on to the next row and move to column 0 of that new row
        if (cc == '\n' && !quote) { ++row; col = 0; continue; }
        if (cc == '\r' && !quote) { ++row; col = 0; continue; }

        // Otherwise, append the current character to the current column
        arr[row][col] += cc;
    }
    return arr;
}
