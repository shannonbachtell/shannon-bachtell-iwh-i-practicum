require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.HUBSPOT_ACCESS_TOKEN;

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here
app.get('/', async (req, res) => {
  const url = 'https://api.hubapi.com/crm/v3/objects/2-72763022';

  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };

  try {
    const response = await axios.get(url, {
      headers: headers,
      params: {
        properties: 'name,description,bio,hanitat'
      }
    });

res.render('homepage', {
  title: 'Plants | Integrating With HubSpot I Practicum',
  plants: response.data.results
});

  } catch (error) {
    console.error(
      'HubSpot API error:',
      error.response?.status,
      error.response?.data || error.message
    );

    res.status(500).json({
      error: 'Unable to retrieve Plants records'
    });
  }
});
// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here
app.get('/update-cobj', async (req, res) => {
  const plantId = req.query.id;

  // Display a blank form for a new Plant
  if (!plantId) {
  return res.render('updates', {
    title: 'Update Custom Object Form | Integrating With HubSpot I Practicum',
    plant: null
  });
}

  // Retrieve an existing Plant for editing
  const url = `https://api.hubapi.com/crm/v3/objects/2-72763022/${encodeURIComponent(plantId)}`;

  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };

  try {
    const response = await axios.get(url, {
      headers,
      params: {
        properties: 'name,description,bio,habitat'
      }
    });

    res.render('plant-form', {
      plant: response.data
    });
  } catch (error) {
    console.error(
      'Error retrieving Plant:',
      error.response?.status,
      error.response?.data || error.message
    );

    res.status(500).send('Unable to load Plant form');
  }
});


// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here
app.post('/update-cobj', async (req, res) => {
  const { id, name, description, bio, habitat } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).send('Plant name is required');
  }

  const url = 'https://api.hubapi.com/crm/v3/objects/2-72763022';

  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };

  const data = {
    properties: {
      name: name.trim(),
      description: description || '',
      bio: bio || '',
      hanitat: habitat || ''
    }
  };
  try {
    if (id) {
      // Update an existing Plant
      await axios.patch(`${url}/${encodeURIComponent(id)}`, data, { headers });
    } else {
      // Create a new Plant
      await axios.post(url, data, { headers });
    }

    res.redirect('/');
  } catch (error) {
    console.error(
      'Error saving Plant:',
      error.response?.status,
      error.response?.data || error.message
    );

    res.status(500).send('Unable to save Plant');
  }
});


/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));