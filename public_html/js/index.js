document.addEventListener('DOMContentLoaded', () => {
    const productLink = document.getElementById('product-link');
    highlightLink(productLink);
})

function highlightLink(element) {
    setInterval(() => {
        element.classList.toggle('white'); //Toggle change the class if present, if not it add it.
        element.classList.toggle('black');
    }, 1000);
}

