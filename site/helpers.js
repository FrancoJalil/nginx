import { chooseStyle, stylesJSON } from "./chooseStyle.js";
import { BLACK_MARK, TRANSPARENT_MARK, AUTHOR_PHRASE_1, SABIAS_QUE, AUTHOR_PHRASE_2, INFORMARTIVO, TIPS } from "./styles.js";
import { refreshUserTokens } from "./refreshUserTokens.js";
import { DATO_CURIOSO } from "./styles.js";
import { activarContador, detenerContador } from "./contador.js";

// helpers.js

// Global variables
let switchCounter = 1;
let canvases = [];
let canvasSets = [];
let selectedCanvas;
let previousCanvas;
let selectedObject;
let selectedText;
let myCanvas;
let imagesList = [];
let canvasData;
let contador = 1;
let fabricTextIG;
let modoEdicionIsActive = false;
let canvasDataWithCanvasFirst = [];
let addedCanvas = false;
let imagesDataFront = [];
let promptInput;
let valuePromptInput;
let canvasesSelected;
let allCanvas = [];
let allObjects = [];
let deselectCanvas = false;
let checkboxSelectCarouselList = [];
let numberOfCarrus;
let carruselUnpublished = [];
var confirmationModalContainer = document.getElementById("modalContent");
var confirmationModal = document.getElementById("confirmationModal");
var confirmationModalTitle = document.getElementById("confirmationModalTitle");
var confirmationModalContent = document.getElementById("confirmationModalContent");
let authorName;
let authorPhoto;
var confirmationAction;

export function isSelectedCanvas() {
    return !!selectedCanvas
}

// Función para cerrar el modal de confirmación
export function closeConfirmationModal() {

    confirmationModal.style.display = "none";
}

// Función que se ejecuta al confirmar la acción
export function confirmAction() {
    if (typeof confirmationAction === "function") {
        confirmationAction(); // Ejecutar la función almacenada al confirmar
    }
    closeConfirmationModal();
}

// Función para eliminar el objeto del canvas de la lista allObjects
function deleteObjectFromAllObjects(canvasToDelete) {
    allObjects = allObjects.filter((obj) => obj.canvas !== canvasToDelete);
}

// Función para abrir el modal de confirmación y configurar su contenido
export function showConfirmationModal(title, content, actionFunction, style) {
    let modalContentEdition = document.getElementById('modalContentEdition');
    modalContentEdition.style.display = 'none';

    if (style) {
        chooseStyle(confirmationModalContainer, style, confirmationModalTitle, confirmationModalContent);
    } else {
        confirmationModalTitle.textContent = title;
        confirmationAction = actionFunction; // Almacenar la función a ejecutar al confirmar
    }
    confirmationModal.style.display = "block";

}

export function showConfirmationModalEdition(title, content, actionFunction) {
    let modalStyles = document.getElementById('modalContent');
    modalStyles.style.display = 'none';

    let confirmationModalTitleEdition = document.getElementById('confirmationModalTitleEdition');
    let confirmationModalContentEdition = document.getElementById('confirmationModalContentEdition');
    let modalContentEdition = document.getElementById('modalContentEdition');
    let parentModal = document.getElementById('confirmationModal');

    confirmationModalTitleEdition.textContent = title;
    confirmationModalContentEdition.textContent = content;
    confirmationAction = actionFunction; // Almacenar la función a ejecutar al confirmar
    parentModal.style.display = "block";
    modalContentEdition.style.display = "block";
}



export function deleteCanvas() {

    // Buscar el contenedor con la clase "canvas-selected"
    var parentContainer = document.querySelector('.canvas-selected');
    var canvasHTML = selectedCanvas.lowerCanvasEl;

    // Verificar si el contenedor existe y tiene un padre
    if (parentContainer && parentContainer.parentNode) {
        // Buscar el contenedor abuelo 'big-container'
        var bigContainerX = canvasHTML.closest('.big-container');

        // Eliminar el contenedor del DOM
        parentContainer.parentNode.removeChild(parentContainer);

        // Verificar si el contenedor abuelo 'big-container' todavía tiene canvas adentro
        var canvasInsideBigContainer = bigContainerX.querySelectorAll('canvas');

        if (canvasInsideBigContainer.length === 0) {
            // Si no tiene canvas adentro, eliminar el contenedor 'big-container'
            bigContainerX.parentNode.removeChild(bigContainerX);
            ////console.log("El contenedor 'big-container' ha sido eliminado.");

            // actualizar publicar(x)
            numberOfCarrus--;
            updateAdditionalText(numberOfCarrus)
            // si llega a 0, desactivar el boton "publicar" y recargar la pagina
            if (numberOfCarrus === 0) {
                location.reload();
            }
        }
    }

    canvases = canvases.filter((canvasObj) => canvasObj.canvas !== selectedCanvas);
    ////console.log(canvases)

    deleteObjectFromAllObjects(selectedCanvas);
    // Establecer selectedCanvas en null para eliminar la referencia al elemento canvas
    selectedCanvas = null;
}


function updateAdditionalText(numberOfCarrus) {
    const additionalText = `Guardar (${numberOfCarrus})`;
    // Aquí puedes usar additionalText como desees, por ejemplo, asignarlo a un elemento en el DOM
    // Por ejemplo:
    const publishButton = document.getElementById('save-image-button');
    publishButton.textContent = additionalText;
}

function handlePublish(switchInput) {

    let switchId = switchInput.id;
    let carruselNumber = +switchId.match(/\d+$/)[0];

    let containerDiv = switchInput.closest('.big-container');

    let saveImageButton = document.getElementById('save-image-button');

    if (switchInput.checked) {
        ////console.log('Switch seleccionado');
        // aquí acceder a los canvas correspondientes para re-agregarlos a todos lados (si es que ya no lo estaban)
        containerDiv.style.opacity = '1';
        let index = carruselUnpublished.indexOf(carruselNumber);
        if (index !== -1) {
            // Si el switchId está en el array, eliminarlo
            carruselUnpublished.splice(index, 1);
            updateAdditionalText(numberOfCarrus - carruselUnpublished.length);


        }

    } else {
        ////console.log('Switch deseleccionado');
        containerDiv.style.opacity = '0.4';
        carruselUnpublished.push(carruselNumber);
        updateAdditionalText(numberOfCarrus - carruselUnpublished.length);



    }

    saveImageButton.classList.toggle("disabled-button", carruselUnpublished.length === numberOfCarrus);
    //console.log(carruselUnpublished);
}


export function deselectAllCanvas(canvasContainerOp) {

    let checkbox = document.getElementById('checkbox-input');
    if (checkbox.checked) {
        checkbox.checked = false;
        canvasContainerOp.style.opacity = 1;
    }
}

export function deselectableAllCanvas(canvasContainerOp) {

    canvasContainerOp.style.opacity = 1;

    deselectCanvas = true;

    if (selectedCanvas?.wrapperEl.classList.contains('canvas-selected')) {
        selectedCanvas.wrapperEl.classList.remove('canvas-selected');
    }

    if (selectedCanvas) {
        selectedCanvas.discardActiveObject();
    }

    allObjects.forEach((object) => {
        // Desactivar la propiedad 'selectable' para todos los objetos
        object.set('selectable', false);

        /* Restaurar la propiedad 'selectable' a true solo para objetos de texto
        if (object instanceof fabric.Textbox) {
          object.set('selectable', true);
          
        }*/
    });



    allCanvas.forEach((canvas) => {
        canvas.renderAll();
    })

    return deselectCanvas;

}

export function toggleClickedStyle(element, value, option) {

    var canvasContainerOp = document.getElementById('canvasContainer');

    const elementId = element.id; // Obtener el ID del elemento

    let checkbox = document.getElementById(elementId);

    if (!checkbox.checked) {


        return;
    } else {


        //deselectableAllCanvas(canvasContainerOp);
        //element.classList.add('clicked');

        const bigContainer = element.closest('.big-container');
        const bigContainerId = bigContainer.getAttribute('id');
        const containerNum = parseInt(bigContainerId.split('_')[1]);

        const filteredCanvases = canvases.filter(item => item.num_carrusel === 'carrusel_' + containerNum);

        // bloquear todos los canvitas pero los filtered dejarlos en opacidad 1

        filteredCanvases.forEach((canvas) => {
            let currentCanvas = canvas.canvas

            const objects = currentCanvas.getObjects();

            objects.forEach(object => {
                if (object instanceof fabric.Textbox) {

                    if (option === "color") {
                        object.set('fill', value);
                    } else if (option === "font") {
                        object.set('fontFamily', value);
                    } else if (option === "bold") {
                        object.set('fontWeight', object.get('fontWeight') === 'bold' ? 'normal' : 'bold');
                    } else if (option === "border") {

                        let strokeWidth = object.get('strokeWidth');
                        object.set('strokeWidth', strokeWidth !== 1 ? 1 : 1.3);
                        object.set('stroke', strokeWidth === 1 ? 'black' : '');
                    } else if (option === "deleteText") {
                        ////console.log("borrando texto")

                        currentCanvas.remove(object);


                    } else {
                        ////console.log("done");
                    }


                }

            });
            currentCanvas.renderAll();

        })

    }
}

export function iniciarBloqueadoMenuEdicion() {
    deselectCanvas = true;

    if (selectedCanvas?.wrapperEl.classList.contains('canvas-selected')) {
        selectedCanvas.wrapperEl.classList.remove('canvas-selected');
    }

    if (selectedCanvas) {
        selectedCanvas.discardActiveObject();
    }

    allObjects.forEach((object) => {
        object.set('selectable', false);
    });
}

export function activarCanvas() {
    deselectCanvas = false;
    allObjects.forEach((object) => {

        ////console.log(object)
        object.set('selectable', true);
    });
}

function reloadGenerate() {

    // desaperecer botones edicion y publicar y reaparecerlos luego del timeout
    switchCounter = 0;
    canvases = [];
    canvasSets = [];
    selectedCanvas;
    previousCanvas;
    selectedObject;
    selectedText;
    myCanvas;
    imagesList = [];
    canvasData;
    contador = 1;
    fabricTextIG;
    modoEdicionIsActive = false;
    canvasDataWithCanvasFirst = [];
    addedCanvas = false;
    imagesDataFront = [];
    promptInput;
    valuePromptInput;
    canvasesSelected;
    allCanvas = [];
    allObjects = [];
    deselectCanvas = false;
    checkboxSelectCarouselList = [];
    numberOfCarrus;

    // generar -> borrar anterior (recargar todo como si fuera de nuevo)
    const imageContainerX = document.getElementById('imageContainer');

    const canvasContainerXX = document.getElementById('canvasContainer');

    const imageListUl = document.getElementById('imageList');


    imageContainerX.textContent = '';
    canvasContainerXX.textContent = '';
    imageListUl.textContent = '';

    numberOfCarrus = 0;
    updateAdditionalText(numberOfCarrus);

}

// global variable, asi no se acumulan

function showLoading(show) {
    let generateContainer = document.getElementById('loadingSkeleton');
    let contLoader = document.getElementById('contLoader');
    let loadText = document.getElementById('loadText');
    if (show) {
        
        loadText.innerHTML = "Hi"
        contLoader.style.height = "100%";
        generateContainer.style.height = "70%";
        generateContainer.style.display = 'flex';
        // Set the text content of the h1 element
        // Add the h1 element as a child to the generatedContainer

        
        
    } else {

        
        contLoader.style.height = 0;
        generateContainer.style.height = 0;
        generateContainer.style.display = 'none';
        // poner el menu abajo
        let menuCanvas = document.getElementById('menu-canvas');
        menuCanvas.style.display = 'flex';
        
    }
}



