const toastBody = document.getElementsByClassName('toast-body')[0];
const toastLiveExample = document.getElementById('liveToast');

const showToastResult = (message) => {
    toastBody.textContent = message;
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
    toastBootstrap.show();
};

export const handleForgotPassword = (event) => {
    event.preventDefault();
    const myobj = {
        emailId: event.target.emailId.value
    }

    event.target.reset();
    forgotPassword(myobj);
}

const forgotPassword = (obj) => {
    axios.post('http://localhost:3000/password/forgot-password', obj)
        .then((response) => {
            console.log(response);
            showToastResult(response.data.message);
        })
        .catch((err) => {
            console.log(err);
            //showToastResult(err.response.data.message);
            if(err.response.status === 500) {
                showToastResult("Something went wrong at Backend");
            }
            else  {
                showToastResult(err.response.data.message);
            }
        })
}