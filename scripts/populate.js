const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const serviceAccount = require('../test-api.json');
// const serviceAccount = require('./waterthose-api.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function populateWaterSources() {
  const batch = db.batch();

  const watersourcesRef = db.collection('watersources');
  const getAfterRef = await watersourcesRef.limit(1).where('id', '==', 1000).get();

  if (getAfterRef.empty) {
    console.error("Starting ID does not exist");
    return;
  }

  const watersources = await watersourcesRef.limit(500).startAfter(getAfterRef.docs[0]).get();
  
  let startingID = getAfterRef.docs[0].data()['id'] + 1;

  watersources.forEach(watersource => {
    console.log("Updating id " + startingID);
    batch.update(watersource._ref, {reported_status: "functional"});
    startingID += 1;
  });
  
  console.log("New starting id: " + startingID);

  await batch.commit();
}

async function getID() {
  return new Promise((resolve, reject) => {
    db.collection('watersources').limit(1).where('id', '==', 123).get().then((watersources) => {
  
      let response = "";
      watersources.forEach((doc) => {
        response += doc.data()["reported_status"];
        console.log(doc.data()["reported_status"]);
      });
      resolve(response)
    });
  })
}

// getID();
// populateWaterSourcesWithIDs();
