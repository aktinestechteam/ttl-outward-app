import React from 'react'
import{observer} from 'mobx-react-lite'
function Home({store}) {
    const changename =()=>{
        store.updateUSer ("Aradhy")
    }
    const changenamesub =()=>{
        store.addsub ("DSA")
    }
  return (
    <div>
      <h1>Home {store.userinfo.name}</h1>
      <button onClick={changename}>update Name</button>
      <button onClick={changenamesub}>update Name</button>
      {
          store.userinfo.subject.map((item,index)=><p>{item}</p>)
      }
    </div>
  )
}

export default observer(Home)
