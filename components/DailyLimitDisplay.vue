<template>
  <div class="w-full flex items-center text-center">
    <ul class="w-full rounded-md">
      <li class="mb-4 mt-4">
        <p class="text-white text-lg mb-4">This already puts you at</p>
        <p class="text-orange-500 text-[9rem] leading-10 font-bold my-12 mt-20">
          {{ calculatePercent() }}%
        </p>
        <p class="text-white text-lg">
          of the recommended <br />
          amount of sugar per day.
        </p>
      </li>
      <!---
      <p class="text-xs text-slate-300 mt-8 mb-2">Based on that:</p>
      <p
        class="text-red-500 font-semibold text-center text-md text-left"
        v-html="formattedText"
      ></p>-->
    </ul>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  formattedText: string;
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
