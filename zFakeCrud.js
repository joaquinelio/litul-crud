/* FAKE crud playground          
                    with indexedDB fake no more
*/
'use strict'





// mmm...  what is best practice to do this kind of things
const myDbName  = 'fakedb' 
const myStoreName = 'fakestore'
const myKeyName = 'id'         // It's a test, I go classic. 


// DO HATE ' ' PARAMETERS
const transreadwrite = 'readwrite'
const transreadonly = 'readonly'  // crazy but the right thing

// store item {id: , description: , price: }
//        FK!!! should *type* properties too? HATE js 
//        a CLASS wont protect it either.     HATE js


let db    //db
let x     //crudpanel

//let myDbPromise = null  // not needed, panel makes it KISS anyway


document.addEventListener('DOMContentLoaded', main);


function main(){

  // here init crud menu  





  //const  object createDb?????   
  // // open, create a store&key if non existent
  // myDbPromise = idb.open(myDbName, 1, function(createdb){
  //   if (!createdb.objectStoreNames.contains(myStoreName)){
  //     createdb.createObjectStore(myStoreName, {keyPath: myKeyName})
      
  //   } 
  // })
  

  // ******************** panel

  let x = new CrudPanel()  // or whatever it is called  // HEY SO WHERE IS THE ELEMENT!!!??? standing by...
  let xx = x.status        // dont need it
  
  // mandatory
  x.setFormControl(zFrmEmpty, zFrmBlock )
  
  //optional
  x.setCreate(zFrmCreate, zDbCreate, )
  x.setUpdate(zFrmUpdate, zDbUpdate )
  x.setRemove(zDbRemove )
  x.setSearch(zSearch, true, )

  // myDbPromise.then( function(){  // hope 
  //   x.start() // no need for a promise,  needed in real db work like update storage
  // })  


  
  // ******************** DB open/create

  let openDb = indexedDB.open(myDbName, 1)

  openDb.onupgradeneeded = function(){
    // version 1, create db  // not more...
    let db = openDb.result
    db.createObjectStore( myStoreName, {keypath: myKeyName} ) //no keypath, I'll do classic.  
    //SYNC!! should catch err and report to panel...
  }
  openDb.onerror = function(){
    x.result(false, "Couldnt open. Why, I dunno ")
  }
  openDb.onsuccess = function(){   //fires after upgrade?
    let db = openDb.result
    x.result(true,  'db ready')
  }    
}


/*
************************************
** z Dev functions for CRUD & NAV **  crud panel parameters 
************************************
*/

// --------------------------------------- 
// implement FormControl
// form - empty
function zFrmEmpty(){     // just clear all input elements
  myFrmShow(['','',''])
}
// form - block
function zFrmBlock(){     // disble all input elements
  myFrmBlock([true,true,true])
}

// ---------------------------------------
// implement CREATE
// Form - edit new
function zFrmCreate(){
  myFrmShow(['','',''])           // clear all inputs  - no need maybe...  may put some default... Whatever.
  myFrmBlock([false,false,false]) // enable all inputs
}
// DB - insert
function zDbCreate(){//database, adata){
  //fakeDB.push(  myFrmRead() )
  //fakeCB(fakeSQLInsertOK)
  //database.setItem(adata[0], adata[1]+','+adata[2])  // truchíssimo sorry... sync!
  //fake async callback:
  //kk.result()

  // 1st, data to be stored
  let a =   myFrmRead()   
  
  //should check before any attempt 
  // if not valid 
  //    x.result(false, 'didnt pass') bla bla
  //    return 

  //db.transaction('myDb', 'readwrite')   // I HATE " " PARAMETERS !!!!! MAIN SOURCE OF ELUSIVE ERRORS
  let transaction = db.transaction(myDbName, transreadwrite)   // I HATE " " PARAMETERS !!!!! MAIN SOURCE OF ELUSIVE ERRORS
  let myStore = transaction.objectStore(myStoreName)

  //save CREATE 'add'
  let request = myStore.add(a)  // item key id automatic 
  request.onerror = function(){
    x.result(false, 'some error Creating')
  }
  request.onsuccess = function(){
    x.result(true, 'saved new')
  }

  // thats it? Too easy I suspect.
}

