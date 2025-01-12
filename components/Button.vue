<template>
  <div class="flex gap-12">
    <div
      class="border-orange-200 select-none border-[1px] rounded-lg px-4 font-medium text-2xl bg-orange-500 bg-opacity-30 hover:cursor-pointer hover:bg-opacity-70 py-2 hover:backdrop-blur-3xl backdrop-blur-xl"
    >
      {{ props.text }}
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  text: String;
}

const props = defineProps<Props>();
</script>

<style></style>
