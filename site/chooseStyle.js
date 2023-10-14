import { closeConfirmationModal } from './helpers.js'
import { BLACK_MARK, TRANSPARENT_MARK, AUTHOR_PHRASE_1, INFORMARTIVO, SABIAS_QUE, AUTHOR_PHRASE_2, TIPS, DATO_CURIOSO } from "./styles.js";
import { updateSliderValue } from "./slicingCounter.js"

let creado = false;

let CARRUSEL = 'Carrusel';
let SOLO = 'Solo';

export let stylesJSON = {
    styles: [
        {
            title: BLACK_MARK,
            type: CARRUSEL,
            post_description: "Las películas de Pixar van más allá de la diversión y la animación. Cada una de ellas nos enseña valiosas lecciones de vida. ¿Recuerdas la famosa frase de Finding Nemo: Sigue nadando? Esta película nos enseña la importancia de la perseverancia y la superación. En Up, aprendemos sobre el valor de los sueños y la importancia de disfrutar cada momento. Descubre las lecciones de vida en las películas de Pixar y déjate inspirar. #Pixar #LeccionesDeVida #Inspiración #Animación",
            images: [
                'https://res.cloudinary.com/dlqpkf6fd/image/upload/v1696953932/media/carousel-images/Ccarrusel_0-P0_ivburi.png',
                'https://res.cloudinary.com/dlqpkf6fd/image/upload/v1696953933/media/carousel-images/Ccarrusel_0-P1_jder2q.png',
                'https://res.cloudinary.com/dlqpkf6fd/image/upload/v1696953936/media/carousel-images/Ccarrusel_0-P2_opjare.png',
                'https://res.cloudinary.com/dlqpkf6fd/image/upload/v1696953937/media/carousel-images/Ccarrusel_0-P3_si7zts.png',
                'https://res.cloudinary.com/dlqpkf6fd/image/upload/v1696953939/media/carousel-images/Ccarrusel_0-P4_zqyame.png',
            ],
            promptI: 'Type a prompt... Ej: Peliculas de pixar'
        },
        {
            title: TIPS,
            type: CARRUSEL,
            post_description: "Descubre estos alimentos que te ayudan a acelerar el metabolismo. #metabolismo #alimentos #nutrición #bajardepeso",
            images: [
                'https://res.cloudinary.com/dlqpkf6fd/image/upload/v1696954283/media/carousel-images/Ccarrusel_3-P0_wadirq.png',
                'https://res.cloudinary.com/dlqpkf6fd/image/upload/v1696954285/media/carousel-images/Ccarrusel_3-P1_ejkrmy.png',
                'https://res.cloudinary.com/dlqpkf6fd/image/upload/v1696954287/media/carousel-images/Ccarrusel_3-P2_m2mqlu.png',
                'https://res.cloudinary.com/dlqpkf6fd/image/upload/v1696954289/media/carousel-images/Ccarrusel_3-P3_c2uzun.png',
                'https://res.cloudinary.com/dlqpkf6fd/image/upload/v1696954291/media/carousel-images/Ccarrusel_3-P4_lkl9ft.png',
            ],
            promptI: '4 Tips... Ej: << Bajar de peso >>'
        },
        {
            title: TRANSPARENT_MARK,
            type: CARRUSEL,
            post_description: "Explora el fascinante mundo de las armas y armaduras medievales. Desde espadas y lanzas hasta armaduras de placas y escudos, las herramientas de combate de la época medieval eran variadas y sofisticadas. Descubre cómo se fabricaban y utilizaban estas armas, así como su importancia en la guerra y en la vida cotidiana. #historiamedieval #armasmedievales #armadurasmedievales #combate",
            images: [

                'https://res.cloudinary.com/dlqpkf6fd/image/upload/v1696954651/media/carousel-images/Ccarrusel_2-P0_i4gch1.png',
                'https://res.cloudinary.com/dlqpkf6fd/image/upload/v1696954654/media/carousel-images/Ccarrusel_2-P1_nyivfm.png',
                'https://res.cloudinary.com/dlqpkf6fd/image/upload/v1696954657/media/carousel-images/Ccarrusel_2-P2_diu5sp.png',
                'https://res.cloudinary.com/dlqpkf6fd/image/upload/v1696954661/media/carousel-images/Ccarrusel_2-P3_mubtqv.png',
                'https://res.cloudinary.com/dlqpkf6fd/image/upload/v1696954665/media/carousel-images/Ccarrusel_2-P4_r8pnco.png'
            ],
            promptI: 'Type a prompt... Ej: << Segunda guerra mundial >>'
        },
        {
            title: INFORMARTIVO,
            type: CARRUSEL,
            post_description: "Descubre los mitos y leyendas de la antigua Roma. #mitologiaromana #diosesromanos #leyendas #culturaantigua",
            images: [

                'https://res.cloudinary.com/dlqpkf6fd/image/upload/v1696955458/media/carousel-images/Ccarrusel_2-P0_u8kit9.png',
                'https://res.cloudinary.com/dlqpkf6fd/image/upload/v1696955461/media/carousel-images/Ccarrusel_2-P1_jbkxol.png',
                'https://res.cloudinary.com/dlqpkf6fd/image/upload/v1696955464/media/carousel-images/Ccarrusel_2-P2_dbazmm.png',
                'https://res.cloudinary.com/dlqpkf6fd/image/upload/v1696955467/media/carousel-images/Ccarrusel_2-P3_wdxijs.png',
                'https://res.cloudinary.com/dlqpkf6fd/image/upload/v1696955470/media/carousel-images/Ccarrusel_2-P4_qc1c82.png'
            ],
            promptI: 'Type a prompt... Ej: << Dioses Romanos >>'
        },
        {
            title: AUTHOR_PHRASE_1,
            type: SOLO,
            post_description: "Enseñanza de Marco Aurelio sobre la búsqueda de la felicidad. #MarcoAurelio #FilosofíaDeVida",
            images: [
                'https://res.cloudinary.com/dlqpkf6fd/image/upload/v1696694532/media/carousel-images/Ccarrusel_1-P0_yh5qjb.png'
            ],
            promptI: 'Type a prompt... Ej: << Marco Aurelio >>'
        },
        {
            title: DATO_CURIOSO,
            type: SOLO,
            post_description: "Descubre cómo los osos panda utilizan su pulgar oponible para sobrevivir en su hábitat y cómo esta adaptación los distingue de otros animales. #OsoPanda #PulgarOponible #Adaptación",
            images: [
                'https://res.cloudinary.com/dlqpkf6fd/image/upload/v1696956346/media/carousel-images/Ccarrusel_3-P0_uivy77.png'
            ],
            promptI: 'Dato curioso de ... Ej: << Osos Panda >>'
        },
        {
            title: AUTHOR_PHRASE_2,
            type: SOLO,
            post_description: "Frases de Albert Einstein: Reflexiones sobre el pensamiento. #AlbertEinstein #Mente",
            images: [
                'https://res.cloudinary.com/dlqpkf6fd/image/upload/v1696956698/media/carousel-images/Ccarrusel_0-P0_xgbrlo.png'
            ],
            promptI: 'Frases de ... Ej: << Albert Einstein >>'
        },
        {
            title: SABIAS_QUE,
            type: SOLO,
            post_description: "Explora la exuberante biodiversidad de los bosques tropicales, pulmones verdes del planeta. #BosquesTropicales #Biodiversidad #Naturaleza",
            images: [
                'https://res.cloudinary.com/dlqpkf6fd/image/upload/v1696957201/media/carousel-images/Ccarrusel_0-P0_sh2s2x.png'
            ],
            promptI: '¿Sabias que...? Ej: << Naturaleza >>'
        }
    ]
}

