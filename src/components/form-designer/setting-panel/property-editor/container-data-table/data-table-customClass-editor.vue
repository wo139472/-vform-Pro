<template>
  <div>
		<el-form-item :label="i18nt('designer.setting.tableWidth')">
			<el-input v-model="optionModel.tableWidth"></el-input>
		</el-form-item>
		<el-form-item :label="i18nt('designer.setting.tableHeight')">
			<el-input v-model="optionModel.tableHeight"></el-input>
		</el-form-item>
		<el-form-item :label="i18nt('designer.setting.customClass')">
			<el-select v-model="optionModel.customClass" multiple filterable allow-create
								 default-first-option>
				<el-option v-for="(item, idx) in cssClassList" :key="idx" :label="item" :value="item"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item :label="i18nt('designer.setting.showIndex')">
			<el-switch v-model="optionModel.showIndex"></el-switch>
		</el-form-item>
		<el-form-item :label="i18nt('designer.setting.showCheckBox')">
			<el-switch v-model="optionModel.showCheckBox"></el-switch>
		</el-form-item>
		<el-form-item :label="i18nt('designer.setting.showPagination')">
			<el-switch v-model="optionModel.showPagination"></el-switch>
		</el-form-item>
		<el-form-item :label="i18nt('designer.setting.paginationAlign')" v-if="!!optionModel.showPagination">
			<el-radio-group v-model="optionModel.paginationAlign" class="radio-group-custom">
				<el-radio-button label="left">
					{{i18nt('designer.setting.leftAlign')}}</el-radio-button>
				<el-radio-button label="center">
					{{i18nt('designer.setting.centerAlign')}}</el-radio-button>
				<el-radio-button label="right">
					{{i18nt('designer.setting.rightAlign')}}</el-radio-button>
			</el-radio-group>
		</el-form-item>
		<el-form-item :label="i18nt('designer.setting.smallPagination')">
			<el-switch v-model="optionModel.smallPagination"></el-switch>
		</el-form-item>
		<el-form-item :label="i18nt('designer.setting.showSummary')">
			<el-switch v-model="optionModel.showSummary"></el-switch>
		</el-form-item>
		<el-form-item :label="i18nt('designer.setting.stripe')">
			<el-switch v-model="optionModel.stripe"></el-switch>
		</el-form-item>
		<el-form-item :label="i18nt('designer.setting.rowSpacing')">
			<el-input-number v-model="optionModel.rowSpacing" controls-position="right" :min="0" :max="20" style="width: 100%">
			</el-input-number>
		</el-form-item>
		<el-form-item :label="i18nt('designer.setting.widgetSize')">
			<el-select v-model="optionModel.tableSize" @change="refreshTableLayout">
				<el-option v-for="item in widgetSizes" :key="item.value" :label="item.label"
									 :value="item.value">
				</el-option>
			</el-select>
		</el-form-item>
		<el-form-item :label="i18nt('designer.setting.autoColumnWidthDisabled')" :title="i18nt('designer.setting.autoColumnWidthDisabled')">
			<el-switch v-model="optionModel.autoColumnWidthDisabled"></el-switch>
		</el-form-item>
		<el-form-item :label="i18nt('designer.setting.tableColEdit')">
			<el-button type="primary" plain round @click="openSetting">{{i18nt('designer.setting.editAction')}}</el-button>
		</el-form-item>
		<el-form-item v-show="!optionModel.dsEnabled" :label="i18nt('designer.setting.tableDataEdit')"> <!-- 此处使用v-if指令会报错，原因不明？？ -->
			<el-button type="primary" plain round @click="openTableDataEdit">{{i18nt('designer.setting.editAction')}}</el-button>
		</el-form-item>
		<el-form-item :label="i18nt('designer.setting.dsEnabled')">
			<el-switch v-model="optionModel.dsEnabled"></el-switch>
		</el-form-item>
		<el-form-item v-if="!!optionModel.dsEnabled" :label="i18nt('designer.setting.dsName')">
			<el-select v-model="optionModel.dsName" filterable clearable @change="getDataSetList">
				<el-option v-for="(item, idx) in dataSourceList" :key="idx" :title="item.description"
									 :label="item.uniqueName" :value="item.uniqueName"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item v-if="!!optionModel.dsEnabled" :label="i18nt('designer.setting.dataSetName')">
			<el-select v-model="optionModel.dataSetName" filterable clearable>
				<el-option v-for="(item, idx) in dataSetList" :key="idx" :title="item.remark"
									 :label="item.name" :value="item.name"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item :label="i18nt('designer.setting.treeDataEnabled')">
			<el-switch v-model="optionModel.treeDataEnabled" @change="handleTDEChange"></el-switch>
		</el-form-item>
		<el-form-item :label="i18nt('designer.setting.rowKeyOfTreeData')">
			<el-input v-model="optionModel.rowKey"></el-input>
		</el-form-item>
		<el-form-item v-if="!!optionModel.treeDataEnabled" :label="i18nt('designer.setting.childrenKeyOfTreeData')">
			<el-input v-model="optionModel.childrenKey"></el-input>
		</el-form-item>
		<el-form-item :label="i18nt('designer.setting.showButtonsColumn')">
			<el-switch v-model="optionModel.showButtonsColumn" @change="handleShowButtonsColumnChange"></el-switch>
		</el-form-item>
		<el-form-item :label="i18nt('designer.setting.buttonsColumnEdit')" v-if="!!optionModel.showButtonsColumn">
			<el-button type="primary" plain round @click="editButtonsColumn">{{i18nt('designer.setting.editAction')}}</el-button>
		</el-form-item>

		<el-dialog :title="i18nt('designer.setting.tableDataEdit')" :visible.sync="dataDialogVisible"
							 v-if="dataDialogVisible" :show-close="true" class="small-padding-dialog" append-to-body
							 v-dialog-drag :close-on-click-modal="false" :close-on-press-escape="false"
							 :destroy-on-close="true" width="75%">
			<code-editor :mode="'json'" :readonly="false" v-model="tableDataOptions"></code-editor>
			<template #footer>
				<div class="dialog-footer">
					<el-button size="large" type="primary" @click="saveTableData">{{i18nt('designer.hint.confirm')}}</el-button>
					<el-button size="large" type="" @click="dataDialogVisible = false">{{i18nt('designer.hint.cancel')}}</el-button>
				</div>
			</template>
		</el-dialog>

		<el-dialog :title="i18nt('designer.setting.tableColEdit')" :visible.sync="dialogVisible"
			v-if="dialogVisible" :show-close="true" class="small-padding-dialog"
			v-dialog-drag :close-on-click-modal="false" :close-on-press-escape="false" append-to-body
			:destroy-on-close="true" width="1500px">
			<el-table :data="optionModel.tableColumns" style="width: 100%" :cell-style="{padding:'1px 0'}"
				  height="500" border row-key="columnId" ref="singleTable" stripe>
				<el-table-column type="index" width="35" fixed="left"></el-table-column>

				<el-table-column width="160" prop="columnId">
					<template #default="scope">
						<span v-if="!scope.row.headerFlag">{{i18nt('designer.setting.tableDataColumn')}}</span>
						<span v-else>{{getHeaderSpace(scope.row)}}</span>
					</template>
				</el-table-column>

				<el-table-column label="" width="30">
					<i class="iconfont icon-drag drag-option column-drag-handler"></i>
				</el-table-column>

				<el-table-column :label="i18nt('designer.setting.columnName')" width="150" prop="prop" class-name="placeholder-hide">
					<template slot-scope="scope">
						<el-input v-if="!scope.row.headerFlag" v-model="scope.row.prop"></el-input>
						<span v-else>{{getHeaderTitle(scope.row)}}</span>
					</template>
				</el-table-column>
				<el-table-column :label="i18nt('designer.setting.columnLabel')" width="150" prop="label">
					<template slot-scope="scope">
						<el-input v-model="scope.row.label"></el-input>
					</template>
				</el-table-column>
				<el-table-column :label="i18nt('designer.setting.columnWidth')" width="100" prop="width">
					<template slot-scope="scope">
						<el-input v-if="!scope.row.headerFlag" v-model="scope.row.width"></el-input>
					</template>
				</el-table-column>
				<el-table-column :label="i18nt('designer.setting.visibleColumn')" width="70" prop="show">
					<template slot-scope="scope">
						<el-switch v-if="!scope.row.headerFlag" v-model="scope.row.show"></el-switch>
					</template>
				</el-table-column>
				<el-table-column :label="i18nt('designer.setting.customSortColumn')" width="90" prop="customSort">
					<template #default="scope">
						<el-switch v-if="!scope.row.headerFlag" v-model="scope.row.customSort"></el-switch>
					</template>
				</el-table-column>
				<el-table-column :label="i18nt('designer.setting.sortableColumn')" width="70" prop="sortable">
					<template slot-scope="scope">
						<el-switch v-if="!scope.row.headerFlag" v-model="scope.row.sortable"></el-switch>
					</template>
				</el-table-column>
				<el-table-column :label="i18nt('designer.setting.fixedColumn')" width="100" prop="fixed">
					<template slot-scope="scope">
						<el-select v-if="!scope.row.headerFlag" v-model="scope.row.fixed">
							<el-option value="">false</el-option>
							<el-option value="left">left</el-option>
							<el-option value="right">right</el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column :label="i18nt('designer.setting.alignTypeOfColumn')" width="100" prop="align">
					<template slot-scope="scope">
						<el-select v-model="scope.row.align">
								<el-option v-for="item in alignOptions" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
						</el-select>
					</template>
				</el-table-column>
				<!-- <el-table-column label="字段类型" width="100">
					<template slot-scope="scope">
						<el-select v-model="scope.row.fieldType" placeholder="请选择">
								<el-option v-for="item in fieldTypeOptions" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
						</el-select>
					</template>
				</el-table-column> -->
				<el-table-column :label="i18nt('designer.setting.formatOfColumn')" width="200" prop="formatS">
					<template slot-scope="scope">
						<el-select v-if="!scope.row.headerFlag" v-model="scope.row.formatS" clearable>
							<el-option-group :label="i18nt('designer.setting.customRenderGroup')" key="custom-render-group">
								<el-option value="render" label="render"></el-option>
							</el-option-group>
							<el-option-group
									v-for="group in op"
									:key="group.label"
									:label="group.label">
									<el-option
									v-for="item in group.options"
									:key="item.value"
									:label="item.label"
									:value="item.value">
									</el-option>
							</el-option-group>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column :label="i18nt('designer.setting.renderFunction')" width="80" fixed="right" align="center">
					<template slot-scope="scope">
						<el-button :disabled="scope.row.formatS !== 'render'" @click="showRenderDialog(scope.row)"
											 size="mini" plain round icon="el-icon-edit"></el-button>
					</template>
				</el-table-column>
				<el-table-column :label="i18nt('designer.setting.actionColumn')" width="100" fixed="right" align="center">
					<template slot-scope="scope">
						<el-dropdown @command="(command) => handleAddColCommand(command, scope.$index, scope.row)">
							<el-button :title="i18nt('designer.setting.addTableColumn')" size="small" circle icon="el-icon-plus">
							</el-button>
							<template #dropdown>
								<el-dropdown-menu>
									<el-dropdown-item command="column">{{i18nt('designer.setting.insertTableDataColumn')}}</el-dropdown-item>
									<el-dropdown-item :disabled="disableDropdownItem(scope.row, 'header')" command="sub-column">{{i18nt('designer.setting.insertTableSubDataColumn')}}</el-dropdown-item>
									<el-dropdown-item command="header">{{i18nt('designer.setting.insertTableHeader')}}</el-dropdown-item>
									<el-dropdown-item :disabled="disableDropdownItem(scope.row, 'sub-header')" command="sub-header">{{i18nt('designer.setting.insertTableSubHeader')}}</el-dropdown-item>
								</el-dropdown-menu>
							</template>
						</el-dropdown>
						<el-button :title="i18nt('designer.setting.deleteTableColumn')" size="mini" type="" circle
							@click="handleDelete(scope.$index, scope.row)" icon="el-icon-minus"></el-button>
					</template>
				</el-table-column>
			</el-table>
			<template #footer>
				<div class="dialog-footer">
					<el-button size="large" @click="colSubmit">{{i18nt('designer.hint.closePreview')}}</el-button>
				</div>
			</template>
		</el-dialog>

		<el-dialog :title="i18nt('designer.setting.buttonsColumnEdit')" :visible.sync="showButtonsEditDialog" v-if="showButtonsEditDialog"
							 :show-close="true" custom-class="drag-dialog small-padding-dialog" append-to-body v-dialog-drag
							 :close-on-click-modal="false" :close-on-press-escape="false"
							 :destroy-on-close="true" width="1120px">
			<el-form label-position="top" :model="optionModel">
				<el-row :gutter="8">
					<el-col :span="11">
						<el-form-item prop="buttonsColumnTitle" :label="i18nt('designer.setting.buttonsColumnTitle')">
							<el-input v-model="optionModel.buttonsColumnTitle"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item prop="buttonsColumnWidth" :label="i18nt('designer.setting.buttonsColumnWidth')">
							<el-input-number v-model="optionModel.buttonsColumnWidth"></el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="5">
						<el-form-item prop="buttonsColumnFixed" :label="i18nt('designer.setting.fixedColumn')">
							<el-select v-model="optionModel.buttonsColumnFixed">
								<el-option value="">false</el-option>
								<el-option value="left">left</el-option>
								<el-option value="right">right</el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-divider content-position="left">{{i18nt('designer.setting.operationButtonsSetting')}}</el-divider>
					</el-col>
				</el-row>
				<draggable tag="div" :list="optionModel.operationButtons"
									 v-bind="{ghostClass: 'ghost', handle: '.drag-handler'}">
					<el-row v-for="(btn, bIdx) in optionModel.operationButtons" :key="bIdx" :gutter="8" class="button-row">
						<el-col :span="1" class="drag-sort-col">
							<i class="iconfont icon-drag drag-handler"></i>
						</el-col>
						<el-col :span="3">
							<el-form-item :prop="'operationButtons.' + bIdx + '.name'" label-width="50px"
														:label="i18nt('designer.setting.operationButtonName')" :rules="nameRules">
								<el-input v-model="btn.name" @focus="onButtonNameFocus"
													@change="(value) => onButtonNameChange(value, bIdx)"
													:placeholder="i18nt('designer.setting.operationButtonName')"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="3">
							<el-form-item :prop="'operationButtons.' + bIdx + '.label'" label-width="50px"
														:label="i18nt('designer.setting.operationButtonLabel')">
								<el-input v-model="btn.label" :placeholder="i18nt('designer.setting.operationButtonLabel')"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="4">
							<el-form-item :prop="'operationButtons.' + bIdx + '.type'" label-width="50px"
														:label="i18nt('designer.setting.operationButtonType')">
								<el-select v-model="btn.type" :placeholder="i18nt('designer.setting.operationButtonType')">
									<el-option value="">default</el-option>
									<el-option value="text">text</el-option>
									<el-option value="primary">primary</el-option>
									<el-option value="success">success</el-option>
									<el-option value="warning">warning</el-option>
									<el-option value="danger">danger</el-option>
									<el-option value="info">info</el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="3">
							<el-form-item :prop="'operationButtons.' + bIdx + '.size'" label-width="50px"
														:label="i18nt('designer.setting.operationButtonSize')">
								<el-select v-model="btn.size" :placeholder="i18nt('designer.setting.operationButtonSize')">
									<el-option value="medium">medium</el-option>
									<el-option value="small">small</el-option>
									<el-option value="mini">mini</el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="3">
							<el-form-item :prop="'operationButtons.' + bIdx + '.round'" label-width="50px"
														:label="i18nt('designer.setting.operationButtonRound')">
								<el-switch v-model="btn.round" ></el-switch>
							</el-form-item>
						</el-col>
						<el-col :span="3">
							<el-form-item :prop="'operationButtons.' + bIdx + '.hidden'" label-width="50px"
														:label="i18nt('designer.setting.operationButtonHidden')">
								<el-switch v-model="btn.hidden" ></el-switch>
							</el-form-item>
						</el-col>
						<el-col :span="3">
							<el-form-item :prop="'operationButtons.' + bIdx + '.disabled'" label-width="50px"
														:label="i18nt('designer.setting.operationButtonDisabled')">
								<el-switch v-model="btn.disabled" ></el-switch>
							</el-form-item>
						</el-col>
						<el-col :span="1">
							<el-button icon="el-icon-delete" plain circle @click="deleteOperationButton(bIdx)"></el-button>
						</el-col>
					</el-row>
				</draggable>
				<el-row :gutter="0">
					<el-col :span="4">
						<el-button type="primary" size="small" icon="el-icon-plus"
											 plain round @click="addOperationButton">{{i18nt('designer.setting.addOperationButton')}}</el-button>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button size="default" @click="showButtonsEditDialog = false">{{i18nt('designer.hint.closePreview')}}</el-button>
				</div>
			</template>
		</el-dialog>

		<el-dialog :title="i18nt('designer.setting.renderFunction')" :visible.sync="showRenderDialogFlag"
							 v-if="showRenderDialogFlag" v-dialog-drag append-to-body
							 :show-close="true" custom-class="drag-dialog small-padding-dialog"
							 :close-on-click-modal="false" :close-on-press-escape="false" :destroy-on-close="true">
			<el-alert type="info" :closable="false" title="function customRender(h, params) {"></el-alert>
			<code-editor :mode="'javascript'" :readonly="false" v-model="renderJson" ref="dsResultEditor"></code-editor>
			<el-alert type="info" :closable="false" title="}"></el-alert>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="saveColumnRender">
					{{i18nt('designer.hint.confirm')}}</el-button>
				<el-button @click="showRenderDialogFlag = false">
					{{i18nt('designer.hint.cancel')}}</el-button>
			</div>
		</el-dialog>

  </div>

