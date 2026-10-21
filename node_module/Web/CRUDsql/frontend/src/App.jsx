import { useState, useEffect } from 'react'

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [id, setId] = useState('');

  const fetchUsers = async ()=>{
    const res = await fetch("http://localhost:5000/user");
    const data = await res.json();
    setUsers(data);
  };
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  },[]);

  const del = async (id) =>{
    await fetch(`http://localhost:5000/user/${id}`,{method : "DELETE"});
    fetchUsers();
  };

  const upd = async (id) =>{
    const newName = prompt(" new name:");
    await fetch(`http://localhost:5000/user/${id}`,
      {
        method : "PUT",
        headers : {
          "Content-Type" : "application/json"
        },
        body : JSON.stringify({
          name : newName
        })
      });
    fetchUsers();
  };

  const add = async() => {
    await fetch("http://localhost:5000/user",{
      method : "POST",
      headers : {"Content-Type" : "application/json"},
      body : JSON.stringify({
        id : id,
        name : name
      })
    });
    fetchUsers();
    setId('');
    setName('');
  }


  return (
    <>
      <input type="text" value = {id} onChange={(e) => setId(e.target.value)} />
      <input type="text" value = {name} onChange={(e) => setName(e.target.value)} />
      <button onClick={add} >Add</button>

      <h1>User list</h1>
      {
        users.map((obj) => {
          return (
            <div key = {obj.id}>
              <p>
                {obj.id}  {obj.name}
                <button onClick={() => upd(obj.id)}>Update</button>
                <button onClick={() => del(obj.id)}>delete</button>
              </p>
            </div>
          );
        })
      }
    </>
  )
}

export default App
