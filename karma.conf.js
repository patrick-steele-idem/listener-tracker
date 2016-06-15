module.exports = function(config) {
  config.set({
    frameworks: ['lasso', 'mocha', 'chai'],

    files: [
      './test/browser/*.js'
    ],

    lasso: {
        plugins: [],
        minify: false,
        bundlingEnabled: false,
        resolveCssUrls: true,
        cacheProfile: 'development',
        // 2. tempdir is the directory where all the generated files will be stored.
        tempdir: './.test'
    },

    // reporters configuration
    reporters: ['mocha'],

    plugins: [
      'karma-chai',
      'karma-lasso',
      'karma-mocha',
      'karma-mocha-reporter'
    ]
  });
};
