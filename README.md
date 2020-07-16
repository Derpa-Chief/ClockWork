# README #

This is Kelun's version of the AWH Clockwork exercise.

There are a few changes from a dependency standpoint.

1. Migrated to dot net core 3.1 as 2.0 was no longer being supported
2. Targeted dot net framework 4.8

A few more specifics
* I used plain javascript to adhere to what was already being used
* The only external resource I pulled in was semantic ui in order to provide a standardized look and feel to the page elements
* I used jetbrains Rider IDE since I had a personal license. I had to change up some of the local web address bindings to get this to boot up locally. The Web application boots up at localhost:5002 and the API takes up ports 5000 for http and 5001 for https.