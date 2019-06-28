
***litul-crudpad***

CRUD PAD  htmlElement, 

My very first js LEARNING project  

    HTML - CSS - JS vanilla,  
    VS CODE  
    indexedDb app for testing
    client side only (for now) 

Thanks javascript.info.  The site is great, it helped a lot.


Started on
April 9, 1719       -- taking longer than I expected --

By
Joaquin Elio 'Lito' Fernandez


*Finished?*  
Pretty usable html and js, 
css is no longer a chaos but it is UGLY.  Then release. 
I think I'll ask for css help so I do node server part of the project.
Yes, VUE and maybe TS.


###

***What is***

A panel with buttons. That's it.
For 
  CRUD operations (with Ok/Cancel buttons when needed)  and
  DB search/show/navigation

JUST the buttons. No form editions, No sql nor callback code here. That's on you, dev.

These buttons have behaviour althougth.  They show up, hide, enable/disable themselves automatically depending on: 
  panel status (idle, showing, editing) and
  the functions actually implemented by dev (search, create, update, remove, nav)

Pretty rigid. Not a tool for creating new stuff


***dev-user stories***

First, abstractions.  I dont see good ones, this hope is. 

Second, Avoid unresponsive buttons, 
when dev forgets the user while doing fancy server ops.

Simple implementation, leaving dev to just write the
  **DB   (insert, select, update, delete...)** 
and 
  **Form (form show, form edit )** 
operations, passed as function parameters


***How to***

Each CRUD and the NAV operations has to be implemented by its method (i.e. .setCreate())

Dev has to code the functions to perform the very specific task and pass them as a function parameter.
Example for CREATE: passing two functions, pretty pure:  
 1) For drawing a form with the input controls,  
 2) For checking data and doing the db add (or SQL insert)
NO onclick listening, no taking care of buttons status.

Dev has to manage the cb and inform the panel its result
You have to inform me if it was a success:

    db.requestsomething()
    db.onsuccess = (){ crudpad.sendResult(true) }
    db.onerror =   (){ crudpad.sendResult(false, "I'm so, so sorry")}


###

***Warning: Still in the LEARNING process.***

freecodecamp.org is pretty good, 
PERFECT palette (frameworks AND projects I DIDN'T take) if you want to work for someone else
but in the wild, it left me without some fundamentals:
The async nature of JS  (not a word until frameworks section)
cb, async, promises, generators 

javascript.info is much harder.
But it goes DEEP. 
Very good explanations, the what, the how and the why. 
AND it is up to date.   


***JavaScript thoughts***

Learning...
I learn to hate JS. 2 Months.
So far 
...10 real bugs, real errors, real learning.
...80+ from spelling. My mistakes. But a TOTAL FAILURE FROM JS LANG.
The found spelling bugs is a problem, exhausting and time consuming.
The biggest problem is for those you didn't find. You NEVER know when it's finished, cause it never finishes. 
Any untested line is a treath, any mod you do you can reintroduce same bugs. It is crazy.
Only bet is rely on frameworks and strong styling.
Parameters inside quotes? What a source of problems.
Freedom sucks.      

    **JS, the freedom to step on the flowers.**


Async.
You are the boss.
You dont tell your minions what to do then sit and wait until they finish.
You send them to work with a list, 
and go and do another boss thing.
With sometimes the philosophical issue:

    **Now it is doing nothing, but nothing is wrong.**

