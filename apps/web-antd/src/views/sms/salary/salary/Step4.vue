<script lang="ts" setup>
import { Divider, Result } from 'ant-design-vue';

const emit = defineEmits(['redo']);
</script>
<template>
  <div class="" style="background-color: hsl(var(--background))">
    <Divider />
    <Result status="success" sub-title="" title="发送成功">
      <template #extra>
        <a-button type="primary" @click="emit('redo')"> 再发一次 </a-button>
        <a-button> 查看发送记录 </a-button>
      </template>
    </Result>
  </div>
</template>
