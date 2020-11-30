
//
var keywordsFileName = "keywords.json"
var keywordsArr;

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

  //Add listener - Add 'clicked' word
  chart.listen("pointClick", function(e){
    ingredient = e.point.get("x")
    addIngredient(ingredient)
  });

  //Load recipies
});


function addIngredient(word){
  console.log(word)
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
    {"x": "Mandarin chinese", "value": 1090000000, category: "Sino-Tibetan"},
    {"x": "English", "value": 983000000, category: "Indo-European"},
    {"x": "Hindustani", "value": 544000000, category: "Indo-European"},
    {"x": "Spanish", "value": 527000000, category: "Indo-European"},
    {"x": "Arabic", "value": 422000000, category: "Afro-Asiatic"},
    {"x": "Malay", "value": 281000000, category: "Austronesian"},
    {"x": "Russian", "value": 267000000, category: "Indo-European"},
    {"x": "Bengali", "value": 261000000, category: "Indo-European"},
    {"x": "Portuguese", "value": 229000000, category: "Indo-European"},
    {"x": "French", "value": 229000000, category: "Indo-European"},
    {"x": "Hausa", "value": 150000000, category: "Afro-Asiatic"},
    {"x": "Punjabi", "value": 148000000, category: "Indo-European"},
    {"x": "Japanese", "value": 129000000, category: "Japonic"},
    {"x": "German", "value": 129000000, category: "Indo-European"},
    {"x": "Persian", "value": 121000000, category: "Indo-European"}
  ];
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
