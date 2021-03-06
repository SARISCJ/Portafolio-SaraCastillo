$(function(){
  //WOW plugin init
  new WOW().init();
  //parallax effect for banner
  (function() {
    var posY;
    var image = document.getElementById('parallax');;
    function paralax() {
      posY = window.pageYOffset;
      image.style.top = posY * 0.9 + 'px';
    }
    window.addEventListener('scroll', paralax);
  })();
});

/*###### NAV  ######*/
$('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
});

/*###### SCROLL ######*/
$('a[href*="#"]:not([href="#"])').click(function() {
 if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
   var target = $(this.hash);
   target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
   if (target.length) {
     $('html, body').animate({
       scrollTop: target.offset().top
     }, 1000);
     return false;
   }
 }
});

/*###### SKILLS SECTION ######*/
$( document ).ready(function() {
  var $developmentWrapper = $(".development-wrapper");
  var developmentIsVisible = false;
  $(window).scroll( function(){
    var bottom_of_window = $(window).scrollTop() + $(window).height();
    var middle_of_developmentWrapper = $developmentWrapper.offset().top + $developmentWrapper.outerHeight()/2;
    if((bottom_of_window > middle_of_developmentWrapper)&& (developmentIsVisible == false)){
      $(".skills-bar-container li").each( function(){
        var $barContainer = $(this).find(".bar-container");
        var dataPercent = parseInt($barContainer.data("percent"));
        var elem = $(this).find(".progressbar");
        var percent = $(this).find(".percent");
        var width = 0;
        var id = setInterval(frame, 15);
        function frame() {
          if (width >= dataPercent) {
            clearInterval(id);
          } else {
            width++;
            elem.css("width", width+"%");
            percent.html(width+" %");
          }
        }
      });
      developmentIsVisible = true;
    }
  }); 
});

function defaults(object, src) {
  for(var i in src) {
    if(typeof object[i] === 'undefined') {
      object[i] = src[i];
    }
  }
  return object;
}

