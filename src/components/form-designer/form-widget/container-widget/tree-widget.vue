<template>
  <container-wrapper :designer="designer" :widget="widget" :parent-widget="parentWidget" :parent-list="parentList"
    :index-of-parent-list="indexOfParentList">
  	<div class="tree-container"
       :class="{'selected': selected}" @click.stop="selectWidget(widget)">
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
					:filter-node-method="filterNode">
					<span class="custom-tree-node" slot-scope="{ node, data }">
						<span>{{ node.label }}</span>
						<span v-if="widget.options.nodeEdit">
							<el-button type="text" :size="widget.options.size">
								{{i18nt('designer.setting.add')}}
							</el-button>
							<el-button type="text" :size="widget.options.size">
								{{i18nt('designer.setting.delete')}}
							</el-button>
						</span>
					</span>
				</el-tree>
			</el-main>
		</el-container>
  </div>
  </container-wrapper>
</template>

<script>
	import i18n from "@/utils/i18n"
	import containerMixin from "@/components/form-designer/form-widget/container-widget/containerMixin"
	import ContainerWrapper from "@/components/form-designer/form-widget/container-widget/container-wrapper"
	import FieldComponents from '@/components/form-designer/form-widget/field-widget/index'
	import refMixinDesign from "@/components/form-designer/refMixinDesign"


	let id = 1000;
  export default {
    name: "TreeWidget",
    componentName: 'ContainerWidget',  //必须固定为ContainerWidget，用于接收父级组件的broadcast事件
    mixins: [i18n, containerMixin, refMixinDesign],
		inject: ['refList'],
		components: {
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
		computed: {
		  selected() {
		    return this.widget.id === this.designer.selectedId
		  },
		  customClass() {
		    return this.widget.options.customClass || ''
		  },
		},
		data() {
			return {
				isExpanded:true,
				isChecked:false,
				currentKey:'',
				filterText: '',
				defaultProps: {
					children: 'children',
					label: 'label'
				}
			};
		},
		watch:{
      filterText(val) {
        this.$refs.tree.filter(val);
      },
    },
    created() {
			this.initRefList()
    },
		mounted() {

		},
    methods: {
			filterNode(value, data) {
				if (!value) return true;
				return data.label.indexOf(value) !== -1;
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

			//--------------------- 以上为组件支持外部调用的API方法 end ------------------//
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../../../styles/global.scss"; /* form-item-wrapper已引入，还需要重复引入吗？ */
  .readonly-mode-field {
    display: inline-block;
    white-space: pre-wrap;
    line-height: 1.5;
  }
	.tree-container {
	  //padding: 5px;
	  margin: 2px;

	  .form-widget-list {
	    min-height: 28px;
	  }
	}
	.tree-container.selected {
	  outline: 2px solid $--color-primary !important;
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
