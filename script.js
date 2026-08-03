
let transactionsArray = [];


let currentSymbol =localStorage.getItem("currency") || "₹";

function currencyInputUpdater(){
    const currencySelector = document.getElementById("currency");
    if(currentSymbol === "₹"){
        currencySelector.value = "INR";
    } else{
        currencySelector.value = "SAR";
    }
}


if(currentSymbol === "₹"){

}

console.log(currentSymbol);

function saveTransactions(){
    localStorage.setItem("Transactions",JSON.stringify(transactionsArray));
}

function loadTransactions(){
    const savedTransaction = localStorage.getItem("Transactions");
    if(savedTransaction){
        transactionsArray = JSON.parse(savedTransaction);
        renderCard(transactionsArray);
    }
}

loadTransactions();



function getInput(){
    const transactionForm = document.getElementById("transactionForm");
    transactionForm.addEventListener("submit",(event)=>{
        event.preventDefault();
        const transactionTitle = document.getElementById("title").value;
        const transactionAmount = Number(document.getElementById("amount").value);
        const type = document.getElementById("type").value;
        const category = document.getElementById("category").value;
        const defaultDate = document.getElementById("date").value;
        const parts = defaultDate.split("-");
        
        const date = `${parts[2]}-${parts[1]}-${parts[0]}`;

        let transaction = {
            title:transactionTitle,
            amount:transactionAmount,
            type:type,
            category:category,
            date:date
        }
        transactionsArray.push(transaction);

        renderCard(transactionsArray);

        clearForm();

    });
}

getInput();

let currentEditingTransaction = null;

function renderCard(array){
    const transactionContainer = document.getElementById("transactionContainer");

    transactionContainer.innerHTML ="";

    array.forEach((transaction)=>{
        
        transactionContainer.innerHTML += `
            <div class="transaction-card">

                    <div class="top-section">

                        <p class="transaction-type">
                            ${transaction.type}
                        </p>

                        <h2 class="transaction-amount">
                            ${currentSymbol} ${transaction.amount}
                        </h2>

                    </div>

                    <div class="middle-section">

                        <h3 class="transaction-title">
                            ${transaction.title}
                        </h3>

                        <p class="transaction-category">
                            ${transaction.category}
                        </p>

                        <p class="transaction-date">
                            ${transaction.date}
                        </p>

                    </div>

                    <div class="button-container">

                        <button class="editBtn">
                            Edit
                        </button>

                        <button class="deleteBtn">
                            Delete
                        </button>

                    </div>

            </div> 
        `;    

        
    });
    const deleteBtns = document.querySelectorAll(".deleteBtn");
    deleteBtns.forEach((button,index) =>{
        button.addEventListener("click",()=>{
            const originalIndex = transactionsArray.indexOf(array[index]);
            transactionsArray.splice(originalIndex,1);
            renderCard(transactionsArray);
        });
    });

    const editBtns = document.querySelectorAll(".editBtn");
    editBtns.forEach((button,index)=>{
        button.addEventListener("click",()=>{
            const originalIndex = transactionsArray.indexOf(array[index]);
            editTransaction(originalIndex);
        });
    });
    updateDashboard();
    currencyInputUpdater();
    saveTransactions();
    

}

function updateCurrency(){
    const currentCurrency = document.getElementById("currency");
    currentCurrency.addEventListener("change",()=>{
        if(currentCurrency.value === "SAR"){
            currentSymbol = "SAR";
            
        } else{
            currentSymbol = "₹";
            
        }

        renderCard(transactionsArray);
        
        localStorage.setItem("currency",currentSymbol);
        
        
    });


    
    
}

updateCurrency();



function editTransaction(index){

    currentEditingTransaction = index;

    const transactionTitle = document.getElementById("title");
    const transactionAmount = document.getElementById("amount");
    const type = document.getElementById("type");
    const category = document.getElementById("category");
    const defaultDate = document.getElementById("date");

    transactionTitle.value = transactionsArray[index].title;
    transactionAmount.value = transactionsArray[index].amount;
    type.value = transactionsArray[index].type;
    category.value = transactionsArray[index].category;

    const convertedDate = transactionsArray[index].date;
    const parts = convertedDate.split("-");
    defaultDate.value = `${parts[2]}-${parts[1]}-${parts[0]}`;

    const addTransactionBtn = document.getElementById("addBtn");
    const updateTransactionBtn = document.getElementById("updateBtn");

    addTransactionBtn.style.display = "none";
    updateTransactionBtn.style.display = "flex";


    

}
const updateTransactionBtn = document.getElementById("updateBtn");
updateTransactionBtn.addEventListener("click",()=>{
    updateTransaction();
});


