// DECLARING VARIABLES
var PRODUCT_OBJECT;
const PRODUCT_ID = localStorage.getItem("productId");
const PRODUCT_URL = PRODUCT_INFO_URL + PRODUCT_ID + EXT_TYPE;
const COMMENTS_URL = PRODUCT_INFO_COMMENTS_URL + PRODUCT_ID + EXT_TYPE;

const PRODUCT_NAME_ELEM = document.getElementById("product-name");
const PRODUCT_IMAGES_CONTAINER_ELEM = document.getElementById(
  "product-images-container"
);
const PRODUCT_CURRENCY_ELEM = document.getElementById("product-currency");
const PRODUCT_COST_ELEM = document.getElementById("product-cost");
const PRODUCT_DESCRIPTION_ELEM = document.getElementById("product-description");
const COMMENT_INPUT_BUTTON_ELEM = document.getElementById("comment-button");
const COMMENT_INPUT_TEXT_ELEM = document.getElementById("comment-input");
const RELATED_PRODUCTS_CONTAINER_ELEM = document.getElementById(
  "related-products-container"
);
const COMMENT_INPUT_STARS_ELEMS =
  document.getElementsByClassName("comment-input-star");
const COMMENTS_CONTAINER_ELEM = document.getElementById("comments-container");
const COMMENT_INPUT_FORM_ELEM = document.getElementById("comment-input");
const MAIN_IMAGE_ELEM = document.getElementById("main-image");
const CAROUSEL_IMAGE_CONTAINER =
  document.getElementsByClassName("carousel-inner")[0];
const CART_BUTTON_ELEM = document.getElementById("cart-button");

//DEFINING FUNCTIONS
function insertProductData() {
  // Text data
  PRODUCT_NAME_ELEM.innerText = PRODUCT_OBJECT.name;
  PRODUCT_DESCRIPTION_ELEM.innerText = PRODUCT_OBJECT.description;
  PRODUCT_CURRENCY_ELEM.innerText = PRODUCT_OBJECT.currency;
  PRODUCT_COST_ELEM.innerText = PRODUCT_OBJECT.cost;

  // Images
  for (let i = 0; i < PRODUCT_OBJECT.images.length; i++) {
    let carouselItemElem = document.createElement("div");
    carouselItemElem.classList.add("carousel-item");
    if (i == 0) {
      carouselItemElem.classList.add("active");
    }

    let productImageElem = document.createElement("img");
    productImageElem.classList.add("product-image");
    productImageElem.classList.add("d-block");
    productImageElem.classList.add("w-100");
    productImageElem.setAttribute("alt", `${i + 1}`);
    productImageElem.src = PRODUCT_OBJECT.images[i];

    carouselItemElem.appendChild(productImageElem);
    CAROUSEL_IMAGE_CONTAINER.appendChild(carouselItemElem);
  }
}

function insertRelatedProducts() {
  // Modifying the DOM by using the document object methods
  for (const relatedProduct of PRODUCT_OBJECT.relatedProducts) {
    let containerElem = document.createElement("div");
    let nameContainerElem = document.createElement("div");
    let nameElem = document.createElement("p");
    let imageElem = document.createElement("img");

    containerElem.classList.add("related-product");
    nameContainerElem.classList.add("realted-product-name-container");
    nameElem.classList.add("related-product-name");
    imageElem.classList.add("related-product-image");
    containerElem.setAttribute("id", relatedProduct.id);

    nameElem.innerText = relatedProduct.name;
    imageElem.src = relatedProduct.image;

    nameContainerElem.appendChild(nameElem);
    containerElem.appendChild(nameContainerElem);
    containerElem.appendChild(imageElem);

    RELATED_PRODUCTS_CONTAINER_ELEM.appendChild(containerElem);
  }
}

function insertCommmentsFromAPI() {
  // Modifying the DOM by using the document object methods
  fetch(COMMENTS_URL)
    .then((response) => response.json())
    .then((commentsObjectsArray) => {
      for (const commentObject of commentsObjectsArray) {
        COMMENTS_CONTAINER_ELEM.appendChild(
          generateCommentElem(
            commentObject.description,
            commentObject.score,
            formatDate(commentObject.dateTime)
          )
        );
      }
    });
}

function formatDate(date) {
  let datePart = date.match(/\d+/g),
    year = datePart[0].substring(2),
    month = datePart[1],
    day = datePart[2];

  return day + "/" + month + "/" + year; // dd/mm/yy
}

function generateCommentElem(commentText, commmentScore, commentaDate) {
  let commentElem = document.createElement("div");
  let commentTextElem = document.createElement("p");
  let commentDateElem = document.createElement("p");
  let commentScoreElem = document.createElement("div");
  let commentSeparatorElem = document.createElement("hr");

  commentElem.classList.add("comment");
  commentTextElem.classList.add("comment-text");
  commentDateElem.classList.add("comment-date");
  commentScoreElem.classList.add = "comment-score";
  for (let i = 1; i <= 5; i++) {
    let starIcon = document.createElement("span");
    starIcon.classList.add("fa");
    starIcon.classList.add("fa-star");
    starIcon.classList.add("comment-score");
    if (i <= commmentScore) {
      starIcon.classList.add("checked");
    }

    commentTextElem.innerText = commentText;
    commentDateElem.innerText = commentaDate;

    commentScoreElem.appendChild(starIcon);

    commentElem.appendChild(commentDateElem);
    commentElem.appendChild(commentScoreElem);
    commentElem.appendChild(commentTextElem);
    commentElem.appendChild(commentSeparatorElem);
  }
  return commentElem;
}

