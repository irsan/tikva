module.exports = function (grunt) {

    grunt.initConfig({
        nodemon: {
            all: {
                script: './bin/www',
                options: {
                    watchedExtensions: ['js'],
                    ignore : ['public/**'],
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