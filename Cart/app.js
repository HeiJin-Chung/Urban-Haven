// Getting Url Param(username)

const queryString=window.location.search;
const urlParams=new URLSearchParams(queryString);
const username=urlParams.get('username');

console.log(username);

// Routing
const logo=document.getElementById('logo');
const profile=document.getElementById('profile');
const cart=document.getElementById('cart');

profile.addEventListener('click',()=>{
    window.location.href=`/MyProfile?username=${encodeURIComponent(username)}`;
});

cart.addEventListener('click',()=>{
    window.location.href=`/Cart?username=${encodeURIComponent(username)}`;
});


logo.addEventListener('click',()=>{
    window.location.href=`/home?username=${encodeURIComponent(username)}`;
});

// Redirect to product catalog
let catalog=document.querySelectorAll('.product-catalog');

catalog.forEach((interest)=>{
    interest.addEventListener('click',()=>{
        window.location.href=`/Catalog?username=${encodeURIComponent(username)}`;
    })
})

const fetch_cart="https://prod-82.westus.logic.azure.com:443/workflows/6359e1bd8e9443f18b3439590926aa46/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=p6qJkrb4tRO6S3FOofIk4N_oxikYFXdc57RZn_5WMcE";

const fetch_product="https://prod-32.westus.logic.azure.com:443/workflows/ad9194b23e7047df847dfb854ca673ef/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=x-PVrIgr7aLvfV1WZwq5IhS5NDwzTAP-86i7hgsXdq0";

var totalPrice=0;

async function displayCart(){
    showLoadingOverlay();

    var myHeaders=new Headers();
    myHeaders.append("Content-Type","application/json");

    var record=JSON.stringify({
        username:username
    })

    const options={
        method:'POST',
        headers:myHeaders,
        body:record,
        redirect:'follow'
    }

    const response=await fetch(fetch_cart,options);
    const result=await response.json();
    
    if(result.status===200){
        console.log(result);
        
        let cart_items=result.payload;
        // console.log(result.payload[0].cart_items);
        // console.log(result.payload[0].quantity);
        
        displayProducts(cart_items);
        hideLoadingOverlay();
        

    }else{
        hideLoadingOverlay();
        // Empty Cart Rendering

        let tab=`
            <div class="empty-cart-container">
                <img id="empty-cart-image" src="empty-cart.png" alt="Empty Cart">
                <h1 class="empty-cart-message">Your cart is empty</h1>
                <p class="empty-cart-action" id="explore">Looks like you have not added anything to you cart. Go ahead & explore top categories</p>
            </div>
        `
        document.getElementById('products').innerHTML=tab;

        document.getElementById('explore').addEventListener('click',()=>{
            window.location.href=`/Catalog?username=${encodeURIComponent(username)}&category=TechWonders`;
        })

    }


}

