Homepage
========

built by wintersmith

# Install

In _wintersmith/_

	$ npm install
	
# Develop / Preview

In _wintersmith/_

	$ wintersmith preview [-p 8080]
	
# CV

In `wintersmith/`

	$ node process.js

It takes `data/cv.xlsx` and generates a bunch of `.json` in `contents/`

	
# Build

In _wintersmith/_

	$ wintersmith build

Commit the build

	$ git commit -a -m 'commit message'
	
# Deploy

To deploy, run the subtree push command from the root directory:

	$ git subtree push --prefix wintersmith/build origin gh-pages

