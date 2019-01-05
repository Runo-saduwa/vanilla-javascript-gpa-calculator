   'use strict';

    //Creata an object to hold the grades
    const gradeList = [
        {
            value:'A',
            grade: 'A - Excellent'
        },
        {
            value: 'B',
            grade: 'B - Very good'
        },
        {
            value: 'C',
            grade: 'C - Average'
        },
        {
            value: 'D',
            grade: 'D - Poor'
        },
        {
            value: 'F',
            grade: 'F - Fail'
        }
    ];

    /***=== lOOP OVER ALL OF THEM AND ADD THEM DYNAMICALLY TO OPTIONS ELEMENT===***/
    gradeList.forEach(function(gradeItem){
        let option = document.createElement('option');
        option.textContent = gradeItem.grade;
        option.value = gradeItem.value;
        document.getElementById('grade').appendChild(option);
    });
     
    //get all the dom elements
      
    let form = document.getElementById('form');
    let course = document.getElementById('course');
    let unit = document.getElementById('unit');
    let grade = document.getElementById('grade');
    let resultContainer = document.querySelector('.result-container');
    let resultItems = document.querySelector('.result-items');
    let deleteBtn = document.getElementById('deleteBtn');
    let gpBtn = document.getElementById('gpBtn');
    let formBlock = document.querySelector('.register-block');
    let resultBlock = document.querySelector('.result-block');
    let gpa = document.querySelector('.gpa');
    let report = document.querySelector('.report');
    let calcAgnBtn = document.getElementById('calcAgn');

    /*****Select user feeback*****/
    let feedbackError = document.querySelector('.feedback-error');
    let feedbackCalculating = document.querySelector('.feedback-calculating');
    let loader = document.querySelector('.loader');

    let totalGradeValue = [];
    let totalUnit = [];
    
    
    document.addEventListener('DOMContentLoaded', function(){
        loadResults();
    });

    form.addEventListener('submit', function(event){
        
        /*GET THE INPUT VALUES*/
        let courseVal = course.value;
        let unitVal = unit.value;
        let gradeVal = grade.value;

        /****CHECK IF THE INPUT FIELDS ARE EMPTY****/
        if(courseVal === '' || (unitVal === '' || unitVal <= '0') || gradeVal === ''){

            feedback('Please ensure that all fields are properly filled and make sure you are not inserting a negative value', 'alert-danger');

        }else{
            /**ADD RESULT TO LIST**/
            handleResult(courseVal, unitVal, gradeVal);

            /****ADD TO LOCAL STORAGE**/ 
        }



        event.preventDefault();


    });

    //Calculate GP
   
    gpBtn.addEventListener('click', function(){
        if(localStorage.getItem('totalUnit') && localStorage.getItem('totalGradeValue')){
             
           // console.log('yap!!!!');
           let totalGradeValue = JSON.parse(localStorage.getItem('totalGradeValue'));
           let totalUnit = JSON.parse(localStorage.getItem('totalUnit'));
           gpBtn.style.display = 'none'; 
           formBlock.classList.add('hide');
           resultBlock.classList.remove('hide');
           feedbackCalculating.classList.remove('hide');
           feedbackCalculating.classList.add('alert-success');
           feedbackCalculating.textContent = `Calculating...`;
           loader.classList.remove('hide');

           setTimeout(function(){
            feedbackCalculating.classList.add('hide');
            feedbackCalculating.classList.remove('alert-success');
            feedbackCalculating.textContent = ``;
            loader.classList.add('hide');
            calculate(totalGradeValue, totalUnit);
          }, 2500);





        }else{
            gpBtn.style.display = 'none'; 
          formBlock.classList.add('hide');
          resultBlock.classList.remove('hide');
          feedbackCalculating.classList.remove('hide');
          feedbackCalculating.classList.add('alert-success');
          feedbackCalculating.textContent = `Calculating...`;
          loader.classList.remove('hide');

          setTimeout(function(){
            feedbackCalculating.classList.add('hide');
            feedbackCalculating.classList.remove('alert-success');
            feedbackCalculating.textContent = ``;
            loader.classList.add('hide');
            calculate(totalGradeValue, totalUnit);
          }, 2500);
       }
        
    })

    calcAgnBtn.addEventListener('click', function(){
        gpBtn.style.display = 'inline-block';
        formBlock.classList.remove('hide');
        resultBlock.classList.add('hide');

        feedbackCalculating.classList.add('hide');
        feedbackCalculating.classList.remove('alert-success');
        feedbackCalculating.textContent = ``;
        loader.classList.add('hide');
        report.classList.add('hide');
        deleteAll()
    })


    function calculate(totalGradeValue, totalUnit){
        let summedGradeVal = totalGradeValue.map(course => {
            return course.gradeValue;
        }).reduce((total, current) => {
            return total + current;
        }, 0);
        
        let summedUnitVal = totalUnit.map(course => {
            return course.unit;
        }).reduce((total, current) => {
            return total + current;
        },0);

        let gp = (summedGradeVal/summedUnitVal).toFixed(2);
        display(gp);
    }

    function display(gp){
        report.classList.remove('hide');
        //check gp
        gpa.textContent = `${gp}`;

    }

  //Delete single results
    resultItems.addEventListener('click', function(event){
          if(event.target.parentElement.classList.contains('remove-icon')){
             let parent = event.target.parentElement.parentElement;
            resultItems.removeChild(parent);
            let course = event.target.parentElement.parentElement.firstElementChild.textContent;
            clearSingleCourse(course);
          }
      //hide the the result the container if the container has no child
          if(resultItems.children.length === 0) {
            resultContainer.classList.add('hide'); 
            //delete local storage
            clearStorage(); 
         }
    });
    //delete all 
    deleteBtn.addEventListener('click', deleteAll)

    function deleteAll(){
        while(resultItems.children.length > 0){
            resultItems.removeChild(resultItems.children[0]);
        }
        
        resultContainer.classList.add('hide');
        clearStorage();

        // if(gpBtn.style.display === 'none'){
        //     gpBtn.style.display = 'inline-block';
        // }

   }


    //feedback function
    function feedback(message, klass){
           feedbackError.classList.remove('hide');
           feedbackError.classList.add(klass);
           feedbackError.textContent = message;

           setTimeout(function(){
            feedbackError.classList.add('hide');
            feedbackError.classList.remove(klass);
           }, 3000);
    }

    // Add result function
    function handleResult(courseVal, unitVal, gradeVal){
        let  gradePower;
        if(gradeVal === 'A'){
            gradePower = 5;
            let gradeWeight= parseInt(unitVal) * gradePower;
          courseAndUnit(courseVal, unitVal);
          courseAndGradeWeight(courseVal, gradeWeight);
          checkAndadd(courseVal, unitVal, gradeVal);
            
        }else if(gradeVal === 'B'){
            gradePower = 4;
            let gradeWeight= parseInt(unitVal) * gradePower;
            courseAndUnit(courseVal, unitVal);
            courseAndGradeWeight(courseVal, gradeWeight);
            checkAndadd(courseVal, unitVal, gradeVal);
        }else if(gradeVal === 'C'){
            gradePower = 3;
            let gradeWeight= parseInt(unitVal) * gradePower;
            courseAndUnit(courseVal, unitVal);
            courseAndGradeWeight(courseVal, gradeWeight);
            checkAndadd(courseVal, unitVal, gradeVal);
        }else if(gradeVal === 'D'){
            gradePower = 2;
            let gradeWeight= parseInt(unitVal) * gradePower;
            courseAndUnit(courseVal, unitVal);
            courseAndGradeWeight(courseVal, gradeWeight);
            checkAndadd(courseVal, unitVal, gradeVal);
        }else{
            gradePower = 0;
            let gradeWeight= parseInt(unitVal) * gradePower;
            courseAndUnit(courseVal, unitVal);
            courseAndGradeWeight(courseVal, gradeWeight);
            checkAndadd(courseVal, unitVal, gradeVal);
        }
    }

    //check and add Result function
    function checkAndadd(courseVal, unitVal, gradeVal){
        if(resultContainer.classList.contains('hide')){
            resultContainer.classList.remove('hide');
            addResult(courseVal, unitVal, gradeVal);
            addStorage(courseVal, unitVal, gradeVal);
            feedback('Course Added', 'alert-success');
        }else{
            addResult(courseVal, unitVal, gradeVal);
            addStorage(courseVal, unitVal, gradeVal);
            feedback('Course Added', 'alert-success');
        }
    }

    //add result
    function addResult(courseVal, unitVal, gradeVal){
        let div = document.createElement('div');
            div.classList.add('item', 'my-3', 'd-flex', 'justify-content-between', 'p-2');
        div.innerHTML = `<h5 class="item-title course text-capitalize">${courseVal}</h5>
        <h5 class="item-title text-capitalize">${unitVal}</h5>
        <h5 class="item-title text-capitalize">${gradeVal}</h5>
        <span class="remove-icon text-danger"><i class="fas fa-trash"></i></span>`;

       resultItems.appendChild(div);

      
    }

    function loadResults(){
        if(localStorage.getItem('results')){
            resultContainer.classList.remove('hide');
            const results = JSON.parse(localStorage.getItem('results'));

            results.forEach(function(result){
                let course = result.course;
                let unit = result.unit;
                let grade = result.grade;

                addResult(course, unit, grade);
            })

            //gpBtn.style.display = 'none';
        }
    }

    //add to storage function
    function addStorage(courseVal, unitVal, gradeVal){
        let result = {
            course: courseVal,
            unit: unitVal,
            grade: gradeVal
        }
        if(localStorage.getItem('results')){
           let results= JSON.parse(localStorage.getItem('results'))
           results.push(result);
           localStorage.setItem('results', JSON.stringify(results));
        }else{
            let results = [];
                results.push(result);
                localStorage.setItem('results', JSON.stringify(results));  
        }
}

