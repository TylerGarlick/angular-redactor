[![Stories in Ready](https://badge.waffle.io/TylerGarlick/angular-redactor.png?label=ready&title=Ready)](https://waffle.io/TylerGarlick/angular-redactor)
angular-redactor
================

Angular Redactor is an angular directive for the Redactor editor.  http://imperavi.com/redactor/


Important Changes
--------------

As of version 1.1.0, there is an additional file (angular-redactor-9.x) has been added to accommodate the the 9.x version of redactor, the angular-redactor.js will support the latest version of redactor.


Usage
--------------

1. Include the redactor libraries from http://imperavi.com/redactor/ (The bower version of redactor is unsupported)
2. In your angular application register angular-redactor as a dependency.
3. Add the necessary html to view the editor.

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
