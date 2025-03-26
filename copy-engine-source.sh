#!/bin/bash

find src/engine -type f -name '*.ts' -not -name '*.test.ts' -print -exec cat {} ';' | pbcopy