//remove all from storage

   function clearStorage(){
    localStorage.removeItem('results');
    localStorage.removeItem('totalGradeValue');
    localStorage.removeItem('totalUnit');   
    totalUnit = [];
    totalGradeValue = [];
}
//remove a single course from local storage
function clearSingleCourse(course){
    let results = JSON.parse(localStorage.getItem('results'));
    let result = results.filter(function(result){
         if(result.course !== course){
            return result;
        }
    })
    localStorage.removeItem('results');
    localStorage.setItem('results', JSON.stringify(result));
    cleanUp(course);
    

}

///TotalGradeValue & totalUnit clean up function
function cleanUp(course){
   let cleanTotalGradeValue = totalGradeValue.filter(result => {
        if(result.course !== course){
            return result;
        }
   });
   let cleanTotalUnit = totalUnit.filter(result => {
    if(result.course !== course){
        return result;
    }
});
   totalGradeValue = cleanTotalGradeValue;
   totalUnit = cleanTotalUnit;
   cleanUpLocalStore(totalGradeValue, totalUnit);
}

//
function cleanUpLocalStore(totalGradeValue, totalUnit){
    localStorage.removeItem('totalGradeValue');
    localStorage.setItem('totalGradeValue', JSON.stringify(totalGradeValue));
    localStorage.removeItem('totalUnit');
    localStorage.setItem('totalUnit', JSON.stringify(totalUnit));
}




    // function for courseAndunit
    function courseAndUnit(courseVal, unitVal){
        let courseAndUnit = {
            course: courseVal,
            unit: parseInt(unitVal)
        }

        //store it in local storage
        courseAndUnitLs(courseAndUnit);

        totalUnit.push(courseAndUnit);
    }

    //function for courseAndGradeWeight
    function courseAndGradeWeight(courseVal, gradeWeight){
        let courseAndGradeWeight = {
            course: courseVal,
            gradeValue: gradeWeight
        }
        //local storage
        courseAndGradeWeightLs(courseAndGradeWeight);
        totalGradeValue.push(courseAndGradeWeight);
    }
    

    //courseandUnit storage function
    function courseAndUnitLs(item){
        if(localStorage.getItem('totalUnit')){
            let totalUnit = JSON.parse(localStorage.getItem('totalUnit'))
            totalUnit.push(item);
            localStorage.setItem('totalUnit', JSON.stringify(totalUnit));
        }else {
            let totalUnit = [];
            totalUnit.push(item)
            localStorage.setItem('totalUnit', JSON.stringify(totalUnit));
            
        }
    }

    //courseandGradeWeight storage function
    function courseAndGradeWeightLs(item){
        if(localStorage.getItem('totalGradeValue')){
            let totalGradeValue = JSON.parse(localStorage.getItem('totalGradeValue'))
            totalGradeValue.push(item);
            localStorage.setItem('totalGradeValue', JSON.stringify(totalGradeValue));
        }else {
            let totalGradeValue = []
            totalGradeValue.push(item);
            localStorage.setItem('totalGradeValue', JSON.stringify(totalGradeValue));
            
        }
    }








