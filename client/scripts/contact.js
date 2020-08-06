ace.contact = (function () {
	var form, btnSend;
	var showPlaceholderClass = 'showPlaceholder';

	var inputHasVal = function (input) { return $.trim(input.val()).length; };

	var trySetPlaceholder = function (input) {
		if (inputHasVal(input)) return;
		var inpWrpr = input.parent();
		input.attr('placeholder', input.data('placeholder'));
		inpWrpr.removeClass(showPlaceholderClass);
	};

	var tryClearPlaceholder = function (input) {
		if (!inputHasVal(input)) return;
		var inpWrpr = input.parent();
		input.attr('placeholder', '');
		inpWrpr.addClass(showPlaceholderClass);
	};

	var keyup = function () { tryClearPlaceholder($(this)); };
	var blur = function () { trySetPlaceholder($(this)); };

	var bindFormInputs = function () {
		form.find('.txt').each(function (i, inp) {
			var input = $(inp);
			input.keyup(keyup);
			input.blur(blur);
			input.data('placeholder', input.attr('placeholder'));
		});
	};

	var reset = function () {
		form.get(0).reset();
		form.find('.txt').each(function (i, inp) {
			trySetPlaceholder($(inp));
		});
	};

	var send = function () {
		ace.ajax.httpPost({
			url: 'contact',
			sendingJSON: true,
			params: form.serializeObject(),
			blockContainer: btnSend,
			success: function () {
				ace.dom.scrollToTopOfPage(function () {
					ace.notify.success('Thanks', 'We\'ll send you a copy');
					reset();
				});
			},
			error: function () {
				ace.dom.scrollToTopOfPage(function () {
					ace.notify.error('Sorry', 'Something went wrong');
				});
			}
		});
	};

	var bindFormSubmit = function () {
		form.submit(function () {
			send(form);
			return false;
		});
	};

	var init = function () {
		form = $('form.contact');
		btnSend = form.find('.btn.send');
		bindFormInputs();
		bindFormSubmit();
	};

	return {
		init: init
	};
})();