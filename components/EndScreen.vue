<template>
  <div class="endscreen">
    <div class="flex items-center justify-center h-screen bg-gray-800 text-white">
      <div class="text-center flex flex-col items-center">
        <h2 class="text-1xl mb-2 text-slate-500">Task done!</h2>
        <h1 v-if="showMainTitel" class="text-4xl mb-6">Bitter Sweet</h1>
        <p v-if="showTitel" class="text-2xl mb-4 text-slate-500">Your purchase:</p>
        <div class="flex justify-between">
          <ul class="px-10 py-10 bg-white rounded-md mb-8 mx-5">
            <p class="text-2xl font-semibold text-slate-950">Your receipt</p>
            <div class="border-t border-dashed border-gray-500 mb-4 mt-2 -mx-10"></div>
            <li class="mb-4" v-for="(child, index) in productsInCart.children" :key="index">
              <p class="text-slate-800 text-xs">
                {{ child.userData.amount }}g
                {{ child.userData.productName || "Unbenannt" }}:
              </p>
              <p class="text-red-900">{{ child.userData.sugarAmount }}g sugar / ≈ {{ Math.round(child.userData.sugarAmount / 3) }}g per person</p>
            </li>
            <div class="border-t border-dashed border-gray-500 mb-4 mt-2 -mx-10"></div>
            <p class="text-5xl font-bold text-orange-800">
              <span v-html="sugarCounter"></span>g sugar
            </p>
            <p class="m-3 text-red-800">≈ {{Math.round(sugarCounter / 3)}}g per person. </p>
          </ul>
          <ul class="px-10 py-10 bg-slate-700 rounded-md mb-8 mx-5">
            <p class="text-2xl font-semibold text-slate-400">Your consumption</p>
            <div class="border-t border-dashed border-gray-500 mb-4 mt-2 -mx-10"></div>
            <li class="mb-4">
              <p class="text-slate-300 text-xs mb-4">
                This already puts you at
              </p>
               <p class="text-red-500 text-5xl font-bold mb-2">
                {{ calculatePercent() }}%
              </p>
              <p class="text-white">
                of the recommended <br> amount of sugar per day.
              </p>
            </li>
            <div class="border-t border-dashed border-gray-500 mb-4 mt-2 -mx-10"></div>
            <p class="text-xs text-slate-300 mb-2">Based on that:</p>
            <p class="text-red-500 font-semibold text-xl"> {{ findSugarRange() }} </p>

         </ul>
        </div>
     

        <Button @click="restartFunction()" :text="'restart'" />
      </div>
    </div>
  </div>
</template>

<script setup>
import * as THREE from "three";
import { useSugarEffects } from "~/stores/effects";

const effectsStore = useSugarEffects();
const effectList = effectsStore.effects;
const productCount = productsInCart.children.length;
let showTitel = true;
let showMainTitel = true;


//Checken ob Zuckerergebnis in einem Bereich liegt

function findSugarRange() {

  let found = false;
  let current;
  let sugarPerPerson = Math.round(sugarCounter.value / 3);

  for (let i = 0; i < effectList.length - 1; i++) {
    current = effectList[i];

    //sugarPerPerson im aktuellen Bereich?
    if (sugarPerPerson >= current.sugarMinAmount && sugarPerPerson <= current.sugarMaxAmount) {
      found = true;
      break;
    }

    //sugarPerPerson zwischen Bereichen?
    if (i < effectList.length - 1) {
      const next = effectList[i + 1];
      if (sugarPerPerson > current.sugarMaxAmount && sugarPerPerson < next.sugarMinAmount) {
        found = true;
        break;
      }
    }
  }

  if (!found) {
      console.log(`sugarPerPerson (${sugarPerPerson}) liegt in keinem definierten Bereich.`);
    } else {
      return current.description;
  }
}

//Check how many items in cart and response dynamic layout

if (productCount > 5) {
        showTitel = false;
        showMainTitel = false;
      } else if (productCount > 3) {
        showTitel = false;
        showMainTitel = true;
      } else {
        showTitel = true;
        showMainTitel = true;
      }

function calculatePercent() {

  const maximum = 50;
  let sugarAmount = sugarCounter.value;
  let percent = Math.round(sugarAmount / 3) / maximum * 100;

  return percent;
}

const emit = defineEmits(["restartFunction"]);

function restartFunction() {
  emit("restartFunction");
  endScreen.value = false;
  sugarCounter.value = 0;
}
</script>
