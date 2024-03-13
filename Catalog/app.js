// Getting Url Param(username)

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const username = urlParams.get('username');
const category = urlParams.get('category');

console.log(username);

// Routing
const logo = document.getElementById('logo');
const profile = document.getElementById('profile');
const cart = document.getElementById('cart');

profile.addEventListener('click', () => {
    window.location.href = `/MyProfile?username=${encodeURIComponent(username)}`;
});

cart.addEventListener('click', () => {
    // window.location.href=`/Cart?username=${encodeURIComponent(username)}`;
    window.location.href = `/Cart?username=${encodeURIComponent(username)}`;
});

logo.addEventListener('click', () => {
    window.location.href = `/home?username=${encodeURIComponent(username)}`;
});

const titleHeading = category.replace(/([a-z])([A-Z])/g, '$1 $2');
document.getElementById('category-title').innerText = `Shop results for ${titleHeading}`;

// Catalogue Javascript
const fetch_products = 'https://prod-49.westus.logic.azure.com:443/workflows/c1af8f55cdf44de99c7c02b02807861e/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=bT071Ujf52gT-TSycglJkozjXkQMHCPrG_xU5ewf3d8';

async function displayProducts() {

    // fetch Product Data from api

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var record = JSON.stringify({
        category: category,
    });

    const options = {
        method: 'POST',
        headers: myHeaders,
        body: record,
        redirect: 'follow'
    }


    const response = await fetch(fetch_products, options);
    const myJson = await response.json();

    console.log(myJson);

    // Display products(render HTML: add Id's: product_id -> product_image, product_name ; classes: product_desc->To redirect to product specific page  add-to-cart-btn->To redirect to cart)


    if (myJson.status === 200) {
        let productSpace = document.getElementById('products');
        let tab = "";

        for (var i = 0; i < myJson.payload.length; i++) {
            let item = myJson.payload[i];


            if (item.crdeb_product_description.length > 150) {

                tab += `
                <div class="col-md-4">
                <div class="product-card" id="${item.crdeb_urbanhaven_productsid}">

                    <img src="data:image/jpg;base64,${item.crdeb_product_image}" class="product-desc" id="${item.crdeb_urbanhaven_productsid}">
                    <h4 class="product-desc text-title">${item.crdeb_name}</h4>

                    <span style="opacity:0.7;">${item.crdeb_product_description.slice(0, 150)}</span>
                    <span class="moretext" style="opacity:0.7;">${item.crdeb_product_description.slice(150)}</span>
                    <a class="moreless-button">Read more</a>
                    
                    <div class="card-footer">
                        <span class="text-title">₹${item.crdeb_product_price}</span>
                        <div class="card-button">
                        <svg class="svg-icon add-to-cart-btn" id="${item.crdeb_urbanhaven_productsid}" viewBox="0 0 20 20">
                            <path d="M17.72,5.011H8.026c-0.271,0-0.49,0.219-0.49,0.489c0,0.271,0.219,0.489,0.49,0.489h8.962l-1.979,4.773H6.763L4.935,5.343C4.926,5.316,4.897,5.309,4.884,5.286c-0.011-0.024,0-0.051-0.017-0.074C4.833,5.166,4.025,4.081,2.33,3.908C2.068,3.883,1.822,4.075,1.795,4.344C1.767,4.612,1.962,4.853,2.231,4.88c1.143,0.118,1.703,0.738,1.808,0.866l1.91,5.661c0.066,0.199,0.252,0.333,0.463,0.333h8.924c0.116,0,0.22-0.053,0.308-0.128c0.027-0.023,0.042-0.048,0.063-0.076c0.026-0.034,0.063-0.058,0.08-0.099l2.384-5.75c0.062-0.151,0.046-0.323-0.045-0.458C18.036,5.092,17.883,5.011,17.72,5.011z"></path>
                            <path d="M8.251,12.386c-1.023,0-1.856,0.834-1.856,1.856s0.833,1.853,1.856,1.853c1.021,0,1.853-0.83,1.853-1.853S9.273,12.386,8.251,12.386z M8.251,15.116c-0.484,0-0.877-0.393-0.877-0.874c0-0.484,0.394-0.878,0.877-0.878c0.482,0,0.875,0.394,0.875,0.878C9.126,14.724,8.733,15.116,8.251,15.116z"></path>
                            <path d="M13.972,12.386c-1.022,0-1.855,0.834-1.855,1.856s0.833,1.853,1.855,1.853s1.854-0.83,1.854-1.853S14.994,12.386,13.972,12.386z M13.972,15.116c-0.484,0-0.878-0.393-0.878-0.874c0-0.484,0.394-0.878,0.878-0.878c0.482,0,0.875,0.394,0.875,0.878C14.847,14.724,14.454,15.116,13.972,15.116z"></path>
                        </svg>
                        </div>

                    </div>
                </div>
                </div>`
            } else {

                tab += `
                <div class="col-md-4">
                <div class="product-card" id="${item.crdeb_urbanhaven_productsid}" >
            
                    <img src="data:image/jpg;base64,${item.crdeb_product_image}" class="product-desc" id="${item.crdeb_urbanhaven_productsid}">
                    <h4 class="product-desc mb-2">${item.crdeb_name}</h4>

                    <span style="opacity:0.7;">₹${item.crdeb_product_description}</span>
                    
                    <div class="card-footer">
                        <span class="text-title">₹${item.crdeb_product_price}</span>
                        <div class="card-button">
                        <svg class="svg-icon add-to-cart-btn" id="${item.crdeb_urbanhaven_productsid}" viewBox="0 0 20 20">
                            <path d="M17.72,5.011H8.026c-0.271,0-0.49,0.219-0.49,0.489c0,0.271,0.219,0.489,0.49,0.489h8.962l-1.979,4.773H6.763L4.935,5.343C4.926,5.316,4.897,5.309,4.884,5.286c-0.011-0.024,0-0.051-0.017-0.074C4.833,5.166,4.025,4.081,2.33,3.908C2.068,3.883,1.822,4.075,1.795,4.344C1.767,4.612,1.962,4.853,2.231,4.88c1.143,0.118,1.703,0.738,1.808,0.866l1.91,5.661c0.066,0.199,0.252,0.333,0.463,0.333h8.924c0.116,0,0.22-0.053,0.308-0.128c0.027-0.023,0.042-0.048,0.063-0.076c0.026-0.034,0.063-0.058,0.08-0.099l2.384-5.75c0.062-0.151,0.046-0.323-0.045-0.458C18.036,5.092,17.883,5.011,17.72,5.011z"></path>
                            <path d="M8.251,12.386c-1.023,0-1.856,0.834-1.856,1.856s0.833,1.853,1.856,1.853c1.021,0,1.853-0.83,1.853-1.853S9.273,12.386,8.251,12.386z M8.251,15.116c-0.484,0-0.877-0.393-0.877-0.874c0-0.484,0.394-0.878,0.877-0.878c0.482,0,0.875,0.394,0.875,0.878C9.126,14.724,8.733,15.116,8.251,15.116z"></path>
                            <path d="M13.972,12.386c-1.022,0-1.855,0.834-1.855,1.856s0.833,1.853,1.855,1.853s1.854-0.83,1.854-1.853S14.994,12.386,13.972,12.386z M13.972,15.116c-0.484,0-0.878-0.393-0.878-0.874c0-0.484,0.394-0.878,0.878-0.878c0.482,0,0.875,0.394,0.875,0.878C14.847,14.724,14.454,15.116,13.972,15.116z"></path>
                        </svg>
                        </div>
                    </div>
                
            </div>
            </div>`

            }
        }
        productSpace.innerHTML = tab;

    } else {
        alert("Products of Category not found")
    }

    // Add Read more/Read less functionality(when exceeding 300chars)

    var readMoreLinks = document.querySelectorAll('.moreless-button');

    readMoreLinks.forEach((link) => {
        link.addEventListener('click', (event) => {

            var parent_div = event.target.closest('.product-card');
            var full_description = parent_div.querySelector('.moretext');

            if (link.innerText == "Read more") {
                full_description.style.display = 'inline';
                link.innerText = "Read less";
            } else {
                full_description.style.display = 'none';
                link.innerText = "Read more";
            }

        });
    });

    // Add Routing to product specific pages

    var product_cards = document.querySelectorAll('.product-desc');
    product_cards.forEach((card) => {

        card.addEventListener("click", (event) => {
            const product_id = event.currentTarget.id;
            // console.log(product_id);

            window.location.href = `/Product?username=${encodeURIComponent(username)}&product_id=${encodeURIComponent(product_id)}`;

        });
    })

    // Add Routing to cart(add to cart functionality ONLY{not viewing cart})
    var add_cart = document.querySelectorAll('.add-to-cart-btn');
    add_cart.forEach((cart) => {

        cart.addEventListener('click', (event) => {
            const product_id = event.currentTarget.id;

            // console.log(product_id);
            // console.log(username);

            addTocart(username, product_id);

        })

    });


}

displayProducts();

const add_to_cart_api = "https://prod-12.westus.logic.azure.com:443/workflows/2adc85b44ded4cce8384af1b68e317d5/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=RKdhPeJAft_667G4MTRwsAQaPyicEUheZTeOL60BlKs";

async function addTocart(username, product_id) {
    showLoadingOverlay();

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var record = JSON.stringify({
        username: username,
        product_id: product_id
    });

    const options = {
        method: 'POST',
        headers: myHeaders,
        body: record,
        redirect: 'follow'
    }

    const response = await fetch(add_to_cart_api, options);
    const result = await response.json();
    hideLoadingOverlay();
    if (result.status === 200 || result.status === 300) {
        console.log(result);

    } else {
        alert("Item could not be added to the Cart");
    }

}

// Loading screen
function showLoadingOverlay() {
    let loadingOverlay = document.getElementById("loading-overlay");
    loadingOverlay.style.display = "block";
}

function hideLoadingOverlay() {
    let loadingOverlay = document.getElementById("loading-overlay");
    loadingOverlay.style.display = "none";
}

// Left:
// to do: add link of Product_name also too /Product