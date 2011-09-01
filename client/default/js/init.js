$fh.ready(function () {

  // Load the menu bar
  setUpMenuBar();

  var tabData = config.tabData;
    
  // Add the text from tabData to the tabs
  setUpTabs(tabData);

  // Bind a click event for each tab
  $('#wrapper .nav_item').each(function () {
    var that = this;
    $(that).bind('click', function (e) {
      var mainTitle = $('.pageTitle').text();
      e.preventDefault();
      var targetId = $(this).find('a').attr('href');

      var title = $(this).find('h2').text();

      $('div').removeClass('button_active');
      $(this).addClass('button_active');
      $('.pageTitle').text(title);

      $('.main_view').hide();
      $(targetId).show();         
   
      // Trigger callback for the tab being shown
      var id = $(this).attr('id'),
          controller = window[id],
          container = $(targetId);
      
      controller.show(container);   
    });
  });
  
  // Bind a special click event for tab 4
  // so it can load data from the  cloud
  $('#cloudDataTab').bind('click', config.show);
  
  // Allow time for the tab bar to load before setting the content height  
  setTimeout(function() {
    setContentPane();
    $('.button_active').trigger('click');
  }, 1000);

});

function setUpMenuBar() {
 // Check prefs to see whenre menu bar should be placed - top or bottom
  var menu_container = $(prefs.menu_container);

  // Get a handle on the hidden menu bar
  var menu = $('#menu');

  // Clone the hidden menu bar into the appropriate container
  menu_container.html(menu.clone());
}

function setContentPane() {
  // Can function in util.js to get the viewport information
  var viewport = getViewport();

  // Work out the space occupied by the header and footer;
  var headerHeight = $('#header').outerHeight();
  var footerHeight = $('#footer').outerHeight();

  // Calculate the content height
  var contentHeight = viewport.height - (headerHeight + footerHeight);

  var hfc = headerHeight + footerHeight + contentHeight;
  
  // Allow for the padding on the content div
  contentHeight = contentHeight - 20;
  $('#content').height(contentHeight);
}

function setUpTabs(tabDataSet) {
/*  

// Iterate over each div defined in the content div.
  // Each of these divs represents a pane for displaying data
  // associated with a specific tab
  $('#content div').each(function(index) {

    // Get the id of the div
    var tabContentId = this.id;

    // Get the data for the div from the config varibale defined in config.js
    var tabData = tabDataSet[tabContentId];  
    
    if( typeof(tabData) !== 'undefined') {
      setTabData($(this), tabData);
    }
  });*/
}

function setTabData(tabContent, tabData) {

  tabContent.html(JSON.stringify(tabData));
  /*
  // Loop over the array of text elements in the tab data
  for(var i = 0; i < tabData.length; i++) {

    // Get the data element from the array
    var paragraphData = tabData[i];

    // Creating a paragraph tag for each data element.
    var paragraph = $('<p>');

    // Add the text to the paragraph tag.
    paragraph.html(paragraphData);

    // Add the paragraph tag to the tabContent
    tabContent.append(paragraph);
  }*/
}

