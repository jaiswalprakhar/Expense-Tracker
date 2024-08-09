const expenseTable = document.querySelector('.expense-table');
const expenseList = document.getElementById('expense-list');

const amount = document.getElementById('amount');
const description = document.getElementById('description');
const category = document.getElementById('category');
const addButton = document.getElementById('addExpense');
const editButton = document.getElementById('editExpense');
//const premiumParent = document.getElementById('buyPremiumMembership');
const premiumTxt = document.getElementById('buyPremiumMembershipTxt');
const premiumBtnParent = document.getElementById('premiumBtnParent');
const premiumBtn = document.getElementById('buyPremiumMembershipBtn');
const leaderBoardList = document.getElementById('leaderBoard-list');
const leaderBoardTable = document.getElementsByClassName('leaderBoard-table')[0];

const toastBody = document.getElementsByClassName('toast-body')[0];
const toastLiveExample = document.getElementById('liveToast');

const showToastResult = (message) => {
    toastBody.textContent = message;
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
    toastBootstrap.show();
};

/*// Get the current URL
const url = window.location.href;

// Create a URL object
const urlObject = new URL(url);

// Use URLSearchParams to parse the query string
const queryParams = new URLSearchParams(urlObject.search);

// Fetch specific query parameters
const userId = queryParams.get('id');
const params = {};
if(userId) {
    params.userId = userId;
}*/

const showPremiumUserMsg = () => {
    premiumBtn.remove();
    premiumTxt.textContent = `You are a Premium User`;

    leaderBoard();
    /*console.log(premiumBtn);
    const childNode = document.createElement('p');
    childNode.id = "buyPremiumMembershipTxt";
    childNode.className = 'text-end fw-bold';
    childNode.textContent = 'Premium User';
    childNode.style.color = '#6610f2';

    premiumParent.appendChild(childNode);
    console.log(premiumParent);*/
}

const leaderBoard = () => {
    const childNode = `<button type="button" class="btn btn-sm btn-success" id="showLeaderBoardBtn" onclick=showLeaderBoard()>Show LeaderBoard</button>`;
    premiumBtnParent.innerHTML += childNode;
}

window.showLeaderBoard = async () => {
    const token = localStorage.getItem('token');
    const userLeaderBoardArray = await axios.get(`http://localhost:3000/premium/showLeaderBoard`, { headers: {"Authorization": token} });
    console.log(userLeaderBoardArray);
    
    userLeaderBoardArray.data.forEach((userDetails) => {
        showLeaderBoardData(userDetails);
    })
}

const showLeaderBoardData = (userDetails) => {
    const childNode = `<tr class="text-center active-row">
                        <td>${userDetails.fullName}</td>
                        <td>${userDetails.total_cost}</td>                        
                       </tr>`;
    
    leaderBoardTable.innerHTML = leaderBoardTable.innerHTML + childNode;
    expenseList.style.display = "none";
    leaderBoardList.style.display = "block";
}