export function generateImage() {

    ////console.log("loading...")
    showLoading(true);
    activarContador();

    // hacer cositas cuando esté cargando...

    // desaparecer anterior container
    let containerInputMenu = document.getElementById("container-content");
    containerInputMenu.style.display = 'none';

    // LOADING SKELETON
    
    window.onbeforeunload = function() {
        return "Seguro que quieres salir? Los cambios no se guardarán";
    };
    
    setTimeout(() => {
        
        ////console.log("loaded")

        authorName = document.getElementById('authorName');
        authorName = authorName.value;

        authorPhoto = localStorage.getItem('authorPhoto');


        iniciarBloqueadoMenuEdicion();

        // agradar footer
        let footer = document.getElementById("footer");
        footer.style.display = 'inline-flex';


        promptInput = document.getElementById("prompt-input");

        // Obtener el valor del input
        valuePromptInput = promptInput.value;

        // Obtener el format
        let selectedStyle = JSON.parse(localStorage.getItem('selectedStyle'));
        let format = selectedStyle.title;
        let type = selectedStyle.type;

        

        let access_token_g = localStorage.getItem('access');

        let author = document.getElementById('selectable-button-author').classList.contains('selected');


        const cantidadPost = parseInt(document.getElementById("slider-value").textContent);
        ////console.log("POSTS", cantidadPost);

        axios.post('https://mikai-production.up.railway.app/image-generation/generate', {
            subject: JSON.stringify({
                subject: valuePromptInput,
                format: format,
                type: type,
                cantidad_post: cantidadPost
            })
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(access_token_g)
            }
        })
            .then(response => {

                if (response.status === 200) {
                    

                    // Si el estado de la respuesta es 200, continúa con el programa
                    ////console.log("ok!");
                    refreshUserTokens();
                } else if (response.statusText === 'Unauthorized') {
                    console.log("no2")
                    //logoutUser();
                    ////console.log("Unauthorized")
                }
                else {
                    console.log("no")
                    // Si el estado no es 200, muestra un mensaje de error o realiza alguna acción adecuada
                    window.location.href = "/home?err=01";
                    ////console.log("err")
                }

                // SACAR LOADING SKELETON
                
                showLoading(false);
                detenerContador();
                
                const data = response.data;
                
                //console.log("BIGDATA", data);

                // SABER CUANTOS CARRUS SON Y AGREGARLO A "PUBLICAR (4)"
                numberOfCarrus = Object.keys(data.gpt_response).length;
                updateAdditionalText(numberOfCarrus);
                //

                let imageContainer = document.getElementById('imageContainer');
                imageContainer.innerHTML = '';

                ////console.log(data.image_generated)

                let contadorReal = 0;
                data.image_generated.forEach((image, index) => {
                    ////console.log("INDEX", index)
                    let imgElement = document.createElement('img');
                    imgElement.src = image.image

                    //console.log("IM", imgElement);

                    imgElement.onload = function () {
                        let contadorIndex = 0;
                        
                        let current_image = data.image_generated[contadorReal].image

                        let canvasContainer = document.getElementById('canvasContainer');
                        let canvasElement = document.createElement('canvas');
                        let containerCE = document.createElement('div');
                        containerCE.classList.add('big-container');
                        containerCE.setAttribute('id', 'big-container_' + (contadorReal));

                        ////console.log("INDEX2", index)
                        canvasElement.id = 'canvas-' + contadorReal;


                        containerCE.appendChild(canvasElement);

                        let selectThisCarru = document.createElement('input');
                        selectThisCarru.type = 'checkbox';
                        selectThisCarru.classList.add('select-this-carru');
                        selectThisCarru.setAttribute('id', 'miParrafo' + contadorReal);

                        // Crea el elemento label
                        let labelElement = document.createElement('label');

                        // Establece la propiedad 'for' del label para que coincida con el atributo 'id' del input
                        labelElement.setAttribute('for', 'miParrafo' + contadorReal);

                        // Agrega el texto que deseas mostrar en el label
                        labelElement.innerText = 'Select this carrousel';

                        


                        let descriptionTitle = document.createElement('P');
                        descriptionTitle.textContent = 'Description'



                        // Agregar un evento de clic al párrafo
                        /*
                        selectThisCarru.addEventListener('click', function() {
                            // Cambiar el estilo cuando el párrafo es clickeado
                            if (selectThisCarru.classList.contains('clicked')) {
                                selectThisCarru.classList.remove('clicked');
                            } else {
                                selectThisCarru.classList.add('clicked');
                            }
                        });
                        */

                        /*
                        selectThisCarru.addEventListener('click', function() {
                            toggleClickedStyle(selectThisCarru)
                        })
                        */


                        canvasContainer.appendChild(containerCE);



                        let canvasWidth = imgElement.width;
                        let canvasHeight = imgElement.height;

                        let canvasFirst = new fabric.Canvas('canvas-' + contadorReal, {
                            width: canvasWidth,
                            height: canvasHeight
                        });


                        //canvases[index] = canvas;
                        ////console.log(data.gpt_response)
                        imagesList.push(current_image);

                        ////console.log("INDEX_", index);
                        ////console.log("CONTADOR_", contador);
                        let idea_actual = "idea" + (contadorReal+1);// index + 1 (SOLO)
                        contadorIndex++;
                        ////console.log("PEPE PIO")
                        ////console.log("IDEA", idea_actual)
                        ////console.log("DATITA", data.gpt_response[idea_actual])
                        let front_image_text = data.gpt_response[idea_actual].image_text;
                        let image_description = data.gpt_response[idea_actual].image_description;
                        ////console.log("FRONTI", front_image_text)
                        imagesDataFront.push({ image_description: image_description });


                        // Crear un campo de texto de 250x250
                        // Crear un campo de texto de 250x250
                        let textField = document.createElement('textarea');
                        textField.classList.add('text-field');
                        textField.rows = 8; // Establecer el número de filas
                        textField.cols = 30; // Establecer el número de columnas
                        textField.value = image_description; // Establecer el contenido del campo de texto

                        textField.addEventListener('input', function (event) {
                            const maxLength = 500;
                            const currentLength = event.target.value.length;

                            if (currentLength > maxLength) {
                                // Si la longitud actual supera la máxima, recorta el contenido del textarea
                                event.target.value = event.target.value.slice(0, maxLength);
                            }
                            image_description = event.target.value;
                            imagesDataFront[contadorReal].image_description = image_description;
                            console.log(imagesDataFront);
                        });

                        let canvasDiv = document.createElement('div');
                        canvasDiv.classList.add('text-field-container');
                        containerCE.appendChild(canvasDiv);


                        // Añadir el campo de texto al contenedor div
                        let containerFirst = document.createElement('div');
                        containerFirst.classList.add('containerFirst');


                        //containerFirst.appendChild(selectThisCarru);
                        //containerFirst.appendChild(labelElement);
                        let containerDesc = document.createElement('div');
                        containerDesc.classList.add('containerDesc');

                        containerDesc.appendChild(textField);

                        containerDesc.appendChild(descriptionTitle);
                        

                        // date time
                        let containerDatetime = document.createElement('div');
                        containerDatetime.classList.add('containerDatetime');
                        let datetimeTitle = document.createElement('P');
                        datetimeTitle.textContent = 'Fecha de publicación'

                        let datetimeInput = document.createElement('input');
                        datetimeInput.type = 'date'
                        datetimeInput.value = "2023-06-23" // que sea + un día por cada publicación (ver como hacerlo)
                        containerDatetime.appendChild(datetimeInput);
                        containerDatetime.appendChild(datetimeTitle);
                        //

                        // Crear el label para el switch
                        // Crear el contenedor principal del switch
                        const switchContainer = document.createElement('div');
                        switchContainer.classList.add('switch-container');

                        // Crear el input (checkbox) para el switch
                        const switchInput = document.createElement('input');
                        switchInput.type = 'checkbox';
                        switchInput.name = 'checkbox-publish';
                        switchInput.classList.add('checkbox-publish');
                        switchInput.id = 'checkbox-publish' + contadorReal;
                        switchInput.checked = true; // Por defecto, activado

                        const selectedText = document.createElement('label');
                        selectedText.htmlFor = switchInput.id;
                        selectedText.textContent = 'Guardar';
                        selectedText.classList.add('switch-label-text');

                        switchCounter++;


                        switchContainer.appendChild(selectedText);
                        switchContainer.appendChild(switchInput);

                        // Agregar el contenedor switchContainer al contenedor canvasDiv
                        canvasDiv.appendChild(switchContainer);

                        switchInput.addEventListener('click', () => handlePublish(switchInput))

                        // datetime
                        canvasDiv.appendChild(containerDatetime);
                        canvasDiv.appendChild(containerFirst);
                        canvasDiv.appendChild(containerDesc);

                        checkboxSelectCarouselList.push(containerFirst);



                        if (!canvasData || canvasData.canvas !== canvasFirst) {

                            canvasData = {
                                num_carrusel: "carrusel_" + contadorReal,
                                image_position: 0,
                                canvas: canvasFirst,
                                publish: true
                            };



                            // Actualizamos canvasData.canvas para que haga referencia al contenedor en lugar del elemento canvas
                            //canvasData.canvas = container;

                            allCanvas.push(canvasFirst)
                            canvases.push(canvasData);
                            canvasDataWithCanvasFirst.push(canvasData)
                            
                        }


                        ////console.log(selectedStyle)
                        format = selectedStyle.title;
                        ////console.log(format);

                        //console.log("1", imgElement.src);
                        configurarCanvas(canvasFirst, current_image, true, format, front_image_text, author, null);

                        // CARRU
                        let canvasContainerDiv = canvasContainer.querySelector('.canvas-container');
                        // Establecer divs al carrusel

                        // Condicional que permite que no haya mas de 4 / 5 imagen por carrusel // ANTI BUG
                        if (true) { // JEJE
                            
                            if (selectedStyle.type !== 'Solo') {

                                //var idea = "idea" + (j + 1)
                                let carrusel_actual = "carrusel_" + (contadorReal);

                                //////console.log(data.gpt_response[idea])
                                let newCont = document.createElement('div');
                                newCont.classList.add('cont-carrusel');


                                for (let i = 0; i <= 3; i++) {

                                    let carrusel = "carrusel_" + (i + 1);

                                    let image_position = i + 1;

                                    let image_text_carru = data.gpt_response[idea_actual][carrusel]

                                    let canv = canvasContainer.children[contadorReal];

                                    newCont.classList.add('cont-carrusel');

                                    // reemplazar este div por un canvas 250x250 fondo negro
                                    let canvasElement = document.createElement('canvas');
                                    canvasElement.width = 250;
                                    canvasElement.height = 250;
                                    canvasElement.classList.add('img-carrusel');

                                    canv.appendChild(newCont);
                                    newCont.appendChild(canvasElement);

                                    // Configurar el nuevo canvas con fondo negro y texto "holis"
                                    let canvas = new fabric.Canvas(canvasElement, {
                                        width: canvasWidth,
                                        height: canvasHeight
                                    });
                                    //canvases.push(canvas);

                                    // Crear un nuevo objeto canvasData para cada canvas
                                    //canvasData.carrusel.carrus.push(canvas)

                                    canvasData = {
                                        num_carrusel: carrusel_actual,
                                        image_position: image_position,
                                        canvas: canvas,
                                        publish: true
                                    };


                                    //if (i == 0) {
                                    // canvasData.canvas = canvasFirst;
                                    //}
                                    allCanvas.push(canvas)
                                    canvases.push(canvasData);
                                    ////console.log(format);
                                    ////console.log(i);

                                    //console.log("2", current_image);

                                    if (i < 4) {
                                        configurarCanvas(canvas, current_image, false, format, image_text_carru, author, 'carru');
                                    }

                                    // última imagen (firma)
                                    else {
                                        //configurarCanvas(canvas, current_image, false, format, { title: 'Esperamos haya sido de ayuda!', info: 'Gracias por seguirnos!' }, author, 'signature');
                                    }
                                }



                            }
                        }contadorReal++;
                    };



                });

            })
            .catch(error => {
                window.onbeforeunload = null;
                console.error('Error en la solicitud: ' + error.message);
                // Realiza alguna acción adecuada en caso de error, como redirigir o mostrar un mensaje de error
                window.location.href = "/home?err=01";
              });


    }, 1000);






}

