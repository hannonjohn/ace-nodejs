var _ = require('lodash');

var mainPages = {
	home: {
		page: 'home',
		path: 'home',
		title: 'Home',
		animate: true,
		backgroundClass: 'roof'
	},
	about: {
		page: 'about',
		path: 'about',
		title: 'About Us',
		backgroundClass: 'roof'
	},
	contact: {
		page: 'contact',
		path: 'contact',
		title: 'Contact',
		backgroundClass: 'roof'
	},
	404: {
		page: '404',
		path: '404',
		title: '404 Not Found',
		backgroundClass: 'roof'
	}
};

var servicePages = {
	structuralAnalysisAndDesign: {
		page: 'services/structural-analysis-&-design',
		path: 'services/structuralAnalysisAndDesign',
		title: 'Structural Analysis & Design',
		backgroundClass: 'structural'
	},
	telecomsStructuralEngineering: {
		page: 'services/telecoms-structural-engineering',
		path: 'services/telecomsStructuralEngineering',
		title: 'Telecoms Structural Engineering',
		backgroundClass: 'telecoms'
	},
	technicalAdvisoryAndComplianceServices: {
		page: 'services/technical-advisory-&-compliance',
		path: 'services/technicalAdvisoryAndCompliance',
		title: 'Technical, Advisory & Compliance',
		backgroundClass: 'compliance'
	}
};

module.exports = {
	mainPages: mainPages,
	servicePages: servicePages,
	allPages: _.extend(mainPages, servicePages)
};