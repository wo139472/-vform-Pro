import 'babel-polyfill'
import './utils/debug-console'
import Vue from 'vue'
import axios from "axios";
import App from './App.vue'
import util from "@/utils/util";
import ElementUI from 'element-ui'
import './utils/directive'
import './icons'

import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss'
import '@/iconfont/iconfont.css'

import VFormRender from '@/components/form-render/index'
import TableMultiLevelColumn from '@/components/form-designer/form-widget/table-multi-level-column'
import TableHighLevelColumn from '@/components/form-render/table-high-level-column'
import {loadExtension} from '@/extension/extension-loader'

Vue.component('VFormRender', VFormRender)
Vue.component(TableMultiLevelColumn.name, TableMultiLevelColumn)
Vue.component(TableHighLevelColumn.name, TableHighLevelColumn)
loadExtension()
Vue.use(ElementUI, { size: 'small' })
Vue.prototype.$lcgtUtil = util;

//el-select 下拉框滚动加载
Vue.directive("scrollLoad", {
  bind(el, binding) {
    // 获取element-ui定义好的scroll盒子
    const SELECTWRAP_DOM = el.querySelector(
      ".el-select-dropdown .el-select-dropdown__wrap"
    );
    SELECTWRAP_DOM.addEventListener("scroll", function () {
      const CONDITION = this.scrollHeight - this.scrollTop <= this.clientHeight;
      if (CONDITION) {
        binding.value();
      }
    });
  }
})

if (typeof window !== 'undefined') {
  window.axios = axios
}

Vue.config.productionTip = false

new Vue({
  el: "#app",
  render: h => h(App),
})
