# Taco Shell
 A no-fluff webpack configuration for front end development. 
 
 ## Features
 
 ### JavaScript
  - ES Next ready with Babel. Targets IE 11+
  - Dynamic entry points for modular exports
  - Global $ and jQuery registration  
  - Vue Integration (with .vue single file components and scoped scss styles)
  
  
  ### CSS
  - SCSS -> CSS compiler
  - automatic vendor prefixing
  - sourcemapping in development mode (module:line)


  ### Other
  - Resource Library
  - jQuery Date-time Picker
  - Browser sync Live reload
  - Minification / uglification in production mode
  
  ## Usage
   1. `$ npm install`
   2. For Development Mode: `$ npm run dev` or `$ npm run start`
   3. For Production Mode: `npm run build` or `$ npm run build-prod`
   
   - To work with browserify, you must paste a snippet of code into the footer of the app. To get this snippet go to webpack.config.js and change the options object for `new BrowserSync()` to include `logSnippet: true`. Then run the `dev` script to get the snippet.
