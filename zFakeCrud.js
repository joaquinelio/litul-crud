/* FAKE crud playground
*/


// 
document.addEventListener('DOMContentLoaded', main);


function main(){

  // here init crud menu  


  //  let fakeDB = window.localStorage



  








  // what if...  here inside the function 
  // zFrmEmpty = function(){myFrmShow(['','',''])}  // clear the form
  // zFrmBlock = function(){}                       // etc
  // ?? Any difference ? Just have to move to the begining to ensure execution...
  // No reason.
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
function zDbCreate(database, adata){
  //fakeDB.push(  myFrmRead() )
  //fakeCB(fakeSQLInsertOK)
  //database.setItem(adata[0], adata[1]+','+adata[2])  // truchíssimo sorry... sync!
  //fake async callback:
  //kk.result()

}

// ---------------------------------------
// implement UPDATE
// Form - edit modify
function zFrmUpdate(){

  myFrmBlock([true,false,false])  // enable all inputs but code 
}
// DB - update
function zDbUpdate(){

}

// ---------------------------------------
// implement REMOVE
// DB - delete
function zDbRemove(){

}



// ---------------------------------------
// implement SEARCH 


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
function myFrmShow(arrayData){
  document.getElementById("i1").value = arrayData[0]
  document.getElementById("i2").value = arrayData[1]
  document.getElementById("i3").value = arrayData[2]
}
// FRM - read Inputs
function myFrmRead(){
  let arrayData = []
  arrayData[0] = document.getElementById("i1").value
  arrayData[1] = document.getElementById("i2").value
  arrayData[2] = document.getElementById("i3").value
  return arrayData
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
//   setInterval(( ) => {
    
//   }, interval);
//   return true
// }