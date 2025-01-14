<template>
  <div class="flex items-center justify-center h-screen bg-gray-800 text-white">
    <div class="text-center flex flex-col items-center">
      <h2 class="text-1xl mb-2 text-slate-500">Spiel beendet!</h2>
      <h1 class="text-4xl mb-6">Bitter Sweet</h1>
      <p v-if="showTitel" class="text-2xl mb-4 text-slate-500">Dein Einkauf:</p>
      <ul class="px-10 py-10 bg-white rounded-md mb-8">
        <p class="text-2xl font-semibold text-slate-950">Einkaufszettel</p>
        <div
          class="border-t border-dashed border-gray-500 mb-4 mt-2 -mx-10"
        ></div>
        <li
          class="mb-4"
          v-for="(child, index) in productsInCart.children"
          :key="index"
        >
          <p class="text-slate-800">
            {{ child.userData.amount }}g
            {{ child.userData.productName || "Unbenannt" }}:
          </p>
          <p class="text-red-900">{{ child.userData.sugarAmount }}g Zucker</p>
        </li>
        <div
          class="border-t border-dashed border-gray-500 mb-4 mt-2 -mx-10"
        ></div>
        <p class="text-5xl font-bold text-orange-800">
          <span v-html="sugarCounter"></span>g
        </p>
      </ul>

      <Button @click="restartFunction()" :text="'restart'" />
    </div>
  </div>
</template>

<script setup>
import * as THREE from "three";

const productCount = productsInCart.children.length;
let showTitel = true;
if (productCount >= 3) {
  showTitel = false;
} else {
  showTitel = true;
}

const emit = defineEmits(["restartFunction"]);

function restartFunction() {
  emit("restartFunction");
  endScreen.value = false;
  sugarCounter.value = 0;
  /*savedPos.x = 0;
        savedPos.y = 1;
        savedPos.z = 4;
        camera.position.set(savedPos.x, savedPos.y, savedPos.z);
        camera.lookAt(0, 0, 0);
        scrollValue.value = 0;*/
}
</script>
