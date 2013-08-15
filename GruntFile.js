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


		}

	});

// Load plugins
	grunt.loadNpmTasks('grunt-contrib-jshint');

// Default task(s).
	grunt.registerTask('default', ['jshint']);


}
;