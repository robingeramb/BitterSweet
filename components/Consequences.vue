<template>
  <div class="w-full flex items-center text-center">
    <ul class="w-full flex flex-col items-center rounded-md">
      <p class="text-3xl max-w-[45rem] font-light text-slate-300 mt-8 mb-8">
        This happens to your body when consuming
        <span>{{ Math.round(sugarCounter / 3) }}</span
        >g (<span>{{ Math.round(sugarCounter / 3 / 3) }} Sugar cubes</span>) of
        sugar daily :
      </p>
      <ul class="text-white max-w-[45rem] flex felx-col gap-4">
        <li v-for="item in consList">{{ item.description }}</li>
      </ul>
    </ul>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  consList: Array<Object>;
}
const props = defineProps<Props>();

function calculatePercent() {
  const maximum = 50;
  let sugarAmount = sugarCounter.value;
  let percent = (Math.round(sugarAmount / 3) / maximum) * 100;

  return percent;
}
</script>

<style></style>
