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
      let payButton = document.getElementById("pay-button");
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
        this.handleOrderSummary();
      });
      payButton.addEventListener("click", () => this.handlePayment());
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
  getOrderSummary: async function (uid) {
    return await firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .get()
      .then((doc) => doc.data());
  },
  handleOrderSummary: async function () {
    let modalDiv = document.getElementById("modal-div");
    modalDiv.style.display = "flex";
    uid = uid;
    let orderSummary = await this.getOrderSummary(uid);
    let tbody = document.getElementById("bill-table-body");
    tbody.innerHTML = "";
    let currentOrders = Object.keys(orderSummary.current_orders);
    currentOrders.map((i) => {
      let tr = document.createElement("tr");
      let item = document.createElement("td");
      let price = document.createElement("td");
      let quantity = document.createElement("td");
      let subtotal = document.createElement("td");
      item.innerHTML = orderSummary.current_orders[i].item;
      price.innerHTML = "$" + orderSummary.current_orders[i].price;
      price.setAttribute("class", "text-center");
      quantity.innerHTML = orderSummary.current_orders[i].quantity;
      quantity.setAttribute("class", "text-center");
      subtotal.innerHTML = "$" + orderSummary.current_orders[i].subtotal;
      subtotal.setAttribute("class", "text-center");
      tr.appendChild(item);
      tr.appendChild(price);
      tr.appendChild(quantity);
      tr.appendChild(subtotal);
      tbody.appendChild(tr);
    });
    let totalTr = document.createElement("tr");
    let td1 = document.createElement("td");
    td1.setAttribute("class", "no-line");
    let td2 = document.createElement("td");
    td1.setAttribute("class", "no-line");
    let td3 = document.createElement("td");
    td1.setAttribute("class", "no-line text-cente");
    let strong = document.createElement("strong");
    strong.innerHTML = "Total";
    td3.appendChild(strong);
    let td4 = document.createElement("td");
    td1.setAttribute("class", "no-line text-right");
    td4.innerHTML = "$" + orderSummary.total_bill;
    totalTr.appendChild(td1);
    totalTr.appendChild(td2);
    totalTr.appendChild(td3);
    totalTr.appendChild(td4);
    tbody.appendChild(totalTr);
  },
  handlePayment: function () {
    document.getElementById("modal-div").style.display = "none";
    uid = uid.toUpperCase();
    firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .update({
        current_orders: {},
        total_bill: 0,
      })
      .then(() => {
        swal({
          icon: "success",
          title: "Thanks For Paying!",
          text: "We Hope You Like Your Toy!",
          timer: 2500,
          buttons: false,
        });
      });
  },
});
