<template>
  <container-item-wrapper :widget="widget">

    <div class="object-group-container"
         v-show="!widget.options.hidden">
      <template v-for="(subWidget, swIdx) in widget.widgetList">
        <template v-if="'container' === subWidget.category">
          <component :is="getComponentByContainer(subWidget)" :widget="subWidget" :key="swIdx" :parent-list="widget.widgetList"
                     :index-of-parent-list="swIdx" :parent-widget="widget"
                     :sub-form-row-id="subFormRowId" :sub-form-row-index="subFormRowIndex" :sub-form-col-index="subFormColIndex">
            <!-- 递归传递插槽！！！ -->
            <template v-for="slot in Object.keys($scopedSlots)" v-slot:[slot]="scope">
              <slot :name="slot" v-bind="scope"/>
            </template>
          </component>
        </template>
        <template v-else>
          <component :is="subWidget.type + '-widget'" :field="subWidget" :key="swIdx" :parent-list="widget.widgetList"
                     :index-of-parent-list="swIdx" :parent-widget="widget"
                     :sub-form-row-id="subFormRowId" :sub-form-row-index="subFormRowIndex" :sub-form-col-index="subFormColIndex">
            <!-- 递归传递插槽！！！ -->
            <template v-for="slot in Object.keys($scopedSlots)" v-slot:[slot]="scope">
              <slot :name="slot" v-bind="scope"/>
            </template>
          </component>
        </template>
      </template>
    </div>
  </container-item-wrapper>
</template>

<script>
  import emitter from "@/utils/emitter";
  import i18n from "@/utils/i18n";
  import refMixin from "@/components/form-render/refMixin";
  import containerItemMixin from "@/components/form-render/container-item/containerItemMixin";
  import ContainerItemWrapper from "@/components/form-render/container-item/container-item-wrapper";
  import FieldComponents from "@/components/form-designer/form-widget/field-widget";

  export default {
    name: "object-group-item",
    componentName: 'ContainerItem',
    mixins: [emitter, i18n, refMixin, containerItemMixin],
    components: {
      ContainerItemWrapper,
      ...FieldComponents,
    },
    props: {
      widget: Object,

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
    provide() {
      return {
        getObjectFieldFlag: () => true,
        getObjectName: () => this.widget.options.objectName,  //返回对象容器的名称
      }
    },
    inject: ['refList', 'globalModel'],
    data() {
      return {}
    },
    created() {
      this.initRefList()
      this.handleOnCreated()
    },
    mounted() {
      this.handleOnMounted()
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

    }
  }
</script>

<style scoped>
  .object-group-container {

  }
</style>
