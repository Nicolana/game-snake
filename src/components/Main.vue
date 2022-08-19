<script setup>
import { ref, onMounted } from 'vue';
import Snake from './main.js';

const gameRef = ref();

onMounted(() => {
    new Snake("game");
})
</script>

<template>
    <div class="game-wrapper">
        <canvas ref="gameRef" id="game" width="800" height="500"></canvas>
    </div>
</template>

<style scoped>
.game-wrapper canvas {
    background-color: #fff;
    border: 1px solid #eee;
}
</style>