/*let SERVER_NAME = 'patients-api'
let PORT = process.env.PORT || 9000;
//let HOST = '99.248.27.62';
//let HOST = '127.0.0.1';

const mongoose = require ("mongoose");
const username = "vbhatt75";
const password = "Usu2U0motH0nexPP";
const dbname = "mapd713Group2db";

// Atlas MongoDb connection string format
//mongodb+srv://<username>:<password>@cluster0.k7qyrcg.mongodb.net/<dbname(optional)>?retryWrites=true&w=majority


let uristring = 'mongodb+srv://'+username+':'+password+'@cluster0.u3d8p64.mongodb.net/'+
 dbname+'?retryWrites=true&w=majority';

// Makes db connection asynchronously
mongoose.connect(uristring, {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=>{
  // we're connected!
  console.log("!!!! Connected to db: " + uristring)
});


const readingSchema = new mongoose.Schema({
  diastolic: Number,
  systolic: Number 

  
});

const testSchema = new mongoose.Schema({
  patient_id: String,
  date: String, 
	nurse_name: String,
  type: String,
  category: String,
  readings: readingSchema
  
});



const patientSchema = new mongoose.Schema({
  first_name: String, 
  last_name: String,
  address: String,
  date_of_birth: String,
  department: String,
  doctor: String,
  tests: [testSchema]
});



// Compiles the schema into a model, opening (or creating, if
// nonexistent) the 'User' collection in the MongoDB database
let PatientsModel = mongoose.model('patients', patientSchema);

let errors = require('restify-errors');
let restify = require('restify')

  // Create the restify server
  , server = restify.createServer({ name: SERVER_NAME})

 

  server.listen(PORT, function () {
  console.log('Server %s listening at %s', server.name, server.url)
  console.log('**** Resources: ****')
  console.log('********************')
  console.log(' POST - /patients')
  console.log(' GET - /patients')
  console.log(' GET - /patients/:id')  
  console.log(' DELETE - /patients/:id')  
  console.log(' POST - /patients/:id/tests')  
  console.log(' GET - /patients/:id/tests')  
  console.log(' PATCH - /patients/:id')  
})

server.use(restify.plugins.fullResponse());
server.use(restify.plugins.bodyParser());

// Get all patients in the system
server.get('/patients', function (req, res, next) {
  console.log('GET /patients params=>' + JSON.stringify(req.params));

  // Find every entity in db
  //PatientsModel.find({}, '-tests')
PatientsModel.find({}, '-tests')
    .then((patients)=>{
        // Return all of the patients in the system
    
        res.send(patients);
        return next();
    })
    .catch((error)=>{
        return next(new Error(JSON.stringify(error.errors)));
    });
})



// Get a single patient by their patient id
server.get('/patients/:id', function (req, res, next) {
  console.log('GET /patients/:id params=>' + JSON.stringify(req.params));

  // Find a single patient by their id in db
  //PatientsModel.findOne({ _id: req.params.id }, '-tests')
PatientsModel.findOne({ _id: req.params.id })
    .then((patients)=>{
      console.log("found patient: " + patients);
      if (patients) {
     
        
        res.send(patients)
      } else {
        // Send 404 header if the user doesn't exist
        res.send(404)
      }
      return next();
    })
    .catch((error)=>{
        console.log("error: " + error);
        return next(new Error(JSON.stringify(error.errors)));
    });
})

// Create a new patient
server.post('/patients', function (req, res, next) {
  console.log('POST /patients params=>' + JSON.stringify(req.params));
  console.log('POST /patients body=>' + JSON.stringify(req.body));

  // validation of manadatory fields
  if (req.body.first_name === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('First Name must be supplied'))
  }
  if (req.body.last_name === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('Last Name must be supplied'))
  }
  if (req.body.address === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('Address be supplied'))
  }
  if (req.body.date_of_birth === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('Date of Birth must be supplied'))
  }
  if (req.body.department === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('Department must be supplied'))
  }
  if (req.body.doctor === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('Doctor must be supplied'))
  }

  let newPatient = new PatientsModel({
		first_name: req.body.first_name, 
		last_name: req.body.last_name,
    address: req.body.address,
    date_of_birth: req.body.date_of_birth,
    department: req.body.department,
    doctor: req.body.doctor
	});

  // Create the patient and save to db
  newPatient.save()
    .then((patients)=> {
      console.log("saved patients: " + patients);
      // Send the patient if no issues
      //res.send(201, patients);
      res.send(201, "Updated Successfully");
      return next();
    })
    .catch((error)=>{
      console.log("error: " + error);
      return next(new Error(JSON.stringify(error.errors)));
  });
})


// Delete patient with the given id
server.del('/patients/:id', function (req, res, next) {
  console.log('POST /patients params=>' + JSON.stringify(req.params));
  // Delete the user in db
  PatientsModel.findOneAndDelete({ _id: req.params.id })
    .then((deletedPatient)=>{      
      console.log("deleted user: " + deletedPatient);
      if(deletedPatient){
        res.send(200, deletedPatient);
      } else {
        res.send(404, "User not found");
      }      
      return next();
    })
    .catch(()=>{
      console.log("error: " + error);
      return next(new Error(JSON.stringify(error.errors)));
    });
})

//upate a patient info

server.patch('/patients/:id', function (req, res, next) {
  console.log('PATCH /patients/:id params=>' + JSON.stringify(req.params));

  // Update a single patient by their ID
  const updateFields = {}; // Define the fields to update
  if (req.body.first_name) {
    updateFields.first_name = req.body.first_name;
  }
  if (req.body.last_name) {
    updateFields.last_name = req.body.last_name;
  }
  if (req.body.address) {
    updateFields.address = req.body.address;
  }
  if (req.body.date_of_birth) {
    updateFields.date_of_birth = req.body.date_of_birth;
  }
  if (req.body.department) {
    updateFields.department = req.body.department;
  }
  if (req.body.doctor) {
    updateFields.doctor = req.body.doctor;
  }

  PatientsModel.findOneAndUpdate(
    { _id: req.params.id },
    { $set: updateFields },
    { new: true } // This option returns the updated document
  )
    .then((updatedPatient) => {
      if (updatedPatient) {
        res.send(updatedPatient);
      } else {
        // Send 404 header if the patient doesn't exist
        res.status(404).send('Patient not found');
      }
      return next();
    })
    .catch((error) => {
      console.log("error: " + error);
      return next(new Error(JSON.stringify(error.errors)));
    });
});




// Create a new test record for a patient
server.post('/patients/:id/tests', function (req, res, next) {
  console.log('POST /patients/:id/tests params=>' + JSON.stringify(req.params));
  console.log('POST /patients/:id/tests body=>' + JSON.stringify(req.body));

  // validation of manadatory fields
  if (req.body.date === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('Date must be supplied'))
  }
  if (req.body.nurse_name === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('Nurse Name must be supplied'))
  }
  if (req.body.type === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('Type be supplied'))
  }
  if (req.body.category === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('Category must be supplied'))
  }
  if (req.body.readings === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError('Readings must be supplied'))
  }
  
console.log(req.body.readings)
let newTest = {
    patient_id: req.params.id,
		date: req.body.date, 
		nurse_name: req.body.nurse_name,
    type: req.body.type,
    category: req.body.category,
    readings: {
      diastolic: req.body.readings.diastolic,
      systolic: req.body.readings.systolic
    }
	};



  PatientsModel.findOne({ _id: req.params.id })
  .then(patientObj => {
    patientObj.tests.push(newTest);
    return patientObj.save();
  })
  .then(patientObj => {
    console.log('patientObj updated');
    res.json(patientObj);
  })
  .catch(err => {
    if (err) throw err;
  });


})

// Get all test in the system
server.get('/patients/:id/tests', function (req, res, next) {
  console.log('GET //patients/:id/tests params=>' + JSON.stringify(req.params));

  // Find every entity in db
  PatientsModel.findById({_id: req.params.id})
    .then((patients)=>{
        // Return all of the tests in the system
        
        res.send(patients.tests);
        return next();
    })
    .catch((error)=>{
        return next(new Error(JSON.stringify(error.errors)));
    });
})



// Update a specific test record for a patient
server.patch('/patients/:patientId/tests/:testId', function (req, res, next) {
  console.log('PATCH /patients/:patientId/tests/:testId params=>' + JSON.stringify(req.params));
  console.log('PATCH /patients/:patientId/tests/:testId body=>' + JSON.stringify(req.body));

  // Define the fields to update
  const updateFields = {};

  // Validate and update fields if provided
  if (req.body.date) {
    updateFields['tests.$[elem].date'] = req.body.date;
  }
  if (req.body.nurse_name) {
    updateFields['tests.$[elem].nurse_name'] = req.body.nurse_name;
  }
  if (req.body.type) {
    updateFields['tests.$[elem].type'] = req.body.type;
  }
  if (req.body.category) {
    updateFields['tests.$[elem].category'] = req.body.category;
  }
  if (req.body.readings) {
    if (req.body.readings.diastolic) {
      updateFields['tests.$[elem].readings.diastolic'] = req.body.readings.diastolic;
    }
    if (req.body.readings.systolic) {
      updateFields['tests.$[elem].readings.systolic'] = req.body.readings.systolic;
    }
  }

  const filter = { 'elem._id': req.params.testId };

  PatientsModel.findOneAndUpdate(
    { _id: req.params.patientId, 'tests._id': req.params.testId },
    { $set: updateFields },
    {
      arrayFilters: [filter],
      new: true,
    }
  )
    .then((updatedPatient) => {
      if (updatedPatient) {
        res.json(updatedPatient);
      } else {
        res.status(404).send('Patient or test not found');
      }
      return next();
    })
    .catch((error) => {
      console.log('error: ' + error);
      return next(new Error(JSON.stringify(error.errors)));
    });
});

// Get a specific test record for a patient
server.get('/patients/:patientId/tests/:testId', function (req, res, next) {
  const patientId = req.params.patientId;
  const testId = req.params.testId;

  PatientsModel.findOne({ _id: patientId })
    .then((patient) => {
      if (!patient) {
        return res.status(404).send('Patient not found');
      }

      const test = patient.tests.find((test) => test._id.toString() === testId);

      if (test) {
        res.json(test);
      } else {
        res.status(404).send('Test not found');
      }
    })
    .catch((err) => {
      console.error('Error finding test:', err);
      res.status(500).send('Internal server error');
    });
});

// Delete a specific test for a patient
server.del('/patients/:patientId/tests/:testId', function (req, res, next) {
  console.log('DELETE /patients/:patientId/tests/:testId params=>' + JSON.stringify(req.params));

  // Create a query to identify the test to be removed
  const query = {
    _id: req.params.patientId,
    'tests._id': req.params.testId,
  };

  PatientsModel.findOne(query)
    .then((patient) => {
      if (!patient) {
        // If the patient or test does not exist, send a 404 response
        res.send(404, 'Patient or test not found');
        return next();
      }

      // Use $pull to remove the specific test from the "tests" array
      patient.tests.pull({ _id: req.params.testId });

      // Save the updated patient document
      return patient.save();
    })
    .then((updatedPatient) => {
      res.send(204); // Send a "No Content" response indicating successful deletion
      return next();
    })
    .catch((error) => {
      console.log('error: ' + error);
      return next(new Error(JSON.stringify(error.errors)));
    });
});
*/

