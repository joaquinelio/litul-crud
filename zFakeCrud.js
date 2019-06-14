/** FAKE crud playground          
                          with indexedDB fake no more
*/

'use strict'  // strict says. Dont make me laugh. I hate JS.


/*
  You write functions that do the things, yo do not respond to onclicks.

  crudpad.resultOk()
  It is not a get method.  It informs the pad the requested operation success    
  After every crudpad.form and crudpad.db operation, 
  you have to send crudpad.resultOk(true/false) to let it know the requested operation finished well (or not)

  here I use same form to show and edit for ease.
  It can show a grid instead,  and let the user move without the crudpad nav buttons, 
  but only ONE must be always selected, the one to be modified when frmEditMod fires. 

  here I use search with .setRead(..., true) to show the search input box   
  You can use .setRead(..., false) and show an Advanced Search Form  instead.

  mode_list works as masks, binary sum of bit flags.  
  The parameter if more than one is needed is not an OR ' || ' but a sum ' + ' 
    crudpad.MODE_LIST.SHOW + crudpad.MODE_LIST.IDLE

  You  enable (un-disable?) apropiate inputs in CREATE and MODIFY modes inside respective funFrmEditxxxx functions.
  When crudpad enters in a non-edit mode it calls FrmDisableForm to block the inputs.

  indexeddb is tricky, 
  I had to hack browser (just settings), it doesnt ask the user as documentation says.  
  shoud I go fire.

*/

// delay test
const DESPIOJANDO = true      //debugging
const yawns = 5000        

