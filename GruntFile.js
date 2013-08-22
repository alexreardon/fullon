module.exports = function(grunt) {

	var options = grunt.file.readJSON('.jshintrc'),
		options_client = JSON.parse(JSON.stringify(options));

	options_client.predef.push('_', 'moment', 'window');

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),


		jshint: {
			node: {
				options: options,
				files: {
					src: ['**/*.js', '!node_modules/**/*.js', '!public/**/*.js' ]
				}
			},
			client: {
				options: options_client,
				files: {
					src: ['public/js/**/*.js', '!public/js/lib/**/*.js' ]
				}
			}


		},

		less: {
			development: {
				files: {
					'public/css/main.css': 'public/less/main.less'
				}
			}
		}

	});

	//Load plugins
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-less');


	//Everything
	grunt.registerTask('default', ['jshint', 'less']);

	//Client Only

}
;