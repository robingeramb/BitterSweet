<template>
  <div
    class="flex top-0 left-0 w-full h-full text-white fixed flex-col text-center items-center gap-12"
  >
    <div class="absolute bottom-40 flex gap-12" v-if="productView">
      <Button @click="selectedProductToShelf" :text="'Back to Shelf'" />
      <Button @click="selectedProductToCart" :text="'Add to Card'" />
    </div>
    <div
      v-show="hoveredProduct != undefined && productView == false"
      class="absolute bg-orange-500 px-4 py-1 rounded-full"
      :style="[
        { left: hoveredMouseX + 20 + 'px' },
        { top: hoveredMouseY - 20 + 'px' },
      ]"
    >
      <p class="select-none">{{ hoveredProduct }}</p>
    </div>
    <div
      class="bg-black bg-opacity-50 absolute bottom-20 px-4 py-1 rounded-full"
    >
      <p class="text-sm whitespace-nowrap font-normal">
        press ESC to exit shelf-view
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style></style>
