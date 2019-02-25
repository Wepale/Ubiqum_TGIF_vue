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
    engagedTableKeys: ["first_name", "middle_name", "last_name", "missed_votes", "missed_votes_pct"],
    loyalTableTitles: ["Name", "No. Party Votes", "% Party Votes"],
    loyalTableKeys: ["first_name", "middle_name", "last_name", "total_votes", "votes_with_party_pct"],
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

    numberOfMembersByParty(membersArr, party) {
      return this.getMembersOfParty(membersArr, party).length;
    },

    votingPartyAverage(membersArr, party) {
      for (member of membersArr) {
        let votesResults = membersArr.map(member => member.votes_with_party_pct) //return an array whit the value of a key of all the objects
        if (votesResults.length) {
          return (votesResults.reduce((vote1, vote2) => vote1 + vote2) / votesResults.length).toFixed(2);
        }
      }
    },

    orderMembersByKeyValue(membersArr, key) {
      return membersArr.sort((a, b) => (a[key] > b[key]) ? 1 : -1);
    },

    topOrLowestMembers(membersArr, percent, firstOrLast, key) {
      let membersToGet = 0;
      if (membersArr.length < 10) {
        membersToGet = 1;
      } else {
        membersToGet = Math.round(membersArr.length * (percent / 100));
      }
      if (firstOrLast === "last") {
        membersArr.reverse()
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

    changeGridRowOnLongest(element1, element2, rowEnd) {
      const parentDiv1 = element1.parentNode;
      let parentDiv2 = element2.parentNode;
      if (element1.offsetHeight === element2.offsetHeight) {
        parentDiv1.style.gridRow = `${rowEnd - 1}/${rowEnd};`
        parentDiv2.style.gridRow = `${rowEnd - 1}/${rowEnd};`
      } else if (element1.offsetHeight > element2.offsetHeight) {
        parentDiv2.style.gridRow = `${rowEnd - 1}/${rowEnd}`;
        rowEnd++;
        parentDiv1.style.gridRow = `${rowEnd - 2}/${rowEnd}`;
      } else {
        parentDiv1.style.gridRow = `${rowEnd - 1}/${rowEnd}`;
        rowEnd++;
        parentDiv2.style.gridRow = `${rowEnd - 2}/${rowEnd}`;
      }

      while (parentDiv2.nextElementSibling != null) {
        rowEnd++;
        parentDiv2.nextElementSibling.style.gridRow = `${rowEnd-1}/${rowEnd}`;
        parentDiv2 = parentDiv2.nextElementSibling;
      }
    },

    setStatisticsValues(membersArr, statisticsByPartyArr) {
      let party = null;
      for (element of statisticsByPartyArr) {
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
        if (membersArrayByParty.length) {
          element.numbersOfReps = membersArrayByParty.length
        } else {
          element.numbersOfReps = 0;
        }

        for (member of membersArrayByParty) {
          if (!("votes_with_party_pct" in member)) {
            membersArrayByParty.splice(membersArrayByParty.indexOf(member), 1);
          }
        }

        element.averageVoteParty = this.votingPartyAverage(membersArrayByParty, party) + "%";
        element.leastMissedVotesMembers = this.topOrLowestMembers(this.orderMembersByKeyValue(membersArrayByParty, "missed_votes_pct"), 10, "first", "missed_votes_pct");
        element.mostMissedVotesMembers = this.topOrLowestMembers(this.orderMembersByKeyValue(membersArrayByParty, "missed_votes_pct"), 10, "last", "missed_votes_pct");
        element.leastLoyalMembers = this.topOrLowestMembers(this.orderMembersByKeyValue(membersArrayByParty, "votes_with_party_pct"), 10, "first", "votes_with_party_pct");
        element.mostLoyalMembers = this.topOrLowestMembers(this.orderMembersByKeyValue(membersArrayByParty, "votes_with_party_pct"), 10, "last", "votes_with_party_pct");

        if (element.numbersOfReps === 0) {
          element.averageVoteParty = 0 + "%";
        }
      }
    },

    joinName(member) {
      const nameData = Object.keys(member).filter(data => data === "first_name" || data === "middle_name" || data === "last_name");
      let completeName = "";
      for (name of nameData) {
        if (member[name]) {
          completeName = `${completeName} ${member[name]}`
        }
      }
      return completeName;
    },

    modKeysArr(keysArr) {
      return keysArr.filter(data => data !== "middle_name" && data !== "last_name");
    },

    checkNullValue(value) {
      if (value !== null) {
        return value;
      } else {
        return "---";
      }
    },

    changeGridRowOnLongest(element1, element2, rowEnd) {
      const parentDiv1 = element1.parentNode.parentNode.parentNode;
      let parentDiv2 = element2.parentNode.parentNode.parentNode;
      if (element1.offsetHeight === element2.offsetHeight) {
        parentDiv1.style.gridRow = `${rowEnd - 1}/${rowEnd};`
        parentDiv2.style.gridRow = `${rowEnd - 1}/${rowEnd};`
      } else if (element1.offsetHeight > element2.offsetHeight) {
        parentDiv2.style.gridRow = `${rowEnd - 1}/${rowEnd}`;
        rowEnd++;
        parentDiv1.style.gridRow = `${rowEnd - 2}/${rowEnd}`;
      } else {
        parentDiv1.style.gridRow = `${rowEnd - 1}/${rowEnd}`;
        rowEnd++;
        parentDiv2.style.gridRow = `${rowEnd - 2}/${rowEnd}`;
      }

      while (parentDiv2.nextElementSibling != null) {
        rowEnd++;
        parentDiv2.nextElementSibling.style.gridRow = `${rowEnd-1}/${rowEnd}`;
        parentDiv2 = parentDiv2.nextElementSibling;
      }
    },

    async getData(jsonURL, apiKey) {
      //await the response of the fetch call
      let response = await fetch(jsonURL, {
        method: "GET",
        dataType: 'json',
        headers: {
          "X-API-Key": apiKey
        }
      });
      //proceed once the first promise is resolved.
      let data = await response.json()
      //proceed only when the second promise is resolved
      return data;
    }
  },

  beforeCreate(){
    this.showTable = false;
    this.isLoaded = false;
  },

  beforeMount() {
    this.loyalTableKeysMod = this.modKeysArr(this.loyalTableKeys);
    this.engagedTableKeysMod = this.modKeysArr(this.engagedTableKeys);

    if (window.location.href.includes("senate")) {
      this.getData("https://api.propublica.org/congress/v1/115/senate/members.json", "kBfQKxtZzIQKC80wlPEvDUhKAFxVlBU63svN3B8O").then((data) => {
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
        let myDivsTables = Array.from(document.getElementsByClassName("loader"));
        for (myDiv of myDivsTables) {
          myDiv.classList.remove("loader");
        }
      });
    } else {
      this.getData("https://api.propublica.org/congress/v1/115/house/members.json", "kBfQKxtZzIQKC80wlPEvDUhKAFxVlBU63svN3B8O").then((data) => {
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
        let myDivsTables = Array.from(document.getElementsByClassName("loader"));
        for (myDiv of myDivsTables) {
          myDiv.classList.remove("loader");
        }
      });
    }

  },
  updated() {
    this.changeGridRowOnLongest(document.getElementById("table2"), document.getElementById("table3"), 6)
  }

});
