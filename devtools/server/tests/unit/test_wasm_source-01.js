/* -*- js-indent-level: 2; indent-tabs-mode: nil -*- */
/* Any copyright is dedicated to the Public Domain.
   http://creativecommons.org/publicdomain/zero/1.0/ */
/* eslint-disable no-shadow, max-nested-callbacks */

"use strict";

/**
 * Verify if client can receive binary wasm if 'wasmBinarySource' is set.
 */

var gDebuggee;
var gClient;
var gThreadClient;

function run_test() {
  if (typeof WebAssembly == "undefined") {
    // wasm is not enabled for this platform
    return;
  }

  initTestDebuggerServer();
  gDebuggee = addTestGlobal("test-wasm-source");
  gClient = new DebuggerClient(DebuggerServer.connectPipe());
  gClient.connect().then(function () {
    do_check_true(gClient.mainRoot.traits.wasmBinarySource);

    attachTestTabAndResume(
      gClient, "test-wasm-source",
      function (response, tabClient, threadClient) {
        gThreadClient = threadClient;
        gThreadClient.reconfigure({
          observeAsmJS: true,
          wasmBinarySource: true
        }, function (response) {
          do_check_eq(!!response.error, false);
          test_source();
        });
      });
  });
  do_test_pending();
}

const EXPECTED_CONTENT = String.fromCharCode(
  0, 97, 115, 109, 1, 0, 0, 0, 1, 132, 128, 128, 128, 0, 1, 96, 0, 0, 3, 130,
  128, 128, 128, 0, 1, 0, 6, 129, 128, 128, 128, 0, 0, 7, 133, 128, 128, 128,
  0, 1, 1, 102, 0, 0, 10, 136, 128, 128, 128, 0, 1, 130, 128, 128, 128, 0, 0,
  11);

function test_source() {
  gThreadClient.addOneTimeListener("paused", function (event, packet) {
    gThreadClient.getSources(function (response) {
      do_check_true(!!response);
      do_check_true(!!response.sources);

      let source = response.sources.filter(function (s) {
        return s.introductionType === "wasm";
      })[0];

      do_check_true(!!source);

      let sourceClient = gThreadClient.source(source);
      sourceClient.source(function (response) {
        do_check_true(!!response);
        do_check_true(!response.error);
        do_check_true(!!response.contentType);
        do_check_true(response.contentType.includes("wasm"));

        let sourceContent = response.source;
        do_check_true(!!sourceContent);
        do_check_eq(typeof sourceContent, "object");
        do_check_true("binary" in sourceContent);
        do_check_eq(EXPECTED_CONTENT, sourceContent.binary);

        gThreadClient.resume(function () {
          finishClient(gClient);
        });
      });
    });
  });

  /* eslint-disable comma-spacing, max-len */
  gDebuggee.eval("(" + function () {
    // WebAssembly bytecode was generated by running:
    // js -e 'print(wasmTextToBinary("(module(func(export \"f\")))"))'
    let m = new WebAssembly.Module(new Uint8Array([
      0,97,115,109,1,0,0,0,1,132,128,128,128,0,1,96,0,0,3,130,128,128,128,0,1,
      0,6,129,128,128,128,0,0,7,133,128,128,128,0,1,1,102,0,0,10,136,128,128,
      128,0,1,130,128,128,128,0,0,11
    ]));
    let i = new WebAssembly.Instance(m);
    debugger;
    i.exports.f();
  } + ")()");
}