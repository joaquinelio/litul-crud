﻿
/* 
  Lituls
  litul-crudpad  HTMLelement  

  by
  Joaquin Elio "Lito" Fernandez  
*/

"use strict"   //  strict? STRICT??? All let are GLOBAL! YOU CAN NOT FORCE AS TYPE MODULE  FY FYFYFYFYFY JS!!!

const _DESPIOJANDO = true    //  itchy

/*
//   **********************       
//   HERE THE ELEMENT CLASS       
//   **********************
*/
window.customElements.define('litul-crudpad', class extends HTMLElement {

  constructor(){
    super()  

    //this.padButtons = []       // internal, exposed for easy apeareance tuning. Dev, DONT change behaviour (onclick, enable)
    this.customButtons = []    // custom, created by .createCustomButton.  Everything else is on you, Dev.   

    //this._dbTimeout = 1000     // Time before bored abort button appears       to-do 
    this._mode = 0             // 0=invalid on purpose.  Dont '.IDLE' here so it SETS things to idle on first run   


    // sendResult() related:                            // What if..... GENERATOR???  
    //                 [caller, modeOnSuccess, modeOnFailure]
    this._resultCall = ['', null, null]
     



    // dev's set stuff.   These obj match dom obj. Should I extend shadow dom, add props there? NO WAY.  Only if I had my own dom.
    //
    this._dev = {
      control:{   
        funFrmErase : null,
        funFrmBlockAll : null,
      },
      create: {
        isOn : false,
        funForm : null,
        funDb:  null,
        txtBt : 'New',
        //innerHtmlBt : '',   //  svg ?  
      },
      read:{
        isOn : false,
        inputBoxOn : false,
        txtBt : 'Search',
        funRead : null,
      },
      update: {
        isOn : false,
        funFrm: null,
        funDb: null,
        txtBt: 'Modify',
        txtConfirm : '',
      },
      delete:{
        isOn : false,
        funDb : null,
        txtConfirm : 'Delete record?' 
      },
      nav:{
        isOn : false,
        funMvFrst : null,
        funMvPrev : null,
        funMvNext : null,
        funMvLast : null,
      },
      exit:{
        isOn : false,
        txtBt : 'Exit',
        txtConfirm : 'Exit?',
        funExit : null,
      },
      crudOkCancel:{
        txtBtOk : 'ok',
        txtBtCancel : 'cancel',
        txtConfirmCancel : 'Cancel edition?',
        txtMsgCancelDone : 'Canceled',
      },
      confirm:{ 
        txtBtYes : 'yes',
        txtBtNo : 'no',
        funYes : null,
        funNo : null,
      },
      bored:{
        txtButton : "I'm tired",
        txtConfirm : "Stop the waiting? It won't stop the request.",
        dbTimeout : 1000,
      }, 

      
    }

    // panels:
    //
    this._panel = {
      PANELS : { NONE: 0, CRUD: 1, CONFIRM: 2, WAITING: 3, RESTORE: 4, },
      current : 0,                                                      // NONE only first time
      last : 1,
    }

    // allowed classes    Yeah, I'm a maniac.  I would replace the entire library
    //
    this._classes = {
      button_crud : 'button_crud',
      deactived_panel : 'deactived-panel',
    }

    // dibujitos
    //
    this._svg = {
      svgDebug : '<svg><g><title>Layer 1</title>'+
            '<circle id="svg_1e" r="41.61798" cy="69" cx="122" stroke-width="0" stroke="#000000" fill="#ff7f00"/>'+
            '<circle id="svg_2" r="20.41382" cy="50" cx="108" stroke-width="0" stroke="#000000" fill="#ffaaaa"/>'+
            '<circle stroke="#000000" id="svg_3" r="21.41382" cy="88.5" cx="98" stroke-width="0" fill="#ffaaaa"/>'+
            '<circle id="svg_4" r="12.91382" cy="51" cx="160.5" stroke-width="0" stroke="#000000" fill="#ffaaaa"/>'+
            '<circle id="svg_5" r="6.93909" cy="60.5" cx="102.5" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" stroke-width="0" stroke="#000000" fill="#000000"/>'+
            '<line stroke-width="3" id="svg_8" y2="103" x2="83" y1="85" x1="105" stroke-linecap="null" stroke-linejoin="null" stroke-dasharray="null" stroke="#000000" fill="none"/>'+
            '</g>'+
            '<g>'+
            '<title>Layer 2</title>'+
            '<path fill-rule="evenodd" d="m76.5,121c-25.13875,0 -45.5,21.01512 -45.5,46.96116c0,20.78031 13.02438,38.33205 31.11063,44.5544c2.275,0.41091 3.12813,-0.99792 3.12813,-2.23066c0,-1.11533 -0.05688,-4.81352 -0.05688,-8.74652c-11.43188,2.17195 -14.38938,-2.87637 -15.29938,-5.51794c-0.51188,-1.35013 -2.73,-5.51794 -4.66375,-6.63326c-1.5925,-0.88052 -3.8675,-3.05248 -0.05688,-3.11118c3.58313,-0.0587 6.1425,3.40468 6.99563,4.81352c4.095,7.10288 10.63563,5.10703 13.25188,3.8743c0.39813,-3.05248 1.5925,-5.10703 2.90063,-6.28106c-10.12375,-1.17403 -20.7025,-5.22443 -20.7025,-23.18707c0,-5.10703 1.76313,-9.33353 4.66375,-12.62081c-0.455,-1.17403 -2.0475,-5.98755 0.455,-12.44471c0,0 3.81063,-1.23273 12.5125,4.81352c3.64,-1.05663 7.5075,-1.58494 11.375,-1.58494c3.8675,0 7.735,0.52831 11.375,1.58494c8.70188,-6.10495 12.5125,-4.81352 12.5125,-4.81352c2.5025,6.45716 0.91,11.27068 0.455,12.44471c2.90063,3.28728 4.66375,7.45508 4.66375,12.62081c0,18.02135 -10.63563,22.01305 -20.75938,23.18707c1.64938,1.46754 3.07125,4.28521 3.07125,8.68782c0,6.28106 -0.05688,11.32938 -0.05688,12.91432c0,1.23273 0.85313,2.70027 3.12813,2.23066a45.57394,47.03747 0 0 0 30.99688,-44.5544c0,-25.94604 -20.36125,-46.96116 -45.5,-46.96116l-0.00001,0z" id="svg_1" fill="black"/> '+
            '</g>'+
            '</svg>',
      svgCloud : 
        '<svg height="100%" >'+
        '<ellipse fill="#aa56aa" cx="161" cy="72" rx="99" ry="36"/>'+
        '<ellipse fill="#bb56bb" cx="183" cy="55" rx="70" ry="40"/>'+
        '<ellipse fill="#bb56bb" cx="122" cy="61" rx="54" ry="30"/>'+
        '</svg>',
    }
 
  } // end constructor


  get mode(){              // Current mode.    readonly for dev. shouldn't need it.
    return this._mode
  }
  get MODE_LIST() {return {
    IDLE: 1, SHOW: 2, CREATE: 4, MODIFY: 8,
    NONE: 0, NOEDIT: 3, EDIT: 12, ALL: 15      //added EDIT 8+4, NOEDIT 1+2, ALL 1+2+4+8  // never iterate so shouldn hurt   
  }}

  get dbTimeout(){
    return this._dev.bored.dbTimeout
  }
  set dbTimeout(milisecTimeout){
    if (Number(milisecTimeout) > 0)   this._dev.bored.dbTimeout = milisecTimeout
  }


  /*  ---------- what if ------------------ 
  setInnerHTML_OkCancel(txtBtOk = 'Ok', txtBtCancel = 'Cancel', txtConfirmCancel = 'Cancel edit?', txtMsgCanceled = 'Canceled'){
  }
  setInnerHTML_crudpad(txtBtCreate = 'New', txtBtRead = 'Search', txtBtUpdate = 'Modify', txtBtDelete = 'Delete'){
  }
  setInnerHTML_Bored(txtBoredButton = "I'm bored", txtBoredConfirm = "Stop the waiting? It won't stop the request."){
  }
  setInnerHTML_confirm(txtBtYes = 'Yes', txtBtNo = 'no'){
  }
  */
  


  //  crudpad *onclick* functions  hidden from Dev  (should be.  js...)
  //  they fire dev stuff, set the wait for result(), response to user interaction, change mode, en/disable buttons according that result()   
  //
  _btSearch(){
    this._setResultCaller('search', this.MODE_LIST.SHOW,)   //  ,MODE_LIST.IDLE)? no. if it fails, nothing. User decition, not Dev's.
    this._dev.read.funRead(this.inpSearch.value)  // input param if any
  }
  
  _btNew(){
    this._setResultCaller('frmNew', this.MODE_LIST.CREATE,  )     
    //this._funcCreate_FormEditNew()
    this._dev.create.funFrm()
  }

  _btModi(){
    this._setResultCaller('frmMod', this.MODE_LIST.MODIFY,  )  
    //this._funcUpdate_FormEditModify()
    this._dev.update.funFrm()
  }
  
  _btDel(){
    this.softConfirm(
      // this._txtConfirmDelete,
      this._dev.delete.txtConfirm,
      ()=>{
        this._setResultCaller('dbDelete', this.MODE_LIST.IDLE,)   // err, keep showing 
        // this._funcDelete_DbDelete()
        this._dev.delete.funDb()
      },
      ()=>{}       // no, stays the same
    )
  }
  
  _btOk(){
    if(this.mode == this.MODE_LIST.CREATE){
        this._setResultCaller('dbInsert', this.MODE_LIST.SHOW,)  
        // this._funcCreate_DbInsert()
        this._dev.create.funDb()
    } else if(this.mode == this.MODE_LIST.MODIFY) {
        this._setResultCaller('dbUpdate', this.MODE_LIST.SHOW,)  
        // this._funcUpdate_DbUpdate()
        this._dev.update.funDb()
    } else {
        this.hey ('int err: okbutton is neither create nor modify')
    }
  }
  _btCancel(){
    this.softConfirm(
      // this._txtConfirmCancel,
      this._dev.crudOkCancel.txtConfirmCancel,
      ()=>{ 
        // this.hey(this._txtCancelDone)
        // this._funcEraseForm()
        this.hey(this._dev.crudOkCancel.txtMsgCancelDone)
        this._dev.control.funFrmErase()
        this._changeMode(this.MODE_LIST.IDLE)
      },
      ()=>{}  //do nothing
    )
  }

  _btMoveFirst(){
    this._setResultCaller('mvFrst', this.MODE_LIST.SHOW)
    this._dev.nav.funMvFrst()
  }
  _btMovePrev(){
    this._setResultCaller('mvPrev', this.MODE_LIST.SHOW)
    this._dev.nav.funMvPrev()
  }
  _btMoveNext(){
    this._setResultCaller('mvNxt', this.MODE_LIST.SHOW)
    this._dev.nav.funMvNext()
  }  
  _btMoveLast(){
    this._setResultCaller('mvLst', this.MODE_LIST.SHOW)
    this._dev.nav.funMvLast()
  }
  
  _btExit(){
    this.softConfirm(
      this._dev.exit.txtConfirm,
      this._dev.exit.funExit()
    )
  }

  _btTired(){
    // this.softConfirm("Stop the waiting? It won't stop the request.", 
    this.softConfirm(
      this._dev.bored.txtConfirm,
      ()=>{                           //confirm yes ()
        let lastcall = this._resultCall[0]

        // reset crudpad to idle
        this._changeMode(this.MODE_LIST.IDLE)

        // stop any result wait 
        this._setResultCaller('')        
        this.hey('Wait from '+ lastcall + ' aborted.')

        //set panel crud
        this._enablePanel(this._panel.PANELS.CRUD)

        // any other thing I should worry? 
        // ??

      },
      ()=>{}                           //confirm no () // go back  // thats it  // nothing to do  
    )
  }


  _enablePanel(panelParam){    // Select super operation: Crud, softConfirm(), waitingServerResult
                          // It doesnt alter any status but the view,  and restricts user from interaction.

    const inactive = this._classes.deactived_panel
    let panelTo

    if (panelParam === this._panel.PANELS.RESTORE){       // restore panel ?         
      panelTo = this._panel.last                          //    go to = last panel 
    } else{                                               // set panel 
      panelTo = panelParam                                //    go to = panel parameter
    }

    if (panelTo === this._panel.current)   return         // nothing to do

    switch(this._panel.current){              // --------- fix: targeted disable, less jumpy --------- 
    case this._panel.PANELS.NONE:                                   // first time disable all
      this.div1.classList.add(inactive)
      this.div2.classList.add(inactive)
      this.divWaiting.classList.add(inactive)
      this.divConfirm.classList.add(inactive)
      break
    case this._panel.PANELS.CRUD:             
      this.div1.classList.add(inactive)
      this.div2.classList.add(inactive)
      break
    case this._panel.PANELS.WAITING:
      this.divWaiting.classList.add(inactive)
      break
    case this._panel.PANELS.CONFIRM:
      this.divConfirm.classList.add(inactive)
      break
    default:
      'no problem'
    }
     
    switch(panelTo){                    // enable new panel
      case this._panel.PANELS.CRUD: {
        this.div1.classList.remove(inactive)
        this.div2.classList.remove(inactive)
        break
      }
      case this._panel.PANELS.CONFIRM:{
        this.divConfirm.classList.remove(inactive)
        break
      }
      case this._panel.PANELS.WAITING:{            // extra code for bored button 
        this.btTired.disabled = true
        this.divWaiting.classList.remove(inactive)
        setTimeout(() => {this.btTired.disabled = false}, this._dev.bored.dbTimeout)
        break
      }
      default: {
        wtf('int err: Not a valid panel '+ panel )
      }
    }

    this._panel.last = this._panel.current            //  remember leaving panel
    this._panel.current = panelTo                     //  change complete   
  }


  // ********************** .softConfirm() ********************
  //onclick
  _btConfirmYes(){
    if (isFun(this._dev.confirm.funYes)){
      this._enablePanel(this._panel.PANELS.RESTORE)
      this._dev.confirm.funYes()
      this._dev.confirm.funYes = null
      this._dev.confirm.funNo = null
    } 
  }
  _btConfirmNo(){
    if(isFun(this._dev.confirm.funNo)){
      this._enablePanel(this._panel.PANELS.RESTORE)
      this._dev.confirm.funNo()
      this._dev.confirm.funYes = null
      this._dev.confirm.funNo = null  
    } 
  }
  // panel
  softConfirm(textMsg, funcYes, funcNo){  
    //async, killable.  Just cause I dont like browser confirm
    //CAREFUL: question is reset if crudpad receives sendResult() before the answer

    //check
    if (!isFun(funcYes) && !isFun(funcNo) ) {
      if (textMsg > ''){                          // msg but empty functions, error
        wtf('int err: crudpad.softConfirm() empty functions')
        return
      } else {                                    // all empty is a reset
        this._dev.confirm.funYes = null
        this._dev.confirm.funNo = null 
        this._enablePanel(this._panel.PANELS.RESTORE)   
        return
      }
    } 
    if (isFun(this._dev.confirm.funYes) || isFun(this._dev.confirm.funNo)) {
      wtf('int err: - crudpad.softConfirm() already waiting')  
      return                                       // Called while another softConfirm pending, error.  It cannot happen.  Can it? 
    } 
    
    if (textMsg == '') { funcYes() ; return }   // msg = '':  is a YES with no confirmation...  Why?  No clear reason.

    //question, no modal
    this.pConfirmMsg.textContent = textMsg 
    this._dev.confirm.funYes = funcYes
    this._dev.confirm.funNo = funcNo
    this._enablePanel(this._panel.PANELS.CONFIRM)
  }


  // soft alert.  set textContent, no so dangerous  I know Dev is careful putting things here.    
  hey(what){
    this.pMsg.textContent = what
    this.pMsg.title = what
  }
  
  // fires crudpad.  Use it when all settings are done.
  start(){
    this._letsMakeCrudpadHTML()
    this._changeMode(this.MODE_LIST.IDLE)
    this._enablePanel(this._panel.PANELS.CRUD)
  }

  // *** implement behaviour ***
  //set control, mandatory.  
  setFormControl(funcEraseFormContent, funcBlockForm, ){ // textOkButton = 'Ok', textCancelButton = 'Cancel', ){
    this._dev.control.funFrmErase = funcEraseFormContent
    this._dev.control.funFrmBlockAll = funcBlockForm
  }

  // These 5 methods implement bahaviour and they all are optional.
  setCreate(funcFormEditNew, funcDbInsert, textButton = 'New', ){
    // if ! func throw err...   ??
    this._dev.create.funFrm = funcFormEditNew
    this._dev.create.funDb = funcDbInsert
    this._dev.create.txtBt = textButton
    this._dev.create.isOn = true
  }
  setUpdate(funcFormEditModify, funcDbUpdate, textButton = 'Modify',){
    this._dev.update.funFrm = funcFormEditModify
    this._dev.update.funDb = funcDbUpdate
    this._dev.update.txtBt = textButton
    this._dev.update.isOn = true
  }
  setDelete(funcDbDelete, textButton = 'Delete', textConfirm = 'Delete Record?' ){
    this._dev.delete.funDb = funcDbDelete
    this._dev.delete.txtBt = textButton
    this._dev.delete.txtConfirm = textConfirm 
    this._dev.delete.isOn = true
  }
  setRead(funcSearchAndShow, boolShowInputBox, textButton = 'Search', ){   // , inputBox default?  ,txtHint?)
    this._dev.read.funRead = funcSearchAndShow
    this._dev.read.txtBt = textButton
    this._dev.read.inputBoxOn = boolShowInputBox
    this._dev.read.isOn =true
  }
  setNav(funcMoveFirst, funcMovePrev, funcMoveNext, funcMoveLast){ //} textButtonFirst = '&lt;&lt;', textButtonPrev = '&lt;', textButtonNext = '&gt;', textButtonLast = '&gt;&gt;' ){ 
    this._dev.nav.funMvFrst = funcMoveFirst
    this._dev.nav.funMvPrev = funcMovePrev
    this._dev.nav.funMvNext = funcMoveNext
    this._dev.nav.funMvLast = funcMoveLast
    this._dev.nav.isOn = true    
  }
  setExit(funcExit, textButton = 'Exit', textConfirmExit = 'Exit?'){
    this._dev.exit.funExit = funcExit
    this._dev.exit.txtBt = textButton
    this._dev.exit.txtConfirm = textConfirmExit
    this._dev.exit.isOn = true
  }

  addCustomButton(name, className, text, activeModesBinarySum, title = '', onclick){
    let bt = document.createElement("button") 

    bt.name = name 
    bt.className = className 
    //bt.value = value 
    //bt.innerHTML = text
    bt.textContent = text
    bt.id = name 
    bt.title = title
    bt.onclick = onclick   
    bt.type = "button" 
    bt.dataset.modes = activeModesBinarySum  
    bt.disabled = true 

    this.customButtons.push(bt) 
    return bt 
  }

  // setWait or setWaitForResult, should rename to.
  // set/resets waiting,  displays waiting panel,   
  _setResultCaller(caller, modeSuccess = null, modeFail = null ){        
    // caller, just a name to show, or check for empty. 
    // the 3 params stored in _resultCall[] for sendResult() to use. 

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
      return
    }

    //set
    this._resultCall = [caller, modeSuccess, modeFail]
    this._enablePanel(this._panel.PANELS.WAITING)
  }

  // triggered by dev  
  // Change the crudpad status from waiting to some mode.  Results from db operations  true/false (ok/err)
  sendResult(success, msg =''){    // success = true/false    msg = optional text msg.
    //check
    if (this._resultCall[0] == '' ){
      this.hey( (success)?'Unexpected success from server':'Unexpected error from server' ) 
      return
    }

    // panel softConfirm active?  WHAT TO DO...  AWAIT? 
    //        If mine, it is timeout, it's ok if overwriten. 
    //        If dev's...  sendResult is more important so kill anyway.
    if (this._panel.current === this._panel.PANELS.CONFIRM){
      this.softConfirm('')  //  reset
    }

    //panel wait  off
    this._enablePanel(this._panel.PANELS.CRUD)

    // success [1] unsuccessful [2]
    this._changeMode(this._resultCall[ (success? 1 : 2) ])    

    //reset result wait 
    this._setResultCaller('')

    if (msg > '' ) {this.hey(msg)}
  }

  
  //  ------------------
  _changeMode(newMode){      // *** enable/disable buttons and div depending on MODE ***

    // buttons use disabled attr, divs use css class
    // Tests are masks of bynary flags. Dont be tempted to put "||" (logical OR) instead of bynary sum, it WILL fail.

    //check
    const oldMode = this._mode
    if (newMode == null ) return      //magic? why? isnt it an err?
    if (oldMode == newMode) return     

    this._mode = newMode 

    // for easy             // logical ADD and AND.   dont try to fix doing OR ||
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
          this._enableDiv(this.divCustom, tstActive > 0) 
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

    //user form
    if (stNoEditing)  this._dev.control.funFrmBlockAll()
    if (this._mode == this.MODE_LIST.IDLE )  this._dev.control.funFrmErase()

  }
  
  
  _enableElement(element, conditionToEnable){  // buttons and fieldsets,  enable or disable
    if (isObj(element)){
      element.disabled = !conditionToEnable
      return conditionToEnable 
    }
    return false 
  }

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
            div.style.visibility = 'visible'    
        //}
    }else{              //borrar
        //if (div.style.display != 'none') {
            div.style.visibility = 'hidden'    
        //}
    }
  }


  _letsMakeCrudpadHTML(){ 

    // MAIN- 
    this.divMain = this._makeElement(this, 'form', 'div_main', 'div_main', )   /// what is -this- 

    //  MAIN-div1  ----------- 1st line:  search, crudbut, usrbut, ok/cancel --------------
    this.div1 = this._makeElement(this.divMain, 'div', 'div_1', 'div_1' )
    // MAIN-div1-divSearch
    if (this._dev.read.isOn){ //this._implementedRead ){  
      this.divSearch = this._makeElement(this.div1, 'div', 'div_search', 'div_search')
      this.btSearch = this._makeButton(this.divSearch, 'cmd_search', this._dev.read.txtBt,) 
      if ( this._dev.read.inputBoxOn ){   // with input text? 
        this.inpSearch = this._makeElement(this.divSearch, 'input', 'inp_search' ) 
      }
    }
    //MAIN-div1-divCrud
    // if(this._implementedCreate || this._implementedUpdate || this._implementedDelete  ){
      if(this._dev.create.isOn || this._dev.update.isOn || this._dev.delete.isOn){
        this.divCrud = this._makeElement(this.div1, 'div', 'div_crud', 'div_crud' )
      //create
      // if ( this._implementedCreate ) {  
      if ( this._dev.create.isOn ) {  

        this.btNew = this._makeButton(this.divCrud, 'cmd_New', this._dev.create.txtBt,) 
      }
      //mod
      // if ( this._implementedUpdate  ) {  
      if (this._dev.update.isOn) {  
          this.btModi = this._makeButton(this.divCrud,'cmd_modi', this._dev.update.txtBt,) 
      }
      //del
      // if ( this._implementedDelete ) {
      if ( this._dev.delete.isOn ) {
          this.btDel = this._makeButton(this.divCrud, 'cmd_del', this._dev.delete.txtBt,) 
      }
    }
    //main-div1-divCustom   
    if( this.customButtons.length > 0 ){
      this.divCustom = this._makeElement(this.div1, 'div', 'div_custom', 'div_custom')
      for(let bo of this.customButtons){
        this.divCustom.appendChild(bo)    
      }
    }
    //main-div1-divOkCancel
    // if( this._implementedCreate || this._implementedUpdate){    
    if( this._dev.create.isOn || this._dev.update.isOn){    
      this.divOkCancel = this._makeElement(this.div1, 'div', 'div_okcancel', 'div_okcancel')    
      this.btOk = this._makeButton(this.divOkCancel, 'cmd_ok',  this._dev.crudOkCancel.txtBtOk)  
      this.btCancel = this._makeButton(this.divOkCancel, 'cmd_cancel', this._dev.crudOkCancel.txtBtCancel,) 
    }

    // main-div2     group 2 -------  2d line,  nav, msg, exit ------------
    this.div2 = this._makeElement(this.divMain, 'div', 'div_2', 'div_2')
    //main-div2-divNav
    // if(this._implementedNav){
    if(this._dev.nav.isOn){
        this.divNav = this._makeElement(this.div2, 'div', 'div_nav', 'div_nav',)    
      //main-div2-divNav-movFirst
      if (isFun(this._dev.nav.funMvFrst)){
        this.btMoveFirst = this._makeButton(this.divNav, 'cmd_movfrst',  '<< ', 'Move First') 
      }
      //main-div2-divNav-movPrev
      if (isFun(this._dev.nav.funMvPrev)){
        this.btMovePrev = this._makeButton(this.divNav, 'cmd_movprev', ' < ','Move previous' )  
      }
      //main-div2-divNav-movNext
      if (isFun(this._dev.nav.funMvNext)){
        this.btMoveNext = this._makeButton(this.divNav, 'cmd_movnext', ' > ', 'Move next' )  
      }
      //main-div2-divNav-movLast
      if (isFun(this._dev.nav.funMvLast)){
        this.btMoveLast = this._makeButton(this.divNav, 'cmd_movlast',  ' >> ', 'Move Last')   
      }
    }
    //main-div2-divMsg
    this.divMsg = this._makeElement(this.div2, 'div', 'div_msg', 'div_msg',) 
    this.pMsg = this._makeElement(this.divMsg, 'p', 'p_msg')  
    this.pMsg.textContent = ' '   

    //main-div2-divExit
    if (this._dev.exit.isOn) {
      this.divExit = this._makeElement(this.div2, 'div', 'div_exit', 'div_exit',)    
      this.btExit = this._makeButton(this.divExit, 'cmd_exit', this._dev.exit.txtBt )   
    }

    //main-divYesNo               ----hides div1 & div2 when showing-----
    this.divConfirm = this._makeElement(this.divMain, 'div', 'div_confirm', 'div_confirm', )
    this.pConfirmMsg = this._makeElement(this.divConfirm,'p','p_confirmmsg', 'p_confirmmsg')
    this.btConfirmYes = this._makeButton(this.divConfirm, 'cmd_yes', this._dev.confirm.txtBtYes, )  
    this.btConfirmNo  = this._makeButton(this.divConfirm, 'cmd_no' , this._dev.confirm.txtBtNo,  )  
 
    //main-divWaiting        
    this.divWaiting = this._makeElement(this.divMain, 'div', 'div_waiting', 'div_waiting')
    this.svgThing = this._makeElement(this.divWaiting, 'svg','svg_thing', 'svg_thing')
    this.btTired = this._makeButton(this.divWaiting, 'cmd_tired', this._dev.bored.txtButton, ) 

    //  need something else, something prettier
    this.svgThing.innerHTML = this._svg.svgCloud 

    this.divMain.onclick = (event)=>{this._divMain_onclik(event)}     

  }
  _divMain_onclik(event){
    const classBtCrud = this._classes.button_crud 

    let target = event.target.closest('button')
    if (!target) return
    if (!target.classList.contains(classBtCrud)) return 
    if (target.disabled) return

    let fun = onReturn(target,        
 
      // I wont use an insanely long function!!!  (longer with switch-case)
      // JS should HIDE _bt() funtions, not me!!! The many _bt() stay.

      this.btSearch,     ()=>{this._btSearch()},   // ()=>{()=>{}()} !!!???  me cago en el yavascrít
      this.btNew,        ()=>{this._btNew()},  
      this.btModi,       ()=>{this._btModi()}, 
      this.btDel,        ()=>{this._btDel()},
      this.btOk,         ()=>{this._btOk()}, 
      this.btCancel,     ()=>{this._btCancel()},
      this.btMoveFirst,  ()=>{this._btMoveFirst()},
      this.btMovePrev,   ()=>{this._btMovePrev()},
      this.btMoveNext,   ()=>{this._btMoveNext()},
      this.btMoveLast,   ()=>{this._btMoveLast()},
      this.btExit,       ()=>{this._btExit()},
      this.btConfirmYes, ()=>{this._btConfirmYes()}, 
      this.btConfirmNo,  ()=>{this._btConfirmNo()},  
      this.btTired,      ()=>{this._btTired()},    
    ) 
    if (isFun(fun)){
      fun()
      return
    } else {
      wtf("int err: not found button " + target)
      return
    }
  }

  _makeElement(context, elemtype, id, initialClass = '',   ) {    
    let e = document.createElement(elemtype)
    e.className = initialClass
    if (id != undefined) {e.id = id}
    context.appendChild(e)
    return e
  }

  _makeButton(context, id, text, title = ''){
    let bt = document.createElement('button') 
    
    bt.id = id   
    bt.type = 'button' 
    bt.disabled = false 
    bt.className = 'button_crud'
    // bt.onclick = onclick  //  testing DELEGATION   --------------------------------------------
    bt.title = title
    bt.textContent = text

    context.appendChild(bt) 
    return bt
  }
})
//** ******************************************************************************************************************** */
// Li-brary
// can I do this, here? are they global now?    Update: No. They are not.   Update: YES THEY CAN BE, YOU CANT FORCE TO BE A MODULE!
function isObj(what){return typeof what == 'object'   }   // NEVER the f. parameters inside ' ' !!! Hate you js.  
function isFun(what){return typeof what == 'function' }

// I hate switch case too.
function onReturn(que, ...casePair){           // stolen from Wang2200 Basic,  easier to read
  //acts as: switch (what,  ...case, some+break,  case, some+break,  case, some+break...)
  for (let i = 0; i < casePair.length;  i += 2 ){
    if (que == casePair[i])  return casePair[i+1] 
  } 
  return null
} 
function wtf(what){   // breakpoint
  if (_DESPIOJANDO) {
    console.log(what)
  }
  throw new Error(what) 
}
