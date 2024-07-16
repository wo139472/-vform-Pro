<template>
  <div>
    <el-form-item :label="i18nt('designer.setting.buttonsColumnEdit')">
      <el-button type="primary" plain round @click="editButtonsColumn">{{i18nt('designer.setting.editAction')}}</el-button>
    </el-form-item>
    <el-form-item :label="i18nt('designer.setting.customClass')">
      <el-select v-model="optionModel.customClass" multiple filterable allow-create
                 default-first-option>
        <el-option v-for="(item, idx) in cssClassList" :key="idx" :label="item" :value="item"></el-option>
      </el-select>
    </el-form-item>

    <el-dialog :title="i18nt('designer.setting.groupButtonsEdit')" :visible.sync="showButtonsEditDialog" v-if="showButtonsEditDialog"
               :show-close="true" custom-class="drag-dialog small-padding-dialog" append-to-body v-dialog-drag
               :close-on-click-modal="false" :close-on-press-escape="false"
               :destroy-on-close="true" width="1120px">
      <el-form label-position="top" :model="optionModel">
        <el-row>
          <el-col :span="24">
            <el-divider content-position="left">{{i18nt('designer.setting.operationButtonsSetting')}}</el-divider>
          </el-col>
        </el-row>
        <draggable tag="div" :list="optionModel.buttons"
                   v-bind="{ghostClass: 'ghost', handle: '.drag-handler'}">
          <el-row v-for="(btn, bIdx) in optionModel.buttons" :key="bIdx" :gutter="8" class="button-row">
            <el-col :span="1" class="drag-sort-col">
              <i class="iconfont icon-drag drag-handler"></i>
            </el-col>
            <el-col :span="3">
              <el-form-item :prop="'buttons.' + bIdx + '.name'" label-width="50px"
                            :label="i18nt('designer.setting.operationButtonName')" :rules="nameRules">
                <el-input v-model="btn.name" @focus="onButtonNameFocus"
                          @change="(value) => onButtonNameChange(value, bIdx)"
                          :placeholder="i18nt('designer.setting.operationButtonName')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item :prop="'buttons.' + bIdx + '.label'" label-width="50px"
                            :label="i18nt('designer.setting.operationButtonLabel')">
                <el-input v-model="btn.label" :placeholder="i18nt('designer.setting.operationButtonLabel')"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item :prop="'buttons.' + bIdx + '.type'" label-width="50px"
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
            <el-col :span="5">
              <el-form-item :prop="'buttons.' + bIdx + '.icon'" label-width="50px"
                            :label="i18nt('designer.setting.buttonIcon')">
                <icon-picker v-model="btn.icon"></icon-picker>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item :prop="'buttons.' + bIdx + '.round'" label-width="50px"
                            :label="i18nt('designer.setting.operationButtonRound')">
                <el-switch v-model="btn.round" ></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item :prop="'buttons.' + bIdx + '.hidden'" label-width="50px"
                            :label="i18nt('designer.setting.operationButtonHidden')">
                <el-switch v-model="btn.hidden" ></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item :prop="'buttons.' + bIdx + '.disabled'" label-width="50px"
                            :label="i18nt('designer.setting.operationButtonDisabled')">
                <el-switch v-model="btn.disabled" ></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="1">
              <el-button icon="el-icon-delete" plain circle @click="deleteGroupButton(bIdx)"></el-button>
            </el-col>
          </el-row>
        </draggable>
        <el-row :gutter="0">
          <el-col :span="4">
            <el-button type="primary" size="small" icon="el-icon-plus"
                       plain round @click="addGroupButton">{{i18nt('designer.setting.addOperationButton')}}</el-button>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button size="default" @click="showButtonsEditDialog = false">{{i18nt('designer.hint.closePreview')}}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  import Draggable from 'vuedraggable'
  import i18n from "@/utils/i18n"
  import {deepClone, generateId} from "@/utils/util"
  import IconPicker from "@/components/icon-picker/index";

  export default {
    name: "button-group-customClass-editor",
    componentName: 'PropertyEditor',
    mixins: [i18n],
    props: {
      designer: Object,
      selectedWidget: Object,
      optionModel: Object,
    },
    components: {
      Draggable,
      IconPicker,
    },
    data() {
      return {
        showButtonsEditDialog: false,
        oldButtonName: '',
        cssClassList: [],

        nameRules: [
          { required: true, trigger: ['blur', 'change'], message: this.i18nt('designer.setting.fieldValueRequired') },
        ],
      }
    },
    created() {
      this.cssClassList = deepClone(this.designer.getCssClassList())
      //监听表单css代码改动事件并重新加载！
      this.designer.handleEvent('form-css-updated', (cssClassList) => {
        this.cssClassList = cssClassList
      })
    },
    methods: {
      editButtonsColumn() {
        this.showButtonsEditDialog = true
      },

      onButtonNameFocus(event) {
        //console.log('test', event)
        this.oldButtonName = event.target.value
      },

      onButtonNameChange(newName, btnIdx) {
        let sameNameFlag = false
        this.optionModel.buttons.map((tb, tbIdx) => {
          if ((tb.name === newName) && (tbIdx !== btnIdx)) {
            sameNameFlag = true
          }
        })
        if (sameNameFlag) {
          this.$message.error(this.i18nt('designer.setting.operationButtonDuplicatedNameError'))
          this.optionModel.buttons[btnIdx].name = this.oldButtonName
        }
      },

      deleteGroupButton(idx) {
        this.$confirm(this.i18nt('designer.setting.deleteOperationButtonHint'), this.i18nt('render.hint.prompt'), {
          confirmButtonText: this.i18nt('render.hint.confirm'),
          cancelButtonText: this.i18nt('render.hint.cancel')
        }).then(() => {
          this.optionModel.buttons.splice(idx, 1)
        }).catch(error => {
          //this.$message.error(error)
        })

      },

      addGroupButton() {
        this.$set(this.optionModel, 'buttons', this.optionModel.buttons || [])
        this.optionModel.buttons.push({
          name: 'btn' + generateId(),
          label: 'new btn',
          type: '',
          size: 'small',
          round: false,
          hidden: false,
          disabled: false,
        })
      },

    }
  }
</script>

<style scoped>

</style>
