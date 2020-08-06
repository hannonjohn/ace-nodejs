module.exports = function (grunt) {
	
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
	
	var bowerJSON = grunt.file.readJSON('bower.json');
	var appVersion = bowerJSON.version;
	var appName = bowerJSON.name.toLowerCase();
	var bowerRC = grunt.file.readJSON('.bowerrc');
	var bowerDir = bowerRC.directory;
	var modernizrFile = bowerDir + '/modernizr-custom.min.js';
	var lab_dir = bowerDir + '/labjs/';

	var externalJSFiles = [
		bowerDir + '/jquery/dist/jquery.min.js',
		bowerDir + '/lodash/dist/lodash.min.js',
		bowerDir + '/jQuery.serializeObject/dist/jquery.serializeObject.min.js',
		modernizrFile
	];

	var gruntConfig = {
		_options: {
			appVersion: appVersion,
			appName: appName,
			bowerDir: bowerDir,
			modernizrFile: modernizrFile,
			externalJSFiles: externalJSFiles,
			lab_dir: lab_dir
		},
		auto_install: {
			dist: {
				options: { cwd: 'dist', npm: '--production', bower: false }
			}
		},
		clean: {
			options: { force: true },
			main: ['dist', '*.zip']
		},
		compress: {
			main: {
				options: {
					mode: 'zip',
					archive: '<%=_options.appName%>-<%=_options.appVersion%>.zip'
				},
				files: [
					{ expand: true, cwd: 'dist/', src: ['**'] }
				]
			}
		},
		concat: {
			internal: { files: { 'client/scripts/<%=_options.appName%>-internal.js': ['client/scripts/**/*.js', '!client/scripts/<%=_options.appName%>-*.js'] } },
			external: { files: { 'client/scripts/<%=_options.appName%>-external.js': '<%=_options.externalJSFiles%>' } }
		},
		copy: {
			client: {
				expand: true,
				cwd: 'client/',
				src: ['scripts/*.min.js', 'styles/*.min.css', 'images/**'],
				dest: 'dist/client/<%=_options.appVersion%>/'
			},
			server: {
				expand: true,
				cwd: '',
				src: ['server/**', 'views/**', 'humans.txt', 'robots.txt', 'bower.json', 'package.json', 'config.json', 'awsConfig.json', 'sitemap.xml'],
				dest: 'dist/'
			},
			lab: {
				expand: true,
				cwd: '<%=_options.lab_dir%>',
				src: 'lab.min.js',
				dest: 'dist/<%=_options.lab_dir%>'
			},
		},
		env : {
			dev: { NODE_ENV : 'development' },
			dist: { NODE_ENV : 'production' }
		},
		express: {
			dev: { options: { script: 'server/main.js' } },
			dist: { options: { script: 'dist/server/main.js' } }
		},
		jshint: {
			options: {
				reporter: require('jshint-stylish'),
				jshintrc: true
			},
			dev: ['client/scripts/**/*.js', '!client/scripts/<%=_options.appName%>-*.js']
		},
		less: {
			main: {
				options: {
					strictMath: true,
					compress: true,
					outputSourceFiles: true
				},
				files: { 'client/styles/<%=_options.appName%>.min.css': 'client/styles/main.less' }
			}
		},
		modernizr: {
			main: {
				files : { 'src': ['client/scripts/**/*.*', '!client/scripts/<%=_options.appName%>-*.js'] },
				dest : '<%=_options.modernizrFile%>'
			}
		},
		open: {
			dev: { path: 'http://localhost:3000/', app: 'Chrome' }
		},
		uglify: {
			options: { mangle: false, sourceMap: true, compress: { drop_debugger: false } },
			internal: { files: { 'client/scripts/<%=_options.appName%>-internal.min.js': ['client/scripts/<%=_options.appName%>-internal.js'] } },
			external: { files: { 'client/scripts/<%=_options.appName%>-external.min.js': ['client/scripts/<%=_options.appName%>-external.js'] } }
		},
		watch: {
			server: { files: ['server/**/*.*'], tasks: ['express:dev'], options: { spawn: false } },
			scripts: { files: ['client/scripts/**/*.js', '!client/scripts/<%=_options.appName%>-*.js'], tasks: ['scripts:internal'] },
			styles: { files: ['client/styles/**/*.less'], tasks: ['less'] },
			views: { files: ['views/**/*.*'] }
		}
	};

	grunt.registerTask('concat:all', ['concat:internal', 'concat:external']);
	grunt.registerTask('uglify:all', ['uglify:internal', 'uglify:external']);
	grunt.registerTask('scripts:internal', ['concat:internal', 'uglify:internal']);
	grunt.registerTask('scripts:all', ['modernizr', 'concat:all', 'uglify:all']);
	grunt.registerTask('copy:all', ['copy:client', 'copy:server', 'copy:lab']);
	grunt.registerTask('build', ['less', 'jshint', 'scripts:all']);
	grunt.registerTask('dev', ['build', 'run']);
	grunt.registerTask('dist', ['clean', 'build', 'copy:all', 'auto_install']);
	grunt.registerTask('run', ['env:dev', 'express:dev', 'open', 'watch']);
	grunt.registerTask('runDist', ['env:dist', 'express:dist', 'open', 'watch']);
	grunt.registerTask('testDist', ['dist', 'runDist'])
	grunt.registerTask('release', ['dist', 'compress']);
	grunt.registerTask('default', 'dev');

	grunt.initConfig(gruntConfig);
};