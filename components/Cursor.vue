<template>
  <div
    :style="[{ left: mousePos.x + 'px', top: mousePos.y + 'px' }]"
    :class="clickable ? ['bg-orange-500'] : []"
    class="fixed z-30 -translate-y-1/2 -translate-x-1/2 w-6 h-6 border-2 rounded-full border-orange-500"
  ></div>
</template>

<script lang="ts" setup>
interface Props {
  mousePos: { x: number; y: number };
  clickable: Boolean;
}
const props = defineProps<Props>();
</script>

<style></style>
