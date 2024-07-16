import VFormRender from '@/components/form-render/index.vue'
import TableHighLevelColumn from '@/components/form-render/table-high-level-column'
import {loadExtension} from "@/extension/extension-loader"
import axios from "axios"

loadExtension()

VFormRender.install = function (Vue) {
  Vue.component(VFormRender.name, VFormRender)
  Vue.component(TableHighLevelColumn.name, TableHighLevelColumn)
}

const components = [
  VFormRender,
  TableHighLevelColumn
]

const install = (Vue) => {
  window.axios = axios
  components.forEach(component => {
    Vue.component(component.name, component)
  })
}

if (typeof window !== 'undefined' && window.Vue) { /* script方式引入时主动调用install方法！！ */
  install(window.Vue);
}

export default {
  install,
  VFormRender
}
