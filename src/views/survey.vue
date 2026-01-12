<template>
  <div class="flew-warp">
    <!--头部-->
    <div class="header">
      <div class="flex-center">
        <h3 class="back-gauge MR20 c-606266">题目类型</h3>
        <div
            :key="item.type"
            v-for="item in moduleList"
            class="MX5 pointer"
            draggable="true"
            @dragstart="headerDragstart(item)"
        >
          <el-tooltip content="拖拽添加" placement="bottom" effect="light" :hide-after="500">
            <el-tag :type="typeList[Math.floor(Math.random() * 4)]">{{ item.label }}</el-tag>
          </el-tooltip>
        </div>
      </div>

      <div>
        <el-button bg text icon="Delete" type="danger" plain @click="clear">清空</el-button>
        <el-button bg text icon="CopyDocument" type="primary" plain @click="copy">复制</el-button>
        <el-button bg text icon="RefreshRight" type="primary" plain @click="generate">生成</el-button>
      </div>
    </div>

    <div class="main">
      <!--设置-->
      <div class="aside">
        <span v-if="!aside.form.prop">拖拽题目类型至中心区域进行添加，后在此处进行设置～</span>
        <h-form
            v-else
            :form="aside.form"
            :item-width="20"
            :form-width="30"
            :option="aside.option"
            label-position="top"
            @change="syncActionItemData"
            @input="syncActionItemData"
        >
          <template v-slot>
            <div class="ML10 c-4a4a4a options">
              <div v-for="(o,i) in aside.form.option" :key="aside.form.prop + i">
                <span>选项{{ i + 1 }}</span>
                <el-input type="textarea" v-model="o.val"/>
                <el-button type="text" v-if="aside.form.option.length > 1" @click="setDelOptions(i)">删除</el-button>
                <el-button type="text" v-if="aside.form.option.length === (i + 1)" @click="setAddOptions">增加
                </el-button>
              </div>
            </div>
          </template>
        </h-form>
      </div>

      <!--主体-->
      <div class="form">
        <div class="form-preview" @dragover.prevent @drop="mainDropAdd">
          <h-form
              center
              ref="mainForm"
              @click="mainItemClick"
              @dragend="mainDragend"
              @dragenter="mainDragenter"
              @dragstart="mainDragstart"
              item-width="310px"
              :draggable="true"
              :option="main.option"
              :form="main.form"
              :rules="main.rules"
              label-position="top"
          />
        </div>

      </div>

      <!--垃圾桶-->
      <div class="rubbish breathe">
        <img src="/public/rubbish.png" :draggable="false" @dragover.prevent @drop="mainDropDel" alt="这就是个垃圾桶"/>
        <p class="FS15 back-gauge">拖至删除</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import hForm from "otb-module-plus/src/components/hForm/index.vue"
import {reactive, ref} from "vue";
import {RSA} from "otb-module-plus/src/utils/type.ts";
import {FormOptionItem} from "otb-module-plus/src/components/hForm/interface.ts";
import {v4 as uuidv4} from 'uuid';
import {ElMessage} from "element-plus";

