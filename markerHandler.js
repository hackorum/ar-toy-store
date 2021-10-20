let uid = "";
AFRAME.registerComponent("marker-handler", {
  init: async function () {
    swal({
      icon: "warning",
      title: "Hello Peter",
      text: "Enter your UID otherwise I won't let you see any toys",
      content: {
        element: "input",
        attributes: {
          placeholder: "Come on, DO IT!",
        },
      },
    }).then((val) => {
      uid = val.toUpperCase();
    });
    this.el.addEventListener("markerFound", () => {
      this.handleMarkerFound();
    });
    this.el.addEventListener("markerLost", () => {
      this.handleMarkerLost();
    });
  },
  handleMarkerFound: async function () {
    let toys = await this.getoys();
    let id = this.el.id;
    let toy = toys.filter((toy) => toy.id == id)[0];
    if (!toy.is_out_of_stock) {
      let bdiv = document.getElementById("button-div");
      bdiv.style.display = "flex";
      let orderButton = document.getElementById("order-button");
      let summaryButton = document.getElementById("summary-button");
      orderButton.addEventListener("click", () => {
        firebase
          .firestore()
          .collection("users")
          .doc(uid)
          .get()
          .then((doc) => {
            let details = doc.data();
            console.log(details);
            if (details["current_orders"][toy.id]) {
              details["current_orders"][toy.id]["quantity"] += 1;
              let currentQuantity =
                details["current_orders"][toy.id]["quantity"];
              details["current_orders"][toy.id]["subtotal"] =
                currentQuantity * toy.price;
            } else {
              details["current_orders"][toy.id] = {
                item: toy.toy_name,
                price: toy.price,
                quantity: 1,
                subtotal: toy.price * 1,
              };
            }
            details.total_bill += toy.price;
            firebase
              .firestore()
              .collection("users")
              .doc(doc.id)
              .update(details);
          });
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
    } else {
      swal("Oops :(", "Toy is out of stock!", "error");
    }
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
