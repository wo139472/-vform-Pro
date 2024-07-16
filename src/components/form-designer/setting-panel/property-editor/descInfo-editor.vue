<!--
 * @Author: DESKTOP-NM48M47\lkj 1
 * @Date: 2022-07-15 10:16:17
 * @LastEditors: wo1394721159 1394721159@qq.com
 * @LastEditTime: 2023-07-21 16:42:48
 * @FilePath: \projecte:\vue3_practice\variant-form\src\components\form-designer\setting-panel\property-editor\required-editor.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <div class="labelStyle">描述信息</div>
    <el-form-item>
      <vue-editor 
          ref="fieldEditor" 
          v-model="optionModel.descInfo"
          placeholder="这是描述信息"
          :editor-toolbar="customToolbar"
      >
      </vue-editor>
    </el-form-item>
  </div>
</template>

<script>
  import i18n from "@/utils/i18n"
  import {VueEditor} from 'vue2-editor'

  export default {
    name: "descInfo-editor",
    mixins: [i18n],
    components:{
      VueEditor
    },
    props: {
      designer: Object,
      selectedWidget: Object,
      optionModel: Object,
    },
    data(){
      return{
        valueChangedFlag: false, //vue2-editor数据值是否改变标志
        customToolbar:[
          // [{'header':[false,1,2,3,4,5,6] }], //标题
                ['bold', 'italic', 'underline',{'align':[]},{'color':[]},'link','image',{'header':[false,6,5,4,3,2,1]}],  //加粗\斜体\下划线
                // ['italic'],  //斜体----也可以拆开来写，用于换位置顺序
                // [{'align':''},{'align':'center'},{'align':'right'}], //对齐
                // [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }], //有序无序列表
                // [{'background':[]},{'color':[]}], //背景色
                // ['image','link'],  //图片、链接
                // ['strike'],   //作废（文字中间一横）
                // ['underline'],
                // ['clean'],   //清楚格式（所谓去掉背景色这些花里胡巧）
                // ['code'],  //代码
                // ['code-block'], //代码块
                // ['video'] //视频
          ],
      }
    },
    computed: {

    },
    methods:{
      // handleRichEditorChangeEvent() {
      //   this.valueChangedFlag = true
      //   this.syncUpdateFormModel(this.fieldModel)
      // },
    }
  }
</script>

<style scoped>
  ::v-deep .el-form-item__content{
    margin-left:0 !important;
    margin-top:8px;
    margin-bottom:8px;
  }
  .labelStyle{
    /* font-weight: 700 !important; */
    color:#606266;
    font-size: 14px;
  }
  ::v-deep .quillWrapper .ql-snow.ql-toolbar button svg{
    width:17px !important;
    height:17px !important;
  }
  ::v-deep .ql-picker:not(.ql-background){
    top:0 !important; 
  }
  ::v-deep .ql-formats{
    display: flex !important;
  }
  ::v-deep .ql-align svg{
    width:18px !important;
  }
  ::v-deep .ql-header{
    margin-top:-2px;
    margin-left:-5px;
  }
  ::v-deep .ql-header svg{
    right:-15px !important;
    top:14px !important;
  }
  ::v-deep .ql-container{
    height: 70px !important;
    font-size: 10px !important;
  }
  ::v-deep .ql-editor{
    min-height: 70px !important;
  }
</style>
