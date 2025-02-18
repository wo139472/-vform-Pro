<template>
  <form-item-wrapper :designer="designer" :field="field" :rules="rules" :design-state="designState"
                     :parent-widget="parentWidget" :parent-list="parentList" :index-of-parent-list="indexOfParentList"
                     :sub-form-row-index="subFormRowIndex" :sub-form-col-index="subFormColIndex" :sub-form-row-id="subFormRowId">
    <el-select ref="fieldEditor" v-model="fieldModel" v-show="!isReadMode" class="full-width-input"
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
    </el-select>
    <template v-if="isReadMode">
      <span class="readonly-mode-field">{{displayLabel()}}</span>
    </template>
  </form-item-wrapper>
</template>

<script>
  import axios from "axios"
  import FormItemWrapper from './form-item-wrapper'
  import emitter from '@/utils/emitter'
  import i18n, {translate} from "@/utils/i18n";
  import fieldMixin from "@/components/form-designer/form-widget/field-widget/fieldMixin";

  export default {
    name: "select-employee-widget",
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
    },
    inject: ['refList', 'globalOptionData', 'globalModel'],
    data() {
      return {
        oldFieldValue: null, //field组件change之前的值
        fieldModel: null,
        rules: [],
        userLoading:false,
        page:1,
        user_list:[],
        queryWord:''
      }
    },
    computed: {
      allowDefaultFirstOption() {
        return !!this.field.options.filterable || !!this.field.options.remote
      },

      // remoteMethod(query) {
      //   if (!!this.field.options.remote && !!this.field.options.onRemoteQuery) {
      //     return this.remoteQuery
      //   } else {
      //     return undefined
      //   }
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
      this.getEmployee()
    },

    mounted() {
      this.handleOnMounted()
      
    },

    beforeDestroy() {
      this.unregisterFromRefList()
    },

    methods: {
      displayLabel() {
        let resultContent = '--'
        if (this.fieldModel === null) {
          resultContent = '--'
        } else {
          resultContent = this.fieldModel.map(item =>{return item.realname}).join(',')
        }
        return resultContent
      },
      scrollLoadUser () {
        setTimeout(() => {
          this.page = this.page + 1
          this.getEmployee({page:this.page,realname:this.queryWord})
        }, 100);
      },
      clearData(){
        this.page = 1
        this.loadEmployee()
      },
      loadEmployee(query){
        this.queryWord = query
        if(query !== '') {
          this.userLoading = true;
        }
        setTimeout(() => {
          this.user_list = []
          this.getEmployee({page:1,realname:this.queryWord})
        }, 200);
      },
      async getEmployee(realname){
        const res = await this.$http.get('/user/index',{params:{...realname,limit:20}})
        if(res.data.code == 0){
          const {data} = res.data
          this.userLoading = false
          this.user_list = this.user_list.concat(data)
          // let type = this.getWidgetRef(this.field?.options.name)
          // type?.loadOptions(this.user_list.map(item => {return{label:item.realname,value:{...item,id:item.id,realname:item.realname}}}))
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
