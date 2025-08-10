
const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sanitizeHtml = require('sanitize-html');
require('dotenv').config();
const ImageKit = require("imagekit");
const session = require('express-session');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const port = 3000;


// SDK initialization

// SDK initialization

const imagekit = new ImageKit({
    publicKey : "public_jWv37z84quqy2HofejCG17+aOTA=",
    privateKey : "private_Z5GYaN6iS3OVx/Nwt/FhMKgqNyM=",
    urlEndpoint : "https://ik.imagekit.io/Desire4travels"
});



// SDK initialization


    // publicKey :"public_jWv37z84quqy2HofejCG17+aOTA=",
    // privateKey:"private_Z5GYaN6iS3OVx/Nwt/FhMKgqNyM=",
    // urlEndpoint:"https://ik.imagekit.io/Desire4travels"


// const serviceAccount = require('./firebaseAdminConfig.json');
  const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_CONFIG);



admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    cb(null, uniqueSuffix);
  }
});
const upload = multer({ storage });


const ownerAuth = (req, res, next) => {
  console.log('Middleware reached');
  console.log('x-owner-key:', req.headers['x-owner-key']);
  const key = req.headers['x-owner-key'];
  if (key === 'OWNER-KEY-123') {
    return next();
  }
  return res.status(403).json({ error: 'Only the owner can delete enquiries.' });
};