/*

{"first_name": "John2", "last_name":"Musk2", "address":"Yonge Street2", "date_of_birth": "13/10/1985", "department": "Emergency2" , "doctor": "Peter Doe2"}


{"date": "17/10/2020", "nurse_name":"Amanda Fox", "type":"Test", "category": "Blood Pressure", "readings": {"diastolic": "75", "systolic": "119" } }

*/

const mongoose = require("mongoose");

const paitentSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  mobile_number: String,
  address: String,
  sex: String,
  date_of_birth: String,
   
    records: [{
      type: mongoose.Schema.Types.ObjectId, ref:"ClinicalTests"
    }]
  });


// Define the clinical test schema
const clinicalTestSchema = new mongoose.Schema({
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
    },
    date: { type: String },
    bloodPressure: {type: String},
    respiratoryRate: {type: String},
    bloodOxygenLevel: {type: String},
    heartBeatRate: {type: String},
    // reading: { type: String, required: true },
  });

  const accountModelSchema = new mongoose.Schema({
    user_name: {type: String},
    email: {type: String},
    password: {type: String},
  })
  
  // Create models based on schemas
  const patientsModel = mongoose.model("Patient", paitentSchema);
  const clinicalTestModel = mongoose.model("ClinicalTests", clinicalTestSchema);
  const accountModel = mongoose.model("Account", accountModelSchema)

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();


