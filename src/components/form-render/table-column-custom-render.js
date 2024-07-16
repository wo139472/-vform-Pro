export default {
  name: "table-column-custom-render",
  functional: true,
  props: {
    row: Object,
    column: Object,
    rowIndex: Number,
    columnIndex: Number,
    dataTableRef: Object,  //指向data-table组件实例
    renderFn: Function
  },
  render(h, ctx) {
    const params = {
      row: ctx.props.row,
      column: ctx.props.column,
      rowIndex: ctx.props.rowIndex,
      columnIndex: ctx.props.columnIndex,
      dataTableRef: ctx.props.dataTableRef,  //指向data-table组件实例
    }

    return ctx.props.renderFn(h, params)
  }
}