const parseJwt = (token) => {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

window.addEventListener("DOMContentLoaded", () => {
    //console.log(window.location.pathname);
    if (window.location.pathname === '/FRONTEND/components/Layout/expenses.html') {
        const token = localStorage.getItem('token');
        //axios.get(`http://localhost:3000/expense/get-expense`, { params })
        axios.get(`http://localhost:3000/expense/get-expense`, { headers: {"Authorization": token} })
        .then((response) => {
            //console.log(response);
            const decodedToken = parseJwt(token);
            //console.log(decodedToken);
            const isPremiumUser = decodedToken.isPremiumUser;
            if(isPremiumUser) {
                showPremiumUserMsg();
            }
            if(response.data.userExpenses.length <= 0)
            {
                expenseList.style.display = "none";
                showToastResult(response.data.message);
            }
            else  {
                for(let i = 0; i < response.data.userExpenses.length; i++)
                {
                    showExpenses(response.data.userExpenses[i]);
                    console.log(response.data.message);
                    showToastResult(response.data.message);
                }
            }
        })
        .catch((err) => {
            console.log(err);
            expenseList.style.display = "none";
            showToastResult(err.response.data.err);
            window.location.href = err.response.data.redirect;
        })
    }
});

export const handleExpenseSubmit = (event) => {
    event.preventDefault();
    const myobj = {
        amount: amount.value,
        description: description.value,
        category: category.value
    }

    event.target.reset();
    createExpense(myobj);
}

const createExpense = (obj) => {
    /*const url = new URL('http://localhost:3000/expense/create-expense');
    url.searchParams.append('userId', userId);
    axios.post(url.toString(), obj)*/
    const token = localStorage.getItem('token');
    axios.post('http://localhost:3000/expense/create-expense', obj, { headers: {"Authorization": token} })
        .then((response) => {
            showExpenses(response.data.newExpense);
            showToastResult(response.data.message);
            console.log(response.data.message);
            expenseList.style.display = "block";
        })
        .catch((err) => {
            console.log(err);
            showToastResult(err.response.data.err.errors[0].message);
        })
}

const showExpenses = (expense) => {
    const childNode = `<tr id = ${expense.id} class="text-center active-row">
                        <th scope="row">${expense.id}</th>
                        <td>${expense.amount}</td>
                        <td>${expense.description}</td>
                        <td>${expense.category}</td>
                        <td><button class="btn btn-success m-1" onclick = deleteExpense('${expense.id}') style="background-color: #009879"> Delete </button>
                        <button class="btn btn-success m-1" onclick = getEditExpense('${expense.id}') style="background-color: gray"> Edit </button></td>
                       </tr>`;
    expenseTable.innerHTML = expenseTable.innerHTML + childNode;
}

window.deleteExpense = (expenseId) => {
    /*if(expenseId)   {
        params.expenseId = expenseId;
    }
    axios.delete(`http://localhost:3000/expense/delete-expense`, { params })*/
    const token = localStorage.getItem('token');
    axios.delete(`http://localhost:3000/expense/delete-expense/${expenseId}`, { headers: {"Authorization": token} })
    .then((response) => {
        removeExpense(expenseId);
        console.log(response.data.message);
        showToastResult(response.data.message);
    })
    .catch((err) => {
        console.log(err.response.data.err);
        showToastResult(err.response.data.err);
    })
}

const removeExpense = (expenseId) => {
    const childElement = document.getElementById(expenseId);
    if(childElement)
    {
        expenseTable.removeChild(childElement);
    }
}

window.getEditExpense = (expenseId) => {
    /*if(expenseId)   {
        params.expenseId = expenseId;
    }
    axios.get(`http://localhost:3000/expense/get-edit-expense`, { params })*/
    const token = localStorage.getItem('token');
    axios.get(`http://localhost:3000/expense/get-edit-expense/${expenseId}`, { headers: {"Authorization": token} }) 
    .then((response) => {
        console.log(response.data.message);
        console.log(response.data.expense);
        showToastResult(response.data.message);

        amount.value = response.data.expense.amount;
        description.value = response.data.expense.description;
        category.value = response.data.expense.category;

       removeExpense(expenseId);

        editButton.style.display = "block";
        addButton.style.display = "none";
        editButton.onclick = (event) =>  {
            console.log("Edit Button clicked");

            const myobj = {
                amount: amount.value,
                description: description.value,
                category: category.value
            }
            amount.value = "";
            description.value = "";
            category.value = "Choose Category"

            postEditExpense(response.data.expense.id, myobj);
        }
    })
    .catch((err) => {
        console.log(err);
        showToastResult(err.response.data.err);
    })
}

const postEditExpense = (expenseId, obj) => {
    /*const url = new URL('http://localhost:3000/expense/post-edit-expense');
    url.searchParams.append('expenseId', expenseId);
    axios.patch(url.toString(), obj)*/
    const token = localStorage.getItem('token');
    axios.patch(`http://localhost:3000/expense/post-edit-expense/${expenseId}`, obj, { headers: {"Authorization": token} })
        .then((response) => {
            showExpenses(response.data.editedExpense);
            console.log(response.data.message);
            showToastResult(response.data.message);
        })
        .catch((err) => {
            console.log(err);            
            showToastResult(err.response.data.err.errors[0].message);
        })
        editButton.style.display = "none";
        addButton.style.display = "block";
}

//export const handlePremiumUser = async (event) => {
if(premiumBtn) {
    premiumBtn.onclick = async (event) => {  
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/purchase/premium-membership', { headers: {"Authorization": token} });
        const options = {
            "key": response.data.key_id,
            "order_id": response.data.order.id,
            "handler": async function (response) {
                //console.log(response);
                const res = await axios.post('http://localhost:3000/purchase/update-transaction-status', {
                    order_id: options.order_id,
                    payment_id: response.razorpay_payment_id,
                    status: 'SUCCESS'
                }, { headers: {"Authorization": token} })

                showToastResult('You are now a premium user');
                showPremiumUserMsg();
                /*console.log(response);
                console.log(res);*/
                localStorage.setItem('token', res.data.token);
            } 
        }

        const rzp1 = new Razorpay(options);
        rzp1.open();
        event.preventDefault();
        
        rzp1.on('payment.failed', async (response) => {
            /*console.log(response);
            console.log(response.error.metadata.order_id, response.error.metadata.payment_id);*/
            await axios.post('http://localhost:3000/purchase/update-transaction-status', {
                order_id: response.error.metadata.order_id,
                payment_id: response.error.metadata.payment_id,
                status: 'FAILED'
            }, { headers: {"Authorization": token} })

            showToastResult('Payment Issue');
        })
    }
}