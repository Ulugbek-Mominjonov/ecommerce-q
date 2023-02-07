import Vue from 'vue';
import VueHtmlToPaper from 'vue-html-to-paper';

const optionsPrint = {
  name: '_blank',
  specs: [
    'fullscreen=yes',
    'titlebar=yes',
    'scrollbars=yes'
  ],
  styles: [
    'https://cdn.jsdelivr.net/npm/quasar@1.22.5/dist/quasar.min.css'
  ]
}

Vue.use(VueHtmlToPaper, optionsPrint);

// // or, using the defaults with no stylesheet
// Vue.use(VueHtmlToPaper);