let SERVER_NAME = "user-api";
//let PORT = 4000;
//let HOST = "127.0.0.1";

app.use(bodyParser.json());


// Enable CORS for all routes
app.use(cors());

// Define your routes
app.get('/example', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

// Start the server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


const mongoose = require("mongoose");
const username = "jeetkaur941";
const password = "zgwueYu2YovUMcAy";
const dbname = "Harvar";
let uristring =
  "mongodb+srv://jeetkaur941:zgwueYu2YovUMcAy@harvar.v8ovqmx.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp";
// Atlas MongoDb connection string format
//mongodb+srv://<username>:<password>@cluster0.k7qyrcg.mongodb.net/<dbname(optional)>?retryWrites=true&w=majority
//let uristring = 'mongodb+srv://'+username+':'+password+'@harvar.v8ovqmx.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp';



//L
// Makes db connection asynchronously
mongoose.connect(uristring, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  // we're connected!
  console.log("!!!! Connected to db: " + uristring);
});

let errors = require("restify-errors");
let restify = require("restify"),
  // Create the restify server
  server = restify.createServer({ name: SERVER_NAME });

server.listen(PORT, function () {
  console.log("Server %s listening at %s", server.name, server.url);
  console.log("**** Resources: ****");
  console.log("********************");
  console.log(" /patients");
  console.log(" /patients/:id");
});

