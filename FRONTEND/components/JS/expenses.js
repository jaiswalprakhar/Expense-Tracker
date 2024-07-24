const expenseTable = document.querySelector('.expense-table');
const expenseList = document.getElementById('expense-list');

const amount = document.getElementById('amount');
const description = document.getElementById('description');
const category = document.getElementById('category');
const addButton = document.getElementById('addExpense');
const editButton = document.getElementById('editExpense');

const toastBody = document.getElementsByClassName('toast-body')[0];
const toastLiveExample = document.getElementById('liveToast');

const showToastResult = (message) => {
    toastBody.textContent = message;
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
    toastBootstrap.show();
};

// Get the current URL
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
}

window.addEventListener("DOMContentLoaded", () => {
    editButton.style.display = "none";
    axios.get(`http://localhost:3000/expense/get-expense`, { params })
    .then((response) => {
        console.log(response);
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
    })
});

export const handleExpenseSubmit = (event) => {
    event.preventDefault();
    const myobj = {
        amount: amount.value,
        description: description.value,
        category: category.value
    }

    console.log(userId);
    event.target.reset();
    createExpense(myobj);
}

const createExpense = (obj) => {
    const url = new URL('http://localhost:3000/expense/create-expense');
    url.searchParams.append('userId', userId);
    axios.post(url.toString(), obj)
        .then((response) => {
            showExpenses(response.data.newExpense);
            showToastResult(response.data.message);
            console.log(response.data.message);
        })
        .catch((err) => {
            console.log(err);
            showToastResult(err.response.data.err);
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
    if(expenseId)   {
        params.expenseId = expenseId;
    }
    axios.delete(`http://localhost:3000/expense/delete-expense`, { params })
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
    if(expenseId)   {
        params.expenseId = expenseId;
    }
    axios.get(`http://localhost:3000/expense/get-edit-expense`, { params }) 
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
    const url = new URL('http://localhost:3000/expense/post-edit-expense');
    url.searchParams.append('expenseId', expenseId);
    axios.patch(url.toString(), obj)
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