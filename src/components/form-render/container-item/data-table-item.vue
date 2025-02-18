<template>

	<container-item-wrapper v-show="!widget.options.hidden" :widget="widget">

			<el-table ref="dataTable" :data="widget.options.tableData" :class="[customClass]"
								:height="tableHeight" :style="{'width': widget.options.tableWidth}"
								:border="widget.options.border" :show-summary="widget.options.showSummary"
								:row-key="tableRowKey" :tree-props="{ children: widget.options.childrenKey }"
								:size="widget.options.tableSize" :stripe="widget.options.stripe"
                :highlight-current-row="singleRowSelectFlag"
								:row-class-name="getRowClassName"
                :span-method="getSpanMethod"
								v-loading="loadingFlag"
                @current-change="handleCurrentChange"
								@sort-change="handleSortChange"
								@header-click="handleHeaderClick"
								@row-click="handleRowClick"
								@row-dblclick="handleRowDoubleClick"
								@cell-click="handleCellClick"
								@cell-dblclick="handleCellDoubleClick"
								@select="handleRowSelect"
								@select-all="handleAllSelect"
								:cell-style="{padding: widget.options.rowSpacing + 'px 0'}" >

				<el-table-column v-if="widget.options.showIndex" type="index" width="60" fixed="left"
												 :label="i18nt('designer.setting.lineNumber')">
				</el-table-column>
				<el-table-column v-if="widget.options.showCheckBox" type="selection"
												 :width="selectionWidth"  fixed="left"></el-table-column>

				<template v-for="(item, index) in widget.options.tableColumns">
					<table-high-level-column :column-schema="item" :data-table-ref="getDataTableRef" :column-index="index" :table-options="widget.options">
					</table-high-level-column>
				</template>

				<template v-if="!!widget.options.showButtonsColumn">
					<el-table-column :fixed="buttonsColumnFixed"
													 class-name="data-table-buttons-column" :align="'center'"
													 :label="widget.options.buttonsColumnTitle"
													 :width="widget.options.buttonsColumnWidth">
						<template #default="scope">
							<template v-for="(ob) in widget.options.operationButtons">
								<el-button v-show="showOperationButton(ob, scope.$index, scope.row)"
													 :type="ob.type" :size="ob.size" :round="ob.round"
													 :disabled="disableOperationButton(ob, scope.$index, scope.row)"
													 @click="handleOperationButtonClick(ob.name, scope.$index, scope.row)"
													 :class="['data-table-' + ob.name + '-button']">{{getOperationButtonLabel(ob, scope.$index, scope.row)}}</el-button>
							</template>
						</template>
					</el-table-column>
				</template>
			</el-table>
			<el-pagination v-if="widget.options.showPagination"
										 :align="paginationAlign"
										 :small="widget.options.smallPagination"
										 :current-page="currentPage"
										 :page-sizes="pageSizes"
										 :page-size="pageSize"
										 :layout="paginationLayout"
										 :total="total"
										 @size-change="handlePageSizeChange"
										 @current-change="handleCurrentPageChange">
			</el-pagination>

	</container-item-wrapper>
