window.onload = function() {
  document.addEventListener('deviceready', initApp);
};

function initApp() {
  // $("[data-role=panel]").panel("close");
  //$("body>[data-role='panel']").panel();
  //--- load side panel into index.html ---
  $.ajax('panel.html')
    .done(function(sidepanel) {
      $('#mypanel').html(sidepanel);
      $('[data-role=panel]').panel();
      $('[data-role=listview]').listview();
    })
    .fail(function() {
      console.log('ajax panel error');
    });

  $.ajax('home.html')
    .done(function(home) {
      $('#homecontent').html(home);
    })
    .fail(function() {
      console.log('ajax home content error');
    });
}

function loadNewsContent() {
  // $('.ui-content').load('news.html');
  //console.log(getThumbnail(6417));
  //getThumbnail(6417);
  getNews3();
  window.scrollTo(0, 0);
  $('[data-role="footer"]').css({ display: 'none' });
  $('a').removeClass('ui-btn-active');
}

function loadHomeContent() {
  $('.ui-content').load('home.html');

  window.scrollTo(0, 0);
  $('#top-title').html('Han Chiang App');
  $('[data-role="footer"]').css({ display: 'none' });
  $('a').removeClass('ui-btn-active');
}

function loadTimetableContent() {
  //$('.ui-content').load('timetable.html');
  showLoader();
  getTimetable();
  window.scrollTo(0, 0);
  $('#top-title').html('Timetables');
  $('[data-role="footer"]').css({ display: 'block' });
  $('a').removeClass('ui-btn-active');
}

function loadCalendarContent() {
  //$('.ui-content').load('calendar.html');
  // $('#navbar-home').removeClass('ui-btn-active');
  getCalendars();
  window.scrollTo(0, 0);
  $('#top-title').html('Calendars');
  $('[data-role="footer"]').css({ display: 'block' });
  $('a').removeClass('ui-btn-active');
}

function handleOptions() {
  console.log('ok... from handleOptions()');
  loadHomeContent();
}

//--- Hanchiang News ---
function getNews() {
  showLoader();
  var newsContent = '';
  //const apiRoot = 'https://hjuapp.site/wp-json';
  const apiRoot = 'http://www.hanchiangnews.com/en/wp-json';
  var imgUrl;

  var wp = new WPAPI({ endpoint: apiRoot });
  wp.posts()
    .param('_embed')
    .perPage(1)
    .then(function(posts) {
      // posts.forEach(function(post) {
      //   //imgUrl = getThumbnail(post.featured_media);
      //   //console.log(post);

      //   return wp.media().id(post.featured_media);
      // });
      newsContent += posts[0].title.rendered;
      newsContent += posts[0].excerpt.rendered;
      newsContent += '<img src= "';
      return wp.media().id(posts[0].featured_media);
    })
    .then(function(res) {
      // posts.forEach(function(post) {

      newsContent += res.media_details.sizes.thumbnail.source_url;
      newsContent += '">';
      //});
      //console.log(res.media_details.sizes.thumbnail.source_url);
      $('.ui-content').html(newsContent);
      hideLoader();
    });
  $('#top-title').html('Latest News');
}

function getNews2() {
  showLoader();
  var newsContent = '';
  const apiRoot = 'http://www.hanchiangnews.com/en/wp-json';
  var imgUrl;

  var wp = new WPAPI({ endpoint: apiRoot });
  wp.media()
    .id(6417)
    .then(function(res) {
      console.log(res.media_details.sizes.thumbnail.source_url);
      hideLoader();
    });
  $('#top-title').html('Latest News');
}

function getNews3() {
  showLoader();
  var newsContent = '';
  //const apiRoot = 'https://hjuapp.site/wp-json';
  const apiRoot = 'http://www.hanchiangnews.com/en/wp-json';
  var imgUrl;
  var allPosts = [];

  var wp = new WPAPI({ endpoint: apiRoot });
  wp.posts()
    .param('_embed')
    .perPage(5)
    .then(function(posts) {
      posts.forEach(function(post) {
        allPosts.push(post);
      });
      getThumbnail2(allPosts);
      hideLoader();
    });

  $('#top-title').html('Latest News');
}

