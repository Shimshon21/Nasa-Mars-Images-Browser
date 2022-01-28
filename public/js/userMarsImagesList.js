/********************************************
 The mars images browsing page client side.
 *********************************************/


(function () {

    const IMAGE_EXISTED_ERROR = 'The image already saved in the list.'
    const EMPTY_CAROUSEL_ERROR = 'You need to save images to show the carousel!'
    const LATE_DATE_MISSION_ERROR = 'The mission you have selected required a date before'
    const EARLY_DATE_MISSION_ERROR = 'The mission you have selected required a date after'
    const SOL_MISSION_ERROR = 'The sol needed is before'
    const EMPTY_INPUT_ERROR = 'input required here'
    const SOL_DATE_FORMAT_ERROR = 'required Sol Or Date format'

    let errorInfoModal = null
    let solDateInput = null
    let missionSelection = null
    let cameraSelection = null
    let nasaImagesListTag = null

    /*************************************************Validations******************************************************/
    /**
     * Generic validation function check if the value input is valid
     * @param inputElement - Element the data is checked for.
     * @param validateFunc - validation function.
     * @returns if the input element is valid according the function given.
     */
    const validateInput = (inputElement, validateFunc) => {
        let v = validateFunc(inputElement.value)
        return showMessageErrorValidation(inputElement,v)
    }

    /**
     * Show error message if the input is not valid.
     * @param inputElement - Input element needed to show error for.
     * @param v - contain validation answer and the message error.
     * @returns {boolean|*} - The validation answer.
     */
    const showMessageErrorValidation = (inputElement, v) => {
        let errorElement = inputElement.nextElementSibling
        errorElement.innerHTML = v.isValid ? '' : v.message
        v.isValid ? inputElement.classList.remove('is-invalid') : inputElement.classList.add('is-invalid')
        return v.isValid;
    }

    /**
     * Check the validation of the form.
     * @returns - validation answer of the forum
     */
    const validateForumInput = () => {
        let v1 = validateInput(solDateInput, formInputValidatorModule.isNotEmpty) &&
            validateInput(solDateInput,formInputValidatorModule.solDateFormat)
        let v2 = validateInput(missionSelection, formInputValidatorModule.isNotEmpty)
        let v3 = validateInput(cameraSelection, formInputValidatorModule.isNotEmpty)

        return v1 && v2 && v3
    }

    /**
     * Process the manifest validation data given.
     * @param data - the manifest required data given.
     */
    const processManifest = (data) => {
        const manifest = new manifestModuleValidator.NasaManifest(data)

        if(isValidInputByManifest(manifest))
        {
            const isDateFormat = solDateInput.value.trim().includes('-') ? 'earth_date' : 'sol'
            const urlNasaImagesRover = `rovers/${missionSelection.value}/photos?${isDateFormat}=
            ${solDateInput.value.trim()}
            &camera=${cameraSelection.value}&`;
            nasaApiModule.getNasaRespond(urlNasaImagesRover, cardsNasaImageListModule.process)
        }
    }

    /**
     * Check input validation according the manifest given.
     * @param manifest - The manifest with required info needed to be validate
     * @returns - is the input is according the manifest.
     */
    const isValidInputByManifest = (manifest) => {
        let v1

        const dateOrSol = solDateInput.value.trim();
        if(dateOrSol.includes('-')){
            v1 = showMessageErrorValidation(solDateInput,manifest.isDateAfterLandValid(dateOrSol)) &&
                showMessageErrorValidation(solDateInput,manifest.isDateBeforeMaxLandValid(dateOrSol))
            return  v1
        }

        return showMessageErrorValidation(solDateInput,manifest.isSolValid(dateOrSol))
    }


    /****************************************************Modules*******************************************************/
    //------------------------------------------manifestModuleValidator-------------------------------------------------
    // Validate manifest data info module.
    const manifestModuleValidator =(()=>{
        let classes = {}

        // Class of the relevant data from the manifest.
        classes.NasaManifest = class NasaManifest{

            constructor(data){
                this.name = data['photo_manifest']['name']
                this.landDate = data['photo_manifest']['landing_date']
                this.maxDate = data['photo_manifest']['max_date']
                this.maxSol = data['photo_manifest']['max_sol']
            }

            /**
             * Validate if date is after the initial landing time.
             * @param date - date of the mission.
             * @returns {{isValid: boolean, message: string}} - boolean and a message in case validation failed.
             */
            isDateAfterLandValid(date) {
                date = date.trim()
                return {
                    isValid: date > this.landDate,
                    message: EARLY_DATE_MISSION_ERROR + this.landDate
                }
            }

            /**
             * Validate if the date is before the maximum time that can be.
             * @param date - date of the mission.
             * @returns {{isValid: boolean, message: string}}- boolean and a message in case validation failed.
             */
            isDateBeforeMaxLandValid(date) {
                date = date.trim()
                return {
                    isValid: date <= this.maxDate,
                    message: LATE_DATE_MISSION_ERROR + this.maxDate
                }
            }

            /**
             * Check sol if between  0 and maxSol can be given.
             * @param sol - day passed from the initial start of the mission.
             * @returns {{isValid: boolean, message: string}}- boolean and a message in case validation failed.
             */
            isSolValid(sol) {
                return{
                    isValid:  0<=sol && sol<= this.maxSol,
                    message: SOL_MISSION_ERROR + this.maxSol
                }
            }
        }

        return classes
    })()

    //------------------------------------------formInputValidatorModule------------------------------------------------
    // Module for the initial validation of html input.
    let formInputValidatorModule = (()=> {

        /**
         * check the string is not empty
         * @param str - string to validate
         * @returns {{isValid: boolean, message: string}}- boolean and a message in case validation failed.
         */
        const isNotEmpty = function (str) {
            return {
                isValid: (str.length !== 0),
                message: EMPTY_INPUT_ERROR
            };
        }

        /**
         * Check the string has sol or YYYY-MM-DD format day.
         * @param str - string to validate
         * @returns {{isValid: boolean, message: string}}- boolean and a message in case validation failed.
         */
        const isDateSolFormatValid = function (str) {
            str = str.trim()
            return {
                isValid: (/^\d{4}-(0[1-9]|1[0-2]|[1-9])-(0[1-9]|[12][0-9]|3[01]|[1-9])$/.test(str)) ||
                    (/^\d+$/.test(str)),
                message: SOL_DATE_FORMAT_ERROR
            }
        }

        return {
            isNotEmpty: isNotEmpty,
            solDateFormat: isDateSolFormatValid,
        }
    })()

    //------------------------------------------cardsNasaImageListModule------------------------------------------------
    // Module for the card list of the NASA images data.
    let cardsNasaImageListModule = (() => {

        /**
         * Process the data given and show the html accordingly
         * @param data - NASA data given.
         */
        const process = function (data) {
            nasaImagesListTag.innerHTML = ''
            if (data['photos'].length > 0) {
                data['photos'].forEach(imageData => {
                    nasaImagesListTag.innerHTML += htmlElementsBuilderModule.imageToCardHtml(imageData)
                });
                attachListeners()
            }
            else {
                nasaImagesListTag.innerHTML =
                    "<div class='col-sm-3 ml-3 mt-3 bg-warning' style='margin-left:15px'>Not Found</div>"
            }
        }

        /**
         * Add item to the save list.
         * @param imageData - the event called.
         */
        function add(imageData) {
                fetch('/marsImages/add', getPostMessage(imageData)).
                then(status).
                then(json).then(data=> {
                        if(!data.created) {
                            showModalError(IMAGE_EXISTED_ERROR)
                        }else{
                            savedImagesListModule.setList()
                        }
                }).
                catch(()=>{
                    window.location.href = '/marsImages/error'
                });
        }

        // Attach the save button listeners.
        function attachListeners() {
            for (const button of document.getElementsByClassName('btn-saved')) {
                button.addEventListener('click', (event) => {
                    add(domDataExtractorModule.getCardData(event));
                })
            }
        }

        return {process:process}
    })()

    //------------------------------------------savedImagesListModule---------------------------------------------------
    // Module for the images stored in the user list.
    let savedImagesListModule = (() => {

        let savedList = {}

        // Set user saved mars images list.
        savedList.setList = () =>{
            fetch('/marsImages/saveList').
            then(status).
            then(json).then(data => {
                    document.getElementById('saveImageList').innerHTML = getHtmlSavedList(data);
                    if (document.getElementById('editList').innerText === 'Cancel') {
                        showRemoveButtons();
                    }
                    attachSavedImagesListeners();
                }
            ).catch(()=>{
                window.location.href = '/marsImages/error'
            })
        }

        /**
         * Removed item from the database by url given.
         * @param url - NASA image url.
         */
        savedList.remove = (url) =>{
            fetch('/marsImages/remove',{
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(url),
            }).
            then(status).
            then(()=> {
                savedImagesListModule.setList();
            }).
            catch(()=>{
                window.location.href = '/marsImages/error'
            });
        }

        /**
         * Get the html of the saved images list.
         * @param imagesListData - the stored images data in db.
         * @return savedListImages - html of the saved images.
         */
        function getHtmlSavedList(imagesListData){
            let savedListImages = '';
            for(const image of imagesListData){
                savedListImages += (htmlElementsBuilderModule.sqlToOlItemHtml(image));
            }

            return savedListImages;
        }

        // Attach remove button listeners.
        function attachSavedImagesListeners(){
            for (const button of document.getElementsByClassName('btn-remove')) {
                button.addEventListener('click', (event) => {
                    savedImagesListModule.remove(domDataExtractorModule.getSavedListUrlData(event));
                })
            }
        }

        return savedList;
    })()

    //------------------------------------------htmlElementsBuilderModule-----------------------------------------------
    // Module for building required elements according given data.
    let htmlElementsBuilderModule = (() =>{
        let builder = {}

        /**
         * Get card html item
         * @param imageData- data of specific image.
         * @return Html card with image info.
         */
        builder.imageToCardHtml = (imageData) => {
            return `<div id="${imageData['id']}" class="col-sm-3" style="margin-right: 100px">
                <img class="card-img-top img-fluid" src=${imageData['img_src']} alt="Card image cap">
                <div class="card">
                    <div class="card-body">
                        <p class="card-text" data-earthDate = ${imageData['earth_date']}>
                        Earth date: ${imageData['earth_date']}</p>
                        <p class="card-text" data-sol = ${imageData['sol']}>Sol:${imageData['sol']}</p>
                        <p class="card-text" data-camera =  ${imageData['camera']['name']}>
                        Camera: ${imageData['camera']['name']}</p>
                        <p class="card-text" data-mission = ${imageData['rover']['name']}>
                        Mission: ${imageData['rover']['name']}</p>
                        <button type="button" class="btn-saved btn btn-info">Save</button>
                        <a href="${imageData['img_src']}" target="_blank"  class="btn btn-primary" type ="button" >
                        fullsize</a>
                    </div>
                </div>
            </div>`;
        }

        /**
         *  Get ol item with the image data retrived from the sql database.
         * @param dbData - image data retrived from the data base.
         * @return Html ol item with image data.
         */
        builder.sqlToOlItemHtml = (dbData) => {
            return `<li class="image-list-item list-group-item d-flex justify-content-between align-items-start">
                        <div class="ms-2 me-auto">
                            <a href="${dbData.url}" target="_blank">image id:${dbData.imageId}</a>
                            <p style="margin-bottom: 0" data-earthDate="${dbData.earth_date}" 
                            data-sol ="${dbData.sol}" data-camera ="${dbData.camera}">
                            Earth Date: ${dbData.earth_date}, Sol: ${dbData.sol}, Camera: ${dbData.camera}</p>
                            <button class="btn btn-outline-danger btn-remove" type="button" style="padding-top: 0;display: none">delete</button>
                      
                        </div>
                     </li>`
        }

        /**
         * Get carousel item with the image data.
         * @param imageData - image data retrived from the data base.
         * @return Html carousel item
         */
        builder.sqlToCarouselItemHtml = (imageData) => {
            return `<div class="carousel-item">
                              <img src=${imageData.url} class="img-fluid d-block w-100" alt="..." height="600px">
                              <div class="carousel-caption d-none d-md-block">
                                 <h5>${imageData.camera}</h5>
                                 <p>${imageData.earth_date}</p>
                                 <a href="${imageData.url}" target="_blank"  class="btn btn-primary" type ="button" >
                                 fullsize</a>
                              </div>
                         </div>`
        }

        return builder;
    })()

    //------------------------------------------domDataExtractorModule--------------------------------------------------
    // Module for getting data from existed DOM content.
    let domDataExtractorModule = (() =>{
        let extractor = {};

        /**
         * Get the image data from existed image caard.
         * @param event
         * @return image data stored on the card.
         */
        extractor.getCardData = (event)=> {
            let imageData = {}
            imageData.id = event.target.parentElement.parentElement.parentElement.id;
            imageData.earth_date = event.target.previousElementSibling.previousElementSibling.
            previousElementSibling.previousElementSibling.
            getAttribute('data-earthDate')
            imageData.sol = event.target.previousElementSibling.previousElementSibling.
            previousElementSibling.getAttribute('data-sol')
            imageData.camera = event.target.previousElementSibling.previousElementSibling.
            getAttribute('data-camera')
            imageData.imgSrc = event.target.parentElement.parentElement.previousElementSibling.src;
            imageData.mission = event.target.previousElementSibling.getAttribute('data-mission')
            return imageData;
        }

        /**
         * Get the url stored in the saved list of images.
         * @param event
         * @return image url
         */
        extractor.getSavedListUrlData = (event) => {
            let imageData = {}
            imageData.url = event.target.previousElementSibling.previousElementSibling.href;
            return imageData;
        }

        /**
         * Get image data stored in the saved list.
         * @param item - list item.
         * @return image data stored.
         */
        extractor.getSavedListItemData = (item) => {
            let imageData = {};
            imageData.url = item.getElementsByTagName('a')[0].href
            imageData.earth_date = item.getElementsByTagName('p')[0].getAttribute('data-earthDate')
            imageData.sol = item.getElementsByTagName('p')[0].getAttribute('data-sol')
            imageData.camera = item.getElementsByTagName('p')[0].getAttribute('data-camera')

            return imageData;
        }

        return extractor;
    })()

    //-------------------------------------------nasaApiModule----------------------------------------------------------
    // Module for the  NASA api requests such as manifest and images.
    let nasaApiModule = (() => {
        const NASA_TOKEN = 'c9BeBpDvjOAss5qpqCD0mztc6hORvCb0nvw5MAwe'
        const NASA_DIRECTORY = `https://api.nasa.gov/mars-photos/api/v1/`

        /**
         * Send the http request for the NASA api.
         * @param url - the url send the request to.
         * @param processDataFunc - function processing the data returned.
         */
        const getNasaRespond =  (url, processDataFunc) => {
            document.getElementById("loadingSpinner").style.display = 'block'
            url = NASA_DIRECTORY + url + `api_key=${NASA_TOKEN}`
            fetch(url)
                .then(status)
                .then(json)
                .then(function (data) {
                    processDataFunc(data)
                })
                .catch(function () {
                    nasaImagesListTag.innerHTML =
                        `<div class='col-sm-3 mt-3 bg-warning' style='margin-left:15px'>
                            NASA servers are not available right now, please try again later 
                        </div>`
                }).finally(function (){
                document.getElementById("loadingSpinner").style.display = 'none'
            });
        }

        return {getNasaRespond: getNasaRespond}
    })()

    //------------------------------------------------------------------------------------------------------------------
    /**
     * Get post format type request.
     * @param message - body content.
     * @return {{headers: {"Content-Type": string}, method: string, body: string}}
     */
    function  getPostMessage(message){
        return {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        }
    }

    // Validate statues request sent.
    function status(response){
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response)
        } else {
            return Promise.reject(new Error(response.statusText))
        }
    }

    // Convert data to json object.
    function json(response){
        return response.json()
    }

    /***********************************************DOMContentLoaded***************************************************/

    document.addEventListener('DOMContentLoaded', () => {

        const EDIT_LIST = 'Edit List';
        const CANCEL_EDIT_LIST = 'Cancel';

        errorInfoModal = new bootstrap.Modal(document.getElementById("mWarnModal"))
        solDateInput = document.getElementById('dateInput')
        missionSelection = document.getElementById('missionSelection')
        cameraSelection = document.getElementById('cameraSelection')
        nasaImagesListTag = document.getElementById('nasaImagesList')

        savedImagesListModule.setList();

        // Submit the forum input.
        document.getElementById('searchForm').addEventListener('submit', function (event) {
            event.preventDefault()
            nasaImagesListTag.innerHTML = ''
            if(validateForumInput())
            {
                const urlNasaManifest = `manifests/${missionSelection.value}/?`
                nasaApiModule.getNasaRespond(urlNasaManifest,processManifest)

            }
        });

        // Show the carousel slides.
        document.getElementById('showSlide').addEventListener('click', function () {
                const carousel = document.getElementById('carouselMarImages')

                let savedItemsList = document.querySelectorAll('.image-list-item')
                carousel.innerHTML = ''
                if(savedItemsList.length > 0) {
                    document.querySelectorAll('.image-list-item').forEach(item => {
                        carousel.innerHTML += htmlElementsBuilderModule.sqlToCarouselItemHtml
                        (domDataExtractorModule.getSavedListItemData(item));
                    })

                    carousel.firstElementChild.classList.add('active')

                    carousel.style.display = 'block'
                }else{
                    showModalError(EMPTY_CAROUSEL_ERROR)
                }
        })

        // Stop showing the carousel slides.
        document.getElementById('stopSlide').addEventListener('click', function () {
            const carousel = document.getElementById('carouselMarImages')
            carousel.style.display = 'none'
        })

        // Clear the forum input and list.
        document.getElementById('clearBtn').addEventListener('click', function () {
            nasaImagesListTag.innerHTML = ''
            clearInputs(solDateInput,missionSelection,cameraSelection)
        })

        // Show or hide the removal buttons of the saved list images.
        document.getElementById('editList').addEventListener('click',function (event){
                if(event.target.innerText === EDIT_LIST) {
                    event.target.innerText = CANCEL_EDIT_LIST
                    showRemoveButtons()
                }else{
                    event.target.innerText = EDIT_LIST
                    hideSavedImagesRemovalButtons();
                }

        })

        // Clear form inputs.
        function clearInputs() {
            for(let i= 0;i<arguments.length;i++)
            {
                arguments[i].value = ''
                arguments[i].nextElementSibling.innerHTML = ''
                arguments[i].classList.remove("is-invalid")
            }
        }

    });

    //-----------------------------------------------------------------------------------------------------------------

    // Hide the button which remove the images.
    function  hideSavedImagesRemovalButtons() {
        document.querySelectorAll('.btn-remove').forEach(button =>{
            button.style.display = 'none';
        })
    }

    // Show the button which remove the images.
    function showRemoveButtons(){
        document.querySelectorAll('.btn-remove').forEach(button =>{
            button.style.display = 'block';
        })
    }

    // Show modal with according error given.
    function showModalError(error){
        document.getElementById('modal-warning').innerText = error;
        errorInfoModal.show();
    }


})();


