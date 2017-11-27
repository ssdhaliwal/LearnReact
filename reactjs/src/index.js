import React from 'react';
import ReactDOM from 'react-dom';
import css from './vendor/css/bootstrap.css';
import './index.css';
import Contact from './components/contact/contact.jsx';
//import Taxonomy from './components/taxonomy/taxonomy.jsx';
// ========================================

ReactDOM.render(
  <Contact title={"Contacts"} />,
    document.getElementById('root')
//  <Taxonomy text={"DEL"} />,
//    document.getElementById('root')
);
