<template>
  <div>
    <ul class="px-10 py-10 bg-white rounded-md mb-8 mx-5">
      <p class="text-2xl font-semibold text-slate-950">Your receipt</p>
      <div
        class="border-t border-dashed border-gray-500 mb-4 mt-2 -mx-10"
      ></div>
      <li class="mb-4" v-for="(child, index) in productsInCart" :key="index">
        <p class="text-slate-800 text-xs">
          {{ child.amount }}g {{ child.productName || "Unbenannt" }}:
        </p>
        <p class="text-red-900">
          {{ child.sugarAmount }}g sugar / ≈
          {{ Math.round(child.sugarAmount / 3) }}g per person
        </p>
      </li>
      <div
        class="border-t border-dashed border-gray-500 mb-4 mt-2 -mx-10"
      ></div>
      <p class="text-5xl font-bold text-red-800">
        <span v-html="sugarCounter"></span>g sugar
      </p>
      <p class="m-3 text-red-800">
        ≈ {{ Math.round(sugarCounter / 3) }}g per person.
      </p>
    </ul>
  </div>
</template>

<script lang="ts" setup></script>

<style></style>
