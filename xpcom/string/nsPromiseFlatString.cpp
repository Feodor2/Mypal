/* -*- Mode: C++; tab-width: 8; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "nsPromiseFlatString.h"

// define nsPromiseFlatString
#include "string-template-def-unichar.h"
#include "nsTPromiseFlatString.cpp"
#include "string-template-undef.h"

// define nsPromiseFlatCString
#include "string-template-def-char.h"
#include "nsTPromiseFlatString.cpp"
#include "string-template-undef.h"