export function configurarCanvas(canvas, backgroundImageSrc, original, format, image_text_carru, author, photoType) {
    // Limpiar el canvas antes de configurarlo
    canvas.clear();
    let fabricTextD;
    let fabricTextPetit;
    let fabricTextAuthor;
    let fabricTextSabiasQue;
    let clipPath;
    let rect;


    //canvas.setDimensions({ width: 250, height: 250 });

    if (format === BLACK_MARK) {


        if (photoType === 'carru') {
            let canvasRect;

            // Agregar la imagen de fondo con el filtro de desenfoque

            fabric.Image.fromURL(backgroundImageSrc, function (img) {

                img.scaleToWidth(canvas.width);


                img.filters.push(new fabric.Image.filters.Blur({
                    //blur: 0.2 // Valor del desenfoque (0 para sin desenfoque, aumenta para mayor desenfoque)
                }, { crossOrigin: 'Anonymous' }));
                img.applyFilters();
                canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));

                // Agregar el rectángulo negro
                let rect = new fabric.Rect({
                    left: (1024 - 720) / 2,   // Posición en X del rectángulo
                    top: (1024 - 720) / 2,    // Posición en Y del rectángulo
                    width: 720, // Ancho del rectángulo
                    height: 720,// Altura del rectángulo
                    //rx: 20,
                    //ry: 20,
                    fill: '#121212',
                    selectable: false,
                    evented: false,
                });

                if (author) {

                    // Cargar la imagen desde URL
                    fabric.Image.fromURL(authorPhoto, function (imgX) {

                        // Configurar la imagen
                        //imgX.scaleToWidth(80); // Ajustar el ancho de la imagen
                        //imgX.scale(0.5);
                        imgX.scaleToWidth(110);
                        imgX.set({
                            left: 458,
                            top: 106,
                            selectable: false,
                            evented: false,
                        });

                        // Crear un círculo de recorte
                        var clipPath = new fabric.Circle({
                            radius: 470,
                            originX: 'center',
                            originY: 'center',
                            selectable: false,
                            evented: false,
                        });

                        // Aplicar el círculo de recorte a la imagen
                        imgX.clipPath = clipPath;

                        // Agregar la imagen al lienzo
                        canvas.add(imgX);
                    }, { crossOrigin: 'Anonymous' });

                    let circle = new fabric.Circle({
                        left: 452,
                        top: 100,
                        radius: 60,
                        selectable: false,
                        evented: false,
                        fill: '#121212',
                    });

                    canvas.add(circle);
                    //canvas.add(photo);



                }
                canvas.add(rect);

                rect.sendToBack();

            }, { crossOrigin: 'Anonymous' });
            // Agregar el texto "holis"
            fabricTextD = new fabric.Textbox(image_text_carru, {
                left: 180,
                top: 460,
                width: 660,
                fill: 'white',
                fontSize: 80,
                textAlign: 'center',
                textWrapping: 'auto',
                selectable: false,
                //plitByGrapheme: true
            });

            allObjects.push(fabricTextD)

            let numLines = fabricTextD.textLines.length;
            if (numLines >= 3) {
                // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
                fabricTextD.top = 380;
            }

            else if (numLines == 1) {
                // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
                fabricTextD.top = 500;
            }

            else if (numLines == 2) {
                // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
                fabricTextD.top = 420;
            }


            if (author) {

                fabricTextIG = new fabric.Textbox('@' + authorName, {
                    left: 300,
                    top: 240,
                    width: 400,
                    fill: 'white',
                    fontSize: 40,
                    fontWeight: 'lighter',
                    textAlign: 'center',
                    textWrapping: 'auto',
                    selectable: false,
                    //plitByGrapheme: true
                });

                fabricTextIG.customProperty = 'IgUser'

                allObjects.push(fabricTextIG);
                canvas.add(fabricTextIG);
            }

            canvas.add(fabricTextD);

        } else if (photoType === 'signature') {

            fabric.Image.fromURL(backgroundImageSrc, function (img) {

                img.scaleToWidth(canvas.width);

                img.filters.push(new fabric.Image.filters.Blur({
                    //blur: 0.2 // Valor del desenfoque (0 para sin desenfoque, aumenta para mayor desenfoque)
                }, { crossOrigin: 'Anonymous' }));
                img.applyFilters();
                canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));

                let rect = new fabric.Rect({
                    left: -1,   // Posición en X del rectángulo
                    top: -1,    // Posición en Y del rectángulo
                    width: 1026, // Ancho del rectángulo
                    height: 1026,// Altura del rectángulo
                    //rx: 20,
                    //ry: 20,
                    fill: '#252850',
                    selectable: false,
                    evented: false,
                });

                canvas.add(rect);
                rect.sendToBack();

                if (author) {
                    // Cargar la imagen desde URL
                    fabric.Image.fromURL(authorPhoto, function (imgX) {

                        // Configurar la imagen
                        //imgX.scaleToWidth(80); // Ajustar el ancho de la imagen
                        //imgX.scale(0.5);
                        imgX.scaleToWidth(220);
                        imgX.set({
                            left: 391,
                            top: 200,
                            selectable: false,
                            evented: false,
                        });

                        // Crear un círculo de recorte
                        var clipPath = new fabric.Circle({
                            radius: 470,
                            originX: 'center',
                            originY: 'center',
                            selectable: false,
                            evented: false,
                        });

                        // Aplicar el círculo de recorte a la imagen
                        imgX.clipPath = clipPath;

                        // Agregar la imagen al lienzo
                        canvas.add(imgX);
                    }, { crossOrigin: 'Anonymous' });

                    let circle = new fabric.Circle({
                        left: 380,
                        top: 190,
                        radius: 120,
                        selectable: false,
                        evented: false,
                        fill: '#121212',
                    });

                    canvas.add(circle);
                    //canvas.add(photo);
                }

                let iconSize = 80;
                let iconTop = 900;
                let iconLeft = 40;
                // ICONS
                fabric.Image.fromURL('https://cdn-icons-png.flaticon.com/512/3756/3756555.png ', function (imgX) {
                    // Configurar la imagen
                    //imgX.scaleToWidth(80); // Ajustar el ancho de la imagen
                    //imgX.scale(0.5);
                    imgX.scaleToWidth(iconSize);
                    imgX.set({
                        left: iconLeft,
                        top: iconTop,
                        selectable: false,
                        evented: false
                    });

                    // Crear un círculo de recorte
                    var clipPath = new fabric.Circle({
                        radius: 940,
                        originX: 'center',
                        originY: 'center',
                        selectable: false,
                        evented: false,
                    });

                    // Aplicar el círculo de recorte a la imagen
                    imgX.clipPath = clipPath;

                    // Agregar la imagen al lienzo
                    canvas.add(imgX);
                }, { crossOrigin: 'Anonymous' });

                fabric.Image.fromURL('   https://cdn-icons-png.flaticon.com/512/2462/2462844.png  ', function (imgX) {
                    // Configurar la imagen
                    //imgX.scaleToWidth(80); // Ajustar el ancho de la imagen
                    //imgX.scale(0.5);
                    imgX.scaleToWidth(iconSize);
                    imgX.set({
                        left: iconLeft + 120,
                        top: iconTop,
                        selectable: false,
                        evented: false
                    });

                    // Crear un círculo de recorte
                    var clipPath = new fabric.Circle({
                        radius: 940,
                        originX: 'center',
                        originY: 'center',
                        selectable: false,
                        evented: false,
                    });

                    // Aplicar el círculo de recorte a la imagen
                    imgX.clipPath = clipPath;

                    // Agregar la imagen al lienzo
                    canvas.add(imgX);
                }, { crossOrigin: 'Anonymous' });

                fabric.Image.fromURL('   https://cdn-icons-png.flaticon.com/512/2099/2099189.png  ', function (imgX) {
                    // Configurar la imagen
                    //imgX.scaleToWidth(80); // Ajustar el ancho de la imagen
                    //imgX.scale(0.5);
                    imgX.scaleToWidth(iconSize);
                    imgX.set({
                        left: iconLeft + 240,
                        top: iconTop,
                        selectable: false,
                        evented: false
                    });

                    // Crear un círculo de recorte
                    var clipPath = new fabric.Circle({
                        radius: 940,
                        originX: 'center',
                        originY: 'center',
                        selectable: false,
                        evented: false,
                    });

                    // Aplicar el círculo de recorte a la imagen
                    imgX.clipPath = clipPath;

                    // Agregar la imagen al lienzo
                    canvas.add(imgX);
                }, { crossOrigin: 'Anonymous' });

                fabric.Image.fromURL('   https://cdn-icons-png.flaticon.com/512/102/102279.png  ', function (imgX) {
                    // Configurar la imagen
                    //imgX.scaleToWidth(80); // Ajustar el ancho de la imagen
                    //imgX.scale(0.5);
                    imgX.scaleToWidth(iconSize);
                    imgX.set({
                        left: iconLeft + 865,
                        top: iconTop,
                        selectable: false,
                        evented: false
                    });

                    // Crear un círculo de recorte
                    var clipPath = new fabric.Circle({
                        radius: 940,
                        originX: 'center',
                        originY: 'center',
                        selectable: false,
                        evented: false,
                    });

                    // Aplicar el círculo de recorte a la imagen
                    imgX.clipPath = clipPath;

                    // Agregar la imagen al lienzo
                    canvas.add(imgX);
                }, { crossOrigin: 'Anonymous' });

            }, { crossOrigin: 'Anonymous' });
            // Agregar el texto "holis"
            fabricTextD = new fabric.Textbox(image_text_carru.title.toUpperCase(), {
                left: 240,
                top: 460,
                height: 400,
                width: 540,
                fill: 'white',
                fontSize: 110,
                fontFamily: 'League Gothic',
                textAlign: 'center',
                textWrapping: 'auto',
                lineHeight: 0.85,
                selectable: false,
                //plitByGrapheme: true
            });

            fabricTextPetit = new fabric.Textbox(image_text_carru.info.toLowerCase(), {
                left: 240,
                top: 720,
                width: 540,
                fill: 'white',
                fontSize: 50,
                fontFamily: 'Poppins',
                textAlign: 'center',
                textWrapping: 'auto',
                selectable: false,
                //plitByGrapheme: true
            });



            allObjects.push(fabricTextD);
            allObjects.push(fabricTextPetit);

            /*
            let numLines = fabricTextD.textLines.length;
            if (numLines >= 3) {
                // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
                fabricTextD.top = 190;
            }

            else if (numLines == 1) {
                // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
                fabricTextD.top = 250;
            }

            else if (numLines == 2) {
                // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
                fabricTextD.top = 210;
            }
            */


            if (author) {
                fabricTextIG = new fabric.Textbox('@' + authorName, {
                    left: 335,
                    top: 100,
                    width: 210,
                    fill: 'white',
                    fontSize: 80,
                    fontWeight: 'lighter',
                    fontFamily: 'Poppins',
                    textAlign: 'right',
                    textWrapping: 'auto',
                    selectable: false,
                    //plitByGrapheme: true
                });

                fabricTextIG.customProperty = 'IgUser'

                allObjects.push(fabricTextIG);
                canvas.add(fabricTextIG);
            }

            canvas.add(fabricTextD);
            canvas.add(fabricTextPetit);
        }
        else {
            // Agregar la imagen de fondo sin filtro de desenfoque
            fabric.Image.fromURL(backgroundImageSrc, function (img) {


                img.scaleToWidth(canvas.width);

                canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));


                // Crear un degradado lineal desde abajo hasta arriba
                let gradient = new fabric.Gradient({
                    type: 'linear',
                    coords: { x1: 0, y1: 0, x2: 0, y2: 100 }, // Definir las coordenadas del gradiente
                    colorStops: [
                        { offset: 0, color: 'rgba(18, 18, 18, 0)' }, // Punto de inicio del gradiente (negro)
                        { offset: 1, color: 'rgba(18, 18, 18, 0.9)' },  // Punto final del gradiente (blanco)
                    ]
                });

                // Agregar el rectángulo negro
                let rect = new fabric.Rect({
                    top: 1024 - 360,
                    width: 1024, // Ancho del rectángulo
                    height: 360, // Altura del rectángulo
                    fill: gradient, // Color de relleno del rectángulo (negro)
                    selectable: false,
                    evented: false,
                });

                canvas.add(rect);
                rect.sendToBack();
            }, { crossOrigin: 'Anonymous' });
            // Agregar el texto "holis"
            fabricTextD = new fabric.Textbox(image_text_carru, {
                left: 108,
                top: 850,
                width: 800,
                fill: 'white',
                fontSize: 80,
                textAlign: 'center',
                textWrapping: 'auto',
                selectable: false,
            });
            allObjects.push(fabricTextD)


            let numLines = fabricTextD.textLines.length;
            if (numLines == 3) {
                // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
                fabricTextD.fontSize = 70;
                fabricTextD.top = 800;

            }

            else if (numLines == 2) {

                fabricTextD.top = 780;
            }

            else if (numLines == 1) {
                // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
                fabricTextD.top = 830;
            }

            else if (numLines > 3) {
                // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
                fabricTextD.fontSize = 60;
                fabricTextD.top = 800;
            }


            canvas.add(fabricTextD);

        }
    }


    else if (format === TRANSPARENT_MARK) {

        if (photoType === 'carru') {
            let canvasRect;

            // Agregar la imagen de fondo con el filtro de desenfoque

            fabric.Image.fromURL(backgroundImageSrc, function (img) {

                img.scaleToWidth(canvas.width);

                img.filters.push(new fabric.Image.filters.Blur({
                    //blur: 0.2 // Valor del desenfoque (0 para sin desenfoque, aumenta para mayor desenfoque)
                }, { crossOrigin: 'Anonymous' }));
                img.applyFilters();
                canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));

                // Agregar el rectángulo negro
                let rect = new fabric.Rect({
                    left: 0,   // Posición en X del rectángulo
                    top: 0,    // Posición en Y del rectángulo
                    width: 1024, // Ancho del rectángulo
                    height: 1024,// Altura del rectángulo
                    //rx: 20,
                    //ry: 20,
                    fill: 'rgba(18, 18, 18, 0.4)',
                    selectable: false,
                    evented: false,
                });

                let marco = new fabric.Rect({
                    left: (1024 - 760) / 2,   // Posición en X del rectángulo
                    top: (1024 - 760) / 2,    // Posición en Y del rectángulo
                    width: 760, // Ancho del rectángulo
                    height: 760,// Altura del rectángulo
                    //rx: 20,
                    //ry: 20,
                    fill: 'transparent',
                    stroke: 'white',      // Color de borde blanco
                    strokeWidth: 4,
                    selectable: false,
                    evented: false,
                });

                canvas.add(rect);
                canvas.add(marco);
                //canvas.add(circle);
                //canvas.add(photo);
                rect.sendToBack();

            }, { crossOrigin: 'Anonymous' });
            // Agregar el texto "holis"
            fabricTextD = new fabric.Textbox(image_text_carru, {
                left: 180,
                top: 460,
                width: 660,
                fill: 'white',
                fontSize: 80,
                textAlign: 'center',
                textWrapping: 'auto',
                selectable: false,
                //plitByGrapheme: true
            });

            allObjects.push(fabricTextD);

            let numLines = fabricTextD.textLines.length;
            if (numLines >= 3) {
                // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
                fabricTextD.top = 380;
            }

            else if (numLines == 1) {
                // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
                fabricTextD.top = 500;
            }

            else if (numLines == 2) {
                // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
                fabricTextD.top = 420;
            }

            if (author) {
                fabricTextIG = new fabric.Textbox('@' + authorName, {
                    left: 300,
                    top: 840,
                    width: 400,
                    fill: 'white',
                    fontSize: 40,
                    fontWeight: 'lighter',
                    textAlign: 'center',
                    textWrapping: 'auto',
                    //plitByGrapheme: true
                });

                fabricTextIG.customProperty = 'IgUser'
                allObjects.push(fabricTextIG);
                canvas.add(fabricTextIG);
            }

            canvas.add(fabricTextD);

        } else if (photoType === 'signature') {

            fabric.Image.fromURL(backgroundImageSrc, function (img) {

                img.scaleToWidth(canvas.width);

                img.filters.push(new fabric.Image.filters.Blur({
                    //blur: 0.2 // Valor del desenfoque (0 para sin desenfoque, aumenta para mayor desenfoque)
                }, { crossOrigin: 'Anonymous' }));
                img.applyFilters();
                canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));

                // Agregar el rectángulo negro
                let rect = new fabric.Rect({
                    left: 0,   // Posición en X del rectángulo
                    top: 0,    // Posición en Y del rectángulo
                    width: 1024, // Ancho del rectángulo
                    height: 1024,// Altura del rectángulo
                    //rx: 20,
                    //ry: 20,
                    fill: 'rgba(18, 18, 18, 0.4)',
                    selectable: false,
                    evented: false,
                });

                let marco = new fabric.Rect({
                    left: (1024 - 760) / 2,   // Posición en X del rectángulo
                    top: (1024 - 760) / 2,    // Posición en Y del rectángulo
                    width: 760, // Ancho del rectángulo
                    height: 760,// Altura del rectángulo
                    //rx: 20,
                    //ry: 20,
                    fill: '#121212',
                    stroke: 'white',      // Color de borde blanco
                    strokeWidth: 4,
                    selectable: false,
                    evented: false,
                });

                canvas.add(marco);
                canvas.add(rect);

                marco.sendToBack();
                rect.sendToBack();


                if (author) {
                    // Cargar la imagen desde URL
                    fabric.Image.fromURL(authorPhoto, function (imgX) {

                        // Configurar la imagen
                        //imgX.scaleToWidth(80); // Ajustar el ancho de la imagen
                        //imgX.scale(0.5);
                        imgX.scaleToWidth(220);
                        imgX.set({
                            left: 220,
                            top: 200,
                            selectable: false,
                            evented: false,
                        });

                        // Crear un círculo de recorte
                        var clipPath = new fabric.Circle({
                            radius: 470,
                            originX: 'center',
                            originY: 'center',
                            selectable: false,
                            evented: false,
                        });

                        // Aplicar el círculo de recorte a la imagen
                        imgX.clipPath = clipPath;

                        // Agregar la imagen al lienzo
                        canvas.add(imgX);
                    }, { crossOrigin: 'Anonymous' });

                    let circle = new fabric.Circle({
                        left: 224,
                        top: 202,
                        radius: 104,
                        selectable: false,
                        evented: false,
                        fill: 'white',
                    });

                    canvas.add(circle);
                    //canvas.add(photo);
                }

                let iconSize = 80;
                let iconTop = 920;
                // ICONS
                fabric.Image.fromURL('https://cdn-icons-png.flaticon.com/512/3756/3756555.png ', function (imgX) {
                    // Configurar la imagen
                    //imgX.scaleToWidth(80); // Ajustar el ancho de la imagen
                    //imgX.scale(0.5);
                    imgX.scaleToWidth(iconSize);
                    imgX.set({
                        left: 40,
                        top: iconTop,
                        selectable: false,
                        evented: false
                    });

                    // Crear un círculo de recorte
                    var clipPath = new fabric.Circle({
                        radius: 470,
                        originX: 'center',
                        originY: 'center',
                        selectable: false,
                        evented: false,
                    });

                    // Aplicar el círculo de recorte a la imagen
                    imgX.clipPath = clipPath;

                    // Agregar la imagen al lienzo
                    canvas.add(imgX);
                }, { crossOrigin: 'Anonymous' });

                fabric.Image.fromURL('   https://cdn-icons-png.flaticon.com/512/2462/2462844.png  ', function (imgX) {
                    // Configurar la imagen
                    //imgX.scaleToWidth(80); // Ajustar el ancho de la imagen
                    //imgX.scale(0.5);
                    imgX.scaleToWidth(iconSize);
                    imgX.set({
                        left: 150,
                        top: iconTop,
                        selectable: false,
                        evented: false
                    });

                    // Crear un círculo de recorte
                    var clipPath = new fabric.Circle({
                        radius: 470,
                        originX: 'center',
                        originY: 'center',
                        selectable: false,
                        evented: false,
                    });

                    // Aplicar el círculo de recorte a la imagen
                    imgX.clipPath = clipPath;

                    // Agregar la imagen al lienzo
                    canvas.add(imgX);
                }, { crossOrigin: 'Anonymous' });

                fabric.Image.fromURL('   https://cdn-icons-png.flaticon.com/512/2099/2099189.png  ', function (imgX) {
                    // Configurar la imagen
                    //imgX.scaleToWidth(80); // Ajustar el ancho de la imagen
                    //imgX.scale(0.5);
                    imgX.scaleToWidth(iconSize);
                    imgX.set({
                        left: 260,
                        top: iconTop,
                        selectable: false,
                        evented: false
                    });

                    // Crear un círculo de recorte
                    var clipPath = new fabric.Circle({
                        radius: 470,
                        originX: 'center',
                        originY: 'center',
                        selectable: false,
                        evented: false,
                    });

                    // Aplicar el círculo de recorte a la imagen
                    imgX.clipPath = clipPath;

                    // Agregar la imagen al lienzo
                    canvas.add(imgX);
                }, { crossOrigin: 'Anonymous' });

                fabric.Image.fromURL('   https://cdn-icons-png.flaticon.com/512/102/102279.png  ', function (imgX) {
                    // Configurar la imagen
                    //imgX.scaleToWidth(80); // Ajustar el ancho de la imagen
                    //imgX.scale(0.5);
                    imgX.scaleToWidth(iconSize);
                    imgX.set({
                        left: 912,
                        top: iconTop,
                        selectable: false,
                        evented: false
                    });

                    // Crear un círculo de recorte
                    var clipPath = new fabric.Circle({
                        radius: 470,
                        originX: 'center',
                        originY: 'center',
                        selectable: false,
                        evented: false,
                    });

                    // Aplicar el círculo de recorte a la imagen
                    imgX.clipPath = clipPath;

                    // Agregar la imagen al lienzo
                    canvas.add(imgX);
                }, { crossOrigin: 'Anonymous' });

            }, { crossOrigin: 'Anonymous' });
            // Agregar el texto "holis"
            fabricTextD = new fabric.Textbox(image_text_carru.title.toUpperCase(), {
                left: 240,
                top: 460,
                height: 200,
                width: 540,
                fill: 'white',
                fontSize: 110,
                fontFamily: 'League Gothic',
                textAlign: 'center',
                textWrapping: 'auto',
                lineHeight: 0.85,
                selectable: false,
                //plitByGrapheme: true
            });

            fabricTextPetit = new fabric.Textbox(image_text_carru.info.toLowerCase(), {
                left: 170,
                top: 780,
                width: 720,
                fill: 'white',
                fontSize: 50,
                fontFamily: 'Poppins',
                textAlign: 'center',
                textWrapping: 'auto',
                selectable: false,
                //plitByGrapheme: true
            });



            allObjects.push(fabricTextD);
            allObjects.push(fabricTextPetit);

            /*
            let numLines = fabricTextD.textLines.length;
            if (numLines >= 3) {
                // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
                fabricTextD.top = 190;
            }

            else if (numLines == 1) {
                // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
                fabricTextD.top = 250;
            }

            else if (numLines == 2) {
                // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
                fabricTextD.top = 210;
            }
            */


            if (author) {
                fabricTextIG = new fabric.Textbox('@' + authorName, {
                    left: 450,
                    top: 280,
                    width: 210,
                    fill: 'white',
                    fontSize: 60,
                    fontWeight: 'bold',
                    fontFamily: 'Poppins',
                    fontStyle: 'italic',
                    textAlign: 'right',
                    textWrapping: 'auto',
                    selectable: false,
                    //plitByGrapheme: true
                });

                fabricTextIG.customProperty = 'IgUser'

                allObjects.push(fabricTextIG);
                canvas.add(fabricTextIG);
            }

            canvas.add(fabricTextD);
            canvas.add(fabricTextPetit);
        } else {
            // Agregar la imagen de fondo sin filtro de desenfoque
            fabric.Image.fromURL(backgroundImageSrc, function (img) {

                img.scaleToWidth(canvas.width);

                canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));


                // Crear un degradado lineal desde abajo hasta arriba
                let gradient = new fabric.Gradient({
                    type: 'linear',
                    coords: { x1: 0, y1: 0, x2: 0, y2: 150 }, // Definir las coordenadas del gradiente
                    colorStops: [
                        { offset: 0, color: 'rgba(18, 18, 18, 0)' }, // Punto de inicio del gradiente (negro)
                        { offset: 1, color: 'rgba(18, 18, 18, 0.9)' }  // Punto final del gradiente (blanco)
                    ]
                });

                // Agregar el rectángulo negro
                let rect = new fabric.Rect({
                    top: 1024 - 300,
                    width: 1024, // Ancho del rectángulo
                    height: 300, // Altura del rectángulo
                    fill: gradient, // Color de relleno del rectángulo (negro)
                    selectable: false,
                    evented: false,
                });

                canvas.add(rect);
                rect.sendToBack();
            }, { crossOrigin: 'Anonymous' });
            // Agregar el texto "holis"
            fabricTextD = new fabric.Textbox(image_text_carru, {
                left: 38,
                top: 740,
                width: 940,
                fill: 'white',
                fontSize: 120,
                textAlign: 'center',
                textWrapping: 'auto',
                selectable: false,
            });

            allObjects.push(fabricTextD);

            let numLines = fabricTextD.textLines.length;
            if (numLines == 3) {
                // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
                fabricTextD.fontSize = 80;
                fabricTextD.top = 800;

            }

            else if (numLines == 2) {
                fabricTextD.fontSize = 80;
                fabricTextD.top = 800;
            }

            else if (numLines == 1) {
                // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
                fabricTextD.top = 800;
            }

            else if (numLines > 3) {
                // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
                fabricTextD.fontSize = 80;
                fabricTextD.top = 680;
            };

            canvas.add(fabricTextD);

        }
    }

    else if (format === 'test') {


        if (photoType === 'carru') {
            let canvasRect;

            // Agregar la imagen de fondo con el filtro de desenfoque

            fabric.Image.fromURL(backgroundImageSrc, function (img) {

                img.scaleToWidth(canvas.width);


                img.filters.push(new fabric.Image.filters.Blur({
                    //blur: 0.2 // Valor del desenfoque (0 para sin desenfoque, aumenta para mayor desenfoque)
                }, { crossOrigin: 'Anonymous' }));
                img.applyFilters();
                canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));


                let circle = new fabric.Circle({
                    left: 280,       // Posición en X del círculo
                    top: 0 - 256,        // Posición en Y del círculo
                    radius: 512,     // Radio del círculo (20 en este caso)
                    selectable: false,
                    evented: false,
                    fill: '#f5efd7',
                });





                if (author) {
                    // Cargar la imagen desde URL
                    fabric.Image.fromURL(authorPhoto, function (imgX) {
                        imgX.scaleToWidth(1024);

                        // Configurar la imagen
                        //imgX.scaleToWidth(80); // Ajustar el ancho de la imagen
                        //imgX.scale(0.5);
                        imgX.scaleToWidth(55);
                        imgX.set({
                            left: 450,
                            top: 450,
                            selectable: true,
                            evented: true,
                        });

                        // Crear un círculo de recorte
                        var clipPath = new fabric.Circle({
                            radius: 470,
                            originX: 'center',
                            originY: 'center',
                            selectable: true,
                            evented: true,
                        });

                        // Aplicar el círculo de recorte a la imagen
                        imgX.clipPath = clipPath;

                        // Agregar la imagen al lienzo
                        canvas.add(imgX);
                    });

                    let round = new fabric.Circle({
                        left: 450,
                        top: 450,
                        radius: 28,
                        selectable: false,
                        evented: false,
                        fill: '#121212',
                    });

                    canvas.add(round);
                }
                canvas.add(circle);

                circle.sendToBack();

            }, { crossOrigin: 'Anonymous' });
            // Agregar el texto "holis"
            fabricTextD = new fabric.Textbox(image_text_carru.title, {
                left: 300,
                top: 100,
                width: 190,
                fill: '#121212',
                fontSize: 28,
                fontWeight: 'bold',
                fontFamily: 'Poppins',
                textAlign: 'right',
                textWrapping: 'auto',
                selectable: false,
                //plitByGrapheme: true
            });

            allObjects.push(fabricTextD);
            /*
            let numLines = fabricTextD.textLines.length;
            if (numLines >= 3) {
                // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
                fabricTextD.top = 190;
            }

            else if (numLines == 1) {
                // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
                fabricTextD.top = 250;
            }

            else if (numLines == 2) {
                // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
                fabricTextD.top = 210;
            }
            */

            fabricTextPetit = new fabric.Textbox(image_text_carru.info, {
                left: 300,
                top: 200,
                width: 190,
                fill: '#121212',
                fontSize: 22,
                textAlign: 'right',
                textWrapping: 'auto',
                selectable: false,
                //plitByGrapheme: true
            });

            allObjects.push(fabricTextPetit);


            if (author) {
                fabricTextIG = new fabric.Textbox('@' + authorName, {
                    left: 340,
                    top: 465,
                    width: 105,
                    fill: '#121212',
                    fontSize: 16,
                    fontWeight: 'lighter',
                    textAlign: 'right',
                    textWrapping: 'auto',
                    selectable: false,
                    //plitByGrapheme: true
                });

                fabricTextIG.customProperty = 'IgUser'

                allObjects.push(fabricTextIG);
                canvas.add(fabricTextIG);
            }

            canvas.add(fabricTextD);
            canvas.add(fabricTextPetit);

        } else if (photoType === 'signature') {
            let canvasRect;

            // Agregar la imagen de fondo con el filtro de desenfoque

            fabric.Image.fromURL(backgroundImageSrc, function (img) {

                img.scaleToWidth(canvas.width);


                img.filters.push(new fabric.Image.filters.Blur({
                    //blur: 0.2 // Valor del desenfoque (0 para sin desenfoque, aumenta para mayor desenfoque)
                }, { crossOrigin: 'Anonymous' }));
                img.applyFilters();
                canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));


                let circle = new fabric.Circle({
                    left: 0,       // Posición en X del círculo
                    top: 256,        // Posición en Y del círculo
                    radius: 512,     // Radio del círculo (20 en este caso)
                    selectable: false,
                    evented: false,
                    fill: '#f5efd7',
                });


                if (author) {
                    // Cargar la imagen desde URL
                    fabric.Image.fromURL(authorPhoto, function (imgX) {
                        imgX.scaleToWidth(1024);

                        // Configurar la imagen
                        //imgX.scaleToWidth(80); // Ajustar el ancho de la imagen
                        //imgX.scale(0.5);
                        imgX.scaleToWidth(80);
                        imgX.set({
                            left: 120,
                            top: 350,
                            selectable: false,
                            evented: false,
                        });

                        // Crear un círculo de recorte
                        var clipPath = new fabric.Circle({
                            radius: 470,
                            originX: 'center',
                            originY: 'center',
                            selectable: false,
                            evented: false,
                        });

                        // Aplicar el círculo de recorte a la imagen
                        imgX.clipPath = clipPath;

                        // Agregar la imagen al lienzo
                        canvas.add(imgX);
                    });

                    let round = new fabric.Circle({
                        left: 120,
                        top: 350,
                        radius: 40,
                        selectable: false,
                        evented: false,
                        fill: '#f5efd7',
                    });

                    canvas.add(round);
                }
                canvas.add(circle);

                circle.sendToBack();

                let iconSize = 30;
                let left = 120;
                let top = 470;
                // ICONS
                fabric.Image.fromURL('https://cdn-icons-png.flaticon.com/512/3756/3756555.png ', function (imgX) {
                    // Configurar la imagen
                    //imgX.scaleToWidth(80); // Ajustar el ancho de la imagen
                    //imgX.scale(0.5);
                    imgX.scaleToWidth(iconSize);
                    imgX.set({
                        left: left,
                        top: top,
                        selectable: false,
                        evented: false
                    });

                    // Crear un círculo de recorte
                    var clipPath = new fabric.Circle({
                        radius: 470,
                        originX: 'center',
                        originY: 'center',
                        selectable: false,
                        evented: false,
                    });

                    // Aplicar el círculo de recorte a la imagen
                    imgX.clipPath = clipPath;

                    // Agregar la imagen al lienzo
                    canvas.add(imgX);
                });

                fabric.Image.fromURL('   https://cdn-icons-png.flaticon.com/512/2462/2462844.png  ', function (imgX) {
                    // Configurar la imagen
                    //imgX.scaleToWidth(80); // Ajustar el ancho de la imagen
                    //imgX.scale(0.5);
                    imgX.scaleToWidth(iconSize);
                    imgX.set({
                        left: left + 40,
                        top: top,
                        selectable: false,
                        evented: false
                    });

                    // Crear un círculo de recorte
                    var clipPath = new fabric.Circle({
                        radius: 470,
                        originX: 'center',
                        originY: 'center',
                        selectable: false,
                        evented: false,
                    });

                    // Aplicar el círculo de recorte a la imagen
                    imgX.clipPath = clipPath;

                    // Agregar la imagen al lienzo
                    canvas.add(imgX);
                });

                fabric.Image.fromURL('   https://cdn-icons-png.flaticon.com/512/2099/2099189.png  ', function (imgX) {
                    // Configurar la imagen
                    //imgX.scaleToWidth(80); // Ajustar el ancho de la imagen
                    //imgX.scale(0.5);
                    imgX.scaleToWidth(iconSize);
                    imgX.set({
                        left: left + 80,
                        top: top,
                        selectable: false,
                        evented: false
                    });

                    // Crear un círculo de recorte
                    var clipPath = new fabric.Circle({
                        radius: 470,
                        originX: 'center',
                        originY: 'center',
                        selectable: false,
                        evented: false,
                    });

                    // Aplicar el círculo de recorte a la imagen
                    imgX.clipPath = clipPath;

                    // Agregar la imagen al lienzo
                    canvas.add(imgX);
                });

                fabric.Image.fromURL('   https://cdn-icons-png.flaticon.com/512/102/102279.png  ', function (imgX) {
                    // Configurar la imagen
                    //imgX.scaleToWidth(80); // Ajustar el ancho de la imagen
                    //imgX.scale(0.5);
                    imgX.scaleToWidth(iconSize);
                    imgX.set({
                        left: left + 350,
                        top: top,
                        selectable: false,
                        evented: false
                    });

                    // Crear un círculo de recorte
                    var clipPath = new fabric.Circle({
                        radius: 470,
                        originX: 'center',
                        originY: 'center',
                        selectable: false,
                        evented: false,
                    });

                    // Aplicar el círculo de recorte a la imagen
                    imgX.clipPath = clipPath;

                    // Agregar la imagen al lienzo
                    canvas.add(imgX);
                });

            }, { crossOrigin: 'Anonymous' });
            // Agregar el texto "holis"
            fabricTextD = new fabric.Textbox(image_text_carru.title, {
                left: 300,
                top: 320,
                width: 190,
                fill: '#121212',
                fontSize: 26,
                textAlign: 'right',
                textWrapping: 'auto',
                selectable: false,
                //plitByGrapheme: true
            });

            allObjects.push(fabricTextD)
            /*
            let numLines = fabricTextD.textLines.length;
            if (numLines >= 3) {
                // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
                fabricTextD.top = 190;
            }

            else if (numLines == 1) {
                // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
                fabricTextD.top = 250;
            }

            else if (numLines == 2) {
                // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
                fabricTextD.top = 210;
            }
            */


            if (author) {
                fabricTextIG = new fabric.Textbox('@' + authorName, {
                    left: 200,
                    top: 380,
                    width: 105,
                    fill: '#121212',
                    fontSize: 25,
                    fontWeight: 'bold',
                    fontFamily: 'Poppins',
                    textAlign: 'left',
                    textWrapping: 'auto',
                    selectable: false,
                    //plitByGrapheme: true
                });

                fabricTextIG.customProperty = 'IgUser'

                allObjects.push(fabricTextIG);
                canvas.add(fabricTextIG);
            }

            canvas.add(fabricTextD);
        } else {
            // Agregar la imagen de fondo sin filtro de desenfoque
            fabric.Image.fromURL(backgroundImageSrc, function (img) {


                img.scaleToWidth(canvas.width);

                img.set({
                    left: 130,  // Ajusta este valor según lo que necesites
                });

                canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));

                let circle = new fabric.Circle({
                    left: 0 - 700,       // Posición en X del círculo
                    top: 0 - 256,        // Posición en Y del círculo
                    radius: 512,     // Radio del círculo (20 en este caso)
                    selectable: false,
                    evented: false,
                    fill: '#f5efd7',
                });
                canvas.add(circle);
                circle.sendToBack();

            }, { crossOrigin: 'Anonymous' });
            // Agregar el texto "holis"
            fabricTextD = new fabric.Textbox(image_text_carru, {
                left: 10,
                top: 200,
                width: 290,
                fill: '#121212',
                fontSize: 28,
                fontWeight: 'bold',
                fontFamily: 'Poppins',
                textAlign: 'left',
                textWrapping: 'auto',
                selectable: false,
            });
            allObjects.push(fabricTextD)

            /*
            let numLines = fabricTextD.textLines.length;
            if (numLines == 3) {
                // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
                fabricTextD.fontSize = 25;
                fabricTextD.top = 400;

            }

            else if (numLines == 2) {
                fabricTextD.fontSize = 25;
                fabricTextD.top = 400;
            }

            else if (numLines == 1) {
                // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
                fabricTextD.top = 400;
            }

            else if (numLines > 3) {
                // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
                fabricTextD.fontSize = 25;
                fabricTextD.top = 340;
            }
            */
            canvas.add(fabricTextD);

        }
    }

    else if (format === INFORMARTIVO) {


        if (photoType === 'carru') {
            let canvasRect;

            // Agregar la imagen de fondo con el filtro de desenfoque

            fabric.Image.fromURL(backgroundImageSrc, function (img) {

                img.scaleToWidth(canvas.width);

                img.filters.push(new fabric.Image.filters.Blur({
                    //blur: 0.2 // Valor del desenfoque (0 para sin desenfoque, aumenta para mayor desenfoque)
                }, { crossOrigin: 'Anonymous' }));
                img.applyFilters();
                canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));


                let rect = new fabric.Rect({
                    left: 400,   // Posición en X del rectángulo
                    top: -1,    // Posición en Y del rectángulo
                    width: 720, // Ancho del rectángulo
                    height: 1026,// Altura del rectángulo
                    //rx: 20,
                    //ry: 20,
                    fill: 'rgba(18,18,18,0.65)',
                    selectable: false,
                    evented: false,
                });

                canvas.add(rect);
                rect.sendToBack();

                if (author) {
                    // Cargar la imagen desde URL
                    fabric.Image.fromURL(authorPhoto, function (imgX) {

                        // Configurar la imagen
                        //imgX.scaleToWidth(80); // Ajustar el ancho de la imagen
                        //imgX.scale(0.5);
                        imgX.scaleToWidth(110);
                        imgX.set({
                            left: 900,
                            top: 900,
                            selectable: false,
                            evented: false,
                        });

                        // Crear un círculo de recorte
                        var clipPath = new fabric.Circle({
                            radius: 470,
                            originX: 'center',
                            originY: 'center',
                            selectable: false,
                            evented: false,
                        });

                        // Aplicar el círculo de recorte a la imagen
                        imgX.clipPath = clipPath;

                        // Agregar la imagen al lienzo
                        canvas.add(imgX);
                    }, { crossOrigin: 'Anonymous' });

                    let circle = new fabric.Circle({
                        left: 900,
                        top: 900,
                        radius: 56,
                        selectable: false,
                        evented: false,
                        fill: '#121212',
                    });

                    canvas.add(circle);
                    //canvas.add(photo);
                }

            }, { crossOrigin: 'Anonymous' });
            // Agregar el texto "holis"
            fabricTextD = new fabric.Textbox(image_text_carru.title.toUpperCase(), {
                left: 440,
                top: 100,
                height: 230,
                width: 540,
                fill: 'white',
                fontSize: 110,
                fontFamily: 'League Gothic',
                textAlign: 'left',
                textWrapping: 'auto',
                lineHeight: 0.85,
                selectable: false,
                //plitByGrapheme: true
            });

            let numLines = fabricTextD.textLines.length;
            if (numLines >= 3) {
                // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
                fabricTextD.fontSize = 80;
            }

            fabricTextPetit = new fabric.Textbox(image_text_carru.info.toLowerCase(), {
                left: 440,
                top: 330,
                width: 540,
                fill: 'white',
                fontSize: 50,
                fontFamily: 'Poppins',
                textAlign: 'left',
                textWrapping: 'auto',
                selectable: false,
                //plitByGrapheme: true
            });

            let numLinesPetit = fabricTextPetit.textLines.length;
            if (numLinesPetit >= 10) {
                // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
                fabricTextPetit.fontSize = 45;
            }



            allObjects.push(fabricTextD);
            allObjects.push(fabricTextPetit);

            /*
            let numLines = fabricTextD.textLines.length;
            if (numLines >= 3) {
                // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
                fabricTextD.top = 190;
            }

            else if (numLines == 1) {
                // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
                fabricTextD.top = 250;
            }

            else if (numLines == 2) {
                // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
                fabricTextD.top = 210;
            }
            */


            if (author) {
                fabricTextIG = new fabric.Textbox('@' + authorName, {
                    left: 680,
                    top: 930,
                    width: 210,
                    fill: 'white',
                    fontSize: 32,
                    fontWeight: 'lighter',
                    textAlign: 'right',
                    textWrapping: 'auto',
                    selectable: false,
                    //plitByGrapheme: true
                });

                fabricTextIG.customProperty = 'IgUser'

                allObjects.push(fabricTextIG);
                canvas.add(fabricTextIG);
            }

            canvas.add(fabricTextD);
            canvas.add(fabricTextPetit);


        } else if (photoType === 'signature') {

            fabric.Image.fromURL(backgroundImageSrc, function (img) {

                img.scaleToWidth(canvas.width);

                img.filters.push(new fabric.Image.filters.Blur({
                    //blur: 0.2 // Valor del desenfoque (0 para sin desenfoque, aumenta para mayor desenfoque)
                }, { crossOrigin: 'Anonymous' }));
                img.applyFilters();
                canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));

                let rect = new fabric.Rect({
                    left: -1,   // Posición en X del rectángulo
                    top: -1,    // Posición en Y del rectángulo
                    width: 1026, // Ancho del rectángulo
                    height: 1026,// Altura del rectángulo
                    //rx: 20,
                    //ry: 20,
                    fill: '#252850',
                    selectable: false,
                    evented: false,
                });

                canvas.add(rect);
                rect.sendToBack();

                if (author) {
                    // Cargar la imagen desde URL
                    fabric.Image.fromURL(authorPhoto, function (imgX) {

                        // Configurar la imagen
                        //imgX.scaleToWidth(80); // Ajustar el ancho de la imagen
                        //imgX.scale(0.5);
                        imgX.scaleToWidth(220);
                        imgX.set({
                            left: 391,
                            top: 200,
                            selectable: false,
                            evented: false,
                        });

                        // Crear un círculo de recorte
                        var clipPath = new fabric.Circle({
                            radius: 470,
                            originX: 'center',
                            originY: 'center',
                            selectable: false,
                            evented: false,
                        });

                        // Aplicar el círculo de recorte a la imagen
                        imgX.clipPath = clipPath;

                        // Agregar la imagen al lienzo
                        canvas.add(imgX);
                    }, { crossOrigin: 'Anonymous' });

                    let circle = new fabric.Circle({
                        left: 380,
                        top: 190,
                        radius: 120,
                        selectable: false,
                        evented: false,
                        fill: '#121212',
                    });

                    canvas.add(circle);
                    //canvas.add(photo);
                }

                let iconSize = 80;
                let iconTop = 900;
                let iconLeft = 40;
                // ICONS
                fabric.Image.fromURL('https://cdn-icons-png.flaticon.com/512/3756/3756555.png ', function (imgX) {
                    // Configurar la imagen
                    //imgX.scaleToWidth(80); // Ajustar el ancho de la imagen
                    //imgX.scale(0.5);
                    imgX.scaleToWidth(iconSize);
                    imgX.set({
                        left: iconLeft,
                        top: iconTop,
                        selectable: false,
                        evented: false
                    });

                    // Crear un círculo de recorte
                    var clipPath = new fabric.Circle({
                        radius: 470,
                        originX: 'center',
                        originY: 'center',
                        selectable: false,
                        evented: false,
                    });

                    // Aplicar el círculo de recorte a la imagen
                    imgX.clipPath = clipPath;

                    // Agregar la imagen al lienzo
                    canvas.add(imgX);
                }, { crossOrigin: 'Anonymous' });

                fabric.Image.fromURL('   https://cdn-icons-png.flaticon.com/512/2462/2462844.png  ', function (imgX) {
                    // Configurar la imagen
                    //imgX.scaleToWidth(80); // Ajustar el ancho de la imagen
                    //imgX.scale(0.5);
                    imgX.scaleToWidth(iconSize);
                    imgX.set({
                        left: iconLeft + 120,
                        top: iconTop,
                        selectable: false,
                        evented: false
                    });

                    // Crear un círculo de recorte
                    var clipPath = new fabric.Circle({
                        radius: 470,
                        originX: 'center',
                        originY: 'center',
                        selectable: false,
                        evented: false,
                    });

                    // Aplicar el círculo de recorte a la imagen
                    imgX.clipPath = clipPath;

                    // Agregar la imagen al lienzo
                    canvas.add(imgX);
                }, { crossOrigin: 'Anonymous' });

                fabric.Image.fromURL('   https://cdn-icons-png.flaticon.com/512/2099/2099189.png  ', function (imgX) {
                    // Configurar la imagen
                    //imgX.scaleToWidth(80); // Ajustar el ancho de la imagen
                    //imgX.scale(0.5);
                    imgX.scaleToWidth(iconSize);
                    imgX.set({
                        left: iconLeft + 240,
                        top: iconTop,
                        selectable: false,
                        evented: false
                    });

                    // Crear un círculo de recorte
                    var clipPath = new fabric.Circle({
                        radius: 470,
                        originX: 'center',
                        originY: 'center',
                        selectable: false,
                        evented: false,
                    });

                    // Aplicar el círculo de recorte a la imagen
                    imgX.clipPath = clipPath;

                    // Agregar la imagen al lienzo
                    canvas.add(imgX);
                }, { crossOrigin: 'Anonymous' });

                fabric.Image.fromURL('   https://cdn-icons-png.flaticon.com/512/102/102279.png  ', function (imgX) {
                    // Configurar la imagen
                    //imgX.scaleToWidth(80); // Ajustar el ancho de la imagen
                    //imgX.scale(0.5);
                    imgX.scaleToWidth(iconSize);
                    imgX.set({
                        left: iconLeft + 866,
                        top: iconTop,
                        selectable: false,
                        evented: false
                    });

                    // Crear un círculo de recorte
                    var clipPath = new fabric.Circle({
                        radius: 470,
                        originX: 'center',
                        originY: 'center',
                        selectable: false,
                        evented: false,
                    });

                    // Aplicar el círculo de recorte a la imagen
                    imgX.clipPath = clipPath;

                    // Agregar la imagen al lienzo
                    canvas.add(imgX);
                }, { crossOrigin: 'Anonymous' });

            }, { crossOrigin: 'Anonymous' });
            // Agregar el texto "holis"
            fabricTextD = new fabric.Textbox(image_text_carru.title.toUpperCase(), {
                left: 240,
                top: 460,
                height: 200,
                width: 540,
                fill: 'white',
                fontSize: 110,
                fontFamily: 'League Gothic',
                textAlign: 'center',
                textWrapping: 'auto',
                lineHeight: 0.85,
                selectable: false,
                //plitByGrapheme: true
            });

            fabricTextPetit = new fabric.Textbox(image_text_carru.info.toLowerCase(), {
                left: 240,
                top: 720,
                width: 540,
                fill: 'white',
                fontSize: 50,
                fontFamily: 'Poppins',
                textAlign: 'center',
                textWrapping: 'auto',
                selectable: false,
                //plitByGrapheme: true
            });



            allObjects.push(fabricTextD);
            allObjects.push(fabricTextPetit);

            /*
            let numLines = fabricTextD.textLines.length;
            if (numLines >= 3) {
                // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
                fabricTextD.top = 190;
            }

            else if (numLines == 1) {
                // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
                fabricTextD.top = 250;
            }

            else if (numLines == 2) {
                // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
                fabricTextD.top = 210;
            }
            */


            if (author) {
                fabricTextIG = new fabric.Textbox('@' + authorName, {
                    left: 335,
                    top: 100,
                    width: 210,
                    fill: 'white',
                    fontSize: 80,
                    fontWeight: 'lighter',
                    fontFamily: 'Poppins',
                    textAlign: 'right',
                    textWrapping: 'auto',
                    selectable: false,
                    //plitByGrapheme: true
                });

                fabricTextIG.customProperty = 'IgUser'

                allObjects.push(fabricTextIG);
                canvas.add(fabricTextIG);
            }

            canvas.add(fabricTextD);
            canvas.add(fabricTextPetit);
        } else {
            // Agregar la imagen de fondo sin filtro de desenfoque
            fabric.Image.fromURL(backgroundImageSrc, function (img) {


                img.scaleToWidth(canvas.width);

                canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));

                // Agregar el rectángulo negro
                let rect = new fabric.Rect({
                    left: -1,   // Posición en X del rectángulo
                    top: -1,    // Posición en Y del rectángulo
                    width: 720, // Ancho del rectángulo
                    height: 1026,// Altura del rectángulo
                    //rx: 20,
                    //ry: 20,
                    fill: 'rgba(18,18,18,0.5)',
                    selectable: false,
                    evented: false,
                });

                canvas.add(rect);
                rect.sendToBack();

            }, { crossOrigin: 'Anonymous' });
            // Agregar el texto "holis"

            fabricTextD = new fabric.Textbox(image_text_carru.toUpperCase(), {
                left: 40,
                top: 100,
                width: 640,
                fill: 'white',
                fontSize: 120,
                fontFamily: 'League Gothic',
                textAlign: 'left',
                textWrapping: 'auto',
                lineHeight: 0.95,
                selectable: false,
            });

            allObjects.push(fabricTextD);

            /*
            let numLines = fabricTextD.textLines.length;
            if (numLines == 3) {
                // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
                fabricTextD.fontSize = 25;
                fabricTextD.top = 400;

            }

            else if (numLines == 2) {
                fabricTextD.fontSize = 25;
                fabricTextD.top = 400;
            }

            else if (numLines == 1) {
                // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
                fabricTextD.top = 400;
            }

            else if (numLines > 3) {
                // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
                fabricTextD.fontSize = 25;
                fabricTextD.top = 340;
            }
            */
            canvas.add(fabricTextD);
            canvas.renderAll();

            fabric.Image.fromURL('     https://cdn-icons-png.flaticon.com/512/523/523029.png  ', function (imgX) {
                // Configurar la imagen
                //imgX.scaleToWidth(80); // Ajustar el ancho de la imagen
                //imgX.scale(0.5);
                imgX.scaleToWidth(160);
                imgX.set({
                    left: 800,
                    top: 430,
                    selectable: false,

                });

                // Crear un círculo de recorte
                var clipPath = new fabric.Circle({
                    radius: 470,
                    originX: 'center',
                    originY: 'center',
                    selectable: false,

                });

                // Aplicar el círculo de recorte a la imagen
                imgX.rotate(-90);
                imgX.clipPath = clipPath;

                allObjects.push(imgX)

                // Agregar la imagen al lienzo
                canvas.add(imgX);
            }, { crossOrigin: 'Anonymous' });
        }


    }

    else if (format === TIPS) {


        if (photoType === 'carru') {
            let canvasRect;

            // Agregar la imagen de fondo con el filtro de desenfoque

            fabric.Image.fromURL(backgroundImageSrc, function (img) {

                img.scaleToWidth(canvas.width);

                img.filters.push(new fabric.Image.filters.Blur({
                    //blur: 0.2 // Valor del desenfoque (0 para sin desenfoque, aumenta para mayor desenfoque)
                }, { crossOrigin: 'Anonymous' }));
                img.applyFilters();
                canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));


                let rect = new fabric.Rect({
                    left: 400,   // Posición en X del rectángulo
                    top: -1,    // Posición en Y del rectángulo
                    width: 720, // Ancho del rectángulo
                    height: 1026,// Altura del rectángulo
                    //rx: 20,
                    //ry: 20,
                    fill: 'rgba(18,18,18,0.65)',
                    selectable: false,
                    evented: false,
                });

                canvas.add(rect);
                rect.sendToBack();

                if (author) {
                    // Cargar la imagen desde URL
                    fabric.Image.fromURL(authorPhoto, function (imgX) {

                        // Configurar la imagen
                        //imgX.scaleToWidth(80); // Ajustar el ancho de la imagen
                        //imgX.scale(0.5);
                        imgX.scaleToWidth(110);
                        imgX.set({
                            left: 900,
                            top: 900,
                            selectable: false,
                            evented: false,
                        });

                        // Crear un círculo de recorte
                        var clipPath = new fabric.Circle({
                            radius: 470,
                            originX: 'center',
                            originY: 'center',
                            selectable: false,
                            evented: false,
                        });

                        // Aplicar el círculo de recorte a la imagen
                        imgX.clipPath = clipPath;

                        // Agregar la imagen al lienzo
                        canvas.add(imgX);
                    }, { crossOrigin: 'Anonymous' });

                    let circle = new fabric.Circle({
                        left: 900,
                        top: 900,
                        radius: 56,
                        selectable: false,
                        evented: false,
                        fill: '#121212',
                    });

                    canvas.add(circle);
                    //canvas.add(photo);
                }

            }, { crossOrigin: 'Anonymous' });
            // Agregar el texto "holis"
            fabricTextD = new fabric.Textbox(image_text_carru.title.toUpperCase(), {
                left: 440,
                top: 100,
                height: 230,
                width: 540,
                fill: 'white',
                fontSize: 110,
                fontFamily: 'League Gothic',
                textAlign: 'left',
                textWrapping: 'auto',
                lineHeight: 0.85,
                selectable: false,
                //plitByGrapheme: true
            });

            let numLines = fabricTextD.textLines.length;
            if (numLines >= 3) {
                // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
                fabricTextD.fontSize = 80;
            }

            fabricTextPetit = new fabric.Textbox(image_text_carru.info.toLowerCase(), {
                left: 440,
                top: 350,
                width: 540,
                fill: 'white',
                fontSize: 45,
                fontFamily: 'Poppins',
                textAlign: 'left',
                textWrapping: 'auto',
                selectable: false,
                //plitByGrapheme: true
            });

            let numLinesPetit = fabricTextPetit.textLines.length;
            if (numLinesPetit >= 10) {
                // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
                fabricTextPetit.fontSize = 38;
            }



            allObjects.push(fabricTextD);
            allObjects.push(fabricTextPetit);

            /*
            let numLines = fabricTextD.textLines.length;
            if (numLines >= 3) {
                // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
                fabricTextD.top = 190;
            }

            else if (numLines == 1) {
                // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
                fabricTextD.top = 250;
            }

            else if (numLines == 2) {
                // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
                fabricTextD.top = 210;
            }
            */


            if (author) {
                fabricTextIG = new fabric.Textbox('@' + authorName, {
                    left: 680,
                    top: 930,
                    width: 210,
                    fill: 'white',
                    fontSize: 32,
                    fontWeight: 'lighter',
                    textAlign: 'right',
                    textWrapping: 'auto',
                    selectable: false,
                    //plitByGrapheme: true
                });

                fabricTextIG.customProperty = 'IgUser'

                allObjects.push(fabricTextIG);
                canvas.add(fabricTextIG);
            }

            canvas.add(fabricTextD);
            canvas.add(fabricTextPetit);


        } else if (photoType === 'signature') {

            fabric.Image.fromURL(backgroundImageSrc, function (img) {

                img.scaleToWidth(canvas.width);

                img.filters.push(new fabric.Image.filters.Blur({
                    //blur: 0.2 // Valor del desenfoque (0 para sin desenfoque, aumenta para mayor desenfoque)
                }, { crossOrigin: 'Anonymous' }));
                img.applyFilters();
                canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));

                let rect = new fabric.Rect({
                    left: -1,   // Posición en X del rectángulo
                    top: -1,    // Posición en Y del rectángulo
                    width: 1026, // Ancho del rectángulo
                    height: 1026,// Altura del rectángulo
                    //rx: 20,
                    //ry: 20,
                    fill: '#252850',
                    selectable: false,
                    evented: false,
                });

                canvas.add(rect);
                rect.sendToBack();

                if (author) {
                    // Cargar la imagen desde URL
                    fabric.Image.fromURL(authorPhoto, function (imgX) {

                        // Configurar la imagen
                        //imgX.scaleToWidth(80); // Ajustar el ancho de la imagen
                        //imgX.scale(0.5);
                        imgX.scaleToWidth(220);
                        imgX.set({
                            left: 391,
                            top: 200,
                            selectable: false,
                            evented: false,
                        });

                        // Crear un círculo de recorte
                        var clipPath = new fabric.Circle({
                            radius: 470,
                            originX: 'center',
                            originY: 'center',
                            selectable: false,
                            evented: false,
                        });

                        // Aplicar el círculo de recorte a la imagen
                        imgX.clipPath = clipPath;

                        // Agregar la imagen al lienzo
                        canvas.add(imgX);
                    }, { crossOrigin: 'Anonymous' });

                    let circle = new fabric.Circle({
                        left: 380,
                        top: 190,
                        radius: 120,
                        selectable: false,
                        evented: false,
                        fill: '#121212',
                    });

                    canvas.add(circle);
                    //canvas.add(photo);
                }

                let iconSize = 80;
                let iconTop = 900;
                let iconLeft = 40;
                // ICONS
                fabric.Image.fromURL('https://cdn-icons-png.flaticon.com/512/3756/3756555.png ', function (imgX) {
                    // Configurar la imagen
                    //imgX.scaleToWidth(80); // Ajustar el ancho de la imagen
                    //imgX.scale(0.5);
                    imgX.scaleToWidth(iconSize);
                    imgX.set({
                        left: iconLeft,
                        top: iconTop,
                        selectable: false,
                        evented: false
                    });

                    // Crear un círculo de recorte
                    var clipPath = new fabric.Circle({
                        radius: 470,
                        originX: 'center',
                        originY: 'center',
                        selectable: false,
                        evented: false,
                    });

                    // Aplicar el círculo de recorte a la imagen
                    imgX.clipPath = clipPath;

                    // Agregar la imagen al lienzo
                    canvas.add(imgX);
                }, { crossOrigin: 'Anonymous' });

                fabric.Image.fromURL('   https://cdn-icons-png.flaticon.com/512/2462/2462844.png  ', function (imgX) {
                    // Configurar la imagen
                    //imgX.scaleToWidth(80); // Ajustar el ancho de la imagen
                    //imgX.scale(0.5);
                    imgX.scaleToWidth(iconSize);
                    imgX.set({
                        left: iconLeft + 120,
                        top: iconTop,
                        selectable: false,
                        evented: false
                    });

                    // Crear un círculo de recorte
                    var clipPath = new fabric.Circle({
                        radius: 470,
                        originX: 'center',
                        originY: 'center',
                        selectable: false,
                        evented: false,
                    });

                    // Aplicar el círculo de recorte a la imagen
                    imgX.clipPath = clipPath;

                    // Agregar la imagen al lienzo
                    canvas.add(imgX);
                }, { crossOrigin: 'Anonymous' });

                fabric.Image.fromURL('   https://cdn-icons-png.flaticon.com/512/2099/2099189.png  ', function (imgX) {
                    // Configurar la imagen
                    //imgX.scaleToWidth(80); // Ajustar el ancho de la imagen
                    //imgX.scale(0.5);
                    imgX.scaleToWidth(iconSize);
                    imgX.set({
                        left: iconLeft + 240,
                        top: iconTop,
                        selectable: false,
                        evented: false
                    });

                    // Crear un círculo de recorte
                    var clipPath = new fabric.Circle({
                        radius: 470,
                        originX: 'center',
                        originY: 'center',
                        selectable: false,
                        evented: false,
                    });

                    // Aplicar el círculo de recorte a la imagen
                    imgX.clipPath = clipPath;

                    // Agregar la imagen al lienzo
                    canvas.add(imgX);
                }, { crossOrigin: 'Anonymous' });

                fabric.Image.fromURL('   https://cdn-icons-png.flaticon.com/512/102/102279.png  ', function (imgX) {
                    // Configurar la imagen
                    //imgX.scaleToWidth(80); // Ajustar el ancho de la imagen
                    //imgX.scale(0.5);
                    imgX.scaleToWidth(iconSize);
                    imgX.set({
                        left: iconLeft + 866,
                        top: iconTop,
                        selectable: false,
                        evented: false
                    });

                    // Crear un círculo de recorte
                    var clipPath = new fabric.Circle({
                        radius: 470,
                        originX: 'center',
                        originY: 'center',
                        selectable: false,
                        evented: false,
                    });

                    // Aplicar el círculo de recorte a la imagen
                    imgX.clipPath = clipPath;

                    // Agregar la imagen al lienzo
                    canvas.add(imgX);
                }, { crossOrigin: 'Anonymous' });

            }, { crossOrigin: 'Anonymous' });
            // Agregar el texto "holis"
            fabricTextD = new fabric.Textbox(image_text_carru.title.toUpperCase(), {
                left: 240,
                top: 460,
                height: 200,
                width: 540,
                fill: 'white',
                fontSize: 110,
                fontFamily: 'League Gothic',
                textAlign: 'center',
                textWrapping: 'auto',
                lineHeight: 0.85,
                selectable: false,
                //plitByGrapheme: true
            });

            fabricTextPetit = new fabric.Textbox(image_text_carru.info.toLowerCase(), {
                left: 240,
                top: 720,
                width: 540,
                fill: 'white',
                fontSize: 50,
                fontFamily: 'Poppins',
                textAlign: 'center',
                textWrapping: 'auto',
                selectable: false,
                //plitByGrapheme: true
            });



            allObjects.push(fabricTextD);
            allObjects.push(fabricTextPetit);

            /*
            let numLines = fabricTextD.textLines.length;
            if (numLines >= 3) {
                // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
                fabricTextD.top = 190;
            }

            else if (numLines == 1) {
                // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
                fabricTextD.top = 250;
            }

            else if (numLines == 2) {
                // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
                fabricTextD.top = 210;
            }
            */


            if (author) {
                fabricTextIG = new fabric.Textbox('@' + authorName, {
                    left: 335,
                    top: 100,
                    width: 210,
                    fill: 'white',
                    fontSize: 80,
                    fontWeight: 'lighter',
                    fontFamily: 'Poppins',
                    textAlign: 'right',
                    textWrapping: 'auto',
                    selectable: false,
                    //plitByGrapheme: true
                });

                fabricTextIG.customProperty = 'IgUser'

                allObjects.push(fabricTextIG);
                canvas.add(fabricTextIG);
            }

            canvas.add(fabricTextD);
            canvas.add(fabricTextPetit);
        } else {
            // Agregar la imagen de fondo sin filtro de desenfoque
            fabric.Image.fromURL(backgroundImageSrc, function (img) {


                img.scaleToWidth(canvas.width);

                canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));

                // Agregar el rectángulo negro
                let rect = new fabric.Rect({
                    left: -1,   // Posición en X del rectángulo
                    top: -1,    // Posición en Y del rectángulo
                    width: 720, // Ancho del rectángulo
                    height: 1026,// Altura del rectángulo
                    //rx: 20,
                    //ry: 20,
                    fill: 'rgba(18,18,18,0.5)',
                    selectable: false,
                    evented: false,
                });

                canvas.add(rect);
                rect.sendToBack();

            }, { crossOrigin: 'Anonymous' });
            // Agregar el texto "holis"

            fabricTextD = new fabric.Textbox("4 " + image_text_carru.toUpperCase(), {
                left: 40,
                top: 100,
                width: 640,
                fill: 'white',
                fontSize: 120,
                fontFamily: 'League Gothic',
                textAlign: 'left',
                textWrapping: 'auto',
                lineHeight: 0.95,
                selectable: false,
            });

            allObjects.push(fabricTextD);

            /*
            let numLines = fabricTextD.textLines.length;
            if (numLines == 3) {
                // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
                fabricTextD.fontSize = 25;
                fabricTextD.top = 400;

            }

            else if (numLines == 2) {
                fabricTextD.fontSize = 25;
                fabricTextD.top = 400;
            }

            else if (numLines == 1) {
                // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
                fabricTextD.top = 400;
            }

            else if (numLines > 3) {
                // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
                fabricTextD.fontSize = 25;
                fabricTextD.top = 340;
            }
            */
            canvas.add(fabricTextD);
            canvas.renderAll();

            fabric.Image.fromURL('     https://cdn-icons-png.flaticon.com/512/523/523029.png  ', function (imgX) {
                // Configurar la imagen
                //imgX.scaleToWidth(80); // Ajustar el ancho de la imagen
                //imgX.scale(0.5);
                imgX.scaleToWidth(160);
                imgX.set({
                    left: 800,
                    top: 430,
                    selectable: false,

                });

                // Crear un círculo de recorte
                var clipPath = new fabric.Circle({
                    radius: 470,
                    originX: 'center',
                    originY: 'center',
                    selectable: false,

                });

                // Aplicar el círculo de recorte a la imagen
                imgX.rotate(-90);
                imgX.clipPath = clipPath;

                allObjects.push(imgX)

                // Agregar la imagen al lienzo
                canvas.add(imgX);
            }, { crossOrigin: 'Anonymous' });
        }


    }

    else if (format === AUTHOR_PHRASE_1) {
        // Agregar la imagen de fondo sin filtro de desenfoque
        fabric.Image.fromURL(backgroundImageSrc, function (img) {


            img.scaleToWidth(canvas.width);

            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));

            // Agregar el rectángulo negro
            let rect = new fabric.Rect({
                left: -1,   // Posición en X del rectángulo
                top: 550,    // Posición en Y del rectángulo
                width: 1024, // Ancho del rectángulo
                height: 600,// Altura del rectángulo
                //rx: 20,
                //ry: 20,
                fill: 'white',
                selectable: false,
                evented: false,
            });

            canvas.add(rect);
            rect.sendToBack();

        }, { crossOrigin: 'Anonymous' });
        // Agregar el texto "holis"

        fabricTextD = new fabric.Textbox(image_text_carru + '"', {
            left: 170,
            top: 610,
            width: 640,
            fill: '#121212',
            fontSize: 50,
            fontFamily: 'Lora',
            fontStyle: 'bold',
            textAlign: 'center',
            textWrapping: 'auto',
            lineHeight: 0.95,
            selectable: false,
        });

        allObjects.push(fabricTextD);

        // Prompt, con Capitalize
        fabricTextAuthor = new fabric.Textbox("- " + valuePromptInput.charAt(0).toUpperCase() + valuePromptInput.slice(1), {
            left: 170,
            top: 840,
            width: 640,
            fill: '#121212',
            fontSize: 40,
            fontFamily: 'Lora',
            fontStyle: 'bold',
            textAlign: 'center',
            textWrapping: 'auto',
            lineHeight: 0.95,
            selectable: false,
        });

        //https://cdn-icons-png.flaticon.com/512/7350/7350737.png

        allObjects.push(fabricTextAuthor);

        canvas.add(fabricTextD);
        canvas.add(fabricTextAuthor);
        canvas.renderAll();

        fabric.Image.fromURL('https://cdn-icons-png.flaticon.com/512/7350/7350737.png ', function (imgX) {
            // Configurar la imagen
            //imgX.scaleToWidth(80); // Ajustar el ancho de la imagen
            //imgX.scale(0.5);
            imgX.scaleToWidth(70);
            imgX.set({
                left: 130,
                top: 560,
                selectable: false,

            });

            // Crear un círculo de recorte
            var clipPath = new fabric.Circle({
                radius: 470,
                originX: 'center',
                originY: 'center',
                selectable: true,

            });

            // Aplicar el círculo de recorte a la imagen
            imgX.clipPath = clipPath;

            allObjects.push(imgX);

            // Agregar la imagen al lienzo
            canvas.add(imgX);
        }, { crossOrigin: 'Anonymous' });


        if (author) {
            // Cargar la imagen desde URL
            fabric.Image.fromURL(authorPhoto, function (imgX) {

                // Configurar la imagen
                //imgX.scaleToWidth(80); // Ajustar el ancho de la imagen
                //imgX.scale(0.5);
                imgX.scaleToWidth(110);
                imgX.set({
                    left: 440,
                    top: 895,
                    selectable: false,
                });

                // Crear un círculo de recorte
                var clipPath = new fabric.Circle({
                    radius: 470,
                    originX: 'center',
                    originY: 'center',
                    selectable: true,
                });

                // Aplicar el círculo de recorte a la imagen
                imgX.clipPath = clipPath;

                allObjects.push(imgX);

                // Agregar la imagen al lienzo
                canvas.add(imgX);
            }, { crossOrigin: 'Anonymous' });

            let circle = new fabric.Circle({
                left: 441,
                top: 897,
                radius: 54,
                selectable: false,
                fill: '#121212',
            });

            allObjects.push(circle);

            canvas.add(circle);
            //canvas.add(photo);

            // @
            fabricTextIG = new fabric.Textbox('@' + authorName, {
                left: 600,
                top: 980,
                width: 400,
                fill: '#121212',
                fontSize: 25,
                fontStyle: 'italic',
                fontWeight: 'lighter',
                textAlign: 'right',
                textWrapping: 'auto',
                selectable: false,
                //plitByGrapheme: true
            });

            //fabricTextIG.customProperty = 'IgUser'

            allObjects.push(fabricTextIG);
            canvas.add(fabricTextIG);
        }


    }
    else if (format === AUTHOR_PHRASE_2) {
        // Agregar la imagen de fondo sin filtro de desenfoque
        fabric.Image.fromURL(backgroundImageSrc, function (img) {


            img.scaleToWidth(canvas.width);

            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));

            // Agregar el rectángulo negro
            let rect = new fabric.Rect({
                left: 612,   // Posición en X del rectángulo
                top: 0,    // Posición en Y del rectángulo
                width: 612, // Ancho del rectángulo
                height: 1024,// Altura del rectángulo
                //rx: 20,
                //ry: 20,
                fill: '#191d5c',
                selectable: false,
                evented: false,

            });

            canvas.add(rect);
            rect.sendToBack();

        }, { crossOrigin: 'Anonymous' });
        // Agregar el texto "holis"

        fabricTextD = new fabric.Textbox(image_text_carru, {
            left: 670,
            top: 350,
            width: 300,
            fill: 'white',
            fontSize: 34,
            fontFamily: 'Poppins',
            textAlign: 'center',
            textWrapping: 'auto',
            lineHeight: 1.2,
            selectable: false,
        });

        allObjects.push(fabricTextD);



        // Prompt, con Capitalize
        fabricTextAuthor = new fabric.Textbox("- " + valuePromptInput.toUpperCase(), {
            left: 670,
            top: 700,
            width: 330,
            fill: 'white',
            fontSize: 28,
            fontFamily: 'Lora',
            textAlign: 'center',
            textWrapping: 'auto',
            lineHeight: 0.95,
            selectable: false,
        });

        //https://cdn-icons-png.flaticon.com/512/7350/7350737.png

        allObjects.push(fabricTextAuthor);

        canvas.add(fabricTextD);
        canvas.add(fabricTextAuthor);
        canvas.renderAll();

        fabric.Image.fromURL('https://cdn-icons-png.flaticon.com/512/7350/7350737.png ', function (imgX) {
            // Configurar la imagen
            //imgX.scaleToWidth(80); // Ajustar el ancho de la imagen
            //imgX.scale(0.5);
            imgX.scaleToWidth(100);
            imgX.set({
                left: 765,
                top: 150,
                selectable: false,

            });

            // Crear un círculo de recorte
            var clipPath = new fabric.Circle({
                radius: 470,
                originX: 'center',
                originY: 'center',
                selectable: true,

            });

            // Aplicar el círculo de recorte a la imagen
            imgX.clipPath = clipPath;

            allObjects.push(imgX);

            // Agregar la imagen al lienzo
            canvas.add(imgX);
        }, { crossOrigin: 'Anonymous' });


        if (author) {
            // Cargar la imagen desde URL
            fabric.Image.fromURL(authorPhoto, function (imgX) {

                // Configurar la imagen
                //imgX.scaleToWidth(80); // Ajustar el ancho de la imagen
                //imgX.scale(0.5);
                imgX.scaleToWidth(80);
                imgX.set({
                    left: 800,
                    top: 930,
                    selectable: false,
                });

                // Crear un círculo de recorte
                var clipPath = new fabric.Circle({
                    radius: 470,
                    originX: 'center',
                    originY: 'center',
                    selectable: true,
                });

                // Aplicar el círculo de recorte a la imagen
                imgX.clipPath = clipPath;

                allObjects.push(imgX);

                // Agregar la imagen al lienzo
                canvas.add(imgX);
            }, { crossOrigin: 'Anonymous' });

            let circle = new fabric.Circle({
                left: 800,
                top: 930,
                radius: 40,
                selectable: false,
                fill: '#121212',
            });

            allObjects.push(circle);

            canvas.add(circle);
            //canvas.add(photo);

            // @
            fabricTextIG = new fabric.Textbox('@' + authorName, {
                left: 580,
                top: 960,
                width: 400,
                fill: 'white',
                fontSize: 25,
                fontWeight: 'lighter',
                textAlign: 'right',
                textWrapping: 'auto',
                selectable: false,
                //plitByGrapheme: true
            });

            //fabricTextIG.customProperty = 'IgUser'

            allObjects.push(fabricTextIG);
            canvas.add(fabricTextIG);
        }


    } else if (format === SABIAS_QUE) {
        // Agregar la imagen de fondo sin filtro de desenfoque
        fabric.Image.fromURL(backgroundImageSrc, function (img) {


            img.scaleToWidth(canvas.width);

            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));

            // Agregar el rectángulo negro
            let rect = new fabric.Rect({
                left: -1,   // Posición en X del rectángulo
                top: 550,    // Posición en Y del rectángulo
                width: 1024, // Ancho del rectángulo
                height: 600,// Altura del rectángulo
                //rx: 20,
                //ry: 20,
                fill: 'white',
                selectable: false,
                evented: false,
            });

            canvas.add(rect);
            rect.sendToBack();

        }, { crossOrigin: 'Anonymous' });
        // Agregar el texto "holis"

        fabricTextSabiasQue = new fabric.Textbox('¿Sabías que...?', {
            left: 170,
            top: 80,
            width: 640,
            fill: 'white',
            fontSize: 80,
            fontFamily: 'Lora',
            fontStyle: 'bold',
            textAlign: 'center',
            textWrapping: 'auto',
            lineHeight: 0.95,
            selectable: false,
        });

        allObjects.push(fabricTextSabiasQue);

        fabricTextD = new fabric.Textbox("..." + image_text_carru, {
            left: 170,
            top: 610,
            width: 640,
            fill: '#121212',
            fontSize: 45,
            fontFamily: 'Lora',
            fontStyle: 'bold',
            textAlign: 'center',
            textWrapping: 'auto',
            lineHeight: 0.95,
            selectable: false,
        });

        let numLines = fabricTextD.textLines.length;
        if (numLines >= 6) {
            // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
            fabricTextD.fontSize = 40;

        }

        allObjects.push(fabricTextD);

        canvas.add(fabricTextD);
        canvas.add(fabricTextSabiasQue);
        canvas.renderAll();

        if (author) {
            // Cargar la imagen desde URL
            fabric.Image.fromURL(authorPhoto, function (imgX) {


                // Configurar la imagen
                //imgX.scaleToWidth(80); // Ajustar el ancho de la imagen
                //imgX.scale(0.5);

                imgX.set({
                    left: 440,
                    top: 895,
                    selectable: false,
                });

                var imageSize = imgX.getScaledWidth();
                imgX.scaleToWidth(110);

                // Crear un círculo de recorte
                var clipPath = new fabric.Circle({
                    radius: imageSize / 2,
                    originX: 'center',
                    originY: 'center',
                    selectable: true,
                });

                // Aplicar el círculo de recorte a la imagen
                imgX.clipPath = clipPath;

                allObjects.push(imgX);

                // Agregar la imagen al lienzo
                canvas.add(imgX);
            }, { crossOrigin: 'Anonymous' });

            let circle = new fabric.Circle({
                left: 441,
                top: 897,
                radius: 54,
                selectable: false,
                fill: '#121212',
            });

            allObjects.push(circle);

            canvas.add(circle);
            //canvas.add(photo);

            // @
            fabricTextIG = new fabric.Textbox('@' + authorName, {
                left: 600,
                top: 980,
                width: 400,
                fill: '#121212',
                fontSize: 25,
                fontStyle: 'italic',
                fontWeight: 'lighter',
                textAlign: 'right',
                textWrapping: 'auto',
                selectable: false,
                //plitByGrapheme: true
            });

            //fabricTextIG.customProperty = 'IgUser'

            allObjects.push(fabricTextIG);
            canvas.add(fabricTextIG);
        }

    }
    else if (format === DATO_CURIOSO) {
        // Agregar la imagen de fondo sin filtro de desenfoque
        fabric.Image.fromURL(backgroundImageSrc, function (img) {


            img.scaleToWidth(canvas.width);

            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));

            // Agregar el rectángulo negro
            let rect = new fabric.Rect({
                left: -1,   // Posición en X del rectángulo
                top: 550,    // Posición en Y del rectángulo
                width: 1024, // Ancho del rectángulo
                height: 600,// Altura del rectángulo
                //rx: 20,
                //ry: 20,
                fill: 'white',
                selectable: false,
                evented: false,
            });

            canvas.add(rect);
            rect.sendToBack();

        }, { crossOrigin: 'Anonymous' });
        // Agregar el texto "holis"

        fabricTextD = new fabric.Textbox(image_text_carru, {
            left: 115,
            top: 610,
            width: 800,
            fill: '#121212',
            fontSize: 32,
            fontFamily: 'Lora',
            fontStyle: 'bold',
            textAlign: 'center',
            textWrapping: 'auto',
            lineHeight: 1,
            selectable: false,
        });

        let numLines = fabricTextD.textLines.length;
        if (numLines <= 4) {
            // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
            fabricTextD.fontSize = 38;
        }

        else if (numLines <= 5) {
            // Reducir el tamaño del cuadro de texto para que quepa adecuadamente
            fabricTextD.fontSize = 36;
        }

        allObjects.push(fabricTextD);


        //https://cdn-icons-png.flaticon.com/512/7350/7350737.png

        allObjects.push(fabricTextAuthor);

        canvas.add(fabricTextD);
        canvas.renderAll();

        if (author) {
            // Cargar la imagen desde URL
            fabric.Image.fromURL(authorPhoto, function (imgX) {

                // Configurar la imagen
                //imgX.scaleToWidth(80); // Ajustar el ancho de la imagen
                //imgX.scale(0.5);
                imgX.scaleToWidth(110);
                imgX.set({
                    left: 440,
                    top: 895,
                    selectable: false,
                });

                // Crear un círculo de recorte
                var clipPath = new fabric.Circle({
                    radius: 470,
                    originX: 'center',
                    originY: 'center',
                    selectable: true,
                });

                // Aplicar el círculo de recorte a la imagen
                imgX.clipPath = clipPath;

                allObjects.push(imgX);

                // Agregar la imagen al lienzo
                canvas.add(imgX);
            }, { crossOrigin: 'Anonymous' });

            let circle = new fabric.Circle({
                left: 441,
                top: 897,
                radius: 54,
                selectable: false,
                fill: '#121212',
            });

            allObjects.push(circle);

            canvas.add(circle);
            //canvas.add(photo);

            // @
            fabricTextIG = new fabric.Textbox('@' + authorName, {
                left: 600,
                top: 980,
                width: 400,
                fill: '#121212',
                fontSize: 25,
                fontStyle: 'italic',
                fontWeight: 'lighter',
                textAlign: 'right',
                textWrapping: 'auto',
                selectable: false,
                //plitByGrapheme: true
            });

            //fabricTextIG.customProperty = 'IgUser'

            allObjects.push(fabricTextIG);
            canvas.add(fabricTextIG);
        }


    }



    clipPath?.on('selected', function (options) {


        if (selectedCanvas !== options.target.canvas) {
            //////console.log(selectedCanvas)
            //////console.log(options.target.canvas)
        }

        if (selectedCanvas && selectedCanvas.wrapperEl.classList.contains('canvas-selected')) {
            if (selectedCanvas !== options.target.canvas) {
                selectedCanvas.discardActiveObject();

                selectedCanvas.wrapperEl.classList.remove('canvas-selected');
                selectedCanvas.renderAll();
            }
        }




        if (selectedObject) {
            if (selectedCanvas !== options.target.canvas) {
                selectedCanvas.discardActiveObject();

                selectedCanvas.wrapperEl.classList.remove('canvas-selected');
                selectedCanvas.renderAll();
                //selectedObject = null; // Reiniciar la variable selectedObject
            }

        }

        selectedObject = options.target;
        selectedCanvas = canvas;
        //selectedCanvas.renderAll()
    });

    fabricTextIG?.on('selected', function (options) {


        if (selectedCanvas !== options.target.canvas) {
            //////console.log(selectedCanvas)
            //////console.log(options.target.canvas)
        }

        if (selectedCanvas && selectedCanvas.wrapperEl.classList.contains('canvas-selected')) {
            if (selectedCanvas !== options.target.canvas) {
                selectedCanvas.discardActiveObject();

                selectedCanvas.wrapperEl.classList.remove('canvas-selected');
                selectedCanvas.renderAll();
            }
        }




        if (selectedObject) {
            if (selectedCanvas !== options.target.canvas) {
                selectedCanvas.discardActiveObject();

                selectedCanvas.wrapperEl.classList.remove('canvas-selected');
                selectedCanvas.renderAll();
                //selectedObject = null; // Reiniciar la variable selectedObject
            }

        }

        selectedObject = options.target;
        selectedCanvas = canvas;
        //selectedCanvas.renderAll()
    });

    fabricTextAuthor?.on('selected', function (options) {


        if (selectedCanvas !== options.target.canvas) {
            //////console.log(selectedCanvas)
            //////console.log(options.target.canvas)
        }

        if (selectedCanvas && selectedCanvas.wrapperEl.classList.contains('canvas-selected')) {
            if (selectedCanvas !== options.target.canvas) {
                selectedCanvas.discardActiveObject();

                selectedCanvas.wrapperEl.classList.remove('canvas-selected');
                selectedCanvas.renderAll();
            }
        }




        if (selectedObject) {
            if (selectedCanvas !== options.target.canvas) {
                selectedCanvas.discardActiveObject();

                selectedCanvas.wrapperEl.classList.remove('canvas-selected');
                selectedCanvas.renderAll();
                //selectedObject = null; // Reiniciar la variable selectedObject
            }

        }

        selectedObject = options.target;
        selectedCanvas = canvas;
        //selectedCanvas.renderAll()
    });


    fabricTextD?.on('selected', function (options) {


        if (selectedCanvas !== options.target.canvas) {
            //////console.log(selectedCanvas)
            //////console.log(options.target.canvas)
        }

        if (selectedCanvas && selectedCanvas.wrapperEl.classList.contains('canvas-selected')) {
            if (selectedCanvas !== options.target.canvas) {
                selectedCanvas.discardActiveObject();

                selectedCanvas.wrapperEl.classList.remove('canvas-selected');
                selectedCanvas.renderAll();
            }
        }




        if (selectedObject) {
            if (selectedCanvas !== options.target.canvas) {
                selectedCanvas.discardActiveObject();

                selectedCanvas.wrapperEl.classList.remove('canvas-selected');
                selectedCanvas.renderAll();
                //selectedObject = null; // Reiniciar la variable selectedObject
            }

        }

        selectedObject = options.target;
        selectedCanvas = canvas;
        //selectedCanvas.renderAll()
    });

    fabricTextPetit?.on('selected', function (options) {


        if (selectedCanvas !== options.target.canvas) {
            //////console.log(selectedCanvas)
            //////console.log(options.target.canvas)
        }

        if (selectedCanvas && selectedCanvas.wrapperEl.classList.contains('canvas-selected')) {
            if (selectedCanvas !== options.target.canvas) {
                selectedCanvas.discardActiveObject();

                selectedCanvas.wrapperEl.classList.remove('canvas-selected');
                selectedCanvas.renderAll();
            }
        }




        if (selectedObject) {
            if (selectedCanvas !== options.target.canvas) {
                selectedCanvas.discardActiveObject();

                selectedCanvas.wrapperEl.classList.remove('canvas-selected');
                selectedCanvas.renderAll();
                //selectedObject = null; // Reiniciar la variable selectedObject
            }

        }

        selectedObject = options.target;
        selectedCanvas = canvas;
        //selectedCanvas.renderAll()
    });

    // Agregar event listener para el evento 'input' del colorPicker
    let colorPicker = document.getElementById('colorPicker');
    colorPicker.addEventListener('input', changeTextColor);


    // Agregar event listener para el evento 'change' del fontSelect
    let fontSelect = document.getElementById('fontSelect');
    fontSelect.addEventListener('change', changeTextFont);





    canvas.on('mouse:down', function (options) {
        if (selectedCanvas && selectedCanvas !== canvas) {
            // Si hay un canvas previamente seleccionado y es diferente al actual:
            selectedCanvas.discardActiveObject();
            selectedCanvas.wrapperEl.classList.remove('canvas-selected');
            selectedCanvas.renderAll();
        }
        selectedCanvas = canvas;
        let canvasElement = selectedCanvas.lowerCanvasEl;

        if (!deselectCanvas) {
            selectedCanvas.wrapperEl.classList.add('canvas-selected'); // Agrega la clase CSS para resaltar el lienzo seleccionado
        }



        // BORRAR SELECCIÓN UNA VEZ QUE SE DESELECCIONA UN TEXT
        fabricTextD?.on('deselected', function () {
            //////console.log("des")
            //////console.log("aquí1")
            //fabricTextD = null;
            //selectedObject = null;
        });

        selectedObject?.on('deselected', function () {

            fabricTextD = null;
            selectedObject = null;
        });


    });
}

