
***litul-crudpad***

CRUDPAD, 
Callback based crud element.

My very first js LEARNING project  

    HTML - CSS - JS vanilla,  
    VS CODE  
    indexedDb app for testing
    client side only (for now) 

Thanks javascript.info   That site is great, it helped a lot.


Started on
April 9, 1419       -- taking longer than I expected --

By
Joaquin Elio 'Lito' Fernandez, Elio de Buenos Aires...


*Finished?*  Not quite.
But it is working nicely. 
Pretty usable html and js, 
css is no longer a chaos but it is UGLY.  Fix css then release, 
I think I'll ask for css help so I do node server part of the project.
Maybe VUE, maybe TS.


###

***What is***

A panel with buttons. That's it.
For 
  CRUD operations  and
  DB search/navigation

JUST the buttons. No form editions, No sql nor callback code here. That's on you, dev.

These buttons have a behaviour althougth.  They show up, hide, enable/disable themselves automatically depending on: 
  +panel status (idle, showing, editing) and
  +the functions actually implemented by dev (create, read, update, delete, nav)

Custom buttons can be added.
Pretty rigid. Not a tool for creating new stuff


***dev stories***

Real abstraction.  I dont see good ones, this hope is. 

Avoid then unresponsiveness 
when dev forgets the user while doing fancy server ops.

Leaves dev to just write handlers for the real job.
 

***How to***

CRUD and NAV operations have to be implemented by their methods
  setCreate(handlers...)
  setRead(...)
  setUpdate(...)

Example for CREATE: 

  crudpad.setCreate(formEdit_Handler, DBInsert_Handler);   

 Param 1: Draws a form with the input controls.      ONLY the form. Leaves it enabled for edit.  
 Param 2: Extract and Checks data from the form, then does the DB add (SQL insert)

NO onclick listening, no taking care of buttons status, 

Dev has to manage the DOM/DB callbacks then inform to crudpad its result.

    db.requestsomething()
    db.onsuccess = (){ crudpad.cbResult(true) }
    db.onerror =   (){ crudpad.cbResult(false, "I'm so, so sorry")}


###

***Warning: Still in the LEARNING process.***

Learning...     ?

I learn to hate JS. 2 Months.
So far 
...10 real bugs, real errors, real learning.
...80+ from spelling. My mistakes. But a TOTAL FAILURE FROM JS LANG.
The found spelling bugs is a problem, exhausting and time consuming.
The biggest problem is for those you didn't find. You NEVER know when it's finished, 'cause it never finishes. 
Any untested line is a treath, any mod you do you can reintroduce same bugs. It is crazy.
Only bet is to rely on frameworks and follow strong styling.
Parameters inside quotes? What a source of problems.
Freedom sucks.      

    **JS, the freedom to step on the flowers.**


Async.

Love it.
You are the boss.
You dont tell your minions what to do then sit and wait until they finish.
You send them to work with a to-do list, 
and go and do another boss thing.
With sometimes the philosophical issue:

    **Now it is doing nothing, but nothing is wrong.**
