const criptomonedasSelect= document.querySelector('#criptomonedas');
const monedaSelect= document.querySelector('#moneda');

const formulario = document.querySelector('#formulario');
const resultado =document.querySelector('#resultado')

const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}

//Crear un Promise
const obtenerCriptomonedas = criptomonedas => new Promise(resolve =>{
    resolve(criptomonedas);

});

document.addEventListener('DOMContentLoaded', () =>{
    consultarCriptomonedas();
    formulario.addEventListener('submit', submitFormulario);
    criptomonedasSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor)
});

async function consultarCriptomonedas(){
    const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`;
        try {
            const respuesta = await fetch(url)
            const resultado = await respuesta.json()
            const criptomonedas = await obtenerCriptomonedas(resultado.Data)
            selectCriptomonedas(criptomonedas)
        } catch (error) {
            console.log(error)
        }
}

function selectCriptomonedas(criptomonedas){

    criptomonedas.forEach ( cripto =>{
        const{ FullName , Name} = cripto.CoinInfo;
        const option = document.createElement('OPTION');
        
        option.value= Name;
        option.textContent= FullName;

        criptomonedasSelect.appendChild(option);
    })
}

function leerValor(e){
    objBusqueda[e.target.name] = e.target.value;
}

function submitFormulario(e){
    e.preventDefault();
    
    const {moneda, criptomoneda } = objBusqueda;

    if(moneda === '' || criptomoneda === ''){
        mostrarAlerta("Ambos campos son obligatorios");
        return;
    }

    //Consultar API con la busqueda
    consultarAPI(objBusqueda);
}

function mostrarAlerta(msg){
    const error = document.querySelector('.error');

    if(!error){
        const divMensaje =document.createElement('DIV');
        divMensaje.classList.add('error');
        divMensaje.textContent = msg;
    
        formulario.appendChild(divMensaje);

        setTimeout(() => {
            divMensaje.remove();
        }, 2500);
    
    }
}
function consultarAPI(){
    const {moneda, criptomoneda } = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(cotizacion =>{ 
            mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda])
        })
}

function mostrarCotizacionHTML(cotizacion){

    limpiarHTML(resultado);

    const { PRICE, HIGHDAY , LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = cotizacion;
    
    const precio = document.createElement('P');
    precio.classList.add('precio');
    precio.innerHTML = `El precio es: <span>${PRICE}</span>`;

    const precioAlto= document.createElement('P');
    precioAlto.innerHTML = `El precio más alto del día: <span>${HIGHDAY}</span>`

    const precioBajo= document.createElement('P');
    precioBajo.innerHTML = `El precio más bajo del día: <span>${LOWDAY}</span>`

    const ultimasHoras= document.createElement('P');
    ultimasHoras.innerHTML = `Variación últimas 24hs: <span>${CHANGEPCT24HOUR}%</span>`

    const actualizada= document.createElement('P');
    actualizada.innerHTML = `Actualizado: <span>${LASTUPDATE}</span>`


    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(actualizada);

}

function limpiarHTML(contenedor){
    while(contenedor.firstChild){
        contenedor.removeChild(contenedor.firstChild)
    }
}

function mostrarSpinner(){
    limpiarHTML(resultado);
    const spinner = document.createElement('DIV');
    spinner.classList.add('spinner');
    spinner.innerHTML = `
    

        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    
    
    `;
    resultado.appendChild(spinner);
}