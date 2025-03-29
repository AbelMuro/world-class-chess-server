const {configureStore} = require('@reduxjs/toolkit');
const serverReducer = require('./Reducers/ServerReducer.js');

const store = configureStore({                      //this will create the store with a reducer
    reducer: serverReducer
})

module.exports = store;