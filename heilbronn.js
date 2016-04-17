fs = require('fs');

function writeToFile(filename, data) {
   var err = fs.appendFileSync(filename, data + "\n");
   if (err) {
          console.log("Error writing to file " + filename + "!");
          throw err;
   }
}

function resetFiles() {
    fs.writeFileSync("output.json", "");
    fs.writeFileSync("error.log", "");
}


function output(data) {
    writeToFile("output.json", data);
}

function error(data) {
    writeToFile("error.log", data);
}

resetFiles();

fs.readFile('Liste_PPN-ExNr_HSHN-libre.csv', 'utf8', function (err,inhalt) {
  if (err) {
    return console.log(err);
  }
  var lines = inhalt.split(/\r?\n/);
  var result = [];
  for (var i = 0; i < lines.length; i++) {
     if (i==0) continue;
     var line = lines[i];
     var tokens = line.split(",");
     if (tokens.length!=5) {
        error("Komische Zeile (" + (i+1) + "): " + line);
     } else {
        var ppn = tokens[0];
        while (ppn.length<9) {
          ppn = "0" + ppn;
        }        
        // "0".repeat(9-ppn.length) + ppn
        var exemplar = {
           ppn: ppn,
           exemplar: tokens[1],
           signatur: tokens[2],
           barcode: tokens[3],
           sigel: tokens[4]
        };
        result.push(exemplar);
     }
  }
  
  output(JSON.stringify(result, null, 2));

    
  console.log("Anzahl Zeilen: " + lines.length)
});
