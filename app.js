// BUDGET CONTROLLER ////////////////////////////////////////

var budgetController = (function() {
    
    var Expense = function(id, description, value) {
        this.id = id,
        this.description = description,
        this.value = value
    }; 
    
    var Income = function(id, description, value) {
        this.id = id,
        this.description = description,
        this.value = value
    }; 
    
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };
    
    
    // ---- PUBLIC METHODS ----
    return {
        addItem: function(type, des, val) {
            var newItem, ID;
            
            //create new ID
            if (data.allItems[type].length > 0) {    
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            
            //create new item based in inc or exp type
            if(type === 'exp'){
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            //push into data structure
            data.allItems[type].push(newItem);
            
            //return new element
            return newItem;
        },
        
        testing: function(type) {
            console.log(data);
        }
    }
    
    
})();


// UI CONTROLLER //////////////////////////////////////////////

var UIController = (function() {
    
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
    };
    
    
    // ---- PUBLIC METHODS ----
    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMStrings.inputType).value, // will be inc or exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value:  document.querySelector(DOMStrings.inputValue).value
            };
        },
        getDOMstrings: function(){
            return DOMStrings;
        },   
        addListItem: function(obj, type) {
            var html, newHtml, element;
            // create HTML string with placeholder text
            
            if(type === 'inc') {
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMStrings.expensesContainer;
                 html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';   
            }
            
            // replace the placeholder text with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            
            // insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        clearFields: function (){
            var fields, fieldsArr;
            
            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);
            
            fieldsArr = Array.prototype.slice.call(fields);
            
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });
        }
    };  
})();


//GLOBAL APP CONTROLLER //////////////////////////////////////

var controller = (function(budgetCtrl, UICtrl) {
  
    var setupeventListeners = function() {
        var DOM = UICtrl.getDOMstrings();
        
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        
        document.addEventListener('keypress', function(event) {
            if(event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        }); 
    }
  
    var  ctrlAddItem = function() {
        
        var input, newItem;
        // Get the input data
        input = UICtrl.getInput();
        
        // Add item to budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        
        // add the item to the UI
        UIController.addListItem(newItem, input.type);
        
        // clear the fields
        UIController.clearFields();
        // calculate the budget
        // display the budget on the UI
    };   
    
    
    // ---- PUBLIC METHODS ----
    return {
        init: function() {
            console.log('App started');
            setupeventListeners();
        }
    };
    
})(budgetController, UIController);

controller.init();