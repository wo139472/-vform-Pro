<template>
  <el-table-column v-if="!!columnSchema.headerFlag && (!!columnSchema.children && columnSchema.children.length > 0)"
                   :label="columnSchema.label" :align="columnSchema.align ? columnSchema.align : 'center'">
    <template v-for="child in columnSchema.children">
      <table-multi-level-column :column-schema="child" :table-options="tableOptions"></table-multi-level-column>
    </template>
  </el-table-column>
  <el-table-column v-else-if="!columnSchema.headerFlag && (columnSchema.show !== false) && !columnSchema.children"
                   :key="columnSchema.columnId"
                   :prop="columnSchema.prop"
                   :label="columnSchema.label"
                   :sortable="columnSchema.sortable"
                   :fixed="!columnSchema.fixed ? false : columnSchema.fixed"
                   :align="columnSchema.align ? columnSchema.align : 'center'"
                   :formatter="formatterValue"
                   :format="columnSchema.format"
                   :show-overflow-tooltip="true"
                   :min-width="colMinWidth"
                   :width="colWidth">
  </el-table-column>
</template>

<script>
  import {
    formatDate1,
    formatDate2,
    formatDate3,
    formatDate4,
    formatDate5,
    formatNumber1,
    formatNumber2, formatNumber3, formatNumber4, formatNumber5, formatNumber6, formatNumber7
  } from "@/utils/format";

  export default {
    name: "table-multi-level-column",
    props: {
      columnSchema: {
        type: Object
      },
      tableOptions: {
        type: Object
      }
    },
    computed: {
      colMinWidth() {
        return (this.tableOptions.autoColumnWidthDisabled === true) ? undefined : this.columnSchema.width
      },

      colWidth() {
        return (this.tableOptions.autoColumnWidthDisabled === true) ? this.columnSchema.width : undefined
      },

    },
    methods: {
      formatterValue(row, column, cellValue) {
        if (!cellValue) {
          return ''
        }

        if(!!column.formatS && !!column.show) {
          switch(column.formatS) {
            case 'd1':
              return formatDate1(cellValue);
            case 'd2':
              return formatDate2(cellValue);
            case 'd3':
              return formatDate3(cellValue);
            case 'd4':
              return formatDate4(cellValue);
            case 'd5':
              return formatDate5(cellValue);
            case 'n1':
              return formatNumber1(cellValue);
            case 'n2':
              return formatNumber2(cellValue);
            case 'n3':
              return formatNumber3(cellValue);
            case 'n4':
              return formatNumber4(cellValue);
            case 'n5':
              return formatNumber5(cellValue);
            case 'n6':
              return formatNumber6(cellValue);
            case 'n7':
              return formatNumber7(cellValue);
          }
        }
        return cellValue;
      },


    }
  }
</script>

<style scoped>

</style>
