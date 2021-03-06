/* Any copyright is dedicated to the Public Domain.
 http://creativecommons.org/publicdomain/zero/1.0/ */

"use strict";

// Test that units are displayed correctly when editing values in the box model
// and that values are retrieved and parsed correctly from the back-end

const TEST_URI = "<style>" +
  "div { margin: 10px; padding: 3px }" +
  "#div1 { margin-top: 5px }" +
  "#div2 { border-bottom: 1em solid black; }" +
  "#div3 { padding: 2em; }" +
  "</style>" +
  "<div id='div1'></div><div id='div2'></div><div id='div3'></div>";

add_task(function* () {
  yield addTab("data:text/html," + encodeURIComponent(TEST_URI));
  let {inspector, view, testActor} = yield openBoxModelView();

  yield testUnits(inspector, view, testActor);
  yield testValueComesFromStyleRule(inspector, view, testActor);
  yield testShorthandsAreParsed(inspector, view, testActor);
});

function* testUnits(inspector, view, testActor) {
  info("Test that entering units works");

  is((yield getStyle(testActor, "#div1", "padding-top")), "",
     "Should have the right padding");
  yield selectNode("#div1", inspector);

  let span = view.doc.querySelector(".boxmodel-padding.boxmodel-top > span");
  is(span.textContent, 3, "Should have the right value in the box model.");

  EventUtils.synthesizeMouseAtCenter(span, {}, view.doc.defaultView);
  let editor = view.doc.querySelector(".styleinspector-propertyeditor");
  ok(editor, "Should have opened the editor.");
  is(editor.value, "3px", "Should have the right value in the editor.");

  EventUtils.synthesizeKey("1", {}, view.doc.defaultView);
  yield waitForUpdate(inspector);
  EventUtils.synthesizeKey("e", {}, view.doc.defaultView);
  yield waitForUpdate(inspector);

  is((yield getStyle(testActor, "#div1", "padding-top")), "",
     "An invalid value is handled cleanly");

  EventUtils.synthesizeKey("m", {}, view.doc.defaultView);
  yield waitForUpdate(inspector);

  is(editor.value, "1em", "Should have the right value in the editor.");
  is((yield getStyle(testActor, "#div1", "padding-top")),
     "1em", "Should have updated the padding.");

  EventUtils.synthesizeKey("VK_RETURN", {}, view.doc.defaultView);

  is((yield getStyle(testActor, "#div1", "padding-top")), "1em",
     "Should be the right padding.");
  is(span.textContent, 16, "Should have the right value in the box model.");
}

function* testValueComesFromStyleRule(inspector, view, testActor) {
  info("Test that we pick up the value from a higher style rule");

  is((yield getStyle(testActor, "#div2", "border-bottom-width")), "",
     "Should have the right border-bottom-width");
  yield selectNode("#div2", inspector);

  let span = view.doc.querySelector(".boxmodel-border.boxmodel-bottom > span");
  is(span.textContent, 16, "Should have the right value in the box model.");

  EventUtils.synthesizeMouseAtCenter(span, {}, view.doc.defaultView);
  let editor = view.doc.querySelector(".styleinspector-propertyeditor");
  ok(editor, "Should have opened the editor.");
  is(editor.value, "1em", "Should have the right value in the editor.");

  EventUtils.synthesizeKey("0", {}, view.doc.defaultView);
  yield waitForUpdate(inspector);

  is(editor.value, "0", "Should have the right value in the editor.");
  is((yield getStyle(testActor, "#div2", "border-bottom-width")), "0px",
     "Should have updated the border.");

  EventUtils.synthesizeKey("VK_RETURN", {}, view.doc.defaultView);

  is((yield getStyle(testActor, "#div2", "border-bottom-width")), "0px",
     "Should be the right border-bottom-width.");
  is(span.textContent, 0, "Should have the right value in the box model.");
}

function* testShorthandsAreParsed(inspector, view, testActor) {
  info("Test that shorthand properties are parsed correctly");

  is((yield getStyle(testActor, "#div3", "padding-right")), "",
     "Should have the right padding");
  yield selectNode("#div3", inspector);

  let span = view.doc.querySelector(".boxmodel-padding.boxmodel-right > span");
  is(span.textContent, 32, "Should have the right value in the box model.");

  EventUtils.synthesizeMouseAtCenter(span, {}, view.doc.defaultView);
  let editor = view.doc.querySelector(".styleinspector-propertyeditor");
  ok(editor, "Should have opened the editor.");
  is(editor.value, "2em", "Should have the right value in the editor.");

  EventUtils.synthesizeKey("VK_RETURN", {}, view.doc.defaultView);

  is((yield getStyle(testActor, "#div3", "padding-right")), "",
     "Should be the right padding.");
  is(span.textContent, 32, "Should have the right value in the box model.");
}
