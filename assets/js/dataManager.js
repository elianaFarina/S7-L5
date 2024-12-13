const url = "https://striveschool-api.herokuapp.com/api/product/";

class DataManager {
    constructor(endPoint = url) {
        this.endPoint = endPoint;
    }

    getDataFromForm() {
        const data = {
            "name": document.getElementById("nome-prodotto").value,
            "description": document.getElementById("description").value,
            "brand": document.getElementById("modello").value,
            "price": document.getElementById("prezzo").value,
            "imageUrl": document.getElementById("link").value,
        };
        return data;
    }

    async fetchData() {
        let response = await fetch(this.endPoint, {
            headers: {
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzViZjhlMGQyMjA3MTAwMTVkZTJmNDIiLCJpYXQiOjE3MzQwODA3MzYsImV4cCI6MTczNTI5MDMzNn0.OE2wGYsJl6Wc17PAQf6zfWASZVUmMy5BKdWOBBRIv5A"
            }
        });
        const parsedData = await response.json();
        return parsedData;
    }

    async postData(event) {
        event.preventDefault();
        const body = this.getDataFromForm();

        let response = await fetch(this.endPoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzViZjhlMGQyMjA3MTAwMTVkZTJmNDIiLCJpYXQiOjE3MzQwODA3MzYsImV4cCI6MTczNTI5MDMzNn0.OE2wGYsJl6Wc17PAQf6zfWASZVUmMy5BKdWOBBRIv5A"
            },
            body: JSON.stringify(body)
        });

        const status = response.status;
        console.log("POST request status: " + status);
    }
    async deleteData(event, id) {
        event.preventDefault();
        let userConfirmed = confirm("Vuoi cancellare questo prodotto?"); 
        if (userConfirmed) {
        let response = await fetch(`${this.endPoint}/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzViZjhlMGQyMjA3MTAwMTVkZTJmNDIiLCJpYXQiOjE3MzQwODA3MzYsImV4cCI6MTczNTI5MDMzNn0.OE2wGYsJl6Wc17PAQf6zfWASZVUmMy5BKdWOBBRIv5A"
            },
        });
        const status = response.status;
        console.log("DELETE request status: " + status);
        alert("Prodotto eliminato, sarai reindirizzato alla home");
        setTimeout(() => { window.location.href = "index.html"; }, 1000);
        }

        
        
    }
    async updateData(event, id) {
        event.preventDefault();
        const body = this.getDataFromForm();

        let response = await fetch(`${this.endPoint}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzViZjhlMGQyMjA3MTAwMTVkZTJmNDIiLCJpYXQiOjE3MzQwODA3MzYsImV4cCI6MTczNTI5MDMzNn0.OE2wGYsJl6Wc17PAQf6zfWASZVUmMy5BKdWOBBRIv5A"
            },
            body: JSON.stringify(body)
        });

        const status = response.status;
        console.log("PUT request status: " + status);
        
    }
}

const dataManager = new DataManager(url);
const currentPage = window.location.href.split("/").reverse()[0];



if (currentPage === "index.html") {
    async function createCards() {
        const data = await dataManager.fetchData();
        console.log(data);
        const container = document.getElementById("card-container");
        data.forEach(product => {
            const card = `

                <div class="card" style="width: 18rem; margin: 10px;">
    <div class="d-flex flex-column justify-content-between" style="height: 100%;">
        <img class="card-img-top" style="height: 200px; object-fit: cover;" src="${product.imageUrl}" alt="${product.name}">
        <div class="card-body d-flex flex-column justify-content-between flex-grow-1">
            <div>
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text">${product.description}</p>
                <p class="card-text"><strong>Brand:</strong> ${product.brand}</p>
                <p class="card-text"><strong>Price:</strong> ${product.price}€</p>
            </div>
            <div class="mt-3 d-flex justify-content-between">
                <a href="./back-office.html?id=${product._id}" class="btn btn-warning" id="modifica-btn">Modifica</a>
                <a href="./details.html?id=${product._id}" class="btn btn-primary">Dettagli</a>
            </div>
        </div>
    </div>
</div>
`

            container.innerHTML += card;
            
        });
    }
    
    createCards();

} else {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    if (currentPage.includes("details")){
        (async () => {
            const data = await dataManager.fetchData();
            const product = data.find(obj => obj._id === id);
            const detailsSection = document.getElementById("details-section");
            const detailCode = `
                <div class ="card d-flex flex-row" style="border:none">
                <img class="w-50 h-100" src="${product.imageUrl}" alt="${product.name}">
                <div>
                    <h3 class="mb-1">${product.brand}</h3>  
                    <h2 class="mb-3">${product.name}</h2>   
                    <span class="bg-primary text-white p-2 rounded-1">${product.price}€</span>  
                    
                    <p class="mt-3">${product.description}</p>  
                <div></div>
                `
            detailsSection.innerHTML += detailCode;})()
    }
    else{
    
    const saveButton = document.getElementById("save-btn");
    if (id !== null && id !== undefined) {
        (async () => {
            const titolo = document.getElementById("titolo-back-office")
            titolo.innerHTML = "Modifica Articolo"
            const data = await dataManager.fetchData();
            const product = data.find(obj => obj._id === id);
            
            if (product) {
                document.getElementById("nome-prodotto").value = product.name;
                document.getElementById("description").value = product.description;
                document.getElementById("modello").value = product.brand;
                document.getElementById("prezzo").value = product.price;
                document.getElementById("link").value = product.imageUrl;

                saveButton.addEventListener("click", (event) => dataManager.updateData(event));
                const formBtnDiv = document.getElementById("form-btn-div");
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.className = "btn btn-danger"
                formBtnDiv.insertBefore(deleteButton, formBtnDiv.firstChild);
                deleteButton.addEventListener("click", (event) => dataManager.deleteData(event, product._id));
            } 
            console.log(data);
        })();
    }
    else {saveButton.addEventListener("click", (event) => dataManager.postData(event));}
}}

