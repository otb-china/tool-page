<template>
  <div class="flex-center" style="height: 80vh;width: 100vw;">
    <el-button
        style="width: 10vw;height: 6vw;"
        class="FS28"
        v-for="o in routers"
        :key="o.path"
        :type="o.type"
        text
        bg
        @click="go(o.path)"
    >
      {{ o.name }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {go} from "otb-module-plus/src/utils/tool/index.ts";

const routers = ref([
  {
    name: "调查问卷",
    path: "/survey",
    type: "primary"
  },
  {
    name: "表单设计",
    path: "/form",
    type: "success"
  },
  {
    name: "CURD",
    path: "/crud",
    type: "danger"
  },
])
</script>