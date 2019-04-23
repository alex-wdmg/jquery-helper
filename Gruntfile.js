/*!
 * Main gruntfile
 * Homepage: https://wdmg.com.ua/
 * Author: Vyshnyvetskyy Alexsander (alex.vyshyvetskyy@gmail.com)
 * Copyright 2019 W.D.M.Group, Ukraine
 * Licensed under MIT
*/

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            helper: {
                src: [
                    'build/helper.js'
                ],
                dest: 'dist/jquery.helper.js'
            },
            touch: {
                src: [
                    'build/touch.js'
                ],
                dest: 'dist/jquery.touch.js'
            }
        },
        uglify: {
            helper: {
                options: {
                    sourceMap: true,
                    sourceMapName: 'dist/jquery.helper.js.map'
                },
                files: {
                    'dist/jquery.helper.min.js': ['dist/jquery.helper.js']
                }
            },
            touch: {
                options: {
                    sourceMap: true,
                    sourceMapName: 'dist/jquery.touch.js.map'
                },
                files: {
                    'dist/jquery.touch.min.js': ['dist/jquery.touch.js']
                }
            }
        },
        watch: {
            scripts: {
                files: ['build/helper.js', 'build/touch.js'],
                tasks: ['concat', 'uglify'],
                options: {
                    spawn: false
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['concat', 'uglify', 'watch']);
};