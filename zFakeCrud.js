/** FAKE crud playground          
                          with indexedDB fake no more
*/

'use strict'  // strict says. Dont make me laugh. I hate JS.


/*
  you write functions that do the things, yo dont respond to onclicks

  after every crudpad.form and crudpad.db operation, 
  send crudpad.result(trueSuccess) to let it know the async op finished well (or not)

  here I use same form to show and edit for ease
  It could show a grid and let user move without the crudpad nav buttons instead, 
  but ONE must be selected, the to be modified when frmEditMod fires 
  so you need to fill the inputs with the old data then enable the edit

  here I use search with (...,true) the input box   
  Dev can throw an advanced search instead, then fill the form if its found
  then crudpad.result(true) if a record is shown or (false) if not  

  mode_list works as masks, binary sum.  The parameter for any of this two modes: 
  crudpad.MODE_LIST.SHOW + crudpad.MODE_LIST.IDLE

  indexeddb is tricky  
  shoud I go fire.

*/


// *********************************************** DB stuff *********************
// delay test
const DESPIOJANDO = true      //debugging
const yawning = 100000        //yawns

// indexedDB globals:    NAMES   db,store, index
const myDbName  = 'fakedb3' 
const myStoreName = 'fakestore'
const myKeyName = 'id'          

// indexedDB globals:    THINGS   db, store, transaction, index       could be locals
let db        // db
let store     // store
let tx        // transaction   
let index     // let s see...//   didnt use

// And just because I do HATE ' ' parameters.  Wherever they are vulnerable and easily hidden typos, set const.
const transreadwrite = 'readwrite'
const transreadonly = 'readonly'
//
// *********************************************** DB stuff **********************




//crudpad
let crudpad 

//lets do
document.addEventListener('DOMContentLoaded', main);
function main(){


  // ******************** pad
  crudpad = document.getElementById('idmenu')


  //                                                               parameters----------------
  // mandatory  set
  crudpad.setFormControl(zFrmEmpty, zFrmBlock) //                  form emptied inputs, form blocked inputs   
  
  // optional set                                                          
  crudpad.setCreate(zFrmCreate, zDbCreate, )  // C              frm to edit new,  db insert
  crudpad.setRemove(zDbRemove, )              // D              db delete
  crudpad.setUpdate(zFrmUpdate, zDbUpdate, )  // U              frm to edit mod,  db update
  crudpad.setSearch(zSearch, true, )          // R              db search(input)+ show item, true:show input text 
  // crudpad.setNav(                             // nav << < > >>  db movecursor   + show item
  //   zDbMovFirst,
  //   zDbMovPrev, 
  //   zDbMovNext, 
  //   zDbMovLast, 
  // )                                           

  // optional custom buttons, examples for different views
  //                       htmlElemname,  initial class,   innertext,   modes where is active,   onclick        
  crudpad.addCustomButton('buttonXls',   'custom-button', 'to XLS',     crudpad.MODE_LIST.SHOW, 'custom xls'  ,function(){crudpad.hey('I pressed "to xls"')})
  crudpad.addCustomButton('buttonCheck', 'custom-button', 'let me...',  crudpad.MODE_LIST.EDIT, 'custom some' ,function(){crudpad.hey('I am checking something')})
  crudpad.addCustomButton('buttonWhat',  'custom-button', 'Search2',    crudpad.MODE_LIST.IDLE, 'custom srch' ,function(){crudpad.hey('I do special search ')})






  // ******************** DB open/create
  let request = indexedDB.open(myDbName, 1)
  request.onupgradeneeded = function(event){    // version 1, create db, create store  
    db = request.result
    store = db.createObjectStore( myStoreName, {keyPath: myKeyName} )     //SYNC? should catch     
  }
  request.onerror = function(e){
    alert (e.srcElement.error )
  }
  request.onsuccess = function(event){
    db = request.result

    // START CRUDPAD
    crudpad.start()       // I could start() without the db ready, I dont need it until I need it (I mean from crud buttons).
  }    
}