</template>
<script>
	import ContainerItemWrapper from '@/components/form-render/container-item/container-item-wrapper'
	import emitter from '@/utils/emitter'
	import i18n from "@/utils/i18n"
	import {
		formatDate1,
		formatDate2,
		formatDate3,
		formatDate4,
		formatDate5,
		formatNumber1,
		formatNumber2,
		formatNumber3,
		formatNumber4,
		formatNumber5,
		formatNumber6,
		formatNumber7
	} from "@/utils/format"
	import FieldComponents from '@/components/form-designer/form-widget/field-widget/index'
	import refMixin from "@/components/form-render/refMixin"
	import containerItemMixin from "@/components/form-render/container-item/containerItemMixin"
	import TableColumnCustomRender from '@/components/form-render/table-column-custom-render'
	import {deepClone, getDSByName, overwriteObj, runDataSourceRequest} from "@/utils/util"
	import TableHighLevelColumn from "@/components/form-render/table-high-level-column"

	export default {
    name: "DataTableItem",
    componentName: 'ContainerItem',  //必须固定为ContainerItem，用于接收父级组件的broadcast事件
    mixins: [emitter, i18n, refMixin, containerItemMixin],
		components: {
			TableHighLevelColumn,
		  ContainerItemWrapper,
			TableColumnCustomRender,
		  ...FieldComponents,
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
		inject: ['refList', 'sfRefList', 'globalModel', 'getFormConfig', 'getGlobalDsv'],
		data() {
			return {
				selectAllFlag: false,

				selectedIndices: [],
				selectedRows: [],
				pageSize: this.widget.options.pagination.pageSize,
				pageSizes: this.widget.options.pagination.pageSizes,
				currentPage: this.widget.options.pagination.currentPage,
				total: this.widget.options.pagination.total,

				//是否跳过selectionChange事件
				skipSelectionChangeEvent: false,

				loadingFlag: false,
			}
		},
		computed: {
			formConfig() {
				return this.getFormConfig()
			},

			paginationLayout() {
				return !!this.widget.options.smallPagination ? 'prev, pager, next' : 'total, sizes, prev, pager, next, jumper'
			},

			customClass() {
				return this.widget.options.customClass || ''
			},

      singleRowSelectFlag() {
        return !this.widget.options.showCheckBox
      },

			buttonsColumnFixed() {
				if (this.widget.options.buttonsColumnFixed === undefined) {
					return 'right'
				}

				return !this.widget.options.buttonsColumnFixed ? false : this.widget.options.buttonsColumnFixed
			},

			tableHeight() {
				return this.widget.options.tableHeight || undefined
			},

			selectionWidth() {
				return !this.widget.options.showSummary ? (!this.widget.options.treeDataEnabled ? 50 : 70): 55
			},

			getDataTableRef() {
				return this
			},

			tableRowKey() {
				return !this.widget.options.rowKey ? null : this.widget.options.rowKey
			},

			paginationAlign() {
				return !this.widget.options.paginationAlign ? 'left' : this.widget.options.paginationAlign
			},

		},
		created() {
			this.initRefList()
			this.handleOnCreated()
		},
		mounted() {
			if (!!this.widget.options.dsEnabled) {
				this.loadDataFromDS({})
			}

			this.$nextTick(() => {
				this.handleOnMounted()
			})
		},
		beforeDestroy() {
			this.unregisterFromRefList()
		},
		updated() {
    	this.$nextTick(() => {
				this.$refs.dataTable.doLayout()  //解决合计行有时不显示的问题！！
			})
		},
		methods: {
			formatter(row, column, cellValue) {
			  return cellValue;
			},

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

			getColumnRender(row, column) {
				/* TODO: 每个table-cell，render函数会执行3次，原因不明！！！ */
				return new Function('h', 'params', column.render)
			},

			getRowIndex(row) {
				return this.widget.options.tableData.lastIndexOf(row)
			},

			findColumnAndSetHidden(columnName, hiddenFlag) {
				this.widget.options.tableColumns.forEach(tc => {
					if (tc.prop === columnName) {
						tc.show = !hiddenFlag
					}
				})
			},

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

			/**
			 * 单选时触发该事件
			 * @param currentRow
			 * @param oldCurrentRow
			 */
      handleCurrentChange(currentRow, oldCurrentRow) {
				if (!!this.skipSelectionChangeEvent) {
					return
				}

				if (!!this.widget.options.showCheckBox) {
					return
				}

        this.selectedIndices.length = 0
				this.selectedRows.length = 0
        let rowIndex = this.getRowIndex(currentRow)
				this.selectedIndices.push(rowIndex)
				this.selectedRows.push(currentRow)

        if (!!this.widget.options.onSelectionChange) {
          let customFn = new Function('selection', 'selectedIndices', this.widget.options.onSelectionChange)
          customFn.call(this, [currentRow], this.selectedIndices)
        } else {
          /* 必须调用mixins中的dispatch方法逐级向父组件发送消息！！ */
          this.dispatch('VFormRender', 'dataTableSelectionChange', [this, [currentRow], this.selectedIndices])
        }
      },

			/**
			 * 注意：加载树形数据后，选中行如包含子节点则会触发两次该事件！！
			 * @param selection
			 */
			handleSelectionChange(selection) {
				if (!!this.skipSelectionChangeEvent) {
					return
				}

				this.selectedIndices.length = 0
				this.selectedRows.length = 0
				selection.map((row) => {
					let rowIndex = this.getRowIndex(row)
					this.selectedIndices.push(rowIndex)
					this.selectedRows.push(row)
				})

				if (!!this.widget.options.onSelectionChange) {
					let customFn = new Function('selection', 'selectedIndices', this.widget.options.onSelectionChange)
					customFn.call(this, selection, this.selectedIndices)
				} else {
					/* 必须调用mixins中的dispatch方法逐级向父组件发送消息！！ */
					this.dispatch('VFormRender', 'dataTableSelectionChange', [this, selection, this.selectedIndices])
				}
			},

			handleSortChange({column, prop, order}) {
				if (!!this.widget.options.onSortChange) {
					let customFn = new Function('column', 'prop', 'order', 'pageSize', 'currentPage', this.widget.options.onSortChange)
					customFn.call(this, column, prop, order, this.pageSize, this.currentPage)
				} else {
					/* 必须调用mixins中的dispatch方法逐级向父组件发送消息！！ */
					this.dispatch('VFormRender', 'dataTableSortChange',
									[this, column, prop, order, this.pageSize, this.currentPage])
				}
			},

			handlePageSizeChange(pageSize) {
				this.pageSize = pageSize
				if (!!this.widget.options.dsEnabled && !!this.widget.options.dsName) {
					this.loadDataFromDS()
				}

				if (!!this.widget.options.onPageSizeChange) {
					let customFn = new Function('pageSize', 'currentPage', this.widget.options.onPageSizeChange)
					customFn.call(this, pageSize, this.currentPage)
				} else {
					this.dispatch('VFormRender', 'dataTablePageSizeChange', [this, pageSize, this.currentPage])
				}
			},

			handleCurrentPageChange(currentPage) {
				this.currentPage = currentPage
				if (!!this.widget.options.dsEnabled && !!this.widget.options.dsName) {
					this.loadDataFromDS()
				}

				if (!!this.widget.options.onCurrentPageChange) {
					let customFn = new Function('pageSize', 'currentPage', this.widget.options.onCurrentPageChange)
					customFn.call(this, this.pageSize, currentPage)
				} else {
					this.dispatch('VFormRender', 'dataTablePageChange', [this, this.pageSize, currentPage])
				}
			},

			handleOperationButtonClick(btnName, rowIndex, row) {
				if (!!this.widget.options.onOperationButtonClick) {
					let customFn = new Function('buttonName', 'rowIndex', 'row', this.widget.options.onOperationButtonClick)
					customFn.call(this, btnName, rowIndex, row)
				} else {
					this.dispatch('VFormRender', 'operationButtonClick', [this, btnName, rowIndex, row])
				}
			},

			showOperationButton(buttonConfig, rowIndex, row) {
				if (!!this.widget.options.onHideOperationButton) {
					let customFn = new Function('buttonConfig', 'rowIndex', 'row', this.widget.options.onHideOperationButton)
					return !customFn.call(this, buttonConfig, rowIndex, row)
				} else {
					return !buttonConfig.hidden
				}
			},

			disableOperationButton(buttonConfig, rowIndex, row) {
				if (!!this.widget.options.onDisableOperationButton) {
					let customFn = new Function('buttonConfig', 'rowIndex', 'row', this.widget.options.onDisableOperationButton)
					return customFn.call(this, buttonConfig, rowIndex, row)
				} else {
					return buttonConfig.disabled
				}
			},

			getOperationButtonLabel(buttonConfig, rowIndex, row) {
				if (!!this.widget.options.onGetOperationButtonLabel) {
					let customFn = new Function('buttonConfig', 'rowIndex', 'row', this.widget.options.onGetOperationButtonLabel)
					//return customFn.call(this, buttonConfig, rowIndex, row) || buttonConfig.label
					return customFn.call(this, buttonConfig, rowIndex, row)
				} else {
					return buttonConfig.label
				}
			},

			getRowClassName({row, rowIndex}) {
				if (!!this.widget.options.onGetRowClassName) {
					let customFn = new Function('rowIndex', 'row', this.widget.options.onGetRowClassName)
					return customFn.call(this, rowIndex, row)
				} else {
					return ''
				}
			},

      getSpanMethod({row, column, rowIndex, columnIndex}) {
        if (!!this.widget.options.onGetSpanMethod) {
          let customFn = new Function('row', 'column', 'rowIndex', 'columnIndex', this.widget.options.onGetSpanMethod)
          return customFn.call(this, row, column, rowIndex, columnIndex)
        }
      },

			handleHeaderClick(column, event) {
				if (!!this.widget.options.onHeaderClick) {
					let customFn = new Function('column', 'event', this.widget.options.onHeaderClick)
					return customFn.call(this, column, event)
				}
			},

			handleRowClick(row, column, event) {
				if (!!this.widget.options.onRowClick) {
					let customFn = new Function('row', 'column', 'event', this.widget.options.onRowClick)
					return customFn.call(this, row, column, event)
				}
			},

			handleRowDoubleClick(row, column, event) {
				if (!!this.widget.options.onRowDoubleClick) {
					let customFn = new Function('row', 'column', 'event', this.widget.options.onRowDoubleClick)
					return customFn.call(this, row, column, event)
				}
			},

			handleCellClick(row, column, cell, event) {
				if (!!this.widget.options.onCellClick) {
					let customFn = new Function('row', 'column', 'cell', 'event', this.widget.options.onCellClick)
					return customFn.call(this, row, column, cell, event)
				}
			},

			handleCellDoubleClick(row, column, cell, event) {
				if (!!this.widget.options.onCellDoubleClick) {
					let customFn = new Function('row', 'column', 'cell', 'event', this.widget.options.onCellDoubleClick)
					return customFn.call(this, row, column, cell, event)
				}
			},

			toggleSelection(row, flag, selectedRows) {
				if (row) {
					this.$refs.dataTable.toggleRowSelection(row, flag)

					if (flag) {
						selectedRows.push(row)
						return
					}

					let foundRowIdx = -1
					let rowKey = this.widget.options.rowKey || 'id'
					selectedRows.forEach((sr, idx) => {
						if (sr[rowKey] === row[rowKey]) {
							foundRowIdx = idx
						}
					})

					if (foundRowIdx > -1) {
						selectedRows.splice(foundRowIdx, 1)
					}
				}
			},

			setChildrenSelected(children, flag, selectedRows) {
				let childrenKey = this.widget.options.childrenKey || 'children'
				children.map(child => {
					this.toggleSelection(child, flag, selectedRows)
					if (child[childrenKey]) {
						this.setChildrenSelected(child[childrenKey], flag, selectedRows)
					}
				})
			},

			/**
			 * 注意：
			 * element ui的el-table存在一个严重bug：加载树形数据后，选择父节点时不会同步选中下属子节点。
			 * 为解决这个问题，用select事件和select-all事件替换selection-change处理节点的选中！！
			 */
			handleRowSelect(selection, row) {
				this.skipSelectionChangeEvent = true

				let selectedRows = deepClone(selection)
				let rowKey = this.widget.options.rowKey || 'id'
				let childrenKey = this.widget.options.childrenKey || 'children'
				if (selection.some(el => { return row[rowKey] === el[rowKey] })) {
					if (row[childrenKey]) {
						this.setChildrenSelected(row[childrenKey], true, selectedRows)
					}
				} else {
					if (row[childrenKey]) {
						this.setChildrenSelected(row[childrenKey], false, selectedRows)
					}
				}

				this.skipSelectionChangeEvent = false
				// 一次性处理多行选中或取消选中，只触发一次事件！！！
				this.$nextTick(() => {
					this.handleSelectionChange(selectedRows)
				})
			},

			setSelectedFlag(data, flag) {
				let childrenKey = this.widget.options.childrenKey || 'children'
				data.forEach(row => {
					this.$refs.dataTable.toggleRowSelection(row, flag)
					if (row[childrenKey]) {
						this.setSelectedFlag(row[childrenKey], flag)
					}
				})
			},

			/**
			 * 注意：
			 * element ui的el-table存在一个严重bug：加载树形数据后，选择父节点时不会同步选中下属子节点。
			 * 为解决这个问题，用select事件和select-all事件替换selection-change处理节点的选中！！
			 */
			handleAllSelect(selection) {
				this.skipSelectionChangeEvent = true
				this.selectAllFlag = !this.selectAllFlag
				this.setSelectedFlag(this.widget.options.tableData, this.selectAllFlag)

				this.skipSelectionChangeEvent = false
				// 一次性处理多行选中或取消选中，只触发一次事件！！！
				this.$nextTick(() => {
					this.handleSelectionChange(selection)
				})
			},

			//--------------------- 以下为组件支持外部调用的API方法 begin ------------------//
			/* 提示：用户可自行扩充这些方法！！！ */

			refreshLayout() { // 刷新表格显示，防止行列显示错位！！
				this.$refs.dataTable.doLayout()
			},

			getTableColumns() {
				return this.widget.options.tableColumns
			},

			/**
			 * 设置表格列
			 * @param tableColumns
			 */
			setTableColumns(tableColumns) {
				this.widget.options.tableColumns = tableColumns
				this.$nextTick(() => {
					this.$refs.dataTable.doLayout()  //防止行列显示错位！！
				})
			},

			/**
			 * 设置表格列（为了兼容文档错误，setTableColumn应为setTableColumns）
			 * @param tableColumns
			 */
			setTableColumn(tableColumns) {
				this.setTableColumns(tableColumns)
			},

			/**
			 * 从数据源加载表格列
			 * @param localDsv 本地数据源变量DSV
			 * @param dsName 数据源名称
			 */
			loadColumnsFromDS(localDsv = {}, dsName) {
				let curDS = getDSByName(this.formConfig, dsName)
				if (!!curDS) {
					let gDsv = this.getGlobalDsv() || {}
					let newDsv = new Object({})
					overwriteObj(newDsv, gDsv)
					overwriteObj(newDsv, localDsv)
					newDsv.widgetName = this.widget.options.name
					this.loadingFlag = true
					runDataSourceRequest(curDS, newDsv, this.getFormRef(), false, this.$message).then(res => {
						this.setTableColumns(res)
						this.loadingFlag = false
					}).catch(err => {
						this.$message.error(err.message)
						this.loadingFlag = false
					})
				}
			},

			/**
			 * 动态设置表格列的隐藏或显示
			 * @param columnNames
			 * @param hiddenFlag
			 */
			setTableColumnsHidden(columnNames, hiddenFlag) {
				if (!!columnNames) {
					if (typeof columnNames === 'string') {
						this.findColumnAndSetHidden(columnNames, hiddenFlag)
					} else if (Array.isArray(columnNames)) {
						columnNames.forEach(cn => {
							this.findColumnAndSetHidden(cn, hiddenFlag)
						})
					}

					this.$nextTick(() => {
						this.$refs.dataTable.doLayout()  //防止行列显示错位！！
					})
				}
			},

			/**
			 * 获取表格数据
			 */
			getTableData() {
				return this.widget.options.tableData
			},

			/**
			 * 设置表格数据
			 * @param tableData
			 */
			setTableData(tableData) {
				this.loadingFlag = true
				this.widget.options.tableData = tableData
				this.loadingFlag = false
			},

			/**
			 * 从数据源加载表格数据
			 * @param localDsv 本地数据源变量DSV
			 * @param dsName 数据源名称，不传此值，则使用dsName属性绑定的数据源
			 */
			loadDataFromDS(localDsv = {}, dsName = '') {
				let curDSName = dsName || this.widget.options.dsName
				let curDSetName = this.widget.options.dataSetName
				let curDS = getDSByName(this.formConfig, curDSName)
				if (!!curDS) {
					let gDsv = this.getGlobalDsv() || {}
					let newDsv = new Object({})
					overwriteObj(newDsv, gDsv)
					overwriteObj(newDsv, localDsv)
					newDsv.widgetName = this.widget.options.name
					newDsv.pageSize = this.pageSize
					newDsv.currentPage = this.currentPage
					this.loadingFlag = true
					runDataSourceRequest(curDS, newDsv, this.getFormRef(), false, this.$message).then(res => {
						if (!!curDSetName && res.hasOwnProperty(curDSetName)) {
							this.setTableData(res[curDSetName])
						} else {
							this.setTableData(res)
						}
						this.loadingFlag = false
					}).catch(err => {
						this.$message.error(err.message)
						this.loadingFlag = false
					})
				}
			},

			/**
			 * 设置表格分页
			 * @param pagination
			 */
			setPagination(pagination) {
				if (pagination.currentPage !== undefined) {
					this.currentPage = pagination.currentPage
					this.widget.options.pagination.currentPage = pagination.currentPage
				}

				if (pagination.pageSize !== undefined) {
					this.pageSize = pagination.pageSize
					this.widget.options.pagination.pageSize = pagination.pageSize
				}

				if (pagination.pageSizes !== undefined) {
					this.pageSizes = pagination.pageSizes
					this.widget.options.pagination.pageSizes = pagination.pageSizes
				}

				if (pagination.total !== undefined) {
					this.total = pagination.total
					this.widget.options.pagination.total = pagination.total
				}
			},

			getPagination() {
				return {
					currentPage: this.widget.options.pagination.currentPage,
					pageSize: this.widget.options.pagination.pageSize,
					total: this.widget.options.pagination.total
				}
			},

			/**
			 * 获取选中行数据，格式为对象数组
			 * @returns {[]}
			 */
			getSelectedRow() {
				//return this.$refs.dataTable.selection
				return this.selectedRows
			},

			/**
			 * 获取选中行索引，格式为数组
			 * @returns {[]}
			 */
			getSelectedIndex() {
				return this.selectedIndices
			},

			getNativeTable() {
				return this.$refs.dataTable
			},

			//--------------------- 以上为组件支持外部调用的API方法 end ------------------//

    }
  }
</script>

<style lang="scss" scoped>
	.collapse-container {
	  margin: 2px;

	  .form-widget-list {
	    min-height: 28px;
	  }
	}

	::v-deep .el-collapsed__header {
	  padding: 10px 12px;
	}
</style>
