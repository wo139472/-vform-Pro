<template>
  <form-item-wrapper :designer="designer" :field="field" :rules="rules" :design-state="designState"
                     :parent-widget="parentWidget" :parent-list="parentList" :index-of-parent-list="indexOfParentList"
                     :sub-form-row-index="subFormRowIndex" :sub-form-col-index="subFormColIndex" :sub-form-row-id="subFormRowId">
    <el-cascader ref="fieldEditor" :options="field.options.optionItems" v-model="fieldModel" v-show="!isReadMode"
                 class="full-width-input"
                 :disabled="field.options.disabled || isReadMode"
                 :clearable="field.options.clearable"
                 :filterable="field.options.filterable"
                 :placeholder="field.options.placeholder || i18nt('render.hint.selectPlaceholder')"
                 :show-all-levels="showFullPath"
                 :props="{ checkStrictly: field.options.checkStrictly, multiple: field.options.multiple, expandTrigger: 'hover', value: valueKey, label: labelKey, children: childrenKey }"
                 @visible-change="hideDropDownOnClick" @expand-change="hideDropDownOnClick"
                 @focus="handleFocusCustomEvent" @blur="handleBlurCustomEvent"
                 @change="handleChangeEvent">
    </el-cascader>
    <template v-if="isReadMode">
      <span class="readonly-mode-field">{{contentForReadMode}}</span>
    </template>
  </form-item-wrapper>
</template>

<script>
  import FormItemWrapper from './form-item-wrapper'
  import emitter from '@/utils/emitter'
  import i18n, {translate} from "@/utils/i18n";
  import fieldMixin from "@/components/form-designer/form-widget/field-widget/fieldMixin";

  export default {
    name: "cascader-widget",
    componentName: 'FieldWidget',  //必须固定为FieldWidget，用于接收父级组件的broadcast事件
    mixins: [emitter, fieldMixin, i18n],
    props: {
      field: Object,
      parentWidget: Object,
      parentList: Array,
      indexOfParentList: Number,
      designer: Object,

      designState: {
        type: Boolean,
        default: false
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
    components: {
      FormItemWrapper,
    },
    inject: ['refList', 'globalOptionData', 'globalModel'],
    data() {
      return {
        oldFieldValue: null, //field组件change之前的值
        fieldModel: null,
        rules: [],
      }
    },
    computed: {
      labelKey() {
        return this.field.options.labelKey || 'label'
      },

      valueKey() {
        return this.field.options.valueKey || 'value'
      },

      childrenKey() {
        return this.field.options.childrenKey || 'children'
      },

      showFullPath() {
        return (this.field.options.showAllLevels === undefined) || !!this.field.options.showAllLevels
      },

      contentForReadMode() {
        if (!!this.field.options.multiple) {
          //console.log('test======', this.$refs.fieldEditor.presentTags)
          const curTags = this.$refs.fieldEditor.presentTags
          if (!curTags || (curTags.length <= 0)) {
            return '--'
          } else {
            return curTags.map(tagItem => tagItem.text).join(', ')
          }
        } else {
          return this.$refs.fieldEditor.presentText || '--'
        }
      },

    },
    beforeCreate() {
      /* 这里不能访问方法和属性！！ */
    },

    created() {
      /* 注意：子组件mounted在父组件created之后、父组件mounted之前触发，故子组件mounted需要用到的prop
         需要在父组件created中初始化！！ */
      this.registerToRefList()
      this.initOptionItems()
      this.initFieldModel()
      this.initEventHandler()
      this.buildFieldRules()

      this.handleOnCreated()
    },

    mounted() {
      this.handleOnMounted()
    },

    beforeDestroy() {
      this.unregisterFromRefList()
    },

    methods: {
      /* 开启任意级节点可选后，点击radio隐藏下拉框 */
      hideDropDownOnClick() {
        setTimeout(() => {
          document.querySelectorAll(".el-cascader-panel .el-radio").forEach((el) => {
            el.onclick = () => {
              this.$refs.fieldEditor.dropDownVisible = false  //单选框部分点击隐藏下拉框
            }
          })
        }, 100)
      },

    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../../styles/global.scss"; //* form-item-wrapper已引入，还需要重复引入吗？ *//

  .full-width-input {
    width: 100% !important;
  }

</style>
