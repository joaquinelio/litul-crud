
/* 
  Lituls
  litul-crud  HTMLelement  (expected to be...)

  learning vanilla js, my first project

  by
  Joaquin Elio 'Lito' Fernandez
  
*/

/*
  whats the story?

  Clean keypad with optional buttons for 
    Search&show, Create, Update, Remove, db mov << < > >> , 
    OK, Cancel  
  
  It will show and enable-disable buttons depending on
    functions implemented:  db create, db update, ...  
    internal status, 1 of 4:  Idle, showing record, creating new record,  modifing existing record.  


  View behaviour is client js controlled,  critical ops stays on server
    so it should be fast and responsive, reducing delay problems to the actual server db operations 

  The dev user implements simple operations only (forget the onclick !)
    form operations:  clean the form, show a record, create a form for editing
    db operations:    select, insert, update, delete...     
    just that.  
 
  html, css, js, 
  class, events,  

*/

/*


  status, 1 of 4   
    panel status:   idle, showing, adding, modifying 
    special status: waiting server response


  Public methods ?

  Mandatory methods?

  Optional methods
  




  ya me estoy asustando It s scary
  

*/


class CrudPanel extends HTMLElement  {
  constructor(){
    super()   
  }




  get STATUS_LIST() {   // bits
    return {"ST_IDLE":1,"ST_SHOW":2,"ST_CREATE":4,"ST_MODIFY":8,}  // "ST_WAITINGSERVER":16 ?
  }
  get CB_RESULT_MSG_LIST(){ 
    return {"DB_CREATE_OK":1,                }
  }

  set _status(newStatus){

  }
  get _status(){
    return  // !!!!!!!!!!!!!!! WTF how do I do  let this.status ?
  }
  


}
