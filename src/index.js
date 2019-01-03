import React from 'react';
import ReactDOM from 'react-dom';

const API = 'https://swapi.co/api/people/?format=json';

class App extends React.Component {
  /// state is something to store (permanent storage)
  state = {
    people: [],
    errors: null
  }

  componentDidMount() {
    // grabs url
    fetch(API)
      ///this grabs the API and stores in a promise
      .then(response => response.json())
      /// this grabs the jsResponse and stores and doesn't run until thejson file is grabbed
      .then(jsResponse => {
        console.log('fetch');
        console.log(jsResponse)
        // this variable is going to grab the 8 pics
        let first5 = jsResponse.results.filter((oneObj, index) => index < 5);
        console.log(first5)
        this.setState({people: first5})

        first5.map((person, index)=>{
          console.log(person);
          /// making a copy of the state not the state itself
          const people = this.state.people;
          fetch(person.homeworld)
            .then(jsResponse => jsResponse.json())
            .then (jsResponse => {
              people[index].homeworld = jsResponse.name;
              this.setState({people: people});
              return{people: people, index: index}
            })   
            .then(({people, index})=> {
              person.species.map((oneSpecies, index2)=>{
                fetch(oneSpecies + "?format=json")
                .then(jsResponse => jsResponse.json())
                .then(jsResponse => {
                  people[index].species[index2] = jsResponse.name;
                  this.setState({people})
                  return{people:people, index: index}
                })
                .then(({people, index})=> {
                  person.films.map((film, index4)=>{
                    fetch(film + "?format=json")
                    .then(jsResponse => jsResponse.json())
                    .then(jsResponse => {
                      console.log("----", jsResponse);
                      people[index].films[index4] = jsResponse.title;
                      this.setState({people})
                    })
                  })
                })
              })
            }) 
        })
      })
    .catch(err => this.setState({ error: err }));
  }
  
  
  render() {
    return (
      <table>
        <thead>
            <th>Name</th>
            <th>Gender</th>
            <th>Birth Year</th>
            <th>Mass</th>
            <th>Homeworld</th>
            <th>Species</th>
            <th>Film</th>
          </thead>
        {this.state.people.map((person, index) => (
          <tr key={index}>
            <td>{person.name}</td>
            <td>{person.gender}</td>
            <td>{person.birth_year}</td>
            <td>{person.mass}</td>
            <td><a href={person.homeworld}>{person.homeworld}</a></td>
            <td><a href={person.species}>{person.species}</a></td>
            <td><a href={person.films}>{person.films[1]}<br/></a></td>
          </tr>))}
        </table>
    );
  }
}

  
  

//react builds components
ReactDOM.render(<App />, document.getElementById('root'));