export class ImageManager {
  static createImageContainer() {
    const imgContainer = document.createElement("div");
    imgContainer.className = "image_container";
    return imgContainer;
  }

  static addImageToNode(node, file) {
    if (!file.type.startsWith("image/")) return;

    ImageManager.removeExistingImages(node);

    const imgUrl = URL.createObjectURL(file);

    const imageContainer = this.createImageContainer();

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      imageContainer.dataset.imageData = dataUrl;

      const img = ImageManager.createImage(dataUrl);
      img.dataset.imageData = dataUrl;
      img.src = dataUrl;
      imageContainer.appendChild(img);
      node.querySelector(".node_header").appendChild(imageContainer);
    };
    reader.readAsDataURL(file);
  }

  static createImage(src) {
    const img = document.createElement("img");
    img.src = src;
    img.style.width = "100%";
    img.style.height = "auto";
    return img;
  }
  static removeExistingImages(node) {
    const prevImageContainer = node.querySelector(".image_container");
    if (prevImageContainer) {
      prevImageContainer.remove();
    }
  }
}
