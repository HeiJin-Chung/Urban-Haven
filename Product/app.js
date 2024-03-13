// Getting Url Param(username)

const queryString=window.location.search;
const urlParams=new URLSearchParams(queryString);
const username=urlParams.get('username');
const product_id=urlParams.get('product_id');

console.log(username);

// Routing
const logo=document.getElementById('logo');
const profile=document.getElementById('profile');
const cart=document.getElementById('cart');

profile.addEventListener('click',()=>{
    window.location.href=`/MyProfile?username=${encodeURIComponent(username)}`;
});

cart.addEventListener('click',()=>{
    // window.location.href=`/Cart?username=${encodeURIComponent(username)}`;
    window.location.href=`/Cart?username=${encodeURIComponent(username)}`;
});

logo.addEventListener('click',()=>{
    window.location.href=`/home?username=${encodeURIComponent(username)}`;
});

// Fetch Product details
const fetch_product="https://prod-32.westus.logic.azure.com:443/workflows/ad9194b23e7047df847dfb854ca673ef/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=x-PVrIgr7aLvfV1WZwq5IhS5NDwzTAP-86i7hgsXdq0";

async function displayProduct(){

    // call fetch_product API for each product
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
        const result=await response.json();
        
        if(result.status===200){
            let item=result.payload[0];
            console.log(item);
        
            let tab=`
                <div class="product-card row p-4 mb-3">
                    <div id="product_image">
                    <img src="data:image/jpg;base64,${item.crdeb_product_image}" id="${item.crdeb_urbanhaven_productsid} alt="Product Image">
                    </div>

                    <div class="column ml-5">

                        <h2>${item.crdeb_name}</h2>

                        <p class="text-primary">₹${item.crdeb_product_price}</p>
                        <p class="product-desc">${item.crdeb_product_description} Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad explicabo accusantium cumque corporis unde, nostrum aperiam nemo fugit debitis id blanditiis architecto perspiciatis exercitationem aspernatur a, placeat dicta. Facilis, dolorum. </p>

                        <a href="#">In stock</a>
                        <p style="opacity: 0.7;">Eligible for free shipping</p>

                        <button class="btn btn-primary add-to-cart-btn mt-3">Add to Cart</button>

                    </div>

                </div>    
            `;
            
            document.getElementById('product').innerHTML=tab;
        }else{
            alert("Product not found");
        }


    // Add Routing to cart(add to cart functionality ONLY{not viewing cart})
    var add_cart=document.querySelectorAll('.add-to-cart-btn');
    add_cart.forEach((cart)=>{

        cart.addEventListener('click',(event)=>{
            const product_id=event.currentTarget.id;
            
            console.log(product_id);
            // console.log(username);
            
            addTocart(username,product_id);
            
        })
        
    });


}

displayProduct();

const add_to_cart_api="https://prod-12.westus.logic.azure.com:443/workflows/2adc85b44ded4cce8384af1b68e317d5/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=RKdhPeJAft_667G4MTRwsAQaPyicEUheZTeOL60BlKs";

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

    }else{
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
