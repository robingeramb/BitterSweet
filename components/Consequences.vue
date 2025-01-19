<template>
  <div class="w-full flex items-center text-center mb-20">
    <ul class="w-full rounded-md">
      <p class="text-2xl font-semibold text-slate-400">Your consequences</p>

      <li class="mb-4 mt-4">
        <p class="text-slate-300 text-xs mb-4">This already puts you at</p>
        <p class="text-red-500 text-5xl font-bold mb-2">
          {{ calculatePercent() }}%
        </p>
        <p class="text-white">
          of the recommended <br />
          amount of sugar per day.
        </p>
      </li>

      <p class="text-xs text-slate-300 mt-8 mb-2">Based on that:</p>
      <p
        class="text-red-500 font-semibold text-center text-md text-left"
        v-html="formattedText"
      ></p>
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
