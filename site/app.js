// app.js
import { isSelectedCanvas, confirmAction, closeConfirmationModal, showConfirmationModalEdition, generateImage, deselectableAllCanvas, reactivarCanvas, toggleClickedStyle, saveImage, showConfirmationModal, deleteCanvas, modoEdicion, addPaddingIfNeeded, toggleBorder, toggleBold, addText, changeTextColor, changeTextFont, deleteText, selectAllCanvas } from './helpers.js';
import { putSelectedStyle } from './chooseStyle.js';
import { BLACK_MARK, TRANSPARENT_MARK, AUTHOR_PHRASE_1 } from "./styles.js";
import { updateSliderValue } from "./slicingCounter.js"
import { mostrarAlert } from "./alert.js"

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {

  

  let author = true;
  let listCheckboxChecked = [];
  let deselectCanvas = false;
  let authorPhotoStorage = localStorage.getItem('authorPhoto');


  const imagePreview = document.getElementById('authorPhoto');
  const authorPhoto = document.getElementById('input-file');

  putSelectedStyle();

  


  const firstForm = document.getElementById("firstInputUser");

  firstForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formatIput = firstForm.elements["formatSelect"];
    const promptInput = firstForm.elements["prompt-input"];

    console.log(author)
    console.log(!!authorPhoto.src)
    console.log(!authorPhoto.src)
    console.log(author && !authorPhoto.src);
    console.log(author && !!authorPhoto.src);
    if (promptInput.value.trim() === "" || (author && !authorPhotoStorage)) {
      // Evitar que el formulario se envíe
      event.preventDefault();
      promptInput.focus();
    } else {
      // si el campo está lleno
      // deshabilita el boton 'Generate' para ahorrar bugs
      const generateButton = document.getElementById("generate-button");
      generateButton.classList.add("disabled-button");
      generateImage();
    }
  });


  document.getElementById('selectable-button-author').addEventListener('click', function () {
    const button = document.getElementById('selectable-button-author');
    console.log("oks")

    if (button.classList.contains('selected')) {
      button.classList.remove('selected');
      author = false;
      document.getElementById('author-modal').style.display = 'none';
    } else {
      document.getElementById('author-modal').style.display = 'inline-flex';
      author = true;
      button.classList.add('selected');

    }


  });



  const decrementButton = document.getElementById("decrement");
  const incrementButton = document.getElementById("increment");
  const slider = document.getElementById("slider");
  const sliderValue = document.getElementById("slider-value");
  const tokensValue = document.getElementById("numTokens");


  // ESTA DESACTIVADO, SACAR COMENTARIOS PARA ACTIVARLO
  updateSliderValue();

  // Función para decrementar el valor del control deslizante
  decrementButton.addEventListener("click", function () {
    //slider.stepDown();
    //updateSliderValue();
  });

  // Función para incrementar el valor del control deslizante
  incrementButton.addEventListener("click", function () {
    //slider.stepUp();
    //updateSliderValue();
  });

  // Actualizar el valor del control deslizante cuando se mueve
  //slider.addEventListener("input", updateSliderValue);



  const openModalInfoBtn = document.getElementById("info-button");
  const closeModalInfoBtn = document.getElementById("closeModalInfoBtn");
  const modalInfo = document.getElementById("modalInfo");

  openModalInfoBtn.addEventListener("click", () => {
    modalInfo.style.display = "block";
  });

  closeModalInfoBtn.addEventListener("click", () => {
    modalInfo.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === modalInfo) {
      modalInfo.style.display = "none";
    }
  });

  // if not modalstyletype...
  let styleType = localStorage.getItem('modal-style-type');
  if (!styleType) {
    localStorage.setItem('modal-style-type', 'Carrusel');
  }
  //
  // Event Listener para el botón "Modo Edición"
  document.getElementById('modo-edicion-button').addEventListener('click', modoEdicion);

  // Event Listener para seleccionar todos los canvas
  document.getElementById('checkbox-input').addEventListener('change', selectAllCanvas);

  // Event Listener para el botón "Publicar"
  document.getElementById('save-image-button').addEventListener('click', saveImage);

  // Event Listener para el botón "Agregar Texto"
  document.getElementById('add-text-button').addEventListener('click', addText);

  // Event Listener para el botón "Borrar Texto"
  document.getElementById('delete-text-button').addEventListener('click', deleteText);

  // Event Listener para el botón "Negrita"
  document.getElementById('toggle-bold-button').addEventListener('click', toggleBold);

  // Event Listener para el botón "Borde"
  document.getElementById('toggle-border-button').addEventListener('click', toggleBorder);

  // Event Listener para el input de color
  document.getElementById('colorPicker').addEventListener('input', changeTextColor);



  const inputFile = document.getElementById('input-file');


  inputFile.addEventListener('input', function (event) {
    const input = event.target;

    if (input.files && input.files[0]) {
      const reader = new FileReader();

      reader.onload = function (e) {
        const image = new Image();

        image.onload = function () {
          //if (image.width === 1024 && image.height === 1024) {
          if (image.width === image.height) {
            document.getElementById('imgMsg').style.display = 'none';
            // La imagen tiene las dimensiones correctas, continuar con el proceso
            imagePreview.src = e.target.result;

            // Resto del código para enviar la imagen al servidor
            const photoData = e.target.result;

            axios.post('https://mikai-production.up.railway.app/author-photo/', { photo: photoData })
              .then(response => {
                // Manejar la respuesta del servidor
                console.log('Respuesta del servidor:', response.data);
                localStorage.setItem('authorPhoto', response.data.photo_url);
                authorPhotoStorage = localStorage.getItem('authorPhoto');
              })
              .catch(error => {
                // Manejar los errores en caso de que ocurran durante la llamada a la API
                console.error('Error al llamar a la API:', error);
              });
          } else {
            console.log('La imagen debe ser de 1024x1024');
            document.getElementById('imgMsg').style.display = 'block';
          }
        };

        image.src = e.target.result;
      };

      reader.readAsDataURL(input.files[0]);
    }
  });

  // Event listener para el choose style

  document.getElementById('chooseStyle').addEventListener('click', () => {
    showConfirmationModal('Elegir estilo', 'Ok?', function () {

    }, 'modal-choose-style');
  });


  document.getElementById('authorName').addEventListener('input', (e) => {
    localStorage.setItem('author', e.target.value)
  });


  // MANTENER VALORES DEL USUARIO SIEMPRE
  if (localStorage.getItem('author')) {
    document.getElementById('authorName').value = localStorage.getItem('author');
  }

  if (localStorage.getItem('authorPhoto')) {
    document.getElementById('authorPhoto').src = localStorage.getItem('authorPhoto');
  }
  //

  document.getElementById('delete-canvas').addEventListener('click', () => {

    if (!isSelectedCanvas()) {

      return false;
    }

    showConfirmationModalEdition('Borrar Canvas', '¿Estás seguro?', function () {
      deleteCanvas();
    })
  });

  // Event Listener para el evento 'change' del fontSelect
  document.getElementById('fontSelect').addEventListener('change', changeTextFont);

  //
  document.getElementById('checkbox-input').addEventListener('click', (event) => {
    // deseleecionar todos los otros inputs


    listCheckboxChecked.forEach(checkbox => {
      if (checkbox !== event.target) {

        checkbox.checked = false;
        listCheckboxChecked = [];

      }
    });
    if (!listCheckboxChecked.includes(event.target)) {
      listCheckboxChecked.push(event.target);
    }
    //selectAllCanvas;
  });


  //



  //

  const colorPickerX = document.getElementById('colorPicker');
  colorPickerX.addEventListener('change', (event) => {

    const selectedColor = event.target.value;
    selectAllCanvas(selectedColor, "color");
  });

  document.getElementById('canvasContainer').addEventListener('click', function (event) {
    const targetElement = event.target;

    // Verificar si el objetivo (target) es un párrafo (<p>) dentro del contenedorDinamico

    if (targetElement.closest('.big-container') && targetElement.tagName === 'INPUT' && targetElement.type === 'checkbox' && targetElement.className !== 'checkbox-publish') {
      console.log("alo")
      // volver opacidad normal si estaban en 0.8
      var canvasContainerOp = document.getElementById('canvasContainer');

      if (!deselectCanvas) {
        deselectCanvas = deselectableAllCanvas(canvasContainerOp);

      } else {
        reactivarCanvas();
        deselectCanvas = false;
        return;
      }



      if (canvasContainerOp.style.opacity !== '1') {
        reactivarCanvas();
      }

      // si estan en deselected volver a la normalidad


      listCheckboxChecked.forEach(checkbox => {
        if (checkbox !== targetElement) {

          checkbox.checked = false;
          listCheckboxChecked = [];
        }
      });

      // Aquí realizas la acción que desees cuando se hace clic en un párrafo dentro del contenedorDinamico
      document.getElementById('colorPicker').addEventListener('input', (event) => {
        const selectedColor = event.target.value;
        toggleClickedStyle(targetElement, selectedColor, "color");
      });

      document.getElementById('fontSelect').addEventListener('input', (event) => {
        const selectedFont = event.target.value;
        toggleClickedStyle(targetElement, selectedFont, "font");
      });

      document.getElementById('toggle-bold-button').addEventListener('click', (event) => {
        toggleClickedStyle(targetElement, event.target.value, "bold");
      });

      document.getElementById('toggle-border-button').addEventListener('click', () => {
        toggleClickedStyle(targetElement, "null", "border");

      });

      document.getElementById('delete-text-button').addEventListener('click', () => {

        toggleClickedStyle(targetElement, "null", "deleteText");

      });


      if (!listCheckboxChecked.includes(event.target)) {

        listCheckboxChecked.push(event.target);
        console.log(listCheckboxChecked)
      }
    }
  });
  //



  document.getElementById('fontSelect').addEventListener('change', (event) => {
    const selectedFont = event.target.value;
    selectAllCanvas(selectedFont, "font");
  });

  document.getElementById('toggle-bold-button').addEventListener('click', (event) => {
    selectAllCanvas(event.target.value, "bold");
  });

  document.getElementById('toggle-border-button').addEventListener('click', () => {
    selectAllCanvas("null", "border");

  });

  document.getElementById('delete-text-button').addEventListener('click', () => {
    selectAllCanvas("null", "deleteText");
  });


  // modal buttons
  const confirmButton = document.getElementById('confirm-button-modal');
  const cancelButton = document.getElementById('cancel-button-modal');
  const confirmButtonEdition = document.getElementById('confirm-button-modal-edition');
  const cancelButtonEdition = document.getElementById('cancel-button-modal-edition');

  confirmButtonEdition.addEventListener('click', confirmAction);
  cancelButtonEdition.addEventListener('click', closeConfirmationModal);
  cancelButton.addEventListener('click', closeConfirmationModal);

  // validations
  document.getElementById('prompt-input').addEventListener('input', function (event) {
    const maxLength = 100;
    const currentLength = event.target.value.length;

    if (currentLength > maxLength) {
      // Si la longitud actual supera la máxima, recorta el contenido del textarea
      event.target.value = event.target.value.slice(0, maxLength);
    }
  });

  document.getElementById('textInput').addEventListener('input', function (event) {
    const maxLength = 500;
    const currentLength = event.target.value.length;

    if (currentLength > maxLength) {
      // Si la longitud actual supera la máxima, recorta el contenido del textarea
      event.target.value = event.target.value.slice(0, maxLength);
    }
  });



  setTimeout(mostrarAlert, 500);

});
