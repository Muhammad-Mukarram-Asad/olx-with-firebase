// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.11.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.11.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.11.0/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDIb5zkK2Kpi0CaWkJkAhPf5P7nmntQOts",
  authDomain: "olx-authentication.firebaseapp.com",
  projectId: "olx-authentication",
  storageBucket: "olx-authentication.appspot.com",
  messagingSenderId: "803883668867",
  appId: "1:803883668867:web:687226ffbefb1ea6e9d2b6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function signInFirebase(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

async function signUpFirebase(userInfo) {
  const { email, password } = userInfo;
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  await addUserToDb(userInfo, userCredential.user.uid);
}

function addUserToDb(userInfo, uid) {
  const { email, name, age } = userInfo;
  return setDoc(doc(db, "users", uid), { email, name, age });
}

window.signUp = function () {
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let age = document.getElementById("age").value;

  try {
    signUpFirebase({ email, password, name, age });
    {
      alert("The user is registered successfully.");
    }
  } catch (e) {
    const error_msg = document.getElementById("error");
    error_msg.innerHTML = e.message;
  }
};

function postAdToDb(title, price, description) {
  const userId = auth.currentUser.uid;
  return addDoc(collection(db, "ads"), { title, price, description, userId });
}

// Open ad details form.
window.openForm = function () {
  var form_div = document.getElementById("Ad_details");
  form_div.style.display = "block";
};

// Open ad details form.
window.hide_form = function () {
  var form_div = document.getElementById("Ad_details");
  form_div.style.display = "none";
};

var user_ads = [];

function user_data(img, title, price, des) {
  (this.img = img),
    (this.title = title),
    (this.price = price),
    (this.des = des);
}
var target_div = document.getElementById("user_sec5_box");

window.show_Ad = function () {
  var title_input = document.getElementById("title");
  var price_input = document.getElementById("price");
  var des_input = document.getElementById("description");
  var imgTag = document.getElementById("preview");

  try {
    postAdToDb(title_input.value, price_input.value, des_input.value);
    {
      alert("Post is live now and also stored in database...");
    }
  } catch (e) {
    alert("An error occurred --> " + e.message);
  }

  var user1 = new user_data(
    imgTag,
    title_input.value,
    price_input.value,
    des_input.value
  );
  user_ads.push(user1);
  console.log(user_ads);

  target_div.innerHTML += `
    <div id="inserted_div">
    
    <div id="info_div">
        <h1>Product Image: </h1> 
        <img id="prod_img" src="${imgTag.src}">
        <h1>Product Title: </h1> <br> <p>${title_input.value}</p>
        <h1>Product Price: </h1> <br> <p> ${price_input.value}</p>
        <h1>Product Description: <br> </h1> <p>${des_input.value}</p>
    </div>
     </div>`;

  imgTag.setAttribute("src", "");
  title_input.value = "";
  price_input.value = "";
  des_input.value = "";
};

// uploading image function --> self-made f(n).

window.getImage = function () {
  let img_element = document.getElementById("file").files[0];
  let reader = new FileReader();
  reader.addEventListener(
    "load",
    function () // or you may use arrow function like this:()=>
    {
      let imgTag = document.getElementById("preview");
      imgTag.src = reader.result;
    }
  );
  reader.readAsDataURL(img_element);
};

// Open login form function --> self-made f(n).
window.open_login = function () {
  let login_container = document.getElementById("login_form");
  login_container.style.display = "block";
};

// close login form function --> self-made f(n).
window.remove_login = function () {
  let login_container = document.getElementById("login_form");
  login_container.style.display = "none";
};

// Firebase Method for reading data from database.

var ads_list = [];
const querySnapshot = await getDocs(collection(db, "ads"));
querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  // console.log(doc.id, " => ", doc.data());
  ads_list.push(doc.data());
});
console.log(ads_list);

window.fetchAds = function() {
  var sec6 = document.getElementById("sec-6");
  sec6.style.display = "block";

  // Targeting div from HTML:
  var sec6_box = document.getElementById("sec-6-box");

  // creating div with JS:
  let card_full = document.createElement("div");
  card_full.setAttribute("id", "inserted_div_sec6");

  // ---------------------------------------------------------//
  for (var i = 0; i < ads_list.length; i++) {
    // console.log(`${i + 1} user Ids --> ${ads_list[i].userId}`);

    let card_inner_full = document.createElement("div");
    card_inner_full.setAttribute("id", "info_div_sec6");

    let prod_image_heading = document.createElement("h1");
    prod_image_heading.setAttribute("id", "prod_img_heading");
    prod_image_heading.innerHTML = "Ad Details:";

    let prod_image_id = document.createElement("h2");
    let id_label = document.createElement('label');
    id_label.setAttribute('class','sec6_labels');
    id_label.innerHTML = "Ad Database Id:"
    prod_image_id.setAttribute("id", "prod_info_heading");
    prod_image_id.innerHTML = ads_list[i].userId;

    let prod_image_title = document.createElement("h2");
    let title_label = document.createElement('label');
    title_label.setAttribute('class','sec6_labels');
    title_label.innerHTML = "Title:"
    prod_image_title.setAttribute("id", "prod_info_heading");
    prod_image_title.innerHTML = ads_list[i].title;

    let prod_image_price = document.createElement("h2");
    let price_label = document.createElement('label');
    price_label.setAttribute('class','sec6_labels');
    price_label.innerHTML = "Price:"
    prod_image_price.setAttribute("id", "prod_info_heading");
    prod_image_price.innerHTML = ads_list[i].price;

    let prod_image_description = document.createElement("h2");
    let des_label = document.createElement('label');
    des_label.setAttribute('class','sec6_labels');
    des_label.innerHTML = "Description:"
    prod_image_description.setAttribute("id", "prod_info_heading");
    prod_image_description.innerHTML = ads_list[i].description;

    card_inner_full.appendChild(prod_image_heading);
    card_inner_full.appendChild(prod_image_id);
    card_inner_full.appendChild(prod_image_title);
    card_inner_full.appendChild(prod_image_price);
    card_inner_full.appendChild(prod_image_description);

    card_full.appendChild(card_inner_full);
    sec6_box.append(card_full);
  }
}

// read data from firestore database:

/*
import { collection, getDocs } from "firebase/firestore"; 

const querySnapshot = await getDocs(collection(db, "users"));
querySnapshot.forEach((doc) => {
  console.log(`${doc.id} => ${doc.data()}`);
});
*/
