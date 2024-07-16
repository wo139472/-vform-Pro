<template>
  <container-wrapper :designer="designer" :widget="widget" :parent-widget="parentWidget" :parent-list="parentList"
                     :index-of-parent-list="indexOfParentList">
    <div class="object-group-container" @click.stop="selectWidget(widget)"
             :class="[selected ? 'selected' : '', customClass]">
      <draggable :list="widget.widgetList" v-bind="{group:'dragGroup', ghostClass: 'ghost',animation: 200}"
                 handle=".drag-handler"
                 @add="(evt) => onContainerDragAdd(evt, widget.widgetList)"
                 @update="onContainerDragUpdate" :move="checkContainerMove">
        <transition-group name="fade" tag="div" class="object-group">
          <template v-for="(subWidget, swIdx) in widget.widgetList">
            <template v-if="'container' === subWidget.category">
              <component :is="subWidget.type + '-widget'" :widget="subWidget" :designer="designer" :key="subWidget.id" :parent-list="widget.widgetList"
                         :index-of-parent-list="swIdx" :parent-widget="widget"></component>
            </template>
            <template v-else>
              <component :is="subWidget.type + '-widget'" :field="subWidget" :designer="designer" :key="subWidget.id" :parent-list="widget.widgetList"
                         :index-of-parent-list="swIdx" :parent-widget="widget" :design-state="true"></component>
            </template>
          </template>
        </transition-group>
      </draggable>
    </div>
  </container-wrapper>
</template>

<script>
  import i18n from "@/utils/i18n";
  import containerMixin from "@/components/form-designer/form-widget/container-widget/containerMixin";
  import refMixinDesign from "@/components/form-designer/refMixinDesign";
  import Draggable from "vuedraggable";
  import ContainerWrapper from "@/components/form-designer/form-widget/container-widget/container-wrapper";
  import FieldComponents from "@/components/form-designer/form-widget/field-widget";

  export default {
    name: "object-group-widget",
    componentName: 'ContainerWidget',
    mixins: [i18n, containerMixin, refMixinDesign],
    inject: ['refList'],
    components: {
      Draggable,
      ContainerWrapper,
      ...FieldComponents,
    },
    props: {
      widget: Object,
      parentWidget: Object,
      parentList: Array,
      indexOfParentList: Number,
      designer: Object,
    },
    provide() {
      return {
        getObjectFieldFlag: () => true,
        getObjectName: () => this.widget.options.objectName,  //返回对象容器的名称
      }
    },
    computed: {
      selected() {
        return this.widget.id === this.designer.selectedId
      },

      customClass() {
        return this.widget.options.customClass || ''
      },

    },
    created() {
      this.initRefList()
    },
    methods: {
      /**
       * 检查接收哪些组件拖放，如不接受某些组件拖放，则根据组件类型判断后返回false
       * @param evt
       * @returns {boolean}
       */
      checkContainerMove(evt) {
        return true
      },

      toggleCard() {
        this.widget.options.folded = !this.widget.options.folded
      },

      /**
       * 设置折叠/打开状态
       * @param folded
       */
      setFolded(folded) {
        this.widget.options.folded = !!folded
      }

    }
  }
</script>

<style lang="scss" scoped>
  .object-group-container {
    border: 2px dashed #cccccc;
  }

  .object-group-container.selected {
    outline: 2px solid $--color-primary !important;
  }

  .object-group-container {
    // margin: 3px;

    .object-group {
      min-height: 28px;
    }
  }


</style>
