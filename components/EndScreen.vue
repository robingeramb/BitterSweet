<template>
    <div class="flex items-center justify-center h-screen bg-gray-800 text-white">
      <div class="text-center">
        <h2 class="text-1xl mb-4 text-slate-500">Spiel beendet!</h2>
        <h1 class="text-4xl mb-4">Bitter Sweet</h1>
        <p class="text-5xl mb-4 font-bold" v-html="sugarCounter"></p>

        <button @click="restartFunction()" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded">
          Restart
        </button>
      </div>
    </div>
</template>

<script setup>
    const emit = defineEmits(['restartFunction']);

    function restartFunction() {
        emit('restartFunction');
        endScreen.value = false;
    }
</script>