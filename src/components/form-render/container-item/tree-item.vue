<template>
  <container-item-wrapper :widget="widget">
		<el-container>
			<el-main style="align-items: baseline;">
				<el-input v-if="widget.options.filter" :size="widget.options.size" :placeholder="i18nt('designer.setting.enterForQuery')" v-model="filterText"></el-input>
				<el-button-group>
				  <el-button type="primary" round plain :size="widget.options.size" v-if="widget.options.expandRetractAllNode" @click="expandAllNodes()">
						{{i18nt('designer.setting.expandRetractAllNode')}}
					</el-button>
				  <el-button type="primary" round plain :size="widget.options.size" v-if="widget.options.selectClearAllNode && widget.options.showCheckBox" @click="checkAllNodes()">
						{{i18nt('designer.setting.selectClearAllNode')}}
					</el-button>
				</el-button-group>
				<el-tree :data="widget.options.treeData" :props="defaultProps" ref="tree" border
					:lazy="widget.options.lazy"
					node-key="id"
					highlight-current
					:current-node-key="currentKey"
					:show-checkbox="widget.options.showCheckBox"
					:expand-on-click-node="widget.options.expandOnClickNode"
					:default-expand-all="widget.options.defaultExpandAllNode"
					:draggable="widget.options.draggable"
				  :check-strictly="widget.options.checkStrictly"
					v-loading="loadingFlag"
					@node-click="handleTreeNodeClick"
					@node-contextmenu="handleTreeNodeContextmenu"
					@check="handleTreeNodeCheck"
				  @check-change="handleCheckChange"
					:filter-node-method="filterNode">
					<span class="custom-tree-node" slot-scope="{ node, data }">
						<span>{{ node.label }}</span>
						<span v-if="widget.options.nodeEdit">
							<el-button type="text" :size="widget.options.size" @click="append(data)">
								{{i18nt('designer.setting.add')}}
							</el-button>
							<el-button type="text" :size="widget.options.size" @click="remove(node, data)">
								{{i18nt('designer.setting.delete')}}
							</el-button>
						</span>
					</span>
				</el-tree>
			</el-main>
		</el-container>
  </container-item-wrapper>
</template>