// ---------------------------------------
// implement UPDATE
// Form - edit modify
function zFrmUpdate(){
  myFrmBlock([true,false,false])  // enable all inputs but code field
  //add standalone input checks here
  // ...
}
// DB - update
function zDbUpdate(){
  // if I understand indexeddb I have to use 'put'

  
    // 1st, data to be stored
    let a =   myFrmRead()   
  
    //should check before any attempt 
    // if not valid 
    //    x.result(false, 'didnt pass') bla bla
    //    return 
  
    //db.transaction('myDb', 'readwrite')   // I HATE " " PARAMETERS !!!!! MAIN SOURCE OF ELUSIVE ERRORS
    let transaction = db.transaction(myDbName , transreadwrite)   // I HATE " " PARAMETERS !!!!! MAIN SOURCE OF ELUSIVE ERRORS
    let myStore = transaction.objectStore(myStoreName)
  
    //save UPDATE 'put'
    let request = myStore.put(a)  // item key id automatic 
    request.onerror = function(){
      x.result(false, 'some error Updating')
    }
    request.onsuccess = function(){
      x.result(true, 'overwritn')
    }



}

// ---------------------------------------
// implement REMOVE
// DB - delete
function zDbRemove(){
  let a = myFrmRead()
  let transaction = db.transaction(myDbName, transreadwrite)
  let myStore = transaction.objectStore(myStoreName)

  // kill
  let request = myStore.delete(a.id)
  request.onerror = function(){
    x.result(false, 'coudnt delete')
  }
  request.onsuccess = function(){
    x.result(true, 'deleted')
  }
}



// ---------------------------------------
// implement SEARCH 
function zSearch(what){  
  let transaction = db.transaction(myDbName, transreadonly)
  let myStore = transaction.objectStore(myStoreName)

  let request = myStore.get(what) // odd
  request.onerror = function(){
    x.result(false, ' error searching ')
  }
  request.onsuccess = function(){
    let a = request.result
    if (a == undefined){
      x.result (false, 'not found')
    } else {
      myFrmShow (a)               
      x.result(true, 'listo pa mirar y editar') // wwooooaa!! DOM ready? 
    }
  }
}


// ---------------------------------------
// implement NAV
// DB - showFirst
// DB - showPrev
// DB - showNext
// DB - showLast


// ---------------------------------------
//  Finally... result msg





// ---------------------------------------
// misc  related to html.  Separated just to leave panel related functions cleaner. 
// FRM - show record
function myFrmShow(item){  // myFrmShow(arrayData){
  document.getElementById("i1").value = item.id
  document.getElementById("i2").value = item.description
  document.getElementById("i3").value = item.price
}
// FRM - read Inputs
function myFrmRead(){
  // let arrayData = []
  // arrayData[0] = document.getElementById("i1").value
  // arrayData[1] = document.getElementById("i2").value
  // arrayData[2] = document.getElementById("i3").value
  // return arrayData
  return makeItem(
    document.getElementById("i1").value,
    document.getElementById("i2").value,
    document.getElementById("i3").value,
  )
}
// FRM - input control
function myFrmBlock(arrayDisabled){
  document.getElementById("i1").disabled = arrayDisabled[0]
  document.getElementById("i2").disabled = arrayDisabled[1]
  document.getElementById("i3").disabled = arrayDisabled[2]
}

// // ---------------------------------------
// // fake Callback
// function fakeCbSqlOk(){
//   return true
// }

// is this the way to go?
function makeItem(a,b,c){
  return {id:a, description:b, price:c}
}
