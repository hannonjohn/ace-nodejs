var express = require('express');
var app = express();

var _ = require('lodash');
var fs = require('fs');
var bodyParser = require('body-parser');
var bowerJSON = require('../bower.json');
var config = require('../config');
var contact = require('./modules/contact');
var pages = require('./modules/pages');

var envPORT = process.env.PORT || 3000;
var envPRODUCTION = process.env.NODE_ENV == 'production';

console.log('envPRODUCTION: ' + envPRODUCTION);

var appVersion = bowerJSON.version;
var appFullName = bowerJSON.fullName;
var appName = bowerJSON.name;
var appNameLowercase = appName.toLowerCase();

var pageTitle = envPRODUCTION ? appFullName : 'ACE (DEV)';

var path = require('path');
var pathRoot = path.join(__dirname, '../');
var pathViews = path.join(pathRoot, 'views');
var pathClient = path.join(pathRoot, 'client');
var pathStatic = path.join(pathClient, envPRODUCTION ? appVersion : '');
var pathImages = path.join(pathStatic, 'images');
var pathLogos = path.join(pathImages, 'logos/originals');
var pathFavicon = path.join(pathImages, 'favicons/favicon.ico');

var robotsTxt = fs.readFileSync(path.join(pathRoot, 'robots.txt'), 'utf8');
var humansTxt = fs.readFileSync(path.join(pathRoot, 'humans.txt'), 'utf8');
var sitemapXml = fs.readFileSync(path.join(pathRoot, 'sitemap.xml'), 'utf8');

var urlRelative = '/';
var urlStaticRelative = urlRelative + 'static/' + (envPRODUCTION ? (appVersion + '/') : '');

var staticResourceRegex = /(.*?)\.(js|css|jpg|jpeg|gif|png|ico|svg|eot|ttf|woff)$/i;

var renderTemplate = function (res, page) {
	res.render(page.path, { currentPage: page } );
};

var setHeadersForCacheable = function (res, pth) {
	if (!envPRODUCTION) return;
	if (!staticResourceRegex.test(pth)) return;
	res.set({ 'Cache-Control': 'public, max-age=' + config.staticResourceMaxAge_seconds });
};

app.use(bodyParser.json());
app.set('view engine', 'jade');
app.set('views', pathViews);
app.use(require('serve-favicon')(pathFavicon));

app.get(urlRelative + 'robots.txt', function (req, res) { res.type('text/plain').send(robotsTxt); });
app.get(urlRelative + 'humans.txt', function (req, res) { res.type('text/plain').send(humansTxt); });
app.get(urlRelative + 'sitemap.xml', function (req, res) { res.type('text/xml').send(sitemapXml); });

app.get(urlRelative + 'logo-:type', function (req, res, next) {
	var type = req.params.type ? req.params.type.toLowerCase() : '';
	
	if (_.includes(['colour', 'black', 'white'], type)) {
		var pathLogo = path.join(pathLogos, 'logo-' + type + '.png');
		var file = fs.readFileSync(pathLogo);
		res.type('image/png');
		res.send(file);
	}
	else next();
});

app.get(urlRelative + ':page?', function (req, res, next) {
	var page = req.params.page ? req.params.page.toLowerCase() : 'home';
	var mainPage = _.find(pages.mainPages, { page: page });
	
	if (mainPage) renderTemplate(res, mainPage);
	else next();
});

app.get(urlRelative + pages.servicePages.structuralAnalysisAndDesign.page, function (req, res) {
	renderTemplate(res, pages.servicePages.structuralAnalysisAndDesign);
});
app.get(urlRelative + pages.servicePages.telecomsStructuralEngineering.page, function (req, res) {
	renderTemplate(res, pages.servicePages.telecomsStructuralEngineering);
});
app.get(urlRelative + pages.servicePages.technicalAdvisoryAndComplianceServices.page, function (req, res) {
	renderTemplate(res, pages.servicePages.technicalAdvisoryAndComplianceServices);
});

app.get(urlRelative + 'partials/:page?/:child?', function (req, res, next) {
	var page = req.params.page ? req.params.page.toLowerCase() : 'home';
	var child = req.params.child ? req.params.child.toLowerCase() : '';
	var mainPage = _.find(pages.mainPages, { page: page });
	var servicePage = _.find(pages.servicePages, { page: 'services/' + child });

	if (mainPage) res.render('partials/' + mainPage.path);
	else if (page == 'services' && servicePage) res.render('partials/' + servicePage.path);
	else next();
});

app.post(urlRelative + 'contact', function (req, res, next) {
	contact.sendMessage(req.body, function (success) {
		if (success) return res.status(200).send('success');
		else return res.status(500).send('fail');
	});
});

app.use(urlStaticRelative, express.static(pathStatic, { setHeaders: setHeadersForCacheable}));

app.get('*', function (req, res) {
	res.status(404);
	renderTemplate(res, pages.mainPages['404']);
});

app.locals = {
	appFullName: appFullName,
	appName: appName,
	appNameLowercase: appNameLowercase,
	appDescription: 'Allied Consultant Engineering provides high quality structural engineering services to infrastructure and building owners.',
	appKeywords: 'Structural Engineering,Structural Engineering Telecoms,Structural Engineering Telecommunications,Structural Design,Chartered Structural Engineer,Telecoms',
	canonicalUrl: config.canonicalUrl,
	contactEmail: config.toEmailAddress,
	jsProps: {
		appVersion: appVersion,
		pages: pages.allPages,
		pageTitle: pageTitle,
		processEnv: process.env,
		urlRelative: urlRelative,
		urlStaticRelative: urlStaticRelative
	},
	labJSScript: fs.readFileSync(path.join(pathClient, 'lib/labjs/lab.min.js'), 'utf8'),
	mainPages: pages.mainPages,
	pageTitle: pageTitle,
	servicePages: pages.servicePages,
	urlRelative: urlRelative,
	urlStaticRelative: urlStaticRelative
};

module.exports = app;
app.listen(envPORT);
console.log([appName, 'Express server listening on port', envPORT].join(' '));