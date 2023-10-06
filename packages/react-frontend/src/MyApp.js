import React, {useState, useEffect} from 'react';
import Table from './Table';
import Form from './Form';



function MyApp() {
  const [characters, setCharacters] = useState([]);


  function removeOneCharacter (index) {
	  const updated = characters.filter((character, i) => {
	      return i !== index
	  });
	  setCharacters(updated);
	}

  function updateList(person) { 
    postUser(person)
      .then((res) => {
        if (res.status === 201) { // Check the response status code
          return res.json(); // Parse the response as JSON
        } else {
          throw new Error(`Failed Adding User: ${res.status}`);
        }
      })
      .then((addedUser) => {
        // Add the added user to the state
        setCharacters([...characters, addedUser]);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  } 

  function postUser(person) {
    const promise = fetch("Http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });

    return promise;
  }

  

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => { console.log(error); });
  }, [] );
    
  return (
    <div className="container">
      <Table characterData={characters} 
        removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />
    </div>
  ) 
}

export default MyApp;