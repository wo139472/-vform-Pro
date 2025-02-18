<template>
  <container-wrapper :designer="designer" :widget="widget" :parent-widget="parentWidget" :parent-list="parentList"
                     :index-of-parent-list="indexOfParentList">

    <div class="drawer-container" :class="[selected ? 'selected' : '', customClass]"
         @click.stop="selectWidget(widget)">
      <draggable :list="widget.widgetList" v-bind="{group:'dragGroup', ghostClass: 'ghost',animation: 200}"
                 handle=".drag-handler" @end="(evt) => onDrawerDragEnd(evt, widget.widgetList)"
                 @add="(evt) => onDrawerDragAdd(evt, widget.widgetList)"
                 @update="onDrawerDragUpdate" :move="checkContainerMove">
        <transition-group name="fade" tag="div" class="vf-drawer-drop-zone">
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
  import refMixinDesign from "@/components/form-designer/refMixinDesign";
  import Draggable from "vuedraggable";
  import FieldComponents from "@/components/form-designer/form-widget/field-widget";
  import ContainerWrapper from "@/components/form-designer/form-widget/container-widget/container-wrapper";

  export default {
    name: "vf-drawer-widget",
    componentName: 'VfDialogWidget',
    mixins: [i18n, refMixinDesign],
    inject: ['refList'],
    components: {
      ContainerWrapper,
      Draggable,
      ...FieldComponents,
    },
    props: {
      widget: Object,
      parentWidget: Object,
      parentList: Array,
      indexOfParentList: Number,
      designer: Object,
    },
    data() {
      return {
        //
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
      onDrawerDragEnd(evt, subList) {
        //console.log('onDrawerDragEnd', evt)
      },

      onDrawerDragAdd(evt, subList) {
        const newIndex = evt.newIndex
        if (!!subList[newIndex]) {
          this.designer.setSelected( subList[newIndex] )
        }

        this.designer.emitHistoryChange()
        this.designer.emitEvent('field-selected', this.widget)
      },

      onDrawerDragUpdate() {
        this.designer.emitHistoryChange()
      },

      selectWidget(widget) {
        console.log('id: ' + widget.id)
        this.designer.setSelected(widget)
      },

      checkContainerMove(evt) {
        //弹窗、抽屉不能嵌套！！
        return this.designer.checkWidgetMove(evt)
      },

      selectParentWidget() {
        if (this.parentWidget) {
          this.designer.setSelected(this.parentWidget)
        } else {
          this.designer.clearSelected()
        }
      },

      moveUpWidget() {
        this.designer.moveUpWidget(this.parentList, this.indexOfParentList)
      },

      moveDownWidget() {
        this.designer.moveDownWidget(this.parentList, this.indexOfParentList)
      },

      removeWidget() {
        if (!!this.parentList) {
          let nextSelected = null
          if (this.parentList.length === 1) {
            if (!!this.parentWidget) {
              nextSelected = this.parentWidget
            }
          } else if (this.parentList.length === (1 + this.indexOfParentList)) {
            nextSelected = this.parentList[this.indexOfParentList - 1]
          } else {
            nextSelected = this.parentList[this.indexOfParentList + 1]
          }

          this.$nextTick(() => {
            this.parentList.splice(this.indexOfParentList, 1)
            //if (!!nextSelected) {
            this.designer.setSelected(nextSelected)
            //}

            this.designer.emitHistoryChange()
          })
        }
      },

    }
  }
</script>

<style lang="scss" scoped>
  .drawer-container {
    width: 100%;
    min-height: 120px;
    border: 2px dashed #cccccc;
    box-sizing: border-box;
    position: relative;

    .vf-drawer-drop-zone {
      min-height: 58px;
    }
  }

  .drawer-container.selected {
    outline: 2px solid $--color-primary !important;
  }

</style>
