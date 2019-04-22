# litul-crud

CRUD PANEL  htmlElement, 

My very first js project  html-css-js vanilla, doing-learning js same time 
Thanks javascript.info it's great.

Warning
---There should be better a tool, better yet, far more complete and integrated frameworks over there---
It's just a practice field.
For now.

Dedicated to DEV, my imaginary friend the developer (mostly myself).

Started on
April 9, 1919

By
Joaquin Elio 'Lito' Fernandez


***What is***
===
A panel with buttons. Yes. 
  For 
  CRUD operations (with Ok/Cancel buttons when needed)  and
  DB search/show/navigation

JUST the buttons.   No form editions, No sql nor callback code here. That's on you, dev.

These buttons have behaviour althougth.  They show up, hidd, enable/disable themselves automatically depending on: 
  panel status (idle, showing, editing) and
  the functions actually implemented by dev (search, create, update, remove, nav)


***The story***
===

First, abstractions.  I dont see good ones, this will be. Talking Crud.

Second, I still see too many unresponsive buttons over there, 
when dev forgets the user while doing fancy server ops.
Well, this should be an unattended client side behaviour controlled locally.
**NO onclick listening nor bother in enabling-disabling-hidding elements** 
Clean, simple, reusable, leaving dev to just write cleaner:
  DB (insert, update...) and 
  Form (form show, form edit ) 
operations, passed as function parameters

I use to talk about SQL but it can use any kind of data op (mongo, json). I just refer it as DB

*** How  ***

Each CRUD and the NAV operations has to be implemented by its method (i.e. .implementCreate())

Dev has to code the functions to perform the very specific task and pass them as a function parameter
example for CREATE: passing two functions: prety pure: 
  One for drawing a form with input controls,  
  the other one for checking data and doing the Sql insert.
NO onclick listening, no taking care of buttons status.
But dev has to manage the cb and inform the panel its result.
  .response(msg)    // msg  true false for now...  my intuition tells me it is not enough



***let's do***        ---a limpiar de acá  ==> log.txt
===

Still thinking process. CB makes me nervous.

Still thinking how to feedback ops. How to manage callback...  yet KISS.

Status WAITINGSERVER, a 5ft status or a special status? To define.

What about ERRORS. Mmm....

So far, only 5 optional methods to implement by the developer.  Looks good.
Up to 11 optional functions to implement, CLEAN nearly pure functions.  


What about msgs. 
  a better confirm() inside panel. 
  Msgs confirmation goes inside implementXxx ?  
  implementRemove(,,,
    txtMsgConfirmDelete = 'Confirm deletion?'  ,
  ) 

What about button names, should I put inside implementXxx() too?  
  implementCreate(,,,,
    txtButtonNew = 'New',
  )     
  and maybe
  .implementGeneralSettings(   // The only one Mandatory?
    funcEraseForm,      // Mandatory. code for closing/cleaning show/edit form. Avoids dirty views.
                        // called first showup and whenever status goes to idle- 
    txtButtonOk,
    txtButtonCancel, 
    etc...
  )
  or just leave them as properties  .msgConfirmExit, .txtButtonOk, ...


Azure devops, github... How do they keep version history? To check.  


***What dev should see and fill***
===

// It'll need a way to do an EMPY view: when first shows, when the user cancels edition, when a painting fails. 
// so this method is mandatory:
.implementFormControl( // Neither CRUD nor NAV, but the only one mandatory.

    funcEraseForm,  // code for closing/cleaning any show/edit frm. To show emptyness. This avoids dirty views.
                    // It's called first showup and whenever status goes to idle- 
    funcBlockForm,  // code to block further editions, either disabling all inputs or disabling the entire form
                    // WITHOUT erasing the data in the input elements.               
)

// These 5 methods implement bahaviour and they all are optional.
.implementCreate(
  funcCreateFormEditNew,  // local code htm form for edition, can control inputs, NO DB ops just edit
  funcCreateDbInsert,     // code that reads the form, check, and do the sql insert
  txtButtonName,           // optional, default = "New"
)

.implementUpdate(
  funcUpdateFormEditModify,
  funcUpdateDbUpdate,
  txtButtonName,         // optional, default = "Modify"
)

.implementRemove(
  funcRemoveDbDelete,     // Code for sql delete showing record.
  txtButtonName,           // Optional, default = "Delete"
)

.implementSearch(
  funcSearchAndShow,    //code that opens a search form  then displays data  
  bolInputBox,          // optional, if true puts an input box next to the search button,
                        // its content is passed as param to funcSearchAndShow(inputElement.innerText) 
                        // so dev can directly search for what's written there.
  txtButtonName,         // optional, default = "Search"  
)