async function displayProducts(cart_items){
    let tab=`
        <h2 class="mb-4">Shopping Cart 🛒</h2>
        <div class="column">`;
        
        
    // call fetch_product API for each product
    
    // console.log(cart_items.length);
    for(let i=0;i<cart_items.length;i++){
        let product_id=cart_items[i].product_id;
        let quantity=cart_items[i].quantity;
        
        var myHeaders=new Headers();
        myHeaders.append("Content-Type","application/json");
    
        var record=JSON.stringify({
            product_id:product_id
        });
    
        const options={
            method:'POST',
            headers:myHeaders,
            body:record,
            redirect:'follow'
        }

        const response=await fetch(fetch_product,options);

        if(response.status===200){
        
            const result=await response.json();
            
            let item=result.payload[0];
            console.log(item.crdeb_name);
        
            tab+=`
                <div class="product-card row">

                    <img src="data:image/jpg;base64,${item.crdeb_product_image}" class="product-desc col-3" id="${item.crdeb_urbanhaven_productsid}" alt="Product ${i}">
                    
                    <div class="column p-4 col">
                        <h4 class="product-desc" id="${item.crdeb_urbanhaven_productsid}">${item.crdeb_name}</h4>

                        <h6>Quantity: </h6>
                        <div class="quantity-control">
                            <button class="quantity-btn decrement" id="${item.crdeb_urbanhaven_productsid}">
                                <svg viewBox="0 0 409.6 409.6">
                                    <path d="M204.8,392.533C204.8,401.959,197.159,409.6,187.733,409.6S170.667,401.959,170.667,392.533V17.067C170.667,7.641,178.308,0,187.733,0s17.067,7.641,17.067,17.067v375.467z" />
                                </svg>
                            </button>

                            <input type="number" class="quantity-input" value="${quantity}" step="1" min="1" max="10" name="quantity">

                            <button class="quantity-btn increment" id="${item.crdeb_urbanhaven_productsid}">
                                <svg viewBox="0 0 426.66667 426.66667">
                                    <path d="m405.332031 192h-170.664062v-170.667969c0-11.773437-9.558594-21.332031-21.335938-21.332031-11.773437 0-21.332031 9.558594-21.332031 21.332031v170.667969h-170.667969c-11.773437 0-21.332031 9.558594-21.332031 21.332031 0 11.777344 9.558594 21.335938 21.332031 21.335938h170.667969v170.664062c0 11.777344 9.558594 21.335938 21.332031 21.335938 11.777344 0 21.335938-9.558594 21.335938-21.335938v-170.664062h170.664062c11.777344 0 21.335938-9.558594 21.335938-21.335938 0-11.773437-9.558594-21.332031-21.335938-21.332031zm0 0" />
                                </svg>
                            </button>

                        </div>



                        <p class="text-primary">₹${item.crdeb_product_price}</p>
                        <a href="#">In stock</a>
                        <em style="display:block; opacity: 0.7;">Eligible for free shipping</em>

                        <button class="btn btn-danger delete-cart-btn mt-3" id="${item.crdeb_urbanhaven_productsid}">Delete</button>
                    </div>
                
                </div>`;
                
                // totalPrice+=item.crdeb_product_price;
                totalPrice+=item.crdeb_product_price*quantity;
        }else{
            alert("Product not found");
        }
    }

    tab+=`
            </div>

            <!-- Cart Summary -->
            <div class="container cart-summary mt-5">
                <h4>Cart Summary</h4>
                <p>Subtotal (${cart_items.length} items) : ₹${totalPrice}</p>
                <p class="text-success">✅Your order is Eligible for free shipping</p>


                <button class="btn btn-success checkout-btn">Proceed to buy</button>
            </div>
        `

    // console.log(totalPrice);
    document.getElementById('products').innerHTML=tab;

    totalPrice=0;

    // Add Routing of Product in Cart to Product Specific page
    var product_cards=document.querySelectorAll('.product-desc');
    product_cards.forEach((card)=>{

        card.addEventListener("click",(event)=>{
            const product_id=event.currentTarget.id;
            // console.log(product_id);

            window.location.href=`/Product?username=${encodeURIComponent(username)}&product_id=${encodeURIComponent(product_id)}`;

        });
    })

    // Delete product from Cart functionality(only 1 item at time) {also reloading cart})
    var delete_cart=document.querySelectorAll('.delete-cart-btn');

    delete_cart.forEach((cart)=>{

        cart.addEventListener('click',(event)=>{
            const product_id=event.currentTarget.id;
            // console.log(product_id);
            // console.log(username);
            
            deleteCart(username,product_id);
            
        })  
    });

    var addProduct=document.querySelectorAll('.increment');

    addProduct.forEach((product)=>{
        product.addEventListener('click',(event)=>{
            // var parent_div=event.target.closest('.product-desc');
            const product_id=event.currentTarget.id;
            console.log(product_id);

            addTocart(username,product_id);

        })

    });

    var remProduct=document.querySelectorAll('.decrement');

    remProduct.forEach((product)=>{
        product.addEventListener('click',(event)=>{
            const product_id=event.currentTarget.id;
            console.log(product_id);

            deleteCart(username,product_id);
        })

    });

}

const add_to_cart_api="https://prod-12.westus.logic.azure.com:443/workflows/2adc85b44ded4cce8384af1b68e317d5/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=RKdhPeJAft_667G4MTRwsAQaPyicEUheZTeOL60BlKs";

const delete_cart_api="https://prod-92.westus.logic.azure.com:443/workflows/99b6683327894707a5920108cdbd3cec/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=iaTPuqjWKQJ4CEZEufN1nttBr9QLFa-HMIJADbfmYmo";

async function addTocart(username,product_id){
    showLoadingOverlay();

    var myHeaders=new Headers();
    myHeaders.append("Content-Type","application/json");

    var record=JSON.stringify({
        username:username,
        product_id:product_id
    });

    const options={
        method:'POST',
        headers:myHeaders,
        body:record,
        redirect:'follow'
    }

    const response=await fetch(add_to_cart_api,options);
    const result=await response.json();
    hideLoadingOverlay();
    if(result.status===200 || result.status===300){
        console.log(result);
        displayCart();


    }else{
        alert("Item could not be added to the Cart");
    }

}

async function deleteCart(username,product_id){
    showLoadingOverlay();

    var myHeaders=new Headers();
    myHeaders.append("Content-Type","application/json");

    var record=JSON.stringify({
        username:username,
        product_id:product_id
    });

    const options={
        method:'POST',
        headers:myHeaders,
        body:record,
        redirect:'follow'
    }

    const response=await fetch(delete_cart_api,options);
    const result=await response.json();
    hideLoadingOverlay();
    if(result.status===200){
        
        console.log(result);
        displayCart();

    }else{
        alert("Item could not be removed from the Cart");
    }

}


displayCart();


// Loading screen
function showLoadingOverlay() {
    let loadingOverlay = document.getElementById("loading-overlay");
    loadingOverlay.style.display = "block";
}

function hideLoadingOverlay() {
    let loadingOverlay = document.getElementById("loading-overlay");
    loadingOverlay.style.display = "none";
}