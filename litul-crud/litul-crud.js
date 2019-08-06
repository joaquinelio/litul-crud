
  /* Lituls
      litul-crudpad  HTMLelement  

      started on april 1419           before Cristoforo Colombo

      by
      Joaquin Elio "Lito" Fernandez,  Elio de Buenos Aires...
  */

"use strict"   //  strict? STRICT???  Kidding me.

const _DESPIOJANDO = true    //  itchy


window.customElements.define('litul-crudpad', class extends HTMLElement {

  constructor(){
    super()  

    this.crudButtons = {}      // internal, exposed for easy apeareance tuning. Dev, DONT change behaviour (onclick, enable)
    this.customButtons = {}    // custom, created by .setCustomButton.  Everything else is on you, Dev.   

    this._mode = 0             // 0=invalid on purpose.  Dont '.IDLE' here so it SETS things to idle on first run   
    
    // dev's set stuff.  Just a var repository. These obj match dom obj. Should I extend shadow dom, add props there? NO WAY.  Only if I had my own dom.
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
        txtConfirm : '',
      },
      read:{
        isOn : false,
        inputBoxOn : false,
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
        txtConfirm : 'Exit?',
        funExit : null,
      },
      crudOkCancel:{
        txtConfirmCancel : 'Cancel edition?',
        txtMsgCancelDone : 'Canceled',
      },
      confirm:{ 
        funYes : null,
        funNo : null,
      },
      bored:{
        txtConfirm : "Stop the wait? It won't stop the request.",
        dbTimeout : 1000,
        timer : null,
      }, 
      perm: {     // not in use yet
        bCreate: true,
        bRead: true,
        bUpdate: true,
        bDelete: true,
      },

    }

    // panels:   3 panels. Restore means recover last panel.
    //                                          (I should unify all panel stuff)
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
      msg_flash : 'msg_flash',
    }

    // dibujitos  // not a good place to put'em. 
    //
    this._svg = {
      cloud : 
        '<svg height="100%" >'+
        '<ellipse fill="#aa55aa" cx="161" cy="72" rx="99" ry="36"/>'+
        '<ellipse fill="#bb55bb" cx="183" cy="55" rx="70" ry="40"/>'+
        '<ellipse fill="#bb55bb" cx="122" cy="61" rx="54" ry="30"/>'+
        '</svg>',

    }
    //  object 
    //  only one in the project.    Sets the wait for cbResult(), switches panels /crud/wait/
    this._resultCaller = {        
      caller : '',     // any text, msg for debug/ usrmsg/   
      modeOk : null, 
      modeFail : null,
      t: this,        // this, this is crazy. But it works.
      isEmpty(){
        return this.caller === ''
      },
      set(mcaller, mOk = null, mFail= null) { 
        if( !this.caller === '') {wtf(`int err:_resulCall ${this.caller} already set ${mcaller}`); return null }
        this.caller = mcaller; this.modeOk = mOk; this.modeFail = mFail 
        this.t._enablePanel(this.t._panel.PANELS.WAITING)  
      },
      reset(){
        if(this.caller === '') {wtf('int err:_resulCall already empty')}
        this.caller = ''; this.modeOk = null; this.modeFail = null
        this.t._enablePanel(this.t._panel.PANELS.CRUD)
      }
    } 
 
    this._letsDoHTML_gen()  // template? separated html file?  I didnt like the test .

  } // end constructor



  get mode(){              // Current mode.    readonly for dev. 
    return this._mode
  }
  get MODE_LIST() {return {
    IDLE: 1, SHOW: 2, CREATE: 4, MODIFY: 8,    // 4 real modes: 1 2 4 8
    NONE: 0, NOEDIT: 3, EDIT: 12, ALL: 15      //added EDIT 8+4, NOEDIT 1+2, ALL 1+2+4+8  // never iterate so shouldn hurt   
  }}

  get dbTimeout(){
    return this._dev.bored.dbTimeout
  }
  set dbTimeout(milisecTimeout){
    if (Number(milisecTimeout) > 0)   this._dev.bored.dbTimeout = milisecTimeout
  }

  /*  ---------- txt translation ------------------  */
  setText_okCancel(txtBtOk = 'Ok', txtBtCancel = 'Cancel', txtConfirmCancel = 'Cancel edit?', txtMsgCanceled = 'Canceled'){
    this.btOk.textContent = txtBtOk
    this.btCancel.textContent = txtBtCancel
    this._dev.crudOkCancel.txtConfirmCancel = txtConfirmCancel
    this._dev.crudOkCancel.txtMsgCancelDone = txtMsgCanceled
  }
  setText_crud(txtBtCreate = 'New', txtBtRead = 'Search', txtBtUpdate = 'Modify', txtBtDelete = 'Delete', txtConfirmDelete = 'Delete record?'){
    this.btCreate.textContent = txtBtCreate
    this.btRead.textContent = txtBtRead
    this.btUpdate.textContent = txtBtUpdate
    this.btDelete.textContent = txtBtDelete
    this._dev.delete.txtConfirm = txtConfirmDelete
  }
  setText_bored(txtBoredButton = "I'm bored", txtBoredConfirm = "Stop the waiting? It won't stop the request."){
    this.btTired.textContent = txtBoredButton
    this._dev.bored.txtConfirm = txtBoredConfirm
  }
  setText_confirm(txtBtYes = 'Yes', txtBtNo = 'no'){
    this.btConfirmNo.textContent = txtBtNo
    this.btConfirmYes.textContent = txtBtYes
  }
  setText_exit(txtBtExit = "Exit", txtConfirmExit = "Confirm exit?"){
    this._dev.exit.txtConfirm = txtConfirmExit
    this.btExit.textContent = txtBtExit
  }
  setText_nav(txtBtFrst = '<<', txtBtPrev = '<', txtBtNext = '>', txtBtLast = '>>'){
    this.btMoveFirst.textContent = txtBtFrst
    this.btMovePrev.textContent  = txtBtPrev
    this.btMoveNext.textContent  = txtBtNext
    this.btMoveLast.textContent  = txtBtLast
  }
   

  //  crudpad *onclick* functions  hidden from Dev  (SHOULD be hidden.  js...)
  //  they fire dev stuff, set the wait for result(), response to user interaction, change mode, en/disable buttons according that result()   
  //
  
  _btCreate(){
    this._resultCaller.set('frmNew', this.MODE_LIST.CREATE, this.MODE_LIST.IDLE )     
    this._dev.create.funFrm()
  }
  _btRead(){
    this._resultCaller.set('search', this.MODE_LIST.SHOW,)   //  ,MODE_LIST.IDLE)? no. if it fails, nothing. User decides, not Dev's.
    this._dev.read.funRead(this.inpRead.value)  // input param if any
  }  
  _btUpdate(){
    this._resultCaller.set('frmMod', this.MODE_LIST.MODIFY, this.MODE_LIST.IDLE )  
    this._dev.update.funFrm()
  }  
  _btDelete(){
    this.softConfirm(
      this._dev.delete.txtConfirm,
      ()=>{
        this._resultCaller.set('dbDelete', this.MODE_LIST.IDLE,)   // if err keeps showing 
        this._dev.delete.funDb()
      },
      ()=>{}       // no, stays the same
    )
  }
  
  _btOk(){
    if(this.mode == this.MODE_LIST.CREATE){
        this._changeMode(this.MODE_LIST.SHOW)   // prevent furter changes
        this._resultCaller.set('dbInsert', this.MODE_LIST.SHOW, this.MODE_LIST.CREATE)  
        this._dev.create.funDb()
    } else if(this.mode == this.MODE_LIST.MODIFY) {
        this._changeMode(this.MODE_LIST.SHOW)   // prevent furter changes 
        this._resultCaller.set('dbUpdate', this.MODE_LIST.SHOW, this.MODE_LIST.MODIFY)  
        this._dev.update.funDb()
    } else {
        this.hey ('int err: okbutton is neither create nor modify')
    }
  }
  _btCancel(){
    this.softConfirm(
      this._dev.crudOkCancel.txtConfirmCancel,
      ()=>{ 
        this.hey(this._dev.crudOkCancel.txtMsgCancelDone)
        this._dev.control.funFrmErase()
        this._changeMode(this.MODE_LIST.IDLE)
      },
      ()=>{}  //do nothing
    )
  }

  _btMoveFirst(){
    this._resultCaller.set('mvFrst', this.MODE_LIST.SHOW)
    this._dev.nav.funMvFrst()
  }
  _btMovePrev(){
    this._resultCaller.set('mvPrev', this.MODE_LIST.SHOW)
    this._dev.nav.funMvPrev()
  }
  _btMoveNext(){
    this._resultCaller.set('mvNxt', this.MODE_LIST.SHOW)
    this._dev.nav.funMvNext()
  }  
  _btMoveLast(){
    this._resultCaller.set('mvLst', this.MODE_LIST.SHOW)
    this._dev.nav.funMvLast()
  }
  
  _btExit(){
    this.softConfirm(
      this._dev.exit.txtConfirm, 
      this._dev.exit.funExit,
      ()=>{}  
    )
  }

  _btTired(){
    this.softConfirm(
      this._dev.bored.txtConfirm,
      ()=>{ 
        let lastcall = this._resultCaller.caller

        // reset crudpad to idle
        this._changeMode(this.MODE_LIST.IDLE)

        // stop any result waiting 
        this._resultCaller.reset()
        this.hey('Wait from '+ lastcall + ' aborted.')

        //set panel crud
        // this._enablePanel(this._panel.PANELS.CRUD)

        // any other thing I should worry? 
        // ??
      },
      ()=>{}   // nothing to do  
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

    if (panelTo === this._panel.current)   return          

    clearTimeout(this._dev.bored.timer)                   

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
        this._dev.bored.timer = setTimeout(() => {this.btTired.disabled = false}, this._dev.bored.dbTimeout)
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
    //CAREFUL: question is reset if crudpad receives cbResult() before the answer

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
    this.pMsg.classList.add(this._classes.msg_flash )
    setTimeout(() => {
      this.pMsg.classList.remove(this._classes.msg_flash )      
    }, 1000);
  }
  
  // fires crudpad.  Dev uses it when all settings are done.
  start(){
    this._letsDoHTML_enable()
    this._changeMode(this.MODE_LIST.IDLE)
    this._enablePanel(this._panel.PANELS.CRUD)
  }

  // *** implement behaviour ***
  //set control, mandatory.  
  setFormControl(funcEraseFormContent, funcBlockForm, ){ 
    this._dev.control.funFrmErase = funcEraseFormContent
    this._dev.control.funFrmBlockAll = funcBlockForm
  }

  // These 5 methods implement bahaviour and they all are optional.
  setCreate(funcFormEditNew, funcDbInsert, textButton = 'New', ){
    // if ! func throw err...   ??
    this._dev.create.funFrm = funcFormEditNew
    this._dev.create.funDb = funcDbInsert
    this.btCreate.textContent = textButton
    this._dev.create.isOn = true
  }
  setUpdate(funcFormEditModify, funcDbUpdate, textButton = 'Modify',){
    this._dev.update.funFrm = funcFormEditModify
    this._dev.update.funDb = funcDbUpdate
    this.btUpdate.textContent = textButton
    this._dev.update.isOn = true
  }
  setDelete(funcDbDelete, textButton = 'Delete', textConfirm = 'Delete Record?' ){
    this._dev.delete.funDb = funcDbDelete
    this.btDelete.textContent = textButton
    this._dev.delete.txtConfirm = textConfirm 
    this._dev.delete.isOn = true
  }
  setRead(funcSearchAndShow, boolShowInputBox, textButton = 'Search', ){   // , inputBox default?  ,txtHint?)
    this._dev.read.funRead = funcSearchAndShow
    this.btRead.textContent = textButton
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
    this.btExit.textContent = textButton
    this._dev.exit.txtConfirm = textConfirmExit
    this._dev.exit.isOn = true
  }

  addCustomButton(name, className=this._classes.button_crud, text, activeModesBinarySum, title = '', onclick){
    let bt = document.createElement("button") 

    bt.name = name 
    bt.className = className 
    bt.textContent = text
    bt.id = name 
    bt.title = title
    bt.onclick = onclick   
    bt.type = "button" 
    bt.dataset.modes = activeModesBinarySum  
    bt.disabled = true 

    this.customButtons[bt.id] = bt 
    return bt 
  }

  // triggered by dev,  mandatory on every handler.  Result from db cb operation.
  // Change the crudpad status from 'waiting' to some mode.   
  cbResult(success, msg =''){    // success = true/false    msg = optional text msg.
    //check
    if (this._resultCaller.isEmpty() ){
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
    // this._enablePanel(this._panel.PANELS.CRUD)

    // success [1] unsuccessful [2]
    // this._changeMode(this._resultCall[ (success? 1 : 2) ])    
    this._changeMode( success? this._resultCaller.modeOk: this._resultCaller.modeFail)

    //reset result wait 
    // this._setResultCaller('')
    this._resultCaller.reset()

    if (msg > '' ) {this.hey(msg)}
  }

  // Intended for showing "prohibited status" buttons.     //  not in use yet , remove __
  // Just ornamental, not a replace for server auth.
  __setPermissions(bCreate= true, bRead = true, bUpdate = true, bDelete = true){
    this._dev.perm.bCreate = bCreate
    this._dev.perm.bRead = bRead
    this._dev.perm.bUpdate = bUpdate
    this._dev.perm.bDelete = bDelete
  }

  
  //  ------------------
  _changeMode(newMode){      // *** enable/disable buttons and div depending on MODE ***

    // buttons use disabled attr, divs use css class

    // DON'T "FIX":
    //    Tests are masks of bynary flags.  Trying "||" (logical OR) would fail.
    //    Why tstActive?  Checks if at least one.  If none, div CAN hide (dep on media, css to-do )  

    //check
    const oldMode = this._mode
    if (newMode == null ) return      //magic? why? isnt it an err?
    if (oldMode == newMode) return     

    this._mode = newMode 

    // for easy         // logical AND, ( & )   
    const stEditing =   this._mode & this.MODE_LIST.EDIT    // mode new + mod
    const stNoEditing = this._mode & this.MODE_LIST.NOEDIT  //      show + iddle
    const stShowing =   this._mode & this.MODE_LIST.SHOW 

    //div search
    {let tstActive = 0 
      tstActive = 
        this._enableElement(this.btRead, stNoEditing) +
        this._enableElement(this.inpRead, stNoEditing) 
      this._enableDiv(this.divSearch, tstActive > 0)  
    }
    //div crud
    {let tstActive = 0 
        tstActive = 
            this._enableElement(this.btCreate, stNoEditing) +
            this._enableElement(this.btUpdate, stShowing) +
            this._enableElement(this.btDelete, stShowing) 
        this._enableDiv(this.divCrud, tstActive > 0) 
    }
    //div okcancel
    {let tstActive = 0 
        tstActive = 
            this._enableElement(this.btOk, stEditing) +
            this._enableElement(this.btCancel, stEditing) 
        this._enableDiv(this.divOkCancel, tstActive > 0)    // > 0 no haria falta
    }
    // div custom 
    {let tstActive = 0                         //  pfffffff  for()  was easier.   Can I .reduce instead of tstActive+= ?  
      Object.keys(this.customButtons).map( (k)=>{
        tstActive += this._enableElement(
          this.customButtons[k],
          Number( this.customButtons[k].dataset.modes ) & this.mode 
        )
      }) 
      this._enableDiv(this.divCustom, tstActive > 0) 
    }

    //div nav
    {let tstActive = 0
      tstActive =
        this._enableElement(this.btMoveFirst, stNoEditing) +
        this._enableElement(this.btMovePrev,  stNoEditing) +
        this._enableElement(this.btMoveNext,  stNoEditing) +
        this._enableElement(this.btMoveLast,  stNoEditing)
      this._enableDiv(this.divNav, tstActive > 0)         
    }

    //div exit
    this._enableElement(this.btExit, stNoEditing)  

    //user form control
    if (stNoEditing)  this._dev.control.funFrmBlockAll()
    if (this._mode == this.MODE_LIST.IDLE )  this._dev.control.funFrmErase()
  }
  
  
  _enableElement(element, conditionToEnable){  // buttons and fieldsets,  enable or disable
    if (!isObj(element)) return false

    element.disabled = !conditionToEnable
    return conditionToEnable 
  } 

  _enableDiv(div, yesOrNo){  
    //to do: delegate to css 
    //media Screen size: 
    //    big:    via visibility so buttons dont jump, 
    //    small:  via display none to save space    in my 5'' it MAKES difference
    
    if ( !isObj(div) ) return false

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
    return yesOrNo
  }

  _divMain_onclik(event){
    let target = event.target.closest('button')
    if (!target) return
    if (target.disabled) return   // to test!!! , I bet global onclick doesnt care about disabled

    let fun = onReturn(target,        // a just switch-case-break-return replacer
 
      // I wont use an insanely long function!!!  (longer with switch-case)
      // JS should HIDE _bt() funtions, not me!!! The many _bt() stay.

      this.btRead,        ()=>{this._btRead()},   // ()=>{()=>{}()} !!!???  me cago en el yavascrít
      this.btCreate,      ()=>{this._btCreate()},  
      this.btUpdate,      ()=>{this._btUpdate()}, 
      this.btDelete,      ()=>{this._btDelete()},
      this.btOk,          ()=>{this._btOk()}, 
      this.btCancel,      ()=>{this._btCancel()},
      this.btMoveFirst,   ()=>{this._btMoveFirst()},
      this.btMovePrev,    ()=>{this._btMovePrev()},
      this.btMoveNext,    ()=>{this._btMoveNext()},
      this.btMoveLast,    ()=>{this._btMoveLast()},
      this.btExit,        ()=>{this._btExit()},
      this.btConfirmYes,  ()=>{this._btConfirmYes()}, 
      this.btConfirmNo,   ()=>{this._btConfirmNo()},  
      this.btTired,       ()=>{this._btTired()},    
    ) 
  
    ;(isFun(fun))? fun(): 'nofun' // Not my but.
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
    // bt.onclick = onclick  //  testing DELEGATION   ----------------------
    bt.title = title
    bt.textContent = text
    context.appendChild(bt) 
    return bt
  }

  _letsDoHTML_gen(){
    // MAIN- 
    this.divMain = this._makeElement(this, 'form', 'div_main', 'div_main', )  

    //panel crud  -> div1 div2  
    //  MAIN-div1  
    this.div1 = this._makeElement(this.divMain, 'div', 'div_1', 'div_1' )
    // MAIN-div1-divSearch
    this.divSearch = this._makeElement(this.div1, 'div', 'div_search', 'div_search')
    this.btRead = this._makeButton(this.divSearch, 'cmd_read', 'Search',) 
    this.inpRead = this._makeElement(this.divSearch, 'input', 'inp_search' ) 
    //MAIN-div1-divCrud
    this.divCrud = this._makeElement(this.div1, 'div', 'div_crud', 'div_crud' )
    this.btCreate = this._makeButton(this.divCrud, 'cmd_create', 'New',) 
    this.btUpdate = this._makeButton(this.divCrud,'cmd_update', 'Modify',) 
    this.btDelete = this._makeButton(this.divCrud, 'cmd_delete', 'Delete',) 
    //main-div1-divCustom   
    //main-div1-divOkCancel
    this.divOkCancel = this._makeElement(this.div1, 'div', 'div_okcancel', 'div_okcancel')    
    this.btOk = this._makeButton(this.divOkCancel, 'cmd_ok',  'Ok')  
    this.btCancel = this._makeButton(this.divOkCancel, 'cmd_cancel', 'Cancel',) 
    // main-div2   
    this.div2 = this._makeElement(this.divMain, 'div', 'div_2', 'div_2')
    //main-div2-divNav
    this.divNav = this._makeElement(this.div2, 'div', 'div_nav', 'div_nav',)    
    this.btMoveFirst = this._makeButton(this.divNav, 'cmd_movfrst',  '<<', 'Move First') 
    this.btMovePrev = this._makeButton(this.divNav, 'cmd_movprev', '<', 'Move previous' )  
    this.btMoveNext = this._makeButton(this.divNav, 'cmd_movnext', '>', 'Move next' )  
    this.btMoveLast = this._makeButton(this.divNav, 'cmd_movlast', '>>', 'Move Last')   
    //main-div2-divMsg
    this.divMsg = this._makeElement(this.div2, 'div', 'div_msg', 'div_msg',) 
    this.pMsg = this._makeElement(this.divMsg, 'p', 'p_msg')  
    this.pMsg.textContent = ' '   
    //main-div2-divExit
    this.divExit = this._makeElement(this.div2, 'div', 'div_exit', 'div_exit',)    
    this.btExit = this._makeButton(this.divExit, 'cmd_exit', 'Exit')   

    //panel confirm
    //main-divYesNo               ----hides div1 & div2 when showing-----
    this.divConfirm = this._makeElement(this.divMain, 'div', 'div_confirm', 'div_confirm', )
    this.pConfirmMsg = this._makeElement(this.divConfirm,'p','p_confirmmsg', 'p_confirmmsg')
    this.btConfirmYes = this._makeButton(this.divConfirm, 'cmd_yes', 'Yes', )  
    this.btConfirmNo  = this._makeButton(this.divConfirm, 'cmd_no' , 'No',  )  
 
    //panel waiting
    //main-divWaiting        
    this.divWaiting = this._makeElement(this.divMain, 'div', 'div_waiting', 'div_waiting')
    this.svgThing = this._makeElement(this.divWaiting, 'svg','svg_thing', 'svg_thing')
    this.btTired = this._makeButton(this.divWaiting, 'cmd_tired', "I'm Bored", ) 
    this.svgThing.innerHTML = this._svg.cloud     // needing something prettier...
  }

  _letsDoHTML_enable(){        
    // MAIN-div1-divSearch
    this._enableDiv( this.divSearch, this._dev.read.isOn)
    this._enableElement(this.btRead, this._dev.read.isOn ) 
    this._enableElement(this.inpRead,this._dev.read.inputBoxOn )
    //MAIN-div1-divCrud
    let tst =(this._dev.create.isOn || this._dev.update.isOn || this._dev.delete.isOn)
    this._enableDiv( this.divCrud, tst)
    this._enableElement(this.btCreate,this._dev.create.isOn )
    this._enableElement(this.btUpdate,this._dev.update.isOn )
    this._enableElement(this.btDelete,this._dev.delete.isOn )
    //main-div1-divCustom     CREATE dev buttoms  
    if( Object.keys(this.customButtons).length > 0 ){
      this.divCustom = this._makeElement(this.div1, 'div', 'div_custom', 'div_custom')
      Object.keys(this.customButtons).map((k)=>this.divCustom.appendChild(this.customButtons[k]))
    }
    //main-div1-divOkCancel
    this._enableDiv(this.divOkCancel, (this._dev.create.isOn || this._dev.update.isOn)) 
    //main-div2-divNav
    this._enableDiv(this.divNav,this._dev.nav.isOn )
    this._enableElement(this.btMoveFirst,(isFun(this._dev.nav.funMvFrst)) )
    this._enableElement(this.btMovePrev,(isFun(this._dev.nav.funMvPrev)) )
    this._enableElement(this.btMoveNext,(isFun(this._dev.nav.funMvNext)) )
    this._enableElement(this.btMoveLast,(isFun(this._dev.nav.funMvLast)) )
    //main-div2-divExit
    this._enableDiv(this.divExit, this._dev.exit.isOn)
    this._enableElement(this.btExit,this._dev.exit.isOn )
    //listen to me!
    this.divMain.onclick = (event)=>{this._divMain_onclik(event)}     
  }
})



//** Modu-lito ******yeah, I should modulize **************************************************************** */
// Li-brary   

// Because I hate quoted parameters.
function isObj(what){return typeof what == 'object'   }    
function isFun(what){return typeof what == 'function' }

// I hate switch case too.
function onReturn(que, ...casePair){           // stolen from Wang2200 Basic,  easier to read
  //acts as: switch (what,  ...case, some+break,  case, some+break,  case, some+break...)
  for (let i = 0; i < casePair.length;  i += 2 ){
    if (que == casePair[i])  return casePair[i+1] 
  } 
  return null
} 

// well?
function wtf(whatNow){   // breakpoint    wtf(msg user, msg dev, err)  
  if (_DESPIOJANDO) {
    console.log(whatNow)


  }
//  throw new Error(whatNow) 
}