function changeTextColorAll(object) {
    let colorPicker = document.getElementById('colorPicker');
    let selectedColor = colorPicker.value;

    object.set('fill', selectedColor);
}



export function reactivarCanvas() {

    document.getElementById('add-text-button').classList.remove("disabled-button");
    var canvasContainerOp = document.getElementById('canvasContainer')
    canvasContainerOp.style.opacity = 1;
    deselectCanvas = false;
    allObjects.forEach((object) => {
        object.set('selectable', true);
    });
}

export function selectAllCanvas(value, option) {

    // quitar visibilidad de 'agregar texto'


    // si selectAllCarru esta seleccionado, deseleccionarlo

    var canvasContainerOp = document.getElementById('canvasContainer')
    // bloquear interactividad en todos los canvas

    // deseleccionar todos los objetos anteriores
    // si se selecciona un objeto, 'all canvas selected' se destilda
    let checkbox = document.getElementById('checkbox-input');
    if (!checkbox.checked) {

        document.getElementById('add-text-button').classList.remove("disabled-button");
        document.getElementById('delete-canvas').classList.remove("disabled-button");
        reactivarCanvas();

        return; // Salir de la función si el checkbox no está marcado
    }

    document.getElementById('add-text-button').classList.add("disabled-button");
    document.getElementById('delete-canvas').classList.add("disabled-button");

    deselectableAllCanvas(canvasContainerOp);
    //deselectAllCanvas(canvasContainerOp);


    selectedObject = null;

    //fabricTextD = null;

    // cambiar opacidad a todo el div

    canvasContainerOp.style.opacity = 0.8;


    allObjects.forEach((object) => {
        if (object) {
            if (option === "color") {
                object.set('fill', value);
            } else if (option === "font") {
                object.set('fontFamily', value);
            } else if (option === "bold") {
                object.set('fontWeight', object.get('fontWeight') === 'bold' ? 'normal' : 'bold');
            } else if (option === "border") {
                let strokeWidth = object.get('strokeWidth');
                object.set('strokeWidth', strokeWidth !== 1 ? 1 : 1.3);
                object.set('stroke', strokeWidth === 1 ? 'black' : '');

            } else if (option === "deleteText") {
                object.set('visible', false)
            }
            else {
                ////console.log("done");
            }

            //object.canvas.renderAll(); // Renderizar el canvas después de aplicar los cambios
        }
    });
    allCanvas.forEach((canvas) => {
        canvas.renderAll();
    })


}


