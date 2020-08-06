ace.nav = (function () {
	var init = function () {
		var scrollTopLnks = $('.scrollTopLnk');
		var headerMain = $('header.main');
		var bodyContentContainer = $('.bodyWrapper .bodyContent');
		var footerMain = $('footer.main');
		var footerLinks = footerMain.find('.lnk');
		var navMain = headerMain.find('nav.main');
		var navLinks = headerMain.find('.lnk');
		var mainLIs = navMain.find('li.main');
		var actionShowMenu = navMain.find('.actionShowMenu');
		var liWithSubMenu = mainLIs.filter('.withSubMenu');
		var subMenu = navMain.find('ul.subMenu');
		
		var toggleMenu = function () { navMain.toggleClass('showMenu'); };
		var toggleSubMenu = function () { liWithSubMenu.toggleClass('showSubMenu'); };
		var hideSubMenu = function () { liWithSubMenu.removeClass('showSubMenu'); };
		var gotoPage = function (page) { if (page.page != ace.currentPage.page) ace.page.get(page); };
		var parsePageAttr = function (link) { return JSON.parse(link.attr('page')); };

		var scrollTopClick = function (e) {
			ace.dom.scrollToTopOfPage();
			ace.dom.stopPropagation(e);
		};

		var bindNavLinkClick = function (link) {
			if (link.hasClass('nolnk')) return;

			link.click(function (e) {
				ace.dom.stopPropagation(e);
				ace.dom.scrollToTopOfPage();
				gotoPage(parsePageAttr(link));
				hideSubMenu();
			});
		};

		var bindNavLink = function (i, lnk) { bindNavLinkClick($(lnk)); };

		var setNavLinkSelected = function (page) {
			mainLIs.removeClass('selected');
			navLinks.each(function (i, lnk) {
				var link = $(lnk);
				if (link.hasClass('nolnk')) return;
				if (parsePageAttr(link).page != page.page) return;
				link.parents('li.main:first').addClass('selected');
			});
		};

		var bindBodyLinks = function () {
			bodyContentContainer.find('.lnk').each(bindNavLink);
		};

		var currentPageChanging = function (page) {
			hideSubMenu();
			setNavLinkSelected(page);
		};

		var currentPageChanged = function () {
			bindBodyLinks();
		};
		
		ace.events.on('currentPageChanging', function (e, page) { currentPageChanging(page); });
		ace.events.on('currentPageChanged', function (e, page) { currentPageChanged(page); });

		scrollTopLnks.click(scrollTopClick);
		actionShowMenu.click(toggleMenu);
		liWithSubMenu.click(toggleSubMenu);
		ace.dom.detectExternalClick(liWithSubMenu, { targetContainer: subMenu, cb: toggleSubMenu, ignoreRightClick: true });
		navLinks.each(bindNavLink);
		footerLinks.each(bindNavLink);
	};

	return { init: init };
})();