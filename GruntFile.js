module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
          development: {
            options: {
              compress: true,
              yuicompress: true,
              optimization: 2
            },
            files: {
              "src/css/index.css": "src/css/index.less" // destination file and source file
            }
          }
        },
        cssmin: {
            options: {
                banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
            },
            build: {
                files: {
                    'dist/index.min.css': ['src/css/normalize.css', 'src/css/index.css']
                }
            }
        },
        htmlbuild: {
            dist: {
                src: ['src/index.html', 'src/email.html'],
                dest: 'dist/'
            }
        },
        browserify: { //makes all src js files usable in browser
            dist: {
                options: {
                    transform: [['babelify', {presets: ['es2015', 'react']}]]
                },
                src: ['src/**/*.js'],
                dest: 'dist/index.js',
            }
        },
        watch: {
            scripts: {
                files: ['src/**/*.js'],
                tasks: ['browserify']
            },
            css: {
                files: 'src/css/index.less',
                tasks: ['less', 'cssmin']
            }
        }
    });
    grunt.registerTask('default', ['less', 'cssmin', 'browserify', 'htmlbuild']);
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-html-build');
};