<script>
  import ContainerItemWrapper from '@/components/form-render/container-item/container-item-wrapper'
  import emitter from '@/utils/emitter'
  import i18n from "@/utils/i18n"
  import FieldComponents from '@/components/form-designer/form-widget/field-widget/index'
  import refMixin from "@/components/form-render/refMixin"
  import containerItemMixin from "@/components/form-render/container-item/containerItemMixin"
	import {getDSByName, overwriteObj, runDataSourceRequest} from "@/utils/util";
	let id = 1000;

  export default {
    name: "TreeItem",
    componentName: 'ContainerItem',  //必须固定为ContainerItem，用于接收父级组件的broadcast事件
    mixins: [emitter, i18n, refMixin, containerItemMixin],
		inject: ['refList', 'sfRefList', 'globalModel', 'getFormConfig', 'getGlobalDsv'],
		components: {
			ContainerItemWrapper,
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
		data() {
			return {
				isExpanded:true,
				isChecked:false,
				currentKey:'',
				filterText: '',
				loadingFlag: false,
				defaultProps: {
					children: 'children',
					label: 'label'
				}
			};
		},
		computed: {
			formConfig() {
				return this.getFormConfig()
			},
		},
		watch:{
		  filterText(val) {
		    this.$refs.tree.filter(val);
		  }
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
    methods: {
			// 给当前节点添加下级节点
			append(data) {
				this.$prompt(this.i18nt('designer.setting.inputNodeName'),
				this.i18nt('designer.setting.tips'), {
					confirmButtonText: this.i18nt('designer.hint.confirm'),
					cancelButtonText: this.i18nt('designer.hint.cancel'),
				}).then(({ value }) => {
					const newChild = { id: id++, label: value, children: [] };
					if (!data.children) {
						this.$set(data, 'children', []);
					}
					data.children.push(newChild);
				}).catch((err) => {
					console.error(err)
				});
			},
			// 删除节点
			remove(node, data) {
				this.$confirm(this.i18nt('designer.setting.deleteNode'),
					this.i18nt('designer.setting.tips'), {
					confirmButtonText: this.i18nt('designer.hint.confirm'),
					cancelButtonText: this.i18nt('designer.hint.cancel'),
					type: 'warning'
				}).then(() => {
					const parent = node.parent;
					const children = parent.data.children || parent.data;
					const index = children.findIndex(d => d.id === data.id);
					children.splice(index, 1);
					this.$message({
						type: 'success',
						message: this.i18nt('designer.setting.nodeDeleted'),
					});
				}).catch((err) => {
					console.error(err)
				});
			},

			filterNode(value, data) {
				if (!value) return true;
				return data.label.indexOf(value) !== -1;
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

			/** 树节点点击事件
			 * @param {Object} data 传递给 data 属性的数组中该节点所对应的对象
			 * @param {Object} node 节点对应的 Node
			 * @param {Object} el 节点组件本身
			 */
			handleTreeNodeClick(data, node, el) {
				if (!!this.widget.options.onNodeClick) {
					let customFn = new Function('data', 'node', 'el', this.widget.options.onNodeClick)
					customFn.call(this, data, node, el)
				}
			},

			/** 树节点右键事件
			 * @param {Object} event 事件句柄
			 * @param {Object} data 传递给 data 属性的数组中该节点所对应的对象
			 * @param {Object} node 节点对应的 Node
			 * @param {Object} el 节点组件本身
			 */
			handleTreeNodeContextmenu(event, data, node, el) {
				if (!!this.widget.options.onNodeContextmenu) {
					let customFn = new Function('event', 'data', 'node', 'el',this.widget.options.onNodeContextmenu)
					customFn.call(this, event, data, node, el)
				}
			},

			/** 树组件当复选框被点击的时候触发
			 * @param {Object} data
			 * @param {Object} treeState
			 */
			handleTreeNodeCheck(data, treeState) {
				if (!!this.widget.options.onNodeCheck) {
					let customFn = new Function('data', 'treeState', this.widget.options.onNodeCheck)
					customFn.call(this, data, treeState)
				}
			},

			handleCheckChange(data, checked, indeterminate) {
				if (!!this.widget.options.onCheckChange) {
					let customFn = new Function('data', 'checked', 'indeterminate', this.widget.options.onCheckChange)
					customFn.call(this, data, checked, indeterminate)
				}
			},

			//改变节点的展开/收缩状态
			setNodeExpanded(node, flag) {
				node.expanded = flag;
				for(let i = 0; i < node.childNodes.length; i++ ) {
					//改变节点的自身expanded状态
					node.childNodes[i].expanded = flag;
					//看看他孩子的长度，有的话就调用自己往下找
					if(node.childNodes[i].childNodes.length > 0) {
						this.setNodeExpanded(node.childNodes[i], flag);
					}
				}
			},

			//改变节点的勾选状态
			setNodeChecked(node, flag) {
				node.checked = flag;
				for(let i = 0; i < node.childNodes.length; i++ ) {
					//改变节点的自身checked状态
					node.childNodes[i].checked = flag;
					//看看他孩子的长度，有的话就调用自己往下找
					if(node.childNodes[i].childNodes.length > 0) {
						this.setNodeChecked(node.childNodes[i], flag);
					}
				}
			},

			//--------------------- 以下为组件支持外部调用的API方法 begin ------------------//
			/* 提示：用户可自行扩充这些方法！！！ */

			getNativeTree() {
				return this.$refs.tree
			},

			setTreeData(data) {
				this.widget.options.treeData = data;
				this.currentKey = data[0].id;
			},

			getTreeData() {
				return this.widget.options.treeData;
			},

			expandAllNodes(flag) {
				this.isExpanded = flag || !this.isExpanded;
				this.setNodeExpanded(this.$refs.tree.store.root, this.isExpanded);
			},

			checkAllNodes(flag) { //debugger
				this.isChecked = flag || !this.isChecked;
				this.setNodeChecked(this.$refs.tree.store.root, this.isChecked);
			},

			setCheckedNodes(nodes) {
				this.$refs.tree.setCheckedNodes(nodes)
			},

			getCheckedNodes(leafOnly, includeHalfChecked) {
				return this.$refs.tree.getCheckedNodes(leafOnly, includeHalfChecked)
			},

			getCurrentNode() {
				return this.$refs.tree.getCurrentNode()
			},

			setCurrentNode(node) {
				return this.$refs.tree.setCurrentNode(node)
			},

			/**
			 * 从数据源加载数据
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
					this.loadingFlag = true
					runDataSourceRequest(curDS, newDsv, this.getFormRef(), false, this.$message).then(res => {
						if (!!curDSetName && res.hasOwnProperty(curDSetName)) {
							this.setTreeData(res[curDSetName])
						} else {
							this.setTreeData(res)
						}
						this.loadingFlag = false
					}).catch(err => {
						this.$message.error(err.message)
						this.loadingFlag = false
					})
				}
			},

			//--------------------- 以上为组件支持外部调用的API方法 end ------------------//
    }
  }
</script>
<style lang="scss" scoped>
  .readonly-mode-field {
    display: inline-block;
    white-space: pre-wrap;
    line-height: 1.5;
  }
	.custom-tree-node {
	  flex: 1;
	  display: flex;
	  align-items: center;
	  justify-content: space-between;
	  font-size: 14px;
	  padding-right: 8px;
	}
</style>
