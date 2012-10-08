//=======================================================================
//
// "Sexy" Store : store.js
// Copyright (c) 2005-2008 Big Cartel, LLC. All rights reserved.
//
//=======================================================================

var Store = {

  errorDiv: 'error',
  errorInputClass: 'form-error',
  detailCurImage: 0,
  detailAnchors: new Array(),
  detailImages: new Array(),
  fullSizeImages: new Array(),
  productOptionsID: '#product-options ul input',
  productOptionsList: '#product-options ul li',
  productImageID: 'product-img',
  imagesListID: 'images-list',
  contactFormID: 'contact-form',
  cartInputsID: '#cart-form input',
  cartFormID: 'cart-form',
  discountInputID: 'cart_discount_code',
  artistsFormID: 'artists-form',

  initialize: function() {
    var owner = this;
        owner.inPreview = (/\/admin\/design/.test(top.location.pathname));
    var id = document.body.id;

    this.detectCookies();

    if(id == 'product-page') {
      this.initImageViewer();
      var selectedOption;
      var options = $$(this.productOptionsID);
      for(var a = 0; a < options.length; a++) {
        var option = options[a];
          option.index = a;
          option.onclick = function(){owner.selectOption(this.index);}
        if(!option.disabled && !selectedOption){selectedOption = option;}
      }
      if(selectedOption){ this.selectOption(selectedOption.index); }
    } else if(id == 'contact-page' && !owner.inPreview) {
      try { $(this.contactFormID).focusFirstElement(); } catch(e) { }
    } else if(id == 'cart-page') {
      // IE hack
      if(window.event) {
        var inputs = $$(this.cartInputsID);
        for(var a = 0; a < inputs.length; ++a) {
          inputs[a].onkeypress = function() {
            if(window.event.keyCode == 13) {
              $('cart-form').submit();
              return false;
            }
          }
        }
      }
    }
  },

  onError: function(error) {
    if(error instanceof Array) {
      error = error.join("</li><li>");
    }
    
    error = "<li>" + error + "</li>";
    
    if($(this.errorDiv)) {
      Element.update(this.errorDiv, '<ul>' + error + '</ul>');
    } else {
      new Insertion.Top('wrap', '<div class="' + this.errorDiv + '" id="' + this.errorDiv + '"><ul>' + error + '</ul></div>');
    }
    
    Element.scrollTo(this.errorDiv);
  },

  detectCookies: function() {
    var cookieEnabled = navigator.cookieEnabled;

    if(typeof navigator.cookieEnabled=="undefined" && !cookieEnabled) {
      document.cookie = "testcookie"
      cookieEnabled = document.cookie.indexOf("testcookie") != -1;
    }

    if(!cookieEnabled) {
      this.onError("Cookies must be enabled to use this store");
    }
  },

  selectArtist: function(elm) {
    var form = $(this.artistsFormID);
        form.action = elm.value != '' ? elm.value : '/';
        form.method = 'POST';
        form.submit();
  },

  selectOption: function(index) {
    var options = $$(this.productOptionsList);
    
    for(var a = 0; a < options.length; a++) {
      var option = options[a];
      if(a == index){option.addClassName('selected');}
      else{option.removeClassName('selected');}
    }
  },

  initImageViewer: function() {
    var owner     = this;
    var imageList = $(this.imagesListID);

    if(imageList) {
      this.detailCurImage  = 0;
      this.detailAnchors   = imageList.getElementsByTagName('a');
      this.detailImages   = new Array();
      for(var i = 0; i < this.detailAnchors.length; i++) {
        var anchor = this.detailAnchors[i];
        var href   = anchor.getAttribute('href');
        if(href) {
          var img = new Image();
              img.src = href;
          this.detailImages.push(img);
          anchor.index = i;
          anchor.onclick = function(){ owner.setImage(this.index); return false; }
          anchor.rel = 'nozoom';
        }
      }
    }

    if(this.fullSizeImages.length > 0) {
      var img   = new Image();
        img.src = this.fullSizeImages[0];
      setupZoom();
    }
  },

  setImage: function(n) {
    if(n != this.detailCurImage) {
      this.detailCurImage = n;
      $(this.productImageID).src = this.detailImages[this.detailCurImage].src;

      if(this.fullSizeImages.length > 0) {
        var img = new Image();
            img.src =
        $('product-image').href = this.fullSizeImages[n];
      }
    }
  },

  nextImage: function() {
    this.setImage((this.detailCurImage < this.detailImages.length - 1) ? this.detailCurImage + 1 : 0);
  },

  prevImage: function() {
    this.setImage((this.detailCurImage > 0) ? this.detailCurImage - 1 : this.detailImages.length - 1);
  },

  removeItem: function(id) {
    $('item_' + id + '_qty').value = 0;
    $(this.cartFormID).submit();
  },

  checkout: function() {
    var form = $(this.cartFormID);
        form.insert(new Element('input', { name: 'checkout', value: '1', type: 'hidden' }));
        form.submit();
  }

};

Event.observe(window, 'load', function(){ Store.initialize(); }, false);
