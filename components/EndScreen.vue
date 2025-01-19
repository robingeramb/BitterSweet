<template>
  <div class="overflow-hidden relative bg-neutral-950 h-screen w-full">
    <div class="endscreen w-full bg-neutral-950 flex flex-col">
      <div
        class="flex items-center justify-center headlineContainer text-white"
      >
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
        </div>
      </div>
      <div
        class="flex flex-col items-center justify-center w-full absolute"
        ref="receipt"
      >
        <Receipt ref="receiptComp" />
      </div>

      <div
        :style="{ top: 600 + 'px' }"
        class="flex flex-col items-center w-full absolute justify-center"
      >
        <Consequences v-if="showConsequences" :formattedText="formattedText" />
        <Button
          v-if="showConsequences"
          @click="restartFunction()"
          :text="'restart'"
          class="mb-40"
        />
      </div>
      <div class="flex items-center w-full justify-center"></div>
    </div>
    <div
      class="asideSection flex flex-col gap-4 left-10 absolute top-1/2 -translate-y-1/2"
    >
      <div
        v-for="(items, index) in 5"
        @click="setCurrSlide(index)"
        :class="currSlide == index ? 'opacity-100' : 'opacity-50'"
        class="point cursor-pointer bg-white w-3 h-3 rounded-full"
      ></div>
    </div>
  </div>
  <div
    class="bottomShadow fixed left-0 w-full bottom-0 z-50 h-80 bg-gradient-to-t from-black"
  >
    <div
      @click="next()"
      class="absolute cursor-pointer select-none bottom-14 inline-block left-1/2 flex flex-col items-center justify-center -translate-x-1/2 text-white"
    >
      <p class="text-xl">continue</p>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-14" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 5v14m4-4l-4 4m-4-4l4 4"
        />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import gsap from "gsap";
import { useSugarEffects } from "~/stores/effects";
const receipt = ref();
const receiptComp = ref();
const effectsStore = useSugarEffects();
const effectList = effectsStore.effects;
const productCount = productsInCart.length;
let showTitel = true;
let showMainTitel = true;
let formattedText: string;
const showConsequences = ref(false);

const currSlide = ref(0);

function setCurrSlide(index: number) {
  currSlide.value = index;
  if (currSlide.value < 2) {
    gsap.to(receipt.value, {
      bottom: 300 - receipt.value.offsetHeight,
      duration: 1,
    });
    receiptComp.value.fadeBack(1);
    showConsequences.value = false;
  }
}

onMounted(() => {
  gsap.to(receipt.value, {
    bottom: 300 - receipt.value.offsetHeight,
    duration: 0,
  });
});

function next() {
  currSlide.value++;
  console.log(receipt.value.offsetHeight);
  if (currSlide.value == 2) {
    scrollToReceipt();
    //showConsequences.value = true;
  }
}

function back() {
  currSlide.value--;
  console.log(receipt.value.offsetHeight);
  if (currSlide.value < 2) {
    gsap.to(receipt.value, {
      bottom: 300 - receipt.value.offsetHeight,
      duration: 1,
    });
    //showConsequences.value = false;
  }
}

function scrollToReceipt() {
  gsap.to(receipt.value, {
    bottom: 300,
    duration: 6.75,
    ease: "linear",
    onComplete: () => {
      // Zweiter Teil der Animation
      gsap.to(receipt.value, {
        bottom: 600,
        duration: 1.5, // Kürzerer Zeitraum für den Rest
        ease: "power3.out", // Schnellerer Verlauf am Ende
      });
    },
  });
  receiptComp.value.startFadeIn(6);
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
