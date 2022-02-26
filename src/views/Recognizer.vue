<template>
  <div class="df aic jcsb fldc">
    <div class="cflexc">
      <div class="cd1 fzr3">{{ note }}</div>
      <div class="fzr4">{{ frequency }}</div>
    </div>
    <div class="df jcsb w80 mt56">
      <button @click="pBeg" class="bubbly-button">ask</button>
      <button @click="pClose" class="bubbly-button">closure</button>
      <button @click="pStart" class="bubbly-button">Start</button>
      <button @click="pPause" class="bubbly-button">Pause</button>
      <button @click="pResume" class="bubbly-button">Resume</button>
      <button @click="pStop" class="bubbly-button">Stop</button>
      <button @click="pPlay" class="bubbly-button">Play/button>
      <div class="pAudio"></div>
    </div>
  </div>
</template>

<script>
import Recorder from "recorder-core/recorder.wav.min";
import aubio from "aubiojs";
let recorder = null;
let recRes = null;
export default {
  name: "Recognizer",
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
      note: "A",
      frequency: "440.0Hz",
    };
  },

  mounted() {
    this.buttonFlow();
  },

  methods: {
    //   ask for audio permission and initialize the recorder
    pBeg() {
      // note the scope of this
      let that = this;
      let tmpRecorder = Recorder({
        type: "wav",
        sampleRate: 16000,
        bitRate: 16,
        // the callback function during the recording process
        onProcess: function (_, powerLevel) {
          // filter out noise by using power level
          if (powerLevel >= 5) {
            // get the original buffer
            let oBuffer = tmpRecorder.buffers[tmpRecorder.buffers.length - 1];
            //   initialize the pitch detector
            aubio().then(({ Pitch }) => {
              const pitchDetector = new Pitch(
                "default",
                Recorder.BufferSize,
                Recorder.BufferSize / 8,
                tmpRecorder.srcSampleRate
              );
              const fre = pitchDetector.do(oBuffer);
              if (fre && fre < 1000) {
                that.frequency = fre.toFixed(1) + " Hz";
                that.note = that.getNote(fre);
              }
            });
          }
        },
      });
      tmpRecorder.open(
        function () {
          recorder = tmpRecorder;
        },
        function (msg, isUserNotAllow) {
          //用户拒绝未授权或不支持
          alert(isUserNotAllow, msg);
        }
      );
    },

    pClose() {
      if (recorder) {
        recorder.close();
        alert("已关闭");
      } else {
        alert("未打开录音", 1);
      }
    },

    pStart() {
      if (recorder && Recorder.IsOpen()) {
        recorder.start();
        recRes = null;
        console.log("已开始录音...");
      } else {
        console.log("未打开录音", 1);
      }
    },

    pPause() {
      if (recorder && Recorder.IsOpen()) {
        recorder.pause();
      } else {
        console.log("未打开录音", 1);
      }
    },

    pResume() {
      if (recorder && Recorder.IsOpen()) {
        recorder.resume();
      } else {
        console.log("未打开录音", 1);
      }
    },

    pStop() {
      if (!(recorder && Recorder.IsOpen())) {
        console.log("未打开录音");
        return;
      }
      recorder.stop(
        function (blob, duration) {
          console.log(
            blob,
            (window.URL || window.webkitURL).createObjectURL(blob),
            "时长:" + duration + "ms"
          );

          recRes = blob;
          console.log(
            "已录制mp3:" +
              duration +
              "ms " +
              blob.size +
              "字节，可以点击播放、上传了"
          );
        },
        function (msg) {
          console.log("录音失败:" + msg);
        }
      );
    },

    pPlay() {
      if (!recRes) {
        console.log("请先录音，然后停止后再播放");
        return;
      }
      var audio = document.createElement("audio");
      audio.controls = true;
      document.querySelector(".pAudio").appendChild(audio);
      //简单利用URL生成播放地址，注意不用了时需要revokeObjectURL，否则霸占内存
      audio.src = (window.URL || window.webkitURL).createObjectURL(recRes);
      audio.play();

      setTimeout(function () {
        (window.URL || window.webkitURL).revokeObjectURL(audio.src);
      }, 5000);
    },

    getNote(fre) {
      let note = 12 * (Math.log(fre / 440) / Math.log(2));
      return this.noteLists[(Math.round(note) + 69) % 12];
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
