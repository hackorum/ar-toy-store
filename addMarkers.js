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

      // Adding 3D model to scene
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

      // description Container
      let mainPlane = document.createElement("a-plane");
      mainPlane.setAttribute("id", `main-plane-${toy.id}`);
      mainPlane.setAttribute("position", { x: 0, y: 0, z: 0 });
      mainPlane.setAttribute("rotation", { x: -90, y: 0, z: 0 });
      mainPlane.setAttribute("width", 2.3);
      mainPlane.setAttribute("height", 2.5);
      marker.appendChild(mainPlane);

      // toy title background plane
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