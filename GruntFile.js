module.exports = function(grunt) {

	var node_js_files = ['**/*.js',
			'!node_modules/**/*.js',
			'!public/**/*.js' ],

		client_js_files = ['public/js/**/*.js',
			'!public/js/lib/**/*.js',
			'!public/js/module.js',
			'!public/js/templates.js' ],

		client_js_lib_files = ['public/js/lib/underscore.js',
			'public/js/lib/handlebars.js',
			'public/js/lib/backbone.js',
			'public/js/lib/moment.js',
			'!public/js/lib/lib.js'],

		handlebars_templates = 'public/js/template/**/*.handlebars',

		less_files = ['public/less/**/*.less'];

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),


		jshint: {
			node: {
				options: grunt.file.readJSON('.jshintrc'),
				files: {
					src: node_js_files
				}
			},
			client: {
				options: grunt.file.readJSON('public/js/.jshintrc'),
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
			lib: {
				src: client_js_lib_files,
				dest: 'public/js/lib/lib.js'
			}
		},

		uglify: {
			prod: {
				options: {
					mangle: false,
					compress: true,
					report: 'gzip',
					banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
						'<%= grunt.template.today("dd-mm-yyyy") %> */'
				},
				files: [
					{'public/js/module.js': 'public/js/module.js'},
					{'public/js/lib/lib.js': 'public/js/lib/lib.js'}
				]
			}
		},

		handlebars: {
			compile: {
				options: {
					commonjs: true,
					processName: function(path) {
						var pieces = path.split('/');
						return pieces[pieces.length - 1].replace('.handlebars', '');
					}
				},
				files: {
					'public/js/templates.js': handlebars_templates
				}
			}
		},

		watch: {
			node_js: {
				tasks: 'jshint:node',
				files: node_js_files
			},
			client_js: {
				tasks: ['jshint:client', 'browserify'],
				files: client_js_files
			},
			handlebars_templates: {
				tasks: ['jshint:client', 'handlebars', 'browserify'],
				files: handlebars_templates
			},
			client_js_lib: {
				tasks: ['concat:lib'],
				files: client_js_lib_files
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
	grunt.loadNpmTasks('grunt-contrib-handlebars');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');


	//Development
	grunt.registerTask('default', ['jshint', 'less:dev', 'handlebars', 'browserify']);

	//Release
	grunt.registerTask('release', ['jshint', 'less:prod', 'handlebars', 'browserify', 'concat:lib', 'uglify:prod']);


};