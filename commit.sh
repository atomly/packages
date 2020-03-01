#!/bin/bash

if [[ -z $(git status -s) ]]
then
  echo "Tree is clean, commit your changes:"
  npx git-cz
else
  echo "Tree is dirty, please commit changes before running this."
fi
