
**litul-crudpad**


CRUD PAD  htmlElement, 

My very first js project  html-css-js vanilla, doing-learning js same time.
Thanks to javascript.info. The site is great.

Warning
Still LEARNING process.
There should be a better tool...  and far more complete and integrated frameworks over there---
This is just a practice field.
For now.

Started on
April 9, 1819 

By
Joaquin Elio 'Lito' Fernandez


**What is**

A panel with buttons. Yes. That's it.
  For 
  CRUD operations (with Ok/Cancel buttons when needed)  and
  DB search/show/navigation

JUST the buttons. No form editions, No sql nor callback code here. That's on you, dev.

These buttons have behaviour althougth.  They show up, hide, enable/disable themselves automatically depending on: 
  panel status (idle, showing, editing) and
  the functions actually implemented by dev (search, create, update, remove, nav)

Pretty rigid. Not a tool for creating new stuff


**The story**

First, abstractions.  I dont see good ones, this will be. Talking Crud.

Second, I still see too many unresponsive buttons over there, 
when dev forgets the user while doing fancy server ops.
Well, this should be responsive.  Both, appeareance AND commands behaviour. 

Clean and simple, leaving dev to just write the
  DB   (insert, update...) 
and 
  Form (form show, form edit ) 
operations, passed as function parameters


**How to**

Each CRUD and the NAV operations has to be implemented by its method (i.e. .implementCreate())

Dev has to code the functions to perform the very specific task and pass them as a function parameter.
Example for CREATE: passing two functions, pretty pure:  
 1) For drawing a form with the input controls,  
 2) For checking data and doing the SQL (or nosql)  insert.
NO onclick listening, no taking care of buttons status.

Dev has to manage the cb and inform the panel its result
You have to inform me if it was a success:

    db.requestsomething()
    db.onsuccess = (){ crudpad.result(true) }
    db.onerror =   (){ crudpad.result(false, "I'm so, so sorry")}


**JavaScript thoughts**

Learning...
I learn to hate JS. 2 Months.
So far 
...  5 real bugs, real errors, real learning.
... 63 from spelling. My mistakes. But a TOTAL FAILURE FROM JS LANG.
The found spell bugs is a problem, exhausting and time consuming.
The biggest problem is for those you didnt find. You NEVER know when it's finished, cause never finish. 
Any untested line is a treath, any mod you do you can reintroduce same bugs. It is crazy.
Only bet is rely on frameworks and strong styling.
Maybe better is to try to switch to TS from MS, they seem to know the importance of types.  
Parameters inside quotes? What a source of problems.

    mode = 'idle' 
Tried:

    MODES = {'IDLE':1, 'SHOW':2, 'CREATE':4, 'MODIFY':8,}
    mode = MODES.IDLE
but you are never protected cause you can do everything anyway.
so
    **JS, the freedom to step on the flowers.**
      

Async.
Trap for newbies usually said.  I fell down too.
Because. The many training courses that don't have the word "ASYNC" in their very first sentence are wrong.
Async is great, great.  No need to fork a thread and wait.
You are the boss
You dont tell your minions what to do then sit and wait until they finish.
You send them to work with a list, 
and go and do another boss thing.
With sometimes the philosophical issue:
    **Now it is doing nothing, but nothing is wrong.**
