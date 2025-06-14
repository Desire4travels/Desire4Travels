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

const app = express();
const port = 3000;



app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


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
      submittedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('enquiries').add(enquiry);

    res.status(201).json({ message: 'Form submitted', id: docRef.id });
  } catch (error) {
    console.error('Error saving enquiry:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


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


// // POST - Create destination
// app.post('/api/admin/destinations', upload.single('image'), async (req, res) => {
//   try {
//     const { name, state, type, rating, description } = req.body;

//     if (!name || !state || !type || !rating || !req.file || !description) {
//       return res.status(400).json({ error: 'All fields are required' });
//     }

//     const parsedRating = parseFloat(rating);
//     if (isNaN(parsedRating) || parsedRating < 0 || parsedRating > 5) {
//       return res.status(400).json({ error: 'Rating must be between 0 and 5' });
//     }

//     const parsedType = Array.isArray(type) ? type : [type];

//     const safeDescription = sanitizeHtml(description, {
//       allowedTags: ['p', 'b', 'i', 'em', 'strong', 'h1', 'h2', 'ul', 'ol', 'li', 'br'],
//       allowedAttributes: {},
//     });

//     const newDestination = {
//       name,
//       state,
//       type: parsedType,
//       rating: parsedRating,
//       description: safeDescription,
//       image: req.file.filename,
//       createdAt: admin.firestore.FieldValue.serverTimestamp(),
//     };

//     const docRef = await db.collection('destinations').add(newDestination);
//     res.status(201).json({ message: 'Destination added successfully', id: docRef.id });
//   } catch (error) {
//     console.error('Error adding destination:', {
//       message: error.message,
//       stack: error.stack,
//       body: req.body,
//       file: req.file,
//     });
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // GET - Fetch all destinations
// app.get('/api/admin/destinations', async (req, res) => {
//   try {
//     const snapshot = await db.collection('destinations').get();
//     const destinations = snapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data()
//     }));
//     res.status(200).json(destinations);
//   } catch (error) {
//     console.error('Error fetching destinations:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // PUT - Update destination
// app.put('/api/admin/destinations/:id', upload.single('image'), async (req, res) => {
//   try {
//     const { name, state, type, rating, description } = req.body;
//     const destinationId = req.params.id;

//     const destinationRef = db.collection('destinations').doc(destinationId);
//     const doc = await destinationRef.get();
//     if (!doc.exists) {
//       return res.status(404).json({ error: 'Destination not found' });
//     }

//     const updates = {
//       ...(name && { name }),
//       ...(state && { state }),
//       ...(type && { type: Array.isArray(type) ? type : [type] }),
//       ...(rating && { rating: parseFloat(rating) }),
//       ...(description && {
//         description: sanitizeHtml(description, {
//           allowedTags: ['p', 'b', 'i', 'em', 'strong', 'h1', 'h2', 'ul', 'ol', 'li', 'br'],
//           allowedAttributes: {},
//         }),
//       }),
//     };

//     if (req.file) {
//       updates.image = req.file.filename;
//     }

//     await destinationRef.update(updates);
//     res.status(200).json({ message: 'Destination updated successfully' });
//   } catch (error) {
//     console.error('Error updating destination:', {
//       message: error.message,
//       stack: error.stack,
//       body: req.body,
//       file: req.file,
//     });
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // DELETE - Delete destination
// app.delete('/api/admin/destinations/:id', async (req, res) => {
//   try {
//     const destinationId = req.params.id;
//     const destinationRef = db.collection('destinations').doc(destinationId);
//     const doc = await destinationRef.get();
//     if (!doc.exists) {
//       return res.status(404).json({ error: 'Destination not found' });
//     }

//     await destinationRef.delete();
//     res.status(200).json({ message: 'Destination deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting destination:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// app.post('/api/admin/packages', upload.single('photo'), async (req, res) => {
//   try {
//     const {
//       packageName,
//       duration,
//       price,
//       description,
//       inclusions,
//       itinerary,
//       destinations
//     } = req.body;

//     if (!packageName || !duration || !price || !description || !inclusions || !itinerary || !req.file || !destinations) {
//       return res.status(400).json({ error: 'All fields are required' });
//     }

//     const parsedDestinations = JSON.parse(destinations);
//     if (!Array.isArray(parsedDestinations)) {
//       return res.status(400).json({ error: 'Destinations must be an array' });
//     }

//     const newPackage = {
//       packageName,
//       duration,
//       price,
//       description,
//       inclusions,
//       itinerary,
//       photo: req.file.filename,
//       destinations: parsedDestinations,
//       createdAt: admin.firestore.FieldValue.serverTimestamp(),
//     };

//     const docRef = await db.collection('packages').add(newPackage);
//     res.status(201).json({ message: 'Package added successfully', id: docRef.id });
//   } catch (error) {
//     console.error('Error creating package:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// app.get('/api/admin/packages', async (req, res) => {
//   try {
//     const snapshot = await db.collection('packages').orderBy('createdAt', 'desc').get();
//     const packages = [];

//     for (const doc of snapshot.docs) {
//       const pkg = doc.data();
//       const destIds = pkg.destinations || [];

//       const destinationNames = [];
//       for (const destId of destIds) {
//         const destDoc = await db.collection('destinations').doc(destId).get();
//         if (destDoc.exists) {
//           const dest = destDoc.data();
//           destinationNames.push(`${dest.name}-${dest.state}`);
//         } else {
//           destinationNames.push('Unknown');
//         }
//       }

//       packages.push({
//         id: doc.id,
//         packageName: pkg.packageName,
//         photo: `${req.protocol}://${req.get('host')}/uploads/${pkg.photo}`,
//         price: pkg.price,
//         duration: pkg.duration,
//         description: pkg.description,
//         inclusions: pkg.inclusions,
//         itinerary: pkg.itinerary,
//         destinations: destinationNames,
//         createdAt: pkg.createdAt
//       });
//     }

//     res.status(200).json(packages);
//   } catch (error) {
//     console.error('Error fetching admin packages:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// app.put('/api/admin/packages/:id', upload.single('photo'), async (req, res) => {
//   try {
//     const packageId = req.params.id;
//     const {
//       packageName,
//       duration,
//       price,
//       description,
//       inclusions,
//       itinerary,
//       destinations
//     } = req.body;

//     const updateData = {
//       ...(packageName && { packageName }),
//       ...(duration && { duration }),
//       ...(price && { price }),
//       ...(description && { description }),
//       ...(inclusions && { inclusions }),
//       ...(itinerary && { itinerary }),
//     };

//     if (destinations) {
//       try {
//         const parsedDestinations = JSON.parse(destinations);
//         if (!Array.isArray(parsedDestinations)) {
//           return res.status(400).json({ error: 'Destinations must be an array' });
//         }
//         updateData.destinations = parsedDestinations;
//       } catch (err) {
//         return res.status(400).json({ error: 'Invalid JSON format for destinations' });
//       }
//     }

//     if (req.file) {
//       updateData.photo = req.file.filename;
//     }

//     await db.collection('packages').doc(packageId).update(updateData);

//     res.status(200).json({ message: 'Package updated successfully' });
//   } catch (error) {
//     console.error('Error updating package:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// app.delete('/api/admin/packages/:id', async (req, res) => {
//   try {
//     const packageId = req.params.id;
//     const doc = await db.collection('packages').doc(packageId).get();

//     if (!doc.exists) {
//       return res.status(404).json({ error: 'Package not found' });
//     }

//     await db.collection('packages').doc(packageId).delete();
//     res.status(200).json({ message: 'Package deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting package:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// app.get('/api/packages', async (req, res) => {
//   try {
//     const { destination } = req.query;
//     const snapshot = await db.collection('packages').orderBy('createdAt', 'desc').get();
//     const packages = [];

//     for (const doc of snapshot.docs) {
//       const pkg = doc.data();
//       const destIds = pkg.destinations || [];

//       const destinationNames = [];
//       for (const destId of destIds) {
//         const destDoc = await db.collection('destinations').doc(destId).get();
//         if (destDoc.exists) {
//           const dest = destDoc.data();
//           destinationNames.push(`${dest.name}-${dest.state}`);
//         }
//       }

//       if (destination && !destinationNames.includes(destination)) continue;

//       packages.push({
//         id: doc.id,
//         packageName: pkg.packageName,
//         photo: `${req.protocol}://${req.get('host')}/uploads/${pkg.photo}`,
//         price: pkg.price,
//         duration: pkg.duration,
//         destinations: destinationNames,
//       });
//     }

//     res.status(200).json(packages);
//   } catch (error) {
//     console.error('Error fetching packages:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });


// app.get('/api/packages/:id', async (req, res) => {
//   try {
//     const packageId = req.params.id;
//     const packageDoc = await db.collection('packages').doc(packageId).get();

//     if (!packageDoc.exists) {
//       return res.status(404).json({ error: 'Package not found' });
//     }

//     const packageData = packageDoc.data();
//     const fullDestinations = [];

//     for (const destId of packageData.destinations || []) {
//       const destDoc = await db.collection('destinations').doc(destId).get();
//       if (destDoc.exists) {
//         const destData = destDoc.data();
//         fullDestinations.push({
//           id: destDoc.id,
//           ...destData,
//           image: `${req.protocol}://${req.get('host')}/uploads/${destData.image}`,
//         });
//       }
//     }

//     const responseData = {
//       ...packageData,
//       photo: `${req.protocol}://${req.get('host')}/uploads/${packageData.photo}`,
//       destinations: fullDestinations,
//     };

//     res.status(200).json(responseData);
//   } catch (error) {
//     console.error('Error fetching package by ID:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// app.get('/api/destinations', async (req, res) => {
//   try {
//     const { state, type, page = 1, limit = 100 } = req.query;
//     const destinationsRef = db.collection('destinations');
//     let query = destinationsRef;

//     if (state) {
//       query = query.where('state', '==', state);
//     }

//     if (type) {
//       query = query.where('type', 'array-contains', type);
//     }

//     query = query.orderBy('createdAt', 'desc');

//     const snapshot = await query.get();
//     const allDestinations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

//     const startIndex = (page - 1) * limit;
//     const paginated = allDestinations.slice(startIndex, startIndex + Number(limit));
//     const hasNextPage = allDestinations.length > startIndex + Number(limit);

//     res.status(200).json({
//       destinations: paginated,
//       hasNextPage
//     });
//   } catch (error) {
//     console.error('Error fetching destinations:', error);
//     res.status(500).json({ error: 'Failed to fetch destinations' });
//   }
// });


// POST - Create destination with ImageKit
app.post('/api/admin/destinations', upload.single('image'), async (req, res) => {
  try {
    const { name, state, type, rating, description } = req.body;

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
    const { name, state, type, rating, description } = req.body;
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

// POST - Create package with ImageKit
// POST - Create package with Firebase Storage
app.post('/api/admin/packages', upload.single('photo'), async (req, res) => {
  try {
    const {
      packageName,
      duration,
      price,
      description,
      inclusions,
      itinerary,
      destinations
    } = req.body;

    if (!packageName || !duration || !price || !description || !inclusions || !itinerary || !req.file || !destinations) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const parsedDestinations = JSON.parse(destinations);
    if (!Array.isArray(parsedDestinations)) {
      return res.status(400).json({ error: 'Destinations must be an array' });
    }

    // Upload photo to Firebase Storage
    const fileName = `packages/${Date.now()}-${req.file.originalname}`;
    const file = admin.storage().bucket().file(fileName);

    await file.save(fs.readFileSync(req.file.path), {
      metadata: { contentType: req.file.mimetype },
    });

    await file.makePublic();

    // Remove temporary file
    fs.unlinkSync(req.file.path);

    const publicUrl = `https://storage.googleapis.com/${admin.storage().bucket().name}/${fileName}`;

    const newPackage = {
      packageName,
      duration,
      price,
      description,
      inclusions,
      itinerary,
      photo: publicUrl,
      destinations: parsedDestinations,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('packages').add(newPackage);
    res.status(201).json({ message: 'Package added successfully', id: docRef.id });
  } catch (error) {
    console.error('Error creating package:', error);
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
        createdAt: pkg.createdAt
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
      destinations
    } = req.body;

    const updateData = {
      ...(packageName && { packageName }),
      ...(duration && { duration }),
      ...(price && { price }),
      ...(description && { description }),
      ...(inclusions && { inclusions }),
      ...(itinerary && { itinerary }),
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

// GET - Fetch packages (public endpoint)
// app.get('/api/packages', async (req, res) => {
//   try {
//     const { destination } = req.query;
//     const snapshot = await db.collection('packages').orderBy('createdAt', 'desc').get();
//     const packages = [];

//     for (const doc of snapshot.docs) {
//       const pkg = doc.data();
//       const destIds = pkg.destinations || [];

//       const destinationNames = [];
//       for (const destId of destIds) {
//         const destDoc = await db.collection('destinations').doc(destId).get();
//         if (destDoc.exists) {
//           const dest = destDoc.data();
//           destinationNames.push(`${dest.name}-${dest.state}`);
//         }
//       }

//       if (destination && !destinationNames.includes(destination)) continue;

//       packages.push({
//         id: doc.id,
//         packageName: pkg.packageName,
//         photo: pkg.photo, // ImageKit URL is already complete
//         price: pkg.price,
//         duration: pkg.duration,
//         destinations: destinationNames,
//       });
//     }

//     res.status(200).json(packages);
//   } catch (error) {
//     console.error('Error fetching packages:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

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
          image: destData.image, // ImageKit URL is already complete
        });
      }
    }

    const responseData = {
      ...packageData,
      photo: packageData.photo, // ImageKit URL is already complete
      destinations: fullDestinations,
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching package by ID:', error);
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
      subscribedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({ message: 'Subscribed successfully' });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/admin/newsletter', async (req, res) => {
  try {
    const snapshot = await db.collection('newsletter').orderBy('subscribedAt', 'desc').get();
    const subscribers = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        email: data.email,
        subscribedAt: data.subscribedAt ? data.subscribedAt.toDate().toISOString() : null,
      };
    });

    res.status(200).json(subscribers);
  } catch (error) {
    console.error('Error fetching newsletter subscribers:', error);
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
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('plannedTrips').add(tripData);

    res.status(200).json({ message: 'Trip planned successfully' });
  } catch (error) {
    console.error('Error saving planned trip:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET: Admin fetch planned trips
app.get('/api/admin/planned-trips', async (req, res) => {
  try {
    const snapshot = await db.collection('plannedTrips').orderBy('createdAt', 'desc').get();

    const trips = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(trips);
  } catch (error) {
    console.error('Error fetching admin planned trips:', error);
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

    const quotes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(quotes);
  } catch (error) {
    console.error('Error fetching custom quotes:', error);
    res.status(500).json({ error: 'Server error' });
  }
});










// // Blogs

// const slugify = (text) => {
//   return text.toString().toLowerCase()
//     .replace(/\s+/g, '-')           // Replace spaces with -
//     .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
//     .replace(/\-\-+/g, '-')         // Replace multiple - with single -
//     .replace(/^-+/, '')             // Trim - from start of text
//     .replace(/-+$/, '');            // Trim - from end of text
// };

// // CREATE blog
// app.post('/blogs', upload.single('image'), async (req, res) => {
//     try {
//         console.log('REQ BODY:', req.body);
//         console.log('REQ FILE:', req.file);

//         const { title, author, category, content, date, excerpt, status, alt } = req.body;

//         if (!title || !author || !category || !content || !date || !excerpt || !alt || !status || !req.file) {
//             return res.status(400).json({ error: 'All fields are required.' });
//         }

//         const imageUrl = `/uploads/${req.file.filename}`;
//         const slug = slugify(title);
        
//         const docRef = await db.collection('blogs').add({
//             title,
//             author,
//             category,
//             content,
//             date,
//             excerpt,
//             status,
//             alt,
//             image: imageUrl,
//             slug,
//             createdAt: admin.firestore.FieldValue.serverTimestamp(),
//         });

//         res.status(201).json({
//             message: 'Blog post added successfully',
//             id: docRef.id,
//             url: `/blogs/${docRef.id}-${slug}`
//         });
//     } catch (error) {
//         console.error('FIRESTORE ERROR:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// // GET all blogs
// app.get('/blogs', async (req, res) => {
//     try {
//         const snapshot = await db.collection('blogs').get();
//         const blogs = snapshot.docs.map(doc => ({
//             id: doc.id,
//             ...doc.data(),
//             url: `/blogs/${doc.id}-${doc.data().slug}`
//         }));
//         res.json(blogs);
//     } catch (error) {
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// // GET single blog by ID or slug
// app.get('/blogs/:identifier', async (req, res) => {
//     try {
//         const identifier = req.params.identifier;
        
//         // If identifier is just an ID (no dashes)
//         if (!identifier.includes('-')) {
//             const doc = await db.collection('blogs').doc(identifier).get();
//             if (!doc.exists) return res.status(404).json({ error: 'Blog not found' });
            
//             // Redirect to SEO-friendly URL if possible
//             if (doc.data().slug) {
//                 return res.redirect(301, `/blogs/${doc.id}-${doc.data().slug}`);
//             }
//             return res.json({ id: doc.id, ...doc.data() });
//         }
        
//         // Extract ID from slug (first part before first dash)
//         const id = identifier.split('-')[0];
//         const doc = await db.collection('blogs').doc(id).get();
        
//         if (!doc.exists) return res.status(404).json({ error: 'Blog not found' });
        
//         // Verify the full slug matches
//         const expectedSlug = `${id}-${doc.data().slug}`;
//         if (identifier !== expectedSlug) {
//             return res.status(404).json({ error: 'Blog not found' });
//         }
        
//         res.json({ 
//             id: doc.id, 
//             ...doc.data(),
//             url: `/blogs/${expectedSlug}` 
//         });
//     } catch (error) {
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// // UPDATE blog
// app.put('/blogs/:id', upload.single('image'), async (req, res) => {
//     try {
//         const { id } = req.params;
//         const updates = req.body;
        
//         if (req.file) {
//             updates.image = `/uploads/${req.file.filename}`;
//         }
        
//         // If title is being updated, update the slug too
//         if (updates.title) {
//             updates.slug = slugify(updates.title);
//         }
        
//         // Get current document to check if we need to redirect
//         const currentDoc = await db.collection('blogs').doc(id).get();
//         const currentSlug = currentDoc.data().slug;
        
//         await db.collection('blogs').doc(id).update(updates);
        
//         const newSlug = updates.slug || currentSlug;
//         const newUrl = `/blogs/${id}-${newSlug}`;
        
//         res.json({ 
//             message: 'Blog updated successfully',
//             id,
//             url: newUrl,
//             redirect: updates.slug ? newUrl : null // Only if slug changed
//         });
//     } catch (error) {
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// // DELETE blog
// app.delete('/blogs/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         await db.collection('blogs').doc(id).delete();
//         res.json({ 
//             message: 'Blog deleted successfully',
//             id
//         });
//     } catch (error) {
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });


const slugify = (text) => {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start
    .replace(/-+$/, '');            // Trim - from end
};


/* app.post('/blogs', upload.single('image'), async (req, res) => {
  try {
    const { title, author, category, content, date, excerpt, status, alt } = req.body;
    if (!title || !author || !category || !content || !date || !excerpt || !alt || !status || !req.file) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
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
      image: imageUrl,
      slug,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({
      message: 'Blog post added successfully',
      id: docRef.id,
      url: `/blogs/${slug}` // Slug-based primary URL
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/blogs', async (req, res) => {
  try {
    const snapshot = await db.collection('blogs').get();
    const blogs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      url: `/blogs/${doc.data().slug}`
    }));
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/blogs/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    let blogData = null;

    // Try by ID
    const doc = await db.collection('blogs').doc(identifier).get();
    if (doc.exists) {
      blogData = { id: doc.id, ...doc.data() };
    } else {
      // Try by Slug
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
      url: `/blogs/${blogData.slug}`
    });

  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.put('/blogs/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (req.file) {
      updates.image = `/uploads/${req.file.filename}`;
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
      url: `/blogs/${updatedData.slug}`
    });

  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


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

 */

/* ======== CREATE Blog ======== */
app.post('/blogs', upload.single('image'), async (req, res) => {
  try {
    const { title, author, category, content, date, excerpt, status, alt } = req.body;
    if (!title || !author || !category || !content || !date || !excerpt || !alt || !status || !req.file) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const uploadedImage = await imagekit.upload({
      file: fs.readFileSync(req.file.path),
      fileName: req.file.originalname,
      folder: "/blogs"
    });
    fs.unlinkSync(req.file.path); // Remove temp file

    const slug = slugify(title);
    const docRef = await db.collection('blogs').add({
      title, author, category, content, date, excerpt,
      status, alt, image: uploadedImage.url, slug,
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
app.get('/blogs', async (req, res) => {
  try {
    const snapshot = await db.collection('blogs').get();
    const blogs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      url: `/blogs/${doc.data().slug}`
    }));
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
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
    const updates = req.body;

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
            createdAt: admin.firestore.FieldValue.serverTimestamp() // optional but useful
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

//delete contact
app.delete('/callback-destination/:id', async (req, res) =>
  {
    try {
      const id = req.params.id;
      await db.collection('callback-destination').doc(id).delete();
      res.json({ message: 'Contact deleted successfully' });
      } catch (error) {
        console.error('DELETE CONTACT ERROR:', error);
        res.status(500).json({ error: 'Internal server error' });
        }
        }
);







//Request Call back Package


app.post('/callback-package', async (req, res) => {
    try {
        const { phoneNo, package, called = false } = req.body;

        // Validate inputs first
        if (!package || !phoneNo) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Save to Firestore
        await db.collection('callback-package').add({
            package,
            phoneNo,
            called,
            createdAt: admin.firestore.FieldValue.serverTimestamp() // optional but useful
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


app.delete('/callback-package/:id', async (req, res) =>
  {
    try {
      const id = req.params.id;
      await db.collection('callback-package').doc(id).delete();
      res.json({ message: 'Contact deleted successfully' });
      } catch (error) {
        console.error('DELETE CONTACT ERROR:', error);
        res.status(500).json({ error: 'Internal server error' });
        }
        }
);

app.post('/api/admin/upcoming-trip', async (req, res) => {
  try {
    const { trips } = req.body;

    if (!Array.isArray(trips) || trips.length !== 4) {
      return res.status(400).json({ error: 'Exactly 4 trips are required' });
    }

    for (const trip of trips) {
      if (!trip.packageId || !trip.travelDate) {
        return res.status(400).json({ error: 'Each trip must include packageId and travelDate' });
      }
    }

    const upcomingTripRef = db.collection('upcomingTrips').doc('current');
    await upcomingTripRef.set({
      trips,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({ message: 'Upcoming trips saved successfully' });
  } catch (error) {
    console.error('Error saving upcoming trips:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


app.get("/api/upcoming-trips", async (req, res) => {
  const snapshot = await db.collection("upcomingTrips").get();
  const trips = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  res.json(trips);
});

// CREATE contact
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
      createdAt: admin.firestore.FieldValue.serverTimestamp()
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
app.put('/contact-us/:id', async (req, res) => {
  try {
    const { name, phoneNo, email, message } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (phoneNo) updateData.phoneNo = phoneNo;
    if (email) updateData.email = email;
    if (message) updateData.message = message;

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

// DELETE contact by ID
app.delete('/contact-us/:id', async (req, res) => {
  try {
    await db.collection('contact-us').doc(req.params.id).delete();
    res.json({ message: 'Contact message deleted successfully' });
  } catch (error) {
    console.error('DELETE /contact-us/:id ERROR:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
);
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





// const activityCallback = db.collection('activity-callbacks');

// /**
//  * CREATE
//  * POST /api/callbacks
//  */
// app.post('/activity-callback', async (req, res) => {
//   try {
//     const { number } = req.body;
//     if (!number) return res.status(400).json({ error: 'Number is required' });

//     const newDoc = await activityCallback.add({ number, createdAt: admin.firestore.FieldValue.serverTimestamp() });
//     res.status(201).json({ id: newDoc.id, number });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to add callback' });
//   }
// });

// /**
//  * READ ALL
//  * GET /api/callbacks
//  */
// app.get('/activity-callback', async (req, res) => {
//   try {
//     const snapshot = await activityCallback.orderBy('createdAt', 'desc').get();
//     const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//     res.json(data);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch callbacks' });
//   }
// });

// /**
//  * READ ONE
//  * GET /api/callbacks/:id
//  */
// app.get('/activity-callback/:id', async (req, res) => {
//   try {
//     const doc = await activityCallback.doc(req.params.id).get();
//     if (!doc.exists) return res.status(404).json({ error: 'Not found' });
//     res.json({ id: doc.id, ...doc.data() });
//   } catch {
//     res.status(500).json({ error: 'Error getting callback' });
//   }
// });

// /**
//  * UPDATE
//  * PUT /api/callbacks/:id
//  */
// app.put('/activity-callback/:id', async (req, res) => {
//   try {
//     const { number } = req.body;
//     if (!number) return res.status(400).json({ error: 'Number is required' });

//     await activityCallback.doc(req.params.id).update({ number });
//     res.json({ message: 'Updated successfully' });
//   } catch {
//     res.status(500).json({ error: 'Failed to update' });
//   }
// });

// /**
//  * DELETE
//  * DELETE /api/callbacks/:id
//  */
// app.delete('/activity-callback/:id', async (req, res) => {
//   try {
//     await activityCallback.doc(req.params.id).delete();
//     res.status(200).json({ message: 'Deleted successfully' });
//   } catch {
//     res.status(500).json({ error: 'Failed to delete' });
//   }
// });



const activityCallback = db.collection('activity-callbacks');

/**
 * CREATE
 * POST /activity-callback
 */
app.post('/activity-callback', async (req, res) => {
  try {
    const { number } = req.body;
    if (!number) return res.status(400).json({ error: 'Number is required' });

    const newDoc = await activityCallback.add({
      number,
      called: false, // 👈 default value
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({ id: newDoc.id, number, called: false });
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
    const { number, called } = req.body;
    const updateData = {};

    if (number !== undefined) updateData.number = number;
    if (called !== undefined) updateData.called = called;

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
app.delete('/activity-callback/:id', async (req, res) => {
  try {
    await activityCallback.doc(req.params.id).delete();
    res.status(200).json({ message: 'Deleted successfully' });
  } catch {
    res.status(500).json({ error: 'Failed to delete' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

