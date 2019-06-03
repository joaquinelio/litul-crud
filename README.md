# litul-crud

CRUD PAD  htmlElement, 

My very first js project  html-css-js vanilla, doing-LEARNING js same time 
Thanks javascript.info, it's great.

Warning
---There should be a better tool...  and far more complete and integrated frameworks over there---
This is just a practice field.
For now.

Dedicated to DEV, my imaginary friend the developer (mostly myself).

Started on
April 9, 1819 

By
Joaquin Elio 'Lito' Fernandez


***What is***
===
A panel with buttons. Yes. That's it.
  For 
  CRUD operations (with Ok/Cancel buttons when needed)  and
  DB search/show/navigation

JUST the buttons.   No form editions, No sql nor callback code here. That's on you, dev.

These buttons have behaviour althougth.  They show up, hidd, enable/disable themselves automatically depending on: 
  panel status (idle, showing, editing) and
  the functions actually implemented by dev (search, create, update, remove, nav)

Pretty rigid. Not a tool for creating new stuff



***The story***
===

First, abstractions.  I dont see good ones, this will be. Talking Crud.

Second, I still see too many unresponsive buttons over there, 
when dev forgets the user while doing fancy server ops.
Well, this should be responsive.  Both, appeareance AND commands behaviour. 
**NO onclick listening nor bother in enabling-disabling-hidding elements** 

Clean, simple, reusable, leaving dev to just write cleaner:
  DB (insert, update...) and 
  Form (form show, form edit ) 
operations, passed as function parameters



*** How  ***

Each CRUD and the NAV operations has to be implemented by its method (i.e. .implementCreate())

Dev has to code the functions to perform the very specific task and pass them as a function parameter
example for CREATE: passing two functions: pretty pure: 
  One for drawing a form with the input controls,  
  the other one for checking data and doing the Sql insert.
NO onclick listening, no taking care of buttons status.

Dev has to manage the cb and inform the panel its result, then
  .result(boolSucces, textMsg)    // true false for now...  I may extend it later.

About crudpad.result(success)
You have to inform me if it was a success
   db.requestsomething()
   db.onsuccess = (){ crudpad.result(true) }
   db.onerror =   (){ crudpad.result(false, "I'm so, so sorry")}

