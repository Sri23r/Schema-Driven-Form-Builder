This is a web application that dynamically generates HTML forms from data stored in a MySQL database, allows users to fill in the form, validates the inputs in real time,
and stores the submission as JSON in the database.

Installed dependencies
  -> express
  -> cors
  -> mysql2

It is a client-server Form Builder Live Validation.

1) Start the server with node server.js
2) Open the index.html in the browser
3) Click the "Click here to get dynamic form data from server" button.
4) Enter the Employee details.
5) Click the Submit button and a message will appear to ask the user to save this form in the database.
6) By clicking ok, the form will be saved in the database.

index.html
  Loads the page, includes a button to fetch the form, and loads the client.js script.
  Triggers the fetchData() function from client.js to dynamically render the form.

client.js

  -> fetchData()
      Sends a GET request to /Datalist to retrieve form schema.
      On success, passes the data to displayData() for rendering the form.
      Displays error messages if the request fails.
      
  ->  displayData(data)
      Dynamically creates form elements (input, radio, select...) based on the schema received from the server.
      Binds a submit event handler to the form to trigger validation and data submission.
      Calls validateForm() before allowing submission.
      
  -> liveValidate(input)
      Validates each input field in real-time based on its type (text, email, age, tel, date, designation).
      Displays inline validation messages if input is invalid.
      Calls storeToObj() to store valid data in detailObj.
      
  -> storeToObj(inpField, type, empty)
      Updates the form schema object detailObj with current user inputs.
      Used by both validation and final submission.

  -> submitValidation()
      Checks if any value in detailObj is empty.
      Returns false if the form is incomplete.

  -> validateForm()
      Calls the submitValidation(), returns true if all fields are filled correctly.

  -> sendData()
      Sends the final JSON-formatted form data to the server using a POST request to /json_schema.

server.js

  ==> It handles the backend using Express and MySQL.

  -> Database configuration
    Connects to the json MySQL database.

  -> GET /Datalist
    Fetches the dynamic form schema from the DataList table in MySQL.
    Sends it as a JSON response to the frontend.

  -> POST /json_schema
    Accepts submitted form data as JSON.
    Stores the full JSON object into the json_schema table.

  -> GET / and POST /
    Test routes to check server availability.

The Live Validation done in client side, and then sends the form data to the server for submission validation and then store it in the database.
