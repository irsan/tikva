module.exports = function (grunt) {

    grunt.initConfig({
        nodemon: {
            all: {
                script: './slack.js',
                options: {
                    watchedExtensions: ['js'],
                    env : {
                        PORT : '3000'
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-nodemon');
    grunt.registerTask('default', 'nodemon');
};