export function addText() {
    let textInput = document.getElementById('textInput');
    let text = textInput.value;
    let colorPicker = document.getElementById('colorPicker');
    let selectedColor = colorPicker.value;
    let fontSelect = document.getElementById('fontSelect');
    let selectedFont = fontSelect.value;
    fontSelect.addEventListener('change', changeTextFont);

    if (selectedCanvas && selectedCanvas.wrapperEl.classList.contains('canvas-selected')) {

        let fabricText = new fabric.Textbox(text, {
            left: 10,
            top: 10,
            fill: selectedColor,
            fontSize: 30,
            fontFamily: selectedFont
        });
        selectedCanvas.add(fabricText);

        allObjects.push(fabricText)

        fabricText.on('selected', function (options) {

            if (selectedCanvas !== options.target.canvas) {
                selectedCanvas.discardActiveObject();

                selectedCanvas.wrapperEl.classList.remove('canvas-selected');
                selectedCanvas.renderAll();
            }

            selectedObject = options.target;
            selectedCanvas = selectedObject.canvas;

            // borrar selección anterior si la hay
        });

        selectedCanvas.renderAll(); // Renderiza el lienzo para mostrar el texto agregado
    }
}

export function deleteText() {
    if (selectedObject && selectedCanvas) {
        selectedCanvas.remove(selectedObject);
        selectedCanvas.renderAll();
        allObjects = allObjects.filter(object => object != selectedObject);
        selectedObject = null;
    }
}

