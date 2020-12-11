
//Keywords
var keywordsFileName = "keywords.json"
var keywordsArr;

//Recipes
var recipesFileName = "recipes.json"
var recipes;

//World Cloud - Chart
var chart;

//Track filter terms
var filterTermsOld;

//Page load events
window.addEventListener('load', function() {

  //Load keywords - Not working!
  loadKeywords()

  //Format keywordsArr
  formatKeywords()

  //Create a word cloud
  chart = anychart.tagCloud(keywordsArr);

  //Format world cloud
  formatWordCloud()

  // create and configure a color scale.
  var customColorScale = anychart.scales.ordinalColor();
  customColorScale.colors(["#00b8e6", "#e6b800", "#ff4d4d", "#418c53", "#7737ab", "#2e2e2e"]);

  // set the color scale as the color scale of the chart
  chart.colorScale(customColorScale);

  // add a color range
  chart.colorRange().enabled(true);

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
function formatKeywords(data){

  keywordsArr = [{"x": "bourbon rye whiskey", "value": "1", "category": "alcohol"}, {"x": "Cointreau orange liqueur", "value": "1", "category": "liqueur"}, {"x": "sweet vermouth", "value": "1", "category": "spices_and_herbs"}, {"x": "squeezed lemon juice", "value": "1", "category": "fruit"}, {"x": "maraschino liqueur", "value": "1", "category": "liqueur"}, {"x": "grapefruit juice", "value": "1", "category": "fruit"}, {"x": "lime juice", "value": "1", "category": "fruit"}, {"x": "simple syrup", "value": "1", "category": "sweeteners"}, {"x": "grapefruit juice", "value": "1", "category": "fruit"}, {"x": "lemon juice", "value": "1", "category": "fruit"}, {"x": "Campari", "value": "1", "category": "alcohol"}, {"x": "simple syrup gin", "value": "1", "category": "alcohol"}, {"x": "sweet vermouth", "value": "1", "category": "spices_and_herbs"}, {"x": "dry vermouth", "value": "1", "category": "liqueur"}, {"x": "orange bitters bourbon", "value": "1", "category": "spices_and_herbs"}, {"x": "dry hard cider", "value": "1", "category": "alcohol"}, {"x": "ginger beer", "value": "1", "category": "alcohol"}, {"x": "Angostura bitters", "value": "1", "category": "alcohol"}, {"x": "Fresh lemon juice", "value": "1", "category": "fruit"}, {"x": "Simple syrup", "value": "1", "category": "sweeteners"}, {"x": "Huckleberry Shrub", "value": "1", "category": "fruit"}, {"x": "Egg white", "value": "1", "category": "fruit"}, {"x": "Huckleberries", "value": "1", "category": "unknown"}, {"x": "Cider vinegar", "value": "1", "category": "fruit"}, {"x": "Sugar gin", "value": "1", "category": "alcohol"}, {"x": "orgeat", "value": "1", "category": "sweeteners"}, {"x": "lemon juice", "value": "1", "category": "fruit"}, {"x": "Bitters blanco tequila", "value": "1", "category": "alcohol"}, {"x": "Kahlua Coffee Liqueur", "value": "1", "category": "liqueur"}, {"x": "fresh grapefruit juice", "value": "1", "category": "fruit"}, {"x": "fresh lime juice", "value": "1", "category": "fruit"}, {"x": "Cholula hot sauce", "value": "1", "category": "fruit"}, {"x": "Campari", "value": "1", "category": "alcohol"}, {"x": "Lemon Juice", "value": "1", "category": "fruit"}, {"x": "Orange Juice", "value": "1", "category": "fruit"}, {"x": "Espresso", "value": "1", "category": "alcohol"}, {"x": "Barspoons Dulce de Leche", "value": "1", "category": "unknown"}, {"x": "pineapple juice", "value": "1", "category": "fruit"}, {"x": "vodka", "value": "1", "category": "alcohol"}, {"x": "grenadine Ginger Beer", "value": "1", "category": "alcohol"}, {"x": "Bourbon", "value": "1", "category": "alcohol"}, {"x": "Blackberry Cordial", "value": "1", "category": "spices_and_herbs"}, {"x": "Lime Juice", "value": "1", "category": "fruit"}, {"x": "cherry liqueur", "value": "1", "category": "liqueur"}, {"x": "honey syrup limes", "value": "1", "category": "fruit"}, {"x": "caster sugar", "value": "1", "category": "sweeteners"}, {"x": "pisco", "value": "1", "category": "alcohol"}, {"x": "honey real maple syrup", "value": "1", "category": "alcohol"}, {"x": "vanilla extract", "value": "1", "category": "fruit"}, {"x": "ground nutmeg", "value": "1", "category": "fruit"}, {"x": "cold coffee espresso", "value": "1", "category": "alcohol"}, {"x": "dark rum Kahl\u00faa", "value": "1", "category": "alcohol"}, {"x": "cinnamon sugar rimming Pisco", "value": "1", "category": "sweeteners"}, {"x": "Aperol", "value": "1", "category": "alcohol"}, {"x": "Fresh Lemon Juice", "value": "1", "category": "fruit"}, {"x": "Simple Syrup", "value": "1", "category": "sweeteners"}, {"x": "Egg White", "value": "1", "category": "fruit"}, {"x": "Campari", "value": "1", "category": "alcohol"}, {"x": "Demerara syrup", "value": "1", "category": "alcohol"}, {"x": "Fresh pineapple juice", "value": "1", "category": "fruit"}, {"x": "Fresh lime juice", "value": "1", "category": "fruit"}, {"x": "mint leaves", "value": "1", "category": "fruit"}, {"x": "Pisco", "value": "1", "category": "alcohol"}, {"x": "blackberries", "value": "1", "category": "fruit"}, {"x": "St Germain Elderflower Liqueur", "value": "1", "category": "liqueur"}, {"x": "Large Marshmallows", "value": "1", "category": "unknown"}, {"x": "Nutella", "value": "1", "category": "unknown"}, {"x": "Marshmallow NutellaInfused Scotch", "value": "1", "category": "alcohol"}, {"x": "Snap Cordial liquer", "value": "1", "category": "alcohol"}, {"x": "Blackstrap Rum", "value": "1", "category": "alcohol"}, {"x": "grapefruit wedge", "value": "1", "category": "fruit"}, {"x": "fresh grapefruit juice", "value": "1", "category": "fruit"}, {"x": "fresh lime juice", "value": "1", "category": "fruit"}, {"x": "sugar", "value": "1", "category": "sweeteners"}, {"x": "mescal tequila", "value": "1", "category": "alcohol"}, {"x": "club soda Cynar", "value": "1", "category": "alcohol"}, {"x": "Montenegro", "value": "1", "category": "spices_and_herbs"}, {"x": "fresh juice limes", "value": "1", "category": "fruit"}, {"x": "ginger beer taste", "value": "1", "category": "alcohol"}, {"x": "Lime wheel two Chai", "value": "1", "category": "fruit"}, {"x": "half half", "value": "1", "category": "spices_and_herbs"}, {"x": "water", "value": "1", "category": "sweeteners"}, {"x": "Turbinado sugar", "value": "1", "category": "sweeteners"}, {"x": "dry vermouth", "value": "1", "category": "liqueur"}, {"x": "maraschino liqueur", "value": "1", "category": "liqueur"}, {"x": "honey", "value": "1", "category": "fruit"}, {"x": "fresh lime juice", "value": "1", "category": "fruit"}, {"x": "gin", "value": "1", "category": "alcohol"}, {"x": "fresh lime juice", "value": "1", "category": "fruit"}, {"x": "Benedictine", "value": "1", "category": "alcohol"}, {"x": "chilled club soda", "value": "1", "category": "alcohol"}, {"x": "Angostura bitters", "value": "1", "category": "alcohol"}, {"x": "Mint", "value": "1", "category": "fruit"}, {"x": "vodka", "value": "1", "category": "alcohol"}, {"x": "fresh lime juice", "value": "1", "category": "fruit"}, {"x": "Ginger beer blackberries", "value": "1", "category": "fruit"}, {"x": "fresh mint leaves", "value": "1", "category": "fruit"}, {"x": "simple syrup", "value": "1", "category": "sweeteners"}, {"x": "high quality gin", "value": "1", "category": "alcohol"}, {"x": "tonic water", "value": "1", "category": "sweeteners"}, {"x": "Casamigos Reposado Tequila", "value": "1", "category": "alcohol"}, {"x": "fresh lemon juice", "value": "1", "category": "fruit"}, {"x": "fresh pink grapefruit juice", "value": "1", "category": "fruit"}, {"x": "agave nectar", "value": "1", "category": "spices_and_herbs"}, {"x": "Fresh Lime Juice", "value": "1", "category": "fruit"}, {"x": "Raspberry Syrup", "value": "1", "category": "alcohol"}, {"x": "Ginger Beer top", "value": "1", "category": "alcohol"}, {"x": "Fresh Raspberries rye whiskey", "value": "1", "category": "fruit"}, {"x": "lemon juice", "value": "1", "category": "fruit"}, {"x": "blackberry jam", "value": "1", "category": "fruit"}, {"x": "pinch salt lemon", "value": "1", "category": "fruit"}, {"x": "gin", "value": "1", "category": "alcohol"}, {"x": "fresh lemon juice", "value": "1", "category": "fruit"}, {"x": "simple syrup", "value": "1", "category": "sweeteners"}, {"x": "Lemon Juice", "value": "1", "category": "fruit"}, {"x": "Fruit Jam Fruit Preserves", "value": "1", "category": "fruit"}, {"x": "Citrus Zest gin", "value": "1", "category": "fruit"}, {"x": "lemon juice", "value": "1", "category": "fruit"}, {"x": "lime juice", "value": "1", "category": "fruit"}, {"x": "simple syrup", "value": "1", "category": "sweeteners"}, {"x": "drops orange flower water", "value": "1", "category": "fruit"}, {"x": "cream", "value": "1", "category": "sweeteners"}, {"x": "egg white", "value": "1", "category": "fruit"}, {"x": "club soda milk", "value": "1", "category": "alcohol"}, {"x": "sugar", "value": "1", "category": "sweeteners"}, {"x": "cinnamon sticks", "value": "1", "category": "fruit"}, {"x": "whole cloves", "value": "1", "category": "fruit"}, {"x": "strong brewed coffee", "value": "1", "category": "alcohol"}, {"x": "pisco aguardiente grappa brandy", "value": "1", "category": "alcohol"}, {"x": "squeezed lime juice", "value": "1", "category": "fruit"}, {"x": "simple syrup", "value": "1", "category": "sweeteners"}, {"x": "aromatic bitters", "value": "1", "category": "fruit"}, {"x": "fresh blackberries", "value": "1", "category": "fruit"}, {"x": "sugar", "value": "1", "category": "sweeteners"}, {"x": "gin", "value": "1", "category": "alcohol"}, {"x": "fresh lime juice", "value": "1", "category": "fruit"}, {"x": "Club soda", "value": "1", "category": "alcohol"}, {"x": "sweet vermouth", "value": "1", "category": "spices_and_herbs"}, {"x": "Fernet Branca", "value": "1", "category": "alcohol"}, {"x": "orange bitters", "value": "1", "category": "fruit"}, {"x": "orange twist bourbon", "value": "1", "category": "spices_and_herbs"}, {"x": "T maple syrup", "value": "1", "category": "alcohol"}, {"x": "chocolate bitters", "value": "1", "category": "sweeteners"}, {"x": "orange bitters Bitter Bird", "value": "1", "category": "fruit"}, {"x": "Bulleit Bourbon", "value": "1", "category": "alcohol"}, {"x": "Campari", "value": "1", "category": "alcohol"}, {"x": "Owl's Brew CocoLada", "value": "1", "category": "alcohol"}, {"x": "Luxardo Maraschino Liqueur", "value": "1", "category": "alcohol"}, {"x": "Angosturra bitters", "value": "1", "category": "sweeteners"}, {"x": "Absinthe mint springs", "value": "1", "category": "alcohol"}, {"x": "gin", "value": "1", "category": "alcohol"}, {"x": "simple syrup", "value": "1", "category": "sweeteners"}, {"x": "fresh lime juice", "value": "1", "category": "fruit"}, {"x": "club soda Rosemary Syrup", "value": "1", "category": "alcohol"}, {"x": "water", "value": "1", "category": "sweeteners"}, {"x": "sugar", "value": "1", "category": "sweeteners"}, {"x": "Rosemary Gimlet", "value": "1", "category": "fruit"}, {"x": "gin", "value": "1", "category": "alcohol"}, {"x": "fresh lime juice", "value": "1", "category": "fruit"}, {"x": "rosemary syrup", "value": "1", "category": "spices_and_herbs"}, {"x": "fresh grapefruit juice", "value": "1", "category": "fruit"}, {"x": "fresh lime juice", "value": "1", "category": "fruit"}, {"x": "Cholula hot sauce", "value": "1", "category": "fruit"}, {"x": "Flaky salt pomegranate juice", "value": "1", "category": "fruit"}, {"x": "ruby port", "value": "1", "category": "spices_and_herbs"}, {"x": "orange bitters", "value": "1", "category": "fruit"}, {"x": "sparkling wine", "value": "1", "category": "liqueur"}, {"x": "Amaro Montenegro", "value": "1", "category": "spices_and_herbs"}, {"x": "Fresh Lemon Juice", "value": "1", "category": "fruit"}, {"x": "Raw Honey Syrup", "value": "1", "category": "sweeteners"}, {"x": "grapefruit juice", "value": "1", "category": "fruit"}, {"x": "pomegranate juice", "value": "1", "category": "fruit"}, {"x": "honey sugar agave", "value": "1", "category": "spices_and_herbs"}, {"x": "white tequila", "value": "1", "category": "spices_and_herbs"}, {"x": "mediumsized", "value": "1", "category": "unknown"}, {"x": "club soda seltzer", "value": "1", "category": "alcohol"}, {"x": "pomegranate arils", "value": "1", "category": "fruit"}];


}

//Adds word from word cloud to filter terms
function addIngredient(word){
  word = word + " "
  document.getElementById("filterTerms").placeholder += word;

  //Compare against old terms. If terms have changed, filter
  var termMatch = word.localeCompare(filterTermsOld);

  if (termMatch != 0){
    filterTermsOld = word
    //Apply filter
    filterCards()
  }
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
      keywordsArr = response;
      //console.log(keywordsArr)
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