// style selected
export function putSelectedStyle() {


    let selectedStyle = localStorage.getItem('selectedStyle');
    
    if (!selectedStyle) {
        // set default style
        selectedStyle = stylesJSON.styles[0];
        localStorage.setItem('selectedStyle', JSON.stringify(selectedStyle));
        document.getElementById('prompt-input').placeholder = selectedStyle.promptI;
        document.getElementById("chosedStyle").innerHTML = selectedStyle.title;

    } else {
        selectedStyle = JSON.parse(selectedStyle);
        document.getElementById("chosedStyle").innerHTML = selectedStyle.title;
    }

    let styleImagesList = selectedStyle.images;
    let selectedTitleContainer = document.getElementById('titleStyleGenerate');
    let allImagesContainer = document.getElementById('allImagesGenerate');
    let descPostTA = document.getElementById('descPostTA');
    descPostTA.textContent = selectedStyle.post_description;

    selectedTitleContainer.textContent = selectedStyle.title;
    

    // Limpiar el contenedor antes de agregar las nuevas imágenes
    while (allImagesContainer.firstChild) {
        allImagesContainer.removeChild(allImagesContainer.firstChild);
    }

    allImagesContainer.appendChild(descPostTA)

    for (let i = 0; i < styleImagesList.length; i++) {
        let img = document.createElement('img');
        img.src = styleImagesList[i];
        allImagesContainer.appendChild(img);
    }

    // close modal
    console.log(selectedStyle);
    
    document.getElementById('prompt-input').placeholder = selectedStyle.promptI;
    closeConfirmationModal();



}

export function chooseStyleOnClick(styleJSON) {

    localStorage.setItem('selectedStyle', JSON.stringify(styleJSON));
    document.getElementById("chosedStyle").innerHTML = styleJSON.title;
    putSelectedStyle();
}

