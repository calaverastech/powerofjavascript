module.exports = function(grunt) {
    var app = ["public/js/app.js", "public/js/**/*.js"];
    var tests = ["test/**/*.js"];
    var src_js = tests.concat(app);
    
	/*jshint -W106 */
    var rjs_build = eval(grunt.file.read('public/build.js'));
    /*jshint +W106 */
    rjs_build.baseUrl = "public/js";
    rjs_build.dir = "public/dist";
    
    var path = require("path");
    
    grunt.initConfig({
        CWD: process.cwd(),
        jshint: {
            options: {
                jshintrc: true,
                evil: true
            },
            files: {
                src: src_js
            }
        },
        commands: {
        	mkdir_tmp: {
        		cmd: ["mkdir -p tmp", "rm -rf tmp/*"]
        	},
        	rm_tmp: {
        		cmd: ["rm -rf tmp"]
        	}
        },
        run: {
            server: {
              options: {
                  wait: false
              },
              args: ["server"]
            }
        },
        copy: {
        	serverCopy: {
        		src: ['yahoofinance/server.js'],
        	    dest: 'tmp/',
        	    expand: true,
        	    options: {
            		process: function (content, srcpath) {
        	    			return content.replace(/#\!.+node/, "")
        	    						  .replace(/(__dirname\s*\+\s*'\/public)\/js'/g,"$1/dist'" )
        	    						  .replace(/(\.\/.+)\.js(?!on)/g,"$1.min.js");
          			}
        		}
        	},
        	serverCopyBack: {
        		cwd: "tmp", 
        		src: ["*.min.js"],
        		dest: "yahoofinance",
        		expand: true
        	},
        	folderCopy: {
		        expand: true,
                mode: true
        	}
        },
    	exec: {
    		protractor: {
    			cmd: function() {
    				return "npm run protractor";
    			}
    		},
    		karma: {
    			cmd: function() {
    				return "npm run test-single-run";
    			}		
    		},
    		karmaquiet: {
    			cmd: function() {
    				return "npm run test-quiet";
    			}	
    		}
    	},
        requirejs: {
      	    compile: {
      		  options: rjs_build      		
      	    }
        },
        uglify: {
        	libs: {
    	    	mangle: true,
    	    	compress: true,
    	    	files: {
	        		'tmp/int10.min.js': ["int10.js"],
	        		'tmp/asn1.min.js': ["tmp/asn1.js"],
	        		'tmp/hex.min.js': ["hex.js"],
	        		'tmp/base64.min.js': ["base64.js"]
        		}
        	},
        	server: {
        	    mangle: true,
                compress: true,
        		files: {
        			'tmp/preprocess.min.js': ["tmp/preprocess.js"],
        			'tmp/server.min.js': ["tmp/server.js"]
        		},
        		options: {
                    banner: '#!/usr/bin/env node\n'
        		}
        		
        	}
        },
        gitadd: {
        	task: {
        		options: {
            		cwd: "<%= CWD %>",
        			all: true
        		}
        	}
        },
        gitcommit: {
        	task: {
        		options: {
            		cwd: "<%= CWD %>",
            		message: "New Build "+ grunt.template.today('mmmm dd h:MM TT, yyyy'),
        			allowEmpty: true
        		}
        	}
        },
        gitpush: {
        	origin_master: {
        		options: {
            		cwd: "<%= CWD %>",
        			remote: 'origin',
        			branch: 'master'
        		}
        	}
        },
        gitfetch: {
            origin_master: {
              options: {
            	cwd: "<%= CWD %>"
              }
            }
        },
        gitpull: {
            origin_master: {
            options: {
	          	cwd: "<%= CWD %>",
	            remote: 'origin',
	            branch: 'master'
	        }
          }
        }
    });
    
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-commands');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-run');
    grunt.loadNpmTasks('grunt-git');
    
    grunt.registerTask('protractor', 'Run protractor tests', function() {
        grunt.task.run(["run:server", "exec:protractor", "stop:server"]);
    });
    
    grunt.registerTask('tests', "Tests", function() {
    	grunt.task.run(["jshint", "protractor", "exec:karma"]);
    });
    
    grunt.registerTask('testsTravis', "Tests", function() {
    	grunt.task.run(["jshint", "protractor", "exec:karmaquiet"]);
    });
    
    grunt.registerTask("uglifyServer", "Uglify server files", function() {
        grunt.task.run(["commands:mkdir_tmp", "copy:serverCopy", "uglify"]);
    });
    
    grunt.registerTask("copyMinServer", "Copy uglified server files", function() {
		grunt.task.run(['copy:serverCopyBack', "commands:rm_tmp"]);
    });
    
    grunt.registerTask("backup", "Backup the project", function() {
    	var destfile = path.dirname(grunt.config("CWD")) + "/" + path.basename(grunt.config("CWD")) + "-" + grunt.template.today('yyyy-mmmm-dd-h:MM:TT');
    	grunt.config("copy.folderCopy.cwd", grunt.config("CWD"));
    	grunt.config("copy.folderCopy.src", ["**/*", "!**/node_modules/**", "!**/bower_components/**"]);
    	grunt.config("copy.folderCopy.dest", destfile);
    	grunt.config("copy.folderCopy.dot", true);
    	grunt.task.run("copy:folderCopy");
    });
    
    grunt.registerTask("minify", "Minify javascript files", ["backup", "requirejs:compile", "uglifyServer", "copyMinServer"]);
    
    //The travis ci build
    grunt.registerTask("travis", ["testsTravis"]);
    
    //Just run grunt for day to day work
    grunt.registerTask("default", ["tests"]);
    
    
}