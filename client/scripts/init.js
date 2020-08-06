ace.init = function () {
	ace.events = $('<div id="eventAggregator"></div>');
	ace.nav.init();
	ace.page.init();
	$('html').addClass('browser_' + ace.browser.getBrowserName(true));
};