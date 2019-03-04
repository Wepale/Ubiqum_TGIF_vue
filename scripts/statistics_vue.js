const myVue = new Vue({
  el: "#myVueElement",
  data: {
    partys: [{
        idParty: "Democrats",
        numbersOfReps: null,
        averageVoteParty: null,
        leastMissedVotesMembers: null,
        mostMissedVotesMembers: null,
        leastLoyalMembers: null,
        mostLoyalMembers: null
      },
      {
        idParty: "Republicants",
        numbersOfReps: null,
        averageVoteParty: null,
        leastMissedVotesMembers: null,
        mostMissedVotesMembers: null,
        leastLoyalMembers: null,
        mostLoyalMembers: null
      },
      {
        idParty: "Independents",
        numbersOfReps: null,
        averageVoteParty: null,
        leastMissedVotesMembers: null,
        mostMissedVotesMembers: null,
        leastLoyalMembers: null,
        mostLoyalMembers: null
      },
      {
        idParty: "All Partys",
        numbersOfReps: null,
        averageVoteParty: null,
        leastMissedVotesMembers: null,
        mostMissedVotesMembers: null,
        leastLoyalMembers: null,
        mostLoyalMembers: null
      }
    ],
    showTable: false,
    isLoaded: false,
    membersConst: [],
    loyalTableKeysMod: [],
    engagedTableKeysMod: [],

    atGlanceTableTitles: ["Party", "No. of Reps", "% Voted w/ Party"],
    atGlanceTableKeys: ["idParty", "numbersOfReps", "averageVoteParty"],
    engagedTableTitles: ["Name", "No. Missed Votes", "% Missed"],
    engagedTableKeys: ["first_name", "missed_votes", "missed_votes_pct"],
    loyalTableTitles: ["Name", "No. Party Votes", "% Party Votes"],
    loyalTableKeys: ["first_name", "total_votes", "votes_with_party_pct"],
    //Last object in the array
    allPartysStatistics: null,
    // Top members whit most missed votes
    topMembersMissedVotes: [],
    // Top members whit lest missed votes
    topMembersVotes: [],
    // Top members most loyal
    topMembersMostLoyal: [],
    // Top members least Loyal
    topMembersLessLoyal: [],
  },
  methods: {
    /*
    * Get the members of a determinate party
    *
    * @param {array} membersArr the members array
    * @param {string} party the party for which we want to filter the members
    * @return {array} all members of a party
    */

    getMembersOfParty(membersArr, party) {
      switch (party) {
        case "D":
          return membersArr.filter(member => member.party === "D");

        case "R":
          return membersArr.filter(member => member.party === "R");

        case "I":
          return membersArr.filter(member => member.party === "I");

        default:
          return membersArr;
      }
    },

    /*
    * Get the number of members
    *
    * @param {array} membersArr the members array
    * @param {string} party the party for which we want to filter the members
    * @return {number} the number of members
    */

    numberOfMembersByParty(membersArr, party) {
      return this.getMembersOfParty(membersArr, party).length;
    },

    /*
    * Get average vote party
    *
    * @param {membersArr} membersArr the members array
    * @return {number} the average vote party
    */

    votingPartyAverage(membersArr) {
      return (membersArr.map(member => member.votes_with_party_pct) //return an array whit the value of a key of all the objects
        .reduce((vote1, vote2) => vote1 + vote2, 0) / membersArr.length).toFixed(2); //Sum all the values of the previous array
    },

    /*
    * Order members by key value
    * @param {array} membersArr the members array
    * @param {string} key the key for which we want to order the members
    * @return {array} an array whit the members order by key value
    */

    orderMembersByKeyValue(membersArr, key) {
      return membersArr.sort((a, b) => (a[key] > b[key]) ? 1 : -1);
    },

    /*
    * Get the top or bottom members by a determinate key value
    * @param {array} membersArr the members array
    * @param {number} percent the percent or members we want to get
    * @param {string} firstOrLast "first" if we want to get the top members, "last" if we want to get the bottom members
    * @param {string} key the key for which we want the top or bottom members
    * @return {array} and the array wthat contains the top or bottom members
    */

    topOrLowestMembers(membersArr, percent, firstOrLast, key) {
      let membersToGet = 0;
      membersArr.length < 10 ? membersToGet = 1 : membersToGet = Math.round(membersArr.length * (percent / 100));

      if (firstOrLast === "last") {
        membersArr = membersArr.slice().reverse()
      }

      for (let i = membersToGet; i < membersArr.length; i++) {
        if (membersArr[i][key] === membersArr[i - 1][key]) {
          membersToGet++;
        } else {
          break;
        }
      }
      return membersArr.slice(0, membersToGet);
    },

    /*
    * Initialize all the values of the objects that contains the statistics
    *
    * @param {array} membersArr the members array
    * @param {array} statisticsByPartyArr our array whit the objects than contains all statistics values
    */
    setStatisticsValues(membersArr, statisticsByPartyArr) {
      let party = null;
      statisticsByPartyArr.forEach(element => {
        switch (element.idParty) {
          case "Democrats":
            party = "D";
            break;
          case "Republicants":
            party = "R";
            break;
          case "Independents":
            party = "I";
            break;

          default:
            party = "All Partys";
        }
        let membersArrayByParty = this.getMembersOfParty(membersArr, party)
        membersArrayByParty.length ? element.numbersOfReps = membersArrayByParty.length : element.numbersOfReps = 0

        membersArrayByParty = membersArrayByParty.filter(member => "votes_with_party_pct" in member);

        element.averageVoteParty = this.votingPartyAverage(membersArrayByParty, party) + "%";
        element.leastMissedVotesMembers = this.topOrLowestMembers(this.orderMembersByKeyValue(membersArrayByParty, "missed_votes_pct"), 10, "first", "missed_votes_pct");
        element.mostMissedVotesMembers = this.topOrLowestMembers(this.orderMembersByKeyValue(membersArrayByParty, "missed_votes_pct"), 10, "last", "missed_votes_pct");
        element.leastLoyalMembers = this.topOrLowestMembers(this.orderMembersByKeyValue(membersArrayByParty, "votes_with_party_pct"), 10, "first", "votes_with_party_pct");
        element.mostLoyalMembers = this.topOrLowestMembers(this.orderMembersByKeyValue(membersArrayByParty, "votes_with_party_pct"), 10, "last", "votes_with_party_pct");

        if (element.numbersOfReps === 0) {
          element.averageVoteParty = 0 + "%";
        }
      })
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
      return value === null || value === undefined ? "---" : value;
    },

    /*
    * Change grid row value on tables for proper display. If one table is longer than the other one, the div that contains that table
    * will be will be positioned in the next row
    *
    *
    *
    */
    changeGridRowOnLongestTable(table1, table2, rowEnd) {
      const parentDiv1 = table1.parentNode.parentNode.parentNode; //Acces main div
      let parentDiv2 = table2.parentNode.parentNode.parentNode; //Acces main div
      if (table1.offsetHeight === table2.offsetHeight) {  //Same height
        parentDiv1.style.gridRow = `${rowEnd - 1}/${rowEnd};`
        parentDiv2.style.gridRow = `${rowEnd - 1}/${rowEnd};`
      } else if (table1.offsetHeight > table2.offsetHeight) { //Table 1 is higher than table 2
        parentDiv2.style.gridRow = `${rowEnd - 1}/${rowEnd}`;
        rowEnd++;
        parentDiv1.style.gridRow = `${rowEnd - 2}/${rowEnd}`;
      } else {                                                //Table 2 is higher than table 1
        parentDiv1.style.gridRow = `${rowEnd - 1}/${rowEnd}`;
        rowEnd++;
        parentDiv2.style.gridRow = `${rowEnd - 2}/${rowEnd}`;
      }

      //Change row on footer if necessary
      if (!(table1.offsetHeight === table2.offsetHeight)) {
        rowEnd++;
        Array.from(document.getElementsByTagName("footer"))[0].style.gridRow = `${rowEnd-1}/${rowEnd}`;
      }
    },

    /*
    * Fecth call using an asyn function. Initialize/change the values of all the required variables when the fetch call is completed
    *
    * @param {string} chamber specifies the camera from which we want to obtain the data. ONLY POSSIBLES VALUES: "senate" or "house"
    */

    async getData(chamber) {
      let data;
      try {
        //await the response of the fetch call
        let response = await fetch(`https://api.propublica.org/congress/v1/115/${chamber}/members.json`, {
          method: "GET",
          dataType: 'json',
          headers: {
            "X-API-Key": "kBfQKxtZzIQKC80wlPEvDUhKAFxVlBU63svN3B8O"
          }
        });
        //proceed once the first promise is resolved.
        data = await response.json();
      } catch (error) {
          window.console.log("Error", error)
          alert("Sorry, data not available. Try again later");
          return;
      }
      //proceed only when the second promise is resolved
      this.membersConst = data.results[0].members;
      this.setStatisticsValues(this.membersConst, this.partys);
      //Last object in the array
      this.allPartysStatistics = this.partys[this.partys.length - 1];
      // Top members whit most missed votes
      this.topMembersMissedVotes = this.allPartysStatistics.mostMissedVotesMembers;
      // Top members whit lest missed votes
      this.topMembersVotes = this.allPartysStatistics.leastMissedVotesMembers;
      // Top members most loyal
      this.topMembersMostLoyal = this.allPartysStatistics.mostLoyalMembers;
      // Top members least Loyal
      this.topMembersLessLoyal = this.allPartysStatistics.leastLoyalMembers;
      this.showTable = true;
      this.isLoaded = true;
      document.getElementsByClassName("loader").forEach(div => div.classList.remove("loader")); //Remove class loader from each div
    }
  },

  beforeMount() {
    window.location.href.includes("senate") ? this.getData("senate") : this.getData("house");
  },

  updated() {
    this.changeGridRowOnLongestTable(document.getElementById("table2"), document.getElementById("table3"), 6)
  }

});