/*###### TEXT TYPED ######*/
! function($) {
    "use strict";
    var Typed = function(el, options) {
      // chosen element to manipulate text
      this.el = $(el);
      // options
      this.options = $.extend({}, $.fn.typed.defaults, options);
      // attribute to type into
      this.isInput = this.el.is('input');
      this.attr = this.options.attr;
      // show cursor
      this.showCursor = this.isInput ? false : this.options.showCursor;
      // text content of element
      this.elContent = this.attr ? this.el.attr(this.attr) : this.el.text()
      // html or plain text
      this.contentType = this.options.contentType;
      // typing speed
      this.typeSpeed = this.options.typeSpeed;
      // add a delay before typing starts
      this.startDelay = this.options.startDelay;
      // backspacing speed
      this.backSpeed = this.options.backSpeed;
      // amount of time to wait before backspacing
      this.backDelay = this.options.backDelay;
      // div containing strings
      this.stringsElement = this.options.stringsElement;
      // input strings of text
      this.strings = this.options.strings;
      // character number position of current string
      this.strPos = 0;
      // current array position
      this.arrayPos = 0;
      // number to stop backspacing on.
      // default 0, can change depending on how many chars
      // you want to remove at the time
      this.stopNum = 0;
      // Looping logic
      this.loop = this.options.loop;
      this.loopCount = this.options.loopCount;
      this.curLoop = 0;
      // for stopping
      this.stop = false;
      // custom cursor
      this.cursorChar = this.options.cursorChar;
      // shuffle the strings
      this.shuffle = this.options.shuffle;
      // the order of strings
      this.sequence = [];
      // All systems go!
      this.build();
    };

    Typed.prototype = {
      constructor: Typed
      ,
      init: function() {
        var self = this;
        self.timeout = setTimeout(function() {
          for (var i=0;i<self.strings.length;++i) self.sequence[i]=i;
          if(self.shuffle) self.sequence = self.shuffleArray(self.sequence);
          self.typewrite(self.strings[self.sequence[self.arrayPos]], self.strPos);
        }, self.startDelay);
      }
      ,
      build: function() {
        var self = this;
        // Insert cursor
        if (this.showCursor === true) {
          this.cursor = $("<span class=\"typed-cursor\">" + this.cursorChar + "</span>");
          this.el.after(this.cursor);
        }
        if (this.stringsElement) {
          self.strings = [];
          this.stringsElement.hide();
          var strings = this.stringsElement.find('p');
          $.each(strings, function(key, value){
              self.strings.push($(value).html());
          });
        }
        this.init();
        }
        ,
        typewrite: function(curString, curStrPos) {
          // exit when stopped
          if (this.stop === true) {
            return;
          }
          var humanize = Math.round(Math.random() * (100 - 30)) + this.typeSpeed;
          var self = this;
          self.timeout = setTimeout(function() {
            var charPause = 0;
            var substr = curString.substr(curStrPos);
            if (substr.charAt(0) === '^') {
              var skip = 1; // skip atleast 1
              if (/^\^\d+/.test(substr)) {
                substr = /\d+/.exec(substr)[0];
                skip += substr.length;
                charPause = parseInt(substr);
              }
              curString = curString.substring(0, curStrPos) + curString.substring(curStrPos + skip);
            }
            if (self.contentType === 'html') {
              // skip over html tags while typing
              var curChar = curString.substr(curStrPos).charAt(0)
              if (curChar === '<' || curChar === '&') {
                var tag = '';
                var endTag = '';
                if (curChar === '<') {
                  endTag = '>'
                } else {
                  endTag = ';'
                }
                while (curString.substr(curStrPos).charAt(0) !== endTag) {
                  tag += curString.substr(curStrPos).charAt(0);
                  curStrPos++;
                }
                curStrPos++;
                tag += endTag;
              }
            }
            // timeout for any pause after a character
            self.timeout = setTimeout(function() {
              if (curStrPos === curString.length) {
                self.options.onStringTyped(self.arrayPos);
                  if (self.arrayPos === self.strings.length - 1) {
                    // animation that occurs on the last typed string
                    self.options.callback();
                    self.curLoop++;
                    if (self.loop === false || self.curLoop === self.loopCount)
                        return;
                  }
                  self.timeout = setTimeout(function() {
                      self.backspace(curString, curStrPos);
                  }, self.backDelay);
              } else {
              if (curStrPos === 0)
                self.options.preStringTyped(self.arrayPos);
              var nextString = curString.substr(0, curStrPos + 1);
              if (self.attr) {
                self.el.attr(self.attr, nextString);
              } else {
                if (self.isInput) {
                  self.el.val(nextString);
                } else if (self.contentType === 'html') {
                  self.el.html(nextString);
                } else {
                  self.el.text(nextString);
                }
              }
              curStrPos++;
              // loop the function
              self.typewrite(curString, curStrPos);
                }
              }, charPause);
            }, humanize);
        }
        ,
        backspace: function(curString, curStrPos) {
          // exit when stopped
          if (this.stop === true) {
              return;
          }
          var humanize = Math.round(Math.random() * (100 - 30)) + this.backSpeed;
          var self = this;

          self.timeout = setTimeout(function() {
            if (self.arrayPos == 6){
              self.stopNum = 7;
            }
            else{
              self.stopNum = 0;
            }
            if (self.contentType === 'html') {
                // skip over html tags while backspacing
              if (curString.substr(curStrPos).charAt(0) === '>') {
                var tag = '';
                while (curString.substr(curStrPos).charAt(0) !== '<') {
                  tag -= curString.substr(curStrPos).charAt(0);
                  curStrPos--;
                }
                curStrPos--;
                tag += '<';
              }
            }
                var nextString = curString.substr(0, curStrPos);
                if (self.attr) {
                    self.el.attr(self.attr, nextString);
                } else {
                    if (self.isInput) {
                        self.el.val(nextString);
                    } else if (self.contentType === 'html') {
                        self.el.html(nextString);
                    } else {
                        self.el.text(nextString);
                    }
                }
                if (curStrPos > self.stopNum) {
                  // subtract characters one by one
                  curStrPos--;
                  // loop the function
                  self.backspace(curString, curStrPos);
                }
                // if the stop number has been reached, increase
                // array position to next string
                else if (curStrPos <= self.stopNum) {
                  self.arrayPos++;
                  if (self.arrayPos === self.strings.length) {
                      self.arrayPos = 0;
                      // Shuffle sequence again
                      if(self.shuffle) self.sequence = self.shuffleArray(self.sequence);

                      self.init();
                  } else
                      self.typewrite(self.strings[self.sequence[self.arrayPos]], curStrPos);
                }
                // humanized value for typing
            }, humanize);
        }
        /**
         * Shuffles the numbers in the given array.
         * @param {Array} array
         * @returns {Array}
         */
        ,shuffleArray: function(array) {
            var tmp, current, top = array.length;
            if(top) while(--top) {
                current = Math.floor(Math.random() * (top + 1));
                tmp = array[current];
                array[current] = array[top];
                array[top] = tmp;
            }
            return array;
        }
        ,
        reset: function() {
          var self = this;
          clearInterval(self.timeout);
          var id = this.el.attr('id');
          this.el.after('<span id="' + id + '"/>')
          this.el.remove();
          if (typeof this.cursor !== 'undefined') {
              this.cursor.remove();
          }
          // Send the callback
          self.options.resetCallback();
        }
    };

    $.fn.typed = function(option) {
      return this.each(function() {
        var $this = $(this),
          data = $this.data('typed'),
          options = typeof option == 'object' && option;
        if (!data) $this.data('typed', (data = new Typed(this, options)));
        if (typeof option == 'string') data[option]();
      });
    };
    $.fn.typed.defaults = {
      strings: ["These are the default values...", "You know what you should do?", "Use your own!", "Have a great day!"],
      stringsElement: null,
      // typing speed
      typeSpeed: 0,
      // time before typing starts
      startDelay: 0,
      // backspacing speed
      backSpeed: 0,
      // shuffle the strings
      shuffle: false,
      // time before backspacing
      backDelay: 500,
      // loop
      loop: false,
      // false = infinite
      loopCount: false,
      // show cursor
      showCursor: true,
      // character for cursor
      cursorChar: "|",
      // attribute to type (null == text)
      attr: null,
      // either html or text
      contentType: 'html',
      // call when done callback function
      callback: function() {},
      // starting callback function before each string
      preStringTyped: function() {},
      //callback for every typed string
      onStringTyped: function() {},
      // callback for reset
      resetCallback: function() {}
    };
  }(window.jQuery);

$(function(){
      $(".typed").typed({
        strings: ["^2000 Diseñadora Publicitaria.", "Front End.", "Cuando amas lo que haces, ni la imaginación te detiene."],
      typeSpeed: 30,
      callback: function(){
        lift();
      }
    });
  });

  function lift(){
    $(".sub-tagline").addClass("lift-text");
    $(".btn-group").css("opacity", '1');
  }

  function shift(){
      $(".head-wrap").addClass("shift-text");
      terminalHeight();
  }

  function terminalHeight(){
      var termHeight = $(".terminal-height");
      var value = termHeight.text();
      value = parseInt(value);
      setTimeout(function(){
          if (value > 10){
              value = value-1;
              this.txtValue = value.toString();
              termHeight.text(this.txtValue);
              self.terminalHeight();
          }
          else{
              clearTimeout();
          }
      }, 10);
  };
