#!/bin/bash

set -e

node createDb.js --rebuild
node buildCharacterTable.js --rebuild
node buildFrequencyTable.js --rebuild
