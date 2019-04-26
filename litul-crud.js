
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
    panel mode:   idle, showing, adding, modifying 
    special status: waiting server response


  Public methods ?

  Mandatory methods?

  Optional methods
  




  ya me estoy asustando / It s scary
  

 check IDLE spelling

*/

/*
  To-Do
  Cleaner if doing _makeButton() while set()  so  fewer _variables   like _txtButtonXXX


*/ 

class CrudPad extends HTMLElement  {

  constructor(){
    super()  


  } 

  // *** mode, readonly for dev  ***    
  _mode = 0  //  type as ST_LIST // dont  =this.ST_LIST.IDLE, to force change to idle first run   

  get mode(){
    return this._mode
  }

  get MODE_LIST() {return {
    "IDLE":1, "SHOW":2, "CREATE":4, "MODIFY":8,   // "ST_WAITINGSERVER":16 ?}
  }}                                              

  // *** internal var ***     // USELESS ??? no declaration needed, no way to prevent typos?? this.ANYTHING?
  // *** internal var 1of2: From dev ***
  _implementedCreate = false  // cleaner than asking 4 valid functions
  _implementedModify = false
  _implementedRemove = false 
  _implementedSearch = false
  _implementedNav = false     // humpf!  4 separated optional buttons, cleaner not anymore
  _implementedExit = false

  _funcEraseForm 
  _funcDisableForm
  _textButtonOk
  _txtButtonCancel

  _funcCreate_FormEditNew
  _funcCreate_DbInsert
  _txtButtonCreate

  _funcUpdate_FormEditModify
  _funcUpdate_DbUpdate
  _txtButtonModify

  _funcRemove_DbDelete
  _txtButtonDelete
  _txtConfirmDelete

  _funcSearchAndShow
  _txtButtonSearch
  _boolWithSearchInputBox

  _funcNavMoveFrst
  _funcNavMovePrev
  _funcNavMoveNext
  _funcNavMoveLast
  _arrayButtonNavTxt

  // *** internal var 2of2: predefined (hidden pad work) ***
  

  // *** onclick *** hidden for Mr Dev
  _btSearch(){}
  _btNew(){}
  _btModi(){}
  _btDel(){}
  _btOK(){}
  _btCancel(){}
  _btMovFirst(){}
  _btMovPrev(){}
  _btMovNext(){}
  _btMovLast(){}
  _btExit(){}



  // *** implement behaviour ***
  //set control mandatory.   ---Should  i do it Via constructor????  
  setFormControl(funcCleanForm, funcDisableForm, textOkButton = 'Ok', textCancelButton = 'Cancel', ){
    this._funcCleanForm = funcCleanForm   
    this._funcDisableForm = funcDisableForm
    this._textButtonOk = textOkButton
    this._txtButtonCancel = textCancelButton

  }

  // These 5 methods implement bahaviour and they all are optional.
  setCreate(funcFormEditNew, funcDbInsert, textButton = 'New', ){
    // if !func throw err...   
    this._funcCreate_FormEditNew = funcFormEditNew
    this._funcCreate_DbInsert = funcDbInsert
    this._txtButtonCreate = textButton
    this._implementedCreate = true
  }
  setUpdate(funcFormEditModify, funcDbUpdate, textButton = 'Modify',){
    this._funcUpdate_FormEditModify = funcFormEditModify
    this._funcUpdate_DbUpdate = funcDbUpdate
    this._txtButtonModify = textButton
    this._implementedModify = true
  }
  setRemove(funcDbDelete, textButton = 'Delete', textConfirm = 'Delete Record?' ){
    this._funcRemove_DbDelete = funcDbDelete
    this._txtButtonDelete = textButton
    this._txtConfirmDelete = textConfirm
    this._implementedRemove = true 
  }
  setSearch(funcSearchAndShow, bolInputBox, textButton = 'Search', ){   // , inputBox default?  ,txtHint?)
    this._funcSearchAndShow = funcSearchAndShow
    this._txtButtonSearch = textButton
    this._boolWithSearchInputBox = bolInputBox   // box content will be passed to search func
    this._implementedSearch = true
  }
  setNav(funcMoveFirst, funcMovePrev, funcMoveNext, funcMoveLast, arrayButtonText = ['<<','<','>','>>']){
    this._funcNavMoveFrst = funcMoveFirst
    this._funcNavMovePrev = funcMovePrev
    this._funcNavMoveNext = funcMoveNext
    this._funcNavMoveLast = funcMoveLast
    this._arrayButtonNavTxt = arrayButtonText   // its ok?  copy array? i dont remember. to check
    this._implementedNav = true 
  }
  setExit(funcExit, textButton){
    this._funcExit = funcExit
    this._txtButtonExit = textButton
    this._implementedExit = true
  }

