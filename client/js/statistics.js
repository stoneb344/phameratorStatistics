var alreadyAdded = false;

Meteor.call("userExists");
Template.nav.events({
  "click .stats": function (event, template) {
      $('#statisticsModal').modal('open');
      console.log("modal opened");

if (!alreadyAdded) {
  //Use cached genome information to display corresponding DOM elements
  Meteor.call("retrievecachedDBinfo", "Actinodraft", function (err, cValue) {
    var genomes = cValue.genomes;
    document.getElementById("smallest-genome").insertAdjacentHTML("beforeEnd",
      genomes.smallest_genome + " - " + Number(genomes.smallest_length).toLocaleString() + " members <br>");
    document.getElementById("largest-genome").insertAdjacentHTML("beforeEnd",
      genomes.largest_genome + " - " + Number(genomes.largest_length).toLocaleString() + " members <br>");
    document.getElementById("mean-genome").insertAdjacentHTML("beforeEnd",
      Number(Math.round(genomes.average_length)).toLocaleString() + " members <br>");
    document.getElementById("GC-content").insertAdjacentHTML("beforeEnd",
      genomes.gc_content.toFixed(2) + "% <br>");
  });

  //Use cached gene information to display corresponding DOM elements
  Meteor.call("retrievecachedDBinfo", "Actinodraft", function (err, cValue) {
    var genes = cValue.genes;
    document.getElementById("smallest-gene").insertAdjacentHTML("beforeEnd",
      genes.smallest_gene + " - " + Number(genes.smallest_Length).toLocaleString() + " bps <br>");
    document.getElementById("largest-gene").insertAdjacentHTML("beforeEnd",
      genes.largest_gene + " - " + Number(genes.largest_length).toLocaleString() + " bps <br>");
    document.getElementById("mean-gene").insertAdjacentHTML("beforeEnd",
      Number(Math.round(genes.average_length)).toLocaleString() + " bps <br>");
  });

  //Use cached phamily information to display corresponding DOM elements
  Meteor.call("retrievecachedDBinfo", "Actinodraft", function (err, cValue) {
    var phams = cValue.phams;
    document.getElementById("single-pham").insertAdjacentHTML("beforeEnd",
      Number(phams.single_phams).toLocaleString() + " phams <br>");
    document.getElementById("largest-pham").insertAdjacentHTML("beforeEnd",
      phams.largest_pham + " - " + Number(phams.largest_size).toLocaleString() + " members <br>");
    document.getElementById("mean-pham").insertAdjacentHTML("beforeEnd",
      Number(Math.round(phams.average_size)).toLocaleString() + " members <br>");
  });

  //Update & cache genome information if needed
  Meteor.call("getsmallestgenome", function (err, sValue) {
    Meteor.call("getlargestgenome", function (err, lValue) {
      Meteor.call("getmeangenomesize", function (err, aValue) {
        Meteor.call("calculateGCcontent", function (err, gcValue) {
          Meteor.call("cacheDBinfo", "Actinodraft", "genomes",
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

    //Update & cache gene information if needed
    Meteor.call("getgeneinfo", function (err, value) {
      Meteor.call("cacheDBinfo", "Actinodraft", "genes",
      { "smallest_gene": value.smallestGene,
        "smallest_length": value.smallestGeneLength,
        "largest_gene": value.largestGene,
        "largest_size": value.largestGeneLength,
        "average_length": value.meanGeneLength });
    });

    //Update & cache pham information if needed
    Meteor.call("getsinglephams", function (err, sValue) {
      Meteor.call("getlargestpham", function (err, lValue) {
        Meteor.call("getmeanphamsize", function (err, aValue) {
          Meteor.call("cacheDBinfo", "Actinodraft", "phams",
          { "single_phams": sValue.length,
            "largest_pham": lValue.name,
            "largest_size": lValue.size,
            "average_size": aValue});
        });
      });
    });

      alreadyAdded = true;
    }
  }
    //EVERYTHING GOES ABOVE HERE
})
