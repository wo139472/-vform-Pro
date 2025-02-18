<template>
  <div class="form-widget-container">

    <el-form class="full-height-width widget-form" :label-position="labelPosition"
             :class="[customClass, layoutType + '-layout']" :size="size" :validate-on-rule-change="false">

      <div v-if="designer.widgetList.length === 0" class="no-widget-hint">{{i18nt('designer.noWidgetHint')}}</div>

      <draggable :list="designer.widgetList" v-bind="{group:'dragGroup', ghostClass: 'ghost',animation: 300}" style="height: 100%;overflow-y: auto"
                 handle=".drag-handler" @end="onDragEnd" @add="onDragAdd" @update="onDragUpdate" :move="checkMove">
        <transition-group name="fade" tag="div" class="form-widget-canvas">
          <template v-for="(widget, index) in designer.widgetList">
            <template v-if="'container' === widget.category">
              <component :is="getWidgetName(widget)" :detailId="detailId" :form_template_id="form_template_id" :widget="widget" :designer="designer" :key="widget.id" :parent-list="designer.widgetList"
                                :index-of-parent-list="index" :parent-widget="null"></component>
            </template>
            <template v-else>
              <component :is="getWidgetName(widget)" :detailId="detailId" :form_template_id="form_template_id" :field="widget" :designer="designer" :key="widget.id" :parent-list="designer.widgetList"
                            :index-of-parent-list="index" :parent-widget="null" :design-state="true"></component>
            </template>
          </template>
        </transition-group>
      </draggable>

    </el-form>

  </div>
</template>

