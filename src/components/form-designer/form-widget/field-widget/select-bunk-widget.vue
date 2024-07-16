<template>
  <form-item-wrapper :designer="designer" :field="field" :rules="rules" :design-state="designState"
                     :parent-widget="parentWidget" :parent-list="parentList" :index-of-parent-list="indexOfParentList"
                     :sub-form-row-index="subFormRowIndex" :sub-form-col-index="subFormColIndex" :sub-form-row-id="subFormRowId">
    <el-select ref="fieldEditor" v-model="fieldModel" v-show="!isReadMode" class="full-width-input"
               :disabled="field.options.disabled"
               :clearable="field.options.clearable"
               :filterable="field.options.filterable"
               :allow-create="field.options.allowCreate"
               v-scrollLoad="scrollLoadBunk"
               @clear="clearData"
               value-key="bunk_id"
               :loading="bunkLoading"
               :default-first-option="allowDefaultFirstOption"
               :automatic-dropdown="field.options.automaticDropdown"
               :multiple="field.options.multiple" :multiple-limit="field.options.multipleLimit"
               :placeholder="field.options.placeholder || i18nt('render.hint.selectPlaceholder')"
               :remote="field.options.remote" :remote-method="loadBunk"
               @focus="handleFocusCustomEvent" @blur.native.capture="handleBlurCustomEvent"
               @change="handleChangeEvent">
      <el-option v-for="item in bunk_list" :key="item.bunk_id" :label="item.address"
                 :value="{address:item.address,bunk_id:item.bunk_id}" :disabled="item.disabled">
      </el-option>
    </el-select>
    <template v-if="isReadMode">
      <span class="readonly-mode-field">{{displayLabel()}}</span>
    </template>
  </form-item-wrapper>
</template>

<script>
  import FormItemWrapper from './form-item-wrapper'
  import emitter from '@/utils/emitter'
  import i18n, {translate} from "@/utils/i18n";
  import fieldMixin from "@/components/form-designer/form-widget/field-widget/fieldMixin";

  export default {
    name: "select-bunk-widget",
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
        bunkLoading:false,
        page:1,
        bunk_list:[],
        queryWord:''
      }
    },
    computed: {
      allowDefaultFirstOption() {
        return !!this.field.options.filterable || !!this.field.options.remote
      },

      // remoteMethod() {
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
      this.getBunk()
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
          resultContent = this.fieldModel.map(item =>{return item.address}).join(',')
        }
        return resultContent
      },
      scrollLoadBunk () {
        setTimeout(() => {
          this.page = this.page + 1
          this.getBunk({page:this.page,address:this.queryWord})
        }, 100);
      },
      clearData(){
        this.page = 1
        this.loadBunk()
      },
      loadBunk(query){
        this.queryWord = query
        if(query !== '') {
          this.bunkLoading = true;
        }
        setTimeout(() => {
          this.bunk_list = []
          this.getBunk({page:1,address:this.queryWord})
        }, 200);
      },
      async getBunk(address){
        const res = await this.$http.get('/bunk/index',{params:{...address,limit:20,status:1}})
        if(res.data.code == 0){
          const {data} = res.data
          this.bunkLoading = false
          this.bunk_list = this.bunk_list.concat(data)
          // let type = this.getWidgetRef(this.field?.options.name)
          // type?.loadOptions(this.bunk_list.map(item => {return{label:item.address,value:{...item,address:item.address,bunk_id:item.bunk_id}}}))
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
