import React from 'react'

const ImePrezime = ({osoba, urediOsobu, brisiOsobu}) => {
    return (
      <li>{osoba.imePrezime} ({osoba.adresa}) 
      <button id ="edit" onClick={urediOsobu}>Uredi</button>
      <button id="brisi" onClick={brisiOsobu}>Briši</button></li>
    )
  }

  export default ImePrezime