// POST - Create a new enquiry
app.post('/enquiry', async (req, res) => {
  try {
    const { name, phone, destination, travelers, travelDate } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required' });
    }

    const enquiry = {
      name,
      phone,
      destination,
      travelers,
      travelDate,
      called: false, // default to false
      submittedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('enquiries').add(enquiry);

    res.status(201).json({ message: 'Form submitted', id: docRef.id });
  } catch (error) {
    console.error('Error saving enquiry:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET - Retrieve all enquiries
app.get('/api/admin/enquiries', async (req, res) => {
  try {
    const snapshot = await db.collection('enquiries').orderBy('submittedAt', 'desc').get();
    const enquiries = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        submittedAt: data.submittedAt ? data.submittedAt.toDate().toISOString() : null
      };
    });

    res.status(200).json(enquiries);
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT - Update an enquiry (e.g., mark as called or update fields)
app.put('/api/admin/enquiries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    await db.collection('enquiries').doc(id).update(updateData);
    res.status(200).json({ message: 'Enquiry updated' });
  } catch (error) {
    console.error('Error updating enquiry:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE - Delete an enquiry (owner only)
app.delete('/api/admin/enquiries/:id', ownerAuth, async (req, res) => {
  try {
    const { id } = req.params;

    await db.collection('enquiries').doc(id).delete();
    res.status(200).json({ message: 'Enquiry deleted' });
  } catch (error) {
    console.error('Error deleting enquiry:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE - Delete all enquiries
app.delete('/api/admin/enquiries', async (req, res) => {
  try {
    const snapshot = await db.collection('enquiries').get();

    const batch = db.batch();

    snapshot.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    res.status(200).json({ message: 'All enquiries deleted' });
  } catch (error) {
    console.error('Error deleting all enquiries:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST - Create destination with ImageKit
app.post('/api/admin/destinations', upload.single('image'), async (req, res) => {
  try {
    const { name, state, type, rating, description, metaKeywords } = req.body;

    console.log("Request body:", req.body);  // ADD THIS
    console.log("Uploaded file:", req.file); // ADD THIS

    if (!name || !state || !type || !rating || !req.file || !description) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const parsedRating = parseFloat(rating);
    if (isNaN(parsedRating) || parsedRating < 0 || parsedRating > 5) {
      return res.status(400).json({ error: 'Rating must be between 0 and 5' });
    }

    const parsedType = Array.isArray(type) ? type : [type];

    const safeDescription = sanitizeHtml(description, {
      allowedTags: ['p', 'b', 'i', 'em', 'strong', 'h1', 'h2', 'ul', 'ol', 'li', 'br'],
      allowedAttributes: {},
    });

    // Upload image to ImageKit
    const uploadedImage = await imagekit.upload({
      file: fs.readFileSync(req.file.path),
      fileName: req.file.originalname,
      folder: "/destinations"
    });
    
    // Remove temporary file
    fs.unlinkSync(req.file.path);

    const newDestination = {
      name,
      state,
      type: parsedType,
      rating: parsedRating,
      description: safeDescription,
      image: uploadedImage.url,
      metaKeywords: metaKeywords || "", // ⬅ add this line
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('destinations').add(newDestination);
    res.status(201).json({ message: 'Destination added successfully', id: docRef.id });
  } catch (error) {
    console.error('Error adding destination:', {
      message: error.message,
      stack: error.stack,
      body: req.body,
      file: req.file,
    });
    res.status(500).json({ error: 'Server error' });
  }
});


// GET - Fetch all destinations
app.get('/api/admin/destinations', async (req, res) => {
  try {
    const snapshot = await db.collection('destinations').get();
    const destinations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.status(200).json(destinations);
  } catch (error) {
    console.error('Error fetching destinations:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


// PUT - Update destination with ImageKit
app.put('/api/admin/destinations/:id', upload.single('image'), async (req, res) => {
  try {
   const { name, state, type, rating, description, metaKeywords } = req.body;

    const destinationId = req.params.id;

    const destinationRef = db.collection('destinations').doc(destinationId);
    const doc = await destinationRef.get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Destination not found' });
    }

    const updates = {
      ...(name && { name }),
      ...(state && { state }),
      ...(type && { type: Array.isArray(type) ? type : [type] }),
      ...(rating && { rating: parseFloat(rating) }),
      ...(description && {
        description: sanitizeHtml(description, {
          allowedTags: ['p', 'b', 'i', 'em', 'strong', 'h1', 'h2', 'ul', 'ol', 'li', 'br'],
          allowedAttributes: {},
        }),
      }),
       ...(metaKeywords && { metaKeywords }), // ⬅ add this line
    };

    if (req.file) {
      // Upload new image to ImageKit
      const uploadedImage = await imagekit.upload({
        file: fs.readFileSync(req.file.path),
        fileName: req.file.originalname,
        folder: "/destinations"
      });
      
      // Remove temporary file
      fs.unlinkSync(req.file.path);
      
      updates.image = uploadedImage.url;
    }

    await destinationRef.update(updates);
    res.status(200).json({ message: 'Destination updated successfully' });
  } catch (error) {
    console.error('Error updating destination:', {
      message: error.message,
      stack: error.stack,
      body: req.body,
      file: req.file,
    });
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE - Delete destination
app.delete('/api/admin/destinations/:id', async (req, res) => {
  try {
    const destinationId = req.params.id;
    const destinationRef = db.collection('destinations').doc(destinationId);
    const doc = await destinationRef.get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Destination not found' });
    }

    await destinationRef.delete();
    res.status(200).json({ message: 'Destination deleted successfully' });
  } catch (error) {
    console.error('Error deleting destination:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


// GET - Fetch destinations (public endpoint)
app.get('/api/destinations', async (req, res) => {
  try {
    const { state, type, page = 1, limit = 100 } = req.query;
    const destinationsRef = db.collection('destinations');
    let query = destinationsRef;

    if (state) {
      query = query.where('state', '==', state);
    }

    if (type) {
      query = query.where('type', 'array-contains', type);
    }

    query = query.orderBy('createdAt', 'desc');

    const snapshot = await query.get();
    const allDestinations = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data()
      // ImageKit URL is already complete, no need to modify
    }));

    const startIndex = (page - 1) * limit;
    const paginated = allDestinations.slice(startIndex, startIndex + Number(limit));
    const hasNextPage = allDestinations.length > startIndex + Number(limit);

    res.status(200).json({
      destinations: paginated,
      hasNextPage
    });
  } catch (error) {
    console.error('Error fetching destinations:', error);
    res.status(500).json({ error: 'Failed to fetch destinations' });
  }
});



// POST - Create package with ImageKit
app.post('/api/admin/packages', upload.single('photo'), async (req, res) => {
  try {
  const {
  packageName,
  duration,
  price,
  description,
  inclusions,
  itinerary,
  destinations,
  metaKeywords // <-- Add this
} = req.body;


    if (!packageName ||!metaKeywords|| !duration || !price || !description || !inclusions || !itinerary || !req.file || !destinations) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const parsedDestinations = JSON.parse(destinations);
    if (!Array.isArray(parsedDestinations)) {
      return res.status(400).json({ error: 'Destinations must be an array' });
    }

    const safeDescription = sanitizeHtml(description, {
      allowedTags: ['p', 'b', 'i', 'em', 'strong', 'h1', 'h2', 'ul', 'ol', 'li', 'br'],
      allowedAttributes: {},
    });

    // Upload photo to ImageKit
    const uploadedImage = await imagekit.upload({
      file: fs.readFileSync(req.file.path),
      fileName: req.file.originalname,
      folder: "/packages"
    });

    // Remove temp file
    fs.unlinkSync(req.file.path);

    const newPackage = {
      packageName,
      duration,
      price,
      description: safeDescription,
      inclusions,
      itinerary,
      photo: uploadedImage.url,
      destinations: parsedDestinations,
       metaKeywords: metaKeywords || "", // <-- new line
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('packages').add(newPackage);
    res.status(201).json({ message: 'Package added successfully', id: docRef.id });
  } catch (error) {
    console.error('Error creating package:', {
      message: error.message,
      stack: error.stack,
      body: req.body,
      file: req.file,
    });
    res.status(500).json({ error: 'Server error' });
  }
});




// GET - Fetch all admin packages
app.get('/api/admin/packages', async (req, res) => {
  try {
    const snapshot = await db.collection('packages').orderBy('createdAt', 'desc').get();
    const packages = [];

    for (const doc of snapshot.docs) {
      const pkg = doc.data();
      const destIds = pkg.destinations || [];

      const destinationNames = [];
      for (const destId of destIds) {
        const destDoc = await db.collection('destinations').doc(destId).get();
        if (destDoc.exists) {
          const dest = destDoc.data();
          destinationNames.push(`${dest.name}-${dest.state}`);
        } else {
          destinationNames.push('Unknown');
        }
      }

      packages.push({
         id: doc.id,
        packageName: pkg.packageName,
        photo: pkg.photo,
        price: pkg.price,
        duration: pkg.duration,
        description: pkg.description,
        inclusions: pkg.inclusions,
        itinerary: pkg.itinerary,
        destinations: destIds,
        destinationNames: destinationNames,
        createdAt: pkg.createdAt,
        metaKeywords: pkg.metaKeywords || "",
      });
    }

    res.status(200).json(packages);
  } catch (error) {
    console.error('Error fetching admin packages:', error);
    res.status(500).json({ error: 'Server error' });
  }
});




// PUT - Update package with ImageKit
app.put('/api/admin/packages/:id', upload.single('photo'), async (req, res) => {
  try {
    const packageId = req.params.id;
    const {
      packageName,
      duration,
      price,
      description,
      inclusions,
      itinerary,
      destinations,
      metaKeywords // <-- Add this
    } = req.body;

    const updateData = {
      ...(packageName && { packageName }),
      ...(duration && { duration }),
      ...(price && { price }),
      ...(description && { description }),
      ...(inclusions && { inclusions }),
      ...(itinerary && { itinerary }),
       ...(metaKeywords && { metaKeywords }), // <-- new line
    };

    if (destinations) {
      try {
        const parsedDestinations = JSON.parse(destinations);
        if (!Array.isArray(parsedDestinations)) {
          return res.status(400).json({ error: 'Destinations must be an array' });
        }
        updateData.destinations = parsedDestinations;
      } catch (err) {
        return res.status(400).json({ error: 'Invalid JSON format for destinations' });
      }
    }

    if (req.file) {
      // Upload new photo to ImageKit
      const uploadedPhoto = await imagekit.upload({
        file: fs.readFileSync(req.file.path),
        fileName: req.file.originalname,
        folder: "/packages"
      });
      
      // Remove temporary file
      fs.unlinkSync(req.file.path);
      
      updateData.photo = uploadedPhoto.url;
    }

    await db.collection('packages').doc(packageId).update(updateData);

    res.status(200).json({ message: 'Package updated successfully' });
  } catch (error) {
    console.error('Error updating package:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


// DELETE - Delete package
app.delete('/api/admin/packages/:id', async (req, res) => {
  try {
    const packageId = req.params.id;
    const doc = await db.collection('packages').doc(packageId).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Package not found' });
    }

    
    await db.collection('packages').doc(packageId).delete();
    res.status(200).json({ message: 'Package deleted successfully' });
  } catch (error) {
    console.error('Error deleting package:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


app.get('/api/packages', async (req, res) => {
  try {
    const { destination } = req.query;
    const snapshot = await db.collection('packages').orderBy('createdAt', 'desc').get();

    const packagesRaw = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Step 1: Collect all unique destination IDs
    const destIdSet = new Set();
    packagesRaw.forEach(pkg => {
      (pkg.destinations || []).forEach(id => destIdSet.add(id));
    });

    // Step 2: Batch fetch all destination docs
    const destIdArray = Array.from(destIdSet);
    const destDocs = await Promise.all(destIdArray.map(id => db.collection('destinations').doc(id).get()));

    const destMap = {};
    destDocs.forEach(doc => {
      if (doc.exists) {
        const data = doc.data();
        destMap[doc.id] = `${data.name}-${data.state}`;
      }
    });

    // Step 3: Map destinations back to packages
    const packages = packagesRaw.map(pkg => {
      const destinationNames = (pkg.destinations || []).map(id => destMap[id]).filter(Boolean);

      // Apply filter if `destination` query param is set
      if (destination && !destinationNames.includes(destination)) return null;

     return {
  id: pkg.id,
  packageName: pkg.packageName,
  photo: pkg.photo,
  price: pkg.price,
  duration: pkg.duration,
  destinations: destinationNames,
  metaKeywords: pkg.metaKeywords || "", // ✅ Add this line
};

    }).filter(Boolean);

    res.status(200).json(packages);
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET - Fetch single package by ID
app.get('/api/packages/:id', async (req, res) => {
  try {
    const packageId = req.params.id;
    const packageDoc = await db.collection('packages').doc(packageId).get();

    if (!packageDoc.exists) {
      return res.status(404).json({ error: 'Package not found' });
    }

    const packageData = packageDoc.data();
    const fullDestinations = [];

    for (const destId of packageData.destinations || []) {
      const destDoc = await db.collection('destinations').doc(destId).get();
      if (destDoc.exists) {
        const destData = destDoc.data();
        fullDestinations.push({
          id: destDoc.id,
          ...destData,
          image: destData.image,
        });
      }
    }

    // 🧠 Compute metaTitle & metaDescription dynamically
    const cleanDescription = packageData.description?.replace(/(<([^>]+)>)/gi, ''); // remove HTML tags
    const firstTwoSentences = cleanDescription
      ?.split('.')
      .slice(0, 2)
      .join('. ')
      .trim();

    const responseData = {
      ...packageData,
      photo: packageData.photo,
      destinations: fullDestinations,

      // ✅ Dynamic meta fields
      metaTitle: packageData.packageName,
      metaDescription: firstTwoSentences ? firstTwoSentences + '.' : '',
      metaKeywords: packageData.metaKeywords || '',
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching package by ID:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


// Subscribe to newsletter
app.post('/api/newsletter', async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email format
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    const existing = await db.collection('newsletter')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (!existing.empty) {
      return res.status(409).json({ error: 'Email already subscribed' });
    }

    await db.collection('newsletter').add({
      email,
      called: false,
      subscribedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({ message: 'Subscribed successfully' });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all newsletter subscribers
app.get('/api/admin/newsletter', async (req, res) => {
  try {
    const snapshot = await db.collection('newsletter').orderBy('subscribedAt', 'desc').get();

    const subscribers = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        email: data.email,
        called: data.called || false,
        subscribedAt: data.subscribedAt ? data.subscribedAt.toDate().toISOString() : null,
      };
    });

    res.status(200).json(subscribers);
  } catch (error) {
    console.error('Error fetching newsletter subscribers:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update 'called' status for a subscriber
app.put('/api/newsletter/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { called } = req.body;

    if (typeof called !== 'boolean') {
      return res.status(400).json({ error: 'Called must be a boolean' });
    }

    await db.collection('newsletter').doc(id).update({ called });
    res.status(200).json({ message: 'Called status updated' });
  } catch (error) {
    console.error('Error updating called status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a single subscriber by ID (owner-only)
app.delete('/api/newsletter/:id', ownerAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('newsletter').doc(id).delete();
    res.status(200).json({ message: 'Subscriber deleted' });
  } catch (error) {
    console.error('Error deleting subscriber:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete all subscribers (owner-only)
app.delete('/api/newsletter', ownerAuth, async (req, res) => {
  try {
    const snapshot = await db.collection('newsletter').get();
    const batch = db.batch();

    snapshot.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    res.status(200).json({ message: 'All subscribers deleted' });
  } catch (error) {
    console.error('Error deleting all subscribers:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST: Plan a Trip
app.post('/api/plan-trip', async (req, res) => {
  const { destination, startDate, noofdays, travelers, preference, mobileNumber } = req.body;

  if (!destination || !startDate || !noofdays || !travelers || !mobileNumber) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const tripData = {
      destination,
      startDate,
      noofdays,
      travelers,
      preference: preference || '',
      mobileNumber,
      called: false, // NEW FIELD
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('plannedTrips').add(tripData);
    res.status(200).json({ message: 'Trip planned successfully' });
  } catch (error) {
    console.error('Error saving planned trip:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET: Admin fetch all planned trips
app.get('/api/admin/planned-trips', async (req, res) => {
  try {
    const snapshot = await db.collection('plannedTrips').orderBy('createdAt', 'desc').get();

    const trips = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString() || null,
      };
    });

    res.status(200).json(trips);
  } catch (error) {
    console.error('Error fetching admin planned trips:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT: Mark trip as 'called' or update status
app.put('/api/admin/planned-trips/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { called } = req.body;

    if (typeof called !== 'boolean') {
      return res.status(400).json({ error: 'called must be a boolean' });
    }

    await db.collection('plannedTrips').doc(id).update({ called });
    res.status(200).json({ message: 'Called status updated successfully' });
  } catch (error) {
    console.error('Error updating called status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE: Delete one planned trip by ID (owner-only)
app.delete('/api/admin/planned-trips/:id', ownerAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('plannedTrips').doc(id).delete();
    res.status(200).json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Error deleting trip:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE: Delete all planned trips (owner-only)
app.delete('/api/admin/planned-trips', ownerAuth, async (req, res) => {
  try {
    const snapshot = await db.collection('plannedTrips').get();
    const batch = db.batch();

    snapshot.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    res.status(200).json({ message: 'All planned trips deleted successfully' });
  } catch (error) {
    console.error('Error deleting all trips:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


// POST: submit custom quote
app.post('/api/custom-quotes', async (req, res) => {
  const { name, mobile, travelers, date, packageName } = req.body;

  if (!name || !mobile || !travelers || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const quoteData = {
      name,
      mobile,
      travelers,
      date,
      packageName: packageName || null,
      called: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection('customQuotes').add(quoteData);

    res.status(200).json({ message: 'Quote request submitted successfully' });
  } catch (error) {
    console.error('Error saving custom quote:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET: fetch all quotes ordered by createdAt descending
app.get('/api/admin/custom-quotes', async (req, res) => {
  try {
    const snapshot = await db.collection('customQuotes').orderBy('createdAt', 'desc').get();

    const quotes = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        mobile: data.mobile,
        travelers: data.travelers,
        date: data.date,
        packageName: data.packageName,
        called: data.called || false,
        createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null,
      };
    });

    res.status(200).json(quotes);
  } catch (error) {
    console.error('Error fetching custom quotes:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT: update 'called' status for a specific quote
app.put('/api/custom-quotes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { called } = req.body;

    if (typeof called !== 'boolean') {
      return res.status(400).json({ error: 'Called must be a boolean' });
    }

    await db.collection('customQuotes').doc(id).update({ called });
    res.status(200).json({ message: 'Called status updated' });
  } catch (error) {
    console.error('Error updating called status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE: remove a single quote by ID (owner-only)
app.delete('/api/custom-quotes/:id', ownerAuth, async (req, res) => {
  try {
    const { id } = req.params;

    await db.collection('customQuotes').doc(id).delete();
    res.status(200).json({ message: 'Quote deleted successfully' });
  } catch (error) {
    console.error('Error deleting quote:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE: remove all custom quotes (owner-only)
app.delete('/api/custom-quotes', ownerAuth, async (req, res) => {
  try {
    const snapshot = await db.collection('customQuotes').get();
    const batch = db.batch();

    snapshot.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    res.status(200).json({ message: 'All quotes deleted successfully' });
  } catch (error) {
    console.error('Error deleting all custom quotes:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


const slugify = (text) => {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start
    .replace(/-+$/, '');            // Trim - from end
};

/* ======== CREATE Blog ======== */
// app.post('/blogs', upload.single('image'), async (req, res) => {
//   try {
//     const { title, author, category, content, date, excerpt, status, alt } = req.body;
//     if (!title || !author || !category || !content || !date || !excerpt || !alt || !status || !req.file) {
//       return res.status(400).json({ error: 'All fields are required.' });
//     }

//     const uploadedImage = await imagekit.upload({
//       file: fs.readFileSync(req.file.path),
//       fileName: req.file.originalname,
//       folder: "/blogs"
//     });
//     fs.unlinkSync(req.file.path); // Remove temp file

//     const slug = slugify(title);
//     const docRef = await db.collection('blogs').add({
//       title, author, category, content, date, excerpt,
//       status, alt, image: uploadedImage.url, slug,
//       createdAt: admin.firestore.FieldValue.serverTimestamp(),
//     });

//     res.status(201).json({
//       message: 'Blog post added successfully',
//       id: docRef.id,
//       url: `/blogs/${slug}`
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });


app.post('/blogs', upload.array('images', 5), async (req, res) => {
  try {
   const { title, author, category, content, date, excerpt, status, alt, metaKeywords } = req.body;

    if (
      !title || !author || !category || !content ||
      !date || !excerpt || !alt || !status || !req.files || req.files.length === 0
    ) {
      return res.status(400).json({ error: 'All fields and at least one image are required.' });
    }

    const uploadedImages = await Promise.all(
      req.files.map(file =>
        imagekit.upload({
          file: fs.readFileSync(file.path),
          fileName: file.originalname,
          folder: "/blogs"
        })
      )
    );

    // Remove temp files
    req.files.forEach(file => fs.unlinkSync(file.path));

    const imageUrls = uploadedImages.map(img => img.url);
    const slug = slugify(title);

    const docRef = await db.collection('blogs').add({
      title,
      author,
      category,
      content,
      date,
      excerpt,
      status,
      alt,
      images: imageUrls, // now storing array instead of single image
      slug,
        metaKeywords: metaKeywords || "", // <-- Add this line.
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({
      message: 'Blog post added successfully',
      id: docRef.id,
      url: `/blogs/${slug}`
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


/* ======== READ All Blogs ======== */
// app.get('/blogs', async (req, res) => {
//   try {
//     const snapshot = await db.collection('blogs').get();
//     const blogs = snapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data(),
//       url: `/blogs/${doc.data().slug}`
//     }));
//     res.json(blogs);
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

app.get('/blogs', async (req, res) => {
  try {
    const snapshot = await db.collection('blogs').get();

    const blogs = snapshot.docs
      .map(doc => {
        const data = doc.data();
        if (!data || !data.slug) return null;

        // Normalize: if old blog has `image` but not `images`, convert it
        if (!data.images && data.image) {
          data.images = [data.image];
        }

        return {
          id: doc.id,
          ...data,
          metaKeywords: data.metaKeywords || "",
          url: `/blogs/${data.slug}`,
        };
      })
      .filter(Boolean);

    res.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});


/* ======== READ Single Blog by ID or Slug ======== */
app.get('/blogs/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    let blogData = null;

    const doc = await db.collection('blogs').doc(identifier).get();
    if (doc.exists) {
      blogData = { id: doc.id, ...doc.data() };
    } else {
      const snapshot = await db.collection('blogs')
        .where('slug', '==', identifier)
        .limit(1)
        .get();

      if (!snapshot.empty) {
        const foundDoc = snapshot.docs[0];
        blogData = { id: foundDoc.id, ...foundDoc.data() };
      }
    }

    if (!blogData) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json({
      ...blogData,
      metaKeywords: blogData.metaKeywords || "",
      url: `/blogs/${blogData.slug}`
    });

  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* ======== UPDATE Blog ======== */
app.put('/blogs/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
   const updates = {
  ...req.body,
  metaKeywords: req.body.metaKeywords || "" // Explicit default
};


    if (req.file) {
      const uploadedImage = await imagekit.upload({
        file: fs.readFileSync(req.file.path),
        fileName: req.file.originalname,
        folder: "/blogs"
      });
      fs.unlinkSync(req.file.path);
      updates.image = uploadedImage.url;
    }

    if (updates.title) {
      updates.slug = slugify(updates.title);
    }

    await db.collection('blogs').doc(id).update(updates);

    const updatedDoc = await db.collection('blogs').doc(id).get();
    const updatedData = updatedDoc.data();

    res.json({
      message: 'Blog updated successfully',
      id,
      metaKeywords: updatedData.metaKeywords || "",
      url: `/blogs/${updatedData.slug}`
    });

  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* ======== DELETE Blog ======== */
app.delete('/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('blogs').doc(id).delete();
    res.json({
      message: 'Blog deleted successfully',
      id
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Request Call back Destination
// app.post('/callback-destination', async (req, res) => {
//     try {
//         const { phoneNo, destination, called = false } = req.body;

//         // Validate inputs first
//         if (!destination || !phoneNo) {
//             return res.status(400).json({ error: 'All fields are required.' });
//         }

//         // Save to Firestore
//         await db.collection('callback-destination').add({
//             destination,
//             phoneNo,
//             called,
//             createdAt: admin.firestore.FieldValue.serverTimestamp() // optional but useful
//         });

//         res.status(200).json({ message: 'Contact request sent successfully' });

//     } catch (error) {
//         console.error('Error saving contact:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// Request Call back Destination
app.post('/callback-destination', async (req, res) => {
  try {
    const { phoneNo, destination, called = false } = req.body;

    // Validate inputs first
    if (!destination || !phoneNo) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Save to Firestore
    await db.collection('callback-destination').add({
      destination,
      phoneNo,
      called,
      createdAt: admin.firestore.FieldValue.serverTimestamp(), // Firestore native timestamp
      currentDateTime: new Date().toISOString() // Human-readable timestamp
    });

    res.status(200).json({ message: 'Contact request sent successfully' });

  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// GET all contact requests
app.get('/callback-destination', async (req, res) => {
    try {
        const snapshot = await db.collection('callback-destination').get();
        const contactRequests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(contactRequests);
    }
    catch (error) {
        console.error('GET CONTACT REQUESTS ERROR:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
);

//get single contact
app.get('/callback-destination/:id', async (req, res) =>
    {
        try {
            const id = req.params.id;
            const doc = await db.collection('callback-destination').doc(id).get();
            if (!doc.exists) {
                return res.status(404).json({ error: 'Contact not found' });
            }
            res.json({ id: doc.id, ...doc.data() });
            } catch (error) {
                console.error('GET SINGLE CONTACT ERROR:', error);
                res.status(500).json({ error: 'Internal server error' });
                }
    }
);

app.put('/callback-destination/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { called } = req.body;

    // Validate input
    if (typeof called !== 'boolean') {
      return res.status(400).json({ error: "'called' must be a boolean value." });
    }

    // Update the document
    await db.collection('callback-destination').doc(id).update({ called });

    res.json({ message: 'Contact updated successfully' });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE contact (owner only)
app.delete('/callback-destination/:id', ownerAuth, async (req, res) => {
  try {
    const id = req.params.id;
    await db.collection('callback-destination').doc(id).delete();
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('DELETE CONTACT ERROR:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// DELETE all contacts (owner only)
app.delete('/callback-destination', ownerAuth, async (req, res) => {
  try {
    const snapshot = await db.collection('callback-destination').get();

    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    res.json({ message: 'All contacts deleted successfully' });
  } catch (error) {
    console.error('DELETE ALL CONTACTS ERROR:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//Request Call back Package
// app.post('/callback-package', async (req, res) => {
//     try {
//         const { phoneNo, package, called = false } = req.body;

//         // Validate inputs first
//         if (!package || !phoneNo) {
//             return res.status(400).json({ error: 'All fields are required.' });
//         }

//         // Save to Firestore
//         await db.collection('callback-package').add({
//             package,
//             phoneNo,
//             called,
//             createdAt: admin.firestore.FieldValue.serverTimestamp() // optional but useful
//         });

//         res.status(200).json({ message: 'Contact request sent successfully' });

//     } catch (error) {
//         console.error('Error saving contact:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });


app.post('/callback-package', async (req, res) => {
  try {
    const { phoneNo, package, called = false } = req.body;

    // Validate inputs
    if (!package || !phoneNo) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Save to Firestore with both timestamps
    await db.collection('callback-package').add({
      package,
      phoneNo,
      called,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      currentDateTime: new Date().toISOString() // human-readable timestamp
    });

    res.status(200).json({ message: 'Contact request sent successfully' });

  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// GET all contact requests
app.get('/callback-package', async (req, res) => {
    try {
        const snapshot = await db.collection('callback-package').get();
        const contactRequests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(contactRequests);
    }
    catch (error) {
        console.error('GET CONTACT REQUESTS ERROR:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
);

//get single contact
app.get('/callback-package/:id', async (req, res) =>
    {
        try {
            const id = req.params.id;
            const doc = await db.collection('callback-package').doc(id).get();
            if (!doc.exists) {
                return res.status(404).json({ error: 'Contact not found' });
            }
            res.json({ id: doc.id, ...doc.data() });
            } catch (error) {
                console.error('GET SINGLE CONTACT ERROR:', error);
                res.status(500).json({ error: 'Internal server error' });
                }
    }
);

app.put('/callback-package/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { called } = req.body;

    // Validate input
    if (typeof called !== 'boolean') {
      return res.status(400).json({ error: "'called' must be a boolean value." });
    }

    // Update the document
    await db.collection('callback-package').doc(id).update({ called });

    res.json({ message: 'Contact updated successfully' });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// DELETE contact from callback-package (owner only)
app.delete('/callback-package/:id', ownerAuth, async (req, res) => {
  try {
    const id = req.params.id;
    await db.collection('callback-package').doc(id).delete();
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('DELETE CONTACT ERROR:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// app.post('/api/admin/upcoming-trip', async (req, res) => {
//   try {
//     const { trips } = req.body;

//     if (!Array.isArray(trips) || trips.length !== 4) {
//       return res.status(400).json({ error: 'Exactly 4 trips are required' });
//     }

//     for (const trip of trips) {
//       if (!trip.packageId || !trip.travelDate) {
//         return res.status(400).json({ error: 'Each trip must include packageId and travelDate' });
//       }
//     }

//     const upcomingTripRef = db.collection('upcomingTrips').doc('current');
//     await upcomingTripRef.set({
//       trips,
//       updatedAt: admin.firestore.FieldValue.serverTimestamp(),
//     });

//     res.status(200).json({ message: 'Upcoming trips saved successfully' });
//   } catch (error) {
//     console.error('Error saving upcoming trips:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });


// app.get("/api/upcoming-trips", async (req, res) => {
//   const snapshot = await db.collection("upcomingTrips").get();
//   const trips = snapshot.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//   }));
//   res.json(trips);
// });

// CREATE contact
// app.post('/contact-us', async (req, res) => {
//   try {
//     const { name, phoneNo, email, message } = req.body;

//     if (!name || !phoneNo || !email || !message) {
//       return res.status(400).json({ error: 'All fields (name, phoneNo, email, message) are required.' });
//     }

//     const docRef = await db.collection('contact-us').add({
//       name,
//       phoneNo,
//       email,
//       message,
//       createdAt: admin.firestore.FieldValue.serverTimestamp()
//     });

//     res.status(200).json({ message: 'Contact message sent successfully', id: docRef.id });
//   } catch (error) {
//     console.error('POST /contact-us ERROR:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

app.post('/contact-us', async (req, res) => {
  try {
    const { name, phoneNo, email, message } = req.body;

    if (!name || !phoneNo || !email || !message) {
      return res.status(400).json({ error: 'All fields (name, phoneNo, email, message) are required.' });
    }

    const docRef = await db.collection('contact-us').add({
      name,
      phoneNo,
      email,
      message,
      createdAt: admin.firestore.FieldValue.serverTimestamp(), // server-based
      currentDateTime: new Date().toISOString()                // client-readable
    });

    res.status(200).json({ message: 'Contact message sent successfully', id: docRef.id });
  } catch (error) {
    console.error('POST /contact-us ERROR:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// GET all contacts
app.get('/contact-us', async (req, res) => {
  try {
    const snapshot = await db.collection('contact-us').get();
    const contacts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(contacts);
  } catch (error) {
    console.error('GET /contact-us ERROR:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET single contact by ID
app.get('/contact-us/:id', async (req, res) => {
  try {
    const doc = await db.collection('contact-us').doc(req.params.id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('GET /contact-us/:id ERROR:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// UPDATE contact by ID
// UPDATE contact by ID
app.put('/contact-us/:id', async (req, res) => {
  try {
    const { name, phoneNo, email, message, called } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (phoneNo) updateData.phoneNo = phoneNo;
    if (email) updateData.email = email;
    if (message) updateData.message = message;

    // ✅ Allow called field to be updated
    if (typeof called === 'boolean') updateData.called = called;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'At least one field must be provided for update.' });
    }

    await db.collection('contact-us').doc(req.params.id).update(updateData);

    res.json({ message: 'Contact message updated successfully' });
  } catch (error) {
    console.error('PUT /contact-us/:id ERROR:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/contact-us/:id', ownerAuth, async (req, res) => {
  try {
    await db.collection('contact-us').doc(req.params.id).delete();
    res.json({ message: 'Contact message deleted successfully' });
  } catch (error) {
    console.error('DELETE /contact-us/:id ERROR:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Popup enquiry POST
app.post('/api/popup-enquiries', async (req, res) => {
  const { mobileNumber, destination } = req.body;

  if (!mobileNumber || !destination) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const enquiryData = {
      mobileNumber,
      destination,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection('popupEnquiries').add(enquiryData);

    res.status(200).json({ message: 'Popup enquiry submitted successfully' });
  } catch (error) {
    console.error('Error saving popup enquiry:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/admin/popup-enquiries', async (req, res) => {
  try {
    const snapshot = await db.collection('popupEnquiries').orderBy('createdAt', 'desc').get();

    const enquiries = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(enquiries);
  } catch (error) {
    console.error('Error fetching popup enquiries:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

const activityCallback = db.collection('activity-callbacks');

/**
 * CREATE
 * POST /activity-callback
 */
app.post('/activity-callback', async (req, res) => {
  try {
    const { number, activityName } = req.body;
    if (!number || !activityName) {
      return res.status(400).json({ error: 'Number and activityName are required' });
    }

    const newDoc = await activityCallback.add({
      number,
      activityName,
      called: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({ id: newDoc.id, number, activityName, called: false });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add callback' });
  }
});
/**
 * READ ALL
 * GET /activity-callback
 */
app.get('/activity-callback', async (req, res) => {
  try {
    const snapshot = await activityCallback.orderBy('createdAt', 'desc').get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch callbacks' });
  }
});

/**
 * READ ONE
 * GET /activity-callback/:id
 */
app.get('/activity-callback/:id', async (req, res) => {
  try {
    const doc = await activityCallback.doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Not found' });
    res.json({ id: doc.id, ...doc.data() });
  } catch {
    res.status(500).json({ error: 'Error getting callback' });
  }
});

/**
 * UPDATE
 * PUT /activity-callback/:id
 */
app.put('/activity-callback/:id', async (req, res) => {
  try {
    const { number, called, activityName } = req.body;
    const updateData = {};

    if (number !== undefined) updateData.number = number;
    if (called !== undefined) updateData.called = called;
    if (activityName !== undefined) updateData.activityName = activityName;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No valid fields provided to update' });
    }

    await activityCallback.doc(req.params.id).update(updateData);
    res.json({ message: 'Updated successfully' });
  } catch {
    res.status(500).json({ error: 'Failed to update' });
  }
});

/**
 * DELETE
 * DELETE /activity-callback/:id
 */
app.delete('/activity-callback/:id', ownerAuth, async (req, res) => {
  try {
    await activityCallback.doc(req.params.id).delete();
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('DELETE /activity-callback/:id ERROR:', error);
    res.status(500).json({ error: 'Failed to delete' });
  }
});

app.delete('/api/admin/popup-enquiries/:id', ownerAuth, async (req, res) => {
  try {
    await db.collection('popupEnquiries').doc(req.params.id).delete();
    res.status(200).json({ message: 'Popup enquiry deleted' });
  } catch (error) {
    console.error('Error deleting popup enquiry:', error);
    res.status(500).json({ error: 'Server error' });
  }
});





// --- UPCOMING TRIPS CRUD ---

app.post('/api/upcoming-trips', async (req, res) => {
  try {
    const { tripName, travelDate } = req.body;

    // Validate required fields
    if (!tripName || !travelDate) {
      return res.status(400).json({ error: 'Trip name and travel date are required' });
    }

    // Sanitize trip name to prevent XSS
    const safeTripName = sanitizeHtml(tripName);

    const newTrip = {
      tripName: safeTripName,
      travelDate: new Date(travelDate).toISOString(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Save to Firestore
    const docRef = await db.collection('upcoming-trips').add(newTrip);

    res.status(201).json({ message: 'Trip added successfully', id: docRef.id });
  } catch (error) {
    console.error('Error adding trip:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


// GET: Fetch all upcoming trips (ordered by travel date)
app.get('/api/upcoming-trips', async (req, res) => {
  try {
    const snapshot = await db.collection('upcoming-trips').orderBy('travelDate').get();
    const trips = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trips' });
  }
});

// PUT: Update trip (only tripName and travelDate)
app.put('/api/upcoming-trips/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { tripName, travelDate } = req.body;

    if (!tripName || !travelDate) {
      return res.status(400).json({ error: 'Trip name and travel date are required' });
    }

    const updateData = {
      tripName: sanitizeHtml(tripName),
      travelDate: new Date(travelDate).toISOString(),
    };

    const tripRef = db.collection('upcoming-trips').doc(id);
    await tripRef.update(updateData);

    res.status(200).json({ message: 'Trip updated successfully' });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: 'Update failed' });
  }
});

// DELETE: Remove a trip by ID
app.delete('/api/upcoming-trips/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('upcoming-trips').doc(id).delete();
    res.status(200).json({ message: 'Trip deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Delete failed' });
  }
});



const hotelsCollection = db.collection('hotels');

// Create hotel
app.post('/hotels', async (req, res) => {
  try {
    const {
      hotelId,
      hotelName,
      location,
      typeOfProperty,
      starRating,
      contactPerson,
      contactNumber,
      notes
    } = req.body;

    const hotelData = {
      hotelId,
      hotelName,
      location,
      typeOfProperty,
      starRating,
      contactPerson,
      contactNumber,
      notes
    };

    await hotelsCollection.doc(hotelId).set(hotelData);
    res.status(201).send('Hotel added successfully');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get all hotels
app.get('/hotels', async (req, res) => {
  try {
    const snapshot = await hotelsCollection.get();
    const hotels = snapshot.docs.map(doc => doc.data());
    res.status(200).json(hotels);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get hotel by ID
app.get('/hotels/:id', async (req, res) => {
  try {
    const doc = await hotelsCollection.doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).send('Hotel not found');
    }
    res.status(200).json(doc.data());
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Update hotel by ID
app.put('/hotels/:id', async (req, res) => {
  try {
    await hotelsCollection.doc(req.params.id).update(req.body);
    res.status(200).send('Hotel updated');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Delete hotel by ID
app.delete('/hotels/:id', async (req, res) => {
  try {
    await hotelsCollection.doc(req.params.id).delete();
    res.status(200).send('Hotel deleted');
  } catch (err) {
    res.status(500).send(err.message);
  }
});




//cab services

const servicesCollection = db.collection('services');


// Create service
app.post('/services', async (req, res) => {
  try {
    const {
      city,
      serviceType,
      providerName,
      contactInfo,
      category,
      notes
    } = req.body;

    const serviceData = {
      city,
      serviceType,
      providerName,
      contactInfo,
      category,
      notes
    };

    const docRef = await servicesCollection.add(serviceData);
    res.status(201).send(`Service added with ID: ${docRef.id}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get all services
app.get('/services', async (req, res) => {
  try {
    const snapshot = await servicesCollection.get();
    const services = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(services);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get service by ID
app.get('/services/:id', async (req, res) => {
  try {
    const doc = await servicesCollection.doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).send('Service not found');
    }
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Update service by ID
app.put('/services/:id', async (req, res) => {
  try {
    await servicesCollection.doc(req.params.id).update(req.body);
    res.status(200).send('Service updated');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Delete service by ID
app.delete('/services/:id', async (req, res) => {
  try {
    await servicesCollection.doc(req.params.id).delete();
    res.status(200).send('Service deleted');
  } catch (err) {
    res.status(500).send(err.message);
  }
});


// Delete all services
app.delete('/services', async (req, res) => {
  try {
    const snapshot = await servicesCollection.get();
    const batch = db.batch();

    snapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    res.status(200).send('All services deleted');
  } catch (err) {
    res.status(500).send(err.message);
  }
});



// POST - Update last visit timestamp
app.post('/api/last-visit', async (req, res) => {
  try {
    const { section } = req.body;
    if (!section) return res.status(400).json({ error: 'Section is required' });

    await db.collection('lastVisits').doc('admin').set(
      {
        [section]: admin.firestore.FieldValue.serverTimestamp()
      },
      { merge: true }
    );

    res.status(200).json({ message: 'Last visit updated' });
  } catch (error) {
    console.error('Error updating last visit:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET - Retrieve last visit timestamp
app.get('/api/last-visit', async (req, res) => {
  try {
    const { section } = req.query;
    if (!section) return res.status(400).json({ error: 'Section is required' });

    const doc = await db.collection('lastVisits').doc('admin').get();
    const data = doc.exists ? doc.data() : null;

    res.status(200).json({ lastVisited: data?.[section] ? data[section].toDate().toISOString() : null });
  } catch (error) {
    console.error('Error fetching last visit:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


/* ========  SERVICE‑PROVIDER REGISTRATION  ======== */
/* ========  MAP for all routes ======== */
const colMap = {
  hotel: 'hotels',
  cab:   'cabs',
  adventure: 'adventures',
  bus:   'buses',
};

/* ========  CREATE  ======== */
app.post('/service-providers', async (req, res) => {
  const { type, data } = req.body;
  if (!colMap[type]) return res.status(400).json({ error: 'Invalid provider type.' });

  try {
    await db.collection(colMap[type]).add({
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(201).json({ message: 'Provider saved.' });
  } catch (err) {
    console.error('Save error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

/* ========  BULK UPLOAD  ======== */
app.post('/service-providers/bulk', async (req, res) => {
  const { type, data } = req.body;

  // Validate type and data
  if (!colMap[type]) return res.status(400).json({ error: 'Invalid provider type.' });
  if (!Array.isArray(data)) return res.status(400).json({ error: 'Data must be an array.' });

  try {
    const batch = db.batch();
    const collectionRef = db.collection(colMap[type]);

    data.forEach((item) => {
      const docRef = collectionRef.doc(); // create new doc ID
      batch.set(docRef, {
        ...item,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();

    res.status(201).json({ message: `${data.length} providers saved.` });
  } catch (err) {
    console.error('BULK SAVE error:', err);
    res.status(500).json({ error: 'Bulk save failed.' });
  }
});


/* ========  READ  (all) ======== */
app.get('/service-providers', async (_req, res) => {
  try {
    const results = [];

    for (const [type, col] of Object.entries(colMap)) {
     const snap = await db.collection(col).orderBy("createdAt", "desc").get();

      snap.forEach(doc =>
        results.push({ id: doc.id, type, ...doc.data() })
      );
    }
    res.json(results);
  } catch (err) {
    console.error('GET error:', err);
    res.status(500).json({ error: 'Server error while fetching providers.' });
  }
});

/* ========  UPDATE  ======== */
app.put('/service-providers/:type/:id', async (req, res) => {
  const { type, id } = req.params;
  if (!colMap[type]) return res.status(400).json({ error: 'Invalid type.' });

  try {
    // remove meta fields if present
    delete req.body.id;
    delete req.body.createdAt;

    await db.collection(colMap[type])
            .doc(id)
            .set(req.body, { merge: true });   // <‑‑ merge ensures only provided fields change
    res.json({ message: 'Updated' });
  } catch (err) {
    console.error('UPDATE error:', err);
    res.status(500).json({ error: 'Update failed.' });
  }
});

/* ========  DELETE  ======== */
app.delete('/service-providers/:type/:id', async (req, res) => {
  const { type, id } = req.params;
  if (!colMap[type]) return res.status(400).json({ error: 'Invalid type.' });

  try {
    await db.collection(colMap[type]).doc(id).delete();
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('DELETE error:', err);
    res.status(500).json({ error: 'Delete failed.' });
  }
});






/* ======== TRIP REQUESTS ======== */
// POST to save a new trip request from the chatbot
app.post('/trip-requests', async (req, res) => {
  const { responses, tripDate, numPeople, destination } = req.body;
  
  if (!responses || Object.keys(responses).length === 0) {
    return res.status(400).json({ error: 'Trip data is required.' });
  }

  try {
    const docRef = await db.collection('tripRequests').add({
      ...responses,
      tripDate,
      numPeople,
      destination,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(201).json({ id: docRef.id, message: 'Trip request saved successfully.' });
  } catch (err) {
    console.error('Error saving trip request:', err);
    res.status(500).json({ error: 'Server error while saving trip data.' });
  }
});

// GET all trip requests
app.get('/trip-requests', async (req, res) => {
  try {
    const requestsSnapshot = await db.collection('tripRequests').get();
    const requests = [];
    requestsSnapshot.forEach(doc => {
      requests.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(requests);
  } catch (err) {
    console.error('Error getting trip requests:', err);
    res.status(500).json({ error: 'Server error retrieving data.' });
  }
});

// GET a single trip request by ID
app.get('/trip-requests/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await db.collection('tripRequests').doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Trip request not found.' });
    }
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error('Error getting trip request:', err);
    res.status(500).json({ error: 'Server error retrieving data.' });
  }
});

// PUT method to update a trip request
app.put('/trip-requests/:id', async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  
  if (!updatedData || Object.keys(updatedData).length === 0) {
    return res.status(400).json({ error: 'Update data is required.' });
  }

  try {
    const docRef = db.collection('tripRequests').doc(id);
    await docRef.update(updatedData);
    res.status(200).json({ id, message: 'Trip request updated successfully.' });
  } catch (err) {
    console.error('Error updating trip request:', err);
    res.status(500).json({ error: 'Server error updating data.' });
  }
});

// DELETE a trip request
app.delete('/trip-requests/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.collection('tripRequests').doc(id).delete();
    res.status(200).json({ message: 'Trip request deleted successfully.' });
  } catch (err) {
    console.error('Error deleting trip request:', err);
    res.status(500).json({ error: 'Server error deleting data.' });
  }
});








app.get("/", (req, res) => {
  res.send("✅ Desire4Travels backend is running");
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


