"use strict";

const gulp = require('gulp');
const install = require('gulp-install');
const conflict = require('gulp-conflict');
const rename = require('gulp-rename');
const template = require('gulp-template');
const inquirer = require('inquirer');

gulp.task('default', function(done) {
  // ask
  inquirer.prompt([
    {
      type: 'input',
      name: 'appName',
      message: 'What is your project name?',
      default: getName()
    },
    {
      type: 'input',
      name: 'description',
      message: 'What is your project description?',
      default: 'A vue project.'
    },
    {
      type: 'confirm',
      name: 'eslint',
      message: 'ESLint?',
      default: true
    },
    {
      type: 'confirm',
      name: 'moveon',
      message: 'Continue?'
    }
  ], function (answers) {
	  if(!answers.moveon) {
	  	return done()
	  }

	  let filesPath = [__dirname + '/templates/**']

	  if(answers.js) {
	  	filesPath = filesPath.concat([
	      '!' + __dirname + '/templates/_babelrc'
	    ])
	  }

	  gulp.src(filesPath, { dot: true })
	    .pipe(template(answers))
	    .pipe(rename(function (file) {
	      if (file.basename[0] === '_') {
	        file.basename = '.' + file.basename.slice(1)
	      }
	    }))
	    .pipe(conflict('./'))
	    .pipe(gulp.dest('./'))
	    .pipe(install())
	    .on('end', function () {
	      done()
	    })
	    .resume()
	}); 
});

function getName() {
  let path = require('path');
  try {
    return require(path.join(process.cwd(), 'package.json')).name;
  } catch (e) {
    return path.basename(process.cwd());
  }
};