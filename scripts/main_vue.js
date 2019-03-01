const myVue = new Vue({
  el: "#myVueElement",
  data: {
    showTable: false,
    isLoaded: false,
    isHide: true,
    animation: false,
    noResults: false,
    previousTDClicked: "",
    reverseOrder: false,
    MEMBERS: [],
    membersList: [],
    actualMembers: [],
    stateArray: [],
    MAIN_TABLE_TITLES: ["Name", "Party", "State", "Years in Oficce", "% Votes w/ Party"],   //Change this array for change the titles of the inital table
    MAIN_TABLE_KEYS: ["first_name", "party", "state", "seniority", "votes_with_party_pct"], //Change this array for change the info of the inital table
    tableTitlesMod: [],
    tableKeysMod: [],
    partySelected: [],
    checkSelected: [],
    stateSelected: "all",
    myWindows: null,
    disable: true,
    buttonText: "Select data to activate",
    checkboxData: [{
        party: "Republican",
        value: "R",
        relatedChekBox: "republicanCheckBox"
      },
      {
        party: "Democrat",
        value: "D",
        relatedChekBox: "democratCheckBox"
      },
      {
        party: "Independent",
        value: "I",
        relatedChekBox: "IndependentCheckBox"
      },
    ],

    checkData: [{

        id: "button1",
        text: "Party",
        value: "party",
        type: "string"
      },
      {
        id: "button2",
        text: "State",
        value: "state",
        type: "string"
      },
      {
        id: "button3",
        text: "Years in Oficce",
        value: "seniority",
        type: "number"
      },
      {
        id: "button4",
        text: "% Votes w/ Party",
        value: "votes_with_party_pct",
        type: "number"
      },
      {
        id: "button5",
        text: "Title",
        value: "title",
        type: "string"
      },
      {
        id: "button6",
        text: "Date Of Birth",
        value: "date_of_birth",
        type: "number"
      },
      {
        id: "button7",
        text: "Office",
        value: "office",
        type: "string"
      },
      {
        id: "button8",
        text: "Nº Phone",
        value: "phone",
        type: "number"
      },
      {
        id: "button9",
        text: "Nº Fax",
        value: "fax",
        type: "number"
      },
      {
        id: "button10",
        text: "Next Election",
        value: "next_election",
        type: "number"
      },
    ],

  },

  methods: {

    /*
    * Get the states (no repeated) from the members of the JSON
    *
    * @param membersArr The members we want to take the state
    */

    getStates(membersArr) {
      this.stateArray = [...new Set(membersArr.map(member => member.state))].sort();
      //The Set object lets you store UNIQUE values of any type, whether primitive values or object references.
    },

    /*
    * This function return a string whit the full name of the member. It control the null values
    *
    * @param {object} member the member we want to take the full name
    * @return {string} string whit the full name
    */

    joinName(member) {
      let completeName = "";
      Object.keys(member).filter(key => key === "first_name" || key === "middle_name" || key === "last_name")
                         .forEach(name => member[name] ? completeName = `${completeName} ${member[name]}` : null);
      return completeName;
    },

    /*
    * Check if the argument is null
    *
    * @param {any type} the value we want to check (any type)
    * @return {argument or string} the argument if not null, "---" otherwise
    */
    checkNullValue(value) {
      return value ? value : "---"
    },

    /*
    * Filter the members by party
    *
    * @param {array} membersArr array we want to filter
    * @param {array} partyArr array with the partys
    * @param {array} members filters by party
    */

    filterByParty(membersArr, partyArr) {
      return partyArr.length ? partyArr.flatMap(party => membersArr.filter(member => member.party === party)) : membersArr
    },

    /*
    * Filter the members by state
    *
    * @param {array} membersArr array we want to filter
    * @param {string} partyArr array with the state
    * @param {array} members filters by state
    */

    filterByState(membersArr, state) {
      return state === "all" ? membersArr : membersArr.filter(member => member.state === state);
    },

    /*
    * Filter the members by party and state at the same time
    *
    * @param {array} membersArr array we want to filter
    * @param {array} members filters by state and party
    */

    filterAll(membersArr) {
      this.actualMembers = this.membersList = this.filterByState(this.filterByParty(membersArr, this.partySelected), this.stateSelected);
    },

    /*
    * This function make accordion effect on side panel
    */

    makeAccordion() {
      this.isShow = !this.isShow;
      let panel = this.$refs.myPanel;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
        setTimeout(() => {
          myVue.isHide = true;
        }, 640);
      } else {
        panel.style.maxHeight = `${panel.scrollHeight}px`;
        setTimeout(() => {
          myVue.isHide = false;
        }, 1000);
      }
    },

    /*
    * This function create the table with the information selected by the user

    */
    makeUserTable() {
      let infoSelected = this.checkSelected.map(checkBoxValue => this.checkData.find(checkBox => checkBox.value === checkBoxValue).text); //Get the text key of the checkbox selected to used on titles of the table
      this.tableTitlesMod = ["Name", ...infoSelected];
      this.tableKeysMod = ["first_name" , ...this.checkSelected];
    },

    /*
    * This funtion is called when the user click on the button Create Table. Perfom the acction of close the side panel
    * whit an accordion effect and the action of create the table with the user selecctions
    */
    makeTableAndAccordion() {
      this.makeAccordion();
      this.makeUserTable();
    },

    /*
    * This function refresh the table, all checkbox and options to their default state.
    * Change all the variables values to their inital state.
    */

    refresh() {
      this.membersList = this.actualMembers = this.MEMBERS;
      this.tableKeysMod = this.MAIN_TABLE_KEYS;
      this.tableTitlesMod = this.MAIN_TABLE_TITLES;
      this.checkSelected = [];
      this.partySelected = [];
      this.stateSelected = "all";
      this.animation = true;
      setTimeout(() => {
        myVue.animation = false;
      }, 1000);
    },

    /*
    * Open the link of each member on a separete window
    * @param {string} url url of the webpage we want to open in our new window
    */

    openWindow(url) {
      let top = document.documentElement.clientHeight;
      let options = `menubar=no, top=${top / 4}, left=900, width=800, height=500`;
      if (this.myWindows) {
        this.myWindows.close();
        this.myWindows = window.open(url, "_blank", options);
      } else {
        this.myWindows = window.open(url, "_blank", options);
      }
    },


    /*
    * This function sort the array of members by a value of a key, from lowest to higuest
    *
    * @param {array} membersArr an array with the members we want to sort
    * @param {string} the key that will define the sort
    * @param {string} the type of the key, "number" or "string". Optinal argument. If it omited, "number" is passed by default
    */

    orderMembersByKeyValue(membersArr, key, dataType = "number") {
      if (dataType === "number") {
        return membersArr.slice().sort((a, b) => parseFloat(a[key]) - parseFloat(b[key]));
      } else {
        return membersArr.slice().sort((a, b) => (a[key] > b[key]));
      }
    },

    /*
    * This function compare 2 arrays of JSON type objects and compare if it contains the same onjects in the same order.
    * IT´S NEVER USED ON THIS APP.
    *
    * @params {array} array1 one of the arrays of objects we want to compare
    * @params {array} array2 one of the arrays of objects we want to compare
    * @returns {boolean} true if booth arrays are equeal, false otherwise.
    */
    areEquals(array1, array2) {
      let areEquals = true;
      if (array1.length !== array2.length) {
        areEquals = false;
      } else {
        for(let index = 0; index < array1.length; index++) { //we use normal for loop because we can use break statement
          if (JSON.stringify(array1[index]) !== JSON.stringify(array2[index])) {
            areEquals = false;
            break;
          }
        }
      }
      return areEquals;
    },

    /*
    * This funtion sort the table by clicking on their titles. The order of sort will be:
    *
    *       1º click - From Lowest to Highest
    *       2º click - From Highest to Lowest
    *       3º click - Default order
    *
    * @params {event} click of the user
    */


    sortByColumn(event) {
      let titleText = event.target.innerHTML;
      let item = this.checkData.find(item => item.text === titleText);
      if (this.previousTDClicked !== titleText) {  //First time the user click a column to order. Order members from lowest to highest
        this.membersList = this.orderMembersByKeyValue(this.actualMembers, item.value, item.type);
        this.previousTDClicked = titleText;
        this.reverseOrder = true;
      } else if(this.reverseOrder) { //Second time the user click a column to order. Order members from lowest to highest
        this.membersList = this.orderMembersByKeyValue(this.actualMembers, item.value, item.type).slice().reverse();
        this.reverseOrder = false;
      } else { //Third time the user click a column to order. Order members by default order
        this.membersList = this.actualMembers;
        this.previousTDClicked = "";
      }
    },

    /*
    * Check if the table is empty
    */
    noResultsOnTable() {
      this.membersList.length ? this.noResults = false : this.noResults = true;
    },

    /*
    * Fecth call using an asyn function. Initialize/change the values of all the required variables when the fetch call is completed
    *
    * @param {string} chamber specifies the camera from which we want to obtain the data. ONLY POSSIBLES VALUES: "senate" or "house"
    */

    async getData(chamber) {
      //await the response of the fetch call
      let response = await fetch(`https://api.propublica.org/congress/v1/115/${chamber}/members.json`, {
        method: "GET",
        dataType: 'json',
        headers: {
          "X-API-Key": "kBfQKxtZzIQKC80wlPEvDUhKAFxVlBU63svN3B8O"
        }
      });
      //proceed once the first promise is resolved.
      let data = await response.json()
      //proceed only when the second promise is resolved
      this.tableTitlesMod = this.MAIN_TABLE_TITLES;
      this.tableKeysMod = this.MAIN_TABLE_KEYS;
      this.MEMBERS = data.results[0].members;
      this.membersList = this.actualMembers = this.MEMBERS;
      this.getStates(this.MEMBERS);
      this.isLoaded = true;
      this.showTable = true;
    },
  },

  computed: {

    /*
    * Change the text of the button Create Table depending on the checkboxes pressed
    *
    * @return {string} the text that will go on the button
    */
    changeButtonText() {
      return this.checkSelected.length < 1 ? "Select data to activate" : "Create Table";
    }
  },

  /*
  * Fetch call
  */

  beforeMount() {
    window.location.href.includes("senate") ? this.getData("senate") : this.getData("house");
  },

  /*
  * Check if the table is empty before every info update
  */

  beforeUpdate() {
    this.noResultsOnTable();
  },

});
