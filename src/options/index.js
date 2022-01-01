import 'bulma-fluent/bulma.sass'
import Vue from 'vue'
import Antd from 'ant-design-vue';
import App from './App.vue';
import 'ant-design-vue/dist/antd.css';

Vue.config.productionTip = false;
Vue.use(Antd);
// eslint-disable-next-line
new Vue({
  el: '#app',
  render: (h) => h(App),
})
