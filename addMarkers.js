AFRAME.registerComponent("add-markers", {
  init: async function () {
    let mainScene = document.querySelector("#main-scene");
    let toys = await this.getoys();
    toys.map((toy) => {
      let marker = document.createElement("a-marker");
      marker.setAttribute("id", toy.id);
      marker.setAttribute("type", "pattern");
      marker.setAttribute("url", toy.marker_pattern_url);
      marker.setAttribute("cursor", {
        rayOrigin: "mouse",
      });
      marker.setAttribute("marker-handler", {});
      mainScene.appendChild(marker);

      if (!toy.is_out_of_stock) {
        let model = document.createElement("a-entity");
        model.setAttribute("id", `model-${toy.id}`);
        model.setAttribute("position", toy.model_geometry.position);
        model.setAttribute("rotation", toy.model_geometry.rotation);
        model.setAttribute("scale", toy.model_geometry.scale);
        model.setAttribute("gltf-model", "#car");
        model.setAttribute("gesture-handler", {});
        model.setAttribute("animation", {
          property: "rotation",
          to: "270 -270 -90",
          dur: 5000,
          loop: true,
          easing: "linear",
        });
        marker.appendChild(model);

        let mainPlane = document.createElement("a-plane");
        mainPlane.setAttribute("id", `main-plane-${toy.id}`);
        mainPlane.setAttribute("position", { x: 0, y: 0, z: 0 });
        mainPlane.setAttribute("rotation", { x: -90, y: 0, z: 0 });
        mainPlane.setAttribute("width", 2.3);
        mainPlane.setAttribute("height", 2.5);
        marker.appendChild(mainPlane);

        let titlePlane = document.createElement("a-plane");
        titlePlane.setAttribute("id", `title-plane-${toy.id}`);
        titlePlane.setAttribute("position", { x: -0.09, y: 1.1, z: 0.09 });
        titlePlane.setAttribute("rotation", { x: 0, y: 0, z: 0 });
        titlePlane.setAttribute("width", 2.31);
        titlePlane.setAttribute("height", 0.4);
        titlePlane.setAttribute("material", { color: "#282c34" });
        mainPlane.appendChild(titlePlane);

        // Toy title
        let toyTitle = document.createElement("a-entity");
        toyTitle.setAttribute("id", `toy-title-${toy.id}`);
        toyTitle.setAttribute("position", { x: 1.3, y: 0, z: 0.1 });
        toyTitle.setAttribute("rotation", { x: 0, y: 0, z: 0 });
        toyTitle.setAttribute("text", {
          font: "aileronsemibold",
          width: 4.5,
          height: 3,
          align: "left",
          value: toy.toy_name.toUpperCase(),
        });
        titlePlane.appendChild(toyTitle);

        // description List
        let description = document.createElement("a-entity");
        description.setAttribute("id", `description-${toy.id}`);
        description.setAttribute("position", { x: 0.04, y: 0, z: 0.1 });
        description.setAttribute("rotation", { x: 0, y: 0, z: 0 });
        description.setAttribute("text", {
          font: "dejavu",
          color: "#282c34",
          width: 2,
          height: 5,
          letterSpacing: 2,
          lineHeight: 50,
          align: "left",
          value: `${toy.description}`,
        });
        mainPlane.appendChild(description);

        let age = document.createElement("a-entity");
        age.setAttribute("id", `age-${toy.id}`);
        age.setAttribute("position", { x: -0.75, y: -0.8, z: 0.1 });
        age.setAttribute("rotation", { x: 0, y: 0, z: 0 });
        age.setAttribute("text", {
          font: "aileronsemibold",
          color: "#282c34",
          width: 2,
          height: 5,
          align: "center",
          value: `AGE : ${toy.age_group}`,
        });

        mainPlane.appendChild(age);
        let pricePlane = document.createElement("a-image");
        pricePlane.setAttribute("id", `price-plane-${toy.id}`);
        pricePlane.setAttribute(
          "src",
          "https://raw.githubusercontent.com/whitehatjr/menu-card-app/main/black-circle.png"
        );
        pricePlane.setAttribute("width", 0.8);
        pricePlane.setAttribute("height", 0.8);
        pricePlane.setAttribute("position", { x: -1.3, y: 0, z: 0.3 });
        pricePlane.setAttribute("rotation", { x: -90, y: 0, z: 0 });
        let price = document.createElement("a-entity");
        price.setAttribute("id", `price-${toy.id}`);
        price.setAttribute("position", { x: 0, y: 0.05, z: 0.1 });
        price.setAttribute("rotation", { x: 0, y: 0, z: 0 });
        price.setAttribute("text", {
          font: "mozillavr",
          color: "white",
          width: 3,
          align: "center",
          value: `Only \n$${toy.price}`,
        });
        pricePlane.appendChild(price);
        marker.appendChild(pricePlane);

        let available = document.createElement("a-entity");
        available.setAttribute("id", `age-${toy.id}`);
        available.setAttribute("position", { x: -0.75, y: -0.99, z: 0.1 });
        available.setAttribute("rotation", { x: 0, y: 0, z: 0 });
        available.setAttribute("text", {
          font: "aileronsemibold",
          color: "#282c34",
          width: 2,
          height: 5,
          align: "center",
          value: `AVAILABLE : ${!toy.is_out_of_stock ? "YES" : "NO"}`,
        });
        mainPlane.appendChild(available);
        var ratingPlane = document.createElement("a-entity");
        ratingPlane.setAttribute("id", `rating-plane-${toy.id}`);
        ratingPlane.setAttribute("position", { x: 3, y: 0, z: 0.5 });
        ratingPlane.setAttribute("rotation", { x: -90, y: 0, z: 0 });
        ratingPlane.setAttribute("geometry", {
          primitive: "plane",
          width: 1.5,
          height: 0.3,
        });
        ratingPlane.setAttribute("material", { color: "yellow" });

        var rating = document.createElement("a-entity");
        rating.setAttribute("id", `rating-${toy.id}`);
        rating.setAttribute("position", { x: 0, y: 0.05, z: 0.1 });
        rating.setAttribute("text", {
          font: "mozillavr",
          color: "black",
          width: 2.4,
          align: "center",
          value: `Customer Rating: ${toy.last_rating}`,
        });
        rating.setAttribute("material", { color: "yellow" });

        ratingPlane.appendChild(rating);
        marker.appendChild(ratingPlane);

        var reviewPlane = document.createElement("a-entity");
        reviewPlane.setAttribute("id", `review-plane-${toy.id}`);
        reviewPlane.setAttribute("position", { x: 2.4, y: 0, z: 0 });
        reviewPlane.setAttribute("rotation", { x: -90, y: 0, z: 0 });
        reviewPlane.setAttribute("geometry", {
          primitive: "plane",
          width: 2.7,
          height: 0.5,
        });
        reviewPlane.setAttribute("material", { color: "yellow" });

        var review = document.createElement("a-entity");
        review.setAttribute("id", `review-${toy.id}`);
        review.setAttribute("position", { x: 0, y: 0.05, z: 0.1 });
        review.setAttribute("text", {
          font: "mozillavr",
          color: "black",
          width: 2.4,
          align: "center",
          value: `Customer Review: ${toy.last_review}`,
        });
        review.setAttribute("material", { color: "yellow" });

        reviewPlane.appendChild(review);
        marker.appendChild(reviewPlane);
      }
    });
  },
  getoys: async function () {
    return await firebase
      .firestore()
      .collection("toys")
      .get()
      .then((snap) => snap.docs.map((doc) => doc.data()));
  },
});
