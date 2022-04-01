window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB

if (!window.indexedDB) {
    alert("no indexed DB")
} else {

}
let request = window.indexedDB.open("Budget Tracker Application2", 2),
    db, tx, store, index

request.onerror = (e) => {
    console.log(`The error is: ${e.target.errorCode}`)
}

const sendServer = () => {

    console.log("in send to server method")
    let trans = db.transaction("DataStore", "readwrite")
    let obj = trans.objectStore("DataStore")

    let getAllTrans = obj.getAll()

    getAllTrans.onsuccess = () => {
        fetch('/api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAllTrans.result),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if (serverResponse.message) {
                    throw new Error(serverResponse);
                }
                const transaction = db.transaction(['DataStore'], 'readwrite');
                const bos = transaction.objectStore('DataStore');
                bos.clear();
            })
            .catch(err => {
                console.log(err);
            });
    }
}

request.onsuccess = (e) => {
    db = request.result
    tx = db.transaction("DataStore", "readwrite")
    store = tx.objectStore("DataStore")


    db.onerror = (e) => {
        console.log(`ERROR: ${e.target.errorCode}`)
    }

    if (navigator.onLine) {
        sendServer();
    }


}
request.onupgradeneeded = (e) => {


    let db = request.result,
        store = db.createObjectStore("DataStore", { autoIncrement: true })
}

function saveRecord(record) {

    console.log("no internet but stored for now")
    let trans = db.transaction("DataStore", 'readwrite');

    const bs = trans.objectStore('DataStore');
    bs.add(record);
};




window.addEventListener('online', sendServer);