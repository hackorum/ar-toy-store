AFRAME.registerComponent("marker-handler", {
  init: async function () {
    this.el.addEventListener("markerFound", () => {
      console.log("markerFound");
      this.handleMarkerFound();
    });
    this.el.addEventListener("markerLost", () => {
      console.log("markerLost");
      this.handleMarkerLost();
    });
  },
  handleMarkerFound: function () {
    let bdiv = document.getElementById("button-div");
    bdiv.style.display = "flex";
    let orderButton = document.getElementById("order-button");
    let summaryButton = document.getElementById("summary-button");
    orderButton.addEventListener("click", () => {
      swal({
        icon: "success",
        title: "Thanks for ordering!",
        text: "Your order will arrive soon",
        timer: 2000,
        buttons: false,
      });
    });
    summaryButton.addEventListener("click", () => {
      swal({
        icon: "warning",
        title: "Order Summary",
        text: "WIP",
      });
    });
  },
  handleMarkerLost: function () {
    let bdiv = document.getElementById("button-div");
    bdiv.style.display = "none";
  },
  getoys: async function () {
    return await firebase
      .firestore()
      .collection("toys")
      .get()
      .then((snap) => snap.docs.map((doc) => doc.data()));
  },
});
