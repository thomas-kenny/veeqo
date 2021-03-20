const showItems = () => {
  const leftcards = document.querySelectorAll(".boxcard-left");


  if (leftcards) {
    leftcards.forEach((leftcard) => {
      leftcard.addEventListener("click", (event) => {
        const id = event.currentTarget.dataset.boxcardId;
        //const dropdown = document.querySelector(`#${id}`);
        const dropdown = document.querySelector("#id_1");
        dropdown.classList.toggle("d-none");
      });
    });
  }
}

export default showItems;