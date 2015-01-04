Homepage
========

built by wintersmith

# Install

In _wintersmith/_

	$ npm install
	
# Develop / Preview

In _wintersmith/_

	$ wintersmith preview [-p 8080]
	
	
# Build

In _wintersmith/_

	$ wintersmith build
	
# Deploy

To deploy, run the subtree push command from the root directory:

	$ git subtree push --prefix wintersmith/build origin gh-pages