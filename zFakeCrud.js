/* FAKE crud playground          
                    with indexedDB fake no more
*/

'use strict'  // strict says. Dont make me laugh.


/*
  you write functions that do the things, yo dont respond to onclicks

  after every crudpad.form and crudpad.db operation, 
  send crudpad.result(trueSuccess) to let it know the async op finished well (or not)

  here I use same form to show and edit for ease
  you can show a grid and let user move without crudpad nav buttons, 
  but ONE must be selected so YOU can see wich one to modify when frmEditMod fires 
  so you need to fill the inputs with the old data then enable the edit

  here I use search with (...,true) the input box   
  you can throw an advanced search instead and fill the form if its found
  then crudpad.result(true) if a record is shown or (false) if not  

  indexeddb is tricky  
  shoud I go fire.

*/



// indexedDB globals:    NAMES   db,store, index
const myDbName  = 'fakedb3' 
const myStoreName = 'fakestore'
const myKeyName = 'id'          

// indexedDB globals:    THINGS   db, store, transaction, index,           could be locals
let db        //db
let store     // 
let tx        // transaction //  
let index     // let s see...//   didnt use

//crudpad
let crudpad 


// And just because I do HATE ' ' parameters.  Wherever they are vulnerable and easily hidden typos, set const.
const transreadwrite = 'readwrite'
const transreadonly = 'readonly'


//lets do
document.addEventListener('DOMContentLoaded', main);

function main(){

  // ******************** pad
  crudpad = document.getElementById('idmenu')


  //                                                                      parameters----------------
  // mandatory  set
  crudpad.setFormControl(zFrmEmpty, zFrmBlock )  //                       form erase inputs, form block inputs   
  
  // optional set                                                          
  crudpad.setCreate(zFrmCreate, zDbCreate, )    // C                      frm to edit new, db insert
  crudpad.setRemove(zDbRemove )                 // R                      db delete
  crudpad.setUpdate(zFrmUpdate, zDbUpdate )     // U                      frm to edit mod, db update
  crudpad.setSearch(zSearch, true, )            // s ¿? So D stands for?  db search(input)+ show item,  show input text 
  // crudpad.setNav(                            // nav  << < > >>         db movecursor   + show item
  //   zDbMovFirst,
  //   zDbMovPrev, 
  //   zDbMovNext, 
  //   zDbMovLast, 
  // )                                           

  // optional custom buttons   
  crudpad.addCustomButton('buttonXls', 'custom-button', 'to XLS', crudpad.MODE_LIST.SHOW, function(){crudpad.hey('pressed to xls')})
  crudpad.addCustomButton('buttonCheck', 'custom-button', 'let me...',  crudpad.MODE_LIST.EDIT,  function(){crudpad.hey('checking something')})
  crudpad.addCustomButton('buttonWhat', 'custom-button', 'SpecialSearch',  crudpad.MODE_LIST.IDLE,  function(){crudpad.hey('special search ')})


  // ******************** DB open/create
  let openDb = indexedDB.open(myDbName, 1)

  openDb.onupgradeneeded = function(){
    // version 1, create db, create store  
    db = openDb.result
    store = db.createObjectStore( myStoreName, {keyPath: myKeyName} )   
    //SYNC!! should catch 

    // seems I need 1st store
    store.put(makeItem('11','Descr11','11.11'))
    // error?? where manag
  
  }
  openDb.onerror = function(e){
    alert (e.srcElement.error )
  }
  openDb.onsuccess = function(){
    db = openDb.result
    crudpad.start()       // I could start() without the db ready, I dont need it until I need it (I mean from crud buttons).
  }    
}


/*
************************************
** z Dev functions for CRUD & NAV **  crud panel parameters 
************************************
*/

// ------------------------------------------------------------------
// ---- implement FormControl ---mandatory--- -------- parameters: erase inputs, block inputs
//
// form - empty
function zFrmEmpty(){             //shows empty 
  myFrmShow(makeItem('','',''))  // ok just erase all input elements. You may just hide them.
}
// form - block
function zFrmBlock(){           // disble all input elements
  myFrmBlock([true,true,true])
}

