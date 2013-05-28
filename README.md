There's no built-in garbage collection for Backbone’s event bindings, and
forgetting to unbind can cause bugs and memory leaks.

Backbone Support currently provides CompositeView,
that introduce a `leave()` function, which unbinds and cleans up the view.
They should be used where views are instantiated (in composite views).

### CompositeView

CompositeView provides a convention for a parent view that has one or more
child views.

This introduces a convention that all views have a `leave()` function,
responsible for unbinding and cleaning up the view.

`CompositeView` provides methods for adding and removing children from the
parent view.

`CompositeView` maintains an array of its immediate children as
`this.children`. Using this reference, a parent view's `leave()`
method will invoke `leave()` on all its children, ensuring that an entire 
tree of composed views is cleaned up properly.

For child views that can dismiss themselves, such as dialog boxes, children
maintain a back-reference at `this.parent`. This is used to reach up and call
`this.parent.removeChild(this)` for these self-dismissing views.

## Dependencies

You'll need these, but chances are you already have them in your app:

* jQuery or Zepto
* Underscore
* Backbone


## License

Copyright 2012 thoughtbot. Please check LICENSE for more details.
