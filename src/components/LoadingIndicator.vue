<template><div ref="loading-indicator" id="loading-indicator"></div></template>

<script>
export default {
  mounted() {
    let loadingIndicator = this.$refs["loading-indicator"];

    const sketch = (s) => {
      let x = -(Math.PI / 2 + 1);
      let step = 0.015;
      let half = 1;

      s.setup = () => {
        s.createCanvas(200, 100);
        s.colorMode(s.RGB);
        s.background(0);
        s.noStroke();
        s.frameRate(30);
      };

      function segment(x) {
        if (x < -Math.PI / 2) {
          return -Math.sqrt(-Math.pow(x + Math.PI / 2, 2) + 1);
        } else if (x > -Math.PI / 2 && x < Math.PI / 2) {
          return Math.sin(x);
        } else if (x > Math.PI / 2) {
          return Math.sqrt(-Math.pow(x - Math.PI / 2, 2) + 1);
        }
      }

      function drawStep() {
        s.colorMode(s.HSL);
        s.fill(255);

        x += step;
        if (x >= Math.PI / 2 + 1) {
          x = -(Math.PI / 2 + 1);
          if (half == 1) half = -1;
          else half = 1;
        }

        s.ellipse(
          (x * half + Math.PI + 1) * 25 - 8,
          (segment(x) + 2) * 25 - 8,
          16,
          16
        );
      }

      s.draw = () => {
        s.colorMode(s.RGB);
        s.background(0, 0, 0, 4);
        for (let i = 0; i < 9; i++) drawStep();
      };
    };

    const P5 = require("p5");
    new P5(sketch, loadingIndicator);
  },
};
</script>

<style lang="scss">
#loading-indicator {
  mix-blend-mode: color-dodge;
  display: flex;
  justify-content: center;
}
</style>
