const tickbox = () => {
  const tickboxes = document.querySelectorAll('.tick-box');

  if (tickboxes) {
    tickboxes.forEach((tickbox) => {
      tickbox.addEventListener('click', () => {
        tickbox.firstElementChild.classList.toggle('d-none');
      });
    });
  }
};

export default tickbox;
