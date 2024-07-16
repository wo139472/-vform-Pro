<template>

	<container-wrapper :designer="designer" :widget="widget" :parent-widget="parentWidget" :parent-list="parentList"
		:index-of-parent-list="indexOfParentList">
		<div class="collapse-container"
			:class="{'selected': selected}" @click.stop="selectWidget(widget)">

			<el-table :data="widget.options.tableData" ref="dataTable" :class="[customClass]" :key="tableKey"
								:height="tableHeight" :style="{'width': widget.options.tableWidth}"
								:border="widget.options.border" :show-summary="widget.options.showSummary"
								:row-key="tableRowKey" :tree-props="{ children: widget.options.childrenKey }"
								:size="widget.options.tableSize" @click.native.stop="selectWidget(widget)" :stripe="widget.options.stripe"
								@select="handleRowSelect" @select-all="handleAllSelect"
								:cell-style="{padding: widget.options.rowSpacing + 'px 0'}">

				<el-table-column v-if="widget.options.showIndex" type="index" width="60" fixed="left"
												 :label="i18nt('designer.setting.lineNumber')"></el-table-column>
				<el-table-column v-if="widget.options.showCheckBox" type="selection"
												 :width="selectionWidth" fixed="left"></el-table-column>

				<template v-for="(item, index) in widget.options.tableColumns">
					<table-multi-level-column :key="index" :column-schema="item" :table-options="widget.options"></table-multi-level-column>
				</template>

				<template v-if="!!widget.options.showButtonsColumn">
					<el-table-column :fixed="buttonsColumnFixed"
													 class-name="data-table-buttons-column" :align="'center'"
													 :label="widget.options.buttonsColumnTitle"
													 :width="widget.options.buttonsColumnWidth">
						<template #default="scope">
							<template v-for="(ob, idx) in widget.options.operationButtons">
								<el-button v-if="!ob.hidden" :type="ob.type" :size="ob.size" :round="ob.round" :disabled="ob.disabled"
													 :class="['data-table-' + ob.name + '-button']">
									{{ob.label}}</el-button>
							</template>
						</template>
					</el-table-column>
				</template>
			</el-table>
			<el-pagination v-if="widget.options.showPagination"
										 :align="paginationAlign"
									 	 :small="widget.options.smallPagination"
										 :current-page="widget.options.pagination.currentPage"
										 :page-sizes="widget.options.pagination.pageSizes"
										 :page-size="widget.options.pagination.pageSize"
										 :layout="paginationLayout"
										 :total="widget.options.pagination.total">
			</el-pagination>

		</div>
	</container-wrapper>

</template>

<script>
	import ContainerWrapper from "@/components/form-designer/form-widget/container-widget/container-wrapper"
  import i18n from "@/utils/i18n"
	import {formatDate1, formatDate2, formatDate3, formatDate4, formatDate5,
					formatNumber1, formatNumber2, formatNumber3, formatNumber4,
					formatNumber5, formatNumber6, formatNumber7} from "@/utils/format"
	import Draggable from 'vuedraggable'
	import FieldComponents from '@/components/form-designer/form-widget/field-widget/index'
	import containerMixin from "@/components/form-designer/form-widget/container-widget/containerMixin"
	import refMixinDesign from "@/components/form-designer/refMixinDesign"
	import TableMultiLevelColumn from "@/components/form-designer/form-widget/table-multi-level-column"
	import {generateId} from "@/utils/util";

  export default {
    name: "DataTableWidget",
    componentName: 'DataTableWidget',
    mixins: [i18n, containerMixin, refMixinDesign],
		inject: ['refList'],
		components: {
			TableMultiLevelColumn,
		  ContainerWrapper,
		  Draggable,
		  ...FieldComponents,
		},
		data() {
			return {
				selectAllFlag: false,
				elTableKey: '',
			}
		},
    props: {
			widget: Object,
			parentWidget: Object,
			parentList: Array,
			indexOfParentList: Number,
			designer: Object,

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
		created() {
			this.initRefList()
		},
		mounted() {

		},
    beforeDestroy() {

    },
		computed: {
    	paginationLayout() {
				return !!this.widget.options.smallPagination ? 'prev, pager, next' : 'total, sizes, prev, pager, next, jumper'
			},

			selected() {
			  return this.widget.id === this.designer.selectedId
			},

			customClass() {
			  return this.widget.options.customClass || ''
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

			tableRowKey() {
				return !this.widget.options.treeDataEnabled ? null : this.widget.options.rowKey
			},

			tableKey() {
    		return this.elTableKey || this.widget.id
			},

			paginationAlign() {
				return !this.widget.options.paginationAlign ? 'left' : this.widget.options.paginationAlign
			},

		},
    methods: {
    	refreshTableKey() {
    		this.elTableKey = 'el-table-key-' + generateId()
			},

			selectWidget(widget) {
				this.designer.setSelected(widget)
			},

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

			refreshLayout() { // 刷新表格显示，防止行列显示错位！！
				this.$refs['dataTable'].doLayout()
			},

			getTableColumns() {
				return this.widget.options.tableColumns
			},

			setChildrenSelected(children, flag) {
				let childrenKey = this.widget.options.childrenKey
				children.map(child => {
					this.toggleSelection(child, flag)
					if (child[childrenKey]) {
						this.setChildrenSelected(child[childrenKey], flag)
					}
				})
			},

			toggleSelection(row, flag) {
				if (row) {
					this.$nextTick(() => {
						this.$refs.dataTable.toggleRowSelection(row, flag)
					})
				}
			},

			handleRowSelect(selection, row) {
				let childrenKey = this.widget.options.childrenKey
				if (selection.some(el => { return row.id === el.id })) {
					if (row[childrenKey]) {
						this.setChildrenSelected(row[childrenKey], true)
					}
				} else {
					if (row[childrenKey]) {
						this.setChildrenSelected(row[childrenKey], false)
					}
				}
			},

			setSelectedFlag(data, flag) {
				let childrenKey = this.widget.options.childrenKey
				data.forEach(row => {
					this.$refs.dataTable.toggleRowSelection(row, flag)
					if (row[childrenKey]) {
						this.setSelectedFlag(row[childrenKey], flag)
					}
				})
			},

			handleAllSelect(selection) {
				this.selectAllFlag = !this.selectAllFlag
				this.setSelectedFlag(this.widget.options.tableData, this.selectAllFlag)
			},

			getNativeTable() {
				return this.$refs.dataTable
			},

    }
  }
</script>

<style lang="scss" scoped>
	.collapse-container {
	  //padding: 5px;
	  margin: 2px;

	  .form-widget-list {
	    min-height: 28px;
	  }
	}

	.collapse-container.selected {
	  outline: 2px solid $--color-primary !important;
	}

	::v-deep .el-collapsed__header {
	  padding: 10px 12px;
	}
</style>
