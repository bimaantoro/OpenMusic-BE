class UsersHandler {
  constructor(usersService, validator) {
    this._usersService = usersService;
    this._validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
  }

  async postUserHandler(request, h) {
    const userPayload = this._validator.validateUserPayload(request.payload);

    const userId = await this._usersService.addUser(userPayload);

    return h.response({
      status: 'success',
      message: 'The user was added successfully.',
      data: {
        userId,
      },
    }).code(201);
  }
}

module.exports = UsersHandler;