.implementNav(
  funcNavMoveFirst,   
  funcNavMovePrev,
  funcNavMoveNext,
  funcNavMoveLast,  // optional, all of them. 
                    // Code for  << < > >>.  
                    // Can be single records step 1 or grid step many, 
                    // case grid, there MUST be always ONE and ONLY ONE selected for the panel to work well.
  arrayButtonNames, // Optional, default = [ '<<' , '<' , '>' , '>>' ]
)

.operationResult(msg)  // To inform the panel so it can change its status. It should be an answer for a CB.
    //  msg = i dont know yet.  true/false, or an ENUM.  
    //  I think It'll be obvious only with the project more advanced. I'll start with bool. 


.setAllButtonsInnerHTML (txtButtonOk, txtButtonCancel, ... )  // I think it's clean to have the option .
    // so dev can put icon and SVGs in one place.  Do I need to be careful InnerHTML dsnt overwrite too much? 




*** --- ***
*** Log ***    -----A sacar de acá  ==>> log.txt 
*** --- ***

19-04-17

Break is over.  My sinusitis isn't.  Wanna drill a hole in my head to release... something, anything. Ibuprofeno wont be any help, unless stomach ache become more painful than eyes pain.

Cant help with callback... What if I do a "litul-Form element"?  It should understand "edit mode", "idle mode",
and an special "disabled mode" that wont enable until it receives the msg "paint this THEN enable yourself"
Should I study frameworks with "html templates"?

WTF class get, set...  let  x.status = x.list.nnn ????
to study... again.







19-04-13

html and js app for the crud panel test. 
Harder than I thought, how to test one each other wo finishing them first  

humpf.  Timeout call!!!  
Need to get cb & dom events better.  freecodecamp sucks here. 
You dont want the user clicking "modify" before the input elements are filled!
javascript.info , I'm going.  



19-04-12

Still thinking phase.
Methods:
1 method to add custom buttons. (without it the panel would be too restrictive )
  onclick is all yours, dev.
  One extra property:  The status (IDLE, SHOWING, EDITING) on wich these buttons would be enabled   

6 methods to define the panel:  paint empty, create, update, remove, search&show, nav.

1 method to tell the panel the result of any op so it can change its status.  
  The result follows the CB that dev should put in its funtions.  
    Still raw.
     To define: 
     Is it ok to receive just true/false for operation sucessful? 
     OR  
     Do I need to check an unexpected result?
          RESULT_MSG = { CREATE_OK, CREATE_FAIL, UPDATE_OK, ...  DRAW_OK, ... etc... }

1 method, optional, to overwrite all buttons names at once (or icons, or svg) 'ok' 'cancel' 'yes' 'no' 'new'...
  Other L&F should be via css I suppose.

more:

set properties for buttons? Maybe not, three options is too much. 
Better Use the method, These four at the beggining.  
  .txtButtonOKname = 'Ok'             // ok / cancel, 
  .txtButtonCancelName = 'Cancel'
  .txtButtonConfirmYesName = 'Yes'   // I hate browser confirm()
  .txtButtonConfirmNoName = 'No'

-When the user is modifying and cancels , status go IDLE and form emptied.  
    Maybe I should give dev option to redraw showing record... not posible if I only have .opResult(false)   

Still Dont like names.        Edit: I DONT CARE! They are just parameter names.
  funXXX_DbXXX()  funcXXX_FormXXX()
  funcXXX_ related to the corresp implementXXX(), 
  then _Dbxxx or FormXXX, form or sql specific op.  Mmm...

Close to the REAL start



19-04-10
to define:

-via events to listen, like an oop interface? (My original VB6 menuABM interface) -I Still dont know how to-  
-via functions as properties?  sounds dirty but js devs are very familiar with them
  like this     crudPanel.funcFormEditNew =  ()->{//displays html for edition }
                crudPanel.funcSqlInsert   =  ()->{//sql insert code}
-via functions as parameters? cleaner
  like this    crudPanel.implementCreate(funcFormEditNew, funcSQLinsert)
-error and feedback management HOW TO!!!!????
  Still thinking how to feedback. How to manage callbacks...  yet KISS. WHERE TF put them?

Maybe:
create custom buttons (onclick will be all yours) able to respond to the panel status  
(i.e.  "Export to xx", only enabled when "showing" status; "Paste from" only in "editing" status )  



19-04-09
linea hecha en casa con  VS CoDE 
  a ver como joraca se manda
  que corno significa stage 
  
  