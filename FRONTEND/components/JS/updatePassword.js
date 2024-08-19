const toastBody = document.getElementsByClassName('toast-body')[0];
const toastLiveExample = document.getElementById('liveToast');

const showToastResult = (message) => {
    toastBody.textContent = message;
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
    toastBootstrap.show();
};

export const handleUpdatePassword = (event) => {
    event.preventDefault();
    const newPassword = event.target.newPassword.value;

    const myobj = {
        newPassword: newPassword
    }

    event.target.reset();
    updatePassword(myobj);
}

const updatePassword = (obj) => {
    const url = window.location.href;
    const urlObject = new URL(url);
    const queryParams = new URLSearchParams(urlObject.search);
    const uuid = queryParams.get('uuid');
    const params = {};
    if(uuid) {
        params.uuid = uuid;
    }
    axios.patch(`http://localhost:3000/password/update-password`, obj, { params })
    .then((response) => {
        console.log(response.data.message);
        showToastResult(response.data.message);
    })
    .catch((err) => {
        console.log(err);
        showToastResult(err.response.data.message);
    })
}