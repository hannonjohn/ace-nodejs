ace.dom = (function () {

	var keyCodes = {
		mouseRightClick: 3
	};

	return {
		detectExternalClick: function (container, props) {
			if (container.data('detectExternalClick')) return;
			container.data('detectExternalClick', true);
			
			props = props || {};
			
			var hide = (typeof props.hide) == 'undefined' ? false : props.hide;
			var targetContainer = props.targetContainer || container; //when external click detected, cb will only be triggered if targetContainer is visible
			var targetEvent = props.ignoreRightClick ? 'mouseup' : 'click';
			var detected = function () {
				if (hide) container.hide();
				if (props.cb) props.cb();
			};
			
			var externalClick = function (e) {
				var isRightClick = e.which == keyCodes.mouseRightClick;
				var isVisible = targetContainer.is(':visible');
				if (props.ignoreRightClick && isRightClick) return;
				if (isVisible) detected();
			};
			
			container.bind(targetEvent, this.stopPropagation);
			$(document).bind(targetEvent, externalClick);
		},
		stopPropagation: function (e) {
			e.preventDefault();
			if (e.stopPropagation) e.stopPropagation();
			else e.cancelBubble = true;
		},
		disableElem: function (elem) {
			elem.prop('disabled', true);
			elem.addClass('disabled');
		},
		enableElem: function (elem) {
			elem.prop('disabled', false);
			elem.removeClass('disabled');
		},
		scrollToTopOfPage: function (cb) {
			$('html, body').animate({ scrollTop: 0 }, 500, 'swing', cb);
		}
	};
})();
