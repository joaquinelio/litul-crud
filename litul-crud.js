
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

    // enums
    get ST_LIST() {   // flag bits 
      return {"IDLE":1,"SHOW":2,"CREATE":4,"MODIFY":8,}  // "ST_WAITINGSERVER":16 ?
    }
    get CB_RESULT_MSG_LIST(){ // do I really need this? 
      return {"DB_CREATE_OK":1,                }
    }

    set _status(newStatus){   // internal, dev dont need to see this

    }
    get _status(){
      return  // !!!!!!!!!!!!!!! WTF how do I do  let this.status ?  ALL INSIDE CONSTRUCTOR??????
    }

    this.status = ST_LIST.IDLE   //  ????????????????





  }
 
//mandatory:  (the others are optional)
implementFormControl(funcEraseForm, funcBlockForm, ){     // this.func() ??? Is it needed to be exposed? 
  this._funcEraseForm = funcEraseForm   
  this._funcBlockForm = funcBlockForm
}

// These 5 methods implement bahaviour and they all are optional.
implementCreate(funcCreateFormEditNew, funcCreateDbInsert, txtButtonName = 'New', ){

}
implementUpdate(funcUpdateFormEditModify, funcUpdateDbUpdate, txtButtonName = 'Modify',){

}
implementRemove(funcRemoveDbDelete, txtButtonName = 'Delete', ){

}
implementSearch(funcSearchAndShow, bolInputBox, txtButtonName = 'Search',){

}
implementNav(funcNavMoveFirst, funcNavMovePrev,funcNavMoveNext, funcNavMoveLast, arrayButtonNames = ['<<','<','>','>>']){

}
operationResult(op_msg){

}
setAllButtonsInnerHTML (txtButtonOk, txtButtonCancel, ... ){

}




