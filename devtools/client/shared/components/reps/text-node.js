/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*- */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

// Make this available to both AMD and CJS environments
define(function (require, exports, module) {
  // ReactJS
  const React = require("devtools/client/shared/vendor/react");

  // Reps
  const { isGrip, cropString } = require("./rep-utils");

  // Shortcuts
  const DOM = React.DOM;

  /**
   * Renders DOM #text node.
   */
  let TextNode = React.createClass({
    displayName: "TextNode",

    propTypes: {
      object: React.PropTypes.object.isRequired,
      mode: React.PropTypes.string,
    },

    getTextContent: function (grip) {
      return cropString(grip.preview.textContent);
    },

    getTitle: function (grip) {
      if (this.props.objectLink) {
        return this.props.objectLink({
          object: grip
        }, "#text ");
      }
      return "";
    },

    render: function () {
      let grip = this.props.object;
      let mode = this.props.mode || "short";

      if (mode == "short" || mode == "tiny") {
        return (
          DOM.span({className: "objectBox objectBox-textNode"},
            this.getTitle(grip),
            DOM.span({className: "nodeValue"},
              "\"" + this.getTextContent(grip) + "\""
            )
          )
        );
      }

      let objectLink = this.props.objectLink || DOM.span;
      return (
        DOM.span({className: "objectBox objectBox-textNode"},
          this.getTitle(grip),
          objectLink({
            object: grip
          }, "<"),
          DOM.span({className: "nodeTag"}, "TextNode"),
          " textContent=\"",
          DOM.span({className: "nodeValue"},
            this.getTextContent(grip)
          ),
          "\"",
          objectLink({
            object: grip
          }, ">;")
        )
      );
    },
  });

  // Registration

  function supportsObject(grip, type) {
    if (!isGrip(grip)) {
      return false;
    }

    return (grip.preview && grip.class == "Text");
  }

  // Exports from this module
  exports.TextNode = {
    rep: TextNode,
    supportsObject: supportsObject
  };
});
