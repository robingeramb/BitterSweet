<template>
  <div class="w-full hidden flex items-center text-center">
    <ul class="w-full flex flex-col items-center rounded-md">
      <p class="hidden text-3xl font-light text-slate-300 mt-8 mb-8">
        The consequences of
        <span>{{ Math.round(sugarCounter / 3) }}</span> (<span
          >{{ Math.round(sugarCounter / 3 / 3) }} Sugar cubes</span
        >)
      </p>
      <p
        class="text-orange-500 max-w-[30rem] font-semibold text-center text-3xl text-left"
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
