import App from './components/App.vue';
import Vue from 'vue';

// Leave here for webpack purposes.
require('../scss/global.scss');

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  template: '<App />',
  components: { App }
});
