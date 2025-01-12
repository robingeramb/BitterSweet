<template>
  <div>
    <!-- Fullscreen Start Screen -->
    <div
      v-if="!started && !gameOver"
      class="flex items-center justify-center h-screen bg-gray-800 text-white"
    >
      <div class="text-center">
        <h1 class="text-4xl mb-4">Bitter Sweet</h1>
        <h1 class="text-4xl font-bold mb-4">{{ formattedTime }}</h1>
        <button
          @click="startCountdown"
          class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
        >
          Start
        </button>
      </div>
    </div>

    <!-- Fullscreen Game Over Screen -->
    <div
      v-if="gameOver"
      class="flex items-center justify-center h-screen bg-red-800 text-white"
    >
      <div class="text-center">
        <h1 class="text-4xl font-bold mb-4">Game Over</h1>
        <button
          @click="restart"
          class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
        >
          Restart
        </button>
      </div>
    </div>

    <!-- Countdown Timer in the Corner -->
    <div
      v-if="started && !gameOver"
      class="fixed top-2 min-w-24 right-1/2 translate-x-1/2 bg-gray-900 bg-opacity-50 text-white text-xl text-center font-medium px-4 py-2 rounded-full shadow"
    >
      {{ formattedTime }}
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const time = ref(300); // 5 minutes in seconds
const started = ref(false);
const gameOver = ref(false);
let interval = null;

const startCountdown = () => {
  started.value = true;
  interval = setInterval(() => {
    if (time.value > 0) {
      time.value -= 1;
    } else {
      clearInterval(interval);
      gameOver.value = true;
    }
  }, 1000);
};

const restart = () => {
  time.value = 300; // Reset to 5 minutes
  started.value = false;
  gameOver.value = false;
  clearInterval(interval);
};

const formattedTime = computed(() => {
  const minutes = Math.floor(time.value / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (time.value % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
});
</script>

<style scoped>
body {
  @apply bg-gray-900;
}
</style>
