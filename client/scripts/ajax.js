ace.ajax = (function () {

	var success = function (response, props, xhr) {
		if (props.blockContainer) props.blockContainer.prop('disabled', false);
		var haveErrorMessage = response && response.errorMessage && response.errorMessage.length > 0;
		var haveWarnMessage = response && response.warnMessage && response.warnMessage.length > 0;
		
		if (haveErrorMessage || haveWarnMessage) {
			if (!props.suppressErrorMessage) {
				if (haveErrorMessage) ace.notify.error(response.errorMessage);
				else if (haveWarnMessage) ace.notify.warn(response.warnMessage);
			}
			if (props.error) props.error(xhr);
		} else if (props.success) props.success(response);
	};

	var error = function (xhr, props) {
		if (props.blockContainer) props.blockContainer.prop('disabled', false);
		
		if (xhr.status == 403) {
			if (ace.props.env || props.method != 'GET') {
				ace.notify.error(xhr.statusText);
			}
		} else if (props.handleUnknownError) {
			ace.notify.error('Sorry, something went wrong');
			if (props.error) props.error(xhr);
		} else if (props.error) props.error(xhr);
	};
		
	var httpSend = function (props) {
		if (!props.absoluteUrl) props.url = ace.props.urlRelative + props.url;
		
		var ajaxProps = {
			url: props.url,
			type: props.method,
			async: (typeof props.async) == 'undefined' ? true : props.async,
			cache: (typeof props.cache) == 'undefined' ? false : props.cache,
			success: function (response, textStatus, xhr) { success(response, props, xhr); },
			error: function (xhr) { error(xhr, props); },
			dataType: (typeof props.dataType) == 'undefined' ? null : props.dataType,
			jsonpCallback: (typeof props.jsonpCallback) == 'undefined' ? null : props.jsonpCallback,
			traditional: true
		};
		
		if (props.sendingJSON) {
			ajaxProps.contentType = 'application/json; charset=utf-8';
			ajaxProps.data = JSON.stringify(props.params);
		} else ajaxProps.data = props.params;
		
		var doSend = function () {
			if (props.blockContainer) props.blockContainer.prop('disabled', true);
			return $.ajax(ajaxProps);
		};
		
		return doSend();
	};
		
	return {
		httpPost: function (props) {
			props.method = 'POST';
			return httpSend(props);
		},
		httpPut: function (props) {
			props.method = 'PUT';
			return httpSend(props);
		},
		httpGet: function (props) {
			props.method = 'GET';
			return httpSend(props);
		},
		httpDelete: function (props) {
			props.method = 'DELETE';
			return httpSend(props);
		}
	};
})();