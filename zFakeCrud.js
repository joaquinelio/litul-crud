/** FAKE crud playground          
                          with indexedDB fake no more... 
                          truly async crud db  
                          fake cloud is now.
*/

'use strict'  // strict says. Dont make me laugh. I hate JS.

/*

  crudpad abstraction
  You write functions that do the things, yo do not respond to onclicks nor take care of a crud menu 

  crudpad.sendResult()
  Inside every crudpad.form and crudpad.db operation, 
  you have to send crudpad.sendResult(true/false) to let the pad know the requested operation finished well (or not)

  First, set behaviour .setControl(),  optionals .setCreate(), .setUpdate(), .setDelete(), .setNav(), .setCustomButtons()
  then  .start()
  then  go to sleep.



  MISC

  indexeddb async db, as test db app 
  There is no error catch nor form fields control (I am ashamed)
  Just one simple object with 3 string properties in the store

  Optional Button labels parameter is textContent

  basic modes       IDLE SHOW MODIFY CREATE
  composite modes   EDIT  (mod or create)  NOEDIT (idle or show) and  ALL 
  useful as param in custom buttons

  here I use search with .setRead(..., true) to show the search input box   
  You can use .setRead(..., false) and show an Advanced Search Form  instead.

  here I use same form to show and edit for ease.
  It can show a grid instead and let the user move without the crudpad nav buttons, 
  but only ONE must be always selected, the one to be modified when frmEditMod fires. 

*/


const DESPIOJANDO = true      //debugging
const yawns = 10000            //test delay msec


// *********************************************** DB stuff *********************
//
// indexedDB globals:    **NAMES**         db,store, index
const myDbName  = 'fakedb0' 
const myStoreName = 'fakestore'
const myKeyName = 'id'       

// indexedDB globals:    **THINGS**        db, store, transaction, index    
// let tx       // transaction   short life 
// let store    // store         dies with tx
let db          // global so I dont open every request.  Short life db request are intended Maybe I dont need db either.   

// And just because I do HATE ' ' parameters.  Wherever they are. vulnerable. easily hidden typos. 
const transreadwrite = 'readwrite'
const transreadonly = 'readonly'
//
// *********************************************** DB stuff **********************


//crudpad
let crudpad 


//lets do
document.addEventListener('DOMContentLoaded', ()=>{

  // ******************** pad
  crudpad = document.getElementById('idmenu')


  //                                                                    parameters----------------   some, optional params button label, confirm text                    
  // mandatory  set
  crudpad.setFormControl(zFrmEmpty, zFrmBlock) //                       ()=>{} form erase inputs,           ()=>{} form block all inputs   
  
  // optional set                                                          
  crudpad.setCreate(zFrmCreate, zDbCreate, 'Add')     // C              ()=>{} frm to edit new item,         ()=>{}db insert
  crudpad.setRead(zSearchAndShow,  true, 'LookFor')   // R              ()=>{} db search(input) + show item, bool  true:show input text 
  crudpad.setUpdate(zFrmUpdate, zDbUpdate, 'Change')  // U              ()=>{} frm to edit mod item,         ()=>{}db update
  crudpad.setDelete(zDbDelete, 'Del', 'Kill it?')     // D              ()=>{} db delete
  crudpad.setNav(zDbFrst,zDbPrev,zDbNext,zDbLast)     // nav << < > >>  ()=>{} db movecursor + show item,   *4
                                        
  crudpad.dbTimeout = 5000 // msec

  // optional custom buttons, examples for different views
  //                       htmlElemname,  initial class,   innertext,  modes when is active,   title,           onclick        
  crudpad.addCustomButton('buttonXls',   'custom-button', 'to XLS',    crudpad.MODE_LIST.SHOW, 'custom export', ()=>{crudpad.hey('Only show: example "to xls "')})
  crudpad.addCustomButton('buttonCheck', 'custom-button', 'lets..',    crudpad.MODE_LIST.EDIT, 'custom some ',  ()=>{crudpad.hey('Only edit, example "checking field')})
  crudpad.addCustomButton('buttonWhat',  'custom-button', 'ReSearch',  crudpad.MODE_LIST.IDLE, 'custom srch',   ()=>{crudpad.hey('Only Empty: example a special search ')})

  
  openMyDb()

  // START CRUDPAD
  crudpad.start()   // I could start() without the db ready, but maybe it is nice to check/create before showing the buttons

})


