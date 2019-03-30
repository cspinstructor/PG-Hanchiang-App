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
  $('.ui-content').load('news.html');
  $('#navbar-news').addClass('ui-btn-active');
  $('#navbar-home, #navbar-timetable, #navbar-calendar').removeClass(
    'ui-btn-active'
  );
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
  $('.ui-content').load('timetable.html');
  $('#navbar-timetable').addClass('ui-btn-active');
  $('#navbar-home, #navbar-news , #navbar-calendar').removeClass(
    'ui-btn-active'
  );
  window.scrollTo(0, 0);
}

function loadCalendarContent() {
  $('.ui-content').load('calendar.html');
  $('#navbar-calendar').addClass('ui-btn-active');
  $('#navbar-home, #navbar-news , #navbar-timetable').removeClass(
    'ui-btn-active'
  );
  window.scrollTo(0, 0);
}

function handleOptions() {
  console.log('ok... from handleOptions()');
  loadHomeContent();
}
