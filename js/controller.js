function () {
    this.input = {
    left: false,
    right: false
    };
    this.hasGP = false;
    this.repGP;
    this.gamepadInfo = document.getElementById("gamepad-info");
    this.start;
    this.a = 0;
    this.b = 0;

    function canGame() {
    return "getGamepads" in navigator;
    }


    if(canGame()) {

    var prompt = "To begin using your gamepad, connect it and press any button!";
    $("#gamepadPrompt").text(prompt);
    $(window).on("gamepadconnected", function() {
    this.hasGP = true;
    $("#gamepadPrompt").html("Gamepad connected!");
    this.repGP = window.setInterval(checkGamepad,100);
    });
    $(window).on("gamepaddisconnected", function() {
    $("#gamepadPrompt").text(prompt);
    window.clearInterval(repGP);
    });
    //setup an interval for Chrome
    var checkGP = window.setInterval(function() {
      if(navigator.webkitGetGamepads()[0]) {
      if(this.hasGP) $(window).trigger("gamepadconnected");
      window.clearInterval(checkGP);
      }
    }, 500);
    }

    function checkGamepad() {
      gp = navigator.webkitGetGamepads()[0];
      axeLF = gp.axes[0];

    if(axeLF < -0.5) {
      this.input.left = true;
      this.input.right = false;
    } else if(axeLF > 0.5) {
      this.input.left = false;
      this.input.right = true;
    } else {
      this.input.left = false;
      this.input.right = false;
    }
  }
}