var alreadyAdded = false;

Meteor.call("userExists");
Template.nav.events({
  "click .stats": function (event, template) {
      $('#statisticsModal').modal('open');
      console.log("modal opened");

if (!alreadyAdded) {
      //Genome information... note that it takes 2 sec to calculate the average
      Meteor.call("getsmallestgenome", function (err, value) {
          document.getElementById("smallest-genome").insertAdjacentHTML("beforeEnd",
              value.name + " - " + Number(value.length).toLocaleString() + " members");
      });

      Meteor.call("getlargestgenome", function (err, value) {
          document.getElementById("largest-genome").insertAdjacentHTML("beforeEnd",
              value.name + " - " + Number(value.length).toLocaleString() + " members");
      });

      Meteor.call("getmeangenomesize", function (err, value) {
        document.getElementById("mean-genome").insertAdjacentHTML("beforeEnd",
          Number(Math.round(value)).toLocaleString() + " members");
      })
      //Gene information... note that it takes 5 sec to populate
      Meteor.call("getgeneinfo", function (err, value) {
        document.getElementById("smallest-gene").insertAdjacentHTML("beforeEnd",
          value.smallestGene + " - " + Number(value.smallestGeneLength).toLocaleString() + " bps");
        document.getElementById("largest-gene").insertAdjacentHTML("beforeEnd",
          value.largestGene + " - " + Number(value.largestGeneLength).toLocaleString() + " bps");
        document.getElementById("mean-gene").insertAdjacentHTML("beforeEnd",
          Number(Math.round(value.meanGeneLength)).toLocaleString() + " bps");
      });
      //Pham information... note that it takes 5 sec to populate
      Meteor.call("getsinglephams", function (err, value) {
        document.getElementById("single-pham").insertAdjacentHTML("beforeEnd",
          Number(value.length).toLocaleString() + " phams");
      });

      Meteor.call("getlargestpham", function (err, value) {
          document.getElementById("largest-pham").insertAdjacentHTML("beforeEnd",
              value.name + " - " + Number(value.size).toLocaleString() + " members");
      });

      Meteor.call("getmeanphamsize", function (err, value) {
        document.getElementById("mean-pham").insertAdjacentHTML("beforeEnd",
          Number(Math.round(value)).toLocaleString() + " members");
      })
      //GC contentGC... note that it takes 10 sec to populate
      Meteor.call("calculateGCcontent", function (err, value) {
        document.getElementById("GC-content").insertAdjacentHTML("beforeEnd",
           value.toFixed(2) + "%");
      });

      alreadyAdded = true;
      }
    }
    //EVERYTHING GOES ABOVE HERE
  })
