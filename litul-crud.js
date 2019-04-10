
/* 
  Lituls
  litul-crud  HTMLelement  (expected to be...)

  learning vanilla js, first project

  by
  Joaquin Elio 'Lito'
  
*/

/*
  whats the story?

  Clean keypad with optional buttons for 
    Search/show, Create, Update, Remove, db mov << < > >> , 
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
   
    to define: 
    via events to listen, like an interface?  Still dont know how to  
    via function parameters?  sounds dirty but js devs are very familiar with them

    Maybe:
    create custom buttons (onclick will be all yours) able to respond to the panel status  
    (i.e.  Export to xxx, only enabled when "showing" status; "paste from" only in "creating" and "modifying" )  


  html, css, js, 
  class, events,  

*/

/*


  status, 1 of 4   
    panel status:   idle, showing, adding, modifing 
    special status: waiting server response


  Public methods ?

  Mandatory methods?

  Optional methods
  




  ya me estoy asustando
  

*/


class LitoCrudPanel extends HTMLElement  {
  constructor(){
    

  }

}
