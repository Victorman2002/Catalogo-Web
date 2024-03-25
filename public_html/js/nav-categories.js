window.addEventListener('DOMContentLoaded', (event) => {

    const btnCollapse = document.getElementById('btn-collapse-categorias');
    const navCatergories = document.getElementById('nav-categorias');

    btnCollapse.addEventListener('click', () => {
        btnCollapse.classList.add('invisible');
        setTimeout(() => {
            navCatergories.classList.remove('show');
            btnCollapse.classList.remove('invisible');
            
        }, 6000);
    });

    function toggleCollapse() {
        const navCategories = document.getElementById('nav-categorias');
        if (window.innerWidth < 1116) {
            navCategories.classList.remove('show');
        } else {    
            navCategories.classList.add('show');
        }
    }

    window.addEventListener('resize', () => {
        toggleCollapse();
    });

    toggleCollapse();


});