export function changeTextFont() {
    if (selectedCanvas && selectedObject) {
        let fontSelect = document.getElementById('fontSelect');
        let selectedFont = fontSelect.value;
        selectedObject.set('fontFamily', selectedFont);
        selectedCanvas.renderAll();
        selectedObject.on('deselected', function () {
            selectedObject = null;
        });
    }
}

export function changeTextColor() {
    ////console.log(selectedObject)
    if (selectedCanvas && selectedObject) {



        let colorPicker = document.getElementById('colorPicker');
        let selectedColor = colorPicker.value;
        selectedObject.set('fill', selectedColor);



        selectedCanvas.renderAll();

        selectedObject.on('deselected', function () {
            selectedObject = null;
        });
    }

}

export function toggleBold() {
    if (selectedCanvas && selectedObject instanceof fabric.Textbox) {
        let fontWeight = selectedObject.get('fontWeight');
        selectedObject.set('fontWeight', fontWeight === 'bold' ? 'normal' : 'bold');
        selectedCanvas.renderAll();
        selectedObject.on('deselected', function () {
            selectedObject = null;
        });
    }
}

export function toggleBorder() {
    if (selectedCanvas && selectedObject instanceof fabric.Textbox) {
        let strokeWidth = selectedObject.get('strokeWidth');
        selectedObject.set('strokeWidth', strokeWidth !== 1 ? 1 : 1.3);
        selectedObject.set('stroke', strokeWidth === 1 ? 'black' : '');
        selectedCanvas.renderAll();
        selectedObject.on('deselected', function () {
            selectedObject = null;
        });
    }
}

