angular-redactor
================

Angular Redactor is an angular directive for the Redactor editor.  http://imperavi.com/redactor/


Usage
--------------

1. Install redactor: bower install redactor
2. Include the redactor libraries
3. In your angular application register angular-redactor as a dependency.
4. Add the necessary html to view the editor.

Registration

```js

// Angular Registration
angular.module('app', ['angular-redactor']);

```

Bare Minimum Html
```html
<textarea ng-model="content" redactor></textarea>
```

With Options
```html
<textarea ng-model="content" redactor="{buttons: ['formatting', '|', 'bold', 'italic']}" cols="30" rows="10"></textarea>
```

You can pass options directly to Redactor by specifying them as the value of the `redactor` attribute.

Global Options
```js
angular.module('app', ['angular-redactor'])
  .config(function(redactorOptions) {
    redactorOptions.buttons = ['formatting', '|', 'bold', 'italic']; 
  });
```


Check out the demo folder where you can see a working example.  https://github.com/TylerGarlick/angular-redactor/tree/master/demo



Bower Installation
--------------
```js
bower install angular-redactor
```