</template>

<script>
  import i18n from "@/utils/i18n"
  import Draggable from 'vuedraggable'
	import {deepClone, generateId, getDSByName} from "@/utils/util"
	import Sortable from "sortablejs"
	import CodeEditor from '@/components/code-editor/index'
  export default {
    name: "data-table-customClass-editor",
    componentName: 'PropertyEditor',
    mixins: [i18n],
    components: {
      Draggable,
			CodeEditor,
    },
    props: {
      designer: Object,
      selectedWidget: Object,
      optionModel: Object,
    },
    data() {
      return {
				dialogVisible: false,
				dataDialogVisible: false,
				showButtonsEditDialog: false,
				oldButtonName: '',
        cssClassList: [],
				tableDataOptions:[],
				dataSetList: [],
				widgetSizes: [
				  {label: 'default', value: ''},
				  {label: 'large', value: 'large'},
				  {label: 'medium', value: 'medium'},
				  {label: 'small', value: 'small'},
				  {label: 'mini', value: 'mini'},
				],
				alignOptions: [
					{
						value: 'left',
						label: 'left'
					}, {
						value: 'center',
						label: 'center'
					}, {
						value: 'right',
						label: 'right'
					},
				],
				fieldTypeOptions:[
					{
						value: 'text',
						label: 'Text'
					}, {
						value: 'number',
						label: 'Number'
					}, {
						value: 'date',
						label: 'Date'
					},
				],
				op:[{
						label: 'Date Format',
						options: [
							{value:'d1',label:"yyyy-MM-dd"},
							{value:'d2',label:"yyyy/MM/dd"},
							{value:'d3',label:"yyyy年MM月dd日"},
							{value:'d4',label:"yyyy-MM-dd HH:mm:ss"},
							{value:'d5',label:"yyyy-MM-dd hh:mm:ss"},
						]
					}, {
          label: 'Number Format',
          options: [
						{value:'n1',label:"###,###,###,##0.######"},
						{value:'n2',label:"###,###,###,##0.00####"},
						{value:'n3',label:"###,###,###,##0.000000"},
						{value:'n4',label:"###,###,###,##0.000"},
						{value:'n5',label:"###,###,###,##0.00"},
						{value:'n6',label:"###,###,###,##0"},
						{value:'n7',label:"###,##0.00##%"},

					]
        }],

				showRenderDialogFlag: false,
				renderJson: '',
				currentTableColumn: null,
				tableColumnRows: null,

				nameRules: [
					{ required: true, trigger: ['blur', 'change'], message: this.i18nt('designer.setting.fieldValueRequired') },
				],
      }
    },
		computed: {
			dataSourceList() {
				if (!this.designer.formConfig || !this.designer.formConfig.dataSources) {
					return []
				} else {
					return this.designer.formConfig.dataSources
				}
			},

		},
		watch: {
			selectedWidget: {
				handler(val, oldVal) {
					if (!val) {
						return
					}

					this.loadDataSet(val.options.dsName)
				},
				immediate: true
			},

		},
    created() {
      this.cssClassList = deepClone(this.designer.getCssClassList())
      //监听表单css代码改动事件并重新加载！
      this.designer.handleEvent('form-css-updated', (cssClassList) => {
        this.cssClassList = cssClassList
      })
    },
		mounted(){
			//
		},
    methods: {
			treeColumnsToArray() {  // 展开树形数据为扁平数组
				const resultArray = []
				const expandFn = (treeData, level) => {
					treeData.map(col => {
						let newCol = deepClone(col)
						newCol.nodeLevel = level
						resultArray.push(newCol)

						if (col.children) {
							expandFn(col.children, level + 1)
						}
					})
				}

				expandFn(this.optionModel.tableColumns, 1)
				return resultArray
			},

			getParentArrayOfTableColumn(columns, columnId) {
				let foundFlag = false
				columns.forEach(tc => {
					if (tc.columnId === columnId) {
						foundFlag = true
					}
				})

				if (foundFlag) {
					return columns
				}

				let resultArray = []
				columns.forEach((tc) => {
					if (tc.children) {
						let tmpArray = this.getParentArrayOfTableColumn(tc.children, columnId)
						if (tmpArray.length > 0) {
							resultArray = tmpArray
						}
					}
				})

				return resultArray
			},

			//表格拖动排序
			dragSort() {
				const el = this.$refs.singleTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
				this.sortable = Sortable.create(el, {
					handle: '.column-drag-handler',
					ghostClass: 'sortable-ghost',
					setData: function (dataTransfer) {
						dataTransfer.setData('Text', '')
					},

					// 开始拖拽时触发
					onStart: e => {
						this.tableColumnRows = this.treeColumnsToArray()
					},

					// 拖拽节点移动时触发
					onMove: ({ dragged, related }) => {
						const oldCol = this.tableColumnRows[dragged.rowIndex]
						const newCol = this.tableColumnRows[related.rowIndex]
						if (oldCol.nodeLevel !== newCol.nodeLevel) {
							this.$message.warning(this.i18nt('designer.setting.onlyDragBetweenSiblingNodes'))
							return false
						}
					},

					// 结束拖拽时触发
					onEnd: e => {
						const oldCol = this.tableColumnRows[e.oldIndex]
						const newCol = this.tableColumnRows[e.newIndex]
						if ((oldCol.nodeLevel !== newCol.nodeLevel) || (e.oldIndex === e.newIndex)) {
							return
						}

						const oldColumnId = oldCol.columnId
						const newColumnId = newCol.columnId
						let tcArray = this.getParentArrayOfTableColumn(this.optionModel.tableColumns, oldColumnId)
						let oldIndexOfTcArray = tcArray.findIndex(tc => tc.columnId === oldColumnId)
						let newIndexOfTcArray = tcArray.findIndex(tc => tc.columnId === newColumnId)
						if (oldIndexOfTcArray > newIndexOfTcArray) { // 节点从下面移动到上面
							tcArray.splice(newIndexOfTcArray, 0, deepClone(tcArray[oldIndexOfTcArray]))
							tcArray.splice(oldIndexOfTcArray + 1, 1)
						} else { // 节点从上面移动到下面
							tcArray.splice(newIndexOfTcArray + 1, 0, deepClone(tcArray[oldIndexOfTcArray]))
							tcArray.splice(oldIndexOfTcArray, 1)
						}

						/* 强制重新构造el-table组件！！ */
						this.refreshTableKey()
					}
				})

			},

			openTableDataEdit(){
				this.dataDialogVisible = true;
				this.tableDataOptions = JSON.stringify(this.optionModel.tableData, null, '  ')
			},

			saveTableData(){
				try {
					this.optionModel.tableData = JSON.parse(this.tableDataOptions)
					this.dataDialogVisible = false
				} catch (ex) {
					this.$message.error(this.i18nt('designer.hint.invalidOptionsData') + ex.message)
				}
			},

			openSetting(){
				this.dialogVisible = true;
				this.$nextTick(() => {
					this.dragSort()
					this.expandAllTableColumns(this.optionModel.tableColumns)
				})
			},

			getHeaderSpace(row) {
				let headerLevel = this.getHeaderLevel(this.optionModel.tableColumns, row.columnId, 1)
				return '|' + '-'.repeat(headerLevel > 6 ? 0 : 6 - headerLevel)
			},

			getHeaderTitle(row) {
				let headerLevel = this.getHeaderLevel(this.optionModel.tableColumns, row.columnId, 1)
				return this.i18ntp('designer.setting.getHeaderLevelTitle', headerLevel)
			},

			getHeaderLevel(columns, columnId, currentLevel) {
				let foundFlag = false
				columns.forEach((tc) => {
					if (tc.columnId === columnId) {
						foundFlag = true
					}
				})

				if (foundFlag) {
					return currentLevel
				}

				let resultLevel = -1
				columns.forEach((tc) => {
					if (tc.children) {
						let childLevel = this.getHeaderLevel(tc.children, columnId, currentLevel + 1)
						if (childLevel > -1) {
							resultLevel = childLevel
						}
					}
				})

				return resultLevel
			},

			expandAllTableColumns(columns) {
				columns.forEach(tc => {
					this.$refs.singleTable.toggleRowExpansion(tc, true)
					if (tc.children) {
						this.expandAllTableColumns(tc.children)
					}
				})
			},

			// 确认表格列更改
			colSubmit(){
				this.dialogVisible = false;
				this.$nextTick(() => {
					this.refreshTableKey()
				})
			},

			addCol(index){
				let newRow = {columnId: new Date().getTime(), show: false};
				this.optionModel.tableColumns.splice(index, 0, newRow);
				this.designer.emitHistoryChange()
			},

			handleAddColCommand(command, index, row) {
				if (command === 'column') {
					let newColumn = {columnId: new Date().getTime(), show: false}
					this.insertTableColumnById(this.optionModel.tableColumns, row.columnId, newColumn, false)
					this.designer.emitHistoryChange()
				}	else if (command === 'sub-column') {
					let newColumn = {columnId: new Date().getTime(), show: false}
					this.insertTableColumnById(this.optionModel.tableColumns, row.columnId, newColumn, true)
					this.designer.emitHistoryChange()
				} else if (command === 'header') {
					let newHeader = {columnId: new Date().getTime(), prop: '~', headerFlag: true, label: 'header', align: 'center', children: []}
					this.insertTableColumnById(this.optionModel.tableColumns, row.columnId, newHeader, false)
					this.designer.emitHistoryChange()
				}	else if (command === 'sub-header') {
					let newHeader = {columnId: new Date().getTime(), prop: '~', headerFlag: true, label: 'header', align: 'center', children: []}
					this.insertTableColumnById(this.optionModel.tableColumns, row.columnId, newHeader, true)
					this.designer.emitHistoryChange()
				}

				this.$nextTick(() => {
					this.$refs.singleTable.toggleRowExpansion(row, true)
				})
			},

			insertTableColumnById(columns, columnId, newColumn, childrenFlag) {
				let foundIdx = -1
				columns.forEach((tc, idx) => {
					if (tc.columnId === columnId) {
						foundIdx = idx
					}

					if (tc.children) {
						this.insertTableColumnById(tc.children, columnId, newColumn, childrenFlag)
					}
				})

				if (foundIdx > -1) {
					if (childrenFlag) {
						columns[foundIdx].children.push(newColumn)
					} else {
						columns.splice(foundIdx + 1, 0, newColumn)
					}
				}
			},

			disableDropdownItem(row, columnType) {
				if (row.children) {
					return false
				} else {
					return true
				}
			},

			handleDelete(index,row){
				if(this.optionModel.tableColumns.length === 1){
					this.$message.warning(this.i18nt('designer.setting.onlyOneColumnCannotBeDeleted'))
					 return false;
				}

				this.deleteTableColumnById(this.optionModel.tableColumns, row.columnId)
				this.designer.emitHistoryChange()
			},

			deleteTableColumnById(columns, columnId) {
				let foundIdx = -1
				columns.forEach((tc, idx) => {
					if (tc.columnId === columnId) {
						foundIdx = idx
					}

					if (tc.children) {
						this.deleteTableColumnById(tc.children, columnId)
					}
				})

				if (foundIdx > -1) {
					columns.splice(foundIdx, 1)
				}
			},

			showRenderDialog(tableColumn) {
				this.currentTableColumn = tableColumn
				this.renderJson = tableColumn.render || ''
				this.showRenderDialogFlag = true
			},

			saveColumnRender() {
				this.$set(this.currentTableColumn, 'render', this.renderJson)
				this.showRenderDialogFlag = false
			},

			handleShowButtonsColumnChange(value) { // 刷新表格显示，防止行列显示错位！！
				if (!!value) {
					this.refreshTableLayout()
				}
			},

			onButtonNameFocus(event) {
				//console.log('test', event)
				this.oldButtonName = event.target.value
			},

			onButtonNameChange(newName, btnIdx) {
				let sameNameFlag = false
				this.optionModel.operationButtons.map((tb, tbIdx) => {
					if ((tb.name === newName) && (tbIdx !== btnIdx)) {
						sameNameFlag = true
					}
				})
				if (sameNameFlag) {
					this.$message.error(this.i18nt('designer.setting.operationButtonDuplicatedNameError'))
					this.optionModel.operationButtons[btnIdx].name = this.oldButtonName
				}
			},

			editButtonsColumn() {
				this.showButtonsEditDialog = true
			},

			deleteOperationButton(idx) {
				this.$confirm(this.i18nt('designer.setting.deleteOperationButtonHint'), this.i18nt('render.hint.prompt'), {
					confirmButtonText: this.i18nt('render.hint.confirm'),
					cancelButtonText: this.i18nt('render.hint.cancel')
				}).then(() => {
					this.optionModel.operationButtons.splice(idx, 1)
				}).catch(error => {
					//this.$message.error(error)
				})

			},

			addOperationButton() {
				this.$set(this.optionModel, 'operationButtons', this.optionModel.operationButtons || [])
				this.optionModel.operationButtons.push({
					name: 'btn' + generateId(),
					label: 'new btn',
					type: 'text',
					size: 'small',
					round: false,
					hidden: false,
					disabled: false,
				})
			},

			refreshTableLayout() {
				const dataTableInDesign = this.designer.formWidget.getSelectedWidgetRef()
				if (!!dataTableInDesign && !!dataTableInDesign.refreshLayout) {
					this.$nextTick(() => {
						dataTableInDesign.refreshLayout()
					})
				}
			},

			refreshTableKey() {
				const dataTableInDesign = this.designer.formWidget.getSelectedWidgetRef()
				if (!!dataTableInDesign && !!dataTableInDesign.refreshTableKey) {
					this.$nextTick(() => {
						dataTableInDesign.refreshTableKey()
					})
				}
			},

			loadDataSet(dsName) {
				this.dataSetList.length = 0
				if (!dsName) {
					return
				}

				let dsModel = getDSByName(this.designer.formConfig, dsName)
				if (!!dsModel && !!dsModel.dataSets) {
					dsModel.dataSets.forEach(dSet => {
						this.dataSetList.push({
							name: dSet.name,
							remark: dSet.remark
						})
					})
				}
			},

			getDataSetList() {
				this.optionModel.dataSetName = ''
				this.loadDataSet(this.optionModel.dsName)
			},

			handleTDEChange(val) {
				if (!!val) {
					this.optionModel.rowKey = 'id'
					this.optionModel.childrenKey = 'children'
				} else {
					this.optionModel.rowKey = ''
					this.optionModel.childrenKey = ''
				}
			},

    }
  }
</script>

<style lang="scss" scoped>
  li.col-item {
    list-style: none;

    span.col-span-title {
      display: inline-block;
      font-size: 13px;
      width: 120px;
    }

    .col-delete-button {
      margin-left: 6px;
    }
  }

  .panes-setting {
    ul {
      padding-inline-start: 0;
      padding-left: 0; /* 重置IE11默认样式 */
      margin: 0;
    }

    .drag-option {
      cursor: move;
    }

    li.ghost {
      background: #fff;
      border: 2px dotted $--color-primary;
    }
  }

	.small-padding-dialog {
	  ::v-deep .el-dialog__body {
	    padding: 6px 15px 12px 15px;
	  }
	}

	.button-row {
		border-bottom: 1px solid #e1e2e3;
		margin-bottom: 12px;
	}

	.drag-sort-col {
		padding-top: 8px;
		cursor: move;
	}

	.radio-group-custom {
		::v-deep .el-radio-button__inner {
			padding-left: 12px;
			padding-right: 12px;
		}
	}

</style>

<style>
	.placeholder-hide .el-table__placeholder {
		width: 0 !important;
	}
</style>
