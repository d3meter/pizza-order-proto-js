const rootElement = document.querySelector("#root");
const pizzaDiv = document.querySelector(".c-menu");

const pizzaComponent = (name, ingredients, price) => `
<div class="pizza">
  <div class="ordering">
    <label for="amount">Amount: </label>
    <input type="number" value="1" name="amount" min="1" max="20">
    <button class="add-order"></button>
  </div>
  <hr>
  <h2>${name}</h2>
  <h5>${price} $</h5>
  <div class="pizza-pics">
    <img src="img/${name}.webp" alt="pizza">
  </div>
  <h3>${ingredients.join(" &#9679 ")}</h3>
  </div>
`;

fetch("/pizza")
    .then((res) => res.json())
    .then((pizzas) => {
        pizzas.map((pizza) =>
            pizzaDiv.insertAdjacentHTML(
                "beforeend",
                pizzaComponent(pizza.name, pizza.ingredients, pizza.price)
            )
        );

        const addOrder = document.querySelectorAll(".add-order");
        const orderSumText = document.querySelector(".orderSum");

        let orderSum = 0;
        let orderPizzas = [];
        for (let btn of addOrder) {
            btn.addEventListener("click", function (event) {
                const pizzaName = event.composedPath()[2].children[2].innerText;
                const number = parseInt(
                    event.composedPath()[1].children[1].value
                );
                const price = parseInt(
                    event.composedPath()[2].children[3].innerText.slice(0, -2)
                );

                const orderList = document.querySelector(".order-pizza");
                if (number > 0) {
                    orderSum += number * price;
                    orderSumText.textContent = `${orderSum} $`;
                    orderPizzas.push({ [pizzaName]: `${number}` });
                    orderList.insertAdjacentHTML(
                        "beforeend",
                        `
            <div>
              <h1>${pizzaName}</h1>
              <h2>${number} x ${price} $</h2>
            </div>
          `
                    );
                } else {
                    alert("Valore sbagliato!");
                }
            });
        }

        //place order button
        const orderButton = document.querySelector(".place-order");
        const inputOrderTab = document.querySelector(".c-delivery");

        orderButton.addEventListener("click", function () {
          if (orderSum !== 0) {
            inputOrderTab.style.display = "grid";
            inputOrderTab.style.transition = `all 2s ease`;
            inputOrderTab.scrollIntoView();
          } else {
            alert("Aje! Aren't you hungry??");
          }

        });
        //end of place order button

        //delete order button
        const delOrderBtn = document.querySelector(".del-order");

        delOrderBtn.addEventListener("click", () => {
          window.location.reload();
        });

        const orderDoneTab = document.querySelector(".order-done-backg");
        const reloaderBtn = document.querySelector(".reload");
        
        reloaderBtn.addEventListener("click", () => {
            window.location.reload();
            document.querySelector('#name').value = '';
            document.querySelector('#phone').value = '';
            document.querySelector('#zip').value = '';
            document.querySelector('#city').value = '';
            document.querySelector('#street').value = '';
            document.querySelector('#house').value = '';
        });
        //end of delete order button
        
        //go button
        const goButton = document.querySelector(".go-button");
        const forms = document.querySelectorAll(".cd-input form");

        let array = [];
        let dataObj = {};

        goButton.addEventListener("click", function (e) {
            e.preventDefault();
            let dataExtract = [];
            let ok = true;
            for (let i = 0; i < forms.length; i++) {
                dataObj = new FormData(forms[i]);
                if ([...dataObj][0][1] === "") {
                    ok = false;
                }
                dataExtract.push(...dataObj);
            }
            if (ok) {
                array.push(...orderPizzas);
                array.push({ orderSum: `${orderSum}` });
                array.push({ orderDate: `${new Date()}` });
                array.push(...dataExtract);
                orderDoneTab.style.display = "flex";
                rootElement.style.display = "none";

                fetch("/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(array),
                })
                    .then((res) => res.json())
                    .then((data) => console.log(data));
            } else {
                alert("Hey! Some required information is missing or wrong...");
            }
        //end of go button
        });
    });
