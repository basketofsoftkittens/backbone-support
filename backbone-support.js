define('backbone-support', ['backbone'], function(){
    Support = {};
    Support.VERSION = "0.0.1";

    // Observer
    Support.Observer = function() {};

    _.extend(Support.Observer.prototype, {
      bindTo: function(source, event, callback) {
        source.bind(event, callback, this);
        this.bindings = this.bindings || [];
        this.bindings.push({ source: source, event: event, callback: callback });
      },

      unbindFromAll: function() {
        _.each(this.bindings, function(binding) {
          binding.source.unbind(binding.event, binding.callback);
        });
        this.bindings = []
      }
    });

    // Composite Views
    Support.CompositeView = function(options) {
      this.children = _([]);
      Backbone.View.apply(this, [options]);
    };

    _.extend(Support.CompositeView.prototype, Backbone.View.prototype, Support.Observer.prototype, {
      leave: function() {
        this.trigger('leave');
        this.unbind();
        this.unbindFromAll();
        this.remove();
        this._leaveChildren();
        this._removeFromParent();
      },

      renderChild: function(view) {
        view.render();
        this.children.push(view);
        view.parent = this;
      },

      renderChildInto: function(view, container) {
        this.renderChild(view);
        this.$(container).empty().append(view.el);
      },

      appendChild: function(view) {
        this.renderChild(view);
        $(this.el).append(view.el);
      },

      appendChildTo: function (view, container) {
        this.renderChild(view);
        this.$(container).append(view.el);
      },

      prependChild: function(view) {
        this.renderChild(view);
        $(this.el).prepend(view.el);
      },

      prependChildTo: function (view, container) {
        this.renderChild(view);
        $(container).prepend(view.el);
      },

      _leaveChildren: function() {
        this.children.chain().clone().each(function(view) {
          if (view.leave)
            view.leave();
        });
      },

      _removeFromParent: function() {
        if (this.parent)
          this.parent._removeChild(this);
      },

      _removeChild: function(view) {
        var index = this.children.indexOf(view);
        this.children.splice(index, 1);
      }
    });

    Support.CompositeView.extend = Backbone.View.extend;

    Support.SwappingRouter = function(options) {
      Backbone.Router.apply(this, arguments);
    };

    _.extend(Support.SwappingRouter.prototype, Backbone.Router.prototype, {
      swap: function(newView) {
        if (this.currentView && this.currentView.leave) {
          this.currentView.leave();
        }

        this.currentView = newView;
        $(this.el).empty().append(this.currentView.render().el);
      }
    });

    Support.SwappingRouter.extend = Backbone.Router.extend;

    return Support;
});

