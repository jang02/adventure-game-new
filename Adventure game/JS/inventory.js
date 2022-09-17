let inventory = [];

class inventoryItem{

    id;
    src;

    constructor(id, src) {
        this.id = id;
        this.src = src;
    }

    add() {
        let img = document.createElement('IMG');

        img.src = this.src;
        img.id = this.id;

        img.style.height = "75px";
        img.style.height = "75px";

        img.classList.add("invitem");

        document.getElementById("inventory").appendChild(img);

        inventory.push(this.id);
    }

}