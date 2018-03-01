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
      admin: true,
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTJ2RSWYrZVm_hl2CXi_rEcC7AzYZORmQmyWDvPNjCc0DVv2Tj",
      pseudo: "ADMIN WTF"
    };

    const adminDTO = await userService.createUser(admin);
    console.log("User creation....")
    console.log("... " + adminDTO.firstname + " " + adminDTO.lastname + "...");
    const testUser1 = {
      login: "jax.teller@davidson.fr",
      firstname: "Jax",
      lastname: "Teller",
      password: "12345678",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f4/User_Avatar_2.png",
      pseudo: "Jax"
    };
    const testUser1DTO = await userService.createUser(testUser1);
    console.log("... " + testUser1DTO.firstname + " " + testUser1DTO.lastname + "...");

    const testUser2 = {
      login: "marcus.alvarez@davidson.fr",
      firstname: "Marcus",
      lastname: "Alvarez",
      password: "mexicoOo",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f4/User_Avatar_2.png",
      pseudo: "Jax"
    };
    const testUser2DTO = await userService.createUser(testUser2);
    console.log("... " + testUser2DTO.firstname + " " + testUser2DTO.lastname + "...");

    const testUser3 = {
      login: "jean.martin@davidson.fr",
      firstname: "Jean",
      lastname: "Martin",
      password: "test1234",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f4/User_Avatar_2.png",
      pseudo: "JEAN_M"
    };
    const testUser3DTO = await userService.createUser(testUser3);
    console.log("... " + testUser3DTO.firstname + " " + testUser3DTO.lastname + "...");

    const testUser4 = {
      login: "pierre.traore@davidson.fr",
      firstname: "Pierre",
      lastname: "Traoré",
      password: "test1234",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f4/User_Avatar_2.png",
      pseudo: "Pierrot"
    };
    const testUser4DTO = await userService.createUser(testUser4);
    console.log("... " + testUser4DTO.firstname + " " + testUser4DTO.lastname + "...");

    const testUser5 = {
      login: "christophe.blanc@davidson.fr",
      firstname: "Christophe",
      lastname: "Blanc",
      password: "test1234",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f4/User_Avatar_2.png",
      pseudo: "Chris"
    };
    const testUser5DTO = await userService.createUser(testUser5);
    console.log("... " + testUser5DTO.firstname + " " + testUser5DTO.lastname + "...");

    const testUser6 = {
      login: "marcel.sembat@davidson.fr",
      firstname: "Marcel",
      lastname: "Sembat",
      password: "test1234",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f4/User_Avatar_2.png",
      pseudo: "L9"
    };
    const testUser6DTO = await userService.createUser(testUser6);
    console.log("... " + testUser6DTO.firstname + " " + testUser6DTO.lastname + "...");

    console.log("Team creation....")
    const team1 = {
      leader: testUser1DTO.id,
      name: "Football Club Tech",
      code: "FCT",
      imageUrl: "https://cdn.pixabay.com/photo/2014/04/03/00/43/logo-309223_960_720.png"
    };

    const t1 = await teamService.createTeam(team1);
    console.log("... " + t1.name + " leaded by " + testUser1DTO.lastname + "...");
    await teamService.addUserInTeam(testUser1DTO.id, t1.id);
    await teamService.addUserInTeam(testUser3DTO.id, t1.id);
    await teamService.addUserInTeam(testUser4DTO.id, t1.id);

    const team2 = {
      leader: testUser2DTO.id,
      name: "Olympique de la Com",
      code: "ODC",
      imageUrl: "https://cdn.pixabay.com/photo/2014/04/03/00/43/tiger-309218_960_720.png"
    };
    const t2 = await teamService.createTeam(team2);
    console.log("... " + t2.name + " leaded by " + testUser2DTO.lastname + "...");
    await teamService.addUserInTeam(testUser2DTO.id, t2.id);
    await teamService.addUserInTeam(testUser5DTO.id, t2.id);
    
    const team3 = {
      leader: testUser6DTO.id,
      name: "Fat and Curious",
      code: "FAC",
      imageUrl: "https://cdn.pixabay.com/photo/2014/04/03/00/43/lion-309219_960_720.png"
    };
    const t3 = await teamService.createTeam(team3);
    console.log("... " + t3.name + " leaded by " + testUser6DTO.lastname + "...");
    await teamService.addUserInTeam(testUser6DTO.id, t3.id);

    db.connection.close();
  } catch (e) {
    console.log("It seems that the setup was already made.");
    db.connection.close();
  }


})();
