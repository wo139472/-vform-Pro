import axios from 'axios'

import VFormDesigner from '@/components/form-designer/index.vue'
import VFormRender from '@/components/form-render/index.vue'
import TableMultiLevelColumn from '@/components/form-designer/form-widget/table-multi-level-column'
import TableHighLevelColumn from '@/components/form-render/table-high-level-column'
import {loadExtension} from "@/extension/extension-loader"

import '@/utils/directive'
import '@/icons'
import '@/iconfont/iconfont.css'

// sdk import begin
import {
  addContainerWidgetSchema,
  addBasicFieldSchema,
  addAdvancedFieldSchema,
  addCustomWidgetSchema,
  addAssociatedFieldSchema
} from '@/components/form-designer/widget-panel/widgetsConfig'
import * as PERegister from '@/components/form-designer/setting-panel/propertyRegister'
import * as PEFactory from '@/components/form-designer/setting-panel/property-editor-factory'
import {
  registerCWGenerator,
  registerFWGenerator
} from '@/utils/sfc-generator'

import i18n, {addENExtensionLang, addZHExtensionLang} from "@/utils/i18n"
import containerMixin from "@/components/form-designer/form-widget/container-widget/containerMixin"
import Draggable from 'vuedraggable'  //是否需要全局注册？？
import ContainerWrapper from "@/components/form-designer/form-widget/container-widget/container-wrapper"
import FieldComponents from '@/components/form-designer/form-widget/field-widget/index'
import refMixinDesign from "@/components/form-designer/refMixinDesign"

import refMixin from "@/components/form-render/refMixin"
import ContainerItemWrapper from '@/components/form-render/container-item/container-item-wrapper'
import containerItemMixin from "@/components/form-render/container-item/containerItemMixin"

import StaticContentWrapper from '@/components/form-designer/form-widget/field-widget/static-content-wrapper'
import FormItemWrapper from '@/components/form-designer/form-widget/field-widget/form-item-wrapper'
import emitter from '@/utils/emitter'
import fieldMixin from "@/components/form-designer/form-widget/field-widget/fieldMixin"
import eventMixin from "@/components/form-designer/setting-panel/property-editor/event-handler/eventMixin"
// sdk import end

loadExtension()

const setProductInfo = (Vue, options) => {
  Vue.prototype.$vformInfo = {
    productName: (options && options.productName) || '',
    productTitle: (options && options.productTitle) || ''
  }
}

VFormDesigner.install = function (Vue, options) {
  Vue.component(VFormDesigner.name, VFormDesigner)
  Vue.component(TableMultiLevelColumn.name, TableMultiLevelColumn)
  Vue.component(TableHighLevelColumn.name, TableHighLevelColumn)
  setProductInfo(Vue, options)
}

VFormRender.install = function (Vue) {
  Vue.component(VFormRender.name, VFormRender)
  Vue.component(TableHighLevelColumn.name, TableHighLevelColumn)
}

const components = [
  VFormDesigner,
  VFormRender,
  TableMultiLevelColumn,
  TableHighLevelColumn
]

const install = (Vue, options) => {
  window.axios = axios
  components.forEach(component => {
    Vue.component(component.name, component)
  })

  setProductInfo(Vue, options)
}

if (typeof window !== 'undefined' && window.Vue) { /* script方式引入时主动调用install方法！！ */
  install(window.Vue);
}

/**
 * 导出二开组件所需的所有对象、工具方法及组件
 */
const VFormSDK = {
  addContainerWidgetSchema,
  addBasicFieldSchema,
  addAdvancedFieldSchema,
  addCustomWidgetSchema,
  addAssociatedFieldSchema,

  PERegister,
  PEFactory,
  registerCWGenerator,
  registerFWGenerator,
  addZHExtensionLang,
  addENExtensionLang,

  i18n,
  containerMixin,
  Draggable,  //是否需要全局注册？？
  ContainerWrapper,
  FieldComponents,
  refMixinDesign,

  ContainerItemWrapper,
  containerItemMixin,
  refMixin,

  StaticContentWrapper,
  FormItemWrapper,
  emitter,
  fieldMixin,
  eventMixin,
}

export default {
  install,
  VFormDesigner,
  VFormRender,
  VFormSDK
}
