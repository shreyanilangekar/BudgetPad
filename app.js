
//Controllers are basically IIFS wrapped in ()

//BUDGET CONTROLLER
var budgetController = (function(){

    var Expense = function(id,description,value)
    {
        this.id= id;
        this.description= description;
        this.value= value;
        this.percentage = -1;
    };

    //setting the value of percentage
    Expense.prototype.calcPercentage = function(totalInc)
    {
        if(totalInc>0)
        {
            this.percentage = Math.round((this.value/totalInc) * 100)
        }
        else this.percentage = -1;
    }
    //getting the value of percentage 
    Expense.prototype.getPercentage = function()
    {
        return this.percentage;
    }

    var Income = function(id,description,value)
    {
        this.id= id;
        this.description = description;
        this.value= value;
    };

    var calculateTotal= function(type)
    {
        var sum = 0;
        data.allItems[type].forEach(function(cur)
        {
            sum += cur.value
        });

        data.totals[type] = sum;

    };

    var data = {

        allItems:{
            exp: [],
            inc: []
        },

        totals:{
            exp: 0,
            inc:0
        }, 
        
        budget: 0,
        percentage: -1
    }


    return{
        addItem: function(type,desc,val){
            var newItem, ID;

            //Create new ID
            if(data.allItems[type].length > 0){
                ID= data.allItems[type][data.allItems[type].length-1].id + 1;
            }
            else {
                ID = 0;
            }
           

            //Create new item based on 'inc' and 'exp'
            if(type === 'exp')
            {
                newItem = new Expense(ID, desc,val);
            }

            if(type === 'inc')
            {
                newItem = new Income(ID, desc,val);
            }

            //Push it into data structure and return new element
            data.allItems[type].push(newItem)

            //return the new element
            return newItem;
        },

        deleteItem: function(type, id){
            var ids,index
            ids = data.allItems[type].map(function(current){
                return current.id
            })

            index = ids.indexOf(id)

            if(index !== -1)
            {   
                //deleting the respective element from array 
                data.allItems[type].splice(index,1);
            }
        },

        calculateBudget: function(){
            // 1. sum of all exp and inc
            calculateTotal('inc')
            calculateTotal('exp')
            // 2. Calculate the budget = inc - exp
            data.budget = data.totals.inc - data.totals.exp
            // 3. calculate the % of inc that we spent 
            if(data.totals.inc > 0)
            {
                data.percentage = Math.round((data.totals.exp / data.totals.inc)* 100)
            }
            else data.percentage = -1; 

        },

        calculatePercentages: function(){
            data.allItems.exp.forEach(function(cur)
            {
                cur.calcPercentage(data.totals.inc)
            })
        },

        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },

        getPercentages: function(){
            var allPerc = data.allItems.exp.map(function(cur)
            {
                return cur.getPercentage()
            })
            return allPerc;
        },

        testing: function(){
            console.log(data)
        }

       
    }


})();