// -------------------------------------------------------
// ---------------- implement CREATE ----------- new item
//
// Form - edit new item
function zFrmCreate(){
  myFrmShow(makeItem('','default',''))        // clear all inputs...  may put some default... may autocalculate id
  myFrmBlock([false,false,false])                 // enable all inputs
  // should put input restrictions, ranges, emptyness, etc.
  crudpad.result(true, 'Ready to edit NEW item')                    //should wait for dom ready? , better yet simulate a big delay to test boredness
  // function leaves form in edit mode
}
//
// DB - insert item
function zDbCreate(){     // create: new item in db, the C of crud, like 'sql insert' not 'sql create' 
  // data to be stored
  let item =   myFrmRead()    // read inputs returns  object item   
  
  // // check integrity here !!! 
  // if not valid 
  //    x.result(false, 'didnt pass because...') 
  //    return 
  
  // indexdb stuff
  tx = db.transaction(myDbName, transreadwrite)    
  store = tx.objectStore(myStoreName)

  //save
  let request = store.add(item)  // item key id automatic    // idb add = sql insert
  request.onerror = function(e){
    crudpad.result(false, 'some error Creating' + e)
  }
  request.onsuccess = function(){
    crudpad.result(true, 'saved new item')
  }
  // thats it? Too easy. Hope it works
}

// ---------------------------------------------------------
// ---------------- implement UPDATE ------------- mod item
//
// Form - edit modify
function zFrmUpdate(){
  myFrmBlock([true,false,false])            // enable all inputs but code field

  // unattended checks 
  // some input checks restrictions then
  // crudpad.hey('description too short ') something like this

  crudpad.result(true, "ready to modify item")
}
// DB - update
function zDbUpdate(){

    // 1st, data to be stored
    let item =   myFrmRead()   
  
    //should check before any attempt 
    // if not valid 
    //    crudpad.result(false, 'didnt pass') bla bla
    //    return 
  
    //db.transaction('myDb', 'readwrite')   // I HATE " " PARAMETERS !!!!! MAIN SOURCE OF ELUSIVE ERRORS
    tx = db.transaction(myDbName , transreadwrite)   // I HATE " " PARAMETERS !!!!! MAIN SOURCE OF ELUSIVE ERRORS
    store = transaction.objectStore(myStoreName)
  
    //save UPDATE 'put'
    let request = store.put(item)  // item key id automatic         // idb put ~ sql update 
    request.onerror = function(){
      crudpad.result(false, 'some error Updating')
    }
    request.onsuccess = function(){
      crudpad.result(true, 'overwritn')
    }
}

// -----------------------------------------------------------
// ---------------- implement REMOVE ------------- delete item
//
// DB - delete
function zDbRemove(){
  let item = myFrmRead()
  tx = db.transaction(myDbName, transreadwrite)
  store = transaction.objectStore(myStoreName)

  // kill
  let request = store.delete(item.id)
  request.onerror = function(){
    crudpad.result(false, 'coudnt delete')
  }
  request.onsuccess = function(){
    crudpad.result(true, 'deleted')
  }
}



// -------------------------------------------------------
// ---------------- implement SEARCH ---------------- 
//
function zSearch(what){  
  tx = db.transaction(myDbName, transreadonly)
  store = transaction.objectStore(myStoreName)

  let request = store.get(what) // odd
  request.onerror = function(){
    crudpad.result(false, ' error searching ')
  }
  request.onsuccess = function(){
    let item = request.result
    if (item == undefined){
      crudpad.result (false, 'not found')
    } else {
      myFrmShow (item)               
      crudpad.result(true, 'listo pa mirar y editar') // wwooooaa!! DOM ready? Not here too simple, but...
    }
  }
}

// ---------------------------------------
// implement NAV
// DB - showFirst
// DB - showPrev
// DB - showNext
// DB - showLast


// ---------------- CRUD form no crudpad related functions -----------------------

//first, item  to store-retrieve
//return item 
function makeItem(a,b,c){
  return {id:a, description:b, price:c}
}

// misc  related to html.    
// FRM - shows an item
function myFrmShow(item){  // myFrmShow(arrayData){
  document.getElementById("i1").value = item.id
  document.getElementById("i2").value = item.description
  document.getElementById("i3").value = item.price
}
// FRM - read form Input, return item 
function myFrmRead(){
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