const typeList = ref(["success", "info", "danger", "warning"]);
let moduleList = reactive([
  {
    label: "文本输入",
    type: "input",
    inputType: "textarea",
    placeholder: " "
  },
  {
    label: "单选题",
    type: "radio",
    option: [{val: "选项内容"}],
    optionKey: "val",
    optionVal: "val"
  },
  {
    label: "多选题",
    type: "checkbox",
    option: [{val: "选项内容"}],
    optionKey: "val",
    optionVal: "val"
  },
  {
    label: "文件上传",
    type: "upload",
    action: "https://xxx"
  }
] as FormOptionItem[]);
// ref name
const mainForm = ref();
// 清除校验
const clearValidate = () => {
  mainForm.value.$refs["hForm"].clearValidate();
};
let aside = reactive({
  form: {} as RSA,
  option: [
    {
      label: "题目名称",
      prop: "label",
      type: "input",
      inputType: "textarea"
    },
    {
      label: "是否必填",
      prop: "must",
      type: "switch",
      noHas: ["rate"],
      change: (v: RSA) => {
        if (v["must"]) {
          main.rules[v.prop] = [{
            required: true,
            message: "",
            trigger: "blur"
          }]
        } else {
          delete main.rules[v.prop];
          clearValidate();
        }
      }
    },
    {
      label: "设置选项",
      type: "slot",
      show: false
    },
  ] as FormOptionItem[]
});
let main = reactive({
  form: {},
  option: [] as RSA[],
  rules: {} as RSA
});
const activeIndex = ref();
// 设置选中元素
const setActionItem = (o: FormOptionItem, i: number) => {
  activeIndex.value = i;
  aside.form = {...o};
  aside.option.at(-1).show = ['checkbox', 'radio'].includes(o.type);
};
// 同步选中组件配置数据
const syncActionItemData = () => {
  main.option[activeIndex.value] = {...aside.form};
  main.form = {...aside.form};
}
const dragenterIndex = ref();
// 拖拽新增
const mainDropAdd = () => {
  console.log(main.option);
  if (dragWhere.value === "header") {
    let item: FormOptionItem = JSON.parse(JSON.stringify(dragItem));
    item.prop = uuidv4();
    console.log(item);
    main.option.splice(dragenterIndex.value, 0, item);
    setActionItem(item, dragenterIndex.value);
  }
}
// 元素点击事件
const mainItemClick = (_e: RSA, o: FormOptionItem, i: number) => {
  setActionItem(o, i);
};
// 拖拽排序
const mainDragend = (_e: RSA, o: FormOptionItem, i: number) => {
  if (!deleted.value) {
    main.option.splice(i, 1);
    main.option.splice(dragenterIndex.value, 0, o);
    setActionItem(o, dragenterIndex.value);
  }
}
// 拖拽时被关联元素
const mainDragenter = (_e: RSA, _o: FormOptionItem, i: number) => {
  dragenterIndex.value = i;
}
// main区拖拽开始
const mainDragstart = (_e: RSA, o: FormOptionItem, i: number) => {
  dragItem = o;
  dragIndex.value = i;
  dragWhere.value = "main";
  deleted.value = false;
}
const fieldRules = ref([]);
// 删除校验
const delRule = (o: FormOptionItem) => {
  // 必填校验
  delete main.rules[o.prop as string];
  clearValidate();
  // 校验类型
  let index = fieldRules.value.findIndex((val: RSA) => val.prop === o.prop);
  if (index !== -1) fieldRules.value.splice(index, 1);
}
// 拖拽删除
const mainDropDel = () => {
  if (dragWhere.value === "main") {
    if (main.option[dragIndex.value].prop === aside.form.prop) aside.form = {};
    main.option.splice(dragIndex.value, 1);
    delRule(dragItem);
    deleted.value = true;
  }
}
// 清空
const clear = () => {
  main = {
    form: {},
    option: [],
    rules: {}
  };
  aside.form = {};
};
let dragItem = reactive({} as FormOptionItem)
const dragIndex = ref()
const deleted = ref(false)
const dragWhere = ref("header")
// header区拖拽开始
const headerDragstart = (o: FormOptionItem) => {
  dragItem = o;
  dragWhere.value = "header";
}
// 复制代码
const copy = () => {
  navigator.clipboard.writeText(JSON.stringify(main.option));
  ElMessage.success('复制成功');
}
// 设置选项
const setDelOptions = (index: number) => {
  aside.form.option.splice(index, 1)
};
const setAddOptions = () => {
  aside.form.option.push({val: "选项内容"})
}

// 解析查询字符串，获取参数
window.addEventListener('message', function(event) {
  var data = event.data;
  console.log(data);
});
const generate = () => {

};
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  padding: 10px 20px;
  height: calc(5vh - 1px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: #d1c9c9 1px dashed;
  user-select: none;

  .el-tag:hover {
    color: #409EFF;
    background-color: #ecf5ff;
    border: #6489e0 1px dashed;
  }
}

.main {
  width: 100%;
  display: flex;
  justify-content: space-around;
  user-select: none;

  .aside {
    margin-top: 20px;
    width: 30%;
    user-select: none;

    .options {
      max-height: 60vh;
      overflow-y: auto;
      padding-right: 20px;
    }
  }

  .form {
    display: flex;
    justify-content: center;

    .form-preview {
      padding: 5px;
      width: 351px;
      height: 760px;
      overflow-y: auto;
      border: #d1c9c9 1px dashed;
      background-color: #f9f9f9;

      :deep(.el-form-item) {
        background-color: #ffffff;
        padding: 10px;
        border-radius: 5px;
        box-shadow: 0 1px 2px #dadcf1;
        margin: 0 0 10px 0;
      }

      :deep(.el-form-item__content) {
        line-height: normal;
      }

      :deep(.el-checkbox__label) {
        word-wrap: break-word;
        white-space: pre-wrap;
        line-height: 1.2;
      }
    }

    :deep(.el-radio),
    :deep(.el-checkbox) {
      width: 100%;
    }
  }

  .rubbish {
    margin-top: 250px;
    width: 30%;
    text-align: center;

    img {
      width: 150px;
    }

    p {
      color: #787070;
    }
  }
}
</style>