<template>
  <div :class="$style._">
    <div :class="$style.stars">
      <div v-for="(_, index) in Array(3)" :key="index"></div>
    </div>
    <slot :class="$style.slot" />
  </div>
</template>
<style lang="scss" module>
@use "sass:math";
@use "sass:list";

@keyframes animation-stars-moving {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(-2000px);
  }
}

@function create-star() {
  @return #{math.round(math.random() * 2000)}px #{math.round(math.random() * 2000)}px #fff;
}

@function box-shadow-stars($n) {
  @if $n == 0 {
    @return create-star();
  }

  @return #{box-shadow-stars($n - 1)}, #{create-star()};
}

._ {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: radial-gradient(100% 100% at 50% 100%, #1e1e1e 0%, #131313 100%);
  z-index: 0;
}

.stars {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1;
  user-select: none;
  pointer-events: none;

  & > div {
    opacity: 0.3;
  }

  & > div:nth-child(1) {
    width: 1px;
    height: 1px;
    background: transparent;
    box-shadow: box-shadow-stars(60);
    animation: animation-stars-moving 50s linear infinite;
  }

  & > div:nth-child(1)::after {
    content: " ";
    position: absolute;
    top: 2000px;
    width: 1px;
    height: 1px;
    background: transparent;
    box-shadow: box-shadow-stars(60);
  }

  & > div:nth-child(2) {
    width: 2px;
    height: 2px;
    background: transparent;
    box-shadow: box-shadow-stars(100);
  }

  & > div:nth-child(2)::after {
    content: " ";
    position: absolute;
    top: 2000px;
    width: 2px;
    height: 2px;
    background: transparent;
    box-shadow: box-shadow-stars(60);
  }

  & > div:nth-child(3) {
    width: 3px;
    height: 3px;
    background: transparent;
    box-shadow: box-shadow-stars(500);
    animation: animation-stars-moving 150s linear infinite;
  }

  & > div:nth-child(3)::after {
    content: " ";
    position: absolute;
    top: 2000px;
    width: 3px;
    height: 3px;
    background: transparent;
    box-shadow: box-shadow-stars(500);
  }
}

.slot {
  position: relative;
  z-index: 2;
  margin: auto;
}
</style>
