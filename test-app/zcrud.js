
/** FAKE crud playground          
                          with indexedDB fake no more. 
                          Truly async crud db  
                          Now it is Fake Cloud.
*/

'use strict'  // strict says. Dont make me laugh. I hate JS.

/*

  crudpad, callback based crud abstraction
  You write functions that do the things, you do not respond to onclicks nor take care of a crud menu 

  crudpad.cbResult()
  Inside every crudpad.form and crudpad.db operation, 
  you have to send crudpad.cbResult(true/false) to let the pad know the requested operation finished well or not.

  First, set behaviour 
      .setControl(),   
      .setCreate(), .setRead() .setUpdate(), .setDelete(), 
      .setNav(), .setCustomButtons()
  then  .start()
  then  go to sleep.



  MISC

  indexeddb async db as test db app 
  There is no error catch nor form fields control (I am ashamed)
  Just one simple object with 3 string properties in the store

  Optional Button labels parameter is textContent

  .MODE_LIST   used as param in custom buttons
  4 basic modes       IDLE SHOW MODIFY CREATE,
  2 composite modes   EDIT  (mod or create)  NOEDIT (idle or show), and  ALL 

  here I use search with .setRead(..., true) to show the search input box   
  You can use .setRead(..., false) and show your own search Form  instead,
  crudpad only cares .cbResult() 

  here I use same form to show and edit for ease.
  You can show a grid instead (maybe a keyrange) 
  and let the user move without the crudpad nav buttons, 
  but ONE and only one must be always selected, the one to be modified when frmEditMod fires. 

  Advance consideration.  How bad is it?
  Who owns the form?  
  When data needs to be shown, (from READ or NAV)
  the drawing is inside the "user waiting" status and CAN be aborted by boring him (bored button shows)
  ok, but what if the response finally arrives.
  So, what should Dev do?
  (a) the form should be drawn all at once after all the data is collected
      and after checking if it wont be overwriting user input (edit mode)   
        if (crudpad.mode & crudpad.MODE_LIST.EDIT)
      Do the check on READ or NAV, dont do the check when it is called from crudpad like form-erase()
  (b) set insane timeout so user never see the bored-button
  (c) Do nothing.  But: 
      if user aborts the search too early then starts to edit new data, 
      AND THEN the search finally arrives, 
      the user will loose the edited data, getting "unexpected search success" msg from cbresult().  
      Do you care? (you can still blame him, Dev's silver bullet)

*/


const DESPIOJANDO = true          
//const YAWNS = 10000             //test delay msec


// *********************************************** DB stuff *********************
//
// indexedDB globals:    **NAMES**         db, store, index
// let myDbName  = 'db1' 
// let myStoreName = 'store'
// let myKeyName = 'id'       

const myDb = {
  dbname  : 'db1' ,
  storeName : 'store',
  keyName : 'id',  
}

//
// indexedDB globals:    **THINGS**        db, store, transaction, index    
// let tx       // transaction   short life. 
// let store    // store         dies with tx.
let db          // global so I dont open every request.  db request are short life so maybe I dont need db either.   
//
// And just because I do HATE ' ' parameters.  
const transreadwrite = 'readwrite'
const transreadonly = 'readonly'
//
// *********************************************** DB stuff **********************




//crudpad elem
let crudpad 


//lets do
document.addEventListener('DOMContentLoaded', ()=>{

  // ******************** pad
  crudpad = document.getElementById('idmenu')


  // CB Construction. ------- some with optional params innerHTML: button label, confirm msg text           
  //                                                                   parameters----------------              
  crudpad.setCreate(zFrmCreate, zDbCreate,     )     // C              ()=>{} frm to edit new item,         ()=>{}db insert
  crudpad.setRead(zSearchAndShow,  true,         )   // R              ()=>{} db search(input) + show item, bool: show input text 
  crudpad.setUpdate(zFrmUpdate, zDbUpdate,        )  // U              ()=>{} frm to edit mod item,         ()=>{}db update
  crudpad.setDelete(zDbDelete,                 )     // D              ()=>{} db delete,                    optional confirm msg 
  crudpad.setNav(zDbFrst,zDbPrev,zDbNext,zDbLast)    // nav << < > >>  ()=>{} db movecursor + show item,    * 4
  crudpad.setExit(zExit, ) // "bye", "quit?",  )                                      
  crudpad.setFormControl( zFrmErase, zFrmBlock, zFrmEnableCreate, zFrmEnableUpdate )  // HIGHLY recomended, enhances behaviour
 
  crudpad.dbTimeout = 5000 // msec       time before bored abort button appears

  // optional custom buttons, examples for different views
  //                       id= name=      dflt='button_crud'
  //                       htmElemName,   initial class,  label,      modes where active,       title,               onclick        
  crudpad.addCustomButton('buttonXls',    undefined,      'custom1',  crudpad.MODE_LIST.SHOW,   'custom export',     ()=>{crudpad.hey('Only on show: example "export xls " ')})
  crudpad.addCustomButton('buttonCheck',  undefined,      'custom2',  crudpad.MODE_LIST.EDIT,   'custom some ',      ()=>{crudpad.hey('Only on edit: example "checking field')})
  crudpad.addCustomButton('buttonWhat',   undefined,      'custom3',  crudpad.MODE_LIST.IDLE,   'custom srch',       ()=>{crudpad.hey('Only on Empty: example "import from somewhere" ')   })
  crudpad.addCustomButton('buttonimport', undefined,      'custom4',  crudpad.MODE_LIST.NOEDIT, 'custom import&mod', ()=>{crudpad.hey('only on Empty or Show: example "import & modify" '); ; myFrmShow(makeItem('xlsCod','xlsDesc','xlssomething')); crudpad.pushCreate()  })


  //Optional translation   
  // crudpad.setText_bored(  )
  // crudpad.setText_confirm(  )
  // crudpad.setText_crud('Add', undefined, undefined, 'Kill', 'Really wanna kill it?')
  // crudpad.setText_exit(   )
  crudpad.setText_nav('◄◄','◄','►','►►')   //  textContent.  Careful: check proper font ◄ ►
  // crudpad.setText_okCancel(   )
   
  //Further customization
  // crudpad.customButtons.buttonXls.classList.remove('button_crud')  
  // crudpad.customButtons.buttonXls.innerHTML = '<svg height="20px" width="80px"><ellipse fill="red" cx="40px" cy="10px" rx="40px" ry="9px"/></svg>',  
  // crudpad.btRead.classList.remove('button_crud')  
  // crudpad.btRead.innerHTML =  '<svg height="20px" width="80px"><ellipse fill="red" cx="40px" cy="10px" rx="40px" ry="9px"/></svg>',  


  openMyDb()  // and stays open

  // START CRUDPAD
  crudpad.start()   // I could start() without the db ready, but maybe it is nice to check/create before showing the buttons
})


