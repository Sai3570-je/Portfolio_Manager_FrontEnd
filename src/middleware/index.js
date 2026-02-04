/**
 * Express middleware configuration
 */

const express = require('express');
const cors = require('cors');
const  m1 = require("../services/getdata.js");
/**
 * Setup common middleware
 * @param {object} app - Express app instance
 */
function setupMiddleware(app) {
  // Enable CORS
  app.use(cors());
  
  // Parse JSON bodies
  app.use(express.json());
  m1.getInstruments().then(data =>{
        console.log(data);}).catch(error => {

          console.error('Error fetching instruments:', error);
        }
        );
  // Parse URL-encoded bodies
  app.use(express.urlencoded({ extended: true }));
  
  // Static file serving
  app.use(express.static('public'));
}

module.exports = {
  setupMiddleware,
};
