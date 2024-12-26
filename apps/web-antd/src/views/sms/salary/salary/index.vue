<script lang="ts" setup>
import { reactive, ref } from 'vue';

import { Steps } from 'ant-design-vue';

import Step1 from '#/views/sms/salary/salary/Step1.vue';
import Step2 from '#/views/sms/salary/salary/Step2.vue';
import Step3 from '#/views/sms/salary/salary/Step3.vue';
import Step4 from '#/views/sms/salary/salary/Step4.vue';

defineOptions({ name: 'FormStepPage' });

const current = ref(0);

const state = reactive({
  initStep2: false,
  initStep3: false,
  initStep4: false,
});

const info2 = ref();
const sendInfoR1 = ref();
const sendInfoR2 = ref();
function sendInfo1(sendInfo1: any) {
  sendInfoR1.value = sendInfo1;
}

function handleStepPrev(step: any) {
  if (step === 2) {
    state.initStep2 = false;
  }
  if (step === 3) {
    state.initStep3 = false;
  }
  current.value--;
}

function handleStep1Next(step1Values: any) {
  current.value++;
  state.initStep2 = true;
  info2.value = step1Values;
}

function handleStep2Next(step2Values: any) {
  current.value++;
  state.initStep3 = true;
  sendInfoR2.value = step2Values;
}

function handleStep3Next() {
  current.value++;
  state.initStep4 = true;
}

function handleRedo() {
  current.value = 0;
  state.initStep2 = false;
  state.initStep3 = false;
  state.initStep4 = false;
}
</script>
<template>
  <div class="overflow-hidden p-4">
    <div class="step-form-form">
      <Steps :current="current">
        <Steps.Step title="上传工资表" />
        <Steps.Step title="核对数据" />
        <Steps.Step title="发送预览" />
        <Steps.Step title="发送结果" />
      </Steps>
    </div>
    <div class="mt-5">
      <Step1
        v-show="current === 0"
        @next="handleStep1Next"
        @send-info="sendInfo1"
      />
      <Step2
        v-if="state.initStep2"
        v-show="current === 1"
        :info="info2"
        :send-info1="sendInfoR1"
        @next="handleStep2Next"
        @prev="handleStepPrev(2)"
      />
      <Step3
        v-if="state.initStep3"
        v-show="current === 2"
        :info="info2"
        :send-info2="sendInfoR2"
        @next="handleStep3Next"
        @prev="handleStepPrev(3)"
      />
      <Step4 v-if="state.initStep4" v-show="current === 3" @redo="handleRedo" />
    </div>
  </div>
</template>
<style lang="less" scoped>
.step-form-content {
  padding: 24px;
}

.step-form-form {
  width: 750px;
  margin: 0 auto;
}
</style>
