"use strict";
module.exports = function (grunt) {

    // Set global variables based on project
    var globalConfig = {
        // Set project root path
        root: './'
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        globalConfig: globalConfig,

        // Empties folders to start fresh
        clean: {
            dest: '<%= globalConfig.root %>dist/'
        },

        copy: {
            all: {
                expand: true,
                cwd: '<%= globalConfig.root %>src/',
                src: '**',
                dest: 'dist/'
            }
        },

        // Watches these files and runs their task on save.
        watch: {
            options: {
                livereload: true,
                host: 'localhost',
                port: 5000
            },
            configFiles: {
                files: ['gruntfile.js'],
                tasks: ['default']
            },
            site: {
                files: ['**/*'],
                tasks: ['default']
            }
        }
    });

// Used in place of the grunt require statements.
    require('load-grunt-tasks')(grunt);
// Outputs a summary of what happened in the terminal.
    require('time-grunt')(grunt);

    // ========= // CREATE TASKS =========
    grunt.registerTask('default', [
        'clean',
        'copy',
        'watch'
    ]);
};
