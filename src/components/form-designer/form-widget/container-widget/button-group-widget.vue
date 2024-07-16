<template>
  <container-wrapper :designer="designer" :widget="widget" :parent-widget="parentWidget" :parent-list="parentList"
                     :index-of-parent-list="indexOfParentList">

    <div class="button-group-container"
         :class="{'selected': selected}" @click.stop="selectWidget(widget)">
      <el-button-group>
        <template v-for="(btn, idx) in widget.options.buttons">
          <el-button :disabled="btn.disabled || widget.options.disabled"
                     :size="widget.options.size"
                     :type="btn.type" :round="btn.round" :icon="btn.icon"
                     :class="['data-table-' + btn.name + '-button']">{{btn.label}}</el-button>
        </template>
      </el-button-group>
    </div>

  </container-wrapper>
</template>

<script>
  import Draggable from 'vuedraggable'
  import i18n from "@/utils/i18n"
  import containerMixin from "@/components/form-designer/form-widget/container-widget/containerMixin"
  import ContainerWrapper from "@/components/form-designer/form-widget/container-widget/container-wrapper"
  import refMixinDesign from "@/components/form-designer/refMixinDesign"

  export default {
    name: "button-group-widget",
    componentName: 'ContainerWidget',
    mixins: [i18n, containerMixin, refMixinDesign],
    inject: ['refList'],
    components: {
      ContainerWrapper,
      Draggable,
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
  }
</script>

<style lang="scss" scoped>
  .button-group-container.selected {
    outline: 2px solid $--color-primary !important;
  }

</style>
