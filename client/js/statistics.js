var alreadyAdded = false;

Meteor.call("userExists");
Template.nav.events({
  "click .stats": function (event, template) {
      $('#statisticsModal').modal('open');
      console.log("modal opened");

if (!alreadyAdded) {
      //Genome information
      Meteor.call("getsmallestgenome", function (err, value) {
          document.getElementById("smallest-genome").insertAdjacentHTML("beforeEnd",
              value.name + " - " + value.length + " members");
      });

      Meteor.call("getlargestgenome", function (err, value) {
          document.getElementById("largest-genome").insertAdjacentHTML("beforeEnd",
              value.name + " - " + value.length + " members");
      });

      Meteor.call("getmeangenomesize", function (err, value) {
        document.getElementById("mean-genome").insertAdjacentHTML("beforeEnd",
          Math.round(value) + " members");
      })
      //Gene information
      Meteor.call("getgeneinfo", function (err, value) {
        document.getElementById("smallest-gene").insertAdjacentHTML("beforeEnd",
          value.smallestGene + " - " + value.smallestGeneLength + " bps");
        document.getElementById("largest-gene").insertAdjacentHTML("beforeEnd",
          value.largestGene + " - " + value.largestGeneLength + " bps");
        document.getElementById("mean-gene").insertAdjacentHTML("beforeEnd",
          Math.round(value.meanGeneLength) + " bps");
      });
      //Pham information
      Meteor.call("getsinglephams", function (err, value) {
        document.getElementById("single-pham").insertAdjacentHTML("beforeEnd",
          value.length + " phams");
      });

      Meteor.call("getlargestpham", function (err, value) {
          document.getElementById("largest-pham").insertAdjacentHTML("beforeEnd",
              value.name + " - " + value.size + " members");
      });

      Meteor.call("getmeanphamsize", function (err, value) {
        document.getElementById("mean-pham").insertAdjacentHTML("beforeEnd",
          Math.round(value) + " members");
      })
      //GC contentGC
      Meteor.call("calculateGCcontent", function (err, value) {
        document.getElementById("GC-content").insertAdjacentHTML("beforeEnd",
           value.toFixed(2) + "%");
      });

      alreadyAdded = true;
      }
    }
    //EVERYTHING GOES ABOVE HERE
  })
