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
  $('#navbar-news').addClass('ui-btn-active');
  $('#navbar-home, #navbar-timetable, #navbar-calendar').removeClass(
    'ui-btn-active'
  );
  getNews();
  window.scrollTo(0, 0);
}

function loadHomeContent() {
  $('.ui-content').load('home.html');
  $('#navbar-home').addClass('ui-btn-active');
  $('#navbar-news, #navbar-timetable, #navbar-calendar').removeClass(
    'ui-btn-active'
  );
  window.scrollTo(0, 0);
}

function loadTimetableContent() {
  //$('.ui-content').load('timetable.html');
  $('#navbar-timetable').addClass('ui-btn-active');
  $('#navbar-home, #navbar-news , #navbar-calendar').removeClass(
    'ui-btn-active'
  );
  getTimetable();
  window.scrollTo(0, 0);
}

function loadCalendarContent() {
  //$('.ui-content').load('calendar.html');
  $('#navbar-calendar').addClass('ui-btn-active');
  $('#navbar-home, #navbar-news , #navbar-timetable').removeClass(
    'ui-btn-active'
  );
  getCalendars();
  window.scrollTo(0, 0);
}

function handleOptions() {
  console.log('ok... from handleOptions()');
  loadHomeContent();
}

//--- Hanchiang News ---
function getNews() {
  var newsContent = '';
  //const apiRoot = 'https://hjuapp.site/wp-json';
  const apiRoot = 'http://www.hanchiangnews.com/en/wp-json';
  var wp = new WPAPI({ endpoint: apiRoot });
  wp.posts()
    .perPage(3)
    .then(function(posts) {
      posts.forEach(function(post) {
        console.log(post.content.rendered);
        newsContent += post.content.rendered;
      });
      $('.ui-content').html(newsContent);
    });
  console.log('getNews called');
}

//--- Hanchiang Calendar ---
function getCalendars() {
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
          '<div data-role="collapsible" data-collapsed-icon="carat-d" data-expanded-icon="carat-u">';
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
      console.log(calendarContent);
      $('[data-role=collapsible]').collapsible();
      $('[data-role=collapsibleset]').collapsibleset();
    });
  console.log('getCalendars called');
}

//--- Hanchiang Home Page ---
function getTimetable() {
  var content = '';
  const apiRoot = 'https://hjuapp.site/wp-json';

  var wp = new WPAPI({ endpoint: apiRoot });

  wp.posts()
    .categories(7) // 7 = home 8 = timetables
    .then(function(posts) {
      console.log(posts[0].content.rendered);
      content = posts[0].content.rendered;

      $('.ui-content').html(content);
    });
  console.log('getTimetable called');
}
