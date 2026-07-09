#!/usr/bin/env -S just --justfile

set shell := ["bash", "-cu"]
set windows-shell := ["powershell.exe", "-NoLogo", "-Command"]

_default:
  @just --list --unsorted

alias c := check
alias d := dev
alias f := fix
alias p := prod
alias s := serve

###############################################################################
# Development
###############################################################################

dev:
  bun concurrently \
    "v -d veb_livereload watch --only-watch=*.v,*.html,*.css,*.ts,*.md,*.tr run ." \
    "bun dev"

###############################################################################
# Production
###############################################################################

[unix]
_binary:
  if [ ! -x ./cv ]; then just prod; fi

[windows]
_binary:
  if (!(Test-Path .\cv.exe)) { just prod }

prod:
  bun prod
  v -prod .

[unix]
serve: _binary
  ./cv

[windows]
serve: _binary
  .\cv.exe

run: prod serve

###############################################################################
# Quality
###############################################################################

check:
  v fmt -verify .
  bun check

fix:
  v fmt -w .
  bun fix

###############################################################################
# Dependencies
###############################################################################

install:
  bun install
  v install --local

prepare:
  bun scripts/prepare.ts

update:
  bun update
  v update --local

###############################################################################
# Cleaning
###############################################################################

[unix]
clean:
  rm -rf node_modules modules .vite-hooks cv

[windows]
clean:
  Remove-Item node_modules, modules, .vite-hooks, cv -Recurse -Force -ErrorAction SilentlyContinue

###############################################################################
# Utilities
###############################################################################

doctor:
  @echo "=== Environment Info ==="

  @echo "Bun:"
  @bun --version

  @echo ""
  @echo "V:"
  @v version

  @echo ""
  @echo "Vite+:"
  @bun vp --version

  @echo ""
  @echo "TypeScript:"
  @bun tsc --version

###############################################################################
# CI
###############################################################################

ci: check prod

ready:
  git diff --exit-code --quiet
  just fix
  just ci
