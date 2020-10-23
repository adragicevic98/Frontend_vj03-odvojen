import React, {useState,useEffect } from 'react'
import ImePrezime from './components/ImePrezime'
import osobeServer from './services/osobe'
import './index.css'

const App = (props) => {
    // const { poruke } = props
    const [uredi, postaviSignal]=useState(false)
    const [identifikator,postaviId]=useState(0)
    const [osobe, postaviPoruke] = useState([])
    const [unosImePrezime,postaviUnos]=useState(" ")
    const [unosAdrese, postaviAdresu]=useState(" ")
    const [ispisiSve, postaviIspis] = useState(true)
    const [unosFilter,postaviFilter]=useState("")
    // const [urediImePrezime,urediUnos]=useState("")
    
    useEffect(() => {
    console.log("Effect hook");
    // axios.get("http://localhost:3001/osobe")
    osobeServer.dohvatiSve().then((response=> {
      console.log("Podaci učitani");
      postaviPoruke(response.data)
    }))
    },[])
    console.log("Renderirano je",osobe.length,"objekata")
    
    const porukeZaIspis = ispisiSve ? osobe : osobe.filter(p => p.imePrezime.split(" ")[0] === unosFilter)
    
   
    const novaPoruka = (e) => {
        e.preventDefault()
        console.log("Klik",e.target);
        const noviObjekt = {
            imePrezime: unosImePrezime,
            adresa:unosAdrese,
            datum: new Date().toISOString(),
            // vazno: Math.random() > 0.5
          }
          // axios.post("http://localhost:3001/osobe",noviObjekt)
          console.log("uredi",uredi);
          if(!uredi){
          osobeServer.stvori(noviObjekt).then((response) =>{
            console.log(response)
            postaviPoruke(osobe.concat(response.data))
            postaviUnos('')
            postaviAdresu('')
          })
        }else{
          const osoba=osobe.find(p => p.id === identifikator)

          const novaOsoba={
            ...osoba,
            imePrezime:unosImePrezime,
            adresa:unosAdrese
          }
          osobeServer.osvjezi(identifikator,novaOsoba).then((response) => { console.log(response);
            postaviPoruke(osobe.map(p => p.id!== identifikator ? p : response.data ))
            // postaviPoruke(osobe.concat(response.data))
            postaviUnos('')
            postaviAdresu('')
            postaviSignal(false);
    
        })
        }
        
    }
    const promjenaUnosa = (e) => {
       console.log(e.target.value);
       postaviUnos(e.target.value);
    }
    const promjenaAdrese = (e) => {
        console.log(e.target.value);
        postaviAdresu(e.target.value);}
    const promjenaFiltera = (e) => {
        console.log(e.target.value);
        postaviFilter(e.target.value); 
    }
    const uredivanje = (id) => {
      postaviSignal(true);
      postaviId(id);
      const osoba=osobe.find(p => p.id === id)
      postaviUnos(osoba.imePrezime);
      postaviAdresu(osoba.adresa);
    
      // const novaOsoba={
      //   ...osoba,
      //   imePrezime:unosImePrezime,
      //   adresa:unosAdrese
      // }
    //   osobeServer.osvjezi(id,novaOsoba).then((response) => { console.log(response);
    //     postaviPoruke(osobe.map(p => p.id!== id ? p : response.data ))

    // })
  }
    const brisanjeOsobe = (id) => {
      osobeServer.brisi(id).then(response => {
        console.log(response);
        postaviPoruke(osobe.filter(p => p.id !== id))
      })
    }
    return (
      <div>
        <h1><b>Adresar</b></h1>
        <input id="filter" value={unosFilter} onChange={promjenaFiltera}></input><br></br>
        <div><button onClick={() => postaviIspis(!ispisiSve)}>{ispisiSve ? "Filtriraj":"Prikaži sve"}

        </button>

        </div>
        
        <ul>
        {	
            porukeZaIspis.map( osoba => 
              <ImePrezime key={osoba.id} osoba={osoba} urediOsobu ={()=>uredivanje(osoba.id)}brisiOsobu={()=>brisanjeOsobe(osoba.id)}/>
            )
        }
        </ul>
      
        <h2>Novi kontakt</h2>
        <form onSubmit={novaPoruka}>
            <label >Ime i prezime:</label>
            <input id="ime" value={unosImePrezime} onChange={promjenaUnosa}/><br></br><br></br>
            <label>Email adresa:</label>
            <input id="email" value={unosAdrese} onChange={promjenaAdrese}/><br></br><br></br>
        <button type='submit'>Spremi</button>
      </form>
      </div>
    )
  }
  
  export default App