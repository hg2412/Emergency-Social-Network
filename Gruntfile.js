module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        jshint: {
            files: ['controllers/**/*.js', 'helpers/**/*.js', 'models/**/*.js'],
            options: {
                "node": true,
                'esversion': 6
            }
        },
        mochaTest: {
          local: {
            options: {
              reporter: 'spec',
              //captureFile: 'results.txt', // Optionally capture the reporter output to a file
              quiet: false, // Optionally suppress output to standard out (defaults to false)
              clearRequireCache: false, // Optionally clear the require cache before running tests (defaults to false)
              ui: 'bdd'
            },
            src: ['tests/**/*.js']
          },
          

        },
        mocha_istanbul: {
            coverage: {
                src: 'tests', // a folder works nicely
                options: {
                    mochaOptions: ['--ui', 'tdd'] // any extra options for mocha
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
   // grunt.loadNpmTasks('grunt-mocha');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-mocha-istanbul');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Default task(s).
    grunt.registerTask('default', []);

    //Test
    grunt.registerTask('test', ['mochaTest:local', 'mocha_istanbul']);

    // Shippable
  //  grunt.registerTask('shippable', ['mochaTest:shippable', 'mocha_istanbul']);

    //Coverage
    grunt.registerTask('coverage', ['mocha_istanbul']);

    //static analysis
    grunt.registerTask('static-analysis', ['jshint']);


};