## NinePatch.js
Scale nine-patch image using JavaScript's canvas.

## Usage
  * APIs:
    + getSize(srcImg) => {url, width, height}: 'url' is the original image's url
    + scaleImage(srcImg, newWidth, newHeight) => url: 'url' is the new image's url, which is scaled.

## Example

```js
const srcImg = 'test_normal.9.png';
const WIDTH = 150;
const HEIGHT = 150;

document.addEventListener("DOMContentLoaded", event => {
  let $ = document.querySelector.bind(document);

  new NinePatch().getSize(srcImg)
  .then(result => setImage($('#ninePatchImg'), result.url, result.width, result.height))
  .catch(error => console.log(error));

  new NinePatch().scaleImage(srcImg, WIDTH, HEIGHT)
  .then(result => setImage($('#normalImg'), result, WIDTH, HEIGHT))
  .catch(error => console.log(error));

  new NinePatch().getSize(srcImg)
  .then(result => setImage($('#testImg'), result.url, result.width + 50, result.height + 100))
  .catch(error => console.log(error));
});

function setImage(divElement, srcURL, width, height) {
  divElement.style.width = width + 'px';
  divElement.style.height = height + 'px';
  divElement.style.backgroundSize = '' + width + 'px ' + height + 'px'; 
  divElement.style.backgroundImage = "url('" + srcURL + "')";
}

```
## References

  * [Scale Nine-patch Image using NinePatch.js](https://codepen.io/completejavascript/pen/opOvaP)
  
## Visit me

  * [Complete JavaScript](https://completejavascript.com)
  
  
