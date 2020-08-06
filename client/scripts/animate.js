ace.animate = (function () {
	var animateInContainersDone = {};
	var animateDuration = 1000;
	var animateInClass = 'animate-in';
	var mainContainer;

	var getAnimateInContainers = function () { return mainContainer.find('.' + animateInClass); };

	var animateInContainers = function () {
		var containers = getAnimateInContainers();

		if (animateInContainersDone[ace.currentPage.page]) {
			containers.fadeIn(animateDuration);
			return;
		}

		getAnimateInContainers().each(function (i) {
			$(this).delay(animateDuration * i).fadeIn(animateDuration);
		});

		animateInContainersDone[ace.currentPage.page] = true;
	};

	var init = function () {
		mainContainer = $('.bodyWrapper .bodyContent');
	};

	var trigger = function () {
		if (!mainContainer) init();
		animateInContainers();
	};

	return { triggerPageAnimations: trigger };
})();