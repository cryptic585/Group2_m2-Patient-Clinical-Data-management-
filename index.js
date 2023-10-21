let SERVER_NAME = 'patients-api'
let PORT = process.env.PORT || 9000;
//let HOST = '99.248.27.62';
let HOST = '127.0.0.1';

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

  server.listen(PORT, HOST, function () {
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
  PatientsModel.findOne({ _id: req.params.id }, '-tests')
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


/*

{"first_name": "John2", "last_name":"Musk2", "address":"Yonge Street2", "date_of_birth": "13/10/1985", "department": "Emergency2" , "doctor": "Peter Doe2"}


{"date": "17/10/2020", "nurse_name":"Amanda Fox", "type":"Test", "category": "Blood Pressure", "readings": {"diastolic": "75", "systolic": "119" } }

*/
