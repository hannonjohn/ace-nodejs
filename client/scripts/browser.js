ace.browser = (function () {

	var browserInfo = function() {
		var userAgent = navigator.userAgent.toLowerCase();
		var browserAppVersion = navigator.appVersion;

		return {
			IsIE7: (new RegExp('MSIE 7.')).test(browserAppVersion),
			IsIE8: (new RegExp('MSIE 8.')).test(browserAppVersion),
			IsIE9: (new RegExp('MSIE 9.')).test(browserAppVersion),
			IsIE10: (new RegExp('MSIE 10.')).test(browserAppVersion),
			IsIE11: !!navigator.userAgent.match(/Trident.*rv[ :]*11\./),
			IsEdge: (new RegExp('edge')).test(userAgent),
			IsChrome: (new RegExp('chrome')).test(userAgent),
			IsFirefox: (new RegExp('firefox')).test(userAgent),
			IsSafari: (new RegExp('safari')).test(userAgent) && !this.IsChrome
		};
	};

	var isiOSDevice = function () {
		var userAgent = navigator.userAgent.toLowerCase();
		return (userAgent.indexOf('iphone') > -1 || userAgent.indexOf('ipad') > -1); 
	};

	var operatingSystemInfo = function() {
		var userAgent = navigator.userAgent.toLowerCase();

		return {
			IsMacOs: (new RegExp('macintosh')).test(userAgent),
			IsWindows: (new RegExp('windows')).test(userAgent),
			IsiOSDevice: isiOSDevice()
		};
	};

	return {
		getBrowserName : function (excludeVersionNumber) {
			var browser = browserInfo();
			if (browser.IsEdge) return 'Edge';
			if (browser.IsChrome) return 'Chrome';
			if (browser.IsFirefox) return 'Firefox';
			if (browser.IsSafari) return 'Safari';

			var browserName = null;
			if (browser.IsIE7) browserName = 'IE_7';
			if (browser.IsIE8) browserName = 'IE_8';
			if (browser.IsIE9) browserName = 'IE_9';
			if (browser.IsIE10) browserName = 'IE_10';
			if (browser.IsIE11) browserName = 'IE_11';
			if(excludeVersionNumber) return browserName.substr(0, browserName.indexOf('_'));
			else return browserName;
		},
		browserIsIE: function () {
			return this.getBrowserName(true) == 'IE' || this.getBrowserName(true) == 'Edge';
		},
		getOSName: function () {
			var os = operatingSystemInfo();
			if(os.IsiOSDevice) return 'iOS';
			if(os.IsMacOs) return 'Mac';
			if(os.IsWindows) return 'Windows';
		},
		isiOSDevice: isiOSDevice
	};
})();