window.addEventListener('DOMContentLoaded', (event) => {

    const btnCollapse = document.getElementById('btn-collapse-categorias');
    const navCatergories = document.getElementById('nav-categorias');

    //Al hacer click sobre el boton se esconde 6seg, el nav se muestra ese mismo tiempo y al terminar dicho tiempo se esconde el nav y se vuelve a mostrar el boton de categorias
    btnCollapse.addEventListener('click', () => {
        btnCollapse.classList.add('invisible');
        setTimeout(() => {
            navCatergories.classList.remove('show');
            btnCollapse.classList.remove('invisible');

        }, 5000);
    });

    //Cuando la pantalla se hace pequeña el nav de las categorias se esconde ya que es muy ancho y en su lugar se muestra el boton de categorias que le sustituye
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