/*
************************************
** z Dev functions for CRUD & NAV **  used as crud panel parameters. 
************************************
*/

// ------------------------------------------------------------------
// ----------- implement FormControl ---mandatory--- -------- parameters: erase inputs, block inputs
//
// form - empty
function zFrmEmpty(){             // erase all input elements. 
  myFrmShow(makeItem('','',''))  //  or you can hide them.  Fired when user cancels edition so it doesn't show dirty fields 
}
// form - block
function zFrmBlock(){           // disble all input elements.  Prevents user further input edition.
  myFrmBlock([true,true,true])  // disable the entire form would work too.  Intended to see inputs as readonly  
}

// ----------------------------------------------------------------------------
// ---------------- implement CREATE ----------- optional ---------- new item to db
//
// Form - edit new item
function zFrmCreate(){
  myFrmShow(makeItem('','',''))            // clear all inputs...  may put some default... may autocalculate/fill id
  myFrmBlock([false,false,false])                 // enable all inputs

  // fields validation!
  // should put input restrictions, ranges, emptyness, etc.

  crudpad.sendResult(true, 'Ready to edit NEW item')                    //should wait for dom ready? , better yet simulate a big delay to test boredness
  // function leaves form able to be edited 
}
//
// DB - insert item
function zDbCreate(){     // create: new item in db, the C of crud, like 'sql insert' not 'sql create' 
 
  // data to be stored: item
  let item =   myFrmRead()    // read inputs returns  object item   
  
  // // check integrity here !!! 
  // if not valid 
  //    x.sendResult(false, 'didnt pass because...') 
  //    return 
  if (item.id == '') {
     crudpad.sendResult(false, 'Poné algo, che amarroco...') 
     return 
  } 
  
  // indexdb stuff
  let tx = db.transaction(myStoreName, transreadwrite)    
  let store = tx.objectStore(myStoreName)     

  //save
  let request = store.add(item)  // item key id automatic    // idb add ~ sql insert  // 
  request.onerror = function(e){
    yawn(()=>{
      crudpad.sendResult(false, 'err Creating: ' + e.srcElement.error   )
    })    
  }
  request.onsuccess = function(){
    yawn(()=>{
      crudpad.sendResult(true, 'saved new item: '+ item.id)
    })
  }
}

// --------------------------------------------------------------------------------------
// ---------------- implement UPDATE ------------ optional --------- modify item ---------
//
// Form - edit modify
function zFrmUpdate(){
  myFrmBlock([true, false, false])            // enable all inputs BUT code field

  // unattended checks   form validation!!
  // some input checks restrictions then
  // crudpad.hey('description too short ') <- something like this
  // then 

  crudpad.sendResult(true, "ready to modify item (code field disabled)")
}
// DB - update
function zDbUpdate(){

  // 1st, data to be stored
  let item = myFrmRead()   

  //should check before any attempt 
  // if not valid 
  //    crudpad.sendResult(false, 'didnt pass') bla bla
  //    return 

  let tx = db.transaction(myStoreName , transreadwrite)   
  let store = tx.objectStore(myStoreName)

  //save UPDATE 'put'
  let request = store.put(item)                 // idb put ~ sql update 
  request.onerror = function(){
    yawn(()=>{
      crudpad.sendResult(false, 'some error Updating')
    })
  }
  request.onsuccess = function(){
    yawn(()=>{
      crudpad.sendResult(true, 'overwritn')
    })
  }
}


// ---------------------------------------------------------------------------------
// ---------------- implement DELETE ------------- optional ----------- delete item
//
// DB - delete
function zDbDelete(){
  let item = myFrmRead()
  let tx = db.transaction(myStoreName, transreadwrite)
  let store = tx.objectStore(myStoreName)

  // 
  let request = store.delete(item.id)
  request.onerror = function(){
    yawn(()=>{
      crudpad.sendResult(false, 'couldnt delete who knows why')
    })
  }
  request.onsuccess = function(){
    yawn(()=>{
      crudpad.sendResult(true, 'deleted'+ item.id)
    })
  }
}


