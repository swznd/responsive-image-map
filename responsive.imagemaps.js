/* Responsive ImageMaps 
 * 
 * Recalculating the area coordinats of image maps based on the change of image dimension
 *
 * Copyright (c) 2014 Muhammad Fikri
 * http://fik.li
**/

;(function($) {
  
  function reCoords(img) {
    if ( ! $(img).data('orig-width')) $(img).data('orig-width', img.naturalWidth);
    if ( ! $(img).data('orig-height')) $(img).data('orig-height', img.naturalHeight);
    
    var originalWidth = $(img).data('orig-width');
    var originalHeight = $(img).data('orig-height');
    var width = img.clientWidth;
    var height = img.clientHeight;
    
    var mapname = $(img).attr('usemap').replace('#', '');
    
    $('map[name="'+ mapname +'"]').find('area').each(function() {
      if ( ! $(this).data('coords')) $(this).data('coords', $(this).attr('coords'));
      
      var coords = $(this).data('coords').split(',');
      var changeH = 1;
      var changeW = 1;
      
      if (originalWidth != width) {
        var changeW = width / originalWidth;
      }
      
      if (originalHeight != height) {
        var changeH = height / originalHeight;
      }
      
      for (var i = 0; i < coords.length; i++) {
        coords[i] = parseInt(parseInt(coords[i]) * (i % 2 === 0 ? changeW : changeH));
      }
      
      $(this).attr('coords', coords.join(','));
    });
  }
  
  
  // https://github.com/meetselva/attrchange
  
  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
  
  function isDOMAttrModifiedSupported() {
    var p = document.createElement('p');
    var flag = false;

    if (p.addEventListener) p.addEventListener('DOMAttrModified', function() {
     flag = true;
    }, false);
    else if (p.attachEvent) p.attachEvent('onDOMAttrModified', function() {
     flag = true
    });
    else return false;

    return flag;
  }
  
  $.fn.responsiveImageMaps = function() {
    this.each(function() {
      if ( ! $(this).attr('usemap')) return;
      
      $(this).on('load', function() {
        reCoords(this);
      });
    })
    
    if (MutationObserver) {
      var mConfig = {
        attributes: true,
        childList: false,
        subtree: false
      };
    
      var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          reCoords(mutation.target);
        });    
      });
      
      this.each(function() {
        observer.observe(this, mConfig);
      });
    }
    else if (isDOMAttrModifiedSupported) {
      this.on('DOMAttrModified', function(e) {
        reCoords(e);
      });
    }
    else if ('onpropertychange' in document.body) {
      this.on('propertychange', function(e) {
        reCoords(e);
      })
    }
  }
})(jQuery || Zepto);