//UI CONTROLLER
var UIController = (function(){

    var DOMString = {
        inputType : '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLable:'.budget__value',
        incomeLable: '.budget__income--value',
        expenseLable: '.budget__expenses--value',
        percentageLable: '.budget__expenses--percentage',
        container: '.container',
        expensesPercentageLable: '.item__percentage',
        monthLable: '.budget__title--month'

    }


var formatNumber = function(num, type)
{
    num = Math.abs(num);
    num = num.toFixed(2);

    var numsplit = num.split('.');
    var int = numsplit[0];

    if(int.length > 3)
    {
        int = int.substr(0,int.length - 3) + ',' + int.substr(int.length - 3,3);

    }

    var dec = numsplit[1];
    return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;



}

 // As node list dont have forEach method, creating own for ecah method using callback concepts

 var nodeListForEach = function(list, callback)
 {
     //iterate over each node from the list and call the callback function 
     for(var i=0;i<list.length;i++)
     {
         callback(list[i],i);
     }

 }

return {
    getInput: function(){
        return{
            type : document.querySelector(DOMString.inputType).value,
            description : document.querySelector(DOMString.inputDescription).value,
            value : parseFloat(document.querySelector(DOMString.inputValue).value)
        }
       
    },

    addListItem : function(obj,type)
    {   var html,newHtml,element
        // 1. Create html string with placeholders
        if(type === 'inc')
        {   
            element = DOMString.incomeContainer
            html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            
        }

        else if(type === 'exp')
        {
            element = DOMString.expenseContainer
            html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
           
        }

        // 2. Replace placeholder with actual data 

        newHtml = html.replace('%id%', obj.id)
        newHtml = newHtml.replace('%description%', obj.description)
        newHtml = newHtml.replace('%value%', formatNumber(obj.value, type))

        // 3. Push the HTML string into the dom 

        document.querySelector(element).insertAdjacentHTML('beforeend',newHtml)

    },

    deleteListItem: function(selectorId)
    {   
        var el = document.getElementById(selectorId);
        el.parentNode.removeChild(el);
    },

    clearFeilds: function(){

        var feilds,feildArray

        feilds= document.querySelectorAll(DOMString.inputDescription +',' +DOMString.inputValue)
        feildArray = Array.prototype.slice.call(feilds)

        feildArray.forEach(function(current, index, array){
            current.value= " "
        })

        feildArray[0].focus()

    
    },

    displayBudget: function(obj){

        if(obj.budget > 0)
        {
            var type = 'inc'
        }
        else type = 'exp';


        document.querySelector(DOMString.budgetLable).textContent = formatNumber(obj.budget,type);
        document.querySelector(DOMString.incomeLable).textContent = formatNumber(obj.totalInc,'inc');
        document.querySelector(DOMString.expenseLable).textContent = formatNumber(obj.totalExp,'exp');
        if(obj.percentage > 0){
            document.querySelector(DOMString.percentageLable).textContent = obj.percentage + '%';
        }else{
            document.querySelector(DOMString.percentageLable).textContent = '---';
        }
        

    },

    displayPercentages: function(percentages)
    {
        var feilds = document.querySelectorAll(DOMString.expensesPercentageLable) // This returns a node list 
        
       

        nodeListForEach(feilds, function(current, index){

            if(percentages[index] >0)
            {
                current.textContent = percentages[index] + '%';
            }
            else current.textContent = '---';
        })
    
    
    },

displayMonth: function(){
    var now, year, month, months
     now = new Date();
     year = now.getFullYear();
     month= now.getMonth();
     months = ['January', 'Feb', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

     document.querySelector(DOMString.monthLable).textContent = months[month] + ' ' + year;
 
},

changedType: function(){

    var feilds = document.querySelectorAll(DOMString.inputType+ ','+DOMString.inputDescription+ ','+ DOMString.inputValue);

    nodeListForEach(feilds,function(cur){
        cur.classList.toggle('red-focus');
    });

    document.querySelector(DOMString.inputButton).classList.toggle('red');
    
},

    getDOMString: function(){
        return DOMString
    }
}
})();


//GLOBAL APP CONTROLLER

var controller = (function(budgetCntrl, UICntrl){

    //DOMString method is made public in the UI controller and we are storing it in a variable to use it in the controller 
    var setUpEventListener = function(){
        var DOM = UICntrl.getDOMString()
        // Event listeners for add button 
        document.querySelector(DOM.inputButton).addEventListener('click',ctrlAddItem)
        document.addEventListener('keypress',function(event){
        if(event.key === 13 ){
            ctrlAddItem();
        }

    })

    document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem)
    document.querySelector(DOM.inputType).addEventListener('change',UICntrl.changedType)

    }

    var updateBudget = function(){
        // 1. Calculate the budget 
        budgetCntrl.calculateBudget()
        // 2. Return the budget 
        var budget = budgetCntrl.getBudget()
        // 3. Display the budget on UI  
        UICntrl.displayBudget(budget);
    }

    var updatePercentage = function(){
        // 1. Calculate percentage
        budgetCntrl.calculatePercentages();

        // 2. Read them from Budget Controller
        var percentages = budgetCntrl.getPercentages();

        // 3. Update UI controller 
        UICntrl.displayPercentages(percentages);
    }

   


    //This function is called when addbutton is clicked or user presses return
    var ctrlAddItem = function(){
        var input, newItem
        // 1. Get the input feild data 

        input = UICntrl.getInput()
        console.log(input)

        if(input.description !== " " && !isNaN(input.value) && input.value >0){
        // 2. Send the input to budget controller 

        newItem = budgetCntrl.addItem(input.type, input.description, input.value)

        // 3. Display the input on the UI
        UICntrl.addListItem(newItem,input.type)

        //4. Clear input feilds
        UICntrl.clearFeilds();


        // 5. Calculate and update budget 
        updateBudget()

        // 6. Update the percentages 
        updatePercentage()


        }

    }

    //event deligation for deleting an item form the list
    var ctrlDeleteItem = function(event){
        var itemId, splitId,type, ID
        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

        //because only items have ids we are checking for only items having ids
        if(itemId)
        {   
            splitId = itemId.split('-')
            type = splitId[0]
            ID = parseInt(splitId[1])

            // 1. Delete the item from data structure 

            budgetCntrl.deleteItem(type,ID);
            // 2. Delete the item from UI 

            UICntrl.deleteListItem(itemId)
            // 3. Update and show the new Budget 
            updateBudget()

            // 4. Update the percentages 
            updatePercentage()

        }

    }

    return {
        init: function(){
            console.log('Application initiated!')
            UICntrl.displayMonth()
            UICntrl.displayBudget(
                {
                    budget: 0,
                    totalInc: 0,
                    totalExp: 0,
                    percentage: -1
                }
            );
            setUpEventListener();
        }
    }

    

})(budgetController,UIController);

controller.init();