# litul-crud

CRUD PANEL  htmlElement, 

My very first js project  html-css-js vanilla, doing-learning js same time 
Thanks javascript.info and freecodecamp.org  they are great.

Warning
---There should be better and far more complete and integrated frameworks over there---
Just a practice field.
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
  CRUD operations (Ok/Cancel buttons when apropiate)  and
  DB search/show/navigation

JUST the buttons.   No form editions, No sql nor callback code here. That's on you, dev.

These buttons have behaviour althougth.  They show up, hidd, enable/disable automatically depending on: 
  panel status (idle, showing, editing) and
  the functions actually implemented by dev (search, create, update, remove, nav)


***The story***
===

First, abstractions.  I dont see good ones, flexible and useful.  This will be. Talking Crud.

Second, I still see too many unresponsive buttons over there, 
when dev forgets the user while doing fancy server ops.
Well, this should be an unattended client side behaviour controlled locally.
**NO onclick listening nor bother in enabling-disabling-hidding elements** 
Clean, simple, reusable, leaving dev to just write cleaner:
  DB (insert, update...) and 
  Form (form show, form edit ) 
operations, passed as function parameters

I use to talk about SQL but it may use any kind of data op  (mongo, json). I just refer it as DB


***let's do***      ---a limpiar de acá  ==> log.txt
===

Still thinking process. CB makes me nervous.

Still thinking how to feedback ops. How to manage callback...  yet KISS.

What about ERRORS. Mmm....

So far, only 5 optional methods to implement by the developer.  Looks good.
Up to 11 optional functions to implement, CLEAN nearly pure functions.  

Still Dont like names. 
  funXXX_DbXXX()  funcXXX_FormXXX()
  funcXXX_ related to the corresp implementXXX(), 
  then _Dbxxx or FormXXX, form or sql specific op.  Mmm...

Wtf funcEraseForm() ??? Maybe It looks better alone outside.
  like:
  .implementIdleForm( // The only one Mandatory?   
    funcEraseForm,    //code for closing/cleaning any show/edit frm. To show emptyness. This avoids dirty views.
                      // called first showup and whenever status goes to idle- 
  )

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

Templates html. Mmm... Here? 

Azure devops, github... How do they keep version history? To check.  


***What dev should see and fill***
===
All of these methods are optional.

.implementCreate(
  funcCreateFormEditNew,  // local code htm form for edition, can control inputs, NO DB ops just edit
  funcCreateDbInsert,     // code that reads the form, check, and do the sql insert
  funcEraseForm,          // code for closing/cleaning form. Avoids dirty views.  
                          // Called when user cancels edition.
)

.implementUpdate(
  funcUpdateFormEditModify,
  funcUpdateDbUpdate,
  funcEraseForm,          // same for Create, no need if it was already implemented there.                 
)

.implementRemove(
  funcRemoveDbDelete,     // Code for sql delete showing record.
  funcEraseForm,          // same for Create, no need if it was already implemented there. 
                          // Called when delete is successful.
)

.implementSearch(
  funcSearchAndShow,    //code that opens a search form  then displays data  
  bolInputBox,          // optional, if true puts an input box next to the search button,
                        // its content is passed as param to funcSearchAndShow(inputElement.innerText) 
                        // so dev can directly search for what's written there.  
  funcEraseForm,                      // WTF again?  
                      // same for Create, no need if it was already implemented there. 
                      // Called when search is unsuccessful
                // To check....  No need maybe. Either search shows something or do nothing, no changes.  

)

.implementNav(
  funcNavMoveFirst,   
  funcNavMovePrev,
  funcNavMoveNext,
  funcNavMoveLast,  // optional, all of them. 
                    // Code for  << < > >>.  
                    // Can be single records step 1 or grid step many, 
                    // case grid, there MUST be always ONE and ONLY ONE selected for the panel to work well.
  funcEraseForm,    // same for Create, no need if it was already implemented there.
                    // Called if nav was unsuccessful
)



*** Log ***    -----A sacar de acá  ==>> log.txt 





190410
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
  
  