server.use(restify.plugins.fullResponse());
server.use(restify.plugins.bodyParser());

// Get all users in the system
server.get("/patients", function (req, res, next) {
 // console.log("GET /patients params=>" + JSON.stringify(req.params));

  // Find every entity in db
  patientsModel
    .find({})
    .then((patients) => {
      res.send(patients);
      return next();
    })
    .catch((error) => {
      return next(new Error(JSON.stringify(error.errors)));
    });
});

// Get a single user by their patient id
server.get("/patients/:id", function (req, res, next) {
  console.log("GET /patients/:id params=>" + JSON.stringify(req.params));
  try{

  // Find a single patient by their id in db
  patientsModel
    .findOne({ _id: req.params.id }).populate("records")
    .then((patient) => {
      console.log("found patient: " + patient);
      if (patient) {
        // Send the patient if no issues
        res.send(200, {
          patientData: patient,
        });
      } else {
        // Send 404 header if the patient doesn't exist
        res.send(404);
      }
      return next();
    })
    .catch((error) => {
      console.log("error: " + error);
      return next(new Error(JSON.stringify(error.errors)));
    });
  }catch(error){
    throw error
  }

});

// Create a new patient
server.post("/patients", function (req, res, next) {
  console.log("POST /patients params=>" + JSON.stringify(req.params));
  console.log("POST /patients body=>" + JSON.stringify(req.body));

  // validation of manadatory fields
  if (req.body.first_name === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("name must be supplied"));
  }
  if (req.body.last_name === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("lnameast must be supplied"));
  }
  
  const paitentSchema = new mongoose.Schema({});

  let newPatient = new patientsModel({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    mobile_number: req.body.mobile_number,
    address: req.body.address,
    sex: req.body.sex,
    date_of_birth: req.body.date_of_birth,
    
  });

  // Create the patient and save to db
  newPatient
    .save()
    .then((patient) => {
      // Send the patient if no issues
      res.send(201, patient);
      return next();
    })
    .catch((error) => {
      console.log("error: " + error);
      return next(new Error(JSON.stringify(error.errors)));
    });
});


