module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        simplemocha: {
//            options: {
//                globals: ['should'],
//                timeout: 3000,
//                ignoreLeaks: false,
//                grep: '*-test',
//                ui: 'bdd',
//                reporter: 'tap'
//            },

            all: { src: 'test.js' }
        },

        watch: {
            files: ['*.js', 'fixtures/*'],
            tasks: ['simplemocha']
        }
    });

    grunt.loadNpmTasks('grunt-simple-mocha');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['simplemocha']);

};