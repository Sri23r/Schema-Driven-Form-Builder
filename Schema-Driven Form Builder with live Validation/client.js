const url = "http://localhost:3000/Datalist";
var detailObj;
var submitValid = true;
function fetchData(){
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);

    xhr.onload = function(){
        if(xhr.status == 200){
            detailObj = JSON.parse(xhr.responseText);
            displayData(detailObj);
        }else{
            document.getElementById("output").innerHTML = "Error fetching data";
        }
    };

    xhr.onerror = () => {
        document.getElementById("output").innerHTML = "Request failed";
    }

    xhr.send();
}

function displayData(data){
        let html = `<div class = "container">
                    <form id = "dynamicForm" class = "form-container">
                    <div class = "field-container-data">`;
        data.forEach((row) => {
            // debugger
            if (row.type === "radio") {
                // debugger   
                html += `<div class = "field-container">
                         <div class = "form-label">
                         <label>${row.label}</label>
                         </div>
                         <div class = "form-inp">`

                var loopValue = row.options.split(",")
                loopValue.forEach((val) => {
                   html += `<${row.field} type = "${row.type}" name = "${row.label}" value = "${val}" id = "gender${val}" class = "inp" onchange = "liveValidate(this)">
                     <label for = "gender${val}">${val}</label>`
                })
                html += `</div><span id = "err-${row.label.toLowerCase()}" class = "error-field"></span></div><br>`;
            }
            else if(row.field === "select"){
                var loopValue = row.options.split(",")
                htmlSelect = `<div class = "field-container">
                              <div class = "form-label">
                              <label for = "job">${row.label}</label>
                              </div>
                              <div class = "form-inp">`

                htmlSelect += `<${row.field} id = "qwe" name="${row.label}" class = "inp" onchange = "liveValidate(this)">`;
                htmlSelect += `<option value = "">--Select--</option>`;

                loopValue.forEach((val) => {
                    htmlSelect += `<option value = "${val.toLowerCase()}">${val}</option>`;
                });

                htmlSelect += `</${row.field}>
                </div><span id = "err-${row.Sno}" class = "error-field"></span></div><br>`;
                html += htmlSelect;
            }
            else{
                html += `<div class = "field-container">
                         <div class = "form-label">
                         <label for = "${row.Sno}">${row.label}</label>
                         </div>
                         <div class = "form-inp">
                        <${row.field} 
                        id = "${row.label}"
                        name = "${row.label.toLowerCase()}" 
                        type = "${row.type}"
                        minlength = ${row.minLength}
                        maxlength = ${row.maxLength}
                        min = ${row.minVal}
                        max = ${row.maxVal}
                        class = "inp"
                        oninput = "liveValidate(this)"
                        />
                        </div>
                        <span id = "err-${row.label.toLowerCase()}" class = "error-field"></span>
                        </div><br>`
            }
        });

        html+=`<button id = "submitBttn" class = "form-submit-bttn" type = "submit">Submit</button>
               </div>
               </form>
               </div>`;
        document.getElementById("output").innerHTML = html;

        document.getElementById("fetchBttn").classList.add("displaynone");
        
        const form = document.getElementById("dynamicForm");
        form.addEventListener("submit", function (e) {
            console.log("Submit button clicked");

            const valid = validateForm();

            if(valid){
                var choose = confirm("Successful \n Do you want to Save this data?");
                if(choose){
                    sendData();
                }
            }else{
                alert("Enter required fields.")
            }
        });
}

function liveValidate(input){
    
    var errId = document.getElementById(`err-${input.name.toLowerCase()}`);
    switch (input.type) {
        case "text":
            if ((/^[a-zA-Z ]+$/.test(input.value)) && (input.value.length >= input.minLength) && 
            (input.value.length <= input.maxLength)){
                storeToObj(input,"text");
                errId.textContent = "";
            }else{
                storeToObj(input,"text","empty")
                errId.textContent = `please enter a valid ${input.name}`;
            }
            break;

        case "email":
            if (/\S+@\S+\.\S+/.test(input.value.toLowerCase())) {
                storeToObj(input,"email");
                errId.textContent = "";
            }else{
                storeToObj(input,"email","empty")
                errId.textContent = `please enter a valid ${input.name}`;
            }
            break;

        case "number":
            if((parseInt(input.value) >= parseInt(input.min)) && (parseInt(input.value) <= parseInt(input.max))){
                storeToObj(input,"number");
                errId.textContent = "";
            }else{
                storeToObj(input,"number","empty")
                errId.textContent = `please enter ${input.name} between ${input.min} and ${input.max}`;
            }
            break;

        case "tel":
            if(input.value.length == parseInt(input.maxLength)){
                storeToObj(input,"tel");
                errId.textContent = "";
            }else{
                storeToObj(input,"tel","empty")
                errId.textContent = `please enter valid ${input.minLength} digit number`;
            }
            break;

        case "radio":
            storeToObj(input,"radio")
            errId.textContent = "";
            break;

        case "date":
            storeToObj(input,"date")
            errId.textContent = "";
            break;

        case "select-one":
            storeToObj(input,"select-one")
            errId.textContent = "";
            break;

        default:
            break;
    }
}

function storeToObj(inpField,type,empty){

    var rowVal = detailObj.find((row) => 
       (row.type == type) && (row.label.toLowerCase() == inpField.name.toLowerCase())
    )

    if(!(empty == "empty")){
        rowVal.value = inpField.value;
    }else{
        rowVal.value = "";
    }
}

function submitValidation() {
    var result = detailObj.find(row => row.value == "")

    if(result){
        return false; 
    }else{
        return true;
    }
}

function validateForm() {
    var result = submitValidation();
    
    return result;
}

function sendData(){

    const submitData = {};

    detailObj.forEach(row => {
        if(row.label && row.value !==  undefined){
            const key = row.label;

            submitData[key] = row.value;
        }
    });

    const xhrSave = new XMLHttpRequest();
    xhrSave.open("POST", "http://localhost:3000/json_schema", true);
    xhrSave.setRequestHeader("Content-Type", "application/json");

    xhrSave.send(JSON.stringify(submitData));
}