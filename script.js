const itemForm = document.querySelector('#item-form');
const itemInput = document.querySelector('#item-input');
const itemlist = document.querySelector('#item-list');
const clearBtn = document.querySelector('#clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm. querySelector('button')
let isEditMode = false;

// Function to display items from storage to dom 
function displayItems(){
    const itemsFromStorage =getItemsFromStorage();

    itemsFromStorage.forEach(item => addItemTODom(item));
}

// Function  To add items  
function onAddItemSubmit(e){
    e.preventDefault();

    const newItem = itemInput.value;

    // Validating Input
    if(itemInput.value === ''){
        alert('Please Enter Some Item');
        return;
    }

    // Editing the Items

    if(isEditMode){
        const itemToEdit =itemlist.querySelector('.edit');

        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.remove();
        isEditMode = false;
    } else{
        if(checkDuplicate(newItem)){
            alert('that item already Exists!');
            return;
        }
    }

    // Create Item DOM Element 
    addItemTODom(newItem);
    // Add Item to local storage

    addItemToStorage(newItem);

    checkUI();
    itemInput.value=''; 
}

// Add Item to dom 
function  addItemTODom(item){
    // Creating New List Item For every new Item We add
    const li =  document.createElement('li');
    li.appendChild(document.createTextNode(item));
    // Created Button
    const button = createButton('remove-item btn-link text-red')
    
    li.appendChild(button);
    // Added Li the Dom
    itemlist.appendChild(li);
}

// Funtion to create button Created
function createButton(classes){
    const button = document.createElement('button');
    button.className=classes;

    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;
}

// Funtion to create Icon in the button List  Created
function createIcon(classes){
    const icon = document.createElement('i');
    icon.className=classes;
    return icon;
}


// Function to Add items to storage 
function addItemToStorage(item){
    const  itemsFromStorage = getItemsFromStorage();

     
    // Add new Item to array 
    itemsFromStorage.push(item);

    // Convert to JSON String and set to local storage 
       localStorage.setItem('items',JSON.stringify(itemsFromStorage));

}

// Function TO Show And Get itmes from storage 
function getItemsFromStorage(){
        let itemsFromStorage;

        if(localStorage.getItem('items') === null){
            itemsFromStorage = []
        }else{
            itemsFromStorage =JSON.parse(localStorage.getItem('items'))
        }

        return itemsFromStorage;
}


// To remove Itmes from DOM 
function onClickItem(e){
    if(e.target.parentElement.classList.contains('remove-item')){
        removeItem(e.target.parentElement.parentElement)
    } else{
        setItemToEdit(e.target);
    }
}

// Function of function of update item 
function setItemToEdit(item){
    isEditMode = true;

    itemlist.querySelectorAll('li').forEach((i) => i.classList.remove('edit'))

    item.classList.add('edit');

    formBtn.innerHTML = '<i class= "fa-solid fa-pen"></i> Update Item';
    formBtn.style.backgroundColor = 'green'
    itemInput.value = item.textContent;
}

// Function To Remove Items login and then Called in onClickItem 
function removeItem(item){
         if(confirm('Are You Sure??')){
            // remove Item From Dom
            item.remove(); 

            // Remove Item From Storage

            removeItemFromStorage(item.textContent);
            checkUI();
        }
   
}

// Function To Remove Items login and then Called in removeItem() 
function removeItemFromStorage(item){
    let itemsFromStorage = getItemsFromStorage();

    // Filter Outing the localStorage Item to be removed
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);
    
    // Resetting  TO local Storage 

    localStorage.setItem('items',JSON.stringify(itemsFromStorage));
}

// To Remove all together With Cear all btn 
function clearItems(e){
    while(itemlist.firstChild){
        itemlist.removeChild(itemlist.firstChild);
    }

    // To remove all from Local Storage 
    localStorage.removeItem('items');

    checkUI();
}

// Function to filter Items
function filterItems(e){
    const items = itemlist.querySelectorAll('li');
    const text = e.target.value.toLowerCase();
    
    items.forEach((item)=>{
        const itemName= item.firstChild.textContent.toLowerCase();

        if(itemName.indexOf(text) != -1){
            item.style.display = 'flex';
        }else{
            item.style.display= 'none';
        }
         
    })
}

// Fnction to CHeck That item already exists used this func in add items func
function checkDuplicate(item){
    const itemsFromStorage = getItemsFromStorage();

    return itemsFromStorage.includes(item);
}

// Function TO remove Filter and Clear all btn When there is no item
function checkUI(){
    itemInput.value ='';

    const items = itemlist.querySelectorAll('li');
    if(items.length === 0){
        clearBtn.style.display = 'none';
        itemFilter.style.display = 'none';
    }else{
        clearBtn.style.display= 'block';
        itemFilter.style.display= 'block';
    }

    formBtn.innerHTML = '<i class = "fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333';

    isEditMode =false;
}


function createPDF(){
    if(document.getElementById("name").value == ""){
        alert('please enter something');
    }else{

        const doc = new jsPDF();

        doc.text(document.getElementById("name").value,95,10);
        doc.text(document.getElementById("info").innerText,80,22);
        doc.text(document.getElementById("item-list").innerText,30,33);

        doc.save("output.pdf");
    }
}



// Event Listners
itemForm.addEventListener('submit', onAddItemSubmit);
itemlist.addEventListener('click', onClickItem);
clearBtn.addEventListener('click',clearItems);
itemFilter.addEventListener('input',filterItems);
checkUI();
document.addEventListener('DOMContentLoaded',displayItems)