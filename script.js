let form = document.getElementById("signupForm");

/* console.log(this.elements['username'].parentElement.parentElement.querySelector('.feedBack').innerText = ""); */

function setError(element, message) {
    let feedBack = element.parentElement.parentElement.querySelector('.feedBack')
    feedBack.innerText = message;

    element.classList.add('is-invalid');
    element.classList.remove('is-valid');
}

function setSuccess(element) {
    let feedBack = element.parentElement.parentElement.querySelector('.feedBack')
    feedBack.innerText = "";

    element.classList.add('is-valid');
    element.classList.remove('is-invalid');
}

form.onsubmit = async function (e) {
    e.preventDefault();

    let $username = false;
    let $email = false;
    let $password = false;
    let $confirmPassword = false;

    let username = this.elements['username'].value.trim();
    let email = this.elements['email'].value.trim();
    let password = this.elements['password'].value.trim();
    let confirmPassword = this.elements['confirmPassword'].value.trim();

    let usernameReg = /^[a-zA-Z][a-zA-Z0-9]{3,13}[a-zA-Z]$/ig;
    let emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;

    if (username === '' || !usernameReg.test(username)) {
        setError(this.elements['username'], "Please enter valid username!");
        $username = false;
    }
    else {
        setSuccess(this.elements['username']);
        $username = true;
    }

    if (email === '' || !emailReg.test(email)) {
        setError(this.elements['email'], "Please enter valid email!");
        $email = false;
    }
    else {
        setSuccess(this.elements['email']);
        $email = true;
    }

    if (password === '' || password.length < 8) {
        setError(this.elements['password'], "password must be at least 8 characters!");
        $password = false;
    }
    else {
        setSuccess(this.elements['password']);
        $password = true;
    }


    if (password === '') {
        setError(this.elements['confirmPassword'], "please confirm password!");
        $confirmPassword = false;
    }
    else if (password !== confirmPassword) {
        setError(this.elements['confirmPassword'], "passwords dont match!");
        $confirmPassword = false;
    }
    else {
        setSuccess(this.elements['confirmPassword']);
        $confirmPassword = true;
    }


    if ($username && $email && $password && $confirmPassword) {
        const object = { "username": username , "email":email, "password":password , "password_confirmation":confirmPassword };
        //const object = { "username": "ahm0ed", "email": "email@gmail.com", "password": "123456789Aa##", "password_confirmation": "123456789Aa##" };
        const response = await fetch('https://goldblv.com/api/hiring/tasks/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(object),
            redirect: 'follow'
        }).then(async response => {
            if (!response.ok) {return response.json()};
            let successResponse =  await response.json();
            sessionStorage.setItem("email", successResponse.email);
            window.location.href = "/succeed.html";
            this.reset();
        })
            .then(result => {
                if (result) {
                    for (const [error] of Object.entries(result.errors)) {
                        if(error == 'password')
                        {
                            if(result.errors.password.length > 1)
                            {
                                setError(this.elements['password'], result.errors.password[1]);
                                setError(this.elements['confirmPassword'], result.errors.password[0]);
                            }
                            else
                            {
                                setError(this.elements['password'], result.errors.password[0]);
                            }
                        }
                        else if(error == 'username') 
                        {
                            setError(this.elements['username'],result.errors.username[0]);
                        }
                        else if(error == 'email')
                        {
                            setError(this.elements['email'],result.errors.email[0]);
                        }
                    }
                }
            })
            .catch(error => console.log('error', error));

    }
}