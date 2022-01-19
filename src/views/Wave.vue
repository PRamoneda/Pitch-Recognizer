<template>
  <div>
    <button @click="start" class="bubbly-button">开始</button>
    <canvas class="posa t0"></canvas>
    <div id="test" class="posa cd1 df fldc aic jcc">
      <div>{{ note }}</div>
      <div>{{ frequency }}</div>
    </div>
  </div>
</template>

<script>
import aubio from "aubiojs";
export default {
  name: "Wave",
  data() {
    return {
      noteLists: [
        "C",
        "C♯",
        "D",
        "D♯",
        "E",
        "F",
        "F♯",
        "G",
        "G♯",
        "A",
        "A♯",
        "B",
      ],
      note: "",
      frequency: "",
    };
  },

  mounted() {
    this.buttonFlow();
  },

  methods: {
    start() {
      console.log("fuck");
      const canvas = document.querySelector("canvas");
      const canvasContext = canvas.getContext("2d");
      canvas.width = document.body.clientWidth;
      canvas.height = document.body.clientHeight;
      let count = 0;
      const maxFrequency = 2000;
      const bufferSize = 1 << 12;
      const size = bufferSize / (1 << 10);
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const processor = audioContext.createScriptProcessor(bufferSize, 1, 1);
      navigator.mediaDevices.getUserMedia({ audio: true }).then((res) => {
        audioContext.createMediaStreamSource(res).connect(analyser);
        analyser.connect(processor);
        processor.connect(audioContext.destination);
        aubio().then(({ Pitch }) => {
          const pitchDetector = new Pitch(
            "default",
            processor.bufferSize,
            processor.bufferSize / 8,
            audioContext.sampleRate
          );
          processor.addEventListener("audioprocess", (e) => {
            const data = e.inputBuffer.getChannelData(0);
            console.log(data);
            const fre = pitchDetector.do(data);
            const x = (count * size) % canvas.width;
            if (x < size) {
              canvasContext.clearRect(0, 0, canvas.width, canvas.height);
              canvasContext.beginPath();
            }
            if (fre && fre < 1000) {
              this.frequency = fre.toFixed(1) + " Hz";
              this.note = this.noteLists[this.getNote(fre) % 12];
              const y = canvas.height - (fre / maxFrequency) * canvas.height;
              canvasContext.lineTo(x, y);
              canvasContext.stroke();
            }
            count += 0.7;
          });
        });
      });
    },
    getNote(fre) {
      let note = 12 * (Math.log(fre / 440) / Math.log(2));
      return Math.round(note) + 69;
    },

    buttonFlow() {
      let animateButton = function (e) {
        e.preventDefault;
        //reset animation
        e.target.classList.remove("animate");
        e.target.classList.add("animate");
        setTimeout(function () {
          e.target.classList.remove("animate");
        }, 700);
      };
      let bubblyButtons = document.getElementsByClassName("bubbly-button");
      for (let i = 0; i < bubblyButtons.length; i++) {
        bubblyButtons[i].addEventListener("click", animateButton, false);
      }
    },
  },
};
</script>

<style lang="scss"></style>
