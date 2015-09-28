(function($) {
  var keys,
      jsonCount = 0,
      offsetCount = 0,
      newsFeed = $('#news-feed'),
      template = Handlebars.compile(document.getElementById('news-template').innerHTML);

  // Moment.js Helper
  Handlebars.registerHelper('moment', function(context) {
    return window.moment ? moment(context, 'YYYY-MM-DD hh:mm:ss').fromNow() : context;
  });
  
  // Determine length of JSON object
  $.ajax({
    url: 'http://www.stellarbiotechnologies.com/media/press-releases/json',
    type: 'GET',
    dataType: 'json',
    success: function(result) {
      jsonCount = Object.keys(result.news).length;
    }
  });

  //Determine bounding areas for viewport and top/bottom list elements
  var elementInScroll = function(element) {
    var viewportTop = $(window).scrollTop(),
        viewportBot = viewportTop + $(window).height(),
        elementTop = element.offset().top,
        elementBot = elementTop + element.height();

    return ((elementBot <= viewportBot) && (elementTop >= viewportTop));
  };

  // Perform ajax call in respect to a variable offset value
  var loadJson = function() {
    var urlStr = 'http://www.stellarbiotechnologies.com/media/press-releases/json?limit=20&offset=' + offsetCount;
    setTimeout(function() {
      $.ajax({
        url: urlStr,
        type: 'GET',
        dataType: 'json',
        success: function(result) {
          $('.spinner').hide();
          newsFeed.append(template(result));
          setTimeout(function() {
            $('p').removeClass('fader');
          }, 50);
        }
      });
      offsetCount+=20;
    }, 200);
  };

  // Scroll event for when last element is in view to begin lazy loading
  var scrollEvent = function() {
    if (elementInScroll($('div p:last'))) {
      $('.spinner').show();
      $(document).off('scroll', scrollEvent);
      setTimeout(function() {
        loadJson();
        $(document).on('scroll', scrollEvent);
        if (offsetCount >= jsonCount) {
          $(document).off('scroll', scrollEvent);
        }
      }, 200);
    }
  };

  loadJson();
  $(document).on('scroll', scrollEvent);

})(jQuery);
