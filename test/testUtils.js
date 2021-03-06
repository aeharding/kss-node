'use strict';

var path = require('path'),
  kss = require('../index.js');

module.exports = {

  fixtures: function(subpath) {
    if (!subpath) {
      subpath = '';
    }
    return path.join(__dirname, 'fixtures', subpath);
  },

  eachSection: function(done, options, testFunction) {
    kss.traverse(this.fixtures(), options || {}, function(err, styleguide) {
      err.should.not.be.Error();

      styleguide.data.sections.map(function(section) {
        testFunction(section);
      });
      done();
    });
  },

  sectionQueryArray: function(done, query, options, testFunction) {
    kss.traverse(this.fixtures(), options || {}, function(err, styleguide) {
      err.should.not.be.Error();
      var sections = styleguide.section(query);

      sections.should.be.an.Array('query did not return an array');
      sections.length.should.not.be.equal(0, 'query returned empty array');
      testFunction(sections);
      done();
    });
  },

  sectionQueryExact: function(done, query, options, testFunction) {
    kss.traverse(this.fixtures(), options || {}, function(err, styleguide) {
      err.should.not.be.Error();
      var section = styleguide.section(query);

      section.should.be.instanceof(kss.KssSection, 'query did not return a KssSection');
      testFunction(section);
      done();
    });
  },

  sectionQueryFail: function(done, query, options, testFunction) {
    kss.traverse(this.fixtures(), options || {}, function(err, styleguide) {
      err.should.not.be.Error();
      testFunction = testFunction || function() {};

      var returnVal = styleguide.section(query);
      if (Array.isArray(returnVal)) {
        returnVal.length.should.equal(0, 'query returned non-empty array');
      } else {
        returnVal.should.be.false('query did not return false');
      }
      testFunction(styleguide);
      done();
    });
  },

  traverseFixtures: function(options, cb) {
    kss.traverse(this.fixtures(), options, function(err, styleguide) {
      err.should.not.be.Error();
      styleguide.data.sections.should.be.ok();
      cb(styleguide);
    });
  }
};
