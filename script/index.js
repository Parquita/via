/*import {data,} from'./data.js'


let container = document.getElementById('container')
let fragment = document.createDocumentFragment()

document.addEventListener('DOMContentLoaded', ()=>{

    data.forEach(ghost => {
        const {id,nombre,Precio,img} = ghost
        let nuevoE = document.createElement("div")

        nuevoE.innerHTML =
        `
        <div id="container" class="e-card playing" >
            <div class="card">
                <div class="card-head">
                    <img src="${img}" alt="">
    
                </div>
                <div class="card-body">
                    <h3>${Precio}</h3>
                </div>
            </div>
            <div class="wave"></div>
            <div class="wave"></div>
        </div>
        `
        fragment.appendChild(nuevoE)
    })
    container.appendChild(fragment)
})

*/