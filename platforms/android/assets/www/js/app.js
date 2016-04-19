var app = {
    modal: null,
    db: null,
    profile: {},
    months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady);
    },
    onDeviceReady: function() {
        //console.log("device is ready");
        app.modal = window.modal;
        document.querySelector("#menu").addEventListener("click", app.navigate);
        document.getElementById("madlibLink").addEventListener("click", app.navigate);
        document.getElementById("btnScan").addEventListener("click", app.scan);
        document.getElementById("btnEdit").addEventListener("click", app.showWizard);
        
        history.replaceState({"page":"profile"}, null, "#profile");
        document.querySelector("[data-href=profile]").click();
        window.addEventListener("popstate", app.popPop);
        
        
        //console.log("test the sqlitePlugin");
        window.sqlitePlugin.echoTest(function(){
            console.log("sqlite plugin supported");
        }, function(){
            console.warn("sqlite plugin NOT supported");
        });
        
        //console.log("set up DB");
        app.setupDB();
        
    },
    navigate: function(ev){
        ev.preventDefault();
        //the ul is the currentTarget, the target could be <li>, <a>, or <i>
        //we need to access the data-href from the anchor tag
        var ct, tagname, id, pages, tabs;
        ct = ev.target;
        tagname = ct.tagName.toLowerCase();
        //console.log("tagname " + tagname);
        if(tagname == 'a'){
            id = ct.getAttribute("data-href");
        }else if(tagname == 'i'){
            id = ct.parentElement.getAttribute("data-href");
        }else{
            //li
            if(ct.hasAttribute("data-href")){
                id  = ct.getAttribute("data-href");
            }else{
                id = ct.querySelector("a").getAttribute("data-href");
            }
        }
        //add to history
        history.pushState({"page":id}, null, "#"+id);
        //switch the page view
        pages = document.querySelectorAll("[data-role=page]");
        tabs = document.querySelectorAll("#menu li");
        [].forEach.call(pages, function(item, index){
            item.classList.remove("active-page");
            if(item.id == id){
                item.classList.add("active-page");
            }
        });
        [].forEach.call(tabs, function(item, index){
            item.classList.remove("active-tab");
            if(item.querySelector("a").getAttribute("data-href")==id){
                item.classList.add("active-tab");
            }
        });
        if(id=="contacts"){
            console.log("get contacts list ready");
            alert("you clicked somethign on cotacts");
            
        }
        if(id=="scan"){
            console.log("get profile ready and qr code");
            
        }
        if(id=="madlib"){
            //load the madlib story for the contact
            var contact = ct.getAttribute("data-id");
            
        }
    },
    setupDB: function(){
        //connect to the db, create the tables, load the profile if one exists, create the QRcode from the profile 
        console.log("about to openDatabase");
        app.db = sqlitePlugin.openDatabase({name: 'DBmeetcute.2', iosDatabaseLocation: 'default'}, 
            function(db){
                //set up the tables
                console.log("create the tables IF NOT EXISTS");
                db.transaction(function(tx){
                   tx.executeSql('CREATE TABLE IF NOT EXISTS profile(item_id INTEGER PRIMARY KEY AUTOINCREMENT, item_name TEXT, item_value TEXT)');
                   tx.executeSql('CREATE TABLE IF NOT EXISTS madlibs(madlib_id INTEGER PRIMARY KEY AUTOINCREMENT, full_name TEXT, madlib_txt TEXT)'); 
                }, function(err){
                    console.log("error with the tx trying to create the tables. " + JSON.stringify(err) );
                });
                
                //now go get the profile info for home page
            }, 
            function(err){
                console.log('Open database ERROR: ' + JSON.stringify(err));
            });
    },
    saveProfile: function(){
        //called by clicking on the LAST button in the modal wizard
        console.log("save Profile");
        
        //save all the info from the modal into local variables
        
        //delete current values in profile table
        
        //insert all the new info from modal into profile table
        
        //call fetchprofile when done
    },
    fetchProfile: function(){
        //fetch all the profile info from profile table
        
        //update app.profile
        
        //update home page info based on app.profile
    },
    createQR: function(){
        //build the string to display as QR Code from app.profile
        
        //update the QR caode using new QRCode( ) method
    },
    showWizard: function(ev){
        //call the modal init method
        modal.init(ev);
    
    },
    fetchContacts: function(){
        //select all the madlib_id, full_name form madlibs table
        
        //loop through results and build the list for contacts page
        //add click event to each li to call app.navigate
    },
    scan: function(ev){
        ev.preventDefault();
        
        //call the plugin barcodeScanner.scan() method
        
        //extract the string from the QRCode
        
        //build a madlib by randomly picking a value from app.profile OR data from QRCode
        
        //insert the new madlib into the madlibs table (creating a new contact)
        
        //new li will be displayed when contact page loads
        
    },
    loadStory: function(contact_id){
        //use the contact_id as the madlib_id from madlibs table
        
        //select the madlib_txt and display as the new madlib
        
    },
    popPop: function(ev){
        //handle the back button
        ev.preventDefault();
        var hash = location.hash.replace("#",""); //history.state.page;
        var pages = document.querySelectorAll("[data-role=page]");
        var tabs = document.querySelectorAll("#menu li");
        [].forEach.call(pages, function(p, index){
            p.classList.remove("active");
            if(p.id == hash){
                p.classList.add("active");
            }
        });
        [].forEach.call(tabs, function(item, index){
            item.classList.remove("active-tab");
            if(item.querySelector("a").getAttribute("data-href")==hash){
                item.classList.add("active-tab");
            }
        });
    }
    
};


var modal = {
  numSteps:0,
  overlay: null,
  activeStep: 0,
  self: null,
  init: function(){
    console.log("clicked show modal button");
    //set up modal then show it
    modal.self = document.querySelector(".modal");
    modal.overlay = document.querySelector(".overlay");
    modal.numSteps = document.querySelectorAll(".modal-step").length;
    //set up button listeners
    modal.prepareSteps();
    modal.setActive(0);
    modal.show();
  },
  show: function(){
    modal.overlay.style.display = 'block';
    modal.self.style.display = 'block';
  },
  hide: function(){
    modal.self.style.display = 'none';
    modal.overlay.style.display = 'none';
  },
  saveInfo: function(){
    //this function will use AJAX or SQL statement to save data from the modal steps
    window.app.saveProfile();
    //when successfully complete, hide the modal
    //we could hide the modal and leave the overlay and show an animated spinner
    modal.hide();
  },
  setActive: function(num){
    modal.activeStep = num;
    [].forEach.call(document.querySelectorAll(".modal-step"), function(item, index){
      //set active step
      if(index == num){
        item.classList.add("active-step");
      }else{
        item.classList.remove("active-step");
      }
    });
  },
  prepareSteps: function(){
    [].forEach.call(document.querySelectorAll(".modal-step"), function(item, index){
      //add listener for each button
      var btn = item.querySelector("button");
      btn.addEventListener("click", modal.nextStep);
      //set text on final button to save/complete/close/done/finish
      if( index == (modal.numSteps-1) ){
        btn.textContent = "Complete"
      }
    });
  },
  nextStep: function(ev){
    modal.activeStep++;
    if(modal.activeStep < modal.numSteps){
      modal.setActive(modal.activeStep);
    }else{
      //we are done this is the final step
        console.log("last step");
      modal.saveInfo();
    }
  },
  reset: function(){
    //this could be a function to clear out any form fields in your modal
  }
}

app.initialize();