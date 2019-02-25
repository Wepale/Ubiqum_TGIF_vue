new Vue({
  el: "#myVueElement",
  data: {
    isShow: false,
    message: "Read More"
  },
  methods: {
    makeAccordion: function() {
      this.message === "Read More" ? this.message = "Read Less" : this.message = "Read More";
      this.isShow = !this.isShow;
      let panel = this.$refs.myPanel;
      console.log(panel);
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = `${panel.scrollHeight}px`;
      }
    }
  }
});