/*
************************************
** z Dev functions for CRUD & NAV **   HANDLERS !!   those that Dev has to make anyway, crudpad or not.
************************************
*/

// ------------------------------------------------------------------
// ----------- implement FormControl --- OPTIONAL but highly recomended -------- parameters: erase inputs, block inputs
//
// form - empty
function zFrmErase(){            //  erase all input elements. 
  myFrmShow(makeItem('','',''))  //  or you can hide them instead.  Fired when user cancels edition so it doesn't show dirty fields 
}
// form - block
function zFrmBlock(){           // disble all input elements.  Prevents user further input edition.
  myFrmBlock([true,true,true])  // disable the entire form would work too.  Intended to see inputs as readonly  
}
function zFrmEnableCreate(){
  myFrmBlock([false,false,false])
}
function zFrmEnableUpdate(){
  myFrmBlock([true,false,false])
}


// ----------------------------------------------------------------------------
// ---------------- implement CREATE ----------- optional ---------- adds new item to db
//
// Form - edit new item
function zFrmCreate(){
  myFrmShow(makeItem('','','somedefault'))            // clear all inputs...  may put some default... may autocalculate/fill id
  myFrmBlock([false,false,false])                 // enable all inputs

  // fields auto validation here
  // should put input restrictions, ranges, emptyness, etc.

  //should wait for dom ready then
  crudpad.cbResult(true, 'Ready to edit NEW item')                    // simulate a big delay to test boredness too

  // function leaves form able to be edited 
}
//
// DB - insert item
function zDbCreate(){     // create: new item in db, the C of crud, like 'sql insert' not 'sql create' 
 
  // data to be stored: item
  let item =  myFrmRead()    // read htm inputs  returns object item   
  
  // // check integrity here !!! 
  // if not valid 
  //    x.cbResult(false, 'didnt pass because...') 
  //    return 
  if (item.id == '') {
     crudpad.cbResult(false, 'Poné algo, che amarroco...') 
     return 
  } 
  
  // indexdb stuff
  let tx = db.transaction(myDb.storeName, transreadwrite)    
  let store = tx.objectStore(myDb.storeName)     

  //save new 'add'
  let request = store.add(item)  // item key id automatic    // idb add ~ sql insert  // 
  request.onerror = function(e){
    yawn(()=>{
      crudpad.cbResult(false, 'err Creating: ' + e.srcElement.error   )
    })    
  }
  request.onsuccess = function(){
    yawn(()=>{
      crudpad.cbResult(true, 'saved new item: '+ item.id)
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
  // some input checks restrictions like
  // crudpad.hey('description too short ') <- something like this
  // then 

  crudpad.cbResult(true, "ready to modify item (code field disabled)")
}
// DB - update
function zDbUpdate(){

  // 1st, data to be stored
  let item = myFrmRead()       // read htm inputs  returns object item

  //should check before any attempt 
  // if not valid 
  //    crudpad.cbResult(false, 'didnt pass')   bla bla.  DONT FORGET cbResult()
  //    return


  // indexedDb stuff
  let tx = db.transaction(myDb.storeName , transreadwrite)   
  let store = tx.objectStore(myDb.storeName)

  //save UPDATE 'put'
  let request = store.put(item)                 // idb put ~ sql update 
  request.onerror = function(){
    yawn(()=>{
      crudpad.cbResult(false, 'some error Updating')
    })
  }
  request.onsuccess = function(){
    yawn(()=>{
      crudpad.cbResult(true, 'overwritn')
    })
  }
}


// ---------------------------------------------------------------------------------
// ---------------- implement DELETE ------------- optional ----------- delete item
//
// DB - delete
function zDbDelete(){

  let item = myFrmRead()    // read htm inputs  returns object item

  // indexexDb stuff
  let tx = db.transaction(myDb.storeName, transreadwrite)
  let store = tx.objectStore(myDb.storeName)

  // 
  let request = store.delete(item.id)
  request.onerror = function(){
    yawn(()=>{
      crudpad.cbResult(false, 'couldnt delete who knows why')
    })
  }
  request.onsuccess = function(){
    yawn(()=>{
      crudpad.cbResult(true, 'deleted '+ item.id)
    })
  }
}


// --------------------------------------------------------------------------
// ---------------- implement READ ---------------- optional ----------------
//
function zSearchAndShow(what){  

  let tx = db.transaction(myDb.storeName, transreadonly)
  let store = tx.objectStore(myDb.storeName)

  let request = store.get(what) // odd
  request.onerror = function(){
    crudpad.cbResult(false, ' error searching ')  // oops I forgot to yawn
  }
  request.onsuccess = function(){
    let item = request.result
                                                  // oops yawns should be here
    if (item == undefined){
      crudpad.cbResult(false, 'not found')
    } else {
      yawn(()=>{

        //check if edit: user aborted waiting and started to edit...
        if (crudpad.mode & crudpad.MODE_LIST.EDIT) {
          crudpad.hey( " I got data from search to show you but you are already editing...")
          return
        }

        myFrmShow (item)
        crudpad.cbResult(true, 'Ready') // wwooooaa!! DOM ready? Not here too simple, but...
      })
    }
  }
}

// ----------------------------------------------------------------------------
// --------------implement Exit -------------------------- optional --------------
//
function zExit(){
  shyAlert ("Here some stuff like closing db or hide form... ")
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

  let tx = db.transaction(myDb.storeName, transreadonly)
  let store = tx.objectStore(myDb.storeName)
  
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
        req = store.openCursor(IDBKeyRange.lowerBound(''), 'prev')  // last
      }
      break
    case '<':
      if (crudpad.mode == crudpad.MODE_LIST.SHOW){    //valid data ?
        id = myFrmRead().id
        req = store.openCursor(IDBKeyRange.upperBound(id, true), "prev" ) // prev
      } else {
        req = store.openCursor(IDBKeyRange.lowerBound(''))  // first
      }
      break
    case '>>': 
      req = store.openCursor(IDBKeyRange.lowerBound(''), 'prev')
      break
    default:
      wtf('no more options _dbmov')  // 4 options, cannot happen.  
      break    
  }

  req.onsuccess = ()=>{
    cursor = req.result 
    if (cursor){
      item = cursor.value

      //check if edit: user aborted waiting and started to edit...
      if (crudpad.mode & crudpad.MODE_LIST.EDIT) {
        crudpad.hey( " I got data from search (nav) to show you but you are already editing...")
        return
      }

      myFrmShow(item)
      crudpad.cbResult(true, 'something found')
    } else {
      crudpad.cbResult(true, ' Not found')  // why true? Cheat. Because it keeps the older data in form untouched. 
    } 
  }
  req.onerror = (err)=>{
    wtf(err)
    crudpad.cbResult(false, err)  
  }  
}


// ---------------- CRUD form - no crudpad related functions -----------------------------

//object item  to store-retrieve
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

function ask4db1time(){
  //read db window

  myDb.dbName = 'dbbame'      //  document.getElementById('dbbame').value
  myDb.storeName = 'dbstore'  //  document.getElementById('dbstore').value
  myDb.keyname = 'dbkey'      //  document.getElementById('dbkey').value
}

function shyAlert(whatnow){
  let old = document.getElementById('status').textContent
  document.getElementById('status').textContent = whatnow + '\n' + old
}

// open / create db ------------------------------------------------------------------ 


function openMyDb(){      
  let request = indexedDB.open(myDb.dbName, 1)
  request.onupgradeneeded = function(event){    // version 1, create db, create store  
    db = request.result
    try{
      db.createObjectStore( myDb.storeName, {keyPath: myDb.keyName} )     //SYNC? should catch     
    } catch(e) {
      shyAlert ("err" + e)
    }
    shyAlert ('upgradeneeded found')
  }
  request.onerror = function(e){
    ddd(e)
    shyAlert ("open / request.onerror --> " +  e.srcElement.error ) 
  }
  request.onsuccess = function(event){
    db = request.result
    shyAlert("db ok")
  }
}

function ddd(e){
  "mmm"
}

// debug ---------------------------------------------------------------------
function yawn(whatdoyouwant){  
  let yawns = document.getElementById("fakeclouddelay").value * 1000
  ;(DESPIOJANDO)? setTimeout(whatdoyouwant, yawns):  whatdoyouwant()
}
function wtf(what){
 if  (DESPIOJANDO){
  shyAlert (what)
    console.log(  what)
  } 
}
 
// trash ************************************************************************
// just flush
//