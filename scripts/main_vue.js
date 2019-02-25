const myVue = new Vue({
  el: "#myVueElement",
  data: {
    showTable: false,
    isLoaded: false,
    isHide: true,
    animation: false,
    noResults: false,
    MEMBERS: [],
    membersList: [],
    actualMembers: [],
    stateArray: [],
    MAIN_TABLE_TITLES: ["Name", "Party", "State", "Years in Oficce", "% Votes w/ Party"],
    MAIN_TABLE_KEYS: ["first_name", "party", "state", "seniority", "votes_with_party_pct"],
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

    getStates(membersArr) {
      this.stateArray = [...new Set(membersArr.map(member => member.state))].sort();
      //The Set object lets you store UNIQUE values of any type, whether primitive values or object references.
    },

    joinName(member) {
      let completeName = "";
      Object.keys(member).filter(key => key === "first_name" || key === "middle_name" || key === "last_name")
        .forEach(name => member[name] ? completeName = `${completeName} ${member[name]}` : null);
      return completeName;
    },

    modKeysArr(keysArr) {
      return keysArr.filter(data => data !== "middle_name" && data !== "last_name");
    },

    checkNullValue(value) {
      return value ? value : "---"
    },

    filterByParty(membersArr, partyArr) {
      return partyArr.length ? partyArr.flatMap(party => membersArr.filter(member => member.party === party)) : membersArr
    },

    filterByState(membersArr, state) {
      return state === "all" ? membersArr : membersArr.filter(member => member.state === state);
    },

    filterAll(membersArr) {
      this.actualMembers = this.membersList = this.filterByState(this.filterByParty(membersArr, this.partySelected), this.stateSelected);
    },

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

    makeUserTable() {
      let infoSelected = this.checkSelected.map(checkBoxValue => this.checkData.find(checkBox => checkBox.value === checkBoxValue).text);
      this.tableTitlesMod = ["Name", ...infoSelected];
      this.tableKeysMod = ["first_name" , ...this.checkSelected];
    },

    makeTableAndAccordion() {
      this.makeAccordion();
      this.makeUserTable();
    },

    reload() {
      this.showTable = false;
      this.showTable = true;
    },

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
    orderMembersByKeyValue(membersArr, key, dataType = "number") {
      if (dataType === "number") {
        return membersArr.slice().sort((a, b) => parseFloat(a[key]) - parseFloat(b[key]));
      } else {
        return membersArr.slice().sort((a, b) => (a[key] > b[key]));
      }
    },

    areEquals(array1, array2) {
      let areEquals = true;
      if (array1.length !== array2.length) {
        areEquals = false;
      } else {
        for(let index = 0; index < array1.length; index++) {
          if (JSON.stringify(array1[index]) !== JSON.stringify(array2[index])) {
            areEquals = false;
            break;
          }
        }
      }
      return areEquals;
    },

    sortByColumn(event) {
      let textcol = event.target.innerHTML;
      let item = this.checkData.find(item => item.text === textcol)
      let sortMembers = this.orderMembersByKeyValue(this.actualMembers, item.value, item.type);
      let reverseSortMembers = sortMembers.slice().reverse();

      if (this.areEquals(this.membersList, sortMembers)) { //Is already ordered from lowest to highest. We have to order from higuest to lowest
        this.membersList = reverseSortMembers;
      } else if (this.areEquals(this.membersList, reverseSortMembers)) { //Is already ordered from highest to lowest. We have to get back to default order
        this.membersList = this.actualMembers;
      } else { //It is not order in any way, we order from lowest to higuest
        this.membersList = sortMembers;
      }
    },

    noResultsOnTable() {
      this.membersList.length ? this.noResults = false : this.noResults = true;
    },


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
      this.tableKeysMod = this.MAIN_TABLE_KEYS;
      this.MEMBERS = data.results[0].members;
      this.membersList = this.actualMembers = this.MEMBERS;
      this.getStates(this.MEMBERS);
      this.isLoaded = true;
      this.showTable = true;
    },
  },

  computed: {
    changeButtonText() {
      return this.checkSelected.length < 1 ? "Select data to activate" : "Create Table";
    }
  },

  beforeMount() {
    window.location.href.includes("senate") ? this.getData("senate") : this.getData("house");
  },

  beforeUpdate() {
    this.noResultsOnTable();
  },
  created() {
    this.tableTitlesMod = this.MAIN_TABLE_TITLES;
  }

});
