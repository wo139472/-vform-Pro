<template>
  <form-item-wrapper :designer="designer" :field="field" :rules="rules" :design-state="designState"
                     :parent-widget="parentWidget" :parent-list="parentList" :index-of-parent-list="indexOfParentList"
                     :sub-form-row-index="subFormRowIndex" :sub-form-col-index="subFormColIndex" :sub-form-row-id="subFormRowId">
    <treeselect
      v-model="fieldModel"
      :options="deptList"
      :defaultExpandLevel="3"
      ref="fieldEditor"
      v-show="!isReadMode"
      class="full-width-input"
      :disabled="field.options.disabled"
      :clearable="field.options.clearable"
      :searchable="field.options.filterable" 
      :multiple="field.options.multiple" 
      :default-first-option="allowDefaultFirstOption"
      :open-on-focused="field.options.automaticDropdown"
      :placeholder="field.options.placeholder || i18nt('render.hint.selectPlaceholder')"
      @focus="handleFocusCustomEvent" 
      @blur.native.capture="handleBlurCustomEvent"
      @input="handleChangeEvent"
      :normalizer="(d)=>{return { id: d.id, label: d.name,children:d.children||undefined }}"
    />
    <!-- <el-select ref="fieldEditor" v-model="fieldModel" v-show="!isReadMode" class="full-width-input"
               :disabled="field.options.disabled"
               :clearable="field.options.clearable"
               :filterable="field.options.filterable"
               :allow-create="field.options.allowCreate"
               v-scrollLoad="scrollLoadUser"
               @clear="clearData"
               :loading="userLoading"
               value-key="id"
               :default-first-option="allowDefaultFirstOption"
               :automatic-dropdown="field.options.automaticDropdown"
               :multiple="field.options.multiple" :multiple-limit="field.options.multipleLimit"
               :placeholder="field.options.placeholder || i18nt('render.hint.selectPlaceholder')"
               :remote="field.options.remote" :remote-method="loadEmployee"
               @focus="handleFocusCustomEvent" @blur.native.capture="handleBlurCustomEvent"
               @change="handleChangeEvent">
      <el-option v-for="item in user_list" :key="item.id" :label="item.realname"
                 :value="{id:item.id,realname:item.realname}" :disabled="item.disabled">
      </el-option>
    </el-select> -->
    <template v-if="isReadMode">
      <span class="readonly-mode-field">{{displayLabel()}}</span>
    </template>
  </form-item-wrapper>
</template>

<script>
  import axios from "axios"
  import Treeselect from '@riophae/vue-treeselect' // 下拉树
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import {toTreeData} from "@/utils/util";
  import FormItemWrapper from './form-item-wrapper'
  import emitter from '@/utils/emitter'
  import i18n, {translate} from "@/utils/i18n";
  import fieldMixin from "@/components/form-designer/form-widget/field-widget/fieldMixin";

  export default {
    name: "select-department-widget",
    componentName: 'FieldWidget',  //必须固定为FieldWidget，用于接收父级组件的broadcast事件
    mixins: [emitter, fieldMixin, i18n],
    props: {
      field: Object,
      parentWidget: Object,
      parentList: Array,
      indexOfParentList: Number,
      designer: Object,

      designState: {
        type: Boolean,
        default: false
      },

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
    components: {
      FormItemWrapper,
      Treeselect
    },
    inject: ['refList', 'globalOptionData', 'globalModel'],
    data() {
      return {
        oldFieldValue: null, //field组件change之前的值
        fieldModel: null,
        rules: [],
        deptList:[],
        originDept:[]
      }
    },
    computed: {
      allowDefaultFirstOption() {
        return !!this.field.options.filterable
      },
      // remoteMethod() {
      //   console.log("this.fieldModel==>",this.fieldModel)
      //   // let value = this.field.options.multiple ? (this.fieldModel.length > 0 ? this.fieldModel.join(',') : '') : this.fieldModel
      //   // this.syncUpdateFormModel(value)
      //   this.emitFieldDataChange(this.fieldModel)
      // },
    },
    beforeCreate() {
      /* 这里不能访问方法和属性！！ */
    },

    created() {
      /* 注意：子组件mounted在父组件created之后、父组件mounted之前触发，故子组件mounted需要用到的prop
         需要在父组件created中初始化！！ */
      this.registerToRefList()
      this.initOptionItems()
      this.initFieldModel()
      this.initEventHandler()
      this.buildFieldRules()

      this.handleOnCreated()

      this.getDeptList()
    },

    mounted() {
      this.handleOnMounted()
      
    },

    beforeDestroy() {
      this.unregisterFromRefList()
    },

    methods: {
      remoteMethod() {
        console.log("this.fieldModel==>",this.fieldModel)
        // let value = this.field.options.multiple ? (this.fieldModel.length > 0 ? this.fieldModel.join(',') : '') : this.fieldModel
        // this.syncUpdateFormModel(value)
        this.emitFieldDataChange(this.fieldModel)
      },
      displayLabel() {
        // console.log("this.fieldModel==>",this.fieldModel)
        let resultContent = '--'
        if (this.fieldModel === null) {
          resultContent = '--'
        } else {
          resultContent = ''
          if(this.originDept.length > 0){
            this.originDept.forEach(item => {
              if(this.field.options.multiple){
                if(this.fieldModel.length > 0){
                  this.fieldModel.forEach(item1 => {
                    if(item1 === item.id){
                      resultContent += item.name + ','
                    }
                  })
                }
              }
              else{
                if(this.fieldModel == item.id){
                  resultContent = item.name
                }
              }
            })
            resultContent = resultContent.substring(0, resultContent.length - 1);
          }
          // console.log("resultContent==>",resultContent)
          // resultContent = this.fieldModel.map(item =>{return item.realname}).join(',')
        }
        return resultContent
      },
       /**
     * 获取部门列表
     */
      async getDeptList() {
        // const res = await axios.get('http://api-admin-park.lcsnfm.com.cn/dept/getDeptList',{ headers: {'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJqd3RfeWgiLCJleHAiOjE3MjEyOTExNjUsInN1YiI6IllIIiwiYXVkIjoiZXZlcnkiLCJuYmYiOjE3MjA2ODYzNjUsImlhdCI6MTcyMDY4NjM2NSwianRpIjoxMDAwMSwidWlkIjoxLCJwYXJrX2NvZGUiOiIxMDAwMSJ9.8OC5d66nyMmoo34q7ZPoCJW0k5cE-bjhIKCBy6brmo0`}})
        const res = await this.$http.get('/dept/getDeptList')
        if(res.data.code == 0){
          this.deptList = toTreeData(res.data.data, 'id', 'pid');
          this.originDept = res.data.data
        }
      },
      /**
       * 获取选中项label
       * @return {*}
       */
      getSelectedLabel() {
        return this.$refs.fieldEditor.selectedLabel
      },

    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../../styles/global.scss"; //* form-item-wrapper已引入，还需要重复引入吗？ *//

  .full-width-input {
    width: 100% !important;
  }

</style>
