const tickbox = () => {
  const tickbox = document.querySelector(".tick-box");
  const tick = document.querySelector(".tick");
    if (tickbox) {
      tickbox.addEventListener("click", () => {
        tick.classList.toggle("d-none");
      });
    }
}

export default tickbox;
