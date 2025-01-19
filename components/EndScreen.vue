<template>
  <div class="endscreen bg-neutral-950 flex flex-col">
    <div class="flex items-center justify-center headlineContainer text-white">
      <div class="text-center flex flex-col items-center">
        <h1 v-if="currSlide == 1" class="text-4xl max-w-[40rem] mb-6">
          Grocerys are filled with sugar and we often dont even know about it
        </h1>
        <p v-if="currSlide == 1" class="text-2xl mb-8 text-white">
          We gave you a relatable scenario to visualise it for you
        </p>
        <h1 v-if="currSlide == 0" class="text-4xl max-w-[40rem] mb-6">
          Awesome! <br />
          You have successfully completed your grocery shopping!
        </h1>
        <p v-if="currSlide == 0" class="text-2xl mb-8 text-white">
          But at what cost?
        </p>
        <Button @click="next()" :text="'continue'" />
      </div>
    </div>
    <div class="flex flex-col items-center w-full justify-center">
      <Receipt ref="receipt" />
      # <Consequences v-if="showConsequences" :formattedText="formattedText" />
      <Button
        v-if="showConsequences"
        @click="restartFunction()"
        :text="'restart'"
        class="mb-40"
      />
    </div>
    <div class="flex items-center w-full justify-center"></div>
  </div>
</template>

<script setup lang="ts">
import * as THREE from "three";
import { useSugarEffects } from "~/stores/effects";
const receipt = ref();
const effectsStore = useSugarEffects();
const effectList = effectsStore.effects;
const productCount = productsInCart.length;
let showTitel = true;
let showMainTitel = true;
let formattedText: string;
const showConsequences = ref(false);

const currSlide = ref(0);

function next() {
  currSlide.value++;
  console.log(receipt.value.offsetHeight);
  if (currSlide.value == 2) {
    scrollToChild();
    showConsequences.value = true;
  }
}

function scrollToChild() {
  const child = receipt.value?.$el || receipt.value; // Zugriff auf das DOM-Element der Child-Komponente
  if (!child) {
    console.error("Receipt-Referenz ist undefined.");
    return;
  }

  const offset = 300; // Offset von -20 Pixel
  const targetPosition = child.getBoundingClientRect().top + window.scrollY;

  // Scrollen mit Smooth-Animation
  window.scrollTo({
    top: targetPosition,
    behavior: "smooth",
  });
}

//Checken ob Zuckerergebnis in einem Bereich liegt
function findSugarRange() {
  let found = false;
  let current;
  let sugarPerPerson = Math.round(sugarCounter.value / 3);

  for (let i = 0; i < effectList.length - 1; i++) {
    current = effectList[i];

    //sugarPerPerson im aktuellen Bereich?
    if (
      sugarPerPerson >= current.sugarMinAmount &&
      sugarPerPerson <= current.sugarMaxAmount
    ) {
      found = true;
      break;
    }

    //sugarPerPerson zwischen Bereichen?
    if (i < effectList.length - 1) {
      const next = effectList[i + 1];
      if (
        sugarPerPerson > current.sugarMaxAmount &&
        sugarPerPerson < next.sugarMinAmount
      ) {
        found = true;
        break;
      }
    }
  }

  if (!found) {
    console.log(
      `sugarPerPerson (${sugarPerPerson}) liegt in keinem definierten Bereich.`
    );
  } else {
    formattedText = addParagraphsToString(current.description, 60);
  }
}
findSugarRange();

function addParagraphsToString(text: string, maxLength: number): string {
  let result = "<p>"; // Beginne mit einem Absatz
  let currentLength = 0;
  let currentWord = "";

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (
      char === " " ||
      char === "." ||
      char === "," ||
      char === "!" ||
      char === "?"
    ) {
      currentWord += char;
      result += currentWord;
      currentLength += currentWord.length;

      if (currentLength >= maxLength) {
        result += "</p><p>"; // Neuen HTML-Absatz hinzufügen
        currentLength = 0;
      }
      currentWord = "";
    } else {
      currentWord += char;
    }
  }

  if (currentWord) {
    result += currentWord;
  }
  result += "</p>"; // Letzten Absatz schließen

  return result;
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

const emit = defineEmits(["restartFunction"]);

function restartFunction() {
  emit("restartFunction");
  endScreen.value = false;
  sugarCounter.value = 0;
}
</script>

<style>
.headlineContainer {
  height: calc(100vh - 250px);
}
</style>