function getThumbnail2(allPosts) {
  var newsContent = '';
  allPosts.forEach(function(post) {
    $.ajax({
      url:
        'http://www.hanchiangnews.com/en/wp-json/wp/v2/media/' +
        post.featured_media,
      type: 'GET',
      success: function(res) {
        console.log(
          'hoho call: ' + res.media_details.sizes.thumbnail.source_url
        );
        newsContent += post.title.rendered;
        newsContent += post.excerpt.rendered;
        newsContent += '<img src= "';
        newsContent += res.media_details.sizes.thumbnail.source_url;
        newsContent += '">';
        $('.ui-content').html(newsContent);
      }
    });
  });
}

function getThumbnail(featured_media) {
  const mediaUrl = `http://www.hanchiangnews.com/en/wp-json/wp/v2/media/${featured_media}`;
  //console.log('mediaUrl: ' + mediaUrl);
  //return 'http://www.hanchiangnews.com/en/wp-content/uploads/2019/03/Sequence-01_1-150x150.jpg';
  // $.ajax(mediaUrl)
  //   .done(function(jsonresponse) {
  //     // console.log(
  //     //   '1.jsonresponse.media_details.sizes.thumbnail.source_url: ' +
  //     //     jsonresponse.media_details.sizes.thumbnail.source_url
  //     // );
  //     return jsonresponse.media_details.sizes.thumbnail.source_url;
  //   })
  //   .fail(function() {
  //     console.log('ajax getThumbnail error');
  //   });

  $.ajax({
    url: mediaUrl,
    type: 'GET',

    success: function(res) {
      //console.log('hoho call: ' + res.media_details.sizes.thumbnail.source_url);
      return res.media_details.sizes.thumbnail.source_url;
    }
  });
}

//--- Hanchiang Calendar ---
function getCalendars() {
  showLoader();

  var calendarContent = '';
  const apiRoot = 'https://hjuapp.site/wp-json';

  var wp = new WPAPI({ endpoint: apiRoot });

  wp.posts()
    .categories(6) //6 = calendars
    .then(function(posts) {
      calendarContent += '<div data-role="collapsibleset">';
      posts.forEach(function(post) {
        // console.log(post.title.rendered);
        // console.log(post.content.rendered);

        calendarContent +=
          '<div data-role="collapsible" data-inset="false" data-collapsed-icon="carat-d" data-expanded-icon="carat-u">';
        calendarContent += '<h4>';
        calendarContent += post.title.rendered;
        calendarContent += '</h4>';
        calendarContent += '<p>';
        calendarContent += post.content.rendered;
        calendarContent += '</p>';
        calendarContent += '</div>';
      });

      calendarContent += '</div>';

      $('.ui-content').html(calendarContent);
      //console.log(calendarContent);
      $('[data-role=collapsible]').collapsible();
      $('[data-role=collapsibleset]').collapsibleset();
      makeEmDraggable();
      hideLoader();
    });
}

function showLoader() {
  $.mobile.loading('show', {
    text: 'loading',
    textVisible: true,
    theme: 'z',
    html: ''
  });
}

function hideLoader() {
  $.mobile.loading('hide');
}

//--- Hanchiang Home Page ---
function getTimetable() {
  showLoader();
  var content = '';
  const apiRoot = 'https://hjuapp.site/wp-json';

  var wp = new WPAPI({ endpoint: apiRoot });

  wp.posts()
    .categories(7) // 7 = home 8 = timetables
    .then(function(posts) {
      console.log(posts[0].content.rendered);
      content = posts[0].content.rendered;

      $('.ui-content').html(content);
      hideLoader();
    });
}

//--- pinchzoom ---
// function initPinchZoom() {
//   var myElement = document.getElementsByTagName('img');
//   var pz = [];

//   for (var i = 0; i < myElement.length; i++) {
//     pz.push(new PinchZoom(myElement[i]));
//     console.log(myElement[i]);
//   }
//   console.log('num el: ' + pz.length);
// }

//---- zoomIn image ------
function zoomIn() {
  var imagesize = $('img').width();

  $('#navbar-zoom-in').on('click', function() {
    imagesize = imagesize + 50;
    $('img').width(imagesize);
  });
}

//---- zoomOut image ------
function zoomOut() {
  var imagesize = $('img').width();

  $('#navbar-zoom-out').on('click', function() {
    imagesize = imagesize - 50;
    $('img').width(imagesize);
  });
}

function fitWidth() {
  //$('img').width($(document).width());
  $('img').width('100%');
  draggable.draggabilly('setPosition', 0, 0);
}

var draggable;
function makeEmDraggable() {
  draggable = $('img').draggabilly({
    // options...
  });
}