/*
************************************
** z Dev functions for CRUD & NAV **  used as crud panel parameters. 
************************************
*/

// ------------------------------------------------------------------
// ---- implement FormControl ---mandatory--- -------- parameters: erase inputs, block inputs
//
// form - empty
function zFrmEmpty(){             //shows empty 
  myFrmShow(makeItem('','',''))  // ok just erase all input elements. You may just hide them too.
}
// form - block
function zFrmBlock(){           // disble all input elements
  myFrmBlock([true,true,true])
}

// -------------------------------------------------------------
// ---------------- implement CREATE ----------- new item to db
//
// Form - edit new item
function zFrmCreate(){
  myFrmShow(makeItem('','default',''))            // clear all inputs...  may put some default... may autocalculate id
  myFrmBlock([false,false,false])                 // enable all inputs

  // form validation!
  // should put input restrictions, ranges, emptyness, etc.

  crudpad.result(true, 'Ready to edit NEW item')                    //should wait for dom ready? , better yet simulate a big delay to test boredness
  // function leaves form able to be edited 
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
  tx = db.transaction(myStoreName, transreadwrite)    
  store = tx.objectStore(myStoreName)     //wtf is not ready? async?

  //save
  let request = store.add(item)  // item key id automatic    // idb add ~ sql insert  // 
  request.onerror = function(e){
    
    setTimeout(function(){
      crudpad.result(false, 'some error Creating' + e)
    }, yawning)
    
    
  }
  request.onsuccess = function(){
    yawn(()=>{
    crudpad.result(true, 'saved new item'+ item.id)
    })
  }
}

// ---------------------------------------------------------
// ---------------- implement UPDATE ------------- mod item
//
// Form - edit modify
function zFrmUpdate(){
  myFrmBlock([true,false,false])            // enable all inputs but code field

  // unattended checks   form validation!!
  // some input checks restrictions then
  // crudpad.hey('description too short ') <- something like this
  // then 

  crudpad.result(true, "ready to modify item (code field disabled)")
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
  tx = db.transaction(myStoreName , transreadwrite)   // I HATE " " PARAMETERS !!!!! MAIN SOURCE OF ELUSIVE ERRORS
  store = tx.objectStore(myStoreName)

  //save UPDATE 'put'
  let request = store.put(item)  // item key id automatic         // idb put ~ sql update 
  request.onerror = function(){
    yawn(()=>{
    crudpad.result(false, 'some error Updating')
    })
  }
  request.onsuccess = function(){
    yawn(()=>{
    crudpad.result(true, 'overwritn')
    })
  }
}

// -----------------------------------------------------------
// ---------------- implement REMOVE ------------- delete item
//
// DB - delete
function zDbRemove(){
  let item = myFrmRead()
  tx = db.transaction(myStoreName, transreadwrite)
  store = tx.objectStore(myStoreName)

  // kill
  let request = store.delete(item.id)
  request.onerror = function(){
    yawn(()=>{
    crudpad.result(false, 'coudnt delete')
    })
  }
  request.onsuccess = function(){
    yawn(()=>{
    crudpad.result(true, 'deleted'+ item.id)
    })
  }
}



// -------------------------------------------------------
// ---------------- implement SEARCH ---------------- 
//
function zSearch(what){  
  tx = db.transaction(myStoreName, transreadonly)
  store = tx.objectStore(myStoreName)

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
      yawn(()=>{
        crudpad.result(true, 'listo pa mirar y editar. I mean "READY"') // wwooooaa!! DOM ready? Not here too simple, but...
      })
    }
  }
}

// ----------------------------------------------------
// --------------implement NAV ---------------------------
//
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

// misc  related to html --------------------------------   
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


// debug --------------------------------------------------
function yawn(whatdoyouwant){  
  ;(DESPIOJANDO)? setTimeout(whatdoyouwant, yawning):  whatdoyouwant
}
function wtf(who, what, when, where){
//  if  (DESPIOJANDO){
//      console.log  
//  } 
}
 
