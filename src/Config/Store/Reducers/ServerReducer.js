const { createAction, createReducer } = require('@reduxjs/toolkit');
            
const setHttpsServer = createAction('SET_HTTPS_SERVER')
const setHttpServer = createAction('SET_HTTP_SERVER');
const initialState = { https_server: null, http_server: null }

const serverReducer = createReducer(initialState, (builder) => {       //builder, as the name implies, is an object that builds the reducer with .addCase
  builder
    .addCase(setHttpsServer, (state, action) => {                            //the 'case'
      state.https_server = action.payload.server;
    })
    .addCase(setHttpServer, (state, action) => {
      state.http_server = action.payload.server;                         
    })
})

module.exports = serverReducer;