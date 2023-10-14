

document.addEventListener('DOMContentLoaded', () => {
  // Llamada a la API y procesamiento de datos como en tu código anterior...
  let access_token_g = localStorage.getItem('access');

  axios.get('https://mikai-production.up.railway.app/image-generation/get_saved_images', {
    headers: {
      'Authorization': 'Bearer ' + String(access_token_g)
    }

  })
    .then(response => {

      const data = response.data;
      const containerDad = document.getElementById('content-container');

      // Creamos un contador para generar IDs únicos
      //let carrusel.id = 1;

      data.forEach(carrusel => {
        console.log("x")
        const continerOfGenerateds = document.createElement('div');
        continerOfGenerateds.id = 'container-of-generateds' + carrusel.id;
        continerOfGenerateds.classList.add('container-of-generateds');
        containerDad.appendChild(continerOfGenerateds);

        const containerCalendar = document.createElement('div');
        containerCalendar.id = 'container-calendar' + carrusel.id;
        containerCalendar.classList.add('container-calendar');
        continerOfGenerateds.appendChild(containerCalendar);

        const containerContentCalendar = document.createElement('div');
        containerContentCalendar.id = 'container-content-calendar' + carrusel.id;
        containerContentCalendar.classList.add('container-content-calendar');
        containerCalendar.appendChild(containerContentCalendar);

        const fechaText = document.createElement('h3');
        fechaText.textContent = 'Prompt: ' + carrusel.prompt;
        fechaText.classList.add('fecha-publicacion');
        fechaText.id = 'fechatext' + carrusel.id;
        containerContentCalendar.appendChild(fechaText);

        /*
        const fecha = document.createElement('h3');
        fecha.textContent = carrusel.prompt;
        fecha.id = 'fecha' + carrusel.id;
        containerContentCalendar.appendChild(fecha);
        */

        let imagesCarrusel = carrusel.images;
        const div = document.createElement('div');
        div.classList.add('images-container');

        const descCaru = document.createElement('textarea');
        descCaru.classList.add('text-field-mg');
        descCaru.textContent = carrusel.post_description;
        descCaru.readOnly = true;
        div.appendChild(descCaru)

        imagesCarrusel.forEach((image, index) => {
          const imgContainer = document.createElement('div');
          imgContainer.classList.add('imgContainer');
          const downloadButton = document.createElement('a');
          const imageElement = document.createElement('img');
          imageElement.loading = "lazy";
          imageElement.style.width = '10px';
          imageElement.src = 'https://img.icons8.com/material-rounded/24/FFFFFF/download--v1.png'; // Reemplaza con la ruta de tu imagen

          // Agregar la imagen al botón de descarga
          downloadButton.appendChild(imageElement);

          var downloadUrl = image.image_url.replace("/upload/", "/upload/fl_attachment/");
          downloadButton.href = downloadUrl;
          downloadButton.download = 'image' + index;

          const img = document.createElement('img');
          img.src = image.image_url;
          imgContainer.appendChild(img);
          imgContainer.appendChild(downloadButton);
          div.appendChild(imgContainer);
          containerCalendar.appendChild(div);
        });

        // Add a download all button for the carrusel
        const downloadAllButton = document.createElement('button');
        downloadAllButton.innerHTML = '<div style="display: flex; align-items: center; justify-content: space-between;"><img style="width: 20px;" src="https://img.icons8.com/material-rounded/24/FFFFFF/download--v1.png"> <p style="margin-left: 0.2rem">Download All</p></div>';
        downloadAllButton.addEventListener('click', () => {
          const zip = new JSZip();
          const textFile = new Blob([descCaru.value], { type: 'text/plain' });
          zip.file('description.txt', textFile);

          imagesCarrusel.forEach((image, index) => {
            const imgFileName = `image${index}.jpg`; // Change the file name as needed
            fetch(image.image_url)
              .then(response => response.blob())
              .then(blob => {
                zip.file(imgFileName, blob);
                if (index === imagesCarrusel.length - 1) {
                  zip.generateAsync({ type: 'blob' }).then(content => {
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(content);
                    link.download = 'carrusel_images.zip'; // Change the zip file name as needed
                    link.click();
                  });
                }
              });
          });
        });

        containerContentCalendar.appendChild(downloadAllButton); // Add the download all button to the carrusel container
      });
    })


    // Incrementamos el contador para el siguiente carrusel
    //carrusel.id++;

    .catch(error => {
      console.error('Error fetching saved images:', error);
    });
});
