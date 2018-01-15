/*
Constructor: NinePatch(srcImage, newWidth, newHeight)
  + srcImage: (String) url of image.
  + newWidth: (Number) new image's width
  + newHeight: (Number) new image's height
APIs:
  + setSrcImage(srcImage)
  + setWidth(newWidth)
  + setHeight(newHeight)
  + getSize => {url, width, height}: 'url' is the original image's url
  + run => {url, width, height}: 'url' is the new image's url, which is scaled.
*/

(function(document, window){ 
  var NinePatch = function(srcImage, newWidth, newHeight) {
    this.srcImage = srcImage;
    this.newWidth = newWidth;
    this.newHeight = newHeight;
  }

  NinePatch.prototype.setSrcImage = function(srcImage) {
    this.srcImage = srcImage;
  }

  NinePatch.prototype.setWidth = function(newWidth) {
    this.newWidth = newWidth;
  }

  NinePatch.prototype.setHeight = function(newHeight) {
    this.newHeight = newHeight;
  }

  NinePatch.prototype.getSize = function() {
    var self = this;
    return new Promise(function(resolve, reject) {
      var image = new Image();
      image.onload = function() {
        resolve({url: self.srcImage, width: image.width, height: image.height});
      };
      image.onerror = function(error) {
        reject(error);
      }
      image.src = srcImg; 
    }); 
  }

  NinePatch.prototype.run = function() {
    var self = this;
    return new Promise(function(resolve, reject){
      var canvas = document.createElement('canvas');
      var newCanvas = document.createElement('canvas');
      var context = canvas.getContext('2d');
      var newContext = newCanvas.getContext('2d');
      var image = new Image();
    
      image.onload = function() {
        canvas.width = image.width;
        canvas.height = image.height;
        newCanvas.width = self.newWidth;
        newCanvas.height = self.newHeight;
        context.drawImage(image, 0, 0, image.width, image.height);
    
        var offset = getOffsetFromCanvas(canvas, context);
        //console.log(offset);
    
        // copy top-left corner, ignore 1px from the left
        var rootX = 1, rootY = 1;
        var newX = 0, newY = 0;
        if(offset.left - 1 > 0 && offset.top - 1 > 0) {
          var imageData = context.getImageData(rootX, rootY, offset.left - 1, offset.top - 1);
          newContext.putImageData(imageData, newX, newY);  
        }
    
        // copy top-right corner, ignore 1px from the right
        rootX = canvas.width - offset.right; rootY = 1;
        newX = newCanvas.width - offset.right; newY = 0;
        if(offset.right - 1 > 0 && offset.top - 1 > 0) {
          imageData = context.getImageData(rootX, rootY, offset.right - 1, offset.top - 1);
          newContext.putImageData(imageData, newX, newY);  
        }
    
        // copy bottom-right corner
        rootX = canvas.width - offset.right; rootY = canvas.height - offset.bottom;
        newX = newCanvas.width - offset.right; newY = newCanvas.height - offset.bottom;
        imageData = context.getImageData(rootX, rootY, offset.right - 1, offset.bottom - 1);
        newContext.putImageData(imageData, newX, newY);
    
        // copy bottom-left corner
        rootX = 1; rootY = canvas.height - offset.bottom;
        newX = 0; newY = newCanvas.height - offset.bottom;
        if(offset.left - 1 > 0 && offset.bottom - 1 > 0) {
          imageData = context.getImageData(rootX, rootY, offset.left - 1, offset.bottom - 1);
          newContext.putImageData(imageData, newX, newY);
        }
    
        // scale middle top
        rootX = offset.left; rootY = 1;
        if(offset.top - 1 > 0) {
          imageData = context.getImageData(rootX, rootY, 1, offset.top - 1);
          for(let x = offset.left - 1; x <= newCanvas.width - offset.right; x++) {
            newContext.putImageData(imageData, x, 0);
          }  
        }
    
        // scale middle bottom
        rootX = offset.left; rootY = canvas.height - offset.bottom;
        if(offset.bottom - 1 > 0) {
          imageData = context.getImageData(rootX, rootY, 1, offset.bottom - 1);
          for(let x = offset.left - 1; x <= newCanvas.width - offset.right; x++) {
            newContext.putImageData(imageData, x, newCanvas.height - offset.bottom);
          }
        }
    
        // scale middle left
        rootX = 1; rootY = offset.top;
        if(offset.left - 1 > 0) {
          imageData = context.getImageData(rootX, rootY, offset.left - 1, 1);
          for(let y = offset.top - 1; y <= newCanvas.height - offset.top; y++) {
            newContext.putImageData(imageData, 0, y);
          }    
        }
    
        // scale middle right
        rootX = canvas.width - offset.right; rootY = offset.top;
        if(offset.right - 1 > 0) {
          imageData = context.getImageData(rootX, rootY, offset.right - 1, 1);
          for(let y = offset.top - 1; y <= newCanvas.height - offset.top; y++) {
            newContext.putImageData(imageData, newCanvas.width - offset.right, y);
          }
        }
    
        // scale center
        rootX = offset.left; rootY = offset.top;
        imageData = context.getImageData(rootX, rootY, 1, 1);
        for(let y = offset.top - 1; y <= newCanvas.height - offset.bottom; y++) {
          newContext.putImageData(imageData, offset.left - 1, y);
        }
        imageData = newContext.getImageData(offset.left - 1, offset.top - 1, 1, newCanvas.height - offset.bottom - offset.top);
        for(let x = offset.left; x <= newCanvas.width - offset.right; x++) {
          newContext.putImageData(imageData, x, offset.top -1);         
        }
    
        var dataUrl = newCanvas.toDataURL();
        resolve({url: dataUrl, width: self.newWidth, height: self.newHeight});
      };
      image.onerror = function(error) {
        reject(error);
      }
      image.src = srcImg;
    });
  }

  function getOffsetFromCanvas(canvas, context) {
    var offset = {
      top: 0,
      bottom: 0, 
      left: 0,
      right: 0
    }
    // Get top offset
    for(let y = 0; y < canvas.height; y++) {
      var p = context.getImageData(0, y, 1, 1).data;
      if(isTransparent([p[0], p[1], p[2], p[3]])) offset.top++;
      else break;
    }
    // Get bottom offset
    for(let y = canvas.height - 1; y >= 0; y--) {
      var p = context.getImageData(0, y, 1, 1).data;
      if(isTransparent([p[0], p[1], p[2], p[3]])) offset.bottom++;
      else break;
    }
    // Get left offset
    for(let x = 0; x < canvas.width; x++) {
      var p = context.getImageData(x, 0, 1, 1).data;
      if(isTransparent([p[0], p[1], p[2], p[3]])) offset.left++;
      else break;
    }
    // Get right offset
    for(let x = canvas.width - 1; x >= 0; x--) {
      var p = context.getImageData(x, 0, 1, 1).data;
      if(isTransparent([p[0], p[1], p[2], p[3]])) offset.right++;
      else break;
    } 
    return offset;
  }
  
  function isTransparent(rgbArray) {
    return (rgbArray[0] == 0 && rgbArray[1] == 0 && rgbArray[2] == 0 && rgbArray[3] == 0);
  }
  
  function getOffset(srcImg) {
    return new Promise(function(resolve, reject){
      var offset = {top: 0, right: 0, bottom: 0, left: 0}
      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');
      var image = new Image();
        
      image.onload = function() {
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0, image.width, image.height);
    
        // Get top offset
        for(let y = 0; y < canvas.height; y++) {
          var p = context.getImageData(0, y, 1, 1).data;
          if(isTransparent([p[0], p[1], p[2], p[3]])) offset.top++;
          else break;
        }
        // Get bottom offset
        for(let y = canvas.height - 1; y >= 0; y--) {
          var p = context.getImageData(0, y, 1, 1).data;
          if(isTransparent([p[0], p[1], p[2], p[3]])) offset.bottom++;
          else break;
        }
        // Get left offset
        for(let x = 0; x < canvas.width; x++) {
          var p = context.getImageData(x, 0, 1, 1).data;
          if(isTransparent([p[0], p[1], p[2], p[3]])) offset.left++;
          else break;
        }
        // Get right offset
        for(let x = canvas.width - 1; x >= 0; x--) {
          var p = context.getImageData(x, 0, 1, 1).data;
          if(isTransparent([p[0], p[1], p[2], p[3]])) offset.right++;
          else break;
        }
        resolve(offset);
      };
      image.onerror = function(error) {
        reject(error);
      }
      image.src = srcImg;
    });
  }
  window.NinePatch = NinePatch;
})(document, window);