function addCommentInputStarsHoverAnimation() {
  // Adding event listener to each star
  for (let i = 0; i < COMMENT_INPUT_STARS_ELEMS.length; i++) {
    COMMENT_INPUT_STARS_ELEMS[i].addEventListener("mouseover", () => {
      // Uncheking all the stars (reset)
      for (const star of COMMENT_INPUT_STARS_ELEMS) {
        star.classList.remove("checked");
      }

      // Checking all the stars up to the selected one
      for (let j = 0; j <= i; j++) {
        COMMENT_INPUT_STARS_ELEMS[j].classList.add("checked");
      }
    });
  }
}

function setMainImage(img_src_str) {
  MAIN_IMAGE_ELEM.src = img_src_str;
}

function getTodayDateFormated() {
  const today = new Date();
  const yyyy = today.getFullYear().toString().slice(2, 4);
  let mm = today.getMonth() + 1; // Months start at 0.
  let dd = today.getDate();

  if (dd < 10) {
    dd = "0" + dd;
  }

  if (mm < 10) {
    mm = "0" + mm;
  }

  const formattedToday = dd + "/" + mm + "/" + yyyy;

  return formattedToday;
}

function addEventListenersToRelatedProducts() {
  let relatedProductsElems = document.getElementsByClassName("related-product");
  for (const relatedProduct of relatedProductsElems) {
    relatedProduct.addEventListener("click", () => {
      localStorage.setItem("productId", relatedProduct.id);
      window.location.href = "product-info.html";
    });
  }
}

function addProductToCart() {
  let cartProductsArray = getCartProductObjects();

  // Checking if the product isn't already in the cart
  for (const cartProduct of cartProductsArray) {
    if (cartProduct.id == PRODUCT_OBJECT.id) {
      return;
    }
  }

  // Adding the product to the cart
  let newCartProduct = {
    id: PRODUCT_OBJECT.id,
    name: PRODUCT_OBJECT.name,
    count: 1,
    unitCost: PRODUCT_OBJECT.cost,
    currency: PRODUCT_OBJECT.currency,
    image: PRODUCT_OBJECT.images[0],
  };
  cartProductsArray.push(newCartProduct);
  localStorage.setItem("cartProducts", JSON.stringify(cartProductsArray));
}

function removeProductFromCart() {
  let cartProductsArray = getCartProductObjects();
  let cartArrayWithoutProduct = cartProductsArray.filter(
    (cartProduct) => cartProduct.id != PRODUCT_ID
  );
  localStorage.setItem("cartProducts", JSON.stringify(cartArrayWithoutProduct));
}

function getCartProductObjects() {
  return JSON.parse(localStorage.getItem("cartProducts"));
}

function toggleCartButtonStatus() {
  if (isProductInCart()) {
    CART_BUTTON_ELEM.innerText = "Está en tu el carrito";
    CART_BUTTON_ELEM.classList.remove("btn-primary");
    CART_BUTTON_ELEM.classList.add("btn-success");
  } else {
    CART_BUTTON_ELEM.innerText = "Agregar al carrito";
    CART_BUTTON_ELEM.classList.remove("btn-success");
    CART_BUTTON_ELEM.classList.add("btn-primary");
  }
}

function isProductInCart() {
  let cartProductsArray = getCartProductObjects();
  for (const cartProduct of cartProductsArray) {
    if (cartProduct.id == parseInt(PRODUCT_ID)) {
      return true;
    }
  }
  return false;
}

// ADDING EVENT LISTENERS
COMMENT_INPUT_BUTTON_ELEM.addEventListener("click", (event) => {
  event.preventDefault();
  let commentInputStarsArray = Array.from(COMMENT_INPUT_STARS_ELEMS);
  let commentInputStarsChecked = commentInputStarsArray.filter((star) =>
    star.classList.contains("checked")
  );
  let commentText = COMMENT_INPUT_TEXT_ELEM.value;
  let commentScore = commentInputStarsChecked.length;
  let commentDate = getTodayDateFormated();
  let commentElement = generateCommentElem(
    commentText,
    commentScore,
    commentDate
  );
  COMMENTS_CONTAINER_ELEM.insertBefore(
    commentElement,
    COMMENTS_CONTAINER_ELEM.firstChild
  );
});

CART_BUTTON_ELEM.addEventListener("click", () => {
  if (!isProductInCart()) {
    addProductToCart();
  } else {
    removeProductFromCart();
  }
  toggleCartButtonStatus();
});

// ON DOM LOADED
document.addEventListener("DOMContentLoaded", () => {
  insertNavbar();
  getJSONData(PRODUCT_URL).then((response) => {
    PRODUCT_OBJECT = response.data;
    insertProductData();
    insertRelatedProducts();
    insertCommmentsFromAPI();
    addCommentInputStarsHoverAnimation();
    addEventListenersToRelatedProducts();
    toggleCartButtonStatus();
  });
});
