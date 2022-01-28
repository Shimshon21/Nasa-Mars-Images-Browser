
/********************************************
 Validate user email from the client side,
 if the user doesnt exist the data will be sent.
 else the data wont be sent.
 *********************************************/


document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('userRegisterForm').addEventListener('submit',function (event){
        event.preventDefault()

        const params = new URLSearchParams()
        params.append('email',document.getElementById('emailInput').value)

        fetch('/register/validation?'+params).
        then(status).
        then(json).
        then((data)=>{
            if (data.warning !== '') {
                document.getElementById('warningMessage').innerText = data.warning
            }else{
                document.getElementById('userRegisterForm').submit();
            }
        })
    });

    function status(response) {
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response)
        } else {
            return Promise.reject(new Error(response.statusText))
        }
    }

    function json(response) {
        return response.json()
    }

})