  // this change the pad status, results from db operations // true/false (ok/err) for now, maybe let complex later  
  operationResult(op_msg){    // TRUE FALSE for now


    
  }

  // get CB_RESULT_MSG_LIST(){ // do I really need this?   Nav !!
  //   return {"DB_CREATE_OK":1,  "DB_UPDATE_OK":2,               }
  // }

/*
  setAllButtonsInnerHTML ( btOk, btCancel, btSearch, btCreate,  etcetcetcetc, ){   // I dont like it. At all. better expose dom array buttons ?  Or forget and Let dev query buttons? 
      // this is horrible.  Let's dev do it by himself via query or whatever. I could help with a htm class 
  }
*/ 
  


//  ------------------


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

      divMain                  div
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
    if ( this._implementedSearch ){  
      this.divSearch = document.createElement( "fieldset") 
      this.btSearch = this._MakeButton(this.divSearch, "cmdSearch", this._txtButtonSearch  )
      {let tt = this; this.btSearch.onclick = function(){ tt._btSearch()} } // me cago en el yavascrít
    
      if ( bolInputBox ){   // with input text? 
        this.inpSearch = document.createElement("input") 
        this.divSearch.appendChild(this.inpSearch) 
      }
    this.div1.appendChild(this.divSearch) 
    }

    //MAIN-div1-divCrud
    if(this._implementedCreate || this._implementedModify || this._implementedRemove  ){
      this.divCrud = document.createElement("div") 
      this.divCrud.className = "div_crud" 
      //create
      if ( this._implementedCreate ) {  
        this.btNew = this._makeButton(this.divCrud, "cmdNew", this._txtButtonCreate) 
        {let tt = this; this.btNew.onclick = function(){ tt._btNew()} } // me cago en el yavascrít
      }
      //mod
      if ( this._implementedModify  ) {  
        this.btModi = this._makeButton(this.divCrud,"cmdModi", this._txtButtonModify) 
        {let tt = this; this.botModi.onclick = function(){ tt._btModi()} } // me cago en el yavascrít
      }
      //del
      if ( this._implementedRemove ) {
        this.btDel = this._MakeButton(this.divCrud, "cmdDel", this._txtButtonDelete)   
        {let tt = this; this.btDel.onclick = function(){ tt._btDel()} } // me cago en el yavascrít
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
    if( this._implementedCreate || this._implementedModify){    
      this.divOkCancel = document.createElement("div") 
      this.divOkCancel.className = "div_okcancel" 
      this.btOk = this._makeButton(this.divOkCancel, "cmdOK",  this._textButtonOk ) 
      this.btCancel = this._makeButton(this.divOkCancel, "cmdCancel", this._txtButtonCancel ) 
      {let tt = this; this.btOK.onclick = function(){ tt._btOK()} } // me cago en el yavascrít
      {let tt = this; this.btCancel.onclick = function(){ tt._btCancel()} } // me cago en el yavascrít
      this.div1.appendChild(this.divOkCancel) 
    }

    // div2     group 2 -------  2da linea,  nav, msg, salir ------------
    this.div2 =document.createElement("div") 
    this.div2.className = "div_2" 
    //divMov
    if(this._implementedNav){
      this.divMov = document.createElement("div") 
      this.divMov.className = "div_mov" 
      //movFirst
      if (esFun(this._funcNavMoveFrst)){
        this.btMoveFirst = this._makeButton(this.divMov, "cmdMovFirst", this._arrayButtonNavTxt[0]) 
        {let tt = this; this.btMoveFirst.onclick = function(){ tt._btMovFirst()} } // me cago en el yavascrít
      }
      //movPrev
      if (esFun(this._funcNavMovePrev)){
        this.btMovePrev = this._makeButton(this.divMov, "cmdMovPrev", this._arrayButtonNavTxt[1]  ) 
        {let tt = this; this.botMovePrev.onclick = function(){ tt._btMovPrev()} } // me cago en el yavascrít
      }
      //movNext
      if (esFun(this.funMoveNext)){
        this.botMoveNext = this._makeButton(this.divMov, "cmdMovNext", this._arrayButtonNavTxt[2]  ) 
        {let tt = this; this.botMoveNext.onclick = function(){ tt._btMovNext()} } // me cago en el yavascrít
      }
      //movLast
      if (esFun(this.funMoveLast)){
        this.botMoveLast = this._makeButton(this.divMov, "cmdMovLast", this._arrayButtonNavTxt[3] ) 
        {let tt = this; this.botMoveLast.onclick = function(){ tt._btMovLast()} } // me cago en el yavascrít
      }
      this.div2.appendChild(this.divMov) 
    }
    //divMsg
    this.divMsg = document.createElement("div") 
    this.divMsg.className = "div_msg" 
    this.pMsg = document.createElement("p") 
    this.divMsg.appendChild(this.pMsg) 
    this.pMsg.textContent = " (^_^)  "     // take this off just for test 
    this.div2.appendChild(this.divMsg) 

    //divExit
    if (this._implementedExit)) {
      this.divExit = document.createElement("div") 
      this.divExit.className = "div_exit" 
      this.btExit = this._makeButton(this.divExit, "cmdExit", this._txtButtonExit  ) 
      {let tt = this; this.botSalir.onclick = function(){ tt._btExit()} } // me cago en el yavascrít
      this.div2.appendChild(this.divExit) 
    }
    this.divCrud.appendChild(this.div1) 
    this.divCrud.appendChild(this.div2) 
  }


