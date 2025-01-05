<template>
  <Box :mousePos="mousePosition" :scrollVal="scrollValue" />
</template>
<script setup lang="ts">
const mousePosition = ref({ x: 0, y: 0 });

const updateMousePosition = (event) => {
  mousePosition.value.x = event.clientX;
  mousePosition.value.y = event.clientY;
};

const scrollValue = ref(0);
let scrollTimer = null;
let lastScrollTime = 0;
const scrollSpeed = 0.01;

const handleWheel = (event) => {
  const deltaY = event.deltaY;

  const currentTime = Date.now();
  const deltaTime = currentTime - lastScrollTime;

  if (deltaTime > 0) {
    if (deltaY > 0) {
      scrollValue.value -= deltaY * scrollSpeed; // Scrollen nach unten
    } else {
      scrollValue.value -= deltaY * scrollSpeed; // Scrollen nach oben
    }
  }

  lastScrollTime = currentTime;
};

onMounted(() => {
  window.addEventListener("wheel", handleWheel);
  window.addEventListener("mousemove", updateMousePosition);
});

onBeforeUnmount(() => {
  window.removeEventListener("wheel", handleWheel);
  window.removeEventListener("mousemove", updateMousePosition);
});
</script>
<style>
* {
  padding: 0px;
  margin: 0px;
}
body {
  overflow: hidden;
}
</style>
