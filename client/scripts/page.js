ace.page = (function () {

	var bodyWrapper, bodyContent, bodyBackground, footer;
	var pages = ace.props.pages;
	var fadeDuration = 500;

	var isHomepage = function (page) { return page.page == pages.home.page; };
	var buildUrl = function (page) { return ace.props.urlRelative + (isHomepage(page) ? '' : page.page); };
	var buildTitle = function (page) { return [ace.props.pageTitle, page.title].join(' - '); };

	var setPushState = function (page, replace) {
		if (!Modernizr.history) return;

		var title = buildTitle(page);
		var url = buildUrl(page);

		if (replace) history.replaceState({ page: page }, title, url);
		else history.pushState({ page: page }, title, url);
	};

	var pageShown = function (page) {
		bodyWrapper.css({'min-height': ($(window).height() - 50)});
		footer.show();
		ace.currentPage = page;
		ace.events.trigger('currentPageChanged', page);
		document.title = buildTitle(page);

		switch (page.page) {
			case pages.contact.page:
				ace.contact.init();
				break;
			case pages.home.page:
				ace.animate.triggerPageAnimations();
				break;
		}
	};

	var showNewBackground = function (page) {
		bodyBackground.removeClass(ace.currentPage.backgroundClass).addClass(page.backgroundClass);
	};

	var getAnimateDuration = function (page) {
		return page.animate ? 0 : fadeDuration;
	};

	var gotPage = function (html, page) {
		var haveNewBackground = ace.currentPage.backgroundClass != page.backgroundClass;

		bodyContent.fadeOut(fadeDuration, function () {
			ace.events.trigger('currentPageChanging', page);
			bodyContent.html(html);
			bodyContent.fadeIn(getAnimateDuration(page), pageShown.bind(this, page));
			if (haveNewBackground) showNewBackground(page);
		});
	};

	var getPage = function (page, dontPushIt) {
		if (!dontPushIt) setPushState(page);

		ace.ajax.httpGet({
			url: 'partials' + buildUrl(page),
			success: function (html) { gotPage(html, page); }
		});
	};

	var onPopState = function (e) {
		if (!e.state || !e.state.page || e.state.page.page == ace.currentPage.page) return true;
		getPage(e.state.page, true);
	};

	var init = function () {
		bodyWrapper = $('.bodyWrapper');
		bodyContent = bodyWrapper.find('.bodyContent:first');
		bodyBackground = bodyWrapper.find('.bodyBackground:first');
		footer = $('footer.main:first');

		ace.events.trigger('currentPageChanging', ace.currentPage);
		setPushState(ace.currentPage, true);
		pageShown(ace.currentPage);
		window.onpopstate = onPopState;
	};

	return {
		get: getPage,
		init: init
	};
})();