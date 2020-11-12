
const inputs = document.querySelectorAll(".input");
//const ProgressBar = require('progressbar.js');
//var line = new ProgressBar.Line('#container');
window.onload = function onLoad() {
    var num = 0;
    var bar = new ProgressBar.Circle(container, {
        color: '#F50057',
        // This has to be the same size as the maximum width to
        // prevent clipping
        strokeWidth: 4,
        trailWidth: 1,
        easing: 'easeInOut',
        duration: 1400,
        text: {
          autoStyleContainer: false
        },
        from: { color: '#aaa', width: 1 },
        to: { color: '#F50057', width: 4 },
        // Set default step function for all animate calls
        step: function(state, circle) {
          circle.path.setAttribute('stroke', state.color);
          circle.path.setAttribute('stroke-width', state.width);
      
          var value = Math.round(circle.value() * 100);
          if (value === 0) {
            circle.setText('');
          } else {
            circle.setText(value);
          }
      
        }
      });
      bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
      bar.text.style.fontSize = '2rem';
      fetch('/pos').then(function(response) {
        response.json().then(function(text) {

          num = text.pos;
          num=num-1;
          num = num*0.01;
          num=1-num;
          bar.animate(num);  // Number from 0.0 to 1.0
        });
      });
      
};

function addcl(){
	let parent = this.parentNode.parentNode;
	parent.classList.add("focus");
}

function remcl(){
	let parent = this.parentNode.parentNode;
	if(this.value == ""){
		parent.classList.remove("focus");
	}
}


inputs.forEach(input => {
	input.addEventListener("focus", addcl);
	input.addEventListener("blur", remcl);
});

const showMenu = (toggleId, navId) =>{
    const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId)

    if(toggle && nav){
        toggle.addEventListener('click', ()=>{
            nav.classList.toggle('show')
        })

    }
}
showMenu('nav-toggle','nav-menu')
const showMenu1 = (toggleId, navId) =>{
    
    const toggle = document.getElementById(toggleId),
     nav = document.getElementsByClassName(navId)

    if(toggle && nav){
        
        
            nav[0].onclick = function(){
                toggle.src = nav[0].src
                
            };
            nav[1].onclick = function(){
                toggle.src = nav[1].src
                
            };
            nav[2].addEventListener('click', ()=>{
                toggle.src = nav[2].src
               
            });
            nav[3].addEventListener('click', ()=>{
                toggle.src = nav[3].src
               
            });
        

    }
}
showMenu1('ProductImg','small-img')

/**remove menu mobile */
const navLink = document.querySelectorAll('.nav__link')
function linkAction(){
    //active link
    navLink.forEach(n => n.classList.remove('active'))
    this.classList.add('active')
     //remove menu mobile
     const navMenu = document.getElementById('nav-menu')
     navMenu.classList.remove('show')
}
 navLink.forEach(n => n.addEventListener('click', linkAction))

 var LoginForm = document.getElementById('LoginForm');
 var RegForm = document.getElementById('RegForm');
 var Indicator = document.getElementById('Indicator');
   function register(){
       RegForm.style.transform = 'translateX(0px)';
       LoginForm.style.transform = 'translateX(0px)';
       Indicator.style.transform = 'translateX(100px)';
   }
   function login(){
    RegForm.style.transform = 'translateX(300px)';
    LoginForm.style.transform = 'translateX(300px)';
    Indicator.style.transform = 'translateX(0px)';
}
// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
var span1 = document.getElementsByClassName("cloze")[0];
// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}
span1.onclick = function() {
    modal.style.display = "none";
  }

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
function myFunction() {
var x = document.getElementById("myDIV");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}