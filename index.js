const srcImg = 'test.9.png';
const WIDTH = 400;
const HEIGHT = 300;

var ninePatch;

window.onload = function() {
  ninePatchWorker = new NinePatch(srcImg, WIDTH, HEIGHT);
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

/*
* Show normal image after scaling nine-patch image
*/
function test() {
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