export function getDatetetimeInput() {
    // Obtener todos los elementos con la clase "containerDatetime"
    const containerDatetimeList = document.querySelectorAll('.containerDatetime');

    // Crear un array para almacenar los valores de las fechas
    const fechasPublicacion = [];

    // Iterar sobre cada elemento "containerDatetime"
    containerDatetimeList.forEach(containerDatetime => {
        // Obtener el input de tipo fecha dentro del contenedor actual
        const datetimeInput = containerDatetime.querySelector('input');

        // Obtener el ID del abuelo del datetimeInput
        const abuelo = datetimeInput.closest('[id]');

        const abueloId = abuelo ? abuelo.id : null;

        // Obtener el valor de la fecha del input actual y agregarlo al array
        fechasPublicacion.push({ id: abueloId, fecha: datetimeInput.value });
    });

    // Devolver el array con los IDs y fechas obtenidas
    return fechasPublicacion;
}


export function addPaddingIfNeeded(imageData) {
    let padding = imageData.length % 4;
    if (padding) {
        return imageData + '='.repeat(4 - padding);
    }
    return imageData;
}

export function saveImage() {
    showLoading(true);
    activarContador();
    let containerInputMenu = document.getElementById("generated-container");
    containerInputMenu.style.display = 'none';
    ////console.log("loading...")
    

    // hacer cositas cuando esté cargando...

    // desaparecer anterior container
    

    // deshabilitar botón por posibles bugs
    let saveImageButton = document.getElementById("save-image-button");
    // Ocultar el botón
    saveImageButton.classList.add("disabled-button");
    //saveImageButton.disabled = true;

    // datetime
    //let datetimeInputList = getDatetetimeInput();

    // Crear un arreglo para almacenar las imágenes modificadas en base64
    let modifiedImages = [];

    // Recorrer todos los canvas modificados
    canvases.forEach(function (canvasDataDic, index) {

        //let canvasR = canvasDatax.canvas;
        let canvasx = canvasDataDic.canvas;
        // Convertir el contenido del canvas en base64
        let modifiedImageBase64 = canvasx.toDataURL({
            format: 'png', // Puedes cambiar el formato a 'jpeg' si lo deseas
            quality: 0.8 // Puedes ajustar la calidad de la imagen si lo deseas (valor entre 0 y 1)
        });
        // Agregar la imagen base64 al arreglo
        modifiedImages.push({ image: modifiedImageBase64, num_carrusel: canvasDataDic.num_carrusel, image_position: canvasDataDic.image_position });
    });

    // Suponiendo que tienes un array de imágenes codificadas en Base64 llamado "modifiedImages"
    //let cleanedImages = modifiedImages.map(imageData => imageData.replace(/\s/g, ''));
    //let paddedImages = cleanedImages.map(addPaddingIfNeeded);
    let access_token_g = localStorage.getItem('access');

    // Realizar la solicitud POST al backend para guardar las imágenes modificadas
    axios.post('https://mikai-production.up.railway.app/image-generation/save_images',
        JSON.stringify({
            images: modifiedImages,
            images_data: imagesDataFront,
            prompt: valuePromptInput,
            // datetime
            //dates: datetimeInputList,
            carruselUnpublished: carruselUnpublished,
            numberOfCarrus: numberOfCarrus
        }),
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(access_token_g)
            }
        })
        .then(response => {
            window.onbeforeunload = null;
            showLoading(false);
            detenerContador();
            const data = response.data;
            // Aquí puedes realizar alguna acción en caso de que la respuesta sea exitosa
            window.location.href = "/my-generations";
            /*
            ////console.log('Imágenes modificadas guardadas correctamente.');
            let containerGenerated = document.getElementById("generated-container");
            containerGenerated.innerHTML = '<h1>Imagenes programadas correctamente</h1>';
            */

        })
        .catch(error => {
            console.error('Error al guardar las imágenes modificadas:', error);
        });
}



export function modoEdicion() {



    ////console.log(getDatetetimeInput());

    var canvasContainerOp = document.getElementById('canvasContainer');

    if (!modoEdicionIsActive) {
        activarCanvas();


        checkboxSelectCarouselList.forEach((checkbox) => {

            //checkbox.style.display = 'flex';

        })
        //

        document.getElementById('container-editable').style.display = 'inline-flex';
        document.getElementById('container-editable').style.position = 'fixed';
        modoEdicionIsActive = true;
    } else {

        iniciarBloqueadoMenuEdicion();

        selectedCanvas?.discardActiveObject();
        selectedCanvas?.renderAll();

        checkboxSelectCarouselList.forEach((checkbox) => {


            //checkbox.style.display = 'none';
        })

        document.getElementById('container-editable').style.display = 'none';
        modoEdicionIsActive = false;

    }

}