// Delete patient with the given id
server.del("/patients/:id", function (req, res, next) {
  console.log("POST /patients params=>" + JSON.stringify(req.params));
  // Delete the user in db
  patientsModel
    .findOneAndDelete({ _id: req.params.id })
    .then((deletedPatient) => {
      if (deletedPatient) {
        clinicalTestModel.deleteMany({
          patient: req.params.id
        }).then(() => {
          res.send(200, "deleted")
          return next();
        })
      } else {
        res.send(404, "patient not found");
      }
    })
    .catch((error) => {
      console.log("error: " + error);
      return next(new Error(JSON.stringify(error.errors)));
    });
});

// // Example of using promise
// UsersModel.findOne({ _id: req.params.id })
// .then((user)=>{ }) // success
// .catch((error)=>{ }); // error

// Update a patient by their ID using PUT method
server.put("/patients/:id", function (req, res, next) {
  const patientId = req.params.id;
  const updateData = req.body; // Data to update the patient

  // Ensure that at least one field to update is provided in the request body
  if (Object.keys(updateData).length === 0) {
    return next(
      new errors.BadRequestError("No data provided for updating the patient.")
    );
  }

  // Find the patient by their ID and update the data
  patientsModel
    .findOne({ _id: patientId })
    .then((patient) => {
      if (!patient) {
        res.send(404, "Patient not found");
        return next();
      }

      // Update the patient's data
      Object.assign(patient, updateData);

      // Save the updated patient to the database
      return patient.save();
    })
    .then((updatedPatient) => {
      res.send(200, updatedPatient);
      return next();
    })
    .catch((error) => {
      console.log("Error: " + error);
      return next(new Error(JSON.stringify(error.errors)));
    });
});

// Register a new account 
server.post("/sign-up", function (req, res, next) {

  // validation of manadatory fields
  if (req.body.user_name === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("User name required"));
  }
  if (req.body.email === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("Email required"));
  }
  if (req.body.password === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("Password must be supplied"));
  }
  // const paitentSchema = new mongoose.Schema({});

  let newAccount = new accountModel({
    user_name: req.body.user_name,
    email: req.body.email,
    password: req.body.password
  });

  // Create the account and save to db
  newAccount
    .save()
    .then((account) => {
      // Send the patient if no issues
      res.send(201, account);
      return next();
    })
    .catch((error) => {
      console.log("error: " + error);
      return next(new Error(JSON.stringify(error.errors)));
    });
});

//For Login
// Middleware to check for a valid JWT token
// function authenticateToken(req, res, next) {
//   const token = req.header('Authorization');
//   if (token == null) return res.sendStatus(401);

//   jwt.verify(token, secretKey, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// }

// Login route
server.post("/login",  async (req, res) => {
  const { user_name, password } = req.body;
 //console.log('first',user_name)
  try {
    const user =  await accountModel.findOne({ user_name });
   

    if (!user ) {
      return res.status(404).json({ error: 'User not found' });
    }

     res.json({ message: 'Login successful' });
   } catch (error) {
    // console.log('error')
     res.status(500).json({ error: 'Internal Server Error' });
   }
});

// Protected route
// app.get('/protected', authenticateToken, (req, res) => {
//   res.json({ message: 'This is a protected route.' });
// });



