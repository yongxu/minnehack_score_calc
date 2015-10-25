var fs = require("fs");

var data = fs.readFileSync('data.csv');

var judges = [];

var teams = data.toString().split(/;\s/).map(function(line){
  var list = line.split(/,\s?/);
  return {
    team: list[1],
    overall: parseFloat(list[3]),
    creativity: parseFloat(list[3]),
    utility: parseFloat(list[4]),
    prompt: parseFloat(list[5]),
    presentation: parseFloat(list[6]),
    judge: parseInt(list[7]),
    team_id: parseInt(list[8])
  }
}).filter(function(res){
  return res.judge >= 0;
});

teams.map(function(res){

  if(judges[res.judge] == undefined){
    judges[res.judge] = {id:res.judge,scores:[]};
  }
  judges[res.judge].scores.push([res.overall,res.creativity,res.utility,res.prompt,res.presentation]);

});

function sum(l,r){
  return l+r;
}

function norm(list){
  var sum = 0;
  list.map(function(n){
    sum+=n*n;
  });
  return Math.pow(sum,1 / list.length);
}

judges = judges.map(function(j){
  var num = j.scores.length;
  return {
    id: j.id,
    average:{
      overall: (j.scores.map(function(s){return s[0]}).reduce(sum,0) / num),
      creativity: (j.scores.map(function(s){return s[1]}).reduce(sum,0) / num),
      utility: (j.scores.map(function(s){return s[2]}).reduce(sum,0) / num),
      prompt: (j.scores.map(function(s){return s[3]}).reduce(sum,0) / num),
      presentation: (j.scores.map(function(s){return s[4]}).reduce(sum,0) / num)
    },
    norm:{
        overall: norm(j.scores.map(function(s){return s[0]})),
        creativity: norm(j.scores.map(function(s){return s[1]})),
        utility: norm(j.scores.map(function(s){return s[2]})),
        prompt: norm(j.scores.map(function(s){return s[3]})),
        presentation: norm(j.scores.map(function(s){return s[4]}))
    }
  }
});

judges_avg = {
  overall: (judges.map(function(j){return j.average.overall}).reduce(sum,0) / judges.length),
  creativity: (judges.map(function(j){return j.average.creativity}).reduce(sum,0) / judges.length),
  utility: (judges.map(function(j){return j.average.utility}).reduce(sum,0) / judges.length),
  prompt: (judges.map(function(j){return j.average.prompt}).reduce(sum,0) / judges.length),
  presentation: (judges.map(function(j){return j.average.presentation}).reduce(sum,0) / judges.length),
};

normalized_judges = judges.map(function(j){
  var overall_d = j.average.overall - judges_avg.overall;
  var creativity_d = j.average.creativity - judges_avg.creativity;
  var utility_d = j.average.utility - judges_avg.utility;
  var prompt_d = j.average.prompt - judges_avg.prompt;
  var presentation_d = j.average.presentation - judges_avg.presentation;
  return {
    id: j.id,
    overall: (overall_d / j.norm.overall+1),
    creativity: (creativity_d / j.norm.creativity+1)*0.25,
    utility: (utility_d / j.norm.utility+1)*0.25,
    prompt: (prompt_d / j.norm.prompt+1)*0.25,
    presentation: (presentation_d / j.norm.presentation+1)*0.25,
  };
});

function normalizeScore(team){
  team["overall_normalized"] = team.overall*normalized_judges[team.judge].overall;
  team["overall_normalized_weighted"] = team.creativity*normalized_judges[team.judge].creativity
          + team.utility*normalized_judges[team.judge].utility
          + team.prompt*normalized_judges[team.judge].prompt
          + team.presentation*normalized_judges[team.judge].presentation;
  return team;
}
var team_results = [];
teams.map(function(t){
//adds up the team's overall_normalized_weighted
// then figure out who won
// being up for too long
//code probably doesn't work great
//cant think much, need someone else to take over

});

console.log(normalized_judges);
