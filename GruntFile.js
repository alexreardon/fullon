module.exports = function(grunt) {

	var options = grunt.file.readJSON('.jshintrc'),
		options_client = JSON.parse(JSON.stringify(options));

	options_client.predef.push('_', 'moment', 'window');

	var node_js_files = ['**/*.js',
			'!node_modules/**/*.js',
			'!public/**/*.js' ],

		client_js_files = ['public/js/**/*.js',
			'!public/js/lib/**/*.js',
			'!public/js/module.js',
			'!public/js/build.js' ],

		client_js_lib_files = ['public/js/lib/underscore.js',
			'public/js/lib/jquery.js',
			'public/js/lib/handlebars.js',
			'public/js/lib/backbone.js',
			'public/js/lib/moment.js'],

		less_files = ['public/less/**/*.less'];

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),


		jshint: {
			node: {
				options: options,
				files: {
					src: node_js_files
				}
			},
			client: {
				options: options_client,
				files: {
					src: client_js_files
				}
			}
		},

		less: {
			dev: {
				files: {
					'public/css/build.css': 'public/less/main.less'
				}
			},
			prod: {
				files: {
					'public/css/build.css': 'public/less/main.less'
				},
				options: {
					yuicompress: true
				}
			}
		},

		browserify: {
			files: {
				src: client_js_files,
				dest: 'public/js/module.js'
			}
		},

		concat: {
			dist: {
				src: client_js_lib_files.slice(0).push('public/js/module.js'),
				dest: 'public/js/build.js'
			}
		},

		uglify: {
			//dev: {

			prod: {
				options: {
					mangle: false,
					compress: true,
					report: 'gzip',
					banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
						'<%= grunt.template.today("dd-mm-yyyy") %> */'
				},
				files: {
					'public/js/build.js': ['public/js/build.js']
				}
			}
		},

		watch: {
			node_js: {
				tasks: 'jshint:node',
				files: node_js_files
			},
			client_js: {
				tasks: ['jshint:client', 'browserify', 'concat'],
				files: client_js_files
			},
			css: {
				tasks: ['less:dev'],
				files: less_files
			}

		}



	});

	//Load plugins
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');


	//Development
	grunt.registerTask('default', ['jshint', 'less:dev', 'browserify', 'concat']);

	//Release
	grunt.registerTask('release', ['jshint', 'less:prod', 'browserify', 'concat', 'uglify:prod']);


};