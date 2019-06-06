
/* 
  Lituls
  litul-crudpad  HTMLelement  

  by
  Joaquin Elio "Lito" Fernandez
  
*/

/*
  what?

  Clean keypad with optional buttons for:
    Search&show, 
    Create, Update, Remove, 
    db nav << < > >> , 
    OK, Cancel
    Custom buttons  (can be enabled on specific status of choice)
    msg    

  It will show and enable-disable buttons depending on:
    functions implemented:  db create, db update, ...  
    internal status (mode)  1 of 4:  Idle, showing record, creating new record,  modifing existing record.  

  dev implements simple operations only (forget the onclick !)
    form operations:  clean the form, show a record, create a form for editing
    db operations:    select, insert, update, delete...
    result:           true/false  to let keypad know those op were succesful        
    just that.  

*/


/*
  To-Do
  Cleaner if doing _makeButton() while set()  so  fewer _variables   like _txtButtonXXX
  Or not.
  Maybe
  The parameters are handy.  
*/ 

window.customElements.define('litul-crudpad', class extends HTMLElement  {

  constructor(){   // remains empty...  Whats intended to put here?  
    super()  

    
  } 


  // ** shared objects 
  padButtons = []     // internal, exposed for easy apeareance tuning. DONT change behaviour (onclick, enable)
  customButtons = []     // custom, created by .createCustomButton.  Everything else is on you, Dev.   

  get mode(){                   // Current mode.
    return this._mode
  }
  get MODE_LIST() {return {
    'IDLE':1, 'SHOW':2, 'CREATE':4, 'MODIFY':8,    
  }}
  MODE_CLASSES = {              // classes for css, just some ornament as feedback
    1:'div_msg-idle',  
    2:'div_msg-show',
    4:'div_msg-crea',
    8:'div_msg-modi',
  }
  _PANEL_LIST = {               // panels:  crudpad,  confirm replacement,  waitingserverresponse. 
    'CRUD':1, 'CONFIRM':2, 'WAITING':3, 'LAST_PANEL':99
  }
  _panelCurrent = 0  // invalid on purpose
  _panelLast = 1   // one level history only, will enable the last used panel:  example confirm Yes->crud No->Last 
  _deactived_panel_class = 'deactived-panel'


  // *** mode, readonly for dev  ***    
  _mode = 0  // 0=invalid on purpose.  Dont '.IDLE' here so it SETS things to idle on first run   
  

  // result() related:
  // []         [caller, modeOnSuccess, modeOnFailure]
  _resultCall = ['', null, null]


  // *** internal var ***     // USELESS ??? no declaration needed, no way to prevent typos?? this.ANYTHING?
  // *** internal var 1of2: From dev ***
  
                              // implementedXX,  to know what elements to create  
  _implementedCreate = false  // shorter than asking 4 valid functions
  _implementedModify = false
  _implementedRemove = false 
  _implementedSearch = false
  _implementedNav = false     // humpf!  4 separated optional buttons, clean? not anymore
  _implementedExit = false

  //                  _funcXXXXX      to record the methods implemented by dev
  //                  _txtButtonXXX   to record the label a button shows  (optional)  //  Didn try svg icon innerHTML
  _funcEraseForm 
  _funcDisableForm
  _textButtonOk
  _txtButtonCancel
  _txtConfirmCancel

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
  _txtButtonMoveFirst
  _txtButtonMovePrev
  _txtButtonMoveNext
  _txtButtonMoveLast

  _txtConfirmExit

  _funcConfirmYes = null
  _funcConfirmNo  = null
  _txtButtonConfirmYes = 'Yes'
  _txtButtonConfirmNo  = 'No'
  

  // *** internal var 2of2: predefined (hidden pad work) ***
  

  // crudpad *onclick* functions  hidden from Dev
  //  they fire dev stuff, set the wait for result(), response to user interaction, change mode, en/disable buttons according that result()   
  //
  async _btSearch(){
    this._setResultCaller('search', this.MODE_LIST.SHOW,)    //  ,MODE_LIST.IDLE)  ? 
    this._funcSearchAndShow(this.inpSearch.value)           // input if any
  }
  
  _btNew(){
    this._setResultCaller('frmNew', this.MODE_LIST.CREATE,  )   //  ,MODE_LIST.IDLE)  ? 
    this._funcCreate_FormEditNew()
  }

  _btModi(){
    this._setResultCaller('frmMod', this.MODE_LIST.MODIFY,  ) //  ,MODE_LIST.IDLE)  ? 
    this._funcUpdate_FormEditModify()
  }
  
  _btDel(){
    this.confirm(
      this._txtConfirmDelete,
      ()=>{
        this._setResultCaller('dbDelete', this.MODE_LIST.IDLE,)   // err, keep showing 
        this._funcRemove_DbDelete()
      },
      // no, stays the same
    )
  }
  
  _btOK(){
    if(this.mode == this.MODE_LIST.CREATE){
      this._setResultCaller('dbInsert', this.MODE_LIST.SHOW,)  
      this._funcCreate_DbInsert()
    } else if(this.mode == this.MODE_LIST.MODIFY) {
      this._setResultCaller('dbUpdate', this.MODE_LIST.SHOW,)  
      this._funcUpdate_DbUpdate()
    } else {
      this.hey ('int err: okbutton is neither create nor modify')
    }
  }
  
  _btCancel(){
    this.confirm(
      this._txtConfirmCancel,
      ()=>{ 
        this.hey(_txtCancelDone)
        this._funcEraseForm()
      }
    )
  }
  
  _btMoveFirst(){
    this._setResultCaller('mvFrst', MODE_LIST.SHOW)
    this._funcNavMoveFrst()
  }
  _btMovePrev(){
    this._setResultCaller('mvPrev', MODE_LIST.SHOW)
    this._funcNavMovePrev()
  }
  
  _btMoveNext(){
    this._setResultCaller('mvNxt', MODE_LIST.SHOW)
    this._funcNavMoveNext()
  }  
  _btMoveLast(){
    this._setResultCaller('mvLst', MODE_LIST.SHOW)
    this._funcNavMoveLast()
  }
  
  _btExit(){
    this.confirm(
      this._txtConfirmExit,
      this._funcExit(),
    )
  }

  _btTired(){
    this.confirm("Stop the waiting? It won't stop the request.", 
      function(){
        // stop any result wait 
        this._setResultCaller('')

        // reset crudpad to idle
        this._changeMode(this.MODE_LIST.IDLE)

        //reset panel history.  That's dirty.   Tamper global here? If enablePanel were selected by class it would fail 
        this._panelLast = this._PANEL_LIST.CRUD

        // any other thing I should worry? 
        // ??
      },
      function(){
        // go back
        // ok then thats it
        // nothing to do
      }
    )
  }

  _enablePanel(panel){    // Select super operation: Crud, confirm(), waitingServerResult
                          // It doesnt alter any status but the view,  and restrict user from interaction.
    const inactive = this._deactived_panel_class

    if (panel == this._PANEL_LIST.LAST_PANEL){   //what???? Think again. Mmm... it looks ok...
      panel = this._panelLast
      this._panelCurrent = panel
    } else{
      this._panelLast = this._panelCurrent
      this._panelCurrent = panel
    }
    this.div1.classList.add(inactive)
    this.div2.classList.add(inactive)
    this.divConfirm.classList.add(inactive)
    this.divWaiting.classList.add(inactive)

    switch(panel){
      case this._PANEL_LIST.CRUD: {
        this.div1.classList.remove(inactive)
        this.div2.classList.remove(inactive)
        break
      }
      case this._PANEL_LIST.CONFIRM:{
        this.divConfirm.classList.remove(inactive)
        break
      }
      case this._PANEL_LIST.WAITING:{
        this.divWaiting.classList.remove(inactive)
        break
      }
      default: {
        this.hey('internal err: Not a valid panel '+ panel )
      }
    }
  }


  // ********************** .confirm() ********************
  //onclick
  _btConfirmYes(){
    this._funcConfirmYes()
    this._confirmHide()
  }
  _btConfirmNo(){
    this._funcConfirmNo()  // check if ?
    this._confirmHide()
  }
  // panel
  _confirmHide(){     // _confirmPanelHide
    this._enablePanel(this._PANEL_LIST.LAST_PANEL)
    this._funcConfirmYes = null
    this._funcConfirmNo = null
  }
  _confirmShow(){     // _confirmPanelShow
    this._enablePanel(this._PANEL_LIST.CONFIRM)
  }
  // 
  confirm(textMsg, funcYes, funcNo){  // just cause I dont like browser confirm 
    //check
    if (!isFun(funcYes) || !isFun(funcNo) ) {return}  /// !!!!!!!!!!!!!!!!!!!!!!!!!! TO DO Show err
    if (isFun(this._funcConfirmYes) || isFun(this._funcConfirmNo)) {
      this.hey('internal error - .confirm() already waiting')  // It cannot happen.  Can it?
      return
    } 

    // msg = '':  does not requiere confirmation...  Why? To abstract its use.  I'll use it later.
    if (textMsg == '') { funcYes() ; return }

    //semimodal
    this.pConfirmMsg.textContent = textMsg 
    this._funcConfirmYes = funcYes
    this._funcConfirmNo = funcNo
    this._confirmShow()
  }


  // careful, html text, check.  Is there a function to replace symbols and stuff like > á  to htm representation?  
  hey(what){
    this.pMsg.textContent = what
  }
  
  // fires crudpad.  Use it when all settings are done.
  start(){
    this._letsMakeCrudpadHTML()
    this._changeMode(this.MODE_LIST.IDLE)
    this._enablePanel(this._PANEL_LIST.CRUD)
  }

  // *** implement behaviour ***
  //set control mandatory.  
  setFormControl(funcEraseFormContent, funcDisableForm, textOkButton = 'Ok', textCancelButton = 'Cancel', ){
    this._funcCleanForm = funcEraseFormContent   
    this._funcDisableForm = funcDisableForm
    this._textButtonOk = textOkButton
    this._txtButtonCancel = textCancelButton
  }

  // These 5 methods implement bahaviour and they all are optional.
  setCreate(funcFormEditNew, funcDbInsert, textButton = 'New', ){
    // if ! func throw err...   ??
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
  setNav(funcMoveFirst, funcMovePrev, funcMoveNext, funcMoveLast, textButtonFirst = '&lt;&lt;', textButtonPrev = '&lt;', textButtonNext = '&gt;', textButtonLast = '&gt;&gt;' ){ 
    this._funcNavMoveFrst = funcMoveFirst
    this._funcNavMovePrev = funcMovePrev
    this._funcNavMoveNext = funcMoveNext
    this._funcNavMoveLast = funcMoveLast
    this._txtButtonMoveFirst = textButtonFirst
    this._txtButtonMovePrev = textButtonPrev
    this._txtButtonMoveNext = textButtonNext
    this._txtButtonMoveLast = textButtonLast  
    this._implementedNav = true 
  }
  setExit(funcExit, textButton = 'Exit'){
    this._funcExit = funcExit
    this._txtButtonExit = textButton
    this._implementedExit = true
  }

  addCustomButton(name, className, caption, activeModesBinarySum, onclick){
    let bot = document.createElement("button") 

    bot.name = name 
    bot.className = " cus_button " 
    //bot.value = value 
    bot.innerHTML = caption 
    bot.id = name 
    bot.onclick = onclick   
    bot.type = "button" 
    bot.dataset.estados = activeModesBinarySum  
    bot.disabled = true 

    this.customButtons.push(bot) 
    return bot 
  }

  // setWait or setWaitForResult should name 
  _setResultCaller(caller, modeSuccess = null, modeFail = null ){
    //check
    if (caller != '' && this._resultCall[0] != ''  ) {    // want to set but is already set
      this.hey('Int err: Unexpected req *' + caller + '* Already waiting result from *' + this._resultCall[0] + '*' )
      return
    }
    if (caller == '' && this._resultCall[0] == ''  ) {    // want to reset but is already reset
      this.hey('Int err: No result to reset' )
      return
    }

    //reset
    if (caller=='') {
      this._resultCall = ['', null, null]
      // this._changeMode(this.MODE_LIST.IDLE)
      // this._enablePanel(this._PANEL_LIST.CRUD)      
      return
    }

    //set
    this._resultCall = [caller, modeSuccess, modeFail]
    this._enablePanel(this._PANEL_LIST.WAITING)
  }

  // triggered by dev  
  // Change the crudpad status from waiting to some mode.  Results from db operations  true/false (ok/err)
  result(success, msg){    // success = true/false    msg = optional text msg <p>.
    //check
    if (this._resultCall[0] == '' ){
      this.hey('Int Err: Unexpected result()')
      return
    }

    //panel wait  off
    this._enablePanel(this._PANEL_LIST.CRUD)

    // success [1] unsuccessful [2]
    this._changeMode(this._resultCall[ (success? 1 : 2)])    

    //reset result wait 
    this._setResultCaller('')

    if (msg > '' ) {this.hey(msg)}
  }

  /*
  setAllButtonsInnerHTML ( btOk, btCancel, btSearch, btCreate,  etcetcetcetc, ){   // I dont like it. At all. better expose dom array buttons ?  Or forget and Let dev query buttons? 
      // this is horrible.  Let's dev do it by himself via query or whatever. I could help with a htm class 
  }
  */ 
  
  //  ------------------
  _changeMode(newMode){      // *** enable/disable buttons and div depending on MODE ***

    // buttons use disabled attr, divs use css class
    // Tests are masks of bynary flags. Dont be tempted to put "||" (logical OR) instead of bynary sum, it WILL fail.

    //check
    const oldMode = this._mode
    if (newMode == null ) return      //magic? why? isnt it an err?
    if (oldMode == newMode) return     

    this._mode = newMode 

    // for easy
    const stEditing =  
        this._mode & (this.MODE_LIST.CREATE + this.MODE_LIST.MODIFY) 
    const stNoEditing = 
        this._mode & (this.MODE_LIST.IDLE + this.MODE_LIST.SHOW) 
    const stShowing = 
        this._mode & this.MODE_LIST.SHOW 

    //check buttons/divs to enable depending on mode
    //tstActive check if at least one.  If none, div disabled. (useful to hide div in small screens... css to do )  
    //
    //div search
    {let tstActive = 0 
        tstActive = 
            this._enableElement(this.btSearch, stNoEditing) +
            this._enableElement(this.inpSearch, stNoEditing) 
        this._enableDiv(this.divSearch, tstActive > 0)  
    }
    //div crud
    {let tstActive = 0 
        tstActive = 
            this._enableElement(this.btNew, stNoEditing) +
            this._enableElement(this.btModi, stShowing) +
            this._enableElement(this.btDel, stShowing) 
        this._enableDiv(this.divCrud, tstActive > 0) 
    }
    //div okcancel
    {let tstActive = 0 
        tstActive = 
            this._enableElement(this.btOk, stEditing) +
            this._enableElement(this.btCancel, stEditing) 
        this._enableDiv(this.divOkCancel, tstActive > 0)    // > 0 no haria falta
    }
    //div custom
    {let tstActive = 0 
          for (let bo of this.customButtons){
            tstActive +=  this._enableElement(bo,  Number( bo.dataset.modes ) & this.mode ) 
          }
          this._enableDiv(this.divCustom, tstActive) 
    }
    //div nav
    {let tstActive = 0
        tstActive =
          this._enableElement(this.btMoveFirst, stNoEditing) +
          this._enableElement(this.btMovePrev, stNoEditing) +
          this._enableElement(this.btMoveNext, stNoEditing) +
          this._enableElement(this.btMoveLast, stNoEditing)   // no sense here, but still... 
        this._enableDiv(this.divNav, tstActive > 0)         
    }
    //div exit
    this._enableElement(this.btExit, stNoEditing)  

    // show mode with style...  Changes divmsg color.  Remove oldmode class and add newmode class
    // --------PRETTY SURE IT DOESNT WORK.  No harm, No hard to replace.
    this.divMsg.classList.remove(this.MODE_CLASSES[oldMode]) 
    this.divMsg.classList.add(this.MODE_CLASSES[newMode])
  }

  
  _enableElement(element, conditionToEnable){  // buttons and fieldsets,  enable or disable
    if (isObj(element)){
      element.disabled = !conditionToEnable
      return conditionToEnable 
    }
    return false 
  }

  // _enableInNav(){
  //   // to implement this, i need more info than .result(true-false)
  //   //
  //   // a) add a second .resultNav(resultNav-ok-bof-eof-fail)                     puaj
  //   // b) change .result(truefalse, optionalResulNav)                            puaj, already a 2d param
  //   // c) change .result(itDepends...) to acept both bool & and act acordlinly   maybe
  //   // d) do nothing.  Just to disable one button? Come on.                      easy way.  Easier for dev too.
  // }

  _enableDiv(div, yesOrNo){  
    //to do: delegate to css 
    //media Screen size: 
    //    big:    via visibility so buttons dont jump, 
    //    small:  via display none to save space    in my 5'' it MAKES difference
    
    if ( !isObj(div) ) return

    //div.style.display = yesOrNo? 'flex':'none'   

    if (yesOrNo){          //activar
       // if(div.style.display == 'none'){
            //div.visibility = 'hidden'
            //div.style.display = 'flex'
            div.style.visibility = 'visible'   //transition  ??? no anda
        //}
    }else{              //borrar
        //if (div.style.display != 'none') {
            div.style.visibility = 'hidden'   //transition
        //}
    }
  }


  _letsMakeCrudpadHTML(){ 

    // MAIN- 
    this.divMain = this._makeElement(this, 'form', 'div_main', 'div_main', )   /// what is -this- 

    //  MAIN-div1  ----------- 1st line:  search, crudbut, usrbut, ok/cancel --------------
    this.div1 = this._makeElement(this.divMain, 'div', 'div_1', 'div_1' )
    // MAIN-div1-divSearch
    if ( this._implementedSearch ){  
      this.divSearch = this._makeElement(this.div1, 'div', 'div_search', 'div_search')
      this.btSearch = this._makeButton(this.divSearch, 'cmd_search', this._txtButtonSearch )
      {let tt = this; this.btSearch.onclick = function(){ tt._btSearch()} } // me cago en el yavascrít
      if ( this._boolWithSearchInputBox ){   // with input text? 
        this.inpSearch = this._makeElement(this.divSearch, 'input', 'inp_search' ) 
      }
    }
    //MAIN-div1-divCrud
    if(this._implementedCreate || this._implementedModify || this._implementedRemove  ){
      this.divCrud = this._makeElement(this.div1, 'div', 'div_crud', 'div_crud' )
      //create
      if ( this._implementedCreate ) {  
        this.btNew = this._makeButton(this.divCrud, 'cmd_New', this._txtButtonCreate) 
        {let tt = this; this.btNew.onclick = function(){ tt._btNew()} } // me cago en el yavascrít
      }
      //mod
      if ( this._implementedModify  ) {  
        this.btModi = this._makeButton(this.divCrud,'cmd_modi', this._txtButtonModify) 
        {let tt = this; this.btModi.onclick = function(){ tt._btModi()} } // me cago en el yavascrít
      }
      //del
      if ( this._implementedRemove ) {
        this.btDel = this._makeButton(this.divCrud, 'cmd_del', this._txtButtonDelete)   
        {let tt = this; this.btDel.onclick = function(){ tt._btDel()} } // me cago en el yavascrít
      }
    }
    //main-div1-divCustom   
    if( this.customButtons.lenght > 0 ){
      this.divCustom = this._makeElement(this.div1, 'div', 'div_custom', 'div_custom')
      for(let bo of this.customButton){
        this.divCustom.appendChild(bo)    
      }
    }
    //main-div1-divOkCancel
    if( this._implementedCreate || this._implementedModify){    
      this.divOkCancel = this._makeElement(this.div1, 'div', 'div_okcancel', 'div_okcancel')    
      this.btOk = this._makeButton(this.divOkCancel, 'cmd_ok',  this._textButtonOk ) 
      this.btCancel = this._makeButton(this.divOkCancel, 'cmd_cancel', this._txtButtonCancel ) 
      {let tt = this; this.btOk.onclick = function(){ tt._btOK()} } // me cago en el yavascrít
      {let tt = this; this.btCancel.onclick = function(){ tt._btCancel()} } // me cago en el yavascrít
    }

    // main-div2     group 2 -------  2d line,  nav, msg, exit ------------
    this.div2 = this._makeElement(this.divMain, 'div', 'div_2', 'div_2')
    //main-div2-divNav
    if(this._implementedNav){
      this.divNav = this._makeElement(this.div2, 'div', 'div_nav', 'div_nav',)    
      //main-div2-divNav-movFirst
      if (isFun(this._funcNavMoveFrst)){
        this.btMoveFirst = this._makeButton(this.divNav, 'cmd_movfrst', this._arrayButtonNavTxt[0]) 
        {let tt = this; this.btMoveFirst.onclick = function(){ tt._btMoveFirst()} } // me cago en el yavascrít
      }
      //main-div2-divNav-movPrev
      if (isFun(this._funcNavMovePrev)){
        this.btMovePrev = this._makeButton(this.divNav, 'cmd_movprev', this._arrayButtonNavTxt[1]  ) 
        {let tt = this; this.btMovePrev.onclick = function(){ tt._btMovePrev()} } // me cago en el yavascrít
      }
      //main-div2-divNav-movNext
      if (isFun(this.funMoveNext)){
        this.btMoveNext = this._makeButton(this.divNav, 'cmd_movnext', this._arrayButtonNavTxt[2]  ) 
        {let tt = this; this.btMoveNext.onclick = function(){ tt._btMoveNext()} } // me cago en el yavascrít
      }
      //main-div2-divNav-movLast
      if (isFun(this.funMoveLast)){
        this.btMoveLast = this._makeButton(this.divNav, 'cmd_movlast', this._arrayButtonNavTxt[3] ) 
        {let tt = this; this.btMoveLast.onclick = function(){ tt._btMoveLast()} } // me cago en el yavascrít
      }
    }
    //main-div2-divMsg
    this.divMsg = this._makeElement(this.div2, 'div', 'div_msg', 'div_msg',) 
    this.pMsg = this._makeElement(this.divMsg, 'p', 'p_msg')  
    //this.pMsg.textContent = ' (^_^)  '     // take this off just for test 

    //main-div2-divExit
    if (this._implementedExit) {
      this.divExit = this._makeElement(this.div2, 'div', 'div_exit', 'div_exit',)    
      this.btExit = this._makeButton(this.divExit, 'cmd_exit', this._txtButtonExit  ) 
      {let tt = this; this.btExit.onclick = function(){ tt._btExit()} } // me cago en el yavascrít
    }

    //main-divYesNo               ----hides div1 & div2 when showing-----
    this.divConfirm = this._makeElement(this.divMain, 'div', 'div_confirm', 'div_confirm', )
    this.pConfirmMsg = this._makeElement(this.divConfirm,'p','p_confirmmsg', 'p_confirmmsg')
    this.btConfirmYes = this._makeButton(this.divConfirm, 'cmd_yes', this._txtButtonConfirmYes)
    this.btConfirmNo  = this._makeButton(this.divConfirm, 'cmd_no' , this._txtButtonConfirmNo)
    {let tt = this; this.btConfirmYes.onclick = function(){ tt._btConfirmYes()} } // me cago en el yavascrít
    {let tt = this; this.btConfirmNo.onclick  = function(){ tt._btConfirmNo()} } // me cago en el yavascrít
    //this.divConfirm.visibility = 'none'   // mm....  should be always controled inside changemode()  

    //main-divWaiting        
    this.divWaiting = this._makeElement(this.divMain, 'div', 'div_waiting', 'div_waiting')

    //  Do something pretty here   like shoting to the cloud icon. - -------------------------------------TO DO ------

    this.svgThing = this._makeElement(this.divWaiting, 'svg','svg_thing', 'svg_thing')
    this.btTired = this._makeButton(this.divWaiting, 'cmd_tired', "I'm tired")
    {let tt = this; this.btTired.onclick = function(){ tt._btTired()} } // me cago en el yavascrít   

    //  need something else, something pretty
    this.svgThing.innerHTML = '<svg height="100" width="400"><ellipse cx="80" cy="20" rx="80" ry="10" />' 
  }

  _makeElement(context, elemtype, id, initialClass = '',   ) {    
    let e = document.createElement(elemtype)
    e.className = initialClass
    if (id != undefined) {e.id = id}
    context.appendChild(e)
    return e
  }

  _makeButton(context, id, text){
    let boton = document.createElement('button') 
    
    boton.id = id   
    boton.type = 'button' 
    boton.disabled = false 
    boton.className = 'button_crud'
    context.appendChild(boton) 
    boton.textContent = text

    this.padButtons.push(boton)   // is it correct?********** Yes, but this way cant: "buttons.buttonRemove"
    // this.button[boton]     // what about this.  I forgot the training
    return boton 
  }

} // class end - anonima
)

// can I do this, here? are they global now?
function isObj(what){return typeof what == 'object'   }   // NEVER fucking parameters inside ' ' !!! Hate you js.  
function isFun(what){return typeof what == 'function' }

