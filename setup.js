(async function() {
  const db = require('./api/dao/databaseAccess');
  const config = require('./config');

  const express = require('express');
  const app = express();

  app.set('salt', config.salt);


  const userService = require('./api/services/userService')(app);
  const teamService = require('./api/services/teamService')(app);
  try {

    console.log("User creation....")
    const admin = {
      login: "admin@gmail.com",
      firstname: "Ad",
      lastname: "Min",
      password: "#12341234",
      admin: true
    };

    const adminDTO = await userService.createUser(admin);
    console.log("User creation....")
    console.log("... " + adminDTO.firstname + " " + adminDTO.lastname + "...");
    const testUser1 = {
      login: "jax.teller@davidson.fr",
      firstname: "Jax",
      lastname: "Teller",
      password: "12345678"
    };



    const testUser1DTO = await userService.createUser(testUser1);
    console.log("... " + testUser1DTO.firstname + " " + testUser1DTO.lastname + "...");
    const testUser2 = {
      login: "marcus.alvarez@davidson.fr",
      firstname: "Marcus",
      lastname: "Alvarez",
      password: "mexicoOo"
    };

    const testUser2DTO = await userService.createUser(testUser2);
    console.log("... " + testUser2DTO.firstname + " " + testUser2DTO.lastname + "...");
    console.log("Team creation....")
    const team1 = {
      leader: testUser1DTO.id,
      name: "SAMCRO"
    };
    const t1 = await teamService.createTeam(team1);
    console.log("... " + t1.name + " leaded by " + testUser1DTO.lastname + "...");
    await teamService.addUserInTeam(testUser1DTO.id, t1.id);

    const team2 = {
      leader: testUser2DTO.id,
      name: "Mayans"
    };
    const t2 = await teamService.createTeam(team2);
    console.log("... " + t2.name + " leaded by " + testUser2DTO.lastname + "...");
    await teamService.addUserInTeam(testUser2DTO.id, t2.id);

    db.connection.close();
  } catch (e) {
    console.log("It seems that the setup was already made.");
    db.connection.close();
  }


})();
