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

  getHomeContent();
  $('[data-role="footer"]').css({ display: 'none' });
  $('#headerBackButton').hide();
}

function getHomeContent() {
  $.ajax('home.html')
    .done(function(home) {
      $('.ui-content').html(home);
      $('[data-role=listview]').listview();
    })
    .fail(function() {
      console.log('ajax home content error');
    });
}

function loadHomeContent() {
  getHomeContent();
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

function loadClassrmBkContent() {
  showLoader();
  getClassroomBk();
  window.scrollTo(0, 0);
  $('#top-title').html('Class Bookings');
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
function loadNewsContent() {
  getNews();
  window.scrollTo(0, 0);
  $('[data-role="footer"]').css({ display: 'none' });
  $('a').removeClass('ui-btn-active');
  $('#headerBackButton').hide();
  $('#openpanel').show();
}

function getNews() {
  showLoader();
  var newsContent = '';
  //const apiRoot = 'https://hjuapp.site/wp-json';
  const apiRoot = 'http://www.hanchiangnews.com/en/wp-json';
  var imgUrl;
  var allPosts = [];

  var wp = new WPAPI({ endpoint: apiRoot });
  wp.posts()
    .param('_embed')
    .perPage(6)
    .then(function(posts) {
      posts.forEach(function(post) {
        console.log(post.link);
        allPosts.push(post);
      });
      getThumbnail2Text(allPosts);
    });

  $('#top-title').html('Latest News');
}

var newsListPage; // cache of the news page
var newsTopImageCollection = [];
var newsTitleCollection = [];
var newsDateCollection = [];
var newsContentCollection = [];

function getThumbnail2Text(allPosts) {
  var j = 0;
  const length = allPosts.length;

  //var newsContent = '<ul data-role="listview" data-inset="false">';
  var newsContent = '<ul data-role="listview" data-inset="true">';
  allPosts.forEach(function(post) {
    $.ajax({
      url:
        'http://www.hanchiangnews.com/en/wp-json/wp/v2/media/' +
        post.featured_media,
      type: 'GET',
      success: function(res) {
        j++;

        newsTopImageCollection[j] =
          '<img src= "' +
          res.media_details.sizes.medium_large.source_url +
          '">';
        newsTitleCollection[j] = '<h3>' + post.title.rendered + '</h3>';
        newsDateCollection[j] = '<h4>' + extractDate(post) + '</h4>';
        newsContentCollection[j] = post.content.rendered;

        newsContent += '<li>';
        newsContent += '<a href="#" onclick="getNewsContent(';
        newsContent += j;
        newsContent += ')">';
        newsContent += '<img src= "';
        newsContent += res.media_details.sizes.thumbnail.source_url;
        newsContent += '" class="ui-li-thumb">';
        //newsContent += '<h2>' + post.title.rendered + '</h2>';
        newsContent += '<p><b>' + post.title.rendered + '</b></p>';
        newsContent += '<p>' + extractDate(post) + '</p>';
        //newsContent += '<p>' + post.excerpt.rendered + '</p>';
        //newsContent += '<p>' + post.excerpt.rendered + '</p>';
        newsContent += '</a>';
        newsContent += '</li>';

        //console.log(newsContent);
        if (j == length) {
          newsContent += '</ul>';
          $('.ui-content').html(newsContent);
          $('[data-role=listview]').listview();
          hideLoader();
          newsListPage = newsContent;
        }
      }
    });
  });
}

function extractDate(post) {
  var today = new Date(post.date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  //const date = new Date(post.date);
  return today;
}

//-- called from embedded markup inserted in getThumbnail2Text() --
function getNewsContent(item) {
  //console.log(newsContentCollection[item]);
  $('.ui-content').html(
    newsTopImageCollection[item] +
      newsTitleCollection[item] +
      newsDateCollection[item] +
      newsContentCollection[item]
  );
  $('#headerBackButton').show();
  $('#openpanel').hide();
}

function reloadNewsPage() {
  $('.ui-content').html(newsListPage);
  $('[data-role=listview]').listview();
  $('#headerBackButton').hide();
  $('#openpanel').show();
}

//--- Hanchiang Calendar ---
function getCalendars() {
  showLoader();

  var calendarContent = '';
  const apiRoot = 'https://hjuapp.site/wp-json';

  var wp = new WPAPI({ endpoint: apiRoot });

  wp.posts()
    .categories(6) //6 = calendars
    .orderby('slug')
    .order('asc')
    .then(function(posts) {
      calendarContent +=
        '<div data-role="collapsibleset" data-inset="true" data-ajax="false">';
      posts.forEach(function(post) {
        // console.log(post.title.rendered);
        // console.log(post.content.rendered);

        calendarContent +=
          '<div data-role="collapsible" data-collapsed-icon="carat-d" data-expanded-icon="carat-u" >';
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
    text: '',
    textVisible: false,
    theme: 'z',
    html: ''
  });
}

function hideLoader() {
  $.mobile.loading('hide');
}

//--- Time tables  ---
function getTimetable() {
  showLoader();

  var content = '';
  const apiRoot = 'https://hjuapp.site/wp-json';

  var wp = new WPAPI({ endpoint: apiRoot });

  wp.posts()
    .categories(8) // 7 = home 8 = timetables
    .orderby('slug')
    .order('asc')
    .then(function(posts) {
      content +=
        '<div data-role="collapsibleset" data-inset="true" data-ajax="false">';
      posts.forEach(function(post) {
        content +=
          '<div data-role="collapsible"   data-collapsed-icon="carat-d" data-expanded-icon="carat-u">';
        content += '<h4>';
        content += post.title.rendered;
        content += '</h4>';
        content += '<p>';
        content += post.content.rendered;
        content += '</p>';
        content += '</div>';
      });
      content += '</div>';

      $('.ui-content').html(content);

      $('[data-role=collapsible]').collapsible();
      $('[data-role=collapsibleset]').collapsibleset();
      makeEmDraggable();
      hideLoader();
    });
}

// --- classroom bookings ---
function getClassroomBk() {
  showLoader();

  var content = '';
  const apiRoot = 'https://hjuapp.site/wp-json';

  var wp = new WPAPI({ endpoint: apiRoot });

  wp.posts()
    .categories(9) // 7 = home, 8 = timetables, 9 = classroom booking
    .orderby('slug')
    .order('asc')
    .then(function(posts) {
      content +=
        '<div data-role="collapsibleset" data-inset="true" data-ajax="false">';
      posts.forEach(function(post) {
        content +=
          '<div data-role="collapsible" data-collapsed-icon="carat-d" data-expanded-icon="carat-u">';
        content += '<h4>';
        content += post.title.rendered;
        content += '</h4>';
        content += '<p>';
        content += post.content.rendered;
        content += '</p>';
        content += '</div>';
      });
      content += '</div>';
      $('.ui-content').html(content);

      $('[data-role=collapsible]').collapsible();
      $('[data-role=collapsibleset]').collapsibleset();
      makeEmDraggable();
      hideLoader();
    });
}

//---- zoomIn image ------
function zoomIn() {
  var imagesize = $('img').width();

  $('#navbar-zoom-in').on('click', function() {
    imagesize = imagesize + 200;
    $('img').width(imagesize);
  });
}

//---- zoomOut image ------
function zoomOut() {
  var imagesize = $('img').width();

  $('#navbar-zoom-out').on('click', function() {
    imagesize = imagesize - 200;
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
