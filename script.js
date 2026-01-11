let products = [];

async function index() {
   try {
    const response = await fetch("http://localhost:5000/product/getProducts");
    // console.log(response)
    const data = await response.json();

    if (!data.status || data.products.length === 0) {
      console.log("No products found");
      return;
    }

    const productBody = document.getElementById("productBody");
    productBody.innerHTML = "";

    data.products.forEach(product => {
      productBody.innerHTML += `
        <div class="products">
          <img src="${product.image}" class="img" />
          <div class="productText">
            <p><strong>Name:</strong> ${product.name}</p>
            <p><strong>Price:</strong> ₦${product.price}</p>
            <p><strong>In Stock:</strong> ${product.quantity}</p>

            <div class="productButton">
              <button onclick='addToCart(${JSON.stringify(product)})'>
                Add To Cart
              </button>
              <button onclick="viewDetails('${product._id}')">
                Details
              </button>
            </div>
          </div>
        </div>
      `;
    });

  } catch (error) {
    console.error("Error fetching products:", error);
  }
}
index();

async function register() {
  const name = document.getElementById("regName").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  if (!name || !email || !password) {
    alert("Please fill all fields");
    return;
  }
  try {
    const response = await fetch("http://localhost:5000/user/signUp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    if (data.status) {
      alert("Registration Successful");
      window.location.href = "/frontend/login.html";
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.log(error);
    alert("Something went wrong");
  }
}

async function login() {
  const email = document.getElementById("logEmail").value;
  const password = document.getElementById("logPassword").value;

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }
  try {
    const response = await fetch("http://localhost:5000/user/signIn", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log(data)
    if (data.status) {
      alert("Login Successful");
      localStorage.userId = data.user_Id;
      window.location.href = "/frontend/index.html";
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.log(error);
    alert("Something went wrong");
  }
}

async function addProduct() {
  const name = document.getElementById("prodName").value;
  const price = document.getElementById("prodPrice").value;
  const quantity = document.getElementById("prodQuantity").value;
  const description = document.getElementById("prodDescription").value;
  const imageFile = document.getElementById("prodImage").files[0];

  if (!name || !price || !quantity || !description || !imageFile ) {
    console.alert("Input all fields");
  }

  const formData = new FormData();
  formData.append("name", name);
  formData.append("price", price);
  formData.append("quantity", quantity);
  formData.append("description", description);
  formData.append("image", imageFile);

  try {
    const response = await fetch("http://localhost:5000/product/addProduct", {
      method: "POST",   
      body:formData,
    });

    const data = await response.json();

    if (data.status) {
      alert("Product Added Successfully");
      window.location.href = "/frontend/product.html";
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.log(error);
    alert("Something went wrong");
  }
}

async function getProducts() {
  try {
    const response = await fetch("http://localhost:5000/product/getProducts");
    // console.log(response)
    const data = await response.json();

    if (!data.status || data.products.length === 0) {
      console.log("No products found");
      return;
    }

    const productBody = document.getElementById("productBody");
    productBody.innerHTML = "";

    data.products.forEach(product => {
      productBody.innerHTML += `
        <div class="products">
          <img src="${product.image}" class="img" />
          <div class="productText">
            <p><strong>Name:</strong> ${product.name}</p>
            <p><strong>Price:</strong> ₦${product.price}</p>
            <p><strong>In Stock:</strong> ${product.quantity}</p>

            <div class="productButton">
              <button onclick='addToCart(${JSON.stringify(product)})'>
                Add To Cart
              </button>
              <button onclick="viewDetails('${product._id}')">
                Details
              </button>
            </div>
          </div>
        </div>
      `;
    });

  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

getProducts();

let cart = [];

async function addToCart(product) {

  let cart = JSON.parse(localStorage.getItem("Cart")) || [];

  const existingProduct = cart.find(item =>item._id === product._id)
  if(existingProduct)
  {
    existingProduct.quantity +=1
  }
  else{
    product.quantity = 1;
    cart.push(product)
  }

  localStorage.setItem("Cart", JSON.stringify(cart));
  alert("Product added to cart")
}

function getCart() {
  let cart = JSON.parse(localStorage.getItem("Cart"));

  if (!cart || cart.length === 0) {
    alert("Cart is Empty");
    return;
  }

  const tableBody = document.getElementById("cartTableBody");
  tableBody.innerHTML = "";

  let totalPrice = 0;

  cart.forEach(product => {
    totalPrice += product.price * product.quantity;

    tableBody.innerHTML += `
      <tr>
        <td><img src="${product.image}" class="cartImg" /></td>
        <td>${product.name}</td>
        <td>${product.quantity}</td>
        <td>₦${product.price * product.quantity}</td>
      </tr>
    `;
  });

  document.getElementById("totalPrice").innerText = `₦${totalPrice}`;
  console.log("Total Price:", totalPrice);
}


async function addOrder() {
  let cart = JSON.parse(localStorage.getItem("Cart"));
  let userId = localStorage.getItem("userId");
  if (!cart || !userId) {
    alert("Cart Empty or No user Id added");
  }
  try {
    let response = await fetch("http://localhost:5000/order/addOrder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, cart }),
    });
     const data = await response.json();

    if (data.status) {
      alert("Order placed successfully");

      // Clear cart after order
      localStorage.removeItem("cart");

      // Redirect (optional)
      window.location.href = "/frontend/index.html";
    } else {
      alert(data.message || "Failed to place order");
    }
  } catch (error) {}
}

function goToAddProduct() 
{
  window.location.href = "/frontend/addProduct.html"
}