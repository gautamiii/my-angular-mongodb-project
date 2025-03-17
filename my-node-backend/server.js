require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
app.use(express.json({ limit: '10mb' })); // Parse JSON
app.use(cors()); // Enable CORS

// ✅ MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// ✅ User Schema (For Authentication)
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});
const User = mongoose.model('User', UserSchema);

// ✅ Form Schema (For Data Submission)
const FormSchema = new mongoose.Schema({
    email: String,
    address: String,
    imageUrl: String
});
const FormDataModel = mongoose.model('FormData', FormSchema);

// ✅ Register API
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        res.json({ message: '✅ User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: '❌ Error registering user' });
    }
});

// ✅ Login API
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: '❌ Invalid credentials' });
        }
        const token = jwt.sign({ email: user.email }, 'secret', { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: '❌ Server error during login' });
    }
});

// ✅ Form Submission API
app.post('/api/submit-form', async (req, res) => {
    try {
        const { email, address, imageUrl } = req.body;
        const newFormEntry = new FormDataModel({ email, address, imageUrl });
        await newFormEntry.save();
        res.status(201).json({ message: '✅ Data saved to MongoDB', data: newFormEntry });
    } catch (error) {
        console.error('❌ Error saving form data:', error);
        res.status(500).json({ error: '❌ Failed to save data' });
    }
});

// ✅ Fetch All Form Data API
// ✅ Fetch Form Data with Pagination
app.get('/api/form-data', async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1; // Default to page 1
      const limit = parseInt(req.query.limit) || 5; // Default to 5 items per page
      const skip = (page - 1) * limit;
  
      const data = await FormDataModel.find().skip(skip).limit(limit);
      const total = await FormDataModel.countDocuments(); // Total number of documents
  
      res.json({
        data,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      res.status(500).json({ error: '❌ Failed to fetch data' });
    }
  });

// ✅ Delete Form Data by ID API
app.delete('/api/form-data/delete-data/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await FormDataModel.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ message: '❌ Data not found' });
        }
        res.json({ message: '✅ Deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: '❌ Server error' });
    }
});

// ✅ Update Post API
app.put('/api/form-data/update-form/:id', async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const result = await FormDataModel.findByIdAndUpdate(id, updatedData, { new: true });
        if (!result) {
            return res.status(404).json({ message: 'Form data not found' });
        }
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error updating form data' });
    }
});


// ✅ Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
