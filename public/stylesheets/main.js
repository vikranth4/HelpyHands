var $jumbo1 = $("#jumbo1");
var $jumbo2 = $("#jumbo2");
var $jumbo3 = $("#jumbo3");
var $service = $("#service");
var $services = $("#services");

var preloader = document.getElementById("loading");
function preload() {
	preloader.style.display = 'none';
	$jumbo1.addClass("jumbo1");
	$jumbo2.addClass("jumbo2");
	$jumbo3.addClass("jumbo3");
	$service.addClass("service");
	$services.addClass("services");
};

var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
if (width > 576) {
	$(function () {
		$(document).scroll(function () {
			var $nav = $("#mainNavbar");
			$nav.toggleClass("scrolled", $(this).scrollTop() > $nav.height());
			$nav.toggleClass("navback", $(this).scrollTop() < $nav.height());
		});
	});
}
window.sr = ScrollReveal();

var swiper = new Swiper('.swiper-container', {
	effect: 'coverflow',
	grabCursor: true,
	centeredSlides: true,
	slidesPerView: 'auto',
	coverflowEffect: {
		rotate: 50,
		stretch: 0,
		depth: 100,
		modifier: 1,
		slideShadows: true,
	},
	pagination: {
		el: '.swiper-pagination',
	},
});

/*sr.reveal(".service1",{
	origin:"top",
	duration:800,
	distance:"25rem",
	delay:1000,
	reset: true,
	viewFactor: 0.5,
	useDelay: 'onload'
});

sr.reveal(".service2",{
	origin:"bottom",
	duration:800,
	distance:"25rem",
	delay:1000,
	reset: true,
	viewFactor: 0.5,
	useDelay: 'onload'
});*/

sr.reveal(".fuel", {
	origin: "left",
	duration: 1500,
	distance: "5rem",
	delay: 100,
	reset: false,
	viewFactor: 0.3,
	useDelay: 'once'
});

sr.reveal(".earth", {
	origin: "right",
	duration: 1500,
	distance: "5rem",
	delay: 100,
	reset: false,
	viewFactor: 0.3,
	useDelay: 'once'
});

sr.reveal(".money", {
	origin: "left",
	duration: 1500,
	distance: "5rem",
	delay: 100,
	reset: false,
	viewFactor: 0.3,
	useDelay: 'once'
});

sr.reveal(".time", {
	origin: "right",
	duration: 1500,
	distance: "5rem",
	delay: 100,
	reset: false,
	viewFactor: 0.3,
	useDelay: 'once'
});

sr.reveal(".whys", {
	scale: 2,
	duration: 1000,
	delay: 100,
	reset: false,
	viewFactor: 0.9,
	useDelay: 'onload'
});