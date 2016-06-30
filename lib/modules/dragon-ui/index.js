module.exports = dui;

function dui(options, callback) {
  //options.apos: the apos object, a singleton which provides core methods for content management
  //options.app: the Express app object.  You can add routes via app.get, app.post, etc. at any time in your module's constructor
  //options.pages: the pages object, a singleton which provides methods for dealing with the page tree
  //options.schemas: the schemas object, a singleton which provides methods for dealing with schemas
  //options.mailer: a nodemailer transport object, ready to send email as needed
  //options.site: an object containing title, shortName and hostName properties, as configured in app.js.
 
  return new DragonUI(options, callback);
}

function DragonUI(options, callback) {
  var self = this;
  // Add a bunch of methods to self here, then...
  self._apos = options.apos;
  self._app = options.app;
  self._pages = options.pages;
  self._schemas = options.schemas;
  self._options = options;
    // Mix in the ability to serve assets and templates
  self._apos.mixinModuleAssets(self, 'dragon-ui', __dirname, options);
  
  self.pushAsset('stylesheet', '_index', { when: 'always' });

  //I don't quite need custom scripts yet
  //self.pushAsset('scripts','dragon', {when: 'always'});

  //support the default demo page types
  //default, home, blog
  var pages = {
    'home': 'home',
    'default': 'default',
    'blog': 'blog'
  };

  self.loader = function(req, callback) {
    console.log("page:" + JSON.stringify(req.page));
    if (req.page && pages[req.page.type]) {
      req.template = self.renderer(pages[req.page.type], {});
    }
    

    return callback(null);
  };

  // Invoke the callback. This must happen on next tick or later!
  if (callback) {
    return process.nextTick(function() {
      return callback(null);
    });
  }
}

// Export the constructor so others can subclass
dui.DragonUI = DragonUI;