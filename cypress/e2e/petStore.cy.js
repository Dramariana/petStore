describe("Test petStore", () => {
  let userName;
  let newUserName;

  const faker = require("faker");
  let randomTwoDigitNumber = faker.datatype.number({ min: 10, max: 99 });
  const randomName = faker.name.firstName();
  const randomLastName = faker.name.lastName();
  let randomUserName = `${randomName}_${randomLastName}_${randomTwoDigitNumber}`;
  let randomEmail = `${randomName}_${randomLastName}@example.com`;
  const randomPassword = faker.internet.password();
  const randomPhone = faker.phone.phoneNumberFormat();

  it("Crear un usuario", () => {
    const addUserUrl = "https://petstore.swagger.io/v2/user";

    const newUserData = {
      username: randomUserName,
      firstName: randomName,
      lastName: randomLastName,
      email: randomEmail,
      password: randomPassword,
      phone: randomPhone,
      userStatus: 0,
    };

    cy.request("POST", addUserUrl, newUserData).then((response) => {
      expect(response.status).to.eq(200);

      userName = newUserData.username;

      cy.log(`User: ${newUserData.username}`);
      cy.log(`Name: ${newUserData.firstName}`);
      cy.log(`Last name: ${newUserData.lastName}`);
      cy.log(`Email: ${newUserData.email}`);
      cy.log(`Password: ${newUserData.password}`);
      cy.log(`Phone: ${newUserData.phone}`);
    });
  });

  it("Buscar usuario creado", () => {
    const getUserByNameUrl = `https://petstore.swagger.io/v2/user/${userName}`;

    cy.request("GET", getUserByNameUrl).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.username).to.eq(randomUserName);
      expect(response.body.firstName).to.eq(randomName);
      expect(response.body.lastName).to.eq(randomLastName);
      expect(response.body.email).to.eq(randomEmail);
      expect(response.body.password).to.eq(randomPassword);
      expect(response.body.phone).to.eq(randomPhone);
    });
  });

  it("Actualizar el nombre y correo", () => {
    const updateUserUrl = `https://petstore.swagger.io/v2/user/${userName}`;
    randomTwoDigitNumber = faker.datatype.number({ min: 10, max: 99 });
    randomUserName = `${randomName}${randomLastName}__${randomTwoDigitNumber}`;
    randomEmail = `${randomName}_${randomLastName}_${randomTwoDigitNumber}@example.com`;
    cy.log(randomUserName);
    cy.log(randomEmail);
    /* Se envían nuevamente todos los datos, ya que la API no admite operaciones de parcheo (PATCH).
    Si solo se actualiza el username y email, solo esos campos se deben enviar con sus nuevos valores.*/
    const updatedUserData = {
      username: randomUserName,
      firstName: randomName,
      lastName: randomLastName,
      email: randomEmail,
      password: randomPassword,
      phone: randomPhone,
      userStatus: 0,
    };

    cy.request("PUT", updateUserUrl, updatedUserData).then((response) => {
      expect(response.status).to.eq(200);
      newUserName = updatedUserData.username;
    });
  });

  it("Consultar usuario actualizado", () => {
    const getUserByNewNameUrl = `https://petstore.swagger.io/v2/user/${newUserName}`;

    cy.request("GET", getUserByNewNameUrl).then((response) => {
      expect(response.status).to.eq(200);

      expect(response.body.username).to.eq(randomUserName);
      expect(response.body.firstName).to.eq(randomName);
      expect(response.body.lastName).to.eq(randomLastName);
      expect(response.body.email).to.eq(randomEmail);
      expect(response.body.password).to.eq(randomPassword);
      expect(response.body.phone).to.eq(randomPhone);
    });
  });

  it("Eliminar usuario", () => {
    const deleteUserUrl = `https://petstore.swagger.io/v2/user/${newUserName}`;

    cy.request("DELETE", deleteUserUrl).then((response) => {
      expect(response.status).to.eq(200);
      cy.log(`Usuario eliminado exitosamente: ${newUserName}`);
    });
  });

  it("Consultar usuario Eliminado", () => {
    const getUserDelete = `https://petstore.swagger.io/v2/user/${newUserName}`;

    cy.request({
      method: "GET",
      url: getUserDelete,
      failOnStatusCode: false,
    }).then((response) => {
      if (response.status === 404) {
        cy.log("El usuario fue eliminado correctamente.");
      } else {
        cy.log(`La solicitud devolvió un código de estado ${response.status}`);
      }
    });
  });
});