// *********************************************** DB stuff *********************
//
// indexedDB globals:    NAMES   db,store, index
const myDbName  = 'fakedb3' 
const myStoreName = 'fakestore'
const myKeyName = 'id'          
//
// indexedDB globals:    THINGS   db, store, transaction, index       can be locals?
let db        // db   
//let store     // store
//let tx        // transaction   
//let index     // let s see...//   didnt use
//
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
  crudpad.setCreate(zFrmCreate, zDbCreate, ) // C                 {}frm to edit new item,         {}db insert
  crudpad.setRead(zSearchAndShow,  true, )   // R                 {}db search(input) + show item, bool  true:show input text 
  crudpad.setUpdate(zFrmUpdate, zDbUpdate, ) // U                 {}frm to edit mod item,         {}db update
  crudpad.setDelete(zDbDelete, )             // D                 {}db delete
  // crudpad.setNav(                            // nav << < > >>     {}db movecursor + show item, *4
  //   zDbMovFirst,
  //   zDbMovPrev, 
  //   zDbMovNext, 
  //   zDbMovLast, 
  // )                                           

  // optional custom buttons, examples for different views
  //                       htmlElemname,  initial class,   innertext,   modes where is active,   title,          onclick        
  crudpad.addCustomButton('buttonXls',   'custom-button', 'to XLS',     crudpad.MODE_LIST.SHOW, 'custom export', function(){crudpad.hey('I pressed "to xls"')})
  crudpad.addCustomButton('buttonCheck', 'custom-button', 'let me...',  crudpad.MODE_LIST.EDIT, 'custom some ',  function(){crudpad.hey('I am checking something')})
  crudpad.addCustomButton('buttonWhat',  'custom-button', 'Search2',    crudpad.MODE_LIST.IDLE, 'custom srch',   function(){crudpad.hey('I do special search ')})



  // ******************** DB open/create *********************************
  let request = indexedDB.open(myDbName, 1)
  request.onupgradeneeded = function(event){    // version 1, create db, create store  
    //db = request.result
    //store = 
    db.createObjectStore( myStoreName, {keyPath: myKeyName} )     //SYNC? should catch     
  }
  request.onerror = function(e){
    alert (e.srcElement.error ) // I should learn err mng...
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
function zFrmBlock(){           // disble all input elements.  Prevents user further input edition.
  myFrmBlock([true,true,true])  // disable the entire form would work too.  Intended to set readonly inputs 
}

// -------------------------------------------------------------
// ---------------- implement CREATE ----------- new item to db
//
// Form - edit new item
function zFrmCreate(){
  myFrmShow(makeItem('','default',''))            // clear all inputs...  may put some default... may autocalculate/fill id
  myFrmBlock([false,false,false])                 // enable all inputs

  // form validation!
  // should put input restrictions, ranges, emptyness, etc.

  crudpad.resultOk(true, 'Ready to edit NEW item')                    //should wait for dom ready? , better yet simulate a big delay to test boredness
  // function leaves form able to be edited 
}
//
// DB - insert item
function zDbCreate(){     // create: new item in db, the C of crud, like 'sql insert' not 'sql create' 
 
  // data to be stored
  let item =   myFrmRead()    // read inputs returns  object item   
  
  // // check integrity here !!! 
  // if not valid 
  //    x.resultOk(false, 'didnt pass because...') 
  //    return 
  
  // indexdb stuff
  let tx = db.transaction(myStoreName, transreadwrite)    
  let store = tx.objectStore(myStoreName)     //wtf is not ready? async?

  //save
  let request = store.add(item)  // item key id automatic    // idb add ~ sql insert  // 
  request.onerror = function(e){
    yawn(()=>{
      crudpad.resultOk(false, 'err Creating: ' + e.srcElement.error   )
    })    
  }
  request.onsuccess = function(){
    yawn(()=>{
      crudpad.resultOk(true, 'saved new item: '+ item.id)
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

  crudpad.resultOk(true, "ready to modify item (code field disabled)")
}
// DB - update
function zDbUpdate(){

  // 1st, data to be stored
  let item =   myFrmRead()   

  //should check before any attempt 
  // if not valid 
  //    crudpad.resultOk(false, 'didnt pass') bla bla
  //    return 

  //db.transaction('myDb', 'readwrite')   // I HATE " " PARAMETERS !!!!! MAIN SOURCE OF ELUSIVE ERRORS
  let tx = db.transaction(myStoreName , transreadwrite)   // I HATE " " PARAMETERS !!!!! MAIN SOURCE OF ELUSIVE ERRORS
  let store = tx.objectStore(myStoreName)

  //save UPDATE 'put'
  let request = store.put(item)  // item key id automatic         // idb put ~ sql update 
  request.onerror = function(){
    yawn(()=>{
      crudpad.resultOk(false, 'some error Updating')
    })
  }
  request.onsuccess = function(){
    yawn(()=>{
      crudpad.resultOk(true, 'overwritn')
    })
  }
}

// -----------------------------------------------------------
// ---------------- implement REMOVE ------------- delete item
//
// DB - delete
function zDbDelete(){
  let item = myFrmRead()
  let tx = db.transaction(myStoreName, transreadwrite)
  let store = tx.objectStore(myStoreName)

  // kill
  let request = store.delete(item.id)
  request.onerror = function(){
    yawn(()=>{
      crudpad.resultOk(false, 'coudnt delete')
    })
  }
  request.onsuccess = function(){
    yawn(()=>{
      crudpad.resultOk(true, 'deleted'+ item.id)
    })
  }
}



// -------------------------------------------------------
// ---------------- implement SEARCH ---------------- 
//
function zSearchAndShow(what){  
  let tx = db.transaction(myStoreName, transreadonly)
  let store = tx.objectStore(myStoreName)

  let request = store.get(what) // odd
  request.onerror = function(){
    crudpad.resultOk(false, ' error searching ')
  }
  request.onsuccess = function(){
    let item = request.result
    if (item == undefined){
      crudpad.resultOk(false, 'not found')
    } else {
      myFrmShow (item)
      yawn(()=>{
        crudpad.resultOk(true, 'Ready') // wwooooaa!! DOM ready? Not here too simple, but...
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
  ;(DESPIOJANDO)? setTimeout(whatdoyouwant, yawns):  whatdoyouwant
}
function wtf(who, what, when, where){
//  if  (DESPIOJANDO){
//      console.log  
//  } 
}
 