export function chooseStyle(confirmationModalContainer, style, confirmationModalTitle, confirmationModalContent) {

    if (!creado) {
        
        document.getElementById('confirm-button-modal').style.display = 'none';
        document.getElementById('cancel-button-modal').textContent = 'X';
        document.getElementById('cancel-button-modal').style.position = 'absolute';

        confirmationModalContainer.classList.remove('modal-content');
        confirmationModalContainer.classList.add(style);
        const selectPost = document.getElementById("selectPost");

        for (let i = 0; i < stylesJSON.styles.length; i++) {


            //if (stylesJSON.styles[i].type === selectPost.value) {

            let imagesList = stylesJSON.styles[i].images;

            let container = document.getElementById('modalContent');

            let formatContainer = document.createElement('div');
            formatContainer.setAttribute('id', 'formatsContainer' + stylesJSON.styles[i].title);
            formatContainer.classList.add('formats-container');
            formatContainer.classList.add('formats-container-modal');
            container.appendChild(formatContainer);

            //
            formatContainer.classList.add(stylesJSON.styles[i].type);
            //
            let styleContainer = document.createElement('div');
            styleContainer.setAttribute('id', 'styleContainer' + stylesJSON.styles[i].title);
            styleContainer.classList.add('style-container');
            formatContainer.appendChild(styleContainer);

            let titleStyle = document.createElement('h4');
            titleStyle.setAttribute('id', 'titleStyle' + stylesJSON.styles[i].title);
            titleStyle.textContent = stylesJSON.styles[i].title;
            styleContainer.appendChild(titleStyle);

            let imagesContainer = document.createElement('div');
            imagesContainer.setAttribute('id', 'imagesContainer' + stylesJSON.styles[i].title);
            imagesContainer.classList.add('images-container');
            styleContainer.appendChild(imagesContainer);

            let images_button_container = document.createElement('div');
            images_button_container.setAttribute('id', 'images_button_container' + stylesJSON.styles[i].title);
            images_button_container.classList.add('images_button_container');
            styleContainer.appendChild(images_button_container);


            let allImages = document.createElement('div');
            allImages.setAttribute('id', 'allImages' + stylesJSON.styles[i].title);
            allImages.classList.add('all-images');
            images_button_container.appendChild(allImages);

            const descCaru = document.createElement('textarea');
            descCaru.classList.add('text-field-mg');
            descCaru.textContent = stylesJSON.styles[i].post_description;
            descCaru.readOnly = true;
            allImages.appendChild(descCaru);

            let selectButton = document.createElement('button');
            formatContainer.setAttribute('id', 'selectButton' + stylesJSON.styles[i].title);
            selectButton.classList.add('select-button');
            selectButton.textContent = 'Select'
            selectButton.addEventListener('click', function () {
                chooseStyleOnClick(stylesJSON.styles[i]);

                // Y setear el input slicing en 1 : X
                updateSliderValue();
            });
            images_button_container.appendChild(selectButton);

            for (let i = 0; i < imagesList.length; i++) {
                let img = document.createElement('img');
                img.src = imagesList[i];
                allImages.appendChild(img);
            }
            //}


        }
        creado = true;

    }

    const selectPost = document.getElementById("selectPost");

    selectPost.value = localStorage.getItem('modal-style-type');

    // Agrega un event listener para el evento "change"
    const changeEvent = new Event('change', { bubbles: true });
    
    selectPost.addEventListener("change", function () {
        const selectedValue = selectPost.value;
        console.log(selectedValue);

        if (selectedValue === 'Solo') {
            localStorage.setItem('modal-style-type', 'Solo');
            console.log("Dentro de solo");
            // esconder los type Carrusel
            // Obtén una referencia al contenedor 'formatContainer' por su ID o de alguna otra manera
            const selectButtonblackMark = document.getElementById('modalContent');

            if (selectButtonblackMark) {
                // Encuentra todos los elementos con la clase 'Carrusel' dentro del contenedor
                const carruselElements = selectButtonblackMark.getElementsByClassName('Carrusel');
                const soloElements = selectButtonblackMark.getElementsByClassName('Solo');

                console.log(carruselElements);

                // Itera sobre los elementos y establece su estilo 'display' en 'none'
                for (let i = 0; i < carruselElements.length; i++) {
                    carruselElements[i].style.display = 'none';
                }

                for (let i = 0; i < soloElements.length; i++) {
                    soloElements[i].style.display = 'block';
                }

            }



        } else if (selectedValue === 'Carrusel') {
            localStorage.setItem('modal-style-type', 'Carrusel');
            console.log("Dentro de carrusel");
            // esconder los type Carrusel
            // Obtén una referencia al contenedor 'formatContainer' por su ID o de alguna otra manera
            const selectButtonblackMark = document.getElementById('modalContent');

            if (selectButtonblackMark) {

                // Encuentra todos los elementos con la clase 'Carrusel' dentro del contenedor
                const carruselElements = selectButtonblackMark.getElementsByClassName('Carrusel');
                const soloElements = selectButtonblackMark.getElementsByClassName('Solo');

                console.log(soloElements);
                // Itera sobre los elementos y establece su estilo 'display' en 'none'
                for (let i = 0; i < carruselElements.length; i++) {
                    carruselElements[i].style.display = 'block';
                }

                for (let i = 0; i < soloElements.length; i++) {
                    soloElements[i].style.display = 'none';
                }

            }
        }
    });

    selectPost.dispatchEvent(changeEvent);
}

