import { getFirestore } from 'firebase-admin/firestore';

const commandMapping = {
  broken: reportBroken,
  functional: reportFunctional,
  status: checkStatus,
};

const db = getFirestore();

function getHandpumpData(id) {
  return new Promise((resolve, reject) => {
    db.collection('watersources')
    .limit(1)
    .where('id', '==', parseInt(id))
    .get()
    .then(watersources => {
      if (watersources.empty) {
        reject('Sorry, hand pump ' + id  + ' was not found');
        return;
      }

      resolve(watersources.docs[0].data());
    }).catch((err) => {
      reject("Sorry, something went wrong.");
    });
  });
}

function checkStatus(param) {
  return new Promise(resolve => {
    getHandpumpData(param).then(handpump => {
      resolve(handpump['reported_status']);
    }).catch(err => {
      resolve("Handpump not found.")
    });
  });
}

function reportBroken(id) {
  return new Promise((resolve) => {
    db.collection('watersources').limit(1).where('id', '==', parseInt(id)).get().then((watersources) => {
      if (watersources.empty) {
        resolve('Sorry, hand pump ' + id  + ' was not found');
        return;
      }
  
      watersources.docs[0]._ref.set({reported_status: 'broken'}, {merge: true}).then(() => {
        resolve(
          'Pump ' + id + ' was reported as broken. Thank you! '
        );
      })
      .catch(error => {
        console.error(error);
        resolve('Sorry. Something weng wrong. Please try again.');
      });
    });
  })
}

function reportFunctional(id) {
  return new Promise((resolve) => {
    db.collection('watersources').limit(1).where('id', '==', parseInt(id)).get().then((watersources) => {
      if (watersources.empty) {
        resolve('Sorry, hand pump ' + id  + ' was not found');
        return;
      }
  
      watersources.docs[0]._ref.set({reported_status: 'functional'}, {merge: true}).then(() => {
        resolve(
          'Pump ' + id + ' was reported as functional. Thank you! '
        );
      })
      .catch(error => {
        console.error(error);
        resolve('Sorry. Something weng wrong. Please try again.');
      });
    });
  })
}

function getSMSResponse(body) {
  const [command, param] = body.split(" ");
  return commandMapping[command](param);
}

export { getSMSResponse, reportBroken, reportFunctional };