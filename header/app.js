// Access username from URL
const queryString=window.location.search;
const urlParams=new URLSearchParams(queryString);
const username=urlParams.get('username');
console.log(username);


// Redirect to product catalog
let catalog=document.querySelectorAll('.product_catalog');

catalog.forEach((interest)=>{
    interest.addEventListener('click',(event)=>{
        let category=event.currentTarget.id;
        console.log(category);
        window.location.href=`/Catalog?username=${encodeURIComponent(username)}&category=${category}`;
    })
});

// Redirect to User Profile
let profile=document.getElementById('profile');
profile.addEventListener('click',()=>{
    window.location.href=`/MyProfile?username=${encodeURIComponent(username)}`;
})

// Redirect to User Cart
let bag=document.getElementById('cart');
bag.addEventListener('click',()=>{
    window.location.href=`/Cart?username=${encodeURIComponent(username)}`;
})