<script>
  import Draggable from 'vuedraggable'
  import '@/components/form-designer/form-widget/container-widget/index'
  import FieldComponents from '@/components/form-designer/form-widget/field-widget/index'
  import i18n from "@/utils/i18n"

  export default {
    name: "VFormWidget",
    componentName: "VFormWidget",
    mixins: [i18n],
    components: {
      Draggable,
      ...FieldComponents,
    },
    props: {
      designer: Object,
      formConfig: Object,
      form_template_id:[Number,String],
      detailId:[Number,String],
      optionData: { //prop传入的选项数据
        type: Object,
        default: () => ({})
      },
      globalDsv: {
        type: Object,
        default: () => ({})
      },
    },
    provide() {
      return {
        refList: this.widgetRefList,
        getFormConfig: () => this.formConfig,  /* 解决provide传递formConfig属性的响应式更新问题！！ */
        getGlobalDsv: () => this.globalDsv, // 全局数据源变量
        globalOptionData: this.optionData,
        getOptionData: () => this.optionData,
        getReadMode: () => false,
        globalModel: {
          formModel: this.formModel,
        },
        getSubFormFieldFlag: () => false,
        getSubFormName: () => '',
        getObjectFieldFlag: () => false,  //是否对象容器字段
        getObjectName: () => '',  //返回对象容器的名称
        getDSResultCache: () => this.dsResultCache,
      }
    },
    inject: ['getDesignerConfig'],
    data() {
      return {
        formModel: {},
        widgetRefList: {},
        dsResultCache: {},
      }
    },
    computed: {
      labelPosition() {
        if (!!this.designer.formConfig && !!this.designer.formConfig.labelPosition) {
          return this.designer.formConfig.labelPosition
        }

        return 'left'
      },

      size() {
        if (!!this.designer.formConfig && !!this.designer.formConfig.size) {
          return this.designer.formConfig.size
        }

        return 'medium'
      },

      customClass() {
        return this.designer.formConfig.customClass || ''
      },

      layoutType() {
        return this.designer.getLayoutType()
      },

    },
    watch: {
      'designer.widgetList': {
        deep: true,
        handler(val) {
          //
        }
      },

      'designer.formConfig': {
        deep: true,
        handler(val) {
          //
        }
      },

    },
    created() {
      //this.designer.initDesigner( !!this.getDesignerConfig().resetFormJson )  //此行代码已移动到form-designer，以便提前赋值formConfig！！
      this.designer.loadPresetCssCode( this.getDesignerConfig().presetCssCode )

    },
    mounted() {
      this.disableFirefoxDefaultDrop()  /* 禁用Firefox默认拖拽搜索功能!! */
      this.designer.registerFormWidget(this)
    },
    methods: {
      getWidgetName(widget) {
        return widget.type + '-widget'
      },

      disableFirefoxDefaultDrop() {
        let isFirefox = (navigator.userAgent.toLowerCase().indexOf("firefox") !== -1)
        if (isFirefox) {
          document.body.ondrop = function (event) {
            event.stopPropagation();
            event.preventDefault();
          }
        }
      },

      onDragEnd(evt) {
        //console.log('drag end000', evt)
      },

      onDragAdd(evt) {
        const newIndex = evt.newIndex
        if (!!this.designer.widgetList[newIndex]) {
          this.designer.setSelected( this.designer.widgetList[newIndex] )
        }

        this.designer.emitHistoryChange()
        this.designer.emitEvent('field-selected', null)
      },

      onDragUpdate() {  /* 在VueDraggable内拖拽组件发生位置变化时会触发update，未发生组件位置变化不会触发！！ */
        this.designer.emitHistoryChange()
      },

      checkMove(evt) {
        return this.designer.checkWidgetMove(evt)
      },

      getFormData() {
        return this.formModel
      },

      getWidgetRef(widgetName, showError = false) {
        let foundRef = this.widgetRefList[widgetName]
        if (!foundRef && !!showError) {
          this.$message.error(this.i18nt('render.hint.refNotFound') + widgetName)
        }
        return foundRef
      },

      getSelectedWidgetRef() {
        let wName = this.designer.selectedWidgetName
        return this.getWidgetRef(wName)
      },

      clearWidgetRefList() {
        Object.keys(this.widgetRefList).forEach(key => {
          delete this.widgetRefList[key]
        })
      },

      deleteWidgetRef(widgetRefName) {
        delete this.widgetRefList[widgetRefName]
      },

      /* 删除容器组件的所有内嵌组件ref */
      deletedChildrenRef(childrenRefNames) {
        childrenRefNames.forEach((childRefName) => {
          delete this.widgetRefList[childRefName]
        })
      },

    }
  }
</script>

<style lang="scss" scoped>
  .container-scroll-bar {
    ::v-deep .el-scrollbar__wrap, ::v-deep .el-scrollbar__view {
      overflow-x: hidden;
    }
  }

  .form-widget-container {
    padding: 10px;
    background: #f1f2f3;

    overflow-x: hidden;
    overflow-y: auto;

    .el-form.full-height-width {
      height: 100%;
      padding: 3px;
      background: #ffffff;

      .no-widget-hint {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        font-size: 18px;
        color: #999999;
      }

      .form-widget-canvas {
        //min-height: calc(100vh - 56px - 68px);
        min-height:100%;
        padding: 3px;
      }
    }

    /* 隐藏组件拖拽状态中显示的黑点 */
    ::v-deep li.container-widget-item, ::v-deep li.field-widget-item {
      list-style: none;
    }

    .el-form.PC-layout {
      //
    }

    .el-form.Pad-layout {
      margin: 0 auto;
      max-width: 960px;
      border-radius: 15px;
      box-shadow: 0 0 1px 10px #495060;
    }

    .el-form.H5-layout {
      margin: 0 auto;
      width: 420px;
      border-radius: 15px;
      //border-width: 10px;
      box-shadow: 0 0 1px 10px #495060;
    }

    .el-form.widget-form ::v-deep .el-row {
      padding: 2px;
      border: 1px dashed rgba(170, 170, 170, 0.75);
    }
  }

  .grid-cell {
    min-height: 30px;
    border-right: 1px dotted #cccccc;

  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
