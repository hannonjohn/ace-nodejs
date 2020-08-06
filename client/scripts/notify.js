ace.notify = (function () {
	var mainContainer, allContainers;

	var type = {
		success: 'success',
		error: 'error',
		warn: 'warn'
	};

	var containers = {
		success: null,
		error: null,
		warn: null
	};

	var initContainers = function () {
		mainContainer = $('.notificationWrapper');
		allContainers = mainContainer.find('.notification');
		containers.success = allContainers.filter('.success');
		containers.error = allContainers.filter('.error');
		containers.warn = allContainers.filter('.warn');
	};

	var show = function (props) {
		if (!mainContainer) initContainers();
		allContainers.hide();
		var container = containers[props.type];
		container.find('.title').text(props.title);
		container.find('.msg').text(props.msg);
		container.fadeIn(null, function () {
			setTimeout(function () { container.fadeOut(); }, 5000);
		});
	};

	return {
		success: function (title, msg) { show({ type: type.success, title: title, msg: msg }); },
		error: function (title, msg) { show({ type: type.error, title: title, msg: msg }); },
		warn: function (title, msg) { 

			show({ type: type.warn, title: title, msg: msg }); 
		}
	};
})();