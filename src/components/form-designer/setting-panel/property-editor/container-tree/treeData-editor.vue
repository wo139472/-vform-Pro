<template>
  <el-form-item :label="i18nt('designer.setting.treeDataEdit')">
  	<el-button type="primary" plain round @click="openTreeDataEdit">{{i18nt('designer.setting.editAction')}}</el-button>
		<el-dialog :modal-append-to-body="false" :title="i18nt('designer.setting.treeDataEdit')" :visible.sync="dataDialogVisible"
			v-if="dataDialogVisible" :show-close="true" class="small-padding-dialog" 
			v-dialog-drag :close-on-click-modal="false" :close-on-press-escape="false" 
			:destroy-on-close="true" width="75%">
			<code-editor :mode="'json'" :readonly="false" v-model="treeDataOptions"></code-editor>
			<!-- <el-input type="textarea":autosize="{ minRows: 5, maxRows: 30}" v-model="treeDataOptions"></el-input> -->
			<div slot="footer" class="dialog-footer">
			  <el-button size="large" type="primary" @click="saveTreeData">{{i18nt('designer.hint.confirm')}}</el-button>
			  <el-button size="large" type="" @click="dataDialogVisible = false">{{i18nt('designer.hint.cancel')}}</el-button>
			</div>
		</el-dialog>
  </el-form-item>
	
</template>

<script>
  import i18n from "@/utils/i18n";
	import CodeEditor from '@/components/code-editor/index'
  export default {
    name: "treeData-editor",
    mixins: [i18n],
    props: {
      designer: Object,
      selectedWidget: Object,
      optionModel: Object,
    },
		components: {
			CodeEditor,
		},
		data() {
		  return {
				dataDialogVisible:false,
				treeDataOptions:[],
			}
		},
		methods:{
			openTreeDataEdit(){
				this.dataDialogVisible=true;
				// this.optionModel
				this.treeDataOptions = JSON.stringify(this.optionModel.treeData, null, '  ')
			}, 
			saveTreeData(){
				try {
					  this.optionModel.treeData = JSON.parse(this.treeDataOptions)
					  //TODO: 是否需要重置选项默认值？？
				
					  this.dataDialogVisible = false
					} catch (ex) {
					  this.$message.error(this.i18nt('designer.hint.invalidOptionsData') + ex.message)
					}
			},
		}
  }
</script>

<style lang="scss" scoped>
	.small-padding-dialog {
	  ::v-deep .el-dialog__body {
	    padding: 6px 15px 12px 15px;
	  }
	}
</style>