  _makeButton(context, id, text){
    let boton = document.createElement("button") 
    
    boton.id = id   
    boton.type = "button" 
    boton.disabled = false 
    boton.className = "button_crud"  

    context.appendChild(boton) 
    boton.textContent = text

    return boton 
  }

  _changeMode(newMode, focus){
    // enable/disable buttons and div
    // Tests are masks of bynary flags. Do NO TEMPT to put || (logical OR) instead of bynary sum, it would fail.

    if (this.mode  != newMode  ) {     

      this.mode = newMode 

      // for testing
      let stEditing =  
          this.mode & (this.MODE_LIST.CREATE + this.MODE_LIST.MODIFY) 
      let stNoEditing = 
          this.mode & (this.MODE_LIST.IDLE + this.MODE_LIST.SHOW) 
      let stShowing = 
          this.mode & this.MODE_LIST.SHOW 

          //check buttons to enable
          //this._rever(this.divBusqueda, stNoEditando)     //fck div cant be disabled
          {let tstActive = 0 
              tstActive = 
                  this._enableElement(this.btSearch, stNoEditing) +
                  this._enableElement(this.inpSearch, stNoEditing) 
              this._enableDiv(this.divSearch, tstActive > 0)  
          }

          {let tstActive = 0 
              tstActive = 
                  this._enableElement(this.btNew, stNoEditing) +
                  this._enableElement(this.btModi, stShowing) +
                  this._enableElement(this.btDel, stShowing) 
              this._enableDiv(this.divCrud, tstActive > 0) 
         
          }
          {let tstActive = 0 
              tstActive = 
                  this._enableElement(this.btOk, stEditing) +
                  this._enableElement(this.btCancel, stEditing) 
              this._enableDiv(this.divOkCancel, tstActive > 0)    // > 0 no haria falta
         
          }
          {let tstActive = 0 
              for (let bo of this.customButton){
                tstActive +=  this._enableElement(bo,  Number( bo.dataset.modes ) & this.mode ) 
              }
              this._enableDiv(this.divCustom, tstActive) 
          }

          this._enableElement(this.btExit, stNoEditing)  
          {let tstActive =
              this._enableElement(this.divMov, stNoEditing)
              this._enableDiv(this.divMov, tstActive)         
          }
      }

      // show con style?
      //this._style_divMsg  this. mode .CLASS

      if (focus){         // should I ? 

        // focus on bt OK  if enabled 
          //    cmdOk.SetFocus
        // otherw
          //  focus on  btnew  if enabled 
      }
  }

  
  _enableElement(element, conditionToEnable){  // buttons and fieldsets,  enable or disable
      if (esObj(element)){
          element.disabled = !conditionToEnable
          return conditionToEnable 
      }
      return false 
  }

  _enableInNav(){

  }

  _enableDiv(div, yesOrNo){  
    
    //to do: media Screen size: 
    //        big:    visibility so buttons dont jump, 
    //        small:  display none to save space    in my 5'' MAKES difference
    
    if ( !isObj(div) ) return

    //div.style.display = yesOrNo? "flex":"none" //

    if (yesOrNo){          //activar
       // if(div.style.display == "none"){
            //div.visibility = "hidden"
            //div.style.display = "flex"
            div.style.visibility = "visible"   //transition  ??? no anda
        //}
    }else{              //borrar
        //if (div.style.display != "none") {
            div.style.visibility = "hidden"   //transition
        //}
    }
  }
} //?

function isObj(what){return typeof what == 'object' }
function isFun(what){return typeof what == 'function'}
