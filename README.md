## NinePatch.js
Scale nine-patch image using JavaScript's canvas.

## Usage
  * Constructor: NinePatch(srcImage, newWidth, newHeight)
    + srcImage: (String) url of image.
    + newWidth: (Number) new image's width
    + newHeight: (Number) new image's height
    
  * APIs:
    + setSrcImage(srcImage)
    + setWidth(newWidth)
    + setHeight(newHeight)
    + getSize => {url, width, height}: 'url' is the original image's url
    + run => {url, width, height}: 'url' is the new image's url, which is scaled.

## Example

```js
const srcImg = 'https://res.cloudinary.com/drcrre4xg/image/upload/v1516665655/test_normal.9_gjksbl.png';
const WIDTH = 150;
const HEIGHT = 150;

var ninePatch;

window.onload = function() {
  ninePatchWorker = new NinePatch(srcImg, WIDTH, HEIGHT);
  view();
  normal();
  test();
};
/*
* Show nine patch image 
*/
function view() {
  var ninePatchImgDiv = document.getElementById('ninePatchImg');
  ninePatchWorker
  .getSize()
  .then(
    result => setImage(ninePatchImgDiv, result.url, result.width, result.height), 
    error => console.log('Get size of image error: ', error)
  );
}

/**
 * Show image after scaling without handling nine-patch image
 */
function test() {
  var testImgDiv = document.getElementById('testImg');
  ninePatchWorker
  .getSize()
  .then(
    result => setImage(testImgDiv, result.url, result.width + 50, result.height + 100), 
    error => console.log('Get size of image error: ', error)
  );
}

/*
* Show normal image after scaling nine-patch image
*/
function normal() {
  var normalImgDiv = document.getElementById('normalImg');
  ninePatchWorker
  .run()
  .then(result => setImage(normalImgDiv, result.url, result.width, result.height))
  .catch(error => {
    console.log('Error: ', error);
  });
}

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
  
  
