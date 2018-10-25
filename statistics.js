var alreadyAdded = false;
var currentDB;
var previousDB;

function cacheGenomeInfo (dbname) {
  Meteor.call("getsmallestgenome", function (err, sValue) {
    Meteor.call("getlargestgenome", function (err, lValue) {
      Meteor.call("getmeangenomesize", function (err, aValue) {
        Meteor.call("calculateGCcontent", function (err, gcValue) {
          Meteor.call("cacheDBinfo", dbname, "genomes",
          { "smallest_genome": sValue.name,
          "smallest_length": sValue.length,
          "largest_genome": lValue.name,
          "largest_length": lValue.length,
          "average_length": aValue,
          "gc_content": gcValue});
        });
      });
    });
  });
}

 function cacheGeneInfo (dbname) {
   Meteor.call("getgeneinfo", function (err, value) {
     Meteor.call("cacheDBinfo", dbname, "genes",
     { "smallest_gene": value.smallestGene,
       "smallest_length": value.smallestGeneLength,
       "largest_gene": value.largestGene,
       "largest_length": value.largestGeneLength,
       "average_length": value.meanGeneLength });
   });
 }

 function cachePhamsInfo (dbname) {
   Meteor.call("getsinglephams", function (err, sValue) {
     Meteor.call("getlargestpham", function (err, lValue) {
       Meteor.call("getmeanphamsize", function (err, aValue) {

         Meteor.call("cacheDBinfo", dbname, "phams",
         { "single_phams": sValue.length,
           "largest_pham": lValue.name,
           "largest_size": lValue.size,
           "average_size": aValue});
       });
     });
   });
 }

function displayGenomeInfo (smallestGenome, smallestLength, largestGenome, largestLength, averageLength,
  GCcontent) {
  document.getElementById("smallest-genome").insertAdjacentHTML("beforeEnd",
    smallestGenome + " - " + Number(smallestLength).toLocaleString() + " members <br>");
  document.getElementById("largest-genome").insertAdjacentHTML("beforeEnd",
    largestGenome + " - " + Number(largestLength).toLocaleString() + " members <br>");
  document.getElementById("mean-genome").insertAdjacentHTML("beforeEnd",
    Number(Math.round(averageLength)).toLocaleString() + " members <br>");
  document.getElementById("GC-content").insertAdjacentHTML("beforeEnd",
    GCcontent.toFixed(2) + "% <br>");
}

function displayGeneInfo (smallestGene, smallestLength, largestGene, largestLength, averageLength) {
  document.getElementById("smallest-gene").insertAdjacentHTML("beforeEnd",
    smallestGene + " - " + Number(smallestLength).toLocaleString() + " bps <br>");
  document.getElementById("largest-gene").insertAdjacentHTML("beforeEnd",
    largestGene + " - " + Number(largestLength).toLocaleString() + " bps <br>");
  document.getElementById("mean-gene").insertAdjacentHTML("beforeEnd",
    Number(Math.round(averageLength)).toLocaleString() + " bps <br>");
}

function displayPhamsInfo (singlePhams, largestPham, largestSize, averageSize) {
  document.getElementById("single-pham").insertAdjacentHTML("beforeEnd",
    Number(singlePhams).toLocaleString() + " phams <br>");
  document.getElementById("largest-pham").insertAdjacentHTML("beforeEnd",
    largestPham + " - " + Number(largestSize).toLocaleString() + " members <br>");
  document.getElementById("mean-pham").insertAdjacentHTML("beforeEnd",
    Number(Math.round(averageSize)).toLocaleString() + " members <br>");
}

function renderSynopsis (dbname) {
  if (!alreadyAdded) {
    //Use cached genome information to display corresponding DOM elements
    Meteor.call("retrievecachedDBinfo", dbname, function (err, cValue) {
        var genomes = cValue.genomes;
        displayGenomeInfo(genomes.smallest_genome, genomes.smallest_length, genomes.largest_genome,
          genomes.largest_length, genomes.average_length, genomes.gc_content);
    });

    //Use cached gene information to display corresponding DOM elements
    Meteor.call("retrievecachedDBinfo", dbname, function (err, cValue) {
      var genes = cValue.genes;
      displayGeneInfo(genes.smallest_gene, genes.smallest_length, genes.largest_gene, genes.largest_length,
        genes.average_length);
    });

    //Use cached phamily information to display corresponding DOM elements
    Meteor.call("retrievecachedDBinfo", dbname, function (err, cValue) {
      var phams = cValue.phams;
      displayPhamsInfo(phams.single_phams, phams.largest_pham, phams.largest_size, phams.average_size);
    });

        cacheGenomeInfo(dbname);
        cacheGeneInfo(dbname);
        cachePhamsInfo(dbname);
        alreadyAdded = true;
      }
}

//Execution of code
Meteor.call("userExists");
Template.nav.events({
  "click .stats": function (event, template) {
      $('#statisticsModal').modal('open');
      console.log("modal opened");

      currentDB = "Actinodraft"; //change to some sort of click event on the selected DB for dynamic selection

      if (previousDB != currentDB) {
          //clear the DOM if a new DB is selected
          document.getElementsByClassName("stats-numbers").innerHTML = "&nbsp";
      }

      previousDB = currentDB;

      Meteor.call("retrievecachedDBinfo", currentDB, function (err, cValue) {
        if (typeof cValue === "undefined") { //if the current DB info does not exist in cache yet
          //console.log("Path 1");
          cacheGenomeInfo(currentDB);
          cacheGeneInfo(currentDB);
          cachePhamsInfo(currentDB);
          setTimeout(function () {      //setTimeout() needed to pause execution b/c asynchronisity will cause this
            renderSynopsis(currentDB);  //have finished renderSynopsis() call to run before the update functions,
          }, 12000);                    //thereby breaking it through attempted access of "undefined" values in DBinfo
        }
        else {
          //console.log("Path 2");
          renderSynopsis(currentDB);
        }
      });
  }
})
