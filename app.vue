<template>
  <Countdown />
  <Box ref="threeJS" :mousePos="mousePosition" :scrollVal="scrollValue" />
</template>
<script setup lang="ts">
const mousePosition = ref({ x: 0, y: 0 });
const threeJS = ref(null);
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
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      threeJS.value.leaveSelectMode();
      selectedProductToShelf();
    }
  });
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
  font-family: "Poppins";
}

body {
  overflow: hidden;
}
</style>