_letsMakeButtonPanel(){ 

  // to do 
  // all funXXX()  look 4 final function names
  // all divs, classname for css
  // this ????      context ??? this._MekeButton() ????  isFun() ????

  // names, names, names   
  //      buttonX?  butX?  btX?  cmdX?,    where, functions? DOM?    cmd for DOM reminds me VB6... looks good
  //      panel? menu? pad? 


  // this is still a FRAME code , close to final I hope

  /*

  2 groups:  1 search, crud, ok/canc, custom     2 nav, status, exit 
  some div replaced by fieldset cause its useful "enabled"

    MAIN                  div
      div1                  div?        1st group
        divSearch             div? fieldset?
          butSearch             button
          inpSearch             input   text  
        divCrud               div? fieldset? it can be ENABLED
          butNew                button
          butMod                button
          butDel                button
        divCustom
          ()
        divOkCancel
          butOk                 button
          butCancel             button
      div2              div         << < > >> status exit
        divMov
          butFirst
          butPrev
          butNext
          butLast
        divMsg                
          pMsg
        divExit
          butExit
*/

  // MAIN- 
  //
  this.divMain = document.createElement("div") 
  this.divMain.className  ="div_main"

  //  MAIN-div1  ----------- busc, abm, usuario, ok/cancel --------------
  //
  this.div1 = document.createElement("div")        
  this.div1.className = "div_1" 

  // MAIN-div1-divSearch
  //
  if (esFun( this.funSearch) ){        ///  LOOK FOR FINAL NAME OF FUNCTION!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    this.divSearch = document.createElement( "fieldset") 
    this.btSearch = this._MakeButton(this.divSearch, "cmdSearch", ____butSearch_NamefromImplement  )  // "search"  or what
    {let tt = this; this.botSearch.onclick = function(){ tt._btSearch()} } // me cago en el yavascrít
  
    if ( ___inputtextnameFromImplement ){   // with input text? 
      this.inpSearch = document.createElement("input") 
      this.divSearch.appendChild(this.inpSearch) 
    }
  this.div1.appendChild(this.divSearch) 
  }

  //MAIN-div1-divCrud
  if(esFun(this.funDbAlta) || esFun(this.funDbModi) || esFun(this.funDbBaja)  ){
  this.divCrud = document.createElement("div") 
  this.divCrud.className = "div_crud" 
  //new
  if (esFun(this.funDbAlta) && esFun(this.funFrmEditAlta) ) {  // func from implement new
    this.botNew = this._makeButton(this.divCrud, "cmdNew", "New or what from implement......... ")  //t._btAlta) // userbtalta) // this._btAlta) 
    {let tt = this; this.botAlta.onclick = function(){ tt._btAlta()} } // me cago en el yavascrít
  }
  //mod
  if ( esFun(this.funDbModi) && esFun(this.funFrmEditModi)  ) {  // from implement mod
    this.botModi = this._crearBoton(this.divABM,"cmdModi","Modifica",this._btModi) 
    {let tt = this; this.botModi.onclick = function(){ tt._btModi()} } // me cago en el yavascrít
  }
  //del
  if ( esFun(this.funDbDel) ) {
    this.botBaja = this._MakeButton(this.divABM, "cmdDel", "DELETE remove kill ___nameDELFromimplementdelete")   
    {let tt = this; this.botDel.onclick = function(){ tt._btDel()} } // me cago en el yavascrít
  }
  this.div1.appendChild(this.divCrud) 
  }

  //divCustom      user but? je-je
  if( this.customButton.length > 0 ){
    this.divCustom = document.createElement("div") 
    this.divCustom.className = "div_custom" 
    //  
    for(let bo of this.customButton){
      this.divCustom.appendChild(bo)    
    }
    this.div1.appendChild(this.divCustom) 
  }

  //divOkCancel
  if( esFun(this.funFrmEditAlta) || esFun(this.funFrmEditModi)){   // new or mod implemented
    this.divOkCancel = document.createElement("div") 
    this.divOkCancel.className = "div_okcancel" 
    this.botOK = this._makeButton(this.divOkCancel, "cmdOK",  "Ok ********************" ) 
    this.botCancel = this._makeButton(this.divOkCancel, "cmdCancel","Cancel **********" ) 
    {let tt = this; this.botOK.onclick = function(){ tt._btOK()} } // me cago en el yavascrít
    {let tt = this; this.botCancel.onclick = function(){ tt._btCancel()} } // me cago en el yavascrít
    this.div1.appendChild(this.divOkCancel) 
  }

  // div2     group 2 -------  2da linea,  nav, msg, salir ------------
  this.div2 =document.createElement("div") 
  this.div2.className = "div_2" 
  //divMov
  if(esFun(this.funMoveFirst) || esFun(this.funMoveLast) || esFun(this.funMoveNext) || esFun(this.funMovePrev)){
    this.divMov = document.createElement("div") 
    this.divMov.className = "div_mov" 
    //movFirst
    if (esFun(this.funMoveFirst)){
      this.botMoveFirst = this._makeButton(this.divMov, "cmdMovFirst", "<< ************") 
      {let tt = this; this.botMoveFirst.onclick = function(){ tt._btMovFirst()} } // me cago en el yavascrít
    }
    //movPrev
    if (esFun(this.funMovePrev)){
      this.botMovePrev = this._makeButton(this.divMov, "cmdMovPrev", "< *********"  ) 
      {let tt = this; this.botMovePrev.onclick = function(){ tt._btMovPrev()} } // me cago en el yavascrít
    }
    //movNext
    if (esFun(this.funMoveNext)){
      this.botMoveNext = this._makeButton(this.divMov, "cmdMovNext", "> *****"  ) 
      {let tt = this; this.botMoveNext.onclick = function(){ tt._btMovNext()} } // me cago en el yavascrít
    }
    //movLast
    if (esFun(this.funMoveLast)){
      this.botMoveLast = this._makeButton(this.divMov, "cmdMovLast", ">> *********"  ) 
      {let tt = this; this.botMoveLast.onclick = function(){ tt._btMovLast()} } // me cago en el yavascrít
    }
    this.div2.appendChild(this.divMov) 
  }
  //divMsg
  this.divMsg = document.createElement("div") 
  this.divMsg.className = "div_msg" 
  this.pMensaje = document.createElement("p") 
  this.divMsg.appendChild(this.pMensaje) 
  this.pMensaje.textContent = "_ " 
  this.div2.appendChild(this.divMsg) 

  //divSalir
  if (esFun(this.funSalir)) {
    this.divSalir = document.createElement("div") 
    this.divSalir.className = "div_salir" 
    this.botSalir = this._makeButton(this.divSalir, "cmdSalir","Salir ******"  ) 
    {let tt = this; this.botSalir.onclick = function(){ tt._btSalir()} } // me cago en el yavascrít
    this.div2.appendChild(this.divSalir) 
  }
  this.divBotonera.appendChild(this.div1) 
  this.divBotonera.appendChild(this.div2) 

  }


  _makeButton(context, id, text){
    let boton = document.createElement("button") 
    
    boton.id = id   
    boton.type = "button" 
    boton.disabled = false 
    boton.className = "button_crud"  /

    contexto.appendChild(boton) 
    boton.textContent = texto 

    return boton 
  }


} //?
