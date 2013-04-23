There's no built-in garbage collection for Backbone’s event bindings, and 
forgetting to unbind can cause bugs and memory leaks.

Backbone Support currently provides two utility classes, SwappingRouter and CompositeView,
that introduce a `leave()` function, which unbinds and cleans up the view.
They should be used where views are instantiated (in Router instances and in composite views).

Inspired by our projects and the Backbone.js on Rails book:
http://workshops.thoughtbot.com/backbone-js-on-rails

The book contains complete instructions and in-depth coverage of the internals
of CompositeView and SwappingRouter, and an example application that shows
their usage.

### SwappingRouter

A Router subclass the provides a standard way to swap one view for another.

This introduces a convention that all views have a `leave()` function,
responsible for unbinding and cleaning up the view. And the convention that
all actions underneath the same `Router` share the same root element, and
define it as `el` on the router. Additionally, the render method for every
view must return that view (a fairly standard backbone convention).

Now, a `SwappingRouter` can take advantage of the `leave()` function, and
clean up any existing views before swapping to a new one.  It swaps into a new
view by rendering that view into its own `el`:

    swap: function(newView) {
      if (this.currentView && this.currentView.leave) {
        this.currentView.leave();
      }

      this.currentView = newView;
      $(this.el).empty().append(this.currentView.render().el);
    }

An example SwappingRouter would look as follows:

    Trajectory.Routers.Stories = Support.SwappingRouter.extend({
      initialize: function(options) {
        this.el = $("div.primary_content");
      },
      routes: {
        "stories": "index",
        "stories/new": "newStory"
      }
      index: function() {
        var view = new Trajectory.Views.StoriesIndex();
        this.swap(view);
      },
      newStory: function() {
        var view = new Trajectory.Views.StoryNew({ model: new Story() });
        this.swap(view);
      }
    }

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
