<template>
  <el-col class="grid-cell" :class="[customClass]" v-bind="layoutProps" :style="colHeightStyle"
          v-show="!widget.options.hidden">
    <template v-if="!!widget.widgetList && (widget.widgetList.length > 0)">
      <template v-for="(subWidget, swIdx) in widget.widgetList">
        <template v-if="'container' === subWidget.category">
          <component :is="getComponentByContainer(subWidget)" :widget="subWidget"
                     :key="swIdx" :parent-list="widget.widgetList"
                     :index-of-parent-list="swIdx" :parent-widget="widget"
                     :sub-form-row-id="subFormRowId" :sub-form-row-index="subFormRowIndex" :sub-form-col-index="subFormColIndex">
            <!-- 递归传递插槽！！！ -->
            <template v-for="slot in Object.keys($scopedSlots)" v-slot:[slot]="scope">
              <slot :name="slot" v-bind="scope"/>
            </template>
          </component>
        </template>
        <template v-else>
          <component :is="subWidget.type + '-widget'" :field="subWidget" :designer="null" :key="swIdx" :parent-list="widget.widgetList"
                        :index-of-parent-list="swIdx" :parent-widget="widget"
                        :sub-form-row-id="subFormRowId" :sub-form-row-index="subFormRowIndex" :sub-form-col-index="subFormColIndex">
            <!-- 递归传递插槽！！！ -->
            <template v-for="slot in Object.keys($scopedSlots)" v-slot:[slot]="scope">
              <slot :name="slot" v-bind="scope"/>
            </template>
          </component>
        </template>
      </template>
    </template>
    <template v-else>
      <el-col>
        <div class="blank-cell"><span class="invisible-content">{{i18nt('render.hint.blankCellContent')}}</span></div>
      </el-col>
    </template>
  </el-col>
</template>

<script>
  import emitter from '@/utils/emitter'
  import i18n from "../../../utils/i18n"
  import refMixin from "../../../components/form-render/refMixin"
  import FieldComponents from '@/components/form-designer/form-widget/field-widget/index'
  import {traverseFieldWidgetsOfContainer} from "@/utils/util"

  export default {
    name: "GridColItem",
    componentName: 'ContainerItem',
    mixins: [emitter, i18n, refMixin],
    components: {
      ...FieldComponents,
    },
    props: {
      widget: Object,
      parentWidget: Object,
      parentList: Array,
      indexOfParentList: Number,

      colHeight: {
        type: String,
        default: null
      },

      subFormRowIndex: { /* 子表单组件行索引，从0开始计数 */
        type: Number,
        default: -1
      },
      subFormColIndex: { /* 子表单组件列索引，从0开始计数 */
        type: Number,
        default: -1
      },
      subFormRowId: { /* 子表单组件行Id，唯一id且不可变 */
        type: String,
        default: ''
      },

    },
    inject: ['refList', 'globalModel', 'getFormConfig', 'previewState'],
    data() {
      return {
        layoutProps: {
          span: this.widget.options.span,
          md: this.widget.options.md || 12,
          sm: this.widget.options.sm || 12,
          xs: this.widget.options.xs || 12,
          offset: this.widget.options.offset || 0,
          push: this.widget.options.push || 0,
          pull: this.widget.options.pull || 0,
        }
      }
    },
    computed: {
      formConfig() {
        return this.getFormConfig()
      },

      customClass() {
        return this.widget.options.customClass || ''
      },

      colHeightStyle() {
        return !!this.colHeight ? {height: this.colHeight + 'px'} : {}
      },

    },
    created() {
      this.initLayoutProps()
      this.initRefList()
      this.callSetHidden()
    },
    methods: {
      initLayoutProps() {
        if (!!this.widget.options.responsive) {
          if (!!this.previewState) {
            this.layoutProps.md = undefined
            this.layoutProps.sm = undefined
            this.layoutProps.xs = undefined

            let lyType = this.formConfig.layoutType
            if (lyType === 'H5') {
              this.layoutProps.span = this.widget.options.xs || 12
            } else if (lyType === 'Pad') {
              this.layoutProps.span = this.widget.options.sm || 12
            } else {
              this.layoutProps.span = this.widget.options.md || 12
            }
          } else {
            this.layoutProps.span = undefined
          }
        } else {
          this.layoutProps.md = undefined
          this.layoutProps.sm = undefined
          this.layoutProps.xs = undefined
        }
      },

      /* 主动触发setHidden()方法，以清空被隐藏容器内字段组件的校验规则！！ */
      callSetHidden() {
        if (this.widget.options.hidden === true) {
          this.setHidden(true)
        }
      },

      setHidden(flag) {
        this.widget.options.hidden = flag

        /* 容器被隐藏后，需要同步清除容器内部字段组件的校验规则 */
        let clearRulesFn = (fieldWidget) => {
          let fwName = fieldWidget.options.name
          let fwRef = this.getWidgetRef(fwName)
          if (flag && !!fwRef && !!fwRef.clearFieldRules) {
            fwRef.clearFieldRules()
          }

          if (!flag && !!fwRef && !!fwRef.buildFieldRules) {
            fwRef.buildFieldRules()
          }
        }

        traverseFieldWidgetsOfContainer(this.widget, clearRulesFn)
      },

    }
  }
</script>

<style lang="scss" scoped>
  .blank-cell {
    font-style: italic;
    color: #cccccc;

    span.invisible-content {
      opacity: 0;
    }
  }
</style>