// --------------------------------------------------------------------------
// ---------------- implement READ ---------------- optional ----------------
//
function zSearchAndShow(what){  

  let tx = db.transaction(myStoreName, transreadonly)
  let store = tx.objectStore(myStoreName)

  let request = store.get(what) // odd
  request.onerror = function(){
    crudpad.sendResult(false, ' error searching ')
  }
  request.onsuccess = function(){
    let item = request.result
    if (item == undefined){
      crudpad.sendResult(false, 'not found')
    } else {
      yawn(()=>{
        myFrmShow (item)
        crudpad.sendResult(true, 'Ready') // wwooooaa!! DOM ready? Not here too simple, but...
      })
    }
  }
}

// ----------------------------------------------------------------------------
// --------------implement NAV --------------------------- optional --------------
//
// DB - nav showFirst
function zDbFrst(){zDbMov('<<')}  // I know... I said I hate buggy '' params.  But js dowsn't help.  I hate js.
// DB - nav showPrev
function zDbPrev(){zDbMov('<')}
// DB - nav showNext
function zDbNext(){zDbMov('>')}
// DB - nav showLast
function zDbLast(){zDbMov('>>')}
// DB - nav   
function zDbMov(mov){

  let tx = db.transaction(myStoreName, transreadonly)
  let store = tx.objectStore(myStoreName)
  
  let req
  let cursor
  let item
  let id

  switch (mov) {
    case '<<':  
      req = store.openCursor(IDBKeyRange.lowerBound(''))
      break
    case '>':
      if (crudpad.mode == crudpad.MODE_LIST.SHOW){      // valid data?
        id = myFrmRead().id
        req = store.openCursor(IDBKeyRange.lowerBound(id, true))  // next
      } else{
        req = store.openCursor(IDBKeyRange.lowerBound(''),'prev')  // last
      }
      break
    case '<':
      if (crudpad.mode == crudpad.MODE_LIST.SHOW){    //valid data ?
        id = myFrmRead().id
        req = store.openCursor(IDBKeyRange.upperBound(id, true),"prev" ) // prev
      } else {
        req = store.openCursor(IDBKeyRange.lowerBound(''))  // first
      }
      break
    case '>>': 
      req = store.openCursor(IDBKeyRange.lowerBound(''),'prev')
      break
    default:
      wtf('no more options _dbmov')
      break    
  }

  req.onsuccess = ()=>{
    cursor = req.result 
    if (cursor){
      item = cursor.value
      myFrmShow(item)
      crudpad.sendResult(true, 'something found')
    } else {
      crudpad.sendResult(true, ' Not found')  // why true? Cheat. Because it keeps the older data in form untouched. 
    } 
  }
  req.onerror = (err)=>{
    wtf(err)
    crudpad.sendResult(false, err)  
  }  
}


// ---------------- CRUD form - no crudpad related functions -----------------------------

//first, item  to store-retrieve
//return item 
function makeItem(a,b,c){
  return {id:a, description:b, price:c}
}

// misc  related to html --------------------------------   
// FRM - shows an item
function myFrmShow(item){  
  document.getElementById("i1").value = item.id
  document.getElementById("i2").value = item.description
  document.getElementById("i3").value = item.price
}
// FRM - read form Inputs, return item 
function myFrmRead(){
  return makeItem(
    document.getElementById("i1").value,
    document.getElementById("i2").value,
    document.getElementById("i3").value,
  )
}
// FRM - input control  / block individual inputs
function myFrmBlock(arrayDisabled){
  document.getElementById("i1").disabled = arrayDisabled[0]
  document.getElementById("i2").disabled = arrayDisabled[1]
  document.getElementById("i3").disabled = arrayDisabled[2]
}



// open / create db ------------------------------------------------------------------ 
function openMyDb(){      
  let request = indexedDB.open(myDbName, 1)
  request.onupgradeneeded = function(event){    // version 1, create db, create store  
    db = request.result
    db.createObjectStore( myStoreName, {keyPath: myKeyName} )     //SYNC? should catch     
  }
  request.onerror = function(e){
    alert (e.srcElement.error ) // I really should learn err mng...
  }
  request.onsuccess = function(event){
    db = request.result
  }
}


// debug ---------------------------------------------------------------------
function yawn(whatdoyouwant){  
  ;(DESPIOJANDO)? setTimeout(whatdoyouwant, yawns):  whatdoyouwant()
}
function wtf(what){
 if  (DESPIOJANDO){
   alert (what)
    console.log(  what)
  } 
}
 
// trash ************************************************************************
// just flush
//