// Create a new clinical test
server.post("/clinicalTests", function (req, res, next) {
  // Validation logic here
 
  if (!req.body.patient) {
    return next(new errors.BadRequestError("Patient ID must be supplied"));
  }
  try{
    
  const newClinicalTest = new clinicalTestModel({
    patient: req.body.patient,
    bloodPressure: req.body.bloodPressure,
    respiratoryRate: req.body.respiratoryRate,
    bloodOxygenLevel: req.body.bloodOxygenLevel,
    heartBeatRate: req.body.heartBeatRate,
  });


  newClinicalTest
    .save()
    .then((clinicalTest) => {
      console.log(clinicalTest)
      const findPatient = patientsModel.findByIdAndUpdate({
        _id: req.body.patient,
      }, {
        $push: {records: clinicalTest}
      }, 
      {new:true}).then((found) => {
        res.send(201, {
          message:"found",
          data: found
        });
        return next();
      })
    })
    .catch((error) => {
      return next(new Error(JSON.stringify(error.errors)));
    });
  }catch(error){
    throw error;
  }
});
server.get("/clinical-tests/:testId", function (req, res, next) {
  clinicalTestModel
    .findOne({ _id: req.params.testId })
    .then((clinicalTest) => {
      if (clinicalTest) {
        res.send(clinicalTest);
      } else {
        res.send(404);
      }
      return next();
    })
    .catch((error) => {
      return next(new Error(JSON.stringify(error.errors)));
    });
});

// Get all tests of a specific patient
server.get("/clinical-tests/patient/:patientId", function (req, res, next) {
  clinicalTestModel
    .find({ patient: req.params.patientId })
    .then((clinicalTests) => {
      res.send(clinicalTests);
      return next();
    })
    .catch((error) => {
      return next(new Error(JSON.stringify(error.errors)));
    });
});

// Update a specific test by its ID using PUT method
server.put("/clinical-tests/:testId", function (req, res, next) {
  const testId = req.params.testId;
  const updateData = req.body;

  if (Object.keys(updateData).length === 0) {
    return next(
      new errors.BadRequestError("No data provided for updating the test.")
    );
  }

  clinicalTestModel
    .findOne({ _id: testId })
    .then((test) => {
      if (!test) {
        res.send(404, "Test not found");
        return next();
      }

      Object.assign(test, updateData);

      return test.save();
    })
    .then((updatedTest) => {
      res.send(200, updatedTest);
      return next();
    })
    .catch((error) => {
      return next(new Error(JSON.stringify(error.errors)));
    });
});

// Delete a specific test by its ID
server.del("/clinical-tests/:testId", function (req, res, next) {
  clinicalTestModel
    .findOneAndDelete({ _id: req.params.testId })
    .then((deletedTest) => {
      if (deletedTest) {
        res.send(200, deletedTest);
      } else {
        res.send(404, "Test not found");
      }
      return next();
    })
    .catch((error) => {
      return next(new Error(JSON.stringify(error.errors)));
    });
});

// Delete all tests of a specific patient
server.del("/clinical-tests/patient/:patientId", function (req, res, next) {
  clinicalTestModel
    .deleteMany({ patient: req.params.patientId })
    .then((result) => {
      res.send(200, result);
      return next();
    })
    .catch((error) => {
      return next(new Error(JSON.stringify(error.errors)));
    });
});

// Get patients with tests having status "critical"
server.get("/criticalTests", function (req, res, next) {
  console.log("GET /criticalTests");

  // Find tests with status "critical" and populate patient details
  clinicalTestModel
    .find({ status: "critical" })
    .populate("patient") // Populate the patient field
    .then((tests) => {
      // Create an array to store combined patient and test information
      const results = tests.map((test) => {
        return {
          patient: {
            id: test.patient._id,
            first_name: test.patient.first_name,
            // Add other patient details as needed
          },
          test: {
            id: test._id,
            date: test.date,
            type: test.type,
            reading: test.reading,
            status: test.status,
          },
        };
      });

      // Return the list of patients with critical tests and their details
      res.send(results);
      return next();
    })
    .catch((error) => {
      return next(new Error(JSON.stringify(error.errors)));
    });
});

