class ConsoleMessage {

  newMessage(message, container, id, addClass, color) {
    this.message = message;
    this.container = container;
    this.id = id;
    this.addClass = addClass;
    this.color = color;
    let msg = createP(this.message);
    msg.parent(this.container);
    if (this.id != 0) {
      msg.id(id);
    }
    if (this.addClass != 0) {
      msg.addClass(addClass);
    }
    msg.style('color', this.color);
    this.updateScroll();
  }

  updateScroll() {
    let element = document.getElementById("console");
    element.scrollTop = element.scrollHeight;
  }
}
