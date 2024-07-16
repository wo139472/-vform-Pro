<template>
  <container-item-wrapper :widget="widget">
    <el-button-group v-show="!widget.options.hidden">
      <template v-for="(btn, idx) in widget.options.buttons">
        <el-button v-show="!btn.hidden && !widget.options.hidden"
                   :disabled="btn.disabled || widget.options.disabled"
                   :size="widget.options.size"
                   :type="btn.type" :round="btn.round" :icon="btn.icon"
                   @click="handleGroupButtonClick(btn)"
                   :class="['data-table-' + btn.name + '-button']">{{btn.label}}</el-button>
      </template>
    </el-button-group>
  </container-item-wrapper>
</template>

<script>
  import ContainerItemWrapper from '@/components/form-render/container-item/container-item-wrapper'
  import emitter from '@/utils/emitter'
  import i18n from "@/utils/i18n"
  import refMixin from "@/components/form-render/refMixin"
  import containerItemMixin from "@/components/form-render/container-item/containerItemMixin"

  export default {
    name: "button-group-item",
    componentName: 'ContainerItem',  //必须固定为ContainerItem，用于接收父级组件的broadcast事件
    mixins: [emitter, i18n, refMixin, containerItemMixin],
    inject: ['refList', 'sfRefList', 'globalModel', 'getFormConfig', 'getGlobalDsv'],
    components: {
      ContainerItemWrapper,
    },
    props: {
      widget: Object,
      parentWidget: Object,
      parentList: Array,
      indexOfParentList: Number,
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
    data() {
      return {

      }
    },
    created() {
      this.initRefList()
      this.handleOnCreated()
    },
    mounted() {
      this.handleOnMounted()
    },
    beforeDestroy() {
      this.unregisterFromRefList()
    },
    methods: {
      handleOnCreated() {
        if (!!this.widget.options.onCreated) {
          let customFunc = new Function(this.widget.options.onCreated)
          customFunc.call(this)
        }
      },

      handleOnMounted() {
        if (!!this.widget.options.onMounted) {
          let customFunc = new Function(this.widget.options.onMounted)
          customFunc.call(this)
        }
      },

      handleGroupButtonClick(buttonConfig) {
        if (!!this.widget.options.onButtonGroupClick) {
          let customFn = new Function('buttonConfig', this.widget.options.onButtonGroupClick)
          customFn.call(this, buttonConfig)
        } else {
          this.dispatch('VFormRender', 'onButtonGroupClick', [buttonConfig])
        }
      },

      setHidden(hiddenFlag) {
        this.widget.options.hidden = hiddenFlag
      },

      setDisabled(disabledFlag) {
        this.widget.options.disabled = disabledFlag
      },

      setButtonHidden(buttonName, hiddenFlag) {
        let foundButton = this.widget.options.buttons.find(btn => btn.name === buttonName)
        if (!foundButton) {
          foundButton.hidden = hiddenFlag
        }
      },

      setButtonDisabled(buttonName, disabledFlag) {
        let foundButton = this.widget.options.buttons.find(btn => btn.name === buttonName)
        if (!foundButton) {
          foundButton.disabled = disabledFlag
        }
      },

    }
  }
</script>

<style lang="scss" scoped>

</style>
