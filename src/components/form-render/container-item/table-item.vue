<template>
  <container-item-wrapper :widget="widget">

    <div class="table-container"
         v-show="!widget.options.hidden">
      <table :ref="widget.id" class="table-layout" :class="[customClass]">
        <tbody>
        <tr v-for="(row, rowIdx) in widget.rows" :key="row.id">
          <template v-for="(colWidget, colIdx) in row.cols">
            <table-cell-item v-if="!colWidget.merged" :widget="colWidget" :key="colIdx" :parent-list="widget.cols"
                             :row-index="rowIdx" :col-index="colIdx" :parent-widget="widget"
                             :sub-form-row-id="subFormRowId" :sub-form-row-index="subFormRowIndex" :sub-form-col-index="subFormColIndex">
              <!-- 递归传递插槽！！！ -->
              <template v-for="slot in Object.keys($scopedSlots)" v-slot:[slot]="scope">
                <slot :name="slot" v-bind="scope"/>
              </template>
            </table-cell-item>
          </template>
        </tr>
        </tbody>
      </table>
    </div>

  </container-item-wrapper>
</template>

<script>
  import emitter from '@/utils/emitter'
  import i18n from "../../../utils/i18n"
  import refMixin from "../../../components/form-render/refMixin"
  import ContainerItemWrapper from './container-item-wrapper'
  import TableCellItem from './table-cell-item'
  import containerItemMixin from "./containerItemMixin";

  export default {
    name: "table-item",
    componentName: 'ContainerItem',
    mixins: [emitter, i18n, refMixin, containerItemMixin],
    components: {
      ContainerItemWrapper,
      TableCellItem,
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
    inject: ['refList', 'sfRefList', 'globalModel'],
    created() {
      this.initRefList()
    },
    mounted() {

    },
    beforeDestroy() {
      this.unregisterFromRefList()
    },
    methods: {

    },
  }
</script>

<style lang="scss" scoped>
  div.table-container {
    table.table-layout {
      width: 100%;
      table-layout: fixed;
      border-collapse: collapse;
    }
  }

</style>
