const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const textInput = document.querySelector('#text');
const amount = document.querySelector('#amount');
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];
function addTransaction(e){
    if(textInput.value.trim() === '' || amount.value.trim() === '')alert('Enter Add Text and Amount First');
    else{
        const transaction = {
            id: generateID(),
            text: text.value,
            amount: +amount.value
        };
        transactions.push(transaction);
        addTransactionDOM(transaction);
        updateValues();
        updateLocalStorage();
        text.value = '';
        amount.value = '';
    }
    e.preventDefault();
}
function generateID() {
    return Math.floor(Math.random() * 100000000);
}
function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
    item.innerHTML = `
        <span>${transaction.text}</span>
        <span>${sign}${Math.abs(transaction.amount)}</span>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
        <button class="edit-btn" onclick="editTransactionPrompt(${transaction.id},'${transaction.text}',${transaction.amount})">Edit</button>
    `;
    list.appendChild(item);
}

function removeTransaction(id){
    transactions = transactions.filter(transaction =>
    transaction.id !== id);
    updateLocalStorage();
    init();
}
function editTransactionPrompt(id, text, amount) {
    const newText = prompt("Enter new text:", text);
    const newAmount = parseFloat(prompt("Enter new amount:", amount));
    
    if (newText !== null && !isNaN(newAmount)) {
        editTransaction(id, newText, newAmount);
    }
}
function editTransaction(id, newText, newAmount) {
    transactions = transactions.map(transaction => {
        if (transaction.id === id) {
            return { ...transaction, text: newText, amount: newAmount };
        } else {
            return transaction;
        }
    });
    updateLocalStorage();
    init();
}


function updateValues(){
    
    const amounts = transactions.map(transaction => transaction.amount);

    const total = amounts.reduce((acc,item) => (acc += item),0).toFixed(2);

    const income = amounts.filter(item => item > 0).reduce((acc,item) => (acc += item),0).toFixed(2);

    const expense = (amounts.
                        filter(item => item < 0).
                        reduce((acc,item) => (acc += item),0) * -1).
                        toFixed(2);

    balance.innerText = `₹${total}`;
    money_plus.innerText = `₹${income}`;
    money_minus.innerText = `₹${expense}`;
}
function updateLocalStorage(){
    localStorage.setItem('transactions',JSON.stringify(transactions));
}
function init(){
    list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
}

init();

form.addEventListener('submit',addTransaction);