function updateTransaction(){
    if(currentEditingTransaction === null){
        return;
    }
    const transactionTitle = document.getElementById("title").value;
    const transactionAmount = Number(document.getElementById("amount").value);
    const type = document.getElementById("type").value;
    const category = document.getElementById("category").value;
    const defaultDate = document.getElementById("date").value;
    const parts = defaultDate.split("-");
        
    const date = `${parts[2]}-${parts[1]}-${parts[0]}`;


    transactionsArray[currentEditingTransaction].title = transactionTitle;
    transactionsArray[currentEditingTransaction].amount = transactionAmount;
    transactionsArray[currentEditingTransaction].type = type;
    transactionsArray[currentEditingTransaction].category = category;
    transactionsArray[currentEditingTransaction].date = date;

    currentEditingTransaction = null;

    renderCard(transactionsArray);

    clearForm();

    const addTransactionBtn = document.getElementById("addBtn");
    const updateTransactionBtn = document.getElementById("updateBtn");

    addTransactionBtn.style.display = "flex";
    updateTransactionBtn.style.display = "none";

}

function clearForm(){

    document.getElementById("title").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("type").value = "";
    document.getElementById("category").value = "";
    document.getElementById("date").value = "";
}

function updateDashboard(){
    const totalbalanceText = document.getElementById("totalBalance");
    const totalIncomeText = document.getElementById("totalIncome");
    const totalExpenseText = document.getElementById("totalExpense");
    const totalTransactionsText = document.getElementById("totalTransactions");

    
    const totalIncome = transactionsArray.reduce((accumulator,transaction)=>{
        if(transaction.type === "Income"){
            return accumulator + transaction.amount;
        }
        return accumulator;
    },0);

    const totalExpense = transactionsArray.reduce((accumulator,transaction)=>{
        if(transaction.type === "Expense"){
            return accumulator + transaction.amount;
        }
        return accumulator;
    },0);

    const totalTransactions = transactionsArray.length;
    
    const totalBalance = totalIncome - totalExpense;
    

    
    totalIncomeText.textContent = `${currentSymbol} ${totalIncome}`;
    totalExpenseText.textContent = `${currentSymbol} ${totalExpense}`;
    totalTransactionsText.textContent = `${totalTransactions}`;
    totalbalanceText.textContent = `${currentSymbol} ${totalBalance}`;

    currencyInputUpdater();

}

function searchTransaction(){
    
    
    const searchInput = document.getElementById("searchInput");
    const filterCategory = document.getElementById("filterCategory");
    const sortOption = document.getElementById("sortOption");


    searchInput.addEventListener("input",applyFilter);
    filterCategory.addEventListener("change",applyFilter);
    sortOption.addEventListener("change",applyFilter);
    
        
}
searchTransaction()

function applyFilter(){
        const searchInput = document.getElementById("searchInput");
    
        const inputName = searchInput.value;
        const filterCategory = document.getElementById("filterCategory").value;
        const sortOption = document.getElementById("sortOption").value;

        const filteredArray = transactionsArray.filter((transaction)=>{
            
            
            
            if(filterCategory === "All"){
                if(transaction.title.toLowerCase().includes(inputName.toLowerCase())){
                    return true;
                }  
                
                return false;
                
            }
            
            if((transaction.title.toLowerCase().includes(inputName.toLowerCase()) && transaction.category === filterCategory)){
                return true;
            } 
            return false;
            
        });

        

        filteredArray.sort((a,b)=>{
            if(sortOption === "Lowest"){
                return a.amount - b.amount;
            }
            if(sortOption === "Highest"){
                return b.amount - a.amount;
            }
            if(sortOption === "Newest"){
                const aDate = a.date.split("-");
                const newADate = `${aDate[2]}-${aDate[1]}-${aDate[0]}`;

                const bDate = b.date.split("-");
                const newBDate = `${bDate[2]}-${bDate[1]}-${bDate[0]}`;

                return new Date(newBDate) - new Date(newADate);

            }
            if(sortOption === "Oldest"){
                const aDate = a.date.split("-");
                const newADate = `${aDate[2]}-${aDate[1]}-${aDate[0]}`;

                const bDate = b.date.split("-");
                const newBDate = `${bDate[2]}-${bDate[1]}-${bDate[0]}`;

                return new Date(newADate) - new Date(newBDate);

            }
        });

        renderCard(filteredArray);
 
        
}

