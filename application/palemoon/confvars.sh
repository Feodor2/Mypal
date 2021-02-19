#! /bin/sh
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

# Application Basename and Vendor
# MOZ_APP_BASENAME and MOZ_APP_VENDOR must not have spaces.
# These values where appropriate are hardcoded in application.ini
# to "Pale Moon" and "Moonchild Productions" respectively for
# Pale Moon
MOZ_APP_BASENAME=Mypal
MOZ_APP_VENDOR=Feodor2

# Application Version
# MOZ_APP_VERSION is read from ./config/version.txt
# MOZ_APP_VERSION_DISPLAY is not used in Pale Moon so set it
# to MOZ_APP_VERSION
MOZ_APP_VERSION=`cat ${_topsrcdir}/$MOZ_BUILD_APP/config/version.txt`
MOZ_APP_VERSION_DISPLAY=$MOZ_APP_VERSION

# Application ID
# This is a unique identifier used for the application
# Most frequently the AppID is used for targetApplication
# in extensions and for chrome manifests
MOZ_APP_ID={8de7fcbb-c55c-4fbe-bfc5-fc555c87dbc4}

# Use static Application INI File
MOZ_APP_STATIC_INI=1

# Application Branding
# The default is MOZ_BRANDING_DIRECTORY and should never point to
# official branding by default.
# Changing MOZ_*BRANDING_DIRECTORY requires a clobber because branding
# dependencies are broken.
# MOZ_APP_DISPLAYNAME will be set by [branding]/configure.sh
MOZ_BRANDING_DIRECTORY=$MOZ_BUILD_APP/branding/unofficial
MOZ_OFFICIAL_BRANDING_DIRECTORY=$MOZ_BUILD_APP/branding/official

# Enables conditional code in the platform for Pale Moon only
MC_PALEMOON=1

# Enables conditional code in the platform for historically
# Firefox-like browsers
MOZ_PHOENIX=1

# Lightweight Themes
MOZ_PERSONAS=1

# Enable SQL storage format for certs and passwords in NSS
MOZ_SECURITY_SQLSTORE=1
# ...and explicitly disable the legacy DBM format.
NSS_DISABLE_DBM=1

# Browser Feature: Profile Migration Component
MOZ_PROFILE_MIGRATOR=

# Platform Feature: Application Update Service
# MAR_CHANNEL_ID must not contained the follow 3 characters: ",\t"
# ACCEPTED_MAR_CHANNEL_IDS should usually be the same as MAR_CHANNEL_ID
# If more than one ID is needed, then you should use a comma seperated list.
MOZ_UPDATER=
MAR_CHANNEL_ID=unofficial
ACCEPTED_MAR_CHANNEL_IDS=unofficial,unstable,release

# Platform Feature: Developer Tools
# XXX: Devtools are disabled until they can be made to work with Pale Moon
MOZ_DEVTOOLS=1

# Platform Feature: "Phoenix" Extensions Support aka Dual-guid system.
# Allows installation of Firefox GUID targeted extensions despite having
# a different Application ID
# On UXP this is a possible feature only for the Tycho Add-ons Manager
MOZ_PHOENIX_EXTENSIONS=1

# Platform Feature: Sync Service
MOZ_SERVICES_COMMON=1
MOZ_SERVICES_SYNC=1

# Platform Feature: JS based Downloads Manager
MOZ_JSDOWNLOADS=1

# Platform Feature: Conformant WebGL
# Exposes the "webgl" context name, which is reserved for
# conformant implementations.
MOZ_WEBGL_CONFORMANT=1

# Set the chrome packing format
# Possible values are omni, jar, and flat
# Currently, only omni and flat are supported
MOZ_CHROME_FILE_FORMAT=omni
JAR_COMPRESSION=brotli

# Set the default top-level extensions
MOZ_EXTENSIONS_DEFAULT=" gio"

# Fold Libs
if test "$OS_TARGET" = "WINNT" -o "$OS_TARGET" = "Darwin"; then
  MOZ_FOLD_LIBS=1
fi

# Include bundled fonts
if test "$OS_ARCH" = "WINNT" -o \
        "$OS_ARCH" = "Linux"; then
  MOZ_BUNDLED_FONTS=1
fi

# Short-circuit a few services to be removed
MOZ_SERVICES_HEALTHREPORT=
