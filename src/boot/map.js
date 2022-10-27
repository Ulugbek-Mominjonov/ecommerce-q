import Vue from 'vue'
import VueLayers from 'vuelayers'
import 'vuelayers/lib/style.css' // needs css-loader
import VueQRCodeComponent from 'vue-qrcode-component'
import VuePaginateScroll from "vue-paginate-scroll";

Vue.component('vue-paginate-scroll', VuePaginateScroll);
Vue.component('qr-code', VueQRCodeComponent)
Vue.use(VueLayers)
