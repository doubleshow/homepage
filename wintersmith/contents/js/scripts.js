(function ( $ ){

	'use strict';
	
	// Nice Scroll
	//*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*	
	$(window).load(function(){
		$('body').niceScroll({ autohidemode : false,cursorwidth: 9, cursorborder: "1px solid #fff", scrollspeed:100, cursorcolor: '#919191'});
	})
	
	
	// Animate Name on nav bar 
	//*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*		
	if ( $('#home').length > 0 ){
		var flag = false;
		$(window).scroll(function() {
			var $myName = $('#home .my-name'); 
			var myNamePos = $myName.offset().top;
			var topOfWindow = $(window).scrollTop();	
	
			if ( myNamePos > 245 ) {
				$myName.removeClass('fadeOutLeft').addClass('animated fadeInLeft show');
				flag = true; 
				
			} 
			if ( myNamePos < 245 && flag  ) {	
				$myName.removeClass('fadeInLeft').addClass('fadeOutLeft');
				
			}
		});
	}
	

	// Menu navigation scroll animation
	//*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*		
	var lastId,
		topMenu = $('.navbar-default'),
		topMenuHeight = topMenu.outerHeight() + 0,
		// All list items
		menuItems = topMenu.find("a"),
		// Anchors corresponding to menu items
		scrollItems = menuItems.map(function(){
		  var item = $($(this).attr("href"));
		  if (item.length) { return item; }
		});
	
	// Bind click handler to menu items
	// so we can get a fancy scroll animation
	menuItems.click(function(e){
	  var href = $(this).attr("href"),
		  offsetTop = href === "#" ? 0 : $(href).offset().top-topMenuHeight+1;
	  $('html, body').stop().animate({ 
		  scrollTop: offsetTop
	  }, 300);
	  //When screen is less than 767
	  if ($(window).width()<767){
	  	$('.navbar-toggle').click();
	  }
	  
	  e.preventDefault();
	});
	
	// Resize
	$(window).resize(function(){
		topMenu = $('.navbar-default');
		topMenuHeight = topMenu.outerHeight() + 0;
		
		// All list items
		menuItems = topMenu.find("a"),
		// Anchors corresponding to menu items
		scrollItems = menuItems.map(function(){
		  var item = $($(this).attr("href"));
		  if (item.length) { return item; }
		});
	})
	
	
	// Bind to scroll
	$(window).scroll(function(){
	   // Get container scroll position
	   var fromTop = $(this).scrollTop()+topMenuHeight;
	   
	   // Get id of current scroll item
	   var cur = scrollItems.map(function(){
		 if ($(this).offset().top < fromTop)
		   return this;
	   });
	   // Get the id of the current element
	   cur = cur[cur.length-1];
	   var id = cur && cur.length ? cur[0].id : "";
	   
	   if (lastId !== id) {
		   lastId = id;
		   // Set/remove active class
		   menuItems
			 .parent().removeClass("active")
			 .end().filter("[href=#"+id+"]").parent().addClass("active");
	   }                   
	});


	// Get internet explorer version
	//*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*	
	function getInternetExplorerVersion()
	// Returns the version of Internet Explorer or a -1
	// (indicating the use of another browser).
	{
	  var rv = -1; // Return value assumes failure.
	  if (navigator.appName == 'Microsoft Internet Explorer')
	  {
		var ua = navigator.userAgent;
		var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
		  rv = parseFloat( RegExp.$1 );
	  }
	  return rv;
	}

	
	// On hover thumbnail
	//*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*	
	$('.item-content').hover(function(){ 
		$(this).find('.img-hover').removeClass('bounceOut').addClass('animated bounceIn show');
	}, function(){
		if (getInternetExplorerVersion < 9 ){
			$(this).find('.img-hover').removeClass('bounceIn').addClass('bounceOut'); 
		} else {
			$(this).find('.img-hover').removeClass('animated bounceIn show'); 
		}
	})
	
	// Initialize isotope
	//*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*	
	 var $container = $('#container');
      
     $container.isotope({
        itemSelector: '.col-md-4'
     });

	 // filter items when filter link is clicked
	 $('#filters li a').click(function(){
		$('#filters').find('.active').removeClass('active');	
		$(this).parent().addClass('active');
		
		var selector = $(this).attr('data-filter');
		$container.isotope({ filter: selector }, function(){
			$('body').scrollspy('refresh');
		});
		
		return false;
	  });
	   

	   
	// Easy Pie chart 
	//*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*	
	var initPieChart = function() {
		$('.percentage').easyPieChart({
			barColor: barChangeColor,
			trackColor: trackChangeColor,
			scaleColor: false,
			lineCap: 'butt',
			lineWidth: 25,
			animate: 1000,
			size:130
		});
	}

	
	// Show smoth navigation for charts, progressbars and mapcanvas 
	//*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*	
	$('.chart').on('inview', function(event, isInView, visiblePartY) {
		if (isInView) {			
			initPieChart();
		}
	});
		
	$('.progress').on('inview', function(event, isInView, visiblePartY) {
		if (isInView) {
			$(this).addClass('inview');
		}
	});
			
	$('#map_canvas').one('inview', function(event, isInView, visiblePartY) {			
		if ( typeof(lat) !== "undefined" || typeof(lng) !== "undefined"){	
			initialize(lat, lng);
		}
	});
	
	
	// Initialize map
	//*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*		
	function initialize(lat, lng) {		
		var myOptions = {
		  zoom: 16,
		  center: new google.maps.LatLng(lat, lng),
		  mapTypeId: google.maps.MapTypeId.ROADMAP,
		  scrollwheel: false,
		  mapTypeControl: false,
		  scaleControl: false,
		  styles: // Styling google maps
			[
			  {
				"featureType": "water",
				"stylers": [
				  { "color": "#cccdcc" }
				]
			  },{
				"featureType": "transit",
				"stylers": [
				  { "visibility": "off" }
				]
			  },{
				"featureType": "road.highway",
				"elementType": "geometry.fill",
				"stylers": [
				  { "visibility": "on" },
				  { "color": "#c9c9ca" }
				]
			  },{
				"featureType": "road.highway",
				"elementType": "geometry.fill"  },{
				"featureType": "road.highway",
				"elementType": "geometry",
				"stylers": [
				  { "hue": "#ff0000" },
				  { "saturation": -100 },
				  { "lightness": 1 }
				]
			  },{
				"featureType": "road.highway.controlled_access",
				"elementType": "labels.text",
				"stylers": [
				  { "visibility": "on" },
				  { "hue": "#ff0000" },
				  { "lightness": -1 },
				  { "gamma": 1.02 },
				  { "weight": 0.1 }
				]
			  },{
				"featureType": "road.arterial",
				"elementType": "geometry.fill",
				"stylers": [
				  { "visibility": "on" },
				  { "color": "#e8eced" }
				]
			  },{
				"featureType": "road.arterial",
				"elementType": "labels.text",
				"stylers": [
				  { "weight": 0.1 },
				  { "visibility": "on" }
				]
			  },{
				"featureType": "road.highway",
				"elementType": "labels.text",
				"stylers": [
				  { "weight": 0.1 },
				  { "visibility": "on" },
				  { "color": "#333333" }
				]
			  },
			   {
				"featureType": "road.highway",
				"elementType": "labels.text.fill",
				"stylers": [
				  { "visibility": "off" },
				  { "weight": 0.1 }
				]
			  },
			  
			  {
				"featureType": "poi",
				"elementType": "geometry",
				"stylers": [
				  { "color": "#dbdadb" },
				  { "visibility": "on" }
				]
			  },{
			  }
			]
		};
		
		var map = new google.maps.Map( document.getElementById("map_canvas"), myOptions );	
		
		var myLatLng = new google.maps.LatLng(lat, lng);
		var beachMarker = new google.maps.Marker({
			position: myLatLng,
			map: map,
			icon: gIcon
		});
	}
	

	// Lightbox
	//*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*	
	var screenWidth, marginLeft;
	
	var stateObj = {foo: "bar"};
    var pathname = window.location.pathname;
	
	function AnimateLightBox( poplink, postWidth ){
		
		var contentWidth = postWidth ? 0.62 : 0.75; 
		
		if ( postWidth ) {
			screenWidth = ($(window).width() * contentWidth) > 770 ?  770 : $(window).width() * contentWidth;
		} else {
			screenWidth = ($(window).width() * contentWidth) > 970 ?  970 : $(window).width() * contentWidth;
		}
		
		marginLeft =  ((screenWidth) / 2);
		
		// Change the url of the page to the one in the post
		history.pushState( stateObj, 'page', poplink );
				
		$('body').append('<div class="overlay" /><div class="overlay-container" />').addClass('noscroll');
		
		$('.overlay').animate({ opacity : '1' },'fast', function(){
			
			$('.overlay-container').append('<div class="popup-back load-lightbox" /><div class="close-btn"><span class="left"></span><span class="right"></span></div><div class="popup" /> ');

			$.ajax({
				url: poplink,
				data: {},
				cache: false,
				success: function(data){
					// Change the url of the page to the one in the post
					history.pushState( stateObj, 'page', poplink );			
					
					$('.popup').empty().css({marginLeft : -marginLeft + 'px',  width : screenWidth + 'px'});
					
					if ( $(window).width() > 940 ){
						$('.popup').addClass('animated bounceInLeft')
					} else {
						$('.popup').animate({top: '+=100', opacity: 1}, 'fast','swing');
					}
					
					$('.popup-back').removeClass('load-lightbox');
					// Get the information from the portfolio div
					$('.popup').html($(data).find('.content-element')).fadeIn();				
					
					$('.popup-back, .close-btn').on ('click touchend',  function(e){
						
						$('.popup').animate({top: '-=140', opacity: 0}, 'fast','linear', function(){
							$('.overlay-container, .overlay').fadeOut('fast',function(){
								$(this).remove();
								$('body').removeClass('noscroll');
							});
														
							history.pushState(stateObj, "page", pathname);
						});
					})						   																
				},
				complete: function(){	
				
					function scroller(){	
					
						var popHeight = $('.popup').height();
					   $('.popup-back').height(popHeight);	
						
						if (! /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
									$('.overlay-container').niceScroll({ autohidemode : false, cursorwidth: 9, cursorborder: "1px solid #fff", scrollspeed:100, cursorcolor: '#919191'});
										
								}		
					  } // Scroller			
									
					if 	( $('.flexslider').length > 0 ){			
					
					// Flexslider for lightbox		
					  $('.flexslider').fitVids().flexslider({
						animation: "fade",
						smoothHeight: true,
						useCSS: true, 
						touch: true,
						video: true, 
						pauseOnHover: false,
						slideshow: false,
						start: function( slider ){
							
							var sliderHeight = slider.slides.eq(0).height();
							slider.height(sliderHeight);
							
							setTimeout(scroller, 600); // wait until the pop up resizes				
														
						 }//start
						 						 
					  }); //flexslider
					} else {
					
					   if ( $('iframe').length > 0 ){					
					   		$('.media').fitVids();
						}
					   setTimeout(scroller, 600); // wait until the pop up resizes	
								
					}
				}
			});//ajax		
		});

	}

	
	// When the user click on thumbnails
	//*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*	
	$('.open-popup').on('click touchend', function(e){
		
		e.preventDefault();
		var postWidth = false;
		
		if ( $(window).width() >= 360 && ( navigator.appName !== 'Microsoft Internet Explorer') ){
			
			e.preventDefault();	
			if ($(this).parents().hasClass('preview') || $(this).parents().hasClass('post_image')){
				postWidth = true;
			} else {
				postWidth = false;
			}
			AnimateLightBox($(this).attr('href'), postWidth);
		} else {
			window.location = $(this).attr('href');
		}
	})
	
	// Send Email 
	//*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*	
	$('form').submit(function(e){
		e.preventDefault();
		$('.loading').show();
		$.post('sendmail.php', $('.form').serialize(), function(data){
			$('.results').html(data);
		}).success(function(){
			$('.loading').hide();
		})
	})
	
	// Flexslider	
	//*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*			
	$('.flexslider').fitVids().flexslider({
		animation: "fade",
		smoothHeight: true,
		useCSS: true,
		pauseOnHover: false,
		touch: true,
		video: true,
		slideshow: false 

	});
	
	// Fit videos not in a slider	
	//*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*	
	$('.media').fitVids();
	

	//$('.parallax' ).parallax();

})( jQuery );