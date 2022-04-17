import { getFirestore } from 'firebase-admin/firestore';

const commandMapping = {
  broken: reportBroken,
  functional: reportFunctional,
  status: checkStatus,
};

const db = getFirestore();

function checkStatus(param) {
  return new Promise((resolve, reject) => {
    db.collection('watersources')
    .limit(1)
    .where('id', '==', parseInt(param))
    .get()
    .then(watersources => {
      if (watersources.empty) {
        resolve('Sorry, hand pump ' + param  + ' was not found');
        return;
      }

      resolve(watersources.docs[0].data()['reported_status']);
    }).catch((err) => {
      // TODO: refactor uses of checkStatus to anticipate a reject
      resolve("Sorry, something went wrong.");
    });
  });
}

function reportBroken(param) {

}

function reportFunctional(param) {

}

function getSMSResponse(body) {
  const [command, param] = body.split(" ");
  return commandMapping[command](param);
}

export { getSMSResponse };