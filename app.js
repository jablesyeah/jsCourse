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
    
    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
    };
    
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
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
        
        deleteItem: function(type, id) {
            
            // id = 3
            data.allItems[type][id];
            
        },
        
        calculateBudget: function() {
            
            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            
            //calculate budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            
            //calculate % of income that has been spent
            if (data.totals.inc > 0) {
                
            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },
        
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
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
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
    };
    
    
    // ---- PUBLIC METHODS ----
    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMStrings.inputType).value, // will be inc or exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },
        addListItem: function(obj, type) {
            var html, newHtml, element;
            // create HTML string with placeholder text
            
            if(type === 'inc') {
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMStrings.expensesContainer;
                 html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';   
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
            
            fieldsArr[0].focus();
        },
        
        displayBudget: function(obj) {
            document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExp;
            
            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
               } else {
                   document.querySelector(DOMStrings.percentageLabel).textContent = '---';
               }
        },
        getDOMstrings: function(){
            return DOMStrings;
        },   
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
        
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    }
    
    var updatebudget = function() {
        // calculate the budget
        budgetCtrl.calculateBudget();
        
        // return budget
        var budget = budgetCtrl.getBudget();
        
        // display the budget on the UI
        UIController.displayBudget(budget);
    };
  
    var  ctrlAddItem = function() {
        
        var input, newItem;
        // Get the input data
        input = UICtrl.getInput();
        
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
        // Add item to budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        
        // add the item to the UI
        UIController.addListItem(newItem, input.type);
        
        // clear the fields
        UIController.clearFields();
        
        // calculate and update budget
        updatebudget();
        
        }
    };
    
    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type;
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if (itemID) {
          
            // inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = splitID[1];
            
            // delete item from data structure
            
            // delete item from ui
            
            // update and show new budget
            
        }
    };
    
    
    // ---- PUBLIC METHODS ----
    return {
        init: function() {
            console.log('App started');
            setupeventListeners();
            UIController.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1 
            });
        }
    };
    
})(budgetController, UIController